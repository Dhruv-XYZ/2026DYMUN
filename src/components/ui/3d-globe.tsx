import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, useTexture } from "@react-three/drei";
import type { ReactNode } from "react";
import { Tooltip } from "@/components/ui/tooltip-card";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/**
 * Aceternity "3D Globe": an interactive globe built on three.js.
 *
 * Changed for DYMUN:
 * - The photo of the Earth is gone. The land and sea are painted from a black-and-white
 *   mask in two palette colours (gold land on an ink sea), and both textures are
 *   served from /public/textures instead of a third-party CDN.
 * - Arcs can be drawn between points. The original had markers only.
 * - Markers are a simple pulsing dot instead of an avatar photo.
 * - The globe itself turns, so the lighting stays put, and it can start with a chosen
 *   place facing the viewer.
 * - `active={false}` stops rendering, for when it is off screen.
 */

// ============================================================================
// Types
// ============================================================================

export interface GlobePoint {
  lat: number;
  lng: number;
}

export interface GlobeMarker extends GlobePoint {
  label?: string;
  /** Radius of the dot, as a fraction of the globe radius. */
  size?: number;
  /** Called when the dot or its label is clicked (a drag does not count). */
  onSelect?: () => void;
  /** Colour of this dot, in place of the globe's marker colour. */
  color?: string;
  /** A card shown while the dot is hovered or focused. Also what screen readers announce the dot as. */
  info?: ReactNode;
  /** Name for the dot when it has `info` but no visible label. */
  name?: string;
}

export interface GlobeArc {
  from: GlobePoint;
  to: GlobePoint;
}

export interface Globe3DConfig {
  /** Globe radius */
  radius?: number;
  /** Colour of the land */
  landColor?: string;
  /** Colour of the sea */
  oceanColor?: string;
  /** Black-and-white map of the Earth in which the sea is white */
  maskUrl?: string;
  /** URL to the bump/elevation map for terrain */
  bumpMapUrl?: string;
  /** Whether to show atmosphere glow */
  showAtmosphere?: boolean;
  /** Atmosphere color */
  atmosphereColor?: string;
  /** Atmosphere intensity */
  atmosphereIntensity?: number;
  /** Atmosphere blur/softness (higher = more diffuse, default 3) */
  atmosphereBlur?: number;
  /** Terrain bump scale (0 = flat, higher = more pronounced) */
  bumpScale?: number;
  /** How fast the globe turns by itself when nobody is touching it (0 = still) */
  autoRotateSpeed?: number;
  /** Let the visitor drag the globe round. Vertical swipes still scroll the page. */
  interactive?: boolean;
  /** The place turned to face the viewer at the start */
  focus?: GlobePoint | null;
  /** Colour of the markers */
  markerColor?: string;
  /** Colour of the arcs */
  arcColor?: string;
  /** How high arcs rise above the surface */
  arcLift?: number;
  /** Show wireframe overlay */
  showWireframe?: boolean;
  /** Wireframe color */
  wireframeColor?: string;
  /** Ambient light intensity */
  ambientIntensity?: number;
  /** Point light intensity */
  pointLightIntensity?: number;
  /** Colour of the fill light from behind */
  rimLightColor?: string;
  /** Background color (null for transparent) */
  backgroundColor?: string | null;
}

interface Globe3DProps {
  /** Array of markers to display on the globe */
  markers?: GlobeMarker[];
  /** Arcs drawn between pairs of points */
  arcs?: GlobeArc[];
  /** Globe configuration */
  config?: Globe3DConfig;
  /** Additional CSS classes */
  className?: string;
  /** false pauses rendering */
  active?: boolean;
  /** What the globe is, for screen readers (and search engines reading the page). */
  ariaLabel?: string;
}

// ============================================================================
// Constants - self-hosted textures
// ============================================================================

const DEFAULT_MASK_TEXTURE = "/textures/earth-water.jpg";
const DEFAULT_BUMP_TEXTURE = "/textures/earth-topology.jpg";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert latitude/longitude to 3D cartesian coordinates
 */
function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/**
 * Turn the black-and-white sea mask into a two-colour map of the Earth.
 */
function paintEarth(
  mask: THREE.Texture,
  landColor: string,
  oceanColor: string,
): THREE.Texture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return mask;

  ctx.drawImage(mask.image as CanvasImageSource, 0, 0, width, height);
  const pixels = ctx.getImageData(0, 0, width, height);
  const data = pixels.data;
  const [landR, landG, landB] = hexToRgb(landColor);
  const [seaR, seaG, seaB] = hexToRgb(oceanColor);

  for (let i = 0; i < data.length; i += 4) {
    const sea = data[i] / 255; // white = sea, black = land
    data[i] = landR + (seaR - landR) * sea;
    data[i + 1] = landG + (seaG - landG) * sea;
    data[i + 2] = landB + (seaB - landB) * sea;
    data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Points along the great circle between two places, lifted off the surface in the
 * middle so the arc reads as a flight path.
 */
function arcPoints(
  arc: GlobeArc,
  radius: number,
  lift: number,
  segments = 56,
): THREE.Vector3[] {
  const start = latLngToVector3(arc.from.lat, arc.from.lng, 1);
  const end = latLngToVector3(arc.to.lat, arc.to.lng, 1);
  const angle = start.angleTo(end);
  const sinAngle = Math.sin(angle) || 1;

  return Array.from({ length: segments + 1 }, (_, i) => {
    const t = i / segments;
    const a = Math.sin((1 - t) * angle) / sinAngle;
    const b = Math.sin(t * angle) / sinAngle;
    const height = 1.004 + lift * angle * Math.sin(Math.PI * t);
    return new THREE.Vector3()
      .addScaledVector(start, a)
      .addScaledVector(end, b)
      .normalize()
      .multiplyScalar(radius * height);
  });
}

// ============================================================================
// Marker Component (static - rotation handled by parent group)
// ============================================================================

function Marker({
  marker,
  radius,
  color: defaultColor,
  onHoverChange,
}: {
  marker: GlobeMarker;
  radius: number;
  color: string;
  /** Tells the globe a card is open, so it can stop turning while it is read. */
  onHoverChange: (hovered: boolean) => void;
}) {
  const color = marker.color ?? defaultColor;
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const timeRef = useRef(0);

  const position = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.006);
  }, [marker.lat, marker.lng, radius]);

  // Lay the dot flat on the surface, facing outward.
  const quaternion = useMemo(() => {
    return new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      position.clone().normalize(),
    );
  }, [position]);

  const [facing, setFacing] = useState(true);
  const [hot, setHot] = useState(false);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const cameraDirection = useMemo(() => new THREE.Vector3(), []);
  const { camera } = useThree();

  // A ring that swells and fades, over and over. The label is hidden while the
  // marker is on the far side of the globe.
  useFrame((_, delta) => {
    timeRef.current = (timeRef.current + delta) % 2.4;
    const t = timeRef.current / 2.4;
    ringRef.current?.scale.setScalar(1 + t * 3);
    if (ringMaterialRef.current) ringMaterialRef.current.opacity = 0.8 * (1 - t);

    if ((marker.label || marker.info) && ringRef.current) {
      ringRef.current.getWorldPosition(worldPosition);
      cameraDirection.copy(camera.position).normalize();
      const visible = worldPosition.normalize().dot(cameraDirection) > 0.35;
      setFacing((current) => (current === visible ? current : visible));
    }
  });

  const size = radius * (marker.size ?? 0.028);

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <circleGeometry args={[size, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      {marker.onSelect && (
        // A larger invisible target, so the dot is easy to hit.
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            if (facing) marker.onSelect?.();
          }}
          onPointerOver={() => {
            setHot(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHot(false);
            document.body.style.cursor = "";
          }}
        >
          <circleGeometry args={[size * 3, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh ref={ringRef}>
        <ringGeometry args={[size * 1.1, size * 1.4, 48]} />
        <meshBasicMaterial
          ref={ringMaterialRef}
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {(marker.label || marker.info) && (
        <Html zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
          <div
            className="relative transition-opacity duration-300"
            style={{ opacity: facing ? 1 : 0 }}
          >
            {marker.label && (
              <div className="flex -translate-y-full flex-col items-start">
                <span
                  className="pl-3 text-[0.7rem] font-bold tracking-[0.28em] whitespace-nowrap uppercase transition-transform duration-200"
                  style={{
                    transform: hot ? "scale(1.12)" : undefined,
                    transformOrigin: "left bottom",
                    color,
                    WebkitTextStroke: "3px #0a0a0a",
                    paintOrder: "stroke fill",
                  }}
                >
                  {marker.label}
                </span>
                <span className="ml-0 block h-9 w-px" style={{ background: color }} />
              </div>
            )}

            {marker.info && (
              // A round target on the dot. Hover or focus opens the card.
              <Tooltip
                focusable={facing}
                portal
                content={marker.info}
                containerClassName="absolute top-0 left-0 block h-0 w-0"
              >
                <span
                  role="img"
                  aria-label={marker.name ?? marker.label ?? "Landmark"}
                  className="absolute -top-5 -left-5 block h-10 w-10 cursor-pointer rounded-full"
                  style={{ pointerEvents: facing ? "auto" : "none" }}
                  onMouseEnter={() => onHoverChange(true)}
                  onMouseLeave={() => onHoverChange(false)}
                  onFocus={() => onHoverChange(true)}
                  onBlur={() => onHoverChange(false)}
                />
              </Tooltip>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================================
// Arc Component
// ============================================================================

function Arc({
  arc,
  radius,
  color,
  lift,
}: {
  arc: GlobeArc;
  radius: number;
  color: string;
  lift: number;
}) {
  const points = useMemo(
    () => arcPoints(arc, radius, lift),
    [arc, radius, lift],
  );

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1.6}
      transparent
      opacity={0.9}
    />
  );
}

// ============================================================================
// Rotating Globe with Markers and Arcs (all rotate together)
// ============================================================================

interface RotatingGlobeProps {
  config: Required<Globe3DConfig>;
  markers: GlobeMarker[];
  arcs: GlobeArc[];
}

function RotatingGlobe({ config, markers, arcs }: RotatingGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load the sea mask and the terrain map
  const [maskTexture, bumpTexture] = useTexture([
    config.maskUrl,
    config.bumpMapUrl,
  ]);

  const earthTexture = useMemo(
    () => paintEarth(maskTexture, config.landColor, config.oceanColor),
    [maskTexture, config.landColor, config.oceanColor],
  );

  useEffect(() => {
    return () => {
      if (earthTexture !== maskTexture) earthTexture.dispose();
    };
  }, [earthTexture, maskTexture]);

  // Turn the chosen place to face the camera, which sits on the +z axis.
  const focusLat = config.focus?.lat;
  const focusLng = config.focus?.lng;
  const startRotation = useMemo<[number, number, number]>(() => {
    if (focusLat === undefined || focusLng === undefined) return [0, 0, 0];
    const v = latLngToVector3(focusLat, focusLng, 1);
    return [(focusLat * Math.PI) / 180 / 1.6, -Math.atan2(v.x, v.z), 0];
  }, [focusLat, focusLng]);

  // Drag to spin. The globe itself turns (the camera and the lights stay put), with
  // momentum after a flick, a slow idle spin that resumes afterwards, and the tilt
  // easing back upright. A mostly vertical swipe is left to the page, so scrolling on a
  // phone still works: the canvas allows vertical panning (touch-action: pan-y).
  const { gl } = useThree();
  const drag = useRef({ active: false, x: 0, y: 0, t: 0, vy: 0, vx: 0 });
  // How many landmark cards are open. While one is, the idle spin eases to a stop.
  const reading = useRef(0);
  const onHoverChange = useCallback((hovered: boolean) => {
    reading.current = Math.max(0, reading.current + (hovered ? 1 : -1));
  }, []);
  const idleSpeed = config.autoRotateSpeed * 0.35; // radians per second

  useEffect(() => {
    const element = gl.domElement;
    const state = drag.current;
    if (!config.interactive) return;

    element.style.touchAction = "pan-y";
    element.style.cursor = "grab";

    const down = (event: PointerEvent) => {
      state.active = true;
      state.x = event.clientX;
      state.y = event.clientY;
      state.t = event.timeStamp;
      state.vy = 0;
      state.vx = 0;
      element.setPointerCapture(event.pointerId);
      element.style.cursor = "grabbing";
    };

    const move = (event: PointerEvent) => {
      const group = groupRef.current;
      if (!state.active || !group) return;
      const dx = event.clientX - state.x;
      const dy = event.clientY - state.y;
      const dt = Math.max(1, event.timeStamp - state.t) / 1000;
      state.x = event.clientX;
      state.y = event.clientY;
      state.t = event.timeStamp;

      const turn = 0.0065; // radians per pixel
      group.rotation.y += dx * turn;
      group.rotation.x = THREE.MathUtils.clamp(group.rotation.x + dy * turn, -1.1, 1.1);
      state.vy = THREE.MathUtils.clamp((dx * turn) / dt, -9, 9);
      state.vx = THREE.MathUtils.clamp((dy * turn) / dt, -6, 6);
    };

    const up = (event: PointerEvent) => {
      state.active = false;
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
      element.style.cursor = "grab";
    };

    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
    };
  }, [gl, config.interactive]);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    const state = drag.current;
    if (!group || state.active) return;

    // A landmark card is open: hold perfectly still until the pointer leaves.
    if (reading.current > 0) {
      state.vy = 0;
      state.vx = 0;
      return;
    }

    // A long frame (a busy tab, a slow device) must not become a lurch.
    const delta = Math.min(rawDelta, 1 / 20);

    // Coast on the flick, then settle into the idle spin (or stillness while a card is open).
    group.rotation.y += state.vy * delta;
    group.rotation.x = THREE.MathUtils.clamp(group.rotation.x + state.vx * delta, -1.1, 1.1);
    const settle = 1 - Math.exp(-1.6 * delta);
    state.vy += (idleSpeed - state.vy) * settle;
    state.vx *= Math.exp(-4 * delta);
    // The tilt eases back to where it started.
    group.rotation.x += (startRotation[0] - group.rotation.x) * (1 - Math.exp(-0.7 * delta));
  });

  return (
    <group ref={groupRef} rotation={startRotation}>
      {/* Main globe mesh */}
      <mesh>
        <sphereGeometry args={[config.radius, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.05}
          roughness={0.85}
          metalness={0.0}
        />
      </mesh>

      {/* Wireframe overlay */}
      {config.showWireframe && (
        <mesh>
          <sphereGeometry args={[config.radius * 1.002, 36, 18]} />
          <meshBasicMaterial
            color={config.wireframeColor}
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>
      )}

      {arcs.map((arc, index) => (
        <Arc
          key={`arc-${index}`}
          arc={arc}
          radius={config.radius}
          color={config.arcColor}
          lift={config.arcLift}
        />
      ))}

      {/* Markers - inside the rotating group */}
      {markers.map((marker, index) => (
        <Marker
          key={`marker-${index}-${marker.lat}-${marker.lng}`}
          marker={marker}
          radius={config.radius}
          color={config.markerColor}
          onHoverChange={onHoverChange}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Atmosphere Component (stays static - doesn't rotate)
// ============================================================================

interface AtmosphereProps {
  radius: number;
  color: string;
  intensity: number;
  blur: number;
}

function Atmosphere({ radius, color, intensity, blur }: AtmosphereProps) {
  // blur controls the fresnel exponent: lower = more diffuse, higher = sharper edge
  // We invert it so higher blur value = more diffuse (lower exponent)
  const fresnelPower = Math.max(0.5, 5 - blur);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        fresnelPower: { value: fresnelPower },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color, intensity, fresnelPower]);

  return (
    <mesh scale={[1.12, 1.12, 1.12]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

// ============================================================================
// Scene Component
// ============================================================================

interface SceneProps {
  markers: GlobeMarker[];
  arcs: GlobeArc[];
  config: Required<Globe3DConfig>;
}

function Scene({ markers, arcs, config }: SceneProps) {
  const { camera } = useThree();

  // Set initial camera position (pulled back to leave room for the arcs)
  useEffect(() => {
    camera.position.set(0, 0, config.radius * 3.4);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color={config.rimLightColor}
      />

      <RotatingGlobe config={config} markers={markers} arcs={arcs} />

      {/* Atmosphere (static) */}
      {config.showAtmosphere && (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      )}

    </>
  );
}

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig: Required<Globe3DConfig> = {
  radius: 2,
  landColor: "#c9a24b",
  oceanColor: "#0a0a0a",
  maskUrl: DEFAULT_MASK_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: true,
  atmosphereColor: "#e6c877",
  atmosphereIntensity: 0.5,
  atmosphereBlur: 2,
  bumpScale: 1,
  autoRotateSpeed: 0.3,
  interactive: true,
  focus: null,
  markerColor: "#ff7a1a",
  arcColor: "#ff7a1a",
  arcLift: 0.16,
  showWireframe: true,
  wireframeColor: "#c9a24b",
  ambientIntensity: 1.1,
  pointLightIntensity: 1.6,
  rimLightColor: "#e6c877",
  backgroundColor: null,
};

export function Globe3D({
  markers = [],
  arcs = [],
  config,
  className,
  active = true,
  ariaLabel = "Interactive globe",
}: Globe3DProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn("relative h-[500px] w-full", className)}
    >
      <Canvas
        frameloop={active ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, mergedConfig.radius * 3.4],
        }}
        style={{
          background: mergedConfig.backgroundColor || "transparent",
        }}
      >
        <Suspense fallback={null}>
          <Scene markers={markers} arcs={arcs} config={mergedConfig} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Globe3D;

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls, useTexture } from "@react-three/drei";
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
  /** How fast the globe turns by itself (0 = still) */
  autoRotateSpeed?: number;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Enable pan */
  enablePan?: boolean;
  /** Min zoom distance */
  minDistance?: number;
  /** Max zoom distance */
  maxDistance?: number;
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
}

// ============================================================================
// Constants - self-hosted textures
// ============================================================================

const DEFAULT_MASK_TEXTURE = "/textures/earth-water.png";
const DEFAULT_BUMP_TEXTURE = "/textures/earth-topology.png";

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
  color,
}: {
  marker: GlobeMarker;
  radius: number;
  color: string;
}) {
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

  // A ring that swells and fades, over and over.
  useFrame((_, delta) => {
    timeRef.current = (timeRef.current + delta) % 2.4;
    const t = timeRef.current / 2.4;
    ringRef.current?.scale.setScalar(1 + t * 3);
    if (ringMaterialRef.current) ringMaterialRef.current.opacity = 0.8 * (1 - t);
  });

  const size = radius * (marker.size ?? 0.028);

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <circleGeometry args={[size, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
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

  // With a focus the globe sways gently either side of it, so that place never turns
  // out of sight. Without one it simply keeps turning.
  const swayTime = useRef(0);
  const hasFocus = focusLat !== undefined && focusLng !== undefined;
  useFrame((_, delta) => {
    if (!groupRef.current || config.autoRotateSpeed <= 0) return;
    if (hasFocus) {
      swayTime.current += delta;
      groupRef.current.rotation.y =
        startRotation[1] +
        Math.sin(swayTime.current * config.autoRotateSpeed * 0.3) * 0.5;
    } else {
      groupRef.current.rotation.y += delta * config.autoRotateSpeed * 0.12;
    }
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

      {/* Controls: drag to turn. Zoom and pan are off so the page keeps scrolling. */}
      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        enableDamping
        dampingFactor={0.1}
      />
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
  enableZoom: false,
  enablePan: false,
  minDistance: 5,
  maxDistance: 15,
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
}: Globe3DProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );

  return (
    <div className={cn("relative h-[500px] w-full", className)}>
      <Canvas
        frameloop={active ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.75]}
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

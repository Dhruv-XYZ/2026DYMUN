import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

interface VortexProps {
  children?: ReactNode;
  /** Classes for the content layer. */
  className?: string;
  /** Classes for the outer container. */
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  /** Fill colour behind the particles. Leave unset for a transparent canvas. */
  backgroundColor?: string;
  /** Fraction of the container's size the canvas is drawn at (it is scaled up by CSS). */
  resolution?: number;
  /** Draw one still frame instead of animating (reduced motion, low power). */
  paused?: boolean;
}

// The two ends of the colour range, as RGB: the palette's orange and gold-light.
// Each particle gets a random point between them, so nothing outside the palette is drawn.
const ORANGE: [number, number, number] = [255, 122, 26];
const GOLD: [number, number, number] = [230, 200, 119];

const PROPS_PER_PARTICLE = 9;
const BASE_TTL = 50;
const RANGE_TTL = 150;
const NOISE_STEPS = 3;
const X_OFF = 0.00125;
const Y_OFF = 0.00125;
const Z_OFF = 0.0005;
const TAU = 2 * Math.PI;

const rand = (n: number) => n * Math.random();
const randRange = (n: number) => n - rand(2 * n);
const fadeInOut = (t: number, m: number) => {
  const hm = 0.5 * m;
  return Math.abs(((t + hm) % m) - hm) / hm;
};
const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

/**
 * Aceternity "Vortex": particles carried along a drifting noise field, drawn as glowing
 * streaks.
 *
 * Changed for DYMUN:
 * - Particle colours blend only between the palette's orange and gold. The original
 *   used any hue.
 * - It fills its own container. The original sized itself to the whole browser window.
 * - The canvas is resized with a ResizeObserver, drawn at a reduced resolution (a
 *   blurry glow does not need more), and stops while the section is off screen.
 * - The canvas is transparent by default, so it can sit over other layers.
 * - Props are no longer re-created on every render, and the animation is cleaned up.
 * - `paused` fast-forwards the field and draws one still frame.
 */
export const Vortex = ({
  children,
  className,
  containerClassName,
  particleCount = 700,
  rangeY = 100,
  baseSpeed = 0,
  rangeSpeed = 1.5,
  baseRadius = 1,
  rangeRadius = 2,
  backgroundColor,
  resolution = 0.75,
  paused = false,
}: VortexProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) return;

    const noise3D = createNoise3D();
    const particleProps = new Float32Array(particleCount * PROPS_PER_PARTICLE);
    const center: [number, number] = [0, 0];
    let tick = 0;
    let frame = 0;
    let visible = true;

    const initParticle = (i: number) => {
      const x = rand(canvas.width);
      const y = center[1] + randRange(rangeY);
      const ttl = BASE_TTL + rand(RANGE_TTL);
      const speed = baseSpeed + rand(rangeSpeed);
      const radius = baseRadius + rand(rangeRadius);
      // Position between orange (0) and gold (1).
      const blend = Math.random();
      particleProps.set([x, y, 0, 0, 0, ttl, speed, radius, blend], i);
    };

    const initParticles = () => {
      tick = 0;
      for (let i = 0; i < particleProps.length; i += PROPS_PER_PARTICLE) initParticle(i);
    };

    const drawParticle = (
      x: number,
      y: number,
      x2: number,
      y2: number,
      life: number,
      ttl: number,
      radius: number,
      blend: number,
    ) => {
      const r = Math.round(lerp(ORANGE[0], GOLD[0], blend));
      const g = Math.round(lerp(ORANGE[1], GOLD[1], blend));
      const b = Math.round(lerp(ORANGE[2], GOLD[2], blend));
      ctx.lineCap = "round";
      ctx.lineWidth = radius;
      ctx.strokeStyle = `rgba(${r},${g},${b},${fadeInOut(life, ttl)})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    };

    const updateParticle = (i: number, drawIt: boolean) => {
      const x = particleProps[i];
      const y = particleProps[i + 1];
      const n = noise3D(x * X_OFF, y * Y_OFF, tick * Z_OFF) * NOISE_STEPS * TAU;
      const vx = lerp(particleProps[i + 2], Math.cos(n), 0.5);
      const vy = lerp(particleProps[i + 3], Math.sin(n), 0.5);
      let life = particleProps[i + 4];
      const ttl = particleProps[i + 5];
      const speed = particleProps[i + 6];
      const x2 = x + vx * speed;
      const y2 = y + vy * speed;

      if (drawIt) {
        drawParticle(x, y, x2, y2, life, ttl, particleProps[i + 7], particleProps[i + 8]);
      }

      life++;
      particleProps[i] = x2;
      particleProps[i + 1] = y2;
      particleProps[i + 2] = vx;
      particleProps[i + 3] = vy;
      particleProps[i + 4] = life;

      const outside = x > canvas.width || x < 0 || y > canvas.height || y < 0;
      if (outside || life > ttl) initParticle(i);
    };

    const renderGlow = () => {
      ctx.save();
      ctx.filter = "blur(8px) brightness(200%)";
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();

      ctx.save();
      ctx.filter = "blur(4px) brightness(200%)";
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    };

    const step = (drawIt: boolean) => {
      tick++;
      if (drawIt) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      for (let i = 0; i < particleProps.length; i += PROPS_PER_PARTICLE) {
        updateParticle(i, drawIt);
      }
      if (drawIt) renderGlow();
    };

    // A still frame: let the field run for a while, then draw once.
    const still = () => {
      initParticles();
      for (let n = 0; n < 90; n++) step(false);
      step(true);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * resolution));
      canvas.height = Math.max(1, Math.floor(rect.height * resolution));
      center[0] = 0.5 * canvas.width;
      center[1] = 0.5 * canvas.height;
      if (paused) still();
    };

    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      step(true);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    initParticles();

    const intersection = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    intersection.observe(container);

    if (paused) {
      still();
    } else {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, [particleCount, rangeY, baseSpeed, rangeSpeed, baseRadius, rangeRadius, backgroundColor, resolution, paused]);

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", containerClassName)}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full"
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};

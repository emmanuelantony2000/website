"use client";

import { useRef, useEffect } from "react";
import { useTheme } from "next-themes";

// --- Perlin noise implementation ---
const PERM = new Uint8Array(512);
const GRAD = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function initPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

function noise2d(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = fade(xf);
  const v = fade(yf);
  const X = xi & 255;
  const Y = yi & 255;
  const g00 = GRAD[PERM[PERM[X] + Y] & 7];
  const g10 = GRAD[PERM[PERM[X + 1] + Y] & 7];
  const g01 = GRAD[PERM[PERM[X] + Y + 1] & 7];
  const g11 = GRAD[PERM[PERM[X + 1] + Y + 1] & 7];
  const n00 = g00[0] * xf + g00[1] * yf;
  const n10 = g10[0] * (xf - 1) + g10[1] * yf;
  const n01 = g01[0] * xf + g01[1] * (yf - 1);
  const n11 = g11[0] * (xf - 1) + g11[1] * (yf - 1);
  return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v);
}

// Remap noise2d output from ~[-1,1] to [0,1] like p5's noise()
function noise2d01(x: number, y: number) {
  return noise2d(x, y) * 0.5 + 0.5;
}

// --- Constants matching Vanta topology ---
const PARTICLE_COUNT = 4500;
const CELL_SIZE = 10;
const NOISE_SIZE = 0.003;
const NOISE_RADIUS = 0.1;
const NOISE_SAMPLES = 100;
const OFFSET = 100;
const SPEED = 2.2;

function hexToRgb(hex: number) {
  return {
    r: (hex >> 16) & 0xff,
    g: (hex >> 8) & 0xff,
    b: hex & 0xff,
  };
}

interface FlowField {
  cols: number;
  rows: number;
  vx: Float32Array;
  vy: Float32Array;
}

// Build static flow grid:
// For each cell, sample noise at 100 points around a circle,
// find highest/lowest noise values, vector from high→low scaled by (high-low).
function buildFlowGrid(totalW: number, totalH: number): FlowField {
  const cols = Math.ceil(totalW / CELL_SIZE);
  const rows = Math.ceil(totalH / CELL_SIZE);
  const vx = new Float32Array(cols * rows);
  const vy = new Float32Array(cols * rows);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cx = j * NOISE_SIZE;
      const cy = i * NOISE_SIZE;

      let highVal = -Infinity;
      let lowVal = Infinity;
      let highX = 0,
        highY = 0;
      let lowX = 0,
        lowY = 0;

      for (let s = 0; s < NOISE_SAMPLES; s++) {
        const angle = (s / NOISE_SAMPLES) * Math.PI * 2;
        const sx = cx + Math.cos(angle) * NOISE_RADIUS;
        const sy = cy + Math.sin(angle) * NOISE_RADIUS;
        const val = noise2d01(sx, sy);

        if (val > highVal) {
          highVal = val;
          highX = sx;
          highY = sy;
        }
        if (val < lowVal) {
          lowVal = val;
          lowX = sx;
          lowY = sy;
        }
      }

      // Vector from high → low, scaled by difference
      const dx = lowX - highX;
      const dy = lowY - highY;
      const len = Math.sqrt(dx * dx + dy * dy);
      const diff = highVal - lowVal;
      const idx = i * cols + j;

      if (len > 0) {
        vx[idx] = (dx / len) * diff;
        vy[idx] = (dy / len) * diff;
      } else {
        vx[idx] = 0;
        vy[idx] = 0;
      }
    }
  }

  return { cols, rows, vx, vy };
}

function getFlow(field: FlowField, x: number, y: number): [number, number] {
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);
  if (col < 0 || col >= field.cols || row < 0 || row >= field.rows)
    return [0, 0];
  const idx = row * field.cols + col;
  return [field.vx[idx], field.vy[idx]];
}

// Proper modulo (always positive)
function mod(a: number, n: number) {
  return ((a % n) + n) % n;
}

export function Bg() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme ?? theme) === "dark";
  const color = isDark ? 0x202020 : 0xefefef;
  const backgroundColor = isDark ? 0x090b0b : 0xffffff;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    animId: number;
    observer: ResizeObserver | null;
  }>({ animId: 0, observer: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    initPerm();

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const totalW = w + OFFSET * 2;
    const totalH = h + OFFSET * 2;

    // Size canvas to cover viewport
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fill background
    const bg = hexToRgb(backgroundColor);
    ctx.fillStyle = `rgb(${bg.r},${bg.g},${bg.b})`;
    ctx.fillRect(0, 0, w, h);

    // Translate so the 100px padding is off-screen
    ctx.translate(-OFFSET, -OFFSET);

    // Build static flow field
    const field = buildFlowGrid(totalW, totalH);

    // Initialize particles in the padded space
    const count = PARTICLE_COUNT;
    const px = new Float32Array(count); // position x
    const py = new Float32Array(count); // position y
    const pvx = new Float32Array(count); // velocity x
    const pvy = new Float32Array(count); // velocity y
    const pax = new Float32Array(count); // acceleration x
    const pay = new Float32Array(count); // acceleration y

    for (let i = 0; i < count; i++) {
      px[i] = Math.random() * totalW;
      py[i] = Math.random() * totalH;
      // Random initial velocity direction at speed SPEED
      const angle = Math.random() * Math.PI * 2;
      pvx[i] = Math.cos(angle) * SPEED;
      pvy[i] = Math.sin(angle) * SPEED;
    }

    const fg = hexToRgb(color);
    const strokeStyle = `rgba(${fg.r},${fg.g},${fg.b},0.05)`;

    function frame() {
      ctx!.strokeStyle = strokeStyle;
      ctx!.lineWidth = 1;

      for (let i = 0; i < count; i++) {
        // Get flow at current position
        const [fx, fy] = getFlow(field, px[i], py[i]);

        // Save previous position
        const prevX = px[i];
        const prevY = py[i];

        // Move by velocity
        px[i] += pvx[i];
        py[i] += pvy[i];

        // Wrap position
        px[i] = mod(px[i], totalW);
        py[i] = mod(py[i], totalH);

        // Update velocity: normalize(vel + acc) * SPEED
        const nvx = pvx[i] + pax[i];
        const nvy = pvy[i] + pay[i];
        const len = Math.sqrt(nvx * nvx + nvy * nvy);
        if (len > 0) {
          pvx[i] = (nvx / len) * SPEED;
          pvy[i] = (nvy / len) * SPEED;
        }

        // Set acceleration from flow * 3
        pax[i] = fx * 3;
        pay[i] = fy * 3;

        // Only draw line if distance between prev and current < 10
        const dx = px[i] - prevX;
        const dy = py[i] - prevY;
        if (dx * dx + dy * dy < 100) {
          // 10^2 = 100
          ctx!.beginPath();
          ctx!.moveTo(prevX, prevY);
          ctx!.lineTo(px[i], py[i]);
          ctx!.stroke();
        }
      }

      stateRef.current.animId = requestAnimationFrame(frame);
    }

    stateRef.current.animId = requestAnimationFrame(frame);

    const observer = new ResizeObserver(() => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      canvas.width = nw * dpr;
      canvas.height = nh * dpr;
      canvas.style.width = nw + "px";
      canvas.style.height = nh + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.translate(-OFFSET, -OFFSET);

      const nbg = hexToRgb(backgroundColor);
      ctx.fillStyle = `rgb(${nbg.r},${nbg.g},${nbg.b})`;
      ctx.fillRect(-OFFSET, -OFFSET, nw + OFFSET * 2, nh + OFFSET * 2);
    });
    observer.observe(document.documentElement);
    stateRef.current.observer = observer;

    return () => {
      cancelAnimationFrame(stateRef.current.animId);
      if (stateRef.current.observer) {
        stateRef.current.observer.disconnect();
        stateRef.current.observer = null;
      }
    };
  }, [color, backgroundColor]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-screen h-screen -z-10" />
  );
}

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Helper: Generate Fibonacci Sphere points
function getSpherePoints(n: number) {
  const points: [number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const lng = (Math.atan2(z, x) * 180) / Math.PI;
    const lat = (Math.asin(y) * 180) / Math.PI;
    points.push([lng, lat]);
  }
  return points;
}

interface GlobeProps {
  zoom?: number;
}

const Globe: React.FC<GlobeProps> = ({ zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [globeData, setGlobeData] = useState<{
    points: [number, number][];
    links: any[];
  } | null>(null);

  // Keep a ref for zoom to access it inside the d3 timer loop without re-binding
  const zoomRef = useRef(zoom);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    let isMounted = true;
    fetch(
      "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_land.geojson"
    )
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const land = data;

        const candidates = getSpherePoints(3500);
        const validPoints = candidates.filter((pt) => d3.geoContains(land, pt));

        const p3d = validPoints.map((p) => {
          const phi = ((90 - p[1]) * Math.PI) / 180;
          const theta = ((p[0] + 180) * Math.PI) / 180;
          return {
            x: -(Math.sin(phi) * Math.cos(theta)),
            y: Math.cos(phi),
            z: Math.sin(phi) * Math.sin(theta),
            origin: p,
          };
        });

        const links: any[] = [];
        p3d.forEach((p1, i) => {
          let neighbors = [];
          for (let j = 0; j < p3d.length; j++) {
            if (i === j) continue;
            const p2 = p3d[j];
            const dist =
              (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2;
            neighbors.push({ idx: j, dist });
          }
          neighbors.sort((a, b) => a.dist - b.dist);
          for (let k = 0; k < 1; k++) {
            if (neighbors[k] && neighbors[k].dist < 0.03) {
              const target = p3d[neighbors[k].idx];
              links.push({
                type: "LineString",
                coordinates: [p1.origin, target.origin],
              });
            }
          }
        });

        setGlobeData({ points: validPoints, links });
      })
      .catch((err) => console.error("Globe data error:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !globeData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 2 - 1,
      size: Math.random() * 1.5,
      speed: 0.001 + Math.random() * 0.002,
    }));

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) return;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    });
    resizeObserver.observe(containerRef.current);

    const projection = d3.geoOrthographic().clipAngle(90);
    const path = d3.geoPath(projection, ctx);

    let rotation = 0;
    const timer = d3.timer((elapsed) => {
      rotation = elapsed * 0.002;
      const width = containerRef.current?.clientWidth || 0;
      const height = containerRef.current?.clientHeight || 0;

      if (width === 0 || height === 0) return;

      const currentZoom = zoomRef.current;
      const baseSize = Math.min(width, height) * 0.8;
      const size = baseSize * currentZoom;

      const cx = width / 2;
      const cy = height / 2;

      projection
        .fitSize([size, size], { type: "Sphere" } as any)
        .translate([cx, cy])
        .rotate([rotation * 4, -15, 0]);

      ctx.clearRect(0, 0, width, height);

      // --- Links (Mesh) ---
      ctx.beginPath();
      path({
        type: "MultiLineString",
        coordinates: globeData.links.map((l) => l.coordinates),
      } as any);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.08)"; // Changed to Blue-500 alpha
      ctx.lineWidth = 0.5 * Math.max(1, currentZoom * 0.5);
      ctx.stroke();

      // --- Points (Nodes) ---
      globeData.points.forEach((pt, i) => {
        const projected = projection(pt);
        if (!projected) return;

        const [x, y] = projected;
        if (x === null || y === null) return;

        const rRand = (i * 123.45) % 100;
        const isRed = rRand < 5;
        const isBlue = rRand > 5 && rRand < 15;
        const isPulse = (i + Math.floor(elapsed / 150)) % 100 === 0;

        // Base scaling for zoom
        const dotScale = Math.min(2, Math.max(1, currentZoom * 0.8));

        ctx.beginPath();

        if (isRed) {
          // RED PULSE: "Breathing" alert effect
          const redPulse = 1 + Math.sin(elapsed * 0.005 + i) * 0.4;

          ctx.shadowBlur = 10 * redPulse;
          ctx.shadowColor = "rgba(248, 113, 113, 0.5)";
          ctx.fillStyle = "#f87171";
          ctx.arc(x, y, 1.8 * dotScale * redPulse, 0, 2 * Math.PI);
          ctx.fill();

          ctx.shadowBlur = 0;
        } else if (isBlue || isPulse) {
          // BLUE PULSE: Sharp data blink
          ctx.fillStyle = "#3b82f6"; // Changed to Blue-500
          ctx.arc(x, y, 1.8 * dotScale, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          // STATIC NODES
          ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
          ctx.arc(x, y, 1.0 * dotScale, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      // --- Ambient Data Particles ---
      particles.forEach((p, i) => {
        const angle = elapsed * p.speed;
        const px = p.x * Math.cos(angle) - p.z * Math.sin(angle);
        const pz = p.x * Math.sin(angle) + p.z * Math.cos(angle);

        const scale = 1000 / (1000 - pz * 300);
        const spread = size * 0.8;

        const screenX = cx + px * spread * scale;
        const screenY = cy + p.y * spread * scale;

        const alpha =
          ((Math.sin(elapsed * 0.001 + i) + 1) / 2) *
          0.6 *
          (1 / Math.max(1, currentZoom));

        ctx.beginPath();
        ctx.fillStyle =
          i % 2 === 0
            ? `rgba(59, 130, 246, ${alpha})` // Changed to Blue-500
            : `rgba(248, 113, 113, ${alpha})`;
        ctx.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Rim Light ---
      ctx.beginPath();
      path({ type: "Sphere" } as any);
      const grad = ctx.createRadialGradient(
        cx,
        cy,
        size * 0.45,
        cx,
        cy,
        size * 0.5
      );
      grad.addColorStop(0, "rgba(0, 0, 0, 0)");
      grad.addColorStop(0.8, "rgba(59, 130, 246, 0.05)"); // Changed to Blue-500
      grad.addColorStop(1, "rgba(59, 130, 246, 0.3)"); // Changed to Blue-500
      ctx.fillStyle = grad;
      ctx.fill();
    });

    return () => {
      timer.stop();
      resizeObserver.disconnect();
    };
  }, [globeData]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 flex items-center justify-center pointer-events-none transition-transform duration-75"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Globe;

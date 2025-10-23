import { useEffect, useRef } from "react";

export function AnimatedGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 0.005;

      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Animated colors
      const hue1 = (time * 20) % 360;
      const hue2 = (time * 20 + 60) % 360;
      const hue3 = (time * 20 + 120) % 360;

      gradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, 0.1)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 70%, 60%, 0.1)`);
      gradient.addColorStop(1, `hsla(${hue3}, 70%, 60%, 0.1)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}


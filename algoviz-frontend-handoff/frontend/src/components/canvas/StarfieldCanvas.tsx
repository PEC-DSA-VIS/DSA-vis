import React, { useEffect, useRef } from 'react';
import { useAlgorithmStore } from '../../store/useAlgorithmStore';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  layer: number; // 1, 2, 3 for parallax
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPlaying = useAlgorithmStore((s) => s.isPlaying);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = mediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // Mouse coordinates for gentle parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize);

    // Generate Stars
    let stars: Star[] = [];
    const starCount = Math.floor(Math.min(width, 1920) / 7); // ~200-250 stars for 60fps

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const layer = Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3;
        const radius = layer === 1 ? Math.random() * 0.8 + 0.3 : layer === 2 ? Math.random() * 1.1 + 0.6 : Math.random() * 1.5 + 1.0;
        const baseAlpha = layer === 1 ? Math.random() * 0.4 + 0.2 : layer === 2 ? Math.random() * 0.5 + 0.4 : Math.random() * 0.4 + 0.6;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          layer,
        });
      }
    };
    initStars();

    // Shooting Star state
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      opacity: 0,
      active: false,
    };

    let nextShootingStarTime = Date.now() + Math.random() * 4000 + 3000;

    const spawnShootingStar = () => {
      shootingStar = {
        x: Math.random() * (width * 0.8),
        y: Math.random() * (height * 0.4),
        length: Math.random() * 100 + 70,
        speed: Math.random() * 12 + 10,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 degrees downward
        opacity: 1,
        active: true,
      };
      nextShootingStarTime = Date.now() + Math.random() * 7000 + 5000;
    };

    // Render Loop
    let lastTime = performance.now();

    const render = (time: number) => {
      // Pause if tab is hidden
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Delta time check
      const dt = time - lastTime;
      lastTime = time;

      // Soft mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;
      const offsetX = (mouseX - width / 2) * 0.015;
      const offsetY = (mouseY - height / 2) * 0.015;

      const isDark = document.documentElement.classList.contains('dark');

      if (isDark) {
        // Clear with Kinetic Observatory deep space obsidian color
        ctx.fillStyle = '#070b16';
        ctx.fillRect(0, 0, width, height);

        // Subtle ambient space nebula gradient
        const grad = ctx.createRadialGradient(
          width * 0.7,
          height * 0.3,
          10,
          width * 0.7,
          height * 0.3,
          width * 0.6
        );
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.05)');
        grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Clear with warm ivory/white background
        ctx.fillStyle = '#f8f9ff';
        ctx.fillRect(0, 0, width, height);

        // Soft pastel gradient glow
        const grad = ctx.createRadialGradient(
          width * 0.7,
          height * 0.3,
          10,
          width * 0.7,
          height * 0.3,
          width * 0.65
        );
        grad.addColorStop(0, 'rgba(59, 130, 246, 0.03)');
        grad.addColorStop(0.5, 'rgba(236, 72, 153, 0.02)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle
        if (!reducedMotion) {
          star.alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed) * 0.25;
          if (star.alpha < 0.1) star.alpha = 0.1;
        }

        // Parallax position
        const px = star.x + offsetX * star.layer;
        const py = star.y + offsetY * star.layer;

        ctx.beginPath();
        ctx.arc(px, py, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(230, 240, 255, ${star.alpha})`
          : `rgba(99, 102, 241, ${star.alpha * 0.35})`;
        ctx.fill();

        // Extra halo glow for bright layer 3 stars
        if (star.layer === 3) {
          ctx.beginPath();
          ctx.arc(px, py, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(147, 197, 253, ${star.alpha * 0.2})`
            : `rgba(147, 197, 253, ${star.alpha * 0.15})`;
          ctx.fill();
        }
      }

      // Shooting Star (only if not reduced motion)
      if (!reducedMotion) {
        if (!shootingStar.active && Date.now() > nextShootingStarTime && !isPlaying) {
          spawnShootingStar();
        }

        if (shootingStar.active) {
          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.opacity -= 0.012;

          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

          const shootGrad = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            tailX,
            tailY
          );
          if (isDark) {
            shootGrad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
            shootGrad.addColorStop(0.3, `rgba(34, 211, 238, ${shootingStar.opacity * 0.7})`);
            shootGrad.addColorStop(1, 'transparent');
          } else {
            shootGrad.addColorStop(0, `rgba(59, 130, 246, ${shootingStar.opacity * 0.8})`);
            shootGrad.addColorStop(0.3, `rgba(168, 85, 247, ${shootingStar.opacity * 0.5})`);
            shootGrad.addColorStop(1, 'transparent');
          }

          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(tailX, tailY);
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = shootGrad;
          ctx.stroke();

          if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
            shootingStar.active = false;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

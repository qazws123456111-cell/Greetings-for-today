import React, { useRef, useEffect } from 'react';

interface ConfettiProps {
  trigger: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'circle' | 'heart' | 'square';
}

const COLORS = [
  '#FFAC99', // Cozy Peach
  '#D7CDFC', // Soft Lavender
  '#A4C3A2', // Matcha Green
  '#FF9B9B', // Heart Pink
  '#FFD25A', // Gold Star
  '#FFD2D2', // Soft Rose
];

export const Confetti: React.FC<ConfettiProps> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기를 시뮬레이터 쉘 뷰포트 크기로 세팅
    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = rect?.width || 412;
    canvas.height = rect?.height || 840;

    const particles: Particle[] = [];

    // 파티클 스폰 (화면 중앙 아래 완료 모달 근방에서 폭죽처럼 분출)
    const spawnParticles = () => {
      const count = 100;
      const startX = canvas.width / 2;
      const startY = canvas.height / 2 + 50;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 4 + Math.random() * 8;
        const size = 6 + Math.random() * 10;
        const shapes: ('circle' | 'heart' | 'square')[] = ['circle', 'square', 'heart'];
        
        particles.push({
          x: startX,
          y: startY,
          size,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          speedX: Math.cos(angle) * velocity,
          speedY: Math.sin(angle) * velocity - 3, // 위쪽 방향 성분 주입
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          opacity: 1,
          shape: shapes[Math.floor(Math.random() * shapes.length)]
        });
      }
    };

    spawnParticles();

    let animationFrameId: number;

    const drawHeart = (cContext: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      cContext.beginPath();
      cContext.moveTo(x, y + size / 4);
      cContext.quadraticCurveTo(x, y, x + size / 2, y);
      cContext.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      cContext.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      cContext.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      cContext.quadraticCurveTo(x, y, x, y + size / 4);
      cContext.closePath();
      cContext.fill();
    };

    const updateAndRender = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allDead = true;

      particles.forEach((p) => {
        if (p.opacity <= 0) return;

        allDead = false;

        // 물리 연산 (중력 & 공기 저항 가속도)
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.2; // 중력
        p.speedX *= 0.98; // 바람저항
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.015; // 서서히 페이드아웃

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'heart') {
          drawHeart(ctx, -p.size / 2, -p.size / 2, p.size);
        }

        ctx.restore();
      });

      if (!allDead) {
        animationFrameId = requestAnimationFrame(updateAndRender);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    updateAndRender();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [trigger]);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
};

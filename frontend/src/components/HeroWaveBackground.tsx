import React, { useEffect, useRef } from 'react';

const HeroWaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || window.innerWidth;
      canvas.height = rect?.height || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Trigger double resize setup for accuracy on mount
    setTimeout(handleResize, 100);

    const draw = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const spacing = 48;
      const dotRadius = 3;
      const centerY = height / 2;
      const amplitude = 80;
      const frequency = 0.0055;
      const speed = 0.02;

      phase += speed;

      for (let x = spacing / 2; x < width; x += spacing) {
        const waveY = centerY + Math.sin(x * frequency - phase) * amplitude;

        for (let y = spacing / 2; y < height; y += spacing) {
          const distY = Math.abs(y - waveY);
          const maxDist = 240;
          const factor = Math.max(0, 1 - distY / maxDist);

          ctx.beginPath();
          if (factor > 0) {
            ctx.shadowBlur = factor * 26;
            ctx.shadowColor = 'rgba(0, 149, 255, 0.95)';
            
            const r = Math.round(242 - (242 - 0) * factor);
            const g = Math.round(242 - (242 - 149) * factor);
            const b = Math.round(242 - (242 - 255) * factor);
            const opacity = 0.12 + factor * 0.78;

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.arc(x, y, dotRadius + factor * 2.2, 0, Math.PI * 2);
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(242, 242, 242, 0.11)';
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }

      ctx.shadowBlur = 24;
      ctx.shadowColor = 'rgba(0, 149, 255, 0.85)';
      ctx.strokeStyle = 'rgba(0, 149, 255, 0.45)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let x = 0; x < width; x += 6) {
        const y = centerY + Math.sin(x * frequency - phase) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      ctx.shadowBlur = 16;
      ctx.shadowColor = 'rgba(0, 242, 255, 0.65)';
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.28)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let x = 0; x < width; x += 6) {
        const y = centerY + Math.sin(x * (frequency * 1.35) - (phase * 1.15) + 3) * (amplitude * 0.75);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default HeroWaveBackground;

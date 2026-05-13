import { useRef, useEffect } from 'react';

const LABELS = ['Wariga Bali', 'Numerologi', 'Astrologi', 'Jyotisha', 'BaZi', 'Qimen Dun Jia', 'Nawa Sanga', 'Karma'];
const COLORS = {
  fill: 'rgba(245, 158, 11, 0.15)',
  stroke: 'rgba(245, 158, 11, 0.8)',
  grid: 'rgba(255, 255, 255, 0.06)',
  gridStroke: 'rgba(255, 255, 255, 0.1)',
  text: '#A09BB0',
  dot: '#F59E0B',
};

export default function ScoreRadar({ scores }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scores) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 600; 
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = size + 'px';
    canvas.style.aspectRatio = '1 / 1';
    canvas.style.height = 'auto';
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = 200; // Significantly enlarged radar object
    const sides = 8;
    const angleStep = (Math.PI * 2) / sides;
    const startAngle = -Math.PI / 2;

    let progress = 0;
    const animate = () => {
      progress = Math.min(1, progress + 0.03);
      ctx.clearRect(0, 0, size, size);

      // Draw grid rings
      for (let r = 1; r <= 5; r++) {
        const radius = (maxR / 5) * r;
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
          const angle = startAngle + i * angleStep;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = COLORS.gridStroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw axes
      for (let i = 0; i < sides; i++) {
        const angle = startAngle + i * angleStep;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw data
      const values = [
        scores.wariga?.score || 0,
        scores.numerology?.score || 0,
        scores.astrology?.score || 0,
        scores.jyotisha?.score || 0,
        scores.bazi?.score || 0,
        scores.qimen?.score || 0,
        scores.nawaSanga?.score || 0,
        scores.karma?.score || 0,
      ];

      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const idx = i % sides;
        const angle = startAngle + idx * angleStep;
        const val = (values[idx] / 100) * maxR * progress;
        const x = cx + Math.cos(angle) * val;
        const y = cy + Math.sin(angle) * val;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.fillStyle = COLORS.fill;
      ctx.fill();
      ctx.strokeStyle = COLORS.stroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw dots
      for (let i = 0; i < sides; i++) {
        const angle = startAngle + i * angleStep;
        const val = (values[i] / 100) * maxR * progress;
        const x = cx + Math.cos(angle) * val;
        const y = cy + Math.sin(angle) * val;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.dot;
        ctx.fill();
        ctx.strokeStyle = '#0F0D1A';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw labels
      ctx.font = '700 13px Inter, sans-serif'; // Increased size and added bold weight
      ctx.fillStyle = COLORS.text;
      ctx.textAlign = 'center';
      for (let i = 0; i < sides; i++) {
        const angle = startAngle + i * angleStep;
        const lx = cx + Math.cos(angle) * (maxR + 48);
        const ly = cy + Math.sin(angle) * (maxR + 48);
        
        const labelWords = LABELS[i].split(' ');
        if (labelWords.length > 1) {
          ctx.fillText(labelWords[0], lx, ly - 8);
          ctx.fillText(labelWords.slice(1).join(' '), lx, ly + 4);
          ctx.fillStyle = COLORS.dot;
          ctx.fillText(Math.round(values[i] * progress), lx, ly + 18);
        } else {
          ctx.fillText(LABELS[i], lx, ly);
          ctx.fillStyle = COLORS.dot;
          ctx.fillText(Math.round(values[i] * progress), lx, ly + 14);
        }
        ctx.fillStyle = COLORS.text;
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    progress = 0;
    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [scores]);

  return (
    <div className="score-radar">
      <canvas ref={canvasRef} />
    </div>
  );
}

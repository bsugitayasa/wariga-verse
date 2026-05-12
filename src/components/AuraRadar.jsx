import { useRef, useEffect } from 'react';

const LABELS = ['Spiritualitas', 'Kepemimpinan', 'Keberanian', 'Kecerdasan', 'Keindahan', 'Kesejahteraan', 'Kasih Sayang'];
const COLORS = {
  fill: 'rgba(124, 58, 237, 0.15)',
  stroke: 'rgba(124, 58, 237, 0.8)',
  grid: 'rgba(255, 255, 255, 0.06)',
  gridStroke: 'rgba(255, 255, 255, 0.1)',
  text: '#A09BB0',
  dot: '#8B5CF6',
};

export default function AuraRadar({ semanticData }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !semanticData) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 500; // Increased to 500 to ensure no labels ever clip
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = size + 'px';
    canvas.style.aspectRatio = '1 / 1';
    canvas.style.height = 'auto';
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2 + 10;
    const maxR = 100;
    const sides = 7;
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
        semanticData.spiritualDepth || 0,
        semanticData.royalAura || 0,
        semanticData.bravery || 0,
        semanticData.intellect || 0,
        semanticData.beauty || 0,
        semanticData.wealth || 0,
        semanticData.compassion || 0,
      ];

      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const idx = i % sides;
        const angle = startAngle + idx * angleStep;
        const val = (values[idx] / 10) * maxR * progress;
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
        const val = (values[i] / 10) * maxR * progress;
        const x = cx + Math.cos(angle) * val;
        const y = cy + Math.sin(angle) * val;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.dot;
        ctx.fill();
        ctx.strokeStyle = '#0F0D1A';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw labels
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = COLORS.text;
      ctx.textAlign = 'center';
      for (let i = 0; i < sides; i++) {
        const angle = startAngle + i * angleStep;
        // Increase text distance from radar slightly for better breathability
        const lx = cx + Math.cos(angle) * (maxR + 45);
        const ly = cy + Math.sin(angle) * (maxR + 45);
        
        // Split label if it contains spaces to save horizontal room
        const words = LABELS[i].split(' ');
        if (words.length > 1) {
          ctx.fillText(words[0], lx, ly - 8);
          ctx.fillText(words[1], lx, ly + 4);
          ctx.fillStyle = COLORS.dot;
          ctx.fillText(Math.round(values[i] * progress) + '/10', lx, ly + 18);
        } else {
          ctx.fillText(LABELS[i], lx, ly);
          ctx.fillStyle = COLORS.dot;
          ctx.fillText(Math.round(values[i] * progress) + '/10', lx, ly + 14);
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
  }, [semanticData]);

  return (
    <div className="score-radar" style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

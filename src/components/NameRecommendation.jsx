import { useState, useMemo } from 'react';

function getScoreColor(score) {
  if (score >= 80) return 'var(--accent-green)';
  if (score >= 65) return 'var(--gold)';
  if (score >= 45) return 'var(--accent-orange)';
  return 'var(--accent-red)';
}

export default function NameRecommendation({ recommendations }) {
  const [originFilter, setOriginFilter] = useState('all');
  const [minScore, setMinScore] = useState(0);
  const [showCount, setShowCount] = useState(5);

  const origins = useMemo(() => {
    const set = new Set(recommendations.map(r => r.origin));
    return ['all', ...Array.from(set)];
  }, [recommendations]);

  const filtered = useMemo(() => {
    return recommendations
      .filter(r => originFilter === 'all' || r.origin === originFilter)
      .filter(r => r.totalScore >= minScore)
      .slice(0, showCount);
  }, [recommendations, originFilter, minScore, showCount]);

  if (!recommendations?.length) return null;

  return (
    <div id="name-recommendations">
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="section-title">✨ Rekomendasi Nama Terbaik</h2>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0.5rem auto' }}>
          Nama-nama berikut telah dianalisis berdasarkan keselarasan energi keluarga, silsilah (Purusha), dan tradisi Bali.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card filters" style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', padding: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ minWidth: '200px' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.8rem', opacity: 0.8 }}>Filter Asal Nama</label>
          <select className="form-input" value={originFilter} onChange={e => setOriginFilter(e.target.value)} style={{ width: '100%' }}>
            {origins.map((o, idx) => <option key={`${o}-${idx}`} value={o}>{o === 'all' ? 'Semua Asal' : o}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ minWidth: '150px' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.8rem', opacity: 0.8 }}>Skor Minimal: {minScore}</label>
          <input type="range" min="0" max="90" step="5" className="form-range" style={{ width: '100%' }}
            value={minScore} onChange={e => setMinScore(Number(e.target.value))} />
        </div>
      </div>

      {/* Name List */}
      <div className="name-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filtered.map((name, idx) => {
          const rank = idx + 1;
          const uniqueKey = `${name.fullName}-${idx}`;
          return (
            <div key={uniqueKey} className="glass-card name-card animate-fade-in-up" 
              style={{ 
                animationDelay: `${idx * 0.1}s`, 
                opacity: 0,
                padding: '2rem',
                borderLeft: `4px solid ${rank <= 3 ? 'var(--gold)' : 'var(--purple-light)'}`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
              <div className="name-card__content" style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span className="badge badge--gold" style={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '1px' }}>
                      Kandidat {rank}
                    </span>
                    {rank === 1 && <span className="badge badge--purple" style={{ fontSize: '0.65rem' }}>Pilihan Utama</span>}
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                    {name.fullName}
                  </h3>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontStyle: 'italic', opacity: 0.9 }}>
                    "{name.meaning}"
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span className="text-muted">Elemen:</span> <strong style={{ color: 'var(--gold)' }}>{name.element}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span className="text-muted">Arah Nawa Sanga:</span> <strong style={{ color: 'var(--purple-light)' }}>{name.nawaSangaAffinity}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem' }}>
                      <span className="text-muted">Asal:</span> <strong>{name.origin}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Skor Harmoni</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: getScoreColor(name.totalScore), lineHeight: 1 }}>
                    {name.totalScore}
                  </div>
                </div>
              </div>
              
              <div className="name-card__tags" style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {name.tags?.map((tag, tIdx) => (
                  <span key={`${tag}-${tIdx}`} className="badge badge--purple" style={{ opacity: 0.6, fontSize: '0.7rem' }}>#{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card text-muted" style={{ textAlign: 'center', padding: '3rem' }}>
          Tidak ada nama yang sesuai dengan kriteria filter Anda.
        </div>
      )}

      {recommendations.length > showCount && (
        <button className="btn btn--outline" onClick={() => setShowCount(s => s + 10)}
          style={{ marginTop: '3rem', marginInline: 'auto', display: 'block', minWidth: '240px' }}>
          Tampilkan Lebih Banyak Kandidat
        </button>
      )}
    </div>
  );
}

import { useState } from 'react';

export default function NameComparison({ primaryAnalysis, comparisonAnalysis, onCompare }) {
  const [compareName, setCompareName] = useState('');

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--accent-green)';
    if (score >= 65) return 'var(--gold)';
    return 'var(--accent-red)';
  };

  const primary = primaryAnalysis?.breakdown;
  const secondary = comparisonAnalysis?.breakdown;

  return (
    <div className="name-comparison-section" style={{ marginTop: '2rem' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="section-title">⚔️ Bandingkan Nama</h2>
        <p className="section-subtitle">Bandingkan pilihan nama utama Anda dengan alternatif lain secara side-by-side</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Masukkan nama pembanding..." 
            value={compareName}
            onChange={(e) => setCompareName(e.target.value)}
            style={{ flex: 1 }}
          />
            <button 
              className="btn btn--primary" 
              onClick={() => onCompare(compareName)}
              disabled={!compareName.trim()}
            >
              Bandingkan
            </button>
            {comparisonAnalysis && (
              <button 
                className="btn btn--outline" 
                onClick={() => {
                  setCompareName('');
                  onCompare(''); // Assuming sending empty clears it in parent
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

      {comparisonAnalysis && (
        <div className="comparison-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Primary Name */}
          <div className="glass-card animate-fade-in" style={{ border: '2px solid var(--gold)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="badge badge--gold">Nama Utama</span>
              <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{primaryAnalysis.breakdown.numerology.data.wordAnalysis.map(w => w.word).join(' ')}</h3>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: getScoreColor(primaryAnalysis.totalScore) }}>
                {primaryAnalysis.totalScore}
              </div>
            </div>
            
            <ComparisonDetails breakdown={primary} enrichedScores={primaryAnalysis.enrichedScores} />
          </div>

          {/* Comparison Name */}
          <div className="glass-card animate-fade-in" style={{ border: '2px solid var(--purple-light)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="badge badge--purple">Nama Pembanding</span>
              <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{comparisonAnalysis.compareName}</h3>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: getScoreColor(comparisonAnalysis.totalScore) }}>
                {comparisonAnalysis.totalScore}
              </div>
            </div>

            <ComparisonDetails breakdown={secondary} enrichedScores={comparisonAnalysis.enrichedScores} />
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonDetails({ breakdown, enrichedScores }) {
  const metrics = [
    { label: 'Numerologi', key: 'numerology' },
    { label: 'Semantik & Aura', key: 'nlp' },
    { label: 'BaZi', key: 'bazi' },
    { label: 'Wariga Bali', key: 'wariga' },
    { label: 'Jyotisha', key: 'jyotisha' },
    { label: 'Astrologi', key: 'astrology' },
    { label: 'Qimen Dun Jia', key: 'qimen' },
    { label: 'Nawa Sanga', key: 'nawaSanga' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {metrics.map(m => (
        <div key={m.key} className="glass-card" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{m.label}</span>
            <span style={{ fontWeight: 700 }}>{breakdown[m.key].score}</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${breakdown[m.key].score}%`, 
              background: breakdown[m.key].score >= 70 ? 'var(--accent-green)' : 'var(--gold)' 
            }} />
          </div>
        </div>
      ))}
      
      <div className="glass-card" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(124,58,237,0.05)' }}>
        <h5 style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--purple-light)' }}>Identitas Inti:</h5>
        <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
          <strong>Destiny:</strong> {breakdown.numerology.data.destiny} ({breakdown.numerology.data.destinyInterpretation?.title || 'Unknown'})<br />
          <strong>Master Element:</strong> {breakdown.bazi?.data?.dayMasterElement || 'Unknown'}
        </div>
      </div>

      {enrichedScores && (
        <div className="glass-card" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(245,158,11,0.05)' }}>
          <h5 style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--gold)' }}>Ekstensi Metafisika:</h5>
          <div style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Stabilitas Numerologi:</span> <strong>{enrichedScores.numerologyStability}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Spiritual Depth:</span> <strong>{enrichedScores.spiritualDepth}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Royal Aura:</span> <strong>{enrichedScores.royalAura}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Bali Authenticity:</span> <strong>{enrichedScores.baliAuthenticity}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Beban Karmik:</span> 
              <strong style={{ color: enrichedScores.karmicLoad > 50 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {enrichedScores.karmicLoad}%
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

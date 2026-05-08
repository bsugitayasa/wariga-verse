export default function LifePatternTimeline({ lifePattern }) {
  if (!lifePattern?.length) return null;

  return (
    <div id="life-pattern">
      <h2 style={{ marginBottom: '0.5rem' }}>
        <span style={{ marginRight: '0.5rem' }}>🌿</span>
        Pola Kehidupan
      </h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Pemetaan fase kehidupan berdasarkan kombinasi Wariga, Numerologi, dan Karma keluarga.
      </p>

      <div className="timeline">
        {lifePattern.map((phase, idx) => (
          <div key={phase.phase} className="timeline__item animate-fade-in-up" style={{ animationDelay: `${idx * 0.15}s`, opacity: 0 }}>
            <div className="timeline__dot" style={{
              background: idx === 0 ? 'var(--gold)' : idx === 1 ? 'var(--purple-light)' : idx === 2 ? 'var(--accent-green)' : 'var(--accent-blue)',
            }} />
            <div className="timeline__phase">
              <span>{phase.icon}</span>
              {phase.phase}
            </div>
            <div className="timeline__content">
              <p><strong>Energi:</strong> {phase.energy}</p>
              <p><strong>Tema:</strong> {phase.theme}</p>
              <p><strong>Kekuatan:</strong> {phase.strength}</p>
              <p><strong>Tantangan:</strong> {phase.challenge}</p>
              <div style={{ marginTop: '0.5rem' }}>
                <span className="timeline__tag">{phase.energy.split(' ')[0]}</span>
                <span className="timeline__tag">{phase.theme.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

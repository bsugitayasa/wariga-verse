export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__logo">
          <img src="/logo.png" alt="Wariga Verse Logo" className="header__logo-img" />
          <div>
            <div className="header__title text-gradient">Wariga Verse</div>
            <div className="header__subtitle">Devine Guidance & Celestial Wisdom | Rekomendasi & Analisa Nama</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="text-bali" style={{ fontSize: '1rem', color: 'var(--gold)' }}>
            ᬒᬁ ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ
          </div>

          <button
            onClick={onToggleTheme}
            className="theme-toggle"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
}

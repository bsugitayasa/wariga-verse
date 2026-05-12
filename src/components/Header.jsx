export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__logo">
          <div className="header__logo-icon">🕉️</div>
          <div>
            <div className="header__title text-gradient">Wariga Verse</div>
            <div className="header__subtitle">Rekomendasi & Analisa Nama</div>
          </div>
        </div>
        <div className="text-bali" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          ᬒᬁ ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ
        </div>
      </div>
    </header>
  );
}

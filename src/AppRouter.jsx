import { Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AdsPage = lazy(() => import('./pages/AdsPage'));
const App = lazy(() => import('./App'));

function LoadingFallback() {
  return (
    <div className="loading" style={{ minHeight: '60vh' }}>
      <div className="loading__spinner"></div>
      <p className="loading__text">Memuat halaman...</p>
    </div>
  );
}

export default function AppRouter() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<App />} />
          <Route path="/iklan" element={<AdsPage />} />
        </Routes>
      </Suspense>

      {/* Footer */}
      <footer className="footer container" style={{ marginTop: '4rem', paddingBottom: '2rem', textAlign: 'center' }}>
        <div className="footer__links">
          <a href="/" className="footer__link">Beranda</a>
          <span className="footer__divider">·</span>
          <a href="/app" className="footer__link">Analisis</a>
          <span className="footer__divider">·</span>
          <a href="/iklan" className="footer__link">Beriklan</a>
        </div>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>© {new Date().getFullYear()} Wariga Verse — Rekomendasi Nama & Analisis Metafisika</p>
        <p style={{ marginTop: '0.5rem' }}>
          <span className="text-bali" style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>ᬒᬁ ᬰᬵᬦ᭄ᬢᬶᬄ ᬰᬵᬦ᭄ᬢᬶᬄ ᬰᬵᬦ᭄ᬢᬶᬄ</span>
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '1rem auto' }}>
          Aplikasi ini bersifat referensi. Selalu konsultasikan dengan ahli Wariga atau praktisi spiritual untuk keputusan penting terkait nama dan ritual.
        </p>
      </footer>
    </>
  );
}

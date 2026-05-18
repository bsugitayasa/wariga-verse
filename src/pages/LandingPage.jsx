import { Link } from 'react-router-dom';
import { useState } from 'react';
import SEOHead from '../components/SEOHead';
import { siteConfig } from '../config/site';

const features = [
  {
    icon: '🏝️',
    title: 'Wariga Bali',
    description: 'Kalkulasi lengkap Wuku, Saptawara, Pancawara, dan Urip berdasarkan kalender tradisional Bali untuk menentukan hari lahir dan energi spiritual.',
  },
  {
    icon: '🔢',
    title: 'Numerologi Multi-Sistem',
    description: 'Analisis mendalam menggunakan Pythagorean, Chaldean, dan Primbon Indonesia. Life Path, Expression, Soul Urge, dan Karmic Debt Number.',
  },
  {
    icon: '🧭',
    title: 'Nawa Sanga',
    description: 'Pemetaan energi berdasarkan 9 arah mata angin dalam kosmologi Hindu Bali. Temukan arah spiritual dan Dewata pelindung Anda.',
  },
  {
    icon: '⭐',
    title: 'Astrologi Jyotish',
    description: 'Integrasi sistem astrologi Vedik India untuk analisis zodiak dan periode kehidupan berdasarkan posisi bintang saat kelahiran.',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Harmoni Keluarga',
    description: 'Analisis keselarasan energi antara ayah, ibu, dan anak. Skor kompatibilitas keluarga dan saran penyelarasan.',
  },
  {
    icon: '✨',
    title: 'Rekomendasi Nama',
    description: 'Engine AI merekomendasikan nama terbaik berdasarkan semua parameter metafisika, dengan skor harmoni dan makna mendalam.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Masukkan Data Kelahiran',
    description: 'Isi nama dan tanggal lahir ayah, ibu, dan anak (atau diri sendiri) untuk memulai analisis.',
  },
  {
    number: '02',
    title: 'Analisis Multi-Dimensi',
    description: 'Engine kami menghitung keselarasan dari 6+ sistem metafisika secara bersamaan dalam hitungan detik.',
  },
  {
    number: '03',
    title: 'Dapatkan Rekomendasi',
    description: 'Lihat dashboard analisis lengkap, skor harmoni, dan rekomendasi nama terbaik dengan penjelasan detail.',
  },
];

const faqs = [
  {
    q: 'Apa itu Wariga Verse?',
    a: 'Wariga Verse adalah aplikasi analisis metafisika dan rekomendasi nama yang menggabungkan kebijaksanaan tradisional Bali (Wariga), numerologi modern (Pythagorean & Chaldean), astrologi Vedik (Jyotish), dan sistem Nawa Sanga untuk memberikan panduan spiritual yang komprehensif.',
  },
  {
    q: 'Apakah hasil analisis ini akurat?',
    a: 'Kalkulasi kami didasarkan pada rumus tradisional Wariga Bali dan numerologi yang telah digunakan selama berabad-abad. Namun, aplikasi ini bersifat referensi. Selalu konsultasikan dengan ahli Wariga atau praktisi spiritual untuk keputusan penting.',
  },
  {
    q: 'Apakah bisa digunakan untuk analisis diri sendiri?',
    a: 'Ya! Anda bisa menggunakan mode "Analisis Diri Sendiri" untuk menganalisis numerologi dan aspek metafisika dari nama dan tanggal lahir Anda sendiri, termasuk Life Path Number dan Karmic Debt.',
  },
  {
    q: 'Apakah layanan ini gratis?',
    a: 'Ya, Wariga Verse saat ini dapat digunakan secara gratis. Kami berencana menambahkan fitur premium di masa depan untuk analisis yang lebih mendalam.',
  },
  {
    q: 'Bagaimana sistem rekomendasi nama bekerja?',
    a: 'Engine kami menganalisis harmoni energi antara nama orang tua, tanggal lahir, gender, dan urutan kelahiran, lalu mencocokkan dengan database nama Sanskrit/Vedik yang telah dikurasi berdasarkan skor kompatibilitas dari semua sistem metafisika.',
  },
  {
    q: 'Apakah data saya aman?',
    a: 'Semua kalkulasi dilakukan langsung di browser Anda (client-side). Kami tidak menyimpan data pribadi Anda di server manapun. Data Anda tetap aman dan privat.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <SEOHead
        title=""
        description="Wariga Verse — Aplikasi rekomendasi nama dan analisis metafisika berdasarkan Wariga Bali, Numerologi, Astrologi Jyotish, Nawa Sanga, dan Karma Keluarga. Gratis dan privat."
        path="/"
      />

      <main className="landing">
        {/* ====== HERO SECTION ====== */}
        <section className="landing__hero" id="hero">
          <div className="landing__hero-bg">
            <div className="landing__hero-orb landing__hero-orb--1"></div>
            <div className="landing__hero-orb landing__hero-orb--2"></div>
            <div className="landing__hero-orb landing__hero-orb--3"></div>
          </div>
          <div className="container landing__hero-content">
            <div className="landing__hero-badge animate-fade-in">
              <span>🙏</span> Kebijaksanaan Tradisional × Teknologi Modern
            </div>
            <h1 className="landing__hero-title animate-fade-in-up">
              Temukan <span className="text-gradient">Harmoni Nama</span> Melalui Kebijaksanaan Semesta
            </h1>
            <p className="landing__hero-desc animate-fade-in-up stagger-1">
              Analisis metafisika multi-dimensi menggabungkan <strong>Wariga Bali</strong>, <strong>Numerologi</strong>, <strong>Astrologi Jyotish</strong>, dan <strong>Nawa Sanga</strong> — untuk panduan spiritual yang komprehensif dalam memilih nama.
            </p>
            <div className="landing__hero-actions animate-fade-in-up stagger-2">
              <Link to="/app" className="btn btn--primary btn--lg" id="cta-hero">
                ✨ Mulai Analisis Gratis
              </Link>
              <a href="#features" className="btn btn--secondary btn--lg" id="cta-learn-more">
                Pelajari Lebih Lanjut
              </a>
            </div>
            <div className="landing__hero-stats animate-fade-in stagger-3">
              <div className="landing__stat">
                <span className="landing__stat-value">6+</span>
                <span className="landing__stat-label">Sistem Metafisika</span>
              </div>
              <div className="landing__stat-divider"></div>
              <div className="landing__stat">
                <span className="landing__stat-value">100%</span>
                <span className="landing__stat-label">Privasi Terjaga</span>
              </div>
              <div className="landing__stat-divider"></div>
              <div className="landing__stat">
                <span className="landing__stat-value">∞</span>
                <span className="landing__stat-label">Analisis Gratis</span>
              </div>
            </div>
          </div>
        </section>

        {/* ====== FEATURES SECTION ====== */}
        <section className="landing__features section" id="features">
          <div className="container">
            <div className="landing__section-header">
              <span className="landing__section-badge">Fitur Unggulan</span>
              <h2 className="landing__section-title">
                Analisis <span className="text-gradient">Multi-Dimensi</span> Terlengkap
              </h2>
              <p className="landing__section-desc">
                Menggabungkan 6 sistem kebijaksanaan spiritual dalam satu platform yang mudah digunakan
              </p>
            </div>
            <div className="landing__features-grid">
              {features.map((f, i) => (
                <div key={i} className="landing__feature-card glass-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="landing__feature-icon">{f.icon}</div>
                  <h3 className="landing__feature-title">{f.title}</h3>
                  <p className="landing__feature-desc">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== HOW IT WORKS SECTION ====== */}
        <section className="landing__steps section" id="how-it-works">
          <div className="container">
            <div className="landing__section-header">
              <span className="landing__section-badge">Cara Kerja</span>
              <h2 className="landing__section-title">
                Mudah & <span className="text-gradient">Cepat</span>
              </h2>
              <p className="landing__section-desc">
                Hanya 3 langkah untuk mendapatkan analisis spiritual yang mendalam
              </p>
            </div>
            <div className="landing__steps-grid">
              {steps.map((s, i) => (
                <div key={i} className="landing__step-card animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="landing__step-number">{s.number}</div>
                  <h3 className="landing__step-title">{s.title}</h3>
                  <p className="landing__step-desc">{s.description}</p>
                  {i < steps.length - 1 && <div className="landing__step-arrow">→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== FAQ SECTION ====== */}
        <section className="landing__faq section" id="faq">
          <div className="container">
            <div className="landing__section-header">
              <span className="landing__section-badge">FAQ</span>
              <h2 className="landing__section-title">
                Pertanyaan <span className="text-gradient">Umum</span>
              </h2>
            </div>
            <div className="landing__faq-list">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`landing__faq-item glass-card ${openFaq === i ? 'landing__faq-item--open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="landing__faq-question">
                    <h3>{faq.q}</h3>
                    <span className="landing__faq-toggle">{openFaq === i ? '−' : '+'}</span>
                  </div>
                  {openFaq === i && (
                    <div className="landing__faq-answer animate-fade-in">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== FINAL CTA SECTION ====== */}
        <section className="landing__cta section" id="cta-final">
          <div className="container">
            <div className="landing__cta-card glass-card">
              <div className="landing__cta-glow"></div>
              <span className="text-bali landing__cta-mantra" style={{ color: 'var(--gold)' }}>
                ᬒᬁ ᬰᬵᬦ᭄ᬢᬶᬄ ᬰᬵᬦ᭄ᬢᬶᬄ ᬰᬵᬦ᭄ᬢᬶᬄ
              </span>
              <h2 className="landing__cta-title">
                Siap Menemukan <span className="text-gradient">Nama Terbaik</span>?
              </h2>
              <p className="landing__cta-desc">
                Biarkan kebijaksanaan semesta memandu Anda. Analisis gratis, privat, dan langsung di browser Anda.
              </p>
              <Link to="/app" className="btn btn--primary btn--lg" id="cta-bottom">
                ✨ Mulai Sekarang — Gratis
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

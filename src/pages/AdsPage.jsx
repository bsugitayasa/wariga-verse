import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { adsConfig } from '../config/ads';
import { siteConfig } from '../config/site';

const placements = [
  {
    id: 'header-banner',
    icon: '🔝',
    name: 'Banner Header',
    position: 'Di bawah navigation bar',
    visibility: 'Sangat Tinggi',
    size: '728×90 / 320×50 (mobile)',
    best: 'Branding & awareness',
  },
  {
    id: 'in-content',
    icon: '📄',
    name: 'In-Content',
    position: 'Di antara section hasil analisis',
    visibility: 'Tinggi',
    size: '728×90 / 300×250 (mobile)',
    best: 'Engagement & conversions',
  },
  {
    id: 'sidebar',
    icon: '📌',
    name: 'Sidebar',
    position: 'Di samping konten utama',
    visibility: 'Sedang',
    size: '300×250 (desktop only)',
    best: 'Retargeting & affiliate',
  },
  {
    id: 'footer-banner',
    icon: '🔻',
    name: 'Footer Banner',
    position: 'Di atas footer',
    visibility: 'Sedang',
    size: '728×90 / 320×50 (mobile)',
    best: 'Supplementary offers',
  },
];

const audiences = [
  { icon: '🙏', label: 'Umat Hindu & Praktisi Spiritual', pct: '65%' },
  { icon: '👶', label: 'Calon Orang Tua', pct: '45%' },
  { icon: '🏝️', label: 'Masyarakat Bali', pct: '50%' },
  { icon: '📱', label: 'Usia 25–45 Tahun', pct: '70%' },
  { icon: '🔮', label: 'Penggemar Numerologi & Astrologi', pct: '40%' },
  { icon: '📚', label: 'Pencari Pengetahuan Budaya', pct: '30%' },
];

export default function AdsPage() {
  return (
    <>
      <SEOHead
        title="Beriklan"
        description="Beriklan di Wariga Verse — Jangkau audience spiritual, umat Hindu, dan pencari nama dengan iklan bertarget di platform metafisika terpercaya."
        path="/iklan"
      />

      <main className="ads-page">
        {/* ====== HERO ====== */}
        <section className="ads-page__hero section">
          <div className="container">
            <div className="landing__section-header">
              <span className="landing__section-badge">Advertising</span>
              <h1 className="landing__section-title" style={{ fontSize: '2.5rem' }}>
                Beriklan di <span className="text-gradient">Wariga Verse</span>
              </h1>
              <p className="landing__section-desc" style={{ maxWidth: '700px' }}>
                Jangkau audiens yang unik — calon orang tua, umat Hindu, praktisi spiritual, dan pencinta budaya Bali — melalui platform metafisika yang terpercaya.
              </p>
            </div>
          </div>
        </section>

        {/* ====== AUDIENCE ====== */}
        <section className="ads-page__audience section" id="audience">
          <div className="container">
            <div className="landing__section-header">
              <span className="landing__section-badge">Target Audience</span>
              <h2 className="landing__section-title">
                Siapa yang <span className="text-gradient">Mengunjungi</span> Kami?
              </h2>
            </div>
            <div className="ads-page__audience-grid">
              {audiences.map((a, i) => (
                <div key={i} className="ads-page__audience-card glass-card animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="ads-page__audience-icon">{a.icon}</div>
                  <div className="ads-page__audience-info">
                    <span className="ads-page__audience-label">{a.label}</span>
                    <span className="ads-page__audience-pct">{a.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== AD PLACEMENTS ====== */}
        <section className="ads-page__placements section" id="placements">
          <div className="container">
            <div className="landing__section-header">
              <span className="landing__section-badge">Penempatan Iklan</span>
              <h2 className="landing__section-title">
                Pilih <span className="text-gradient">Posisi</span> Terbaik
              </h2>
              <p className="landing__section-desc">
                4 posisi strategis untuk memaksimalkan visibilitas brand Anda
              </p>
            </div>
            <div className="ads-page__placements-grid">
              {placements.map((p, i) => (
                <div key={i} className="ads-page__placement-card glass-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="ads-page__placement-icon">{p.icon}</div>
                  <h3 className="ads-page__placement-name">{p.name}</h3>
                  <div className="ads-page__placement-details">
                    <div className="ads-page__placement-row">
                      <span className="ads-page__placement-label">Posisi</span>
                      <span>{p.position}</span>
                    </div>
                    <div className="ads-page__placement-row">
                      <span className="ads-page__placement-label">Visibilitas</span>
                      <span className={`badge badge--${p.visibility === 'Sangat Tinggi' ? 'gold' : p.visibility === 'Tinggi' ? 'green' : 'purple'}`}>
                        {p.visibility}
                      </span>
                    </div>
                    <div className="ads-page__placement-row">
                      <span className="ads-page__placement-label">Ukuran</span>
                      <span style={{ fontSize: '0.85rem' }}>{p.size}</span>
                    </div>
                    <div className="ads-page__placement-row">
                      <span className="ads-page__placement-label">Terbaik untuk</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>{p.best}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== PRICING ====== */}
        <section className="ads-page__pricing section" id="pricing">
          <div className="container">
            <div className="landing__section-header">
              <span className="landing__section-badge">Harga</span>
              <h2 className="landing__section-title">
                Pilih <span className="text-gradient">Paket</span> Iklan
              </h2>
              <p className="landing__section-desc">
                Investasi cerdas untuk menjangkau audiens berkualitas tinggi
              </p>
            </div>
            <div className="ads-page__pricing-grid">
              {adsConfig.pricing.map((plan) => (
                <div
                  key={plan.id}
                  className={`ads-page__pricing-card glass-card ${plan.highlighted ? 'ads-page__pricing-card--highlighted' : ''}`}
                >
                  {plan.highlighted && (
                    <div className="ads-page__pricing-popular">✨ Paling Populer</div>
                  )}
                  <h3 className="ads-page__pricing-name">{plan.name}</h3>
                  <div className="ads-page__pricing-price">
                    <span className="ads-page__pricing-amount">{plan.price}</span>
                    {plan.period && <span className="ads-page__pricing-period">{plan.period}</span>}
                  </div>
                  <p className="ads-page__pricing-desc">{plan.description}</p>
                  <ul className="ads-page__pricing-features">
                    {plan.features.map((f, i) => (
                      <li key={i}>
                        <span className="ads-page__pricing-check">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.id === 'custom'
                      ? siteConfig.contact.whatsappLink + '?text=' + encodeURIComponent(`Halo, saya tertarik dengan paket iklan ${plan.name} di Wariga Verse.`)
                      : siteConfig.contact.whatsappLink + '?text=' + encodeURIComponent(`Halo, saya tertarik dengan paket iklan ${plan.name} (${plan.price}${plan.period}) di Wariga Verse.`)
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn ${plan.highlighted ? 'btn--primary' : 'btn--secondary'}`}
                    style={{ width: '100%', marginTop: 'auto' }}
                  >
                    {plan.id === 'custom' ? '💬 Hubungi Kami' : '📩 Pesan Sekarang'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== HOW IT WORKS ====== */}
        <section className="ads-page__mechanism section" id="mechanism">
          <div className="container">
            <div className="landing__section-header">
              <span className="landing__section-badge">Mekanisme</span>
              <h2 className="landing__section-title">
                Bagaimana <span className="text-gradient">Cara Beriklan</span>?
              </h2>
            </div>
            <div className="landing__steps-grid">
              <div className="landing__step-card animate-fade-in-up">
                <div className="landing__step-number">01</div>
                <h3 className="landing__step-title">Pilih Paket</h3>
                <p className="landing__step-desc">Pilih paket iklan sesuai budget dan tujuan marketing Anda. Bisa mulai dari Rp 150.000/bulan.</p>
              </div>
              <div className="landing__step-card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <div className="landing__step-number">02</div>
                <h3 className="landing__step-title">Kirim Materi</h3>
                <p className="landing__step-desc">Kirimkan banner/materi iklan via WhatsApp atau email. Tim kami akan review dalam 1×24 jam.</p>
              </div>
              <div className="landing__step-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="landing__step-number">03</div>
                <h3 className="landing__step-title">Tayang & Laporan</h3>
                <p className="landing__step-desc">Iklan Anda langsung tayang setelah pembayaran. Dapatkan laporan performa secara berkala.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ====== CONTACT CTA ====== */}
        <section className="ads-page__contact section" id="contact">
          <div className="container">
            <div className="landing__cta-card glass-card">
              <div className="landing__cta-glow"></div>
              <h2 className="landing__cta-title">
                Tertarik <span className="text-gradient">Beriklan</span>?
              </h2>
              <p className="landing__cta-desc">
                Hubungi kami untuk konsultasi gratis dan penawaran terbaik
              </p>
              <div className="ads-page__contact-actions">
                <a
                  href={siteConfig.contact.whatsappLink + '?text=' + encodeURIComponent('Halo, saya tertarik beriklan di Wariga Verse. Bisa info lebih lanjut?')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary btn--lg"
                  id="cta-whatsapp"
                >
                  💬 WhatsApp: {siteConfig.contact.whatsappDisplay}
                </a>
                <a
                  href={siteConfig.contact.emailLink + '?subject=' + encodeURIComponent('Inquiry Iklan Wariga Verse')}
                  className="btn btn--secondary btn--lg"
                  id="cta-email"
                >
                  📧 {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

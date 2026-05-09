import { useState } from 'react';
import ScoreRadar from './ScoreRadar';
import NawaSangaCompass from './NawaSangaCompass';

const TABS = [
  { key: 'overview', icon: '📊', label: 'Ringkasan' },
  { key: 'wariga', icon: '📜', label: 'Wariga Bali' },
  { key: 'numerology', icon: '🔢', label: 'Numerologi' },
  { key: 'astrology', icon: '🌌', label: 'Astrologi' },
  { key: 'jyotisha', icon: '🕉️', label: 'Jyotisha' },
  { key: 'bazi', icon: '📅', label: 'BaZi' },
  { key: 'qimen', icon: '⚔️', label: 'Qimen Dun Jia' },
  { key: 'nawaSanga', icon: '🧭', label: 'Nawa Sanga' },
];

function getScoreClass(score) {
  if (score >= 80) return 'score--excellent';
  if (score >= 65) return 'score--good';
  if (score >= 45) return 'score--moderate';
  return 'score--low';
}

export default function AnalysisDashboard({ analysis }) {
  const [activeTab, setActiveTab] = useState('overview');
  if (!analysis) return null;

  const { totalScore, breakdown, recommendation } = analysis;

  return (
    <div className="dashboard animate-fade-in-up" id="analysis-dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__total-score">
          <div className="score-circle" style={{ '--score-pct': `${totalScore}%` }}>
            <span className={getScoreClass(totalScore)}>{totalScore}</span>
          </div>
          <div>
            <h2 style={{ marginBottom: '4px' }}>Skor Keselarasan</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>{recommendation}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" id="dashboard-tabs">
        {TABS.map(tab => (
          <button key={tab.key}
            className={`tab ${activeTab === tab.key ? 'tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="dashboard__content" key={activeTab}>
        {activeTab === 'overview' && <OverviewTab breakdown={breakdown} />}
        {activeTab === 'wariga' && <WarigaTab data={breakdown.wariga} isSelf={analysis.isSelfAnalysis} />}
        {activeTab === 'numerology' && <NumerologyTab data={breakdown.numerology} isSelf={analysis.isSelfAnalysis} />}
        {activeTab === 'astrology' && <AstrologyTab data={breakdown.astrology} />}
        {activeTab === 'jyotisha' && <JyotishaTab data={breakdown.jyotisha} />}
        {activeTab === 'bazi' && <BaziTab data={breakdown.bazi} />}
        {activeTab === 'qimen' && <QimenTab data={breakdown.qimen} />}
        {activeTab === 'nawaSanga' && <NawaSangaTab data={breakdown.nawaSanga} />}
      </div>
    </div>
  );
}

function BaziTab({ data }) {
  const bazi = data?.data;
  if (!bazi) return <div className="glass-card text-muted">Data BaZi tidak tersedia</div>;

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '1.5rem' }}>📅 BaZi — Empat Pilar Takdir</h3>
      
      {/* Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '1.5rem' }}>
        {['Jam', 'Hari', 'Bulan', 'Tahun'].map(p => <div key={p} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p}</div>)}
        {Object.entries(bazi.pillars).reverse().map(([key, p]) => (
          <div key={key} className="glass-card" style={{ padding: '0.75rem 0.25rem', background: 'rgba(255,255,255,0.02)', border: key === 'day' ? '1px solid var(--purple-light)' : '1px solid transparent' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.stem.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{p.stem.element}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>{p.branch.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.branch.animal}</div>
          </div>
        ))}
      </div>

      {/* Guide for Laypeople */}
      <div className="glass-card" style={{ padding: '1rem', background: 'rgba(124,58,237,0.05)', marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--purple-light)', marginBottom: '0.75rem' }}>💡 Cara Membaca BaZi untuk Orang Awam</h4>
        <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.5' }}>
          <li><strong>Pilar Hari (Day Master):</strong> Karakter asli anak. Fokus pada elemen <strong>{bazi.dayMaster.element}</strong> di sini.</li>
          <li><strong>Pilar Tahun:</strong> Mewakili warisan leluhur dan kesan pertama di masyarakat.</li>
          <li><strong>Pilar Bulan:</strong> Mewakili potensi karier dan hubungan dengan orang tua.</li>
          <li><strong>Pilar Jam:</strong> Mewakili aspirasi, masa tua, dan hubungan dengan keturunannya nanti.</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ flex: 1, padding: '1rem' }}>
          <h5 style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>Day Master (Inti Karakter)</h5>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple-light)' }}>{bazi.dayMaster.name}</span>
            <span className="badge badge--gold">{bazi.dayMaster.element} {bazi.dayMaster.polarity}</span>
          </div>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            Karakter utama anak didominasi oleh energi {bazi.dayMaster.element}.
          </p>
        </div>
        <div className="glass-card" style={{ flex: 1, padding: '1rem' }}>
          <h5 style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>Keseimbangan Elemen</h5>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Object.entries(bazi.elementBalance).map(([el, count]) => (
              <div key={el} style={{ flex: 1, height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${(count/8)*100}%`, background: 'var(--gold)', opacity: 0.6 }} />
                <div style={{ position: 'relative', fontSize: '0.6rem', textAlign: 'center', lineHeight: '24px' }}>{el.charAt(0)}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            {bazi.missingElements.length > 0 ? `Kurang: ${bazi.missingElements.join(', ')}` : 'Elemen Seimbang'}
          </p>
        </div>
      </div>
    </div>
  );
}

function QimenTab({ data }) {
  const qimen = data?.data;
  if (!qimen) return <div className="glass-card text-muted">Data Qimen tidak tersedia</div>;

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '1.5rem' }}>⚔️ Qimen Dun Jia — Strategi Spiritual</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '0.75rem', textAlign: 'center', background: 'rgba(245,158,11,0.05)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Gerbang (Action)</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{qimen.gate}</div>
        </div>
        <div className="glass-card" style={{ padding: '0.75rem', textAlign: 'center', background: 'rgba(124,58,237,0.05)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Bintang (Environment)</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{qimen.star}</div>
        </div>
        <div className="glass-card" style={{ padding: '0.75rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Dewa (Spiritual)</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{qimen.spirit}</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1rem', background: 'rgba(245,158,11,0.05)', marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--gold)', marginBottom: '0.75rem' }}>💡 Cara Membaca Qimen Dun Jia</h4>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '0.5rem' }}>Qimen Dun Jia adalah peta energi saat kelahiran yang menunjukkan "keadaan lapangan" hidup anak:</p>
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li><strong>Gerbang ({qimen.gate}):</strong> Mewakili tindakan manusia dan emosi. Menunjukkan bagaimana anak berinteraksi dengan dunia.</li>
            <li><strong>Bintang ({qimen.star}):</strong> Mewakili tren kosmik dan kondisi lingkungan yang mendukung atau menghambat.</li>
            <li><strong>Dewa ({qimen.spirit}):</strong> Mewakili bantuan spiritual atau "bawah sadar" yang membimbing anak.</li>
          </ul>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1rem', borderLeft: '4px solid var(--gold)' }}>
        <h5 style={{ marginBottom: '0.5rem', color: 'var(--gold)' }}>Analisis Strategis:</h5>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{qimen.description}</p>
      </div>
    </div>
  );
}



function JyotishaTab({ data }) {
  const jyo = data?.data;
  if (!jyo) return <div className="glass-card text-muted">Data tidak tersedia</div>;

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '1.5rem' }}>🕉️ Analisis Jyotisha (Vedic Astrology)</h3>
      
      {/* Summary Grid */}
      <div className="grid-2">
        <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ color: 'var(--gold)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Janma Nakshatra</h4>
              <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{jyo.nakshatra}</p>
            </div>
            <span className="badge badge--gold">Pada {jyo.pada}</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            {jyo.nakshatraDescription}
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge--purple">Penguasa: {jyo.nakshatraRuler}</span>
            <span className="badge badge--gold">Kualitas: {jyo.nakshatraQuality}</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.02)' }}>
          <h4 style={{ color: 'var(--purple-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Chandra Rashi</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{jyo.rashi}</p>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Zodiak Bulan (Vedic Moon Sign). Dikuasai oleh planet <strong>{jyo.rashiRuler}</strong>.
          </p>
        </div>
      </div>

      {/* Guide for Laypeople */}
      <div className="glass-card" style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)' }}>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--gold)', marginBottom: '0.75rem' }}>💡 Cara Membaca Jyotisha</h4>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li><strong>Nakshatra ({jyo.nakshatra}):</strong> Adalah "Bintang Kelahiran" Anda. Ini adalah faktor terpenting dalam astrologi India untuk menentukan nasib dan karakter.</li>
            <li><strong>Pada ({jyo.pada}):</strong> Setiap Nakshatra dibagi menjadi 4 bagian. Ini memberikan detail lebih spesifik tentang energi kelahiran Anda.</li>
            <li><strong>Suku Kata Nama:</strong> Di bawah ini adalah bunyi getaran suara yang paling harmonis untuk mengawali nama anak agar selaras dengan alam semesta.</li>
          </ul>
        </div>
      </div>

      {/* Naming Recommendations */}
      <div className="glass-card" style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(245,158,11,0.05)' }}>
        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔤 Rekomendasi Fonetik (Nama Akshara)</span>
        </h4>
        <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
          Berdasarkan Nakshatra dan Pada Anda, nama yang diawali dengan suku kata berikut dianggap membawa keberuntungan paling besar:
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {jyo.recommendedSyllables.map((s, idx) => (
            <div key={`${s}-${idx}`} style={{ 
              padding: '0.75rem 1.5rem', 
              background: idx + 1 === jyo.pada ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
              color: idx + 1 === jyo.pada ? '#000' : 'var(--text-primary)',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1.2rem',
              border: '1px solid rgba(245,158,11,0.3)',
              textAlign: 'center',
              minWidth: '60px'
            }}>
              {s}
              <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>Pada {idx + 1}</div>
            </div>
          ))}
        </div>
        {data.score > 0 && (
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>
            ✨ Tip: Gunakan suku kata "<strong>{jyo.targetSyllable}</strong>" (Pada {jyo.pada}) untuk hasil maksimal.
          </p>
        )}
      </div>
      
      <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Skor Keselarasan Jyotisha: <span className={getScoreClass(data.score)} style={{ fontWeight: 700 }}>{data.score}</span>
      </div>
    </div>
  );
}

function OverviewTab({ breakdown }) {
  return (
    <div className="glass-card">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        <div style={{ flex: '1 1 350px' }}>
          <ScoreRadar scores={breakdown} />
        </div>
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(breakdown).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>
                    {key === 'nawaSanga' ? 'Nawa Sanga' : key === 'bazi' ? 'BaZi' : key === 'qimen' ? 'Qimen Dun Jia' : key}
                  </span>
                  <span className={`${getScoreClass(val.score)}`} style={{ fontWeight: 600 }}>{val.score}</span>
                </div>
                <div style={{
                  height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', width: `${val.score}%`, borderRadius: '3px',
                    background: val.score >= 70 ? 'var(--accent-green)' : val.score >= 50 ? 'var(--gold)' : 'var(--accent-orange)',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '35px' }}>
                {Math.round(val.weight * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WarigaTab({ data, isSelf }) {
  const child = data?.data?.child;
  if (!child) return <div className="glass-card text-muted">Data tidak tersedia</div>;

  const dauh = child.dauh;

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '1.5rem' }}>📜 Analisis Wariga Bali {isSelf ? '' : '— Anak'}</h3>
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* Wewaran Section */}
        <div className="glass-card" style={{ padding: '1rem' }}>
          <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>Saptawara</h4>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            {child.saptawara.name} <span className="text-bali">{child.saptawara.nameBali}</span>
          </p>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            ({child.saptawara.alias}) — Urip: {child.saptawara.urip}
          </p>
        </div>
        <div className="glass-card" style={{ padding: '1rem' }}>
          <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>Pancawara</h4>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            {child.pancawara.name} <span className="text-bali">{child.pancawara.nameBali}</span>
          </p>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Urip: {child.pancawara.urip}</p>
        </div>
        <div className="glass-card" style={{ padding: '1rem', gridColumn: '1 / -1' }}>
          <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>Wuku {child.wuku.name}</h4>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Urip Wuku: {child.wuku.urip} — Dewa Pelindung: {child.wuku.deity}
          </p>
          <p style={{ fontSize: '0.9rem' }}>{child.wuku.watak}</p>
        </div>

        {/* Dauh Section */}
        {dauh && (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--gold)' }}>🕒 Analisis Dauh (Pembagian Waktu)</h4>
              <span className="badge badge--purple">{dauh.timeLabel}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Asta Dauh</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700 }}>Dauh {dauh.asta.index}</span>
                  <span className={`badge ${dauh.asta.quality === 'Ayu' ? 'badge--green' : 'badge--orange'}`}>
                    {dauh.asta.quality}
                  </span>
                </div>
              </div>
              
              <div className="glass-card" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Panca Dauh</div>
                <div style={{ fontWeight: 700 }}>{dauh.panca.name} (Dauh {dauh.panca.index})</div>
              </div>

              <div className="glass-card" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Dasa Dauh (Kualitas Waktu)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>{dauh.dasa.name}</span>
                  <span className={`badge ${dauh.dasa.quality === 'Ayu' ? 'badge--green' : 'badge--orange'}`}>
                    {dauh.dasa.quality}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>— {dauh.dasa.description}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1rem', background: 'rgba(124,58,237,0.08)', borderRadius: '12px' }}>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Otonan</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--purple-light)' }}>{child.otonanDescription}</p>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Urip Total: <strong>{child.uripTotal}</strong></p>
        </div>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Skor Wariga {isSelf ? 'Personal' : 'Keluarga'}: <span className={getScoreClass(data.score)} style={{ fontWeight: 700 }}>{data.score}</span>
      </div>
    </div>
  );
}

function NumerologyTab({ data, isSelf }) {
  const num = data?.data;
  if (!num) return <div className="glass-card text-muted">Data tidak tersedia</div>;

  const items = [
    { label: 'Atma (Soul Urge)', value: num.atma, interp: num.atmaInterpretation },
    { label: 'Tanggal (Birth Day)', value: num.tanggal, interp: num.tanggalInterpretation },
    { label: 'Swara (Expression)', value: num.swara, interp: num.swaraInterpretation, breakdown: num.destinyBreakdown },
    { label: 'Life Path', value: num.lifePath, interp: num.lifePathInterpretation },
    { label: 'Personality', value: num.personality, interp: num.personalityInterpretation },
    { label: 'Chaldean Destiny', value: num.chaldeanDestiny, interp: num.chaldeanInterpretation },
  ];

  const getMetaphysicalStatus = (score) => {
    if (score >= 10) return { label: 'Sangat Positif', color: 'var(--accent-green)' };
    if (score >= 5) return { label: 'Positif', color: 'var(--accent-green)' };
    if (score >= 0) return { label: 'Netral', color: 'var(--gold)' };
    return { label: 'Negatif/Tantangan', color: 'var(--accent-red)' };
  };

  const metaStatus = getMetaphysicalStatus(num.metaphysicalScore);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>🔢 Analisis Numerologi Metafisik {isSelf ? '' : '— Anak'}</h3>
        <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Skor Metafisik:</span>
          <strong style={{ color: metaStatus.color, fontSize: '1.1rem' }}>{num.metaphysicalScore}</strong>
          <span className="badge" style={{ background: `${metaStatus.color}20`, color: metaStatus.color, border: `1px solid ${metaStatus.color}40` }}>
            {metaStatus.label}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Analysis: Primbon & Metaphysical */}
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.02)' }}>
            <h4 style={{ color: 'var(--purple-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔱 Primbon Modern (Neptu Nama)
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--purple-light)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900 }}>
                {num.destinyInterpretation.metaphysicalScore + num.chaldeanInterpretation.metaphysicalScore}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{num.destinyInterpretation.primbonArchetype}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{num.destinyInterpretation.primbonMeaning}</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.02)' }}>
            <h4 style={{ color: 'var(--gold)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔮 Tafsir Metafisika Chaldean
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid var(--gold)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900 }}>
                {num.chaldeanDestiny}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{num.chaldeanInterpretation.chaldeanTitle}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{num.chaldeanInterpretation.chaldeanDescription}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Word by Word Analysis */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>📝 Analisis Nama Per Kata</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Kata</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem' }}>Pythagoras</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem' }}>Chaldean</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem' }}>Neptu</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Karakter</th>
                </tr>
              </thead>
              <tbody>
                {num.wordAnalysis.map((word, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>{word.word}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}><span className="badge badge--purple">{word.pythagorean}</span></td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}><span className="badge badge--gold">{word.chaldean}</span></td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}><span className="badge">{word.neptu}</span></td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{word.interpretation.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Karmic & Growth Analysis */}
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(239,68,68,0.02)', border: '1px solid rgba(239,68,68,0.1)' }}>
            <h4 style={{ color: 'var(--accent-red)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ Analisis Karmik
            </h4>
            <div style={{ fontSize: '0.85rem' }}>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>Karmic Lessons (Pelajaran Hidup):</strong><br />
                {num.karmicLessons?.length > 0 ? (
                  <span style={{ color: 'var(--text-secondary)' }}>Angka yang kurang dalam nama: {num.karmicLessons.join(', ')}</span>
                ) : (
                  <span style={{ color: 'var(--accent-green)' }}>Semua angka lengkap. Tidak ada pelajaran khusus.</span>
                )}
              </p>
              <p>
                <strong>Karmic Debts (Hutang Karmik):</strong><br />
                {num.karmicDebts?.length > 0 ? (
                  <span style={{ color: 'var(--accent-orange)' }}>Terdeteksi angka: {num.karmicDebts.join(', ')}</span>
                ) : (
                  <span style={{ color: 'var(--accent-green)' }}>Tidak terdeteksi hutang karmik.</span>
                )}
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(16,185,129,0.02)', border: '1px solid rgba(16,185,129,0.1)' }}>
            <h4 style={{ color: 'var(--accent-green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌱 Angka Pertumbuhan (Growth Number)
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--accent-green)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800 }}>
                {num.growthNumber}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>Energi Nama Depan</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mewakili potensi pengembangan diri di masa muda.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Traditional Items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {items.map(item => (
            <div key={item.label} className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem',
                  background: 'rgba(255,255,255,0.03)', color: 'var(--gold)', border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  {item.value}
                </div>
                <div>
                  <h4 style={{ marginBottom: '2px', fontSize: '1rem' }}>{item.label}</h4>
                  <span className="badge badge--purple" style={{ fontSize: '0.7rem' }}>{item.interp?.title}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {item.interp?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Gabungan Analisis Pythagoras, Chaldean, dan Primbon Modern
        </p>
      </div>
    </div>
  );
}

function AstrologyTab({ data }) {
  const astro = data?.data;
  if (!astro) return <div className="glass-card text-muted">Data tidak tersedia</div>;

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '1.5rem' }}>🌌 Analisis Astrologi — Anak</h3>
      <div className="grid-2">
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', background: 'rgba(124,58,237,0.03)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{astro.westernSymbol}</div>
          <h4 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{astro.westernSign}</h4>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>Zodiak Barat</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge--gold">{astro.element}</span>
            <span className="badge badge--purple">{astro.quality}</span>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', background: 'rgba(245,158,11,0.03)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🕉️</div>
          <h4 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{astro.vedicSign}</h4>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>Rashi (Vedik)</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span className="badge badge--gold">Planet: {astro.rulingPlanet}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1rem' }}>
          <h5 style={{ color: 'var(--purple-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🧠 Karakter & Perilaku
          </h5>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            {astro.traits}
          </p>
        </div>
        <div className="glass-card" style={{ padding: '1rem' }}>
          <h5 style={{ color: 'var(--gold)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✨ Keberuntungan & Jodoh
          </h5>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Hari Baik:</strong> <span className="text-highlight">{astro.luckyDays}</span>
            </p>
            <p>
              <strong>Jodoh/Kecocokan:</strong> <span className="text-highlight">{astro.soulmates}</span>
            </p>
          </div>
        </div>
      </div>

      <p style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
        "{astro.interpretation}"
      </p>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Skor Keselarasan Astrologi: <span className={getScoreClass(data.score)} style={{ fontWeight: 700 }}>{data.score}</span>
      </div>
    </div>
  );
}

function NawaSangaTab({ data }) {
  const ns = data?.data;
  if (!ns) return <div className="glass-card text-muted">Data tidak tersedia</div>;

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '1.5rem' }}>🧭 Analisis Nawa Sanga — Anak</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px' }}>
          <NawaSangaCompass activeDirection={ns} />
        </div>
        <div style={{ flex: '1 1 250px' }}>
          <div className="glass-card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <h4 style={{ color: ns.colorHex, marginBottom: '0.5rem' }}>
              {ns.direction} ({ns.directionSanskrit})
            </h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Dewa: <strong>{ns.deity}</strong>
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Warna: <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: ns.colorHex, verticalAlign: 'middle', marginRight: 4 }} />
              {ns.color}
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Bijaksara: <span className="text-bali" style={{ fontSize: '1.2em' }}>{ns.bijaksaraBali}</span> ({ns.bijaksara})
            </p>
            <p style={{ fontSize: '0.9rem' }}>Senjata: {ns.weapon}</p>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ns.interpretation}</p>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {ns.positiveTraits?.map((t, tIdx) => <span key={`${t}-${tIdx}`} className="badge badge--green">{t}</span>)}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Skor Nawa Sanga Keluarga: <span className={getScoreClass(data.score)} style={{ fontWeight: 700 }}>{data.score}</span>
      </div>
    </div>
  );
}

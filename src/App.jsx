import { useState, useRef, useCallback, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import NameRecommendation from './components/NameRecommendation';
import NameComparison from './components/NameComparison';
import LifePatternTimeline from './components/LifePatternTimeline';
import { runFullAnalysis, recommendNames } from './engines/scoreAggregator';

export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFormData, setLastFormData] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    // Redirection if user accesses something like /bazi directly
    if (window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  const handleSubmit = useCallback((formData) => {
    setAnalysis(null);
    setComparison(null);
    setRecommendations([]);
    setLastFormData(formData);
    setLoading(true);

    setTimeout(() => {
      try {
        const childName = formData.child.name || (formData.isSelfAnalysis ? 'Saya' : 'Individu');

        const result = runFullAnalysis(
          formData.father.name, formData.father.birthDate,
          formData.mother.name, formData.mother.birthDate,
          childName, formData.child.birthDate,
          formData.child.gender
        );
        
        result.timestamp = Date.now();

        let names = [];
        if (!formData.isSelfAnalysis) {
          names = recommendNames(
            formData.father.name, formData.father.birthDate,
            formData.mother.name, formData.mother.birthDate,
            formData.child.birthDate, formData.child.gender,
            formData.child.birthOrderName
          );
        }

        setAnalysis(result);
        setRecommendations(names);

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleCompare = useCallback((compareName) => {
    if (!compareName) {
      setComparison(null);
      return;
    }
    if (!lastFormData) return;
    
    try {
      const compResult = runFullAnalysis(
        lastFormData.father.name, lastFormData.father.birthDate,
        lastFormData.mother.name, lastFormData.mother.birthDate,
        compareName, lastFormData.child.birthDate,
        lastFormData.child.gender
      );
      compResult.compareName = compareName;
      setComparison(compResult);
    } catch (err) {
      console.error('Comparison error:', err);
    }
  }, [lastFormData]);

  return (
    <div className="app">
      <Header />

      <main className="container" style={{ padding: '2rem 1rem' }}>
        {/* Input Form Section */}
        <section style={{ marginBottom: '3rem' }}>
          <div className="section-header animate-fade-in" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 className="section-title">✨ Masukkan Data Kelahiran</h2>
            <p className="section-subtitle">Lengkapi data untuk mendapatkan analisis spiritual dan numerologi</p>
          </div>
          <InputForm onSubmit={handleSubmit} />
        </section>

        {/* Results Section */}
        <div ref={resultsRef} style={{ scrollMarginTop: '2rem' }}>
          {loading && (
            <div className="glass-card animate-pulse" style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
              <h3 style={{ color: 'var(--gold)' }}>Menganalisis Harmoni Semesta...</h3>
              <p className="text-muted">Menghitung keselarasan numerologi, posisi bintang, dan energi elemen</p>
            </div>
          )}

          {analysis && !loading && (
            <div className="animate-fade-in">
              {/* Dashboard Result */}
              <section style={{ marginBottom: '2rem' }}>
                <AnalysisDashboard key={analysis.timestamp} analysis={analysis} />
              </section>

              {/* Name Comparison Section */}
              <section style={{ marginBottom: '2rem' }}>
                <NameComparison 
                  primaryAnalysis={analysis} 
                  comparisonAnalysis={comparison} 
                  onCompare={handleCompare} 
                />
              </section>

              {/* Recommendations (Only if available) */}
              {recommendations.length > 0 && (
                <section style={{ marginBottom: '2rem' }}>
                  <NameRecommendation recommendations={recommendations} />
                </section>
              )}

              {/* Life Pattern Timeline */}
              <section style={{ marginBottom: '2rem' }}>
                <LifePatternTimeline lifePattern={analysis.lifePattern} />
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer container" style={{ marginTop: '4rem', paddingBottom: '2rem', textAlign: 'center' }}>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Wariga Verse — Rekomendasi Nama & Analisis Metafisika</p>
        <p style={{ marginTop: '0.5rem' }}>
          <span className="text-bali" style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>ᬒᬁ ᬰᬵᬦ᭄ᬢᬶᬄ ᬰᬵᬦ᭄ᬢᬶᬄ ᬰᬵᬦ᭄ᬢᬶᬄ</span>
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '1rem auto' }}>
          Aplikasi ini bersifat referensi. Selalu konsultasikan dengan ahli Wariga atau pemangku untuk keputusan penting terkait nama dan ritual.
        </p>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { calculatePawukon } from '../engines/pawukonEngine';

export default function InputForm({ onSubmit }) {
  const [mode, setMode] = useState('child'); // 'child' or 'self'
  const [formData, setFormData] = useState({
    father: { name: 'Ida Bagus Gede Githa Yasha', birthDate: '1987-05-07', birthTime: '02:00' },
    mother: { name: 'Ida Ayu Arni Maheswari', birthDate: '1991-09-10', birthTime: '04:14' },
    child: { name: '', birthDate: '', birthTime: '12:00', gender: 'male', birthOrder: '1', birthOrderName: 'Putu' }
  });

  const birthOrderNames = {
    '1': ['Putu', 'Wayan', 'Gede', 'Luh'],
    '2': ['Made', 'Kadek'],
    '3': ['Nyoman', 'Komang'],
    '4': ['Ketut']
  };

  const [fatherOtonan, setFatherOtonan] = useState(null);
  const [motherOtonan, setMotherOtonan] = useState(null);
  const [childOtonan, setChildOtonan] = useState(null);

  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const childDate = combineDateTime(formData.child.birthDate, formData.child.birthTime);
    
    const submissionData = {
      isSelfAnalysis: mode === 'self',
      father: mode === 'self' ? { name: '', birthDate: null } : { 
        name: formData.father.name, 
        birthDate: combineDateTime(formData.father.birthDate, formData.father.birthTime) 
      },
      mother: mode === 'self' ? { name: '', birthDate: null } : { 
        name: formData.mother.name, 
        birthDate: combineDateTime(formData.mother.birthDate, formData.mother.birthTime) 
      },
      child: { 
        ...formData.child, 
        name: formData.child.name || (mode === 'self' ? 'Saya' : 'Anak'),
        birthDate: childDate 
      }
    };
    
    onSubmit(submissionData);
  };

  const handleChildChange = (field, value) => {
    setFormData(prev => {
      const newState = {
        ...prev,
        child: { ...prev.child, [field]: value }
      };
      if (field === 'birthOrder') {
        newState.child.birthOrderName = birthOrderNames[value][0];
      }
      return newState;
    });
  };

  useEffect(() => {
    const date = combineDateTime(formData.father.birthDate, formData.father.birthTime);
    if (date) setFatherOtonan(calculatePawukon(date));
    else setFatherOtonan(null);
  }, [formData.father.birthDate, formData.father.birthTime]);

  useEffect(() => {
    const date = combineDateTime(formData.mother.birthDate, formData.mother.birthTime);
    if (date) setMotherOtonan(calculatePawukon(date));
    else setMotherOtonan(null);
  }, [formData.mother.birthDate, formData.mother.birthTime]);

  useEffect(() => {
    const date = combineDateTime(formData.child.birthDate, formData.child.birthTime);
    if (date) setChildOtonan(calculatePawukon(date));
    else setChildOtonan(null);
  }, [formData.child.birthDate, formData.child.birthTime]);

  const isValid = mode === 'self' 
    ? (formData.child.name && formData.child.birthDate)
    : (formData.father.name && formData.father.birthDate && formData.mother.name && formData.mother.birthDate && formData.child.birthDate);

  const handleFatherChange = (field, value) => {
    setFormData(prev => ({ ...prev, father: { ...prev.father, [field]: value } }));
  };

  const handleMotherChange = (field, value) => {
    setFormData(prev => ({ ...prev, mother: { ...prev.mother, [field]: value } }));
  };

  const renderOtonan = (otonan) => {
    if (!otonan) return null;
    return (
      <div className="input-form__otonan animate-fade-in" style={{ fontSize: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '8px' }}>
        <span style={{ marginRight: '0.5rem' }}>🗓️</span>
        Otonan: <strong>{otonan.otonanDescription}</strong>
        <span style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>|</span>
        Urip: <strong>{otonan.uripTotal}</strong>
      </div>
    );
  };

  return (
    <form className="input-form" onSubmit={handleSubmit} id="input-form" style={{ display: 'grid', gap: '2rem' }}>
      {/* Mode Switcher */}
      <div style={{ 
        display: 'flex', gap: '10px', padding: '4px', background: 'rgba(255,255,255,0.05)', 
        borderRadius: '16px', gridColumn: '1 / -1', maxWidth: '500px', margin: '0 auto' 
      }}>
        <button type="button" onClick={() => setMode('child')} style={{
          flex: 1, padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: mode === 'child' ? 'var(--purple-light)' : 'transparent',
          color: mode === 'child' ? '#fff' : 'var(--text-muted)',
          fontWeight: 600, transition: 'all 0.3s', whiteSpace: 'nowrap'
        }}>
          👨‍👩‍👧 Analisis Nama Anak
        </button>
        <button type="button" onClick={() => setMode('self')} style={{
          flex: 1, padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: mode === 'self' ? 'var(--purple-light)' : 'transparent',
          color: mode === 'self' ? '#fff' : 'var(--text-muted)',
          fontWeight: 600, transition: 'all 0.3s', whiteSpace: 'nowrap'
        }}>
          👤 Analisis Diri
        </button>
      </div>

      <div className="grid-2">
        {mode === 'child' && (
          <>
            {/* Father */}
            <div className="glass-card input-form__section animate-fade-in-up" style={{ background: 'rgba(124,58,237,0.02)' }}>
              <div className="input-form__section-title">
                <span className="input-form__section-icon">👨</span>
                Data Ayah
              </div>
              <div className="input-form__fields">
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input className="form-input" type="text" placeholder="Nama lengkap ayah"
                    value={formData.father.name} onChange={e => handleFatherChange('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal Lahir</label>
                  <input className="form-input" type="date"
                    value={formData.father.birthDate} onChange={e => handleFatherChange('birthDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Waktu Lahir</label>
                  <input className="form-input" type="time"
                    value={formData.father.birthTime} onChange={e => handleFatherChange('birthTime', e.target.value)} />
                </div>
                {renderOtonan(fatherOtonan)}
              </div>
            </div>

            {/* Mother */}
            <div className="glass-card input-form__section animate-fade-in-up" style={{ background: 'rgba(236,72,153,0.02)' }}>
              <div className="input-form__section-title">
                <span className="input-form__section-icon">👩</span>
                Data Ibu
              </div>
              <div className="input-form__fields">
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input className="form-input" type="text" placeholder="Nama lengkap ibu"
                    value={formData.mother.name} onChange={e => handleMotherChange('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal Lahir</label>
                  <input className="form-input" type="date"
                    value={formData.mother.birthDate} onChange={e => handleMotherChange('birthDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Waktu Lahir</label>
                  <input className="form-input" type="time"
                    value={formData.mother.birthTime} onChange={e => handleMotherChange('birthTime', e.target.value)} />
                </div>
                {renderOtonan(motherOtonan)}
              </div>
            </div>
          </>
        )}

        {/* Child / Self */}
        <div className="glass-card input-form__section animate-fade-in-up" style={{ 
          background: 'rgba(245,158,11,0.02)',
          gridColumn: mode === 'self' ? '1 / span 2' : 'auto',
          maxWidth: mode === 'self' ? '500px' : 'none',
          margin: mode === 'self' ? '0 auto' : '0'
        }}>
          <div className="input-form__section-title">
            <span className="input-form__section-icon">{mode === 'child' ? '👶' : '👤'}</span>
            {mode === 'child' ? 'Data Nama Anak' : 'Data Diri'}
          </div>
          <div className="input-form__fields">
            <div className="form-group">
              <label className="form-label">{mode === 'child' ? 'Nama (Opsional)' : 'Nama Lengkap Anda'}</label>
              <input className="form-input" type="text" placeholder={mode === 'child' ? 'Kosongkan untuk rekomendasi' : 'Ketik nama Anda'}
                value={formData.child.name} onChange={e => handleChildChange('name', e.target.value)} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="gender-selector">
                <button type="button" className={`gender-option ${formData.child.gender === 'male' ? 'gender-option--active' : ''}`}
                  onClick={() => handleChildChange('gender', 'male')}>
                  ♂ Laki-laki
                </button>
                <button type="button" className={`gender-option ${formData.child.gender === 'female' ? 'gender-option--active' : ''}`}
                  onClick={() => handleChildChange('gender', 'female')}>
                  ♀ Perempuan
                </button>
              </div>
            </div>

            {mode === 'child' && (
              <div className="form-group">
                <label className="form-label">Urutan Lahir</label>
                <select className="form-input" value={formData.child.birthOrder} onChange={e => handleChildChange('birthOrder', e.target.value)}>
                  <option value="1">Anak ke-1 (Pertama)</option>
                  <option value="2">Anak ke-2 (Kedua)</option>
                  <option value="3">Anak ke-3 (Ketiga)</option>
                  <option value="4">Anak ke-4 (atau kelipatan)</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Tanggal Lahir</label>
              <input className="form-input" type="date"
                value={formData.child.birthDate} onChange={e => handleChildChange('birthDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Waktu Lahir</label>
              <input className="form-input" type="time"
                value={formData.child.birthTime} onChange={e => handleChildChange('birthTime', e.target.value)} />
            </div>
            {renderOtonan(childOtonan)}
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn--primary btn--lg" disabled={!isValid}
        style={{ justifySelf: 'center', minWidth: '280px' }} id="submit-btn">
        {mode === 'child' ? '🔮 Analisis & Rekomendasikan Nama' : '🔮 Analisis Diri Saya'}
      </button>
    </form>
  );
}

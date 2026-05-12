const ZODIAC_SIGNS = [
  { 
    name:'Aries', symbol:'♈', element:'Api', quality:'Cardinal', rulingPlanet:'Mars', vedicName:'Mesha', startLong: 0,
    traits: 'Pemberani, energik, jujur, namun terkadang impulsif dan tidak sabar.',
    luckyDays: 'Selasa', soulmates: 'Leo, Sagittarius, Libra'
  },
  { 
    name:'Taurus', symbol:'♉', element:'Tanah', quality:'Fixed', rulingPlanet:'Venus', vedicName:'Vrishabha', startLong: 30,
    traits: 'Setia, praktis, sabar, namun bisa sangat keras kepala dan posesif.',
    luckyDays: 'Jumat', soulmates: 'Virgo, Capricorn, Scorpio'
  },
  { 
    name:'Gemini', symbol:'♊', element:'Udara', quality:'Mutable', rulingPlanet:'Merkurius', vedicName:'Mithuna', startLong: 60,
    traits: 'Adaptif, komunikatif, cerdas, namun terkadang bimbang dan tidak konsisten.',
    luckyDays: 'Rabu', soulmates: 'Libra, Aquarius, Sagittarius'
  },
  { 
    name:'Cancer', symbol:'♋', element:'Air', quality:'Cardinal', rulingPlanet:'Bulan', vedicName:'Karka', startLong: 90,
    traits: 'Sangat intuitif, emosional, protektif, namun bisa terlalu sensitif dan moody.',
    luckyDays: 'Senin', soulmates: 'Scorpio, Pisces, Capricorn'
  },
  { 
    name:'Leo', symbol:'♌', element:'Api', quality:'Fixed', rulingPlanet:'Matahari', vedicName:'Simha', startLong: 120,
    traits: 'Percaya diri, murah hati, kreatif, namun terkadang sombong dan haus perhatian.',
    luckyDays: 'Minggu', soulmates: 'Aries, Sagittarius, Aquarius'
  },
  { 
    name:'Virgo', symbol:'♍', element:'Tanah', quality:'Mutable', rulingPlanet:'Merkurius', vedicName:'Kanya', startLong: 150,
    traits: 'Analitis, rendah hati, rajin, namun cenderung terlalu kritis dan perfeksionis.',
    luckyDays: 'Rabu', soulmates: 'Taurus, Capricorn, Pisces'
  },
  { 
    name:'Libra', symbol:'♎', element:'Udara', quality:'Cardinal', rulingPlanet:'Venus', vedicName:'Tula', startLong: 180,
    traits: 'Diplomatis, adil, kooperatif, namun terkadang bimbang dan menghindari konflik.',
    luckyDays: 'Jumat', soulmates: 'Gemini, Aquarius, Aries'
  },
  { 
    name:'Scorpio', symbol:'♏', element:'Air', quality:'Fixed', rulingPlanet:'Mars/Pluto', vedicName:'Vrischika', startLong: 210,
    traits: 'Bertekad kuat, berani, setia, namun bisa sangat rahasia dan cemburuan.',
    luckyDays: 'Selasa', soulmates: 'Cancer, Pisces, Taurus'
  },
  { 
    name:'Sagittarius', symbol:'♐', element:'Api', quality:'Mutable', rulingPlanet:'Jupiter', vedicName:'Dhanus', startLong: 240,
    traits: 'Optimis, jujur, pencinta kebebasan, namun terkadang terlalu blak-blakan dan tidak sabar.',
    luckyDays: 'Kamis', soulmates: 'Aries, Leo, Gemini'
  },
  { 
    name:'Capricorn', symbol:'♑', element:'Tanah', quality:'Cardinal', rulingPlanet:'Saturnus', vedicName:'Makara', startLong: 270,
    traits: 'Disiplin, bertanggung jawab, ambisius, namun terkadang pesimis dan kaku.',
    luckyDays: 'Sabtu', soulmates: 'Taurus, Virgo, Cancer'
  },
  { 
    name:'Aquarius', symbol:'♒', element:'Udara', quality:'Fixed', rulingPlanet:'Uranus/Saturnus', vedicName:'Kumbha', startLong: 300,
    traits: 'Mandiri, progresif, orisinal, namun terkadang emosional dingin dan tertutup.',
    luckyDays: 'Sabtu', soulmates: 'Gemini, Libra, Leo'
  },
  { 
    name:'Pisces', symbol:'♓', element:'Air', quality:'Mutable', rulingPlanet:'Neptunus/Jupiter', vedicName:'Meena', startLong: 330,
    traits: 'Penuh empati, artistik, bijaksana, namun bisa sangat naif dan senang melarikan diri dari kenyataan.',
    luckyDays: 'Kamis', soulmates: 'Cancer, Scorpio, Virgo'
  },
];

const ELEMENT_COMPAT = {
  'Api-Api': 90, 'Api-Udara': 80, 'Api-Tanah': 50, 'Api-Air': 40,
  'Tanah-Tanah': 90, 'Tanah-Air': 80, 'Tanah-Udara': 50,
  'Udara-Udara': 90, 'Udara-Air': 50,
  'Air-Air': 90,
};

function getElementCompat(e1, e2) {
  const key1 = `${e1}-${e2}`;
  const key2 = `${e2}-${e1}`;
  return ELEMENT_COMPAT[key1] || ELEMENT_COMPAT[key2] || 60;
}

function getJulianDate(date) {
  return (date.getTime() / 86400000) + 2440587.5;
}

function getSolarLongitude(date) {
  const jd = getJulianDate(date);
  const d = jd - 2451545.0;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  let L = q + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180);
  L = L % 360;
  if (L < 0) L += 360;
  return L;
}

export function getWesternZodiac(date) {
  const L = getSolarLongitude(date);
  const signIndex = Math.floor(L / 30);
  const sign = ZODIAC_SIGNS[signIndex % 12];
  
  // Calculate Decan (each sign is 30 degrees, divided into 3 decans of 10 degrees)
  const signDegree = L % 30;
  const decan = Math.floor(signDegree / 10) + 1; // 1, 2, or 3
  
  return { ...sign, decan, exactLongitude: L };
}

export function getVedicZodiac(westernSign, date) {
  // Ayanamsha correction for exact Vedic Sun sign
  const year = date.getFullYear();
  const diffYears = year - 2000;
  const ayanamsha = 23.85 + (diffYears * 0.01397);
  
  let vedicLong = westernSign.exactLongitude - ayanamsha;
  if (vedicLong < 0) vedicLong += 360;
  
  const vedicIndex = Math.floor(vedicLong / 30);
  return ZODIAC_SIGNS[vedicIndex];
}

export function analyzeAstrology(date) {
  const western = getWesternZodiac(date);
  const vedic = getVedicZodiac(western, date);
  
  const decanMeanings = {
    1: 'Sifat dasar zodiak ini sangat murni dan kental.',
    2: 'Sifat zodiak ini sedikit dimoderasi oleh pengaruh zodiak lain dalam elemen yang sama.',
    3: 'Lebih progresif dan sering memiliki sifat yang merupakan transisi menuju zodiak berelemen sama berikutnya.'
  };

  return {
    westernSign: western.name,
    westernSymbol: western.symbol,
    vedicSign: vedic.vedicName,
    element: western.element,
    quality: western.quality,
    rulingPlanet: western.rulingPlanet,
    traits: western.traits,
    luckyDays: western.luckyDays,
    soulmates: western.soulmates,
    vedicTraits: vedic.traits,
    decan: western.decan,
    decanMeaning: decanMeanings[western.decan],
    interpretation: `Zodiak ${western.name} (${western.symbol}) dengan elemen ${western.element}, berada pada Dekan ke-${western.decan}. ${decanMeanings[western.decan]} Dalam astrologi Vedik (Sun Sign), Anda bernaung di bawah ${vedic.vedicName}.`,
  };
}

export function calculateFamilyAstrologyScore(fatherDate, motherDate, childDate) {
  const f = getWesternZodiac(fatherDate);
  const m = getWesternZodiac(motherDate);
  const c = getWesternZodiac(childDate);
  const fcScore = getElementCompat(f.element, c.element);
  const mcScore = getElementCompat(m.element, c.element);
  const fmScore = getElementCompat(f.element, m.element);
  return Math.round((fcScore + mcScore + fmScore) / 3);
}

export { ZODIAC_SIGNS };

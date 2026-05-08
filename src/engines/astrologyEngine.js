const ZODIAC_SIGNS = [
  { 
    name:'Aries', symbol:'♈', element:'Api', quality:'Cardinal', rulingPlanet:'Mars', startMonth:3, startDay:21, endMonth:4, endDay:19, vedicName:'Mesha',
    traits: 'Pemberani, energik, jujur, namun terkadang impulsif dan tidak sabar.',
    luckyDays: 'Selasa', soulmates: 'Leo, Sagittarius, Libra'
  },
  { 
    name:'Taurus', symbol:'♉', element:'Tanah', quality:'Fixed', rulingPlanet:'Venus', startMonth:4, startDay:20, endMonth:5, endDay:20, vedicName:'Vrishabha',
    traits: 'Setia, praktis, sabar, namun bisa sangat keras kepala dan posesif.',
    luckyDays: 'Jumat', soulmates: 'Virgo, Capricorn, Scorpio'
  },
  { 
    name:'Gemini', symbol:'♊', element:'Udara', quality:'Mutable', rulingPlanet:'Merkurius', startMonth:5, startDay:21, endMonth:6, endDay:20, vedicName:'Mithuna',
    traits: 'Adaptif, komunikatif, cerdas, namun terkadang bimbang dan tidak konsisten.',
    luckyDays: 'Rabu', soulmates: 'Libra, Aquarius, Sagittarius'
  },
  { 
    name:'Cancer', symbol:'♋', element:'Air', quality:'Cardinal', rulingPlanet:'Bulan', startMonth:6, startDay:21, endMonth:7, endDay:22, vedicName:'Karka',
    traits: 'Sangat intuitif, emosional, protektif, namun bisa terlalu sensitif dan moody.',
    luckyDays: 'Senin', soulmates: 'Scorpio, Pisces, Capricorn'
  },
  { 
    name:'Leo', symbol:'♌', element:'Api', quality:'Fixed', rulingPlanet:'Matahari', startMonth:7, startDay:23, endMonth:8, endDay:22, vedicName:'Simha',
    traits: 'Percaya diri, murah hati, kreatif, namun terkadang sombong dan haus perhatian.',
    luckyDays: 'Minggu', soulmates: 'Aries, Sagittarius, Aquarius'
  },
  { 
    name:'Virgo', symbol:'♍', element:'Tanah', quality:'Mutable', rulingPlanet:'Merkurius', startMonth:8, startDay:23, endMonth:9, endDay:22, vedicName:'Kanya',
    traits: 'Analitis, rendah hati, rajin, namun cenderung terlalu kritis dan perfeksionis.',
    luckyDays: 'Rabu', soulmates: 'Taurus, Capricorn, Pisces'
  },
  { 
    name:'Libra', symbol:'♎', element:'Udara', quality:'Cardinal', rulingPlanet:'Venus', startMonth:9, startDay:23, endMonth:10, endDay:22, vedicName:'Tula',
    traits: 'Diplomatis, adil, kooperatif, namun terkadang bimbang dan menghindari konflik.',
    luckyDays: 'Jumat', soulmates: 'Gemini, Aquarius, Aries'
  },
  { 
    name:'Scorpio', symbol:'♏', element:'Air', quality:'Fixed', rulingPlanet:'Mars/Pluto', startMonth:10, startDay:23, endMonth:11, endDay:21, vedicName:'Vrischika',
    traits: 'Bertekad kuat, berani, setia, namun bisa sangat rahasia dan cemburuan.',
    luckyDays: 'Selasa', soulmates: 'Cancer, Pisces, Taurus'
  },
  { 
    name:'Sagittarius', symbol:'♐', element:'Api', quality:'Mutable', rulingPlanet:'Jupiter', startMonth:11, startDay:22, endMonth:12, endDay:21, vedicName:'Dhanus',
    traits: 'Optimis, jujur, pencinta kebebasan, namun terkadang terlalu blak-blakan dan tidak sabar.',
    luckyDays: 'Kamis', soulmates: 'Aries, Leo, Gemini'
  },
  { 
    name:'Capricorn', symbol:'♑', element:'Tanah', quality:'Cardinal', rulingPlanet:'Saturnus', startMonth:12, startDay:22, endMonth:1, endDay:19, vedicName:'Makara',
    traits: 'Disiplin, bertanggung jawab, ambisius, namun terkadang pesimis dan kaku.',
    luckyDays: 'Sabtu', soulmates: 'Taurus, Virgo, Cancer'
  },
  { 
    name:'Aquarius', symbol:'♒', element:'Udara', quality:'Fixed', rulingPlanet:'Uranus/Saturnus', startMonth:1, startDay:20, endMonth:2, endDay:18, vedicName:'Kumbha',
    traits: 'Mandiri, progresif, orisinal, namun terkadang emosional dingin dan tertutup.',
    luckyDays: 'Sabtu', soulmates: 'Gemini, Libra, Leo'
  },
  { 
    name:'Pisces', symbol:'♓', element:'Air', quality:'Mutable', rulingPlanet:'Neptunus/Jupiter', startMonth:2, startDay:19, endMonth:3, endDay:20, vedicName:'Meena',
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

export function getWesternZodiac(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  for (const sign of ZODIAC_SIGNS) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) return sign;
    } else if (sign.endMonth < sign.startMonth) {
      if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) return sign;
    } else {
      if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) return sign;
    }
  }
  return ZODIAC_SIGNS[9]; // Default Capricorn
}

export function getVedicZodiac(westernSign) {
  const westernIndex = ZODIAC_SIGNS.findIndex(s => s.name === westernSign.name);
  const vedicIndex = (westernIndex + 11) % 12; // Approximate -1 sign shift
  return ZODIAC_SIGNS[vedicIndex];
}

export function analyzeAstrology(date) {
  const western = getWesternZodiac(date);
  const vedic = getVedicZodiac(western);
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
    interpretation: `Zodiak ${western.name} (${western.symbol}) dengan elemen ${western.element}. Dalam astrologi Vedik, Rashi ${vedic.vedicName} membawa pengaruh ${vedic.rulingPlanet}.`,
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

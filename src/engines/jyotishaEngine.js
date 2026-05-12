import interpretations from '../data/numerologyInterpretations.json';

const NAKSHATRAS = [
  { name: 'Ashwini', ruler: 'Ketu', syllables: ['Chu', 'Che', 'Cho', 'La'], quality: 'Light' },
  { name: 'Bharani', ruler: 'Venus', syllables: ['Lee', 'Lu', 'Le', 'Lo'], quality: 'Cruel' },
  { name: 'Krittika', ruler: 'Sun', syllables: ['A', 'Ee', 'U', 'E'], quality: 'Mixed' },
  { name: 'Rohini', ruler: 'Moon', syllables: ['O', 'Va', 'Vi', 'Vu'], quality: 'Fixed' },
  { name: 'Mrigashirsha', ruler: 'Mars', syllables: ['Ve', 'Vo', 'Ka', 'Ke'], quality: 'Soft' },
  { name: 'Ardra', ruler: 'Rahu', syllables: ['Ku', 'Gha', 'Ng', 'Chha'], quality: 'Sharp' },
  { name: 'Punarvasu', ruler: 'Jupiter', syllables: ['Ke', 'Ko', 'Ha', 'Hi'], quality: 'Movable' },
  { name: 'Pushya', ruler: 'Saturn', syllables: ['Hu', 'He', 'Ho', 'Da'], quality: 'Light' },
  { name: 'Ashlesha', ruler: 'Mercury', syllables: ['Dee', 'Doo', 'De', 'Do'], quality: 'Sharp' },
  { name: 'Magha', ruler: 'Ketu', syllables: ['Ma', 'Mi', 'Mu', 'Me'], quality: 'Cruel' },
  { name: 'Purva Phalguni', ruler: 'Venus', syllables: ['Mo', 'Ta', 'Ti', 'Tu'], quality: 'Cruel' },
  { name: 'Uttara Phalguni', ruler: 'Sun', syllables: ['Te', 'To', 'Pa', 'Pi'], quality: 'Fixed' },
  { name: 'Hasta', ruler: 'Moon', syllables: ['Pu', 'Sha', 'Na', 'Tha'], quality: 'Light' },
  { name: 'Chitra', ruler: 'Mars', syllables: ['Pe', 'Po', 'Ra', 'Ri'], quality: 'Soft' },
  { name: 'Swati', ruler: 'Rahu', syllables: ['Ru', 'Re', 'Ro', 'Ta'], quality: 'Movable' },
  { name: 'Vishakha', ruler: 'Jupiter', syllables: ['Ti', 'Tu', 'Te', 'To'], quality: 'Mixed' },
  { name: 'Anuradha', ruler: 'Saturn', syllables: ['Na', 'Ni', 'Nu', 'Ne'], quality: 'Soft' },
  { name: 'Jyeshtha', ruler: 'Mercury', syllables: ['No', 'Ya', 'Yi', 'Yu'], quality: 'Sharp' },
  { name: 'Mula', ruler: 'Ketu', syllables: ['Ye', 'Yo', 'Ba', 'Bi'], quality: 'Sharp' },
  { name: 'Purva Ashadha', ruler: 'Venus', syllables: ['Bu', 'Dha', 'Pha', 'Dha'], quality: 'Cruel' },
  { name: 'Uttara Ashadha', ruler: 'Sun', syllables: ['Bhe', 'Bho', 'Ja', 'Ji'], quality: 'Fixed' },
  { name: 'Shravana', ruler: 'Moon', syllables: ['Khi', 'Khu', 'Khe', 'Kho'], quality: 'Movable' },
  { name: 'Dhanishta', ruler: 'Mars', syllables: ['Ga', 'Gi', 'Gu', 'Ge'], quality: 'Movable' },
  { name: 'Shatabhisha', ruler: 'Rahu', syllables: ['Go', 'Sa', 'Si', 'Su'], quality: 'Movable' },
  { name: 'Purva Bhadrapada', ruler: 'Jupiter', syllables: ['Se', 'So', 'Da', 'Di'], quality: 'Cruel' },
  { name: 'Uttara Bhadrapada', ruler: 'Saturn', syllables: ['Du', 'Tha', 'Jha', 'Na'], quality: 'Fixed' },
  { name: 'Revati', ruler: 'Mercury', syllables: ['De', 'Do', 'Cha', 'Chi'], quality: 'Soft' }
];

const RASHIS = [
  { name: 'Mesha', western: 'Aries', ruler: 'Mars' },
  { name: 'Vrishabha', western: 'Taurus', ruler: 'Venus' },
  { name: 'Mithuna', western: 'Gemini', ruler: 'Mercury' },
  { name: 'Karka', western: 'Cancer', ruler: 'Moon' },
  { name: 'Simha', western: 'Leo', ruler: 'Sun' },
  { name: 'Kanya', western: 'Virgo', ruler: 'Mercury' },
  { name: 'Tula', western: 'Libra', ruler: 'Venus' },
  { name: 'Vrischika', western: 'Scorpio', ruler: 'Mars' },
  { name: 'Dhanus', western: 'Sagittarius', ruler: 'Jupiter' },
  { name: 'Makara', western: 'Capricorn', ruler: 'Saturn' },
  { name: 'Kumbha', western: 'Aquarius', ruler: 'Saturn' },
  { name: 'Meena', western: 'Pisces', ruler: 'Jupiter' }
];

function getJulianDate(date) {
  const time = date.getTime();
  return (time / 86400000) + 2440587.5;
}

function getMoonLongitude(date) {
  const jd = getJulianDate(date);
  const d = jd - 2451545.0; // days since J2000
  // Improved approximation for Moon's longitude
  let L = 218.316 + 13.176396 * d;
  let M = 134.963 + 13.064993 * d;
  let F = 93.272 + 13.229350 * d;
  
  let l = L + 6.289 * Math.sin(M * Math.PI / 180);
  l = l % 360;
  if (l < 0) l += 360;
  return l;
}

function getAyanamsha(date) {
  const year = date.getFullYear();
  const diffYears = year - 2000;
  return 23.85 + (diffYears * 0.01397);
}

export function calculateJyotisha(date) {
  const moonLong = getMoonLongitude(date);
  const ayanamsha = getAyanamsha(date);
  const vedicLong = (moonLong - ayanamsha + 360) % 360;
  
  // Rashi: 30 degrees each
  const rashiIndex = Math.floor(vedicLong / 30);
  const rashi = RASHIS[rashiIndex];
  
  // Nakshatra: 13.3333 degrees (13°20') each
  const nakshatraIndex = Math.floor(vedicLong / 13.3333);
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  
  // Pada (Quarter): 3.3333 degrees each
  const pada = Math.floor((vedicLong % 13.3333) / 3.3333) + 1;
  const recommendedSyllable = nakshatra.syllables[pada - 1] || nakshatra.syllables[0];

  const nakshatraData = interpretations.nakshatras ? interpretations.nakshatras[nakshatra.name] : null;
  const richNarrative = nakshatraData 
    ? `Dewa Pelindung: ${nakshatraData.deity}. ${nakshatraData.narrative} Karir yang cocok: ${nakshatraData.career}`
    : `Bintang kelahiran Anda adalah ${nakshatra.name}.`;

  return {
    rashi: rashi.name,
    rashiRuler: rashi.ruler,
    nakshatra: nakshatra.name,
    nakshatraRuler: nakshatra.ruler,
    nakshatraQuality: nakshatra.quality,
    pada: pada,
    recommendedSyllables: nakshatra.syllables,
    targetSyllable: recommendedSyllable,
    interpretation: `Lahir di bawah naungan Nakshatra ${nakshatra.name} pada kuarter (Pada) ke-${pada}. Rashi (Zodiak Bulan) Anda adalah ${rashi.name} yang dikuasai oleh planet ${rashi.ruler}.`,
    richNarrative: richNarrative,
    deity: nakshatraData ? nakshatraData.deity : ''
  };
}

export function checkNamingHarmony(name, recommendedSyllables) {
  const firstPart = name.split(' ')[0] || '';
  const firstChar = firstPart.charAt(0).toUpperCase();
  const firstTwo = firstPart.substring(0, 2).toUpperCase();
  
  const matches = recommendedSyllables.some(s => {
    const sUpper = s.toUpperCase();
    return firstChar === sUpper.charAt(0) || firstTwo === sUpper;
  });
  
  return matches ? 10 : 0;
}

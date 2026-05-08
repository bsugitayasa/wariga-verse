/**
 * Jyotisha (Vedic Astrology) Engine
 * Implements Nakshatra (Lunar Mansion) and Rashi (Moon Sign) calculations
 * focusing on naming recommendations based on Janma Nakshatra.
 */

const NAKSHATRAS = [
  { name: 'Ashwini', ruler: 'Ketu', syllables: ['Chu', 'Che', 'Cho', 'La'], quality: 'Light', description: 'Mewakili kecepatan, penyembuhan, dan awal yang baru. Anak cenderung cerdas dan mandiri.' },
  { name: 'Bharani', ruler: 'Venus', syllables: ['Lee', 'Lu', 'Le', 'Lo'], quality: 'Cruel', description: 'Mewakili transformasi dan disiplin diri. Memiliki tekad yang kuat dan ketahanan mental.' },
  { name: 'Krittika', ruler: 'Sun', syllables: ['A', 'Ee', 'U', 'E'], quality: 'Mixed', description: 'Mewakili kemurnian dan kecerdasan tajam. Anak memiliki jiwa kepemimpinan yang berapi-api.' },
  { name: 'Rohini', ruler: 'Moon', syllables: ['O', 'Va', 'Vi', 'Vu'], quality: 'Fixed', description: 'Mewakili pertumbuhan dan kecantikan. Anak cenderung artistik, stabil, dan penyayang.' },
  { name: 'Mrigashirsha', ruler: 'Mars', syllables: ['Ve', 'Vo', 'Ka', 'Ke'], quality: 'Soft', description: 'Mewakili pencarian dan rasa ingin tahu. Anak adalah penjelajah sejati dengan pikiran kreatif.' },
  { name: 'Ardra', ruler: 'Rahu', syllables: ['Ku', 'Gha', 'Ng', 'Chha'], quality: 'Sharp', description: 'Mewakili emosi yang mendalam dan pembaruan. Anak memiliki kecerdasan intelektual yang tinggi.' },
  { name: 'Punarvasu', ruler: 'Jupiter', syllables: ['Ke', 'Ko', 'Ha', 'Hi'], quality: 'Movable', description: 'Mewakili kembalinya cahaya dan kemakmuran. Anak cenderung murah hati dan religius.' },
  { name: 'Pushya', ruler: 'Saturn', syllables: ['Hu', 'He', 'Ho', 'Da'], quality: 'Light', description: 'Nakshatra paling menguntungkan, melambangkan pengasuhan dan kebijaksanaan spiritual.' },
  { name: 'Ashlesha', ruler: 'Mercury', syllables: ['Dee', 'Doo', 'De', 'Do'], quality: 'Sharp', description: 'Mewakili intuisi yang tajam dan perlindungan. Anak memiliki kemampuan analisis yang kuat.' },
  { name: 'Magha', ruler: 'Ketu', syllables: ['Ma', 'Mi', 'Mu', 'Me'], quality: 'Cruel', description: 'Mewakili kejayaan leluhur dan otoritas. Anak memiliki martabat tinggi dan jiwa pemimpin.' },
  { name: 'Purva Phalguni', ruler: 'Venus', syllables: ['Mo', 'Ta', 'Ti', 'Tu'], quality: 'Cruel', description: 'Mewakili cinta, kebahagiaan, dan kreativitas. Anak menyukai harmoni dan seni.' },
  { name: 'Uttara Phalguni', ruler: 'Sun', syllables: ['Te', 'To', 'Pa', 'Pi'], quality: 'Fixed', description: 'Mewakili kedermawanan dan kemandirian. Anak cenderung setia dan bertanggung jawab.' },
  { name: 'Hasta', ruler: 'Moon', syllables: ['Pu', 'Sha', 'Na', 'Tha'], quality: 'Light', description: 'Mewakili keterampilan tangan dan kecerdasan praktis. Anak berbakat dalam seni atau teknis.' },
  { name: 'Chitra', ruler: 'Mars', syllables: ['Pe', 'Po', 'Ra', 'Ri'], quality: 'Soft', description: 'Mewakili kreativitas ilahi dan keindahan. Anak memiliki visi artistik yang unik.' },
  { name: 'Swati', ruler: 'Rahu', syllables: ['Ru', 'Re', 'Ro', 'Ta'], quality: 'Movable', description: 'Mewakili kemandirian dan kebebasan. Anak mudah beradaptasi dan komunikatif.' },
  { name: 'Vishakha', ruler: 'Jupiter', syllables: ['Ti', 'Tu', 'Te', 'To'], quality: 'Mixed', description: 'Mewakili fokus dan keberhasilan melalui usaha. Anak bertekad mencapai tujuan besar.' },
  { name: 'Anuradha', ruler: 'Saturn', syllables: ['Na', 'Ni', 'Nu', 'Ne'], quality: 'Soft', description: 'Mewakili persahabatan dan kerja sama. Anak memiliki kemampuan sosial yang baik.' },
  { name: 'Jyeshtha', ruler: 'Mercury', syllables: ['No', 'Ya', 'Yi', 'Yu'], quality: 'Sharp', description: 'Mewakili kedewasaan dan perlindungan. Anak cenderung bijaksana di usia muda.' },
  { name: 'Mula', ruler: 'Ketu', syllables: ['Ye', 'Yo', 'Ba', 'Bi'], quality: 'Sharp', description: 'Mewakili pencarian akar masalah dan transformasi. Anak memiliki wawasan spiritual.' },
  { name: 'Purva Ashadha', ruler: 'Venus', syllables: ['Bu', 'Dha', 'Pha', 'Dha'], quality: 'Cruel', description: 'Mewakili kemenangan dan keyakinan diri. Anak pantang menyerah dalam rintangan.' },
  { name: 'Uttara Ashadha', ruler: 'Sun', syllables: ['Bhe', 'Bho', 'Ja', 'Ji'], quality: 'Fixed', description: 'Mewakili kemenangan abadi dan kebajikan. Anak cenderung dihormati lingkungannya.' },
  { name: 'Shravana', ruler: 'Moon', syllables: ['Khi', 'Khu', 'Khe', 'Kho'], quality: 'Movable', description: 'Mewakili kemampuan mendengar dan belajar. Anak sangat cerdas dan bijak.' },
  { name: 'Dhanishta', ruler: 'Mars', syllables: ['Ga', 'Gi', 'Gu', 'Ge'], quality: 'Movable', description: 'Mewakili kekayaan dan bakat musik/seni. Anak memiliki ritme hidup yang baik.' },
  { name: 'Shatabhisha', ruler: 'Rahu', syllables: ['Go', 'Sa', 'Si', 'Su'], quality: 'Movable', description: 'Mewakili penyembuhan dan rahasia alam semesta. Anak memiliki intuisi mistis.' },
  { name: 'Purva Bhadrapada', ruler: 'Jupiter', syllables: ['Se', 'So', 'Da', 'Di'], quality: 'Cruel', description: 'Mewakili gairah dan idealisme tinggi. Anak memiliki dedikasi yang luar biasa.' },
  { name: 'Uttara Bhadrapada', ruler: 'Saturn', syllables: ['Du', 'Tha', 'Jha', 'Na'], quality: 'Fixed', description: 'Mewakili stabilitas dan kedamaian batin. Anak memiliki kontrol diri yang kuat.' },
  { name: 'Revati', ruler: 'Mercury', syllables: ['De', 'Do', 'Cha', 'Chi'], quality: 'Soft', description: 'Mewakili perjalanan yang aman dan kemakmuran. Anak sangat penyayang dan intuitif.' }
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

/**
 * Calculates approximate Moon Longitude
 * Uses a reference point: Jan 1, 2000, 00:00:00 UTC
 * Moon Longitude was approx 201.27 degrees (in Libra/Tula)
 */
function getMoonLongitude(date) {
  const reference = new Date('2000-01-01T00:00:00Z');
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSince = (date - reference) / msPerDay;
  
  // Moon average motion: 13.176396 degrees per day
  const moonSpeed = 13.176396;
  const initialLong = 201.27;
  
  let longitude = (initialLong + (moonSpeed * daysSince)) % 360;
  if (longitude < 0) longitude += 360;
  return longitude;
}

/**
 * Subtracts Ayanamsha (Lahiri)
 * Ayanamsha in 2000 was approx 23.85 degrees
 * Increases by approx 0.0139 degrees per year
 */
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

  return {
    rashi: rashi.name,
    rashiRuler: rashi.ruler,
    nakshatra: nakshatra.name,
    nakshatraRuler: nakshatra.ruler,
    nakshatraQuality: nakshatra.quality,
    nakshatraDescription: nakshatra.description,
    pada: pada,
    recommendedSyllables: nakshatra.syllables,
    targetSyllable: recommendedSyllable,
    interpretation: `Lahir di bawah naungan Bintang ${nakshatra.name} (Nakshatra) pada kuarter ke-${pada} (Pada). Rashi (Zodiak Bulan) Anda adalah ${rashi.name} yang dikuasai oleh planet ${rashi.ruler}.`
  };
}

export function checkNamingHarmony(name, recommendedSyllables) {
  const firstPart = name.split(' ')[0] || '';
  const firstChar = firstPart.charAt(0).toUpperCase();
  const firstTwo = firstPart.substring(0, 2).toUpperCase();
  
  // Simple check for phonetic match
  const matches = recommendedSyllables.some(s => {
    const sUpper = s.toUpperCase();
    return firstChar === sUpper.charAt(0) || firstTwo === sUpper;
  });
  
  return matches ? 10 : 0; // Bonus score for Jyotisha harmony
}

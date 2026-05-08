import interpretations from '../data/numerologyInterpretations.json';

export const PYTHAGOREAN_MAP = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

const VOWELS = new Set(['A','E','I','O','U']);

function reduceToSingle(num) {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
}

export function calculateLifePath(birthDate) {
  const d = birthDate.getDate();
  const m = birthDate.getMonth() + 1;
  const y = birthDate.getFullYear();
  const dayReduced = reduceToSingle(d);
  const monthReduced = reduceToSingle(m);
  const yearReduced = reduceToSingle(String(y).split('').reduce((s, digit) => s + parseInt(digit), 0));
  return reduceToSingle(dayReduced + monthReduced + yearReduced);
}

export function calculateDestiny(name) {
  const chars = name.toUpperCase().split('');
  const breakdown = chars.map(c => ({ char: c, value: PYTHAGOREAN_MAP[c] || 0 }));
  const total = breakdown.reduce((s, b) => s + b.value, 0);
  return { value: reduceToSingle(total || 1), breakdown };
}

export function calculateSoulUrge(name) {
  const vowelValues = name.toUpperCase().split('')
    .filter(c => VOWELS.has(c) && PYTHAGOREAN_MAP[c])
    .map(c => PYTHAGOREAN_MAP[c]);
  return reduceToSingle(vowelValues.reduce((s, v) => s + v, 0) || 1);
}

export function calculatePersonality(name) {
  const consonantValues = name.toUpperCase().split('')
    .filter(c => !VOWELS.has(c) && PYTHAGOREAN_MAP[c])
    .map(c => PYTHAGOREAN_MAP[c]);
  return reduceToSingle(consonantValues.reduce((s, v) => s + v, 0) || 1);
}

export function calculateCompatibility(numbers) {
  if (numbers.length < 2) return 100;
  let totalHarmony = 0;
  let comparisons = 0;
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const diff = Math.abs(numbers[i] - numbers[j]);
      const harmony = diff === 0 ? 100 : diff <= 2 ? 85 : diff <= 4 ? 65 : diff <= 6 ? 45 : 30;
      totalHarmony += harmony;
      comparisons++;
    }
  }
  return Math.round(totalHarmony / comparisons);
}

export function getInterpretation(number) {
  const key = String(number);
  return interpretations.numbers[key] || interpretations.numbers["1"];
}

export function analyzeNumerology(name, birthDate) {
  const lifePath = calculateLifePath(birthDate);
  const birthDayNumber = reduceToSingle(birthDate.getDate()); // Tanggal
  const destinyObj = calculateDestiny(name); // Swara / Destiny
  const soulUrge = calculateSoulUrge(name); // Atma / Soul Urge
  const personality = calculatePersonality(name);
  
  return {
    lifePath, 
    tanggal: birthDayNumber,
    swara: destinyObj.value,
    atma: soulUrge,
    personality,
    destiny: destinyObj.value,
    destinyBreakdown: destinyObj.breakdown,
    soulUrge, 
    lifePathInterpretation: getInterpretation(lifePath),
    tanggalInterpretation: getInterpretation(birthDayNumber),
    swaraInterpretation: getInterpretation(destinyObj.value),
    atmaInterpretation: getInterpretation(soulUrge),
    personalityInterpretation: getInterpretation(personality),
    destinyInterpretation: getInterpretation(destinyObj.value),
    soulUrgeInterpretation: getInterpretation(soulUrge),
  };
}

export function calculateFamilyNumerologyScore(fatherName, fatherBirth, motherName, motherBirth, childName, childBirth) {
  const fatherLP = calculateLifePath(fatherBirth);
  const motherLP = calculateLifePath(motherBirth);
  const childLP = calculateLifePath(childBirth);
  const fatherD = calculateDestiny(fatherName).value;
  const motherD = calculateDestiny(motherName).value;
  const childD = calculateDestiny(childName).value;
  const lpScore = calculateCompatibility([fatherLP, motherLP, childLP]);
  const dScore = calculateCompatibility([fatherD, motherD, childD]);
  return Math.round((lpScore * 0.6 + dScore * 0.4));
}

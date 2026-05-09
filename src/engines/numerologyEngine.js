import interpretations from '../data/numerologyInterpretations.json';

export const PYTHAGOREAN_MAP = {
  A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, I:9,
  J:1, K:2, L:3, M:4, N:5, O:6, P:7, Q:8, R:9,
  S:1, T:2, U:3, V:4, W:5, X:6, Y:7, Z:8
};

export const CHALDEAN_MAP = {
  A:1, B:2, C:3, D:4, E:5, F:8, G:3, H:5, I:1,
  J:1, K:2, L:3, M:4, N:5, O:7, P:8, Q:1, R:2,
  S:3, T:4, U:6, V:6, W:6, X:5, Y:1, Z:7
};

export const NEPTU_NAMA_MAP = {
  A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, I:9, J:1,
  K:2, L:3, M:4, N:5, O:6, P:7, Q:8, R:9, S:1, T:2,
  U:3, V:4, W:5, X:6, Y:7, Z:8
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

export function calculateDestiny(name, map = PYTHAGOREAN_MAP) {
  const chars = name.toUpperCase().split('');
  const breakdown = chars.map(c => ({ char: c, value: map[c] || 0 }));
  const total = breakdown.reduce((s, b) => s + b.value, 0);
  return { value: reduceToSingle(total || 1), breakdown, total };
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

export function calculateKarmicLessons(name) {
  const nameChars = name.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const presentNumbers = new Set(nameChars.map(c => PYTHAGOREAN_MAP[c]).filter(n => n > 0));
  const missing = [];
  for (let i = 1; i <= 9; i++) {
    if (!presentNumbers.has(i)) missing.push(i);
  }
  return missing;
}

export function calculateKarmicDebts(num) {
  const debts = [13, 14, 16, 19];
  return debts.includes(num) ? num : null;
}

export function calculateGrowthNumber(name) {
  const firstName = name.split(/\s+/)[0];
  return calculateDestiny(firstName).value;
}

export function analyzePerWord(fullName) {
  const words = fullName.split(/\s+/).filter(w => w.length > 0);
  return words.map(word => {
    const pyth = calculateDestiny(word, PYTHAGOREAN_MAP);
    const chal = calculateDestiny(word, CHALDEAN_MAP);
    const neptu = word.toUpperCase().split('').reduce((s, c) => s + (NEPTU_NAMA_MAP[c] || 0), 0);
    return {
      word,
      pythagorean: pyth.value,
      chaldean: chal.value,
      neptu: neptu,
      interpretation: getInterpretation(pyth.value)
    };
  });
}

export function calculateMetaphysicalScore(numerologyData) {
  let score = 0;
  const pythInterp = getInterpretation(numerologyData.destiny);
  const chalInterp = getInterpretation(numerologyData.chaldeanDestiny);
  
  score += (pythInterp.metaphysicalScore || 0);
  score += (chalInterp.metaphysicalScore || 0);
  
  // Bonus for Master Numbers
  if ([11, 22, 33].includes(numerologyData.destiny)) score += 5;
  if ([11, 22, 33].includes(numerologyData.chaldeanDestiny)) score += 5;
  
  return score;
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
  const birthDayNumber = reduceToSingle(birthDate.getDate());
  const destinyObj = calculateDestiny(name, PYTHAGOREAN_MAP);
  const chaldeanObj = calculateDestiny(name, CHALDEAN_MAP);
  const soulUrge = calculateSoulUrge(name);
  const personality = calculatePersonality(name);
  const wordAnalysis = analyzePerWord(name);
  const karmicLessons = calculateKarmicLessons(name);
  const growthNumber = calculateGrowthNumber(name);
  
  // Check for Karmic Debts in main numbers
  const karmicDebts = [
    calculateKarmicDebts(destinyObj.total),
    calculateKarmicDebts(calculateLifePath(birthDate)) // Simplified: checking raw totals before reduction would be better but requires engine change
  ].filter(d => d !== null);

  const result = {
    lifePath,
    tanggal: birthDayNumber,
    swara: destinyObj.value,
    atma: soulUrge,
    personality,
    destiny: destinyObj.value,
    destinyBreakdown: destinyObj.breakdown,
    chaldeanDestiny: chaldeanObj.value,
    wordAnalysis,
    soulUrge,
    karmicLessons,
    karmicDebts,
    growthNumber,
    lifePathInterpretation: getInterpretation(lifePath),
    tanggalInterpretation: getInterpretation(birthDayNumber),
    swaraInterpretation: getInterpretation(destinyObj.value),
    atmaInterpretation: getInterpretation(soulUrge),
    personalityInterpretation: getInterpretation(personality),
    destinyInterpretation: getInterpretation(destinyObj.value),
    chaldeanInterpretation: getInterpretation(chaldeanObj.value),
    soulUrgeInterpretation: getInterpretation(soulUrge),
  };
  
  result.metaphysicalScore = calculateMetaphysicalScore(result);
  return result;
}

export function calculateFamilyNumerologyScore(fatherName, fatherBirth, motherName, motherBirth, childName, childBirth) {
  const fatherLP = calculateLifePath(fatherBirth);
  const motherLP = calculateLifePath(motherBirth);
  const childLP = calculateLifePath(childBirth);
  const fatherD = calculateDestiny(fatherName, PYTHAGOREAN_MAP).value;
  const motherD = calculateDestiny(motherName, PYTHAGOREAN_MAP).value;
  const childD = calculateDestiny(childName, PYTHAGOREAN_MAP).value;
  const lpScore = calculateCompatibility([fatherLP, motherLP, childLP]);
  const dScore = calculateCompatibility([fatherD, motherD, childD]);
  return Math.round((lpScore * 0.6 + dScore * 0.4));
}

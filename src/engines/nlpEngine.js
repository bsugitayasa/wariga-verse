// nlpEngine.js
// Handles NLP processing: IAST transliteration, semantic extraction, phonetic scoring

/**
 * Basic mapping for standardizing Indonesian/Balinese spelling of Sanskrit names to IAST
 */
const IAST_MAP = {
  'aa': 'ā',
  'ii': 'ī',
  'uu': 'ū',
  'sh': 'ś',
  'sy': 'ś',
  'c': 'c', // 'c' in Indonesian is 'ch' in English, matches 'c' in IAST
  'j': 'j',
  'ny': 'ñ',
  'ng': 'ṅ',
  'th': 'ṭh',
  'dh': 'ḍh',
  'bh': 'bh',
  'ph': 'ph',
  'kh': 'kh',
  'gh': 'gh',
  'v': 'v', // w and v are often interchangeable in Bali/Sanskrit, IAST uses v
  'w': 'v'
};

export function transliterateToIAST(name) {
  if (!name) return '';
  let lowerName = name.toLowerCase();
  
  // Basic replacements based on common Indonesian-Sanskrit conventions
  // Note: True IAST requires deep linguistic parsing, this is a heuristic approach.
  for (const [key, val] of Object.entries(IAST_MAP)) {
    lowerName = lowerName.split(key).join(val);
  }
  
  // Capitalize first letter properly (handling unicode)
  return lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
}

const SEMANTIC_KEYWORDS = {
  spiritual: ['suci', 'dewa', 'ilahi', 'doa', 'spiritual', 'agama', 'batin', 'kebenaran', 'yoga', 'weda', 'mantra', 'karma'],
  royal: ['raja', 'pemimpin', 'agung', 'mulia', 'ksatria', 'panglima', 'kejayaan', 'mahkota', 'istana', 'bangsawan'],
  bravery: ['berani', 'pahlawan', 'kuat', 'teguh', 'perkasa', 'pejuang', 'kemenangan', 'taklukkan'],
  beauty: ['cantik', 'indah', 'anggun', 'bunga', 'cahaya', 'pesona', 'manis', 'lembut'],
  wisdom: ['bijak', 'ilmu', 'pengetahuan', 'cerdas', 'paham', 'mengerti', 'akal', 'wawasan'],
  wealth: ['kaya', 'harta', 'makmur', 'emas', 'permata', 'berlimpah', 'rezeki', 'uang', 'keberuntungan']
};

export const AURA_DB = {
    // Format: "KATA": [spirit, royal, brave, intel, beauty, prosper, love]
    "NAROTTAMA":   [9, 8, 6, 9, 6, 7, 7],
    "DHARMA":      [10,7, 7, 9, 6, 8, 8],
    "VIDYA":       [8, 6, 5,10, 7, 7, 6],
    "PRAJNA":      [9, 7, 5,10, 6, 7, 7],
    "VIJAYA":      [7, 9,10, 7, 7, 8, 6],
    "KIRANA":      [7, 6, 5, 7,10, 8, 8],
    "SATYA":       [10,7, 7, 9, 6, 7, 8],
    "ANANDA":      [9, 6, 5, 7, 9, 8,10],
    "WISESA":      [7,10, 8, 7, 7, 9, 6],
    "UDAYANA":     [8,10, 8, 7, 7, 9, 7],
    "VIKRAMA":     [7, 9,10, 7, 7, 8, 5],
    "PARAMARTHA":  [10,8, 6,10, 7, 8, 8],
    "MANGGALA":    [9, 8, 6, 7, 8,10, 8],
    "NIRMALA":     [9, 7, 5, 7,10, 7, 9],
    "MAHATMA":     [10,9, 7, 9, 7, 8, 8],
    "VARADA":      [9, 9, 6, 8, 8,10, 9],
    "ANUGRAHA":    [9, 8, 6, 8, 8,10, 9],
    "ARJUNA":      [8, 8,10, 8, 8, 7, 7],
    "KARUNIKA":    [9, 7, 5, 8, 8, 8,10],
    "KARUNA":      [9, 6, 5, 8, 8, 7,10],
    "JAYENDRA":    [7,10, 9, 7, 7, 9, 6],
    "RATNAKARA":   [8, 9, 6, 8, 9,10, 7],
    "SATWIKA":     [10,7, 6, 8, 8, 8, 8],
    "VIBHUTI":     [9, 9, 6, 8, 8,10, 7],
    "PRANAWA":     [10,7, 6, 9, 8, 7, 8],
    "JAGADHITA":   [9, 8, 6, 8, 7,10, 9],
};

export function extractSemanticMeaning(meaning, word = "") {
  const upperWord = word.toUpperCase();
  if (AURA_DB[upperWord]) {
    const a = AURA_DB[upperWord];
    return {
      categories: ['AURA_DB_MATCH'],
      spiritualDepth: a[0],
      royalAura: a[1],
      bravery: a[2],
      intellect: a[3],
      beauty: a[4],
      wealth: a[5],
      compassion: a[6]
    };
  }

  // Baseline matching the plan's [s, r, 5, 6, 6, 7, 6] average if no meaning is found
  if (!meaning) return { 
    categories: [], 
    spiritualDepth: 6, 
    royalAura: 6, 
    bravery: 5, 
    beauty: 6, 
    intellect: 6, 
    wealth: 7,
    compassion: 6 
  };
  
  const lowerMeaning = meaning.toLowerCase();
  const categories = [];
  
  // Starting values matching the default baseline from the plan
  let categoriesData = {
    spiritualDepth: 5,
    royalAura: 5,
    bravery: 5,
    beauty: 6,
    wisdom: 6,
    wealth: 6
  };

  for (const [category, keywords] of Object.entries(SEMANTIC_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMeaning.includes(keyword)) {
        if (!categories.includes(category)) categories.push(category);
        if (category === 'spiritual') categoriesData.spiritualDepth += 4;
        if (category === 'royal') categoriesData.royalAura += 4;
        if (category === 'bravery') categoriesData.bravery += 4;
        if (category === 'beauty') categoriesData.beauty += 4;
        if (category === 'wisdom') categoriesData.wisdom += 4;
        if (category === 'wealth') categoriesData.wealth += 4;
      }
    }
  }

  // Base fallback if meaning doesn't match perfectly, we keep the baseline
  if (categories.length === 0) {
    categoriesData = { spiritualDepth: 6, royalAura: 6, bravery: 5, beauty: 6, wisdom: 6, wealth: 7 };
  }

  return {
    categories,
    spiritualDepth: Math.min(10, categoriesData.spiritualDepth),
    royalAura: Math.min(10, categoriesData.royalAura),
    bravery: Math.min(10, categoriesData.bravery),
    beauty: Math.min(10, categoriesData.beauty),
    intellect: Math.min(10, categoriesData.wisdom), // matching intellect to wisdom
    wealth: Math.min(10, categoriesData.wealth),
    compassion: Math.min(10, Math.ceil(categoriesData.spiritualDepth * 0.5 + 4)) // simulated compassion baseline ~6-9
  };
}

export function calculatePhoneticScore(name) {
  if (!name) return 0;
  const lower = name.toLowerCase();
  
  // Vowels and smooth consonants are globally friendly
  const vowels = ['a', 'e', 'i', 'o', 'u', 'ā', 'ī', 'ū'];
  const smoothConsonants = ['m', 'n', 'l', 'r', 'y', 'w', 's'];
  const harshConsonants = ['k', 't', 'p', 'g', 'd', 'b', 'c', 'j', 'q', 'x', 'z'];
  
  let score = 50; // Base score
  
  let vCount = 0;
  let scCount = 0;
  let hcCount = 0;
  
  for (let char of lower) {
    if (vowels.includes(char)) vCount++;
    else if (smoothConsonants.includes(char)) scCount++;
    else if (harshConsonants.includes(char)) hcCount++;
  }
  
  // Harmony: good ratio of vowels to consonants
  const totalLength = lower.replace(/\s+/g, '').length;
  if (totalLength === 0) return 0;
  
  const vowelRatio = vCount / totalLength;
  
  // Names with ~40-60% vowels tend to be very euphonic globally
  if (vowelRatio >= 0.35 && vowelRatio <= 0.65) {
    score += 20;
  } else if (vowelRatio > 0.65) {
    score += 10;
  }
  
  // Smooth consonants add friendliness
  score += (scCount * 2);
  // Harsh consonants reduce slightly if too many consecutively, but we just penalize ratio here
  const harshRatio = hcCount / totalLength;
  if (harshRatio > 0.5) score -= 15;
  
  // No awkward double letters (except standard ones like 'ee', 'oo')
  if (/(b{2,}|c{2,}|d{2,}|g{2,}|h{2,}|j{2,}|k{2,}|p{2,}|q{2,}|t{2,}|v{2,}|w{2,}|x{2,}|y{2,}|z{2,})/i.test(lower)) {
    score -= 15;
  }

  // Bonus for ending in a vowel (common in many languages for pleasant sounding names)
  if (vowels.includes(lower.slice(-1))) {
    score += 10;
  }
  
  return Math.min(100, Math.max(0, score));
}

export function calculateBaliAuthenticity(name, fatherName = '', birthOrderName = '') {
  let score = 50; // Base
  
  const upperName = name.toUpperCase();
  const titleRegex = /^(IDA BAGUS|IDA AYU|ANAK AGUNG|COKORDA|I GUSTI|DEWA|I DEWA|NI DEWA|I |NI )/;
  
  if (titleRegex.test(upperName)) {
    score += 20;
  }
  
  const birthOrderRegex = /\b(WAYAN|PUTU|GEDE|ILUH|MADE|KADEK|NENGAH|NYOMAN|KOMANG|KETUT)\b/;
  if (birthOrderRegex.test(upperName) || (birthOrderName && birthOrderRegex.test(birthOrderName.toUpperCase()))) {
    score += 20;
  }

  // Bonus if the final name matches traditional Sanskrit roots (very common in Bali)
  // Just a heuristic bump
  if (upperName.endsWith('A') || upperName.endsWith('I') || upperName.endsWith('U')) {
    score += 10;
  }

  return Math.min(100, score);
}

export function applySynergyBonus(words, auraScores) {
  const SINERGI = {
      'DHARMA_VIJAYA':    { spiritualDepth: 0.5, royalAura: 0.5 },
      'SATYA_PRAJNA':     { spiritualDepth: 0.5, intellect: 0.5 },
      'VIJAYA_VIKRAMA':   { royalAura: 0.5, bravery: 0.5 },
      'KARUNA_ANANDA':    { compassion: 0.8, beauty: 0.3 },
      'ANUGRAHA_NIRMALA': { spiritualDepth: 0.5, wealth: 0.5 }
  };
  
  let boosted = { ...auraScores };
  const upperWords = words.map(w => w.toUpperCase());
  
  for (const [pairKey, bonuses] of Object.entries(SINERGI)) {
    const pair = pairKey.split('_');
    if (pair.every(k => upperWords.includes(k))) {
      for (const [dim, val] of Object.entries(bonuses)) {
        if (boosted[dim] !== undefined) {
          boosted[dim] = Math.min(10, boosted[dim] + val);
        }
      }
    }
  }
  
  return boosted;
}

export function runNLPAnalysis(name, meaning) {
  const words = name.split(' ');
  const iast = transliterateToIAST(name);
  
  // Aggregate individual words
  let aggregatedSemantic = null;
  if (words.length > 0) {
    const semanticsList = words.map(w => extractSemanticMeaning(meaning, w));
    aggregatedSemantic = {
      categories: semanticsList[0].categories,
      spiritualDepth: semanticsList.reduce((acc, curr) => acc + curr.spiritualDepth, 0) / words.length,
      royalAura: semanticsList.reduce((acc, curr) => acc + curr.royalAura, 0) / words.length,
      bravery: semanticsList.reduce((acc, curr) => acc + curr.bravery, 0) / words.length,
      beauty: semanticsList.reduce((acc, curr) => acc + curr.beauty, 0) / words.length,
      intellect: semanticsList.reduce((acc, curr) => acc + curr.intellect, 0) / words.length,
      wealth: semanticsList.reduce((acc, curr) => acc + curr.wealth, 0) / words.length,
      compassion: semanticsList.reduce((acc, curr) => acc + curr.compassion, 0) / words.length
    };
    // Synergy
    aggregatedSemantic = applySynergyBonus(words, aggregatedSemantic);
  } else {
    aggregatedSemantic = extractSemanticMeaning(meaning, name);
  }
  
  const phoneticScore = calculatePhoneticScore(name);
  
  return {
    iast,
    semantic: aggregatedSemantic,
    phoneticScore,
    globalFriendliness: phoneticScore // alias
  };
}

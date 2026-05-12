import { calculatePawukon } from './pawukonEngine';
import { analyzeNumerology, calculateFamilyNumerologyScore, calculateLifePath, checkKarmicDebts, calculateDestiny, PYTHAGOREAN_MAP } from './numerologyEngine';
import { analyzeAstrology, calculateFamilyAstrologyScore } from './astrologyEngine';
import { analyzeNawaSanga, calculateFamilyDirectionScore } from './nawaSangaEngine';
import { analyzeKarma } from './karmaEngine';
import { calculateJyotisha, checkNamingHarmony } from './jyotishaEngine';
import { calculateBaZi, calculateQimen, checkChineseHarmony, getNameElements, calculateNameQimen } from './chineseMetaphysicsEngine';
import { calculateNameDauh } from './nameWarigaEngine';
import { runNLPAnalysis, calculateBaliAuthenticity } from './nlpEngine';
import namesDatabase from '../data/namesDatabase.json';
import forbiddenNames from '../data/forbiddenNames.json';

const WEIGHTS = {
  wariga: 0.15,
  numerology: 0.15,
  astrology: 0.0,
  jyotisha: 0.15,
  bazi: 0.15,
  nlp: 0.20,
  nawaSanga: 0.0,
  karma: 0.10,
  culture: 0.10
};

export function runFullAnalysis(fatherName, fatherBirth, motherName, motherBirth, childName, childBirth, childGender) {
  const fatherPawukon = calculatePawukon(fatherBirth);
  const motherPawukon = calculatePawukon(motherBirth);
  const childPawukon = calculatePawukon(childBirth);

  const isSelfAnalysis = !fatherName || !motherName;

  // 1. Calculate Core Engines
  const familyNumerologyScore = isSelfAnalysis ? 100 : calculateFamilyNumerologyScore(fatherName, fatherBirth, motherName, motherBirth, childName, childBirth);
  const familyAstrologyScore = isSelfAnalysis ? 100 : calculateFamilyAstrologyScore(fatherBirth, motherBirth, childBirth);
  const childNumerology = analyzeNumerology(childName, childBirth);
  const childAstrology = analyzeAstrology(childBirth);
  const childJyotisha = calculateJyotisha(childBirth);
  const childNawaSanga = analyzeNawaSanga(childPawukon);
  const karma = analyzeKarma(fatherPawukon, motherPawukon, childPawukon, familyNumerologyScore, familyAstrologyScore);
  const warigaScore = calculateWarigaScore(fatherPawukon, motherPawukon, childPawukon);
  const nameDauh = calculateNameDauh(childName);
  
  const baziData = calculateBaZi(childBirth);
  const qimenData = calculateQimen(childBirth);
  const nameQimen = calculateNameQimen(childName);

  // 2. Extract Meaning and NLP
  const nameEntry = namesDatabase.find(n => childName.toUpperCase().includes(n.name.toUpperCase()));
  const meaning = nameEntry ? nameEntry.meaning : '';
  const nlpData = runNLPAnalysis(childName, meaning);
  
  // 3. Enriched Scoring Dimensions
  const baliAuthenticity = calculateBaliAuthenticity(childName, fatherName || '');
  
  const spiritualDepth = Math.min(100, 
    (childNawaSanga ? 20 : 0) + 
    (karma.harmonyScore > 80 ? 30 : karma.harmonyScore > 60 ? 15 : 0) + 
    nlpData.semantic.spiritualDepth + 
    ([7, 9, 11, 22, 33].includes(childNumerology.destiny) ? 20 : 0)
  );

  const royalAura = Math.min(100,
    nlpData.semantic.royalAura +
    (/IDA BAGUS|IDA AYU|ANAK AGUNG|COKORDA/.test(childName.toUpperCase()) ? 40 : 0) +
    (childJyotisha.nakshatra === 'Magha' ? 30 : 0) +
    ([1, 8].includes(childNumerology.destiny) ? 20 : 0)
  );

  const numerologyStability = Math.max(0, 100 - (childNumerology.karmicDebts.length * 20));

  const karmicLoad = Math.min(100,
    (childNumerology.karmicDebts.length * 30) +
    (baziData.clashes.length * 20) +
    (childNumerology.karmicLessons.length * 10)
  );

  // Strategic Harmonies
  const jyotishaMatch = checkNamingHarmony(childName, childJyotisha.recommendedSyllables);
  const jyotishaScore = Math.min(100, 70 + (jyotishaMatch ? 30 : 0));

  const destinyMatch = childNumerology.destiny === childNumerology.lifePath;
  const chaldeanMatch = childNumerology.chaldeanDestiny === childNumerology.lifePath;
  
  const numerologyScore = Math.min(100, 
    familyNumerologyScore + 
    (destinyMatch ? 10 : 0) + 
    (chaldeanMatch ? 5 : 0) + 
    (childNumerology.metaphysicalScore > 10 ? 10 : childNumerology.metaphysicalScore > 5 ? 5 : 0)
  );

  const nameElements = getNameElements(childName);
  const baziScore = checkChineseHarmony(nameElements, baziData);
  
  const qimenBirthScore = qimenData.gate === 'Life' || qimenData.gate === 'Open' ? 100 : 70;
  const qimenScore = Math.round((qimenBirthScore + (nameQimen.score * 10)) / 2);
  
  // Adjust Wariga score slightly with Name Dauh
  const finalWarigaScore = nameDauh ? Math.min(100, Math.round(warigaScore * 0.7 + (nameDauh.score * 10) * 0.3)) : warigaScore;

  // Weighting Logic
  const FINAL_WEIGHTS = isSelfAnalysis ? {
    wariga: 0.10,
    numerology: 0.20,
    astrology: 0.05,
    jyotisha: 0.20,
    bazi: 0.15,
    nlp: 0.15,
    nawaSanga: 0.0,
    karma: 0.0,
    culture: 0.15
  } : WEIGHTS;

  const rawTotal = (
    (isSelfAnalysis ? 100 : finalWarigaScore) * FINAL_WEIGHTS.wariga +
    numerologyScore * FINAL_WEIGHTS.numerology +
    familyAstrologyScore * FINAL_WEIGHTS.astrology +
    (isSelfAnalysis ? 100 : (childNawaSanga ? calculateNawaSangaFamilyScore(fatherPawukon, motherPawukon, childPawukon) : 60)) * (isSelfAnalysis ? 0 : FINAL_WEIGHTS.nawaSanga) +
    (isSelfAnalysis ? 100 : karma.harmonyScore) * (isSelfAnalysis ? 0 : FINAL_WEIGHTS.karma) +
    jyotishaScore * FINAL_WEIGHTS.jyotisha +
    baziScore * FINAL_WEIGHTS.bazi +
    nlpData.phoneticScore * FINAL_WEIGHTS.nlp +
    baliAuthenticity * FINAL_WEIGHTS.culture
  );

  const weightSum = Object.values(FINAL_WEIGHTS).reduce((a, b) => a + b, 0);
  const totalScore = Math.round(rawTotal / weightSum);

  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    enrichedScores: {
      spiritualDepth,
      royalAura,
      pronunciation: nlpData.phoneticScore,
      globalFriendliness: nlpData.globalFriendliness,
      baliAuthenticity,
      numerologyStability,
      karmicLoad
    },
    breakdown: {
      wariga: { score: finalWarigaScore, weight: WEIGHTS.wariga, data: { father: fatherPawukon, mother: motherPawukon, child: childPawukon, nameDauh } },
      numerology: { score: numerologyScore, weight: WEIGHTS.numerology, data: childNumerology },
      astrology: { score: familyAstrologyScore, weight: WEIGHTS.astrology, data: childAstrology },
      jyotisha: { score: jyotishaScore, weight: WEIGHTS.jyotisha, data: childJyotisha },
      bazi: { score: baziScore, weight: WEIGHTS.bazi, data: { ...baziData, nameElements } },
      qimen: { score: qimenScore, weight: 0, data: { ...qimenData, nameQimen } },
      nawaSanga: { score: childNawaSanga ? calculateNawaSangaFamilyScore(fatherPawukon, motherPawukon, childPawukon) : 60, weight: WEIGHTS.nawaSanga, data: childNawaSanga },
      karma: { score: karma.harmonyScore, weight: WEIGHTS.karma, data: karma },
      nlp: { score: nlpData.phoneticScore, weight: WEIGHTS.nlp, data: nlpData }
    },
    lifePattern: karma.lifePattern,
    isSelfAnalysis: isSelfAnalysis,
    recommendation: getRecommendationText(totalScore),
  };
}

function calculateWarigaScore(fPawukon, mPawukon, cPawukon) {
  if (!fPawukon || !mPawukon) return 100;
  const uripHarmony = 100 - Math.abs(fPawukon.uripTotal + mPawukon.uripTotal - cPawukon.uripTotal * 2) * 3;
  const wukuBonus = (fPawukon.wuku.urip + mPawukon.wuku.urip + cPawukon.wuku.urip) % 3 === 0 ? 15 : 0;
  return Math.min(100, Math.max(20, Math.round(uripHarmony + wukuBonus)));
}

function calculateNawaSangaFamilyScore(fPawukon, mPawukon, cPawukon) {
  if (!fPawukon || !mPawukon) return 100;
  return calculateFamilyDirectionScore(fPawukon.uripTotal, mPawukon.uripTotal, cPawukon.uripTotal);
}

function getRecommendationText(score) {
  if (score >= 85) return 'Sangat Harmonis — Keselarasan sempurna antara energi keluarga';
  if (score >= 70) return 'Harmonis — Keselarasan baik dengan beberapa area untuk ditingkatkan';
  if (score >= 55) return 'Cukup Harmonis — Keselarasan moderat, ada potensi pertumbuhan';
  return 'Perlu Perhatian — Disarankan perhatian ekstra pada keseimbangan energi';
}

function generateFullName(rootName, suffixName, gender, fatherName, birthOrderName) {
  let title = gender === 'male' ? 'I' : 'Ni';
  const fNameUpper = fatherName.toUpperCase();
  
  if (fNameUpper.includes('IDA BAGUS')) {
    title = gender === 'male' ? 'Ida Bagus' : 'Ida Ayu';
  } else if (fNameUpper.includes('ANAK AGUNG')) {
    title = 'Anak Agung';
  } else if (fNameUpper.includes('I GUSTI')) {
    title = gender === 'male' ? 'I Gusti' : 'I Gusti Ayu';
  } else if (fNameUpper.includes('I DEWA')) {
    title = gender === 'male' ? 'I Dewa' : 'Ni Dewa Ayu';
  }

  const fParts = fatherName.trim().split(' ');
  let surname = '';
  if (fParts.length > 2) {
    const lastPart = fParts[fParts.length - 1];
    const birthOrderBase = ['Gede', 'Putu', 'Wayan', 'Made', 'Kadek', 'Nyoman', 'Komang', 'Ketut'];
    if (!birthOrderBase.includes(lastPart)) {
      surname = lastPart;
    }
  }

  const mainName = suffixName ? `${rootName} ${suffixName}` : rootName;
  return `${title} ${birthOrderName} ${mainName}${surname ? ' ' + surname : ''}`;
}

const ADDITIONAL_ROOTS = [
  { name: 'Adwaya', meaning: 'Tunggal, tiada bandingnya', element: 'air' },
  { name: 'Bhadra', meaning: 'Mulia, membawa keberuntungan', element: 'earth' },
  { name: 'Danendra', meaning: 'Raja yang kaya raya', element: 'fire' },
  { name: 'Ekaputra', meaning: 'Putra pertama yang cerdas', element: 'air' },
  { name: 'Gajendra', meaning: 'Gajah perkasa, pemimpin', element: 'earth' },
  { name: 'Haridra', meaning: 'Cemerlang, keemasan', element: 'fire' },
  { name: 'Iswara', meaning: 'Pemimpin agung, raja', element: 'air' },
  { name: 'Janardana', meaning: 'Penolong umat manusia', element: 'water' },
  { name: 'Kautsar', meaning: 'Telaga surga, keberkahan', element: 'water' },
  { name: 'Laksita', meaning: 'Terkenal, istimewa', element: 'fire' },
  { name: 'Mahardika', meaning: 'Berbudi luhur, merdeka', element: 'air' },
  { name: 'Nareswara', meaning: 'Raja manusia, bijak', element: 'fire' },
  { name: 'Pranadipa', meaning: 'Cahaya kehidupan', element: 'fire' },
  { name: 'Raditya', meaning: 'Cahaya matahari', element: 'fire' },
  { name: 'Satyawira', meaning: 'Pahlawan kebenaran', element: 'fire' },
  { name: 'Taksa', meaning: 'Sayap, kekuatan terbang', element: 'air' },
  { name: 'Urdha', meaning: 'Mulia, luhur', element: 'earth' },
  { name: 'Wandira', meaning: 'Pohon beringin, perlindungan', element: 'earth' },
  { name: 'Yudhistira', meaning: 'Teguh dalam pertempuran', element: 'earth' }
];

export function recommendNames(fatherName, fatherBirth, motherName, motherBirth, childBirth, childGender, birthOrderName) {
  const childJyotisha = calculateJyotisha(childBirth);
  const recommendedSyllables = childJyotisha.recommendedSyllables.map(s => s.toUpperCase());
  
  const namePool = [
    ...namesDatabase.filter(n => n.gender === childGender || n.gender === 'unisex'),
    ...ADDITIONAL_ROOTS.map(r => ({ ...r, gender: childGender, origin: 'Sanskrit' }))
  ];

  const candidates = [];
  
  const startsWithRec = namePool.filter(n => 
    recommendedSyllables.some(s => n.name.toUpperCase().startsWith(s))
  );

  const poolSize = Math.min(namePool.length, 100); // Expanded because filter is faster
  for (let i = 0; i < poolSize; i++) {
    for (let j = 0; j < poolSize; j++) {
      if (i === j) continue;
      
      const n1 = namePool[i];
      const n2 = namePool[j];
      
      // Blacklist Check
      const isBlacklisted = forbiddenNames.includes(n1.name.toUpperCase()) || forbiddenNames.includes(n2.name.toUpperCase());
      if (isBlacklisted) continue;

      const startsWithSyllable = recommendedSyllables.some(s => n1.name.toUpperCase().startsWith(s));
      if (!startsWithSyllable && i > 15) continue;

      const fullName = generateFullName(n1.name, n2.name, childGender, fatherName, birthOrderName);
      
      // Pre-filter: Fast Numerology Check (Skip if has Karmic Debt)
      const fullNameDestiny = calculateDestiny(fullName, PYTHAGOREAN_MAP);
      const childLifePath = calculateLifePath(childBirth);
      const basicKarmicDebts = checkKarmicDebts([fullNameDestiny.total, childLifePath.total]);
      if (basicKarmicDebts.length > 0) continue; // SKIP: Strict no karmic debt policy

      // Passed Pre-filter! Run full heavy analysis
      const analysis = runFullAnalysis(fatherName, fatherBirth, motherName, motherBirth, fullName, childBirth, childGender, `${n1.meaning} ${n2.meaning}`);
      
      if (analysis.totalScore >= 65) {
        candidates.push({
          name: n1.name,
          fullName: fullName,
          meaning: `${n1.meaning} & ${n2.meaning}`,
          totalScore: analysis.totalScore,
          breakdown: analysis.breakdown,
          enrichedScores: analysis.enrichedScores
        });
      }

      if (candidates.length > 200) break;
    }
    if (candidates.length > 200) break;
  }

  startsWithRec.slice(0, 15).forEach(n => {
    // Blacklist check
    if (forbiddenNames.includes(n.name.toUpperCase())) return;

    const fullName = generateFullName(n.name, '', childGender, fatherName, birthOrderName);
    
    // Pre-filter: Fast Numerology Check
    const fullNameDestiny = calculateDestiny(fullName, PYTHAGOREAN_MAP);
    const childLifePath = calculateLifePath(childBirth);
    const basicKarmicDebts = checkKarmicDebts([fullNameDestiny.total, childLifePath.total]);
    if (basicKarmicDebts.length > 0) return; // Skip if debt

    const analysis = runFullAnalysis(fatherName, fatherBirth, motherName, motherBirth, fullName, childBirth, childGender, n.meaning);
    
    if (analysis.totalScore >= 65) {
      candidates.push({
        ...n,
        fullName: fullName,
        totalScore: analysis.totalScore,
        breakdown: analysis.breakdown,
        enrichedScores: analysis.enrichedScores
      });
    }
  });

  const sorted = candidates.sort((a, b) => b.totalScore - a.totalScore);
  const seen = new Set();
  const unique = sorted.filter(c => {
    if (seen.has(c.fullName)) return false;
    seen.add(c.fullName);
    return true;
  });

  return unique.slice(0, 50);
}

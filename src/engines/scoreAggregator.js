import { calculatePawukon } from './pawukonEngine';
import { analyzeNumerology, calculateFamilyNumerologyScore, calculateLifePath } from './numerologyEngine';
import { analyzeAstrology, calculateFamilyAstrologyScore } from './astrologyEngine';
import { analyzeNawaSanga, calculateFamilyDirectionScore } from './nawaSangaEngine';
import { analyzeKarma } from './karmaEngine';
import { calculateJyotisha, checkNamingHarmony } from './jyotishaEngine';
import { calculateBaZi, calculateQimen, checkChineseHarmony } from './chineseMetaphysicsEngine';
import namesDatabase from '../data/namesDatabase.json';

const WEIGHTS = {
  wariga: 0.15,
  numerology: 0.15,
  astrology: 0.10,
  jyotisha: 0.15,
  bazi: 0.15,
  qimen: 0.10,
  nawaSanga: 0.10,
  karma: 0.10,
};

export function runFullAnalysis(fatherName, fatherBirth, motherName, motherBirth, childName, childBirth, childGender) {
  // Calculate Pawukon for all
  const fatherPawukon = calculatePawukon(fatherBirth);
  const motherPawukon = calculatePawukon(motherBirth);
  const childPawukon = calculatePawukon(childBirth);

  const isSelfAnalysis = !fatherName || !motherName;

  // 1. Calculate Individual Scores
  const familyNumerologyScore = isSelfAnalysis ? 100 : calculateFamilyNumerologyScore(fatherName, fatherBirth, motherName, motherBirth, childName, childBirth);
  const familyAstrologyScore = isSelfAnalysis ? 100 : calculateFamilyAstrologyScore(fatherBirth, motherBirth, childBirth);
  const childNumerology = analyzeNumerology(childName, childBirth);
  const childAstrology = analyzeAstrology(childBirth);
  const childJyotisha = calculateJyotisha(childBirth);
  const childNawaSanga = analyzeNawaSanga(childPawukon);
  const karma = analyzeKarma(fatherPawukon, motherPawukon, childPawukon, familyNumerologyScore, familyAstrologyScore);
  const warigaScore = calculateWarigaScore(fatherPawukon, motherPawukon, childPawukon);
  const baziData = calculateBaZi(childBirth);
  const qimenData = calculateQimen(childBirth);

  // 2. Calculate Strategic Harmonies (Bonus Points)
  const jyotishaMatch = checkNamingHarmony(childName, childJyotisha.recommendedSyllables);
  const jyotishaScore = Math.min(100, 70 + (jyotishaMatch ? 30 : 0));

  const lifePath = calculateLifePath(childBirth);
  const destinyMatch = childNumerology.destiny === lifePath;
  const numerologyScore = Math.min(100, familyNumerologyScore + (destinyMatch ? 15 : 0));

  const nameEntry = namesDatabase.find(n => childName.toUpperCase().includes(n.name.toUpperCase()));
  const chineseElementMap = { 'fire': 'Fire', 'water': 'Water', 'earth': 'Earth', 'air': 'Metal', 'center': 'Earth' };
  const nameElement = chineseElementMap[nameEntry?.element || 'fire'] || 'Fire';
  const baziScore = checkChineseHarmony([nameElement], baziData);
  const qimenScore = qimenData.gate === 'Life' || qimenData.gate === 'Open' ? 100 : 70;

  // 3. Weighting Logic for Self-Analysis vs Family
  const FINAL_WEIGHTS = isSelfAnalysis ? {
    wariga: 0.10, // Individual Wuku
    numerology: 0.25,
    astrology: 0.15,
    jyotisha: 0.20,
    bazi: 0.20,
    qimen: 0.10,
    nawaSanga: 0.0,
    karma: 0.0
  } : WEIGHTS;

  const rawTotal = (
    (isSelfAnalysis ? 100 : warigaScore) * FINAL_WEIGHTS.wariga +
    numerologyScore * FINAL_WEIGHTS.numerology +
    familyAstrologyScore * FINAL_WEIGHTS.astrology +
    (isSelfAnalysis ? 100 : (childNawaSanga ? calculateNawaSangaFamilyScore(fatherPawukon, motherPawukon, childPawukon) : 60)) * (isSelfAnalysis ? 0 : FINAL_WEIGHTS.nawaSanga) +
    (isSelfAnalysis ? 100 : karma.harmonyScore) * (isSelfAnalysis ? 0 : FINAL_WEIGHTS.karma) +
    jyotishaScore * FINAL_WEIGHTS.jyotisha +
    baziScore * FINAL_WEIGHTS.bazi +
    qimenScore * FINAL_WEIGHTS.qimen
  );

  const weightSum = Object.values(FINAL_WEIGHTS).reduce((a, b) => a + b, 0);
  const totalScore = Math.round(rawTotal / weightSum);

  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      wariga: { score: warigaScore, weight: WEIGHTS.wariga, data: { father: fatherPawukon, mother: motherPawukon, child: childPawukon } },
      numerology: { score: numerologyScore, weight: WEIGHTS.numerology, data: childNumerology },
      astrology: { score: familyAstrologyScore, weight: WEIGHTS.astrology, data: childAstrology },
      jyotisha: { score: jyotishaScore, weight: WEIGHTS.jyotisha, data: childJyotisha },
      bazi: { score: baziScore, weight: WEIGHTS.bazi, data: baziData },
      qimen: { score: qimenScore, weight: WEIGHTS.qimen, data: qimenData },
      nawaSanga: { score: childNawaSanga ? calculateNawaSangaFamilyScore(fatherPawukon, motherPawukon, childPawukon) : 60, weight: WEIGHTS.nawaSanga, data: childNawaSanga },
      karma: { score: karma.harmonyScore, weight: WEIGHTS.karma, data: karma },
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
  // Extract Title from Father's name
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

  // Extract Surname/Clan name from Father (last word if not a title)
  const fParts = fatherName.trim().split(' ');
  let surname = '';
  if (fParts.length > 2) {
    const lastPart = fParts[fParts.length - 1];
    // Avoid re-using common birth order names as surnames
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
  { name: 'Yudhistira', meaning: 'Teguh dalam pertempuran', element: 'earth' },
  { name: 'Sastra', meaning: 'Pengetahuan, kitab suci', element: 'air' },
  { name: 'Natha', meaning: 'Pelindung, pemimpin', element: 'air' },
  { name: 'Dirgantara', meaning: 'Angkasa luas', element: 'air' },
  { name: 'Mahottama', meaning: 'Paling utama', element: 'fire' },
  { name: 'Dananjaya', meaning: 'Penakluk kekayaan', element: 'fire' }
];

export function recommendNames(fatherName, fatherBirth, motherName, motherBirth, childBirth, childGender, birthOrderName) {
  // 1. Get targets
  const lifePath = calculateLifePath(childBirth);
  const childJyotisha = calculateJyotisha(childBirth);
  const recommendedSyllables = childJyotisha.recommendedSyllables.map(s => s.toUpperCase());
  
  // 2. Combine all available names into a pool
  const namePool = [
    ...namesDatabase.filter(n => n.gender === childGender || n.gender === 'unisex'),
    ...ADDITIONAL_ROOTS.map(r => ({ ...r, gender: childGender, origin: 'Sanskrit' }))
  ];

  // 3. Generate Strategic Candidates
  const candidates = [];
  
  // Strategy A: Direct matches from DB starting with target syllable
  const startsWithRec = namePool.filter(n => 
    recommendedSyllables.some(s => n.name.toUpperCase().startsWith(s))
  );

  // Strategy B: Combinations of 2 words from pool
  // Limit iterations to stay performant
  const poolSize = Math.min(namePool.length, 40);
  for (let i = 0; i < poolSize; i++) {
    for (let j = 0; j < poolSize; j++) {
      if (i === j) continue;
      
      const n1 = namePool[i];
      const n2 = namePool[j];
      
      // Prioritize combinations where first word starts with target syllable
      const startsWithSyllable = recommendedSyllables.some(s => n1.name.toUpperCase().startsWith(s));
      if (!startsWithSyllable && i > 10) continue; // Only use non-matching starts for the first few names

      const fullName = generateFullName(n1.name, n2.name, childGender, fatherName, birthOrderName);
      const analysis = runFullAnalysis(fatherName, fatherBirth, motherName, motherBirth, fullName, childBirth, childGender);
      
      candidates.push({
        name: n1.name,
        fullName: fullName,
        meaning: `${n1.meaning} & ${n2.meaning}`,
        totalScore: analysis.totalScore,
        breakdown: analysis.breakdown
      });

      if (candidates.length > 200) break;
    }
    if (candidates.length > 200) break;
  }

  // Strategy C: Single names with surname
  startsWithRec.slice(0, 15).forEach(n => {
    const fullName = generateFullName(n.name, '', childGender, fatherName, birthOrderName);
    const analysis = runFullAnalysis(fatherName, fatherBirth, motherName, motherBirth, fullName, childBirth, childGender);
    
    candidates.push({
      ...n,
      fullName: fullName,
      totalScore: analysis.totalScore,
      breakdown: analysis.breakdown
    });
  });

  // Sort by score (descending)
  const sorted = candidates.sort((a, b) => b.totalScore - a.totalScore);

  // Remove duplicates by fullName
  const seen = new Set();
  const unique = sorted.filter(c => {
    if (seen.has(c.fullName)) return false;
    seen.add(c.fullName);
    return true;
  });

  return unique.slice(0, 5);
}

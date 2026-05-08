import { calculatePawukon } from './pawukonEngine';
import { calculateFamilyDirectionScore } from './nawaSangaEngine';

export function analyzeKarma(fatherPawukon, motherPawukon, childPawukon, familyNumerology, familyAstrology) {
  if (!childPawukon) {
    return { harmonyScore: 0, wukuCompatibility: 0, directionBalance: 0, lifePattern: [], compiledLifePath: '' };
  }

  const isSelfAnalysis = !fatherPawukon || !motherPawukon;
  
  if (isSelfAnalysis) {
    const lifePattern = generateLifePattern(childPawukon, 100);
    return {
      harmonyScore: 100,
      uripScore: 100,
      wukuCompatibility: 100,
      directionBalance: 100,
      lifePattern,
      compiledLifePath: lifePattern.map(p => p.theme).join(' → '),
    };
  }

  // 1. Urip Family Harmony
  const uripDiff1 = Math.abs(fatherPawukon.uripTotal - childPawukon.uripTotal);
  const uripDiff2 = Math.abs(motherPawukon.uripTotal - childPawukon.uripTotal);
  const uripHarmony1 = uripDiff1 % 3 === 0 ? 100 : uripDiff1 % 3 === 1 ? 70 : 50;
  const uripHarmony2 = uripDiff2 % 3 === 0 ? 100 : uripDiff2 % 3 === 1 ? 70 : 50;
  const uripScore = Math.round((uripHarmony1 + uripHarmony2) / 2);

  // 2. Wuku Compatibility
  const wukuDiff1 = Math.abs(fatherPawukon.wuku.index - childPawukon.wuku.index);
  const wukuDiff2 = Math.abs(motherPawukon.wuku.index - childPawukon.wuku.index);
  const wukuCompat = Math.round(100 - ((wukuDiff1 + wukuDiff2) / 60) * 40);

  // 3. Direction Balance
  const directionScore = calculateFamilyDirectionScore(
    fatherPawukon.uripTotal, motherPawukon.uripTotal, childPawukon.uripTotal
  );

  // 4. Combined harmony
  const harmonyScore = Math.round(
    uripScore * 0.3 + wukuCompat * 0.2 + directionScore * 0.2 +
    (familyNumerology || 60) * 0.15 + (familyAstrology || 60) * 0.15
  );

  // 5. Life Pattern
  const lifePattern = generateLifePattern(childPawukon, harmonyScore);

  return {
    harmonyScore: Math.min(100, Math.max(0, harmonyScore)),
    uripScore,
    wukuCompatibility: Math.min(100, Math.max(0, wukuCompat)),
    directionBalance: directionScore,
    lifePattern,
    compiledLifePath: lifePattern.map(p => p.theme).join(' → '),
  };
}

function generateLifePattern(childPawukon, harmonyScore) {
  const uripTotal = childPawukon.uripTotal;
  const wukuUrip = childPawukon.wuku.urip;

  const phases = [
    {
      phase: 'Anak (0-12)',
      icon: '💒',
      energy: uripTotal <= 7 ? 'Lembut & Penyesuaian' : 'Aktif & Eksploratif',
      theme: uripTotal % 2 === 0 ? 'Belajar dari lingkungan' : 'Mengeksplorasi bakat',
      strength: wukuUrip >= 5 ? 'Daya tangkap kuat' : 'Kreativitas alami',
      challenge: uripTotal > 12 ? 'Terlalu aktif' : 'Perlu bimbingan lebih',
    },
    {
      phase: 'Remaja (13-21)',
      icon: '🌱',
      energy: uripTotal <= 9 ? 'Pencarian Jati Diri' : 'Determinasi Kuat',
      theme: wukuUrip % 2 === 0 ? 'Pengembangan karakter' : 'Penemuan passion',
      strength: harmonyScore > 60 ? 'Dukungan keluarga kuat' : 'Kemandirian tumbuh',
      challenge: 'Keseimbangan sosial dan akademik',
    },
    {
      phase: 'Dewasa (22-50)',
      icon: '☀️',
      energy: uripTotal >= 10 ? 'Puncak Produktivitas' : 'Pertumbuhan Bertahap',
      theme: childPawukon.saptawara.urip >= 6 ? 'Karir & pencapaian' : 'Keluarga & harmoni',
      strength: 'Kematangan spiritual dan material',
      challenge: wukuUrip >= 7 ? 'Menjaga keseimbangan' : 'Membangun fondasi',
    },
    {
      phase: 'Bijaksana (51+)',
      icon: '🌙',
      energy: 'Kebijaksanaan & Pelayanan',
      theme: harmonyScore > 70 ? 'Warisan spiritual' : 'Refleksi & kedamaian',
      strength: 'Pengalaman hidup yang kaya',
      challenge: 'Mewariskan nilai-nilai',
    },
  ];

  return phases;
}

export function calculateKarmaScore(fatherDate, motherDate, childDate, familyNumerology, familyAstrology) {
  const fPawukon = calculatePawukon(fatherDate);
  const mPawukon = calculatePawukon(motherDate);
  const cPawukon = calculatePawukon(childDate);
  const result = analyzeKarma(fPawukon, mPawukon, cPawukon, familyNumerology, familyAstrology);
  return result.harmonyScore;
}

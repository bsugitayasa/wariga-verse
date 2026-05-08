import nawaSangaData from '../data/nawaSangaData.json';

const DIRECTION_MAP = {
  5: 0, // Timur
  8: 1, // Tenggara
  9: 2, // Selatan
  3: 3, // Barat Daya
  7: 4, // Barat
  1: 5, // Barat Laut
  4: 6, // Utara
  6: 7, // Timur Laut
};

function getDirectionIndex(uripTotal) {
  const key = uripTotal % 10 || uripTotal;
  if (DIRECTION_MAP[key] !== undefined) return DIRECTION_MAP[key];
  return 8; // Tengah (Madya) for values >= 10 or 2
}

export function getNawaSanga(uripTotal) {
  const index = getDirectionIndex(uripTotal);
  const direction = nawaSangaData.directions[index];
  return {
    ...direction,
    uripTotal,
  };
}

export function calculateFamilyDirectionScore(fatherUrip, motherUrip, childUrip) {
  if (!fatherUrip || !motherUrip) return 100;
  
  const fDir = getDirectionIndex(fatherUrip);
  const mDir = getDirectionIndex(motherUrip);
  const cDir = getDirectionIndex(childUrip);

  // Check if directions are complementary (opposite or adjacent = harmonious)
  let score = 60; // base

  // Same direction = strong alignment
  if (fDir === cDir) score += 15;
  if (mDir === cDir) score += 15;
  if (fDir === mDir) score += 5;

  // Adjacent directions are harmonious
  const fAdj = Math.abs(fDir - cDir) <= 2 || Math.abs(fDir - cDir) >= 7;
  const mAdj = Math.abs(mDir - cDir) <= 2 || Math.abs(mDir - cDir) >= 7;
  if (fAdj) score += 5;
  if (mAdj) score += 5;

  // Center (Madya) harmonizes with all
  if (cDir === 8 || fDir === 8 || mDir === 8) score += 5;

  return Math.min(100, score);
}

export function analyzeNawaSanga(pawukonData) {
  if (!pawukonData) return null;
  return getNawaSanga(pawukonData.uripTotal);
}

/**
 * Chinese Metaphysics Engine
 * Implements BaZi (Four Pillars of Destiny) and simplified Qimen Dun Jia.
 */

const STEMS = [
  { name: 'Jia', element: 'Wood', polarity: 'Yang' },
  { name: 'Yi', element: 'Wood', polarity: 'Yin' },
  { name: 'Bing', element: 'Fire', polarity: 'Yang' },
  { name: 'Ding', element: 'Fire', polarity: 'Yin' },
  { name: 'Wu', element: 'Earth', polarity: 'Yang' },
  { name: 'Ji', element: 'Earth', polarity: 'Yin' },
  { name: 'Geng', element: 'Metal', polarity: 'Yang' },
  { name: 'Xin', element: 'Metal', polarity: 'Yin' },
  { name: 'Ren', element: 'Water', polarity: 'Yang' },
  { name: 'Gui', element: 'Water', polarity: 'Yin' }
];

const BRANCHES = [
  { name: 'Zi', animal: 'Rat', element: 'Water', polarity: 'Yang' },
  { name: 'Chou', animal: 'Ox', element: 'Earth', polarity: 'Yin' },
  { name: 'Yin', animal: 'Tiger', element: 'Wood', polarity: 'Yang' },
  { name: 'Mao', animal: 'Rabbit', element: 'Wood', polarity: 'Yin' },
  { name: 'Chen', animal: 'Dragon', element: 'Earth', polarity: 'Yang' },
  { name: 'Si', animal: 'Snake', element: 'Fire', polarity: 'Yin' },
  { name: 'Wu', animal: 'Horse', element: 'Fire', polarity: 'Yang' },
  { name: 'Wei', animal: 'Goat', element: 'Earth', polarity: 'Yin' },
  { name: 'Shen', animal: 'Monkey', element: 'Metal', polarity: 'Yang' },
  { name: 'You', animal: 'Rooster', element: 'Metal', polarity: 'Yin' },
  { name: 'Xu', animal: 'Dog', element: 'Earth', polarity: 'Yang' },
  { name: 'Hai', animal: 'Pig', element: 'Water', polarity: 'Yin' }
];

const DOORS = ['Open', 'Rest', 'Life', 'Harm', 'Delusion', 'Scenery', 'Death', 'Fear'];
const STARS = ['Heart', 'Grass', 'Bird', 'Destiny', 'Column', 'Grain', 'Hero', 'Ambassador', 'Assistant'];

/**
 * Calculates BaZi Pillars
 * Uses Jan 1, 1900 as a reference for Day Pillar (Jia Xu)
 */
export function calculateBaZi(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();

  // Year Pillar: 60-year cycle starts approx Feb 4 (Lichun)
  // Simplified year calculation
  let baziYear = year;
  if (month < 2 || (month === 2 && day < 4)) baziYear--;
  const yearOffset = (baziYear - 4) % 60;
  const yearStem = STEMS[yearOffset % 10];
  const yearBranch = BRANCHES[yearOffset % 12];

  // Day Pillar (More complex, using epoch reference)
  const baseDate = new Date(1900, 0, 1);
  const diffDays = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
  const dayOffset = (diffDays + 10) % 60; // 1900-01-01 was Jia Xu (offset 10)
  const dayStem = STEMS[dayOffset % 10];
  const dayBranch = BRANCHES[dayOffset % 12];

  // Month Pillar (Based on Year and Month)
  const monthOffset = ((yearOffset % 5) * 12 + month + 1) % 60;
  const monthStem = STEMS[monthOffset % 10];
  const monthBranch = BRANCHES[(month + 1) % 12];

  // Hour Pillar
  const hourIndex = Math.floor((hour + 1) / 2) % 12;
  const hourOffset = ((dayOffset % 5) * 12 + hourIndex) % 60;
  const hourStem = STEMS[hourOffset % 10];
  const hourBranch = BRANCHES[hourIndex];

  // Element Counting
  const elements = [yearStem, yearBranch, monthStem, monthBranch, dayStem, dayBranch, hourStem, hourBranch];
  const count = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  elements.forEach(e => count[e.element]++);

  return {
    pillars: {
      year: { stem: yearStem, branch: yearBranch },
      month: { stem: monthStem, branch: monthBranch },
      day: { stem: dayStem, branch: dayBranch },
      hour: { stem: hourStem, branch: hourBranch }
    },
    dayMaster: dayStem,
    elementBalance: count,
    missingElements: Object.entries(count).filter(([_, v]) => v === 0).map(([k]) => k),
    excessElements: Object.entries(count).filter(([_, v]) => v >= 3).map(([k]) => k)
  };
}

/**
 * Simplified Qimen Dun Jia calculation
 * Provides the main "Gate" and "Star" for the hour
 */
export function calculateQimen(date) {
  const hour = date.getHours();
  const hourIndex = Math.floor((hour + 1) / 2) % 12;
  
  // Rotating Doors and Stars based on hour
  const doorIndex = hourIndex % 8;
  const starIndex = hourIndex % 9;
  
  const gateDescriptions = {
    'Open': 'Mewakili awal baru, peluang karier, dan keterbukaan pikiran.',
    'Rest': 'Mewakili kedamaian, pemulihan energi, dan hubungan keluarga yang harmonis.',
    'Life': 'Mewakili pertumbuhan, kemakmuran, dan vitalitas yang kuat. Sangat bagus untuk kesehatan.',
    'Harm': 'Mewakili ketegasan, tantangan, namun juga potensi untuk kompetisi yang sehat.',
    'Delusion': 'Mewakili privasi, pemikiran mendalam, dan kehati-hatian dalam bertindak.',
    'Scenery': 'Mewakili popularitas, kreativitas, dan penampilan publik yang memikat.',
    'Death': 'Mewakili akhir dari siklus lama, ketahanan mental, dan transformasi besar.',
    'Fear': 'Mewakili kewaspadaan, detail, dan kemampuan untuk melihat potensi risiko.'
  };

  const spirit = ['Chief', 'Snake', 'Moon', 'Earth', 'Tortoise', 'Tiger', 'Heaven', 'Red'][hourIndex % 8];
  
  return {
    gate: DOORS[doorIndex],
    star: STARS[starIndex],
    spirit: spirit,
    description: `${gateDescriptions[DOORS[doorIndex]]} Didukung oleh Bintang ${STARS[starIndex]} yang melambangkan energi lingkungan saat ini.`
  };
}

/**
 * Checks how well a name matches BaZi needs
 */
export function checkChineseHarmony(nameElements, bazi) {
  // nameElements is an array of elements derived from the name
  // Harmony is higher if the name provides MISSING elements
  let score = 50; // Base score
  
  nameElements.forEach(el => {
    if (bazi.missingElements.includes(el)) score += 25;
    if (bazi.excessElements.includes(el)) score -= 15;
  });
  
  return Math.min(100, Math.max(0, score));
}

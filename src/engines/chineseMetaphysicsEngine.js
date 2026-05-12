import { Solar } from 'lunar-javascript';

const DOORS = ['Open', 'Rest', 'Life', 'Harm', 'Delusion', 'Scenery', 'Death', 'Fear'];
const STARS = ['Heart', 'Grass', 'Bird', 'Destiny', 'Column', 'Grain', 'Hero', 'Ambassador', 'Assistant'];

const ELEMENT_MAP = {
  '木': 'Wood',
  '火': 'Fire',
  '土': 'Earth',
  '金': 'Metal',
  '水': 'Water'
};

const BAZI_ELEMEN_FALLBACK = {
  'A': ['Water', 'Earth'], 'B': ['Wood', 'Fire'], 'C': ['Wood'], 'D': ['Earth', 'Metal'],
  'E': ['Wood', 'Fire'], 'F': ['Fire'], 'G': ['Wood', 'Earth'], 'H': ['Water', 'Fire'],
  'I': ['Water'], 'J': ['Wood', 'Fire'], 'K': ['Wood', 'Earth'], 'L': ['Wood'],
  'M': ['Earth'], 'N': ['Water', 'Earth'], 'O': ['Water', 'Earth'], 'P': ['Fire', 'Earth'],
  'Q': ['Metal'], 'R': ['Water', 'Wood'], 'S': ['Metal', 'Water'], 'T': ['Earth', 'Fire'],
  'U': ['Water', 'Metal'], 'V': ['Wood', 'Water'], 'W': ['Water', 'Wood'], 'X': ['Metal'],
  'Y': ['Wood', 'Fire'], 'Z': ['Metal', 'Water']
};

const DAY_MASTER_KEBUTUHAN = {
  '甲': { name: 'Jia (Kayu Yang)', needs: ['Water', 'Fire'], desc: 'Pohon besar butuh Air untuk tumbuh dan Matahari (Api) untuk fotosintesis.' },
  '乙': { name: 'Yi (Kayu Yin)', needs: ['Water', 'Earth'], desc: 'Bunga merambat butuh Air secukupnya dan Tanah untuk berpijak.' },
  '丙': { name: 'Bing (Api Yang)', needs: ['Wood', 'Water'], desc: 'Matahari butuh Kayu sebagai sumber, dan butuh pantulan Air agar mempesona.' },
  '丁': { name: 'Ding (Api Yin)', needs: ['Wood', 'Metal'], desc: 'Api lilin butuh Kayu agar tetap menyala dan Logam untuk ditempa.' },
  '戊': { name: 'Wu (Tanah Yang)', needs: ['Fire', 'Wood'], desc: 'Gunung batu butuh Api agar keras dan Kayu (pohon) agar hidup.' },
  '己': { name: 'Ji (Tanah Yin)', needs: ['Fire', 'Metal'], desc: 'Tanah gembur butuh Matahari (Api) agar tidak lembab dan Logam di dalamnya.' },
  '庚': { name: 'Geng (Logam Yang)', needs: ['Fire', 'Water'], desc: 'Logam mentah (pedang) butuh Api untuk ditempa dan Air untuk didinginkan/dicuci.' },
  '辛': { name: 'Xin (Logam Yin)', needs: ['Water', 'Earth'], desc: 'Perhiasan butuh Air untuk dicuci agar berkilau dan Tanah pelindung.' },
  '壬': { name: 'Ren (Air Yang)', needs: ['Metal', 'Earth'], desc: 'Air laut butuh Logam sebagai sumber dan Gunung (Tanah) sebagai pembendung agar tidak banjir.' },
  '癸': { name: 'Gui (Air Yin)', needs: ['Metal', 'Wood'], desc: 'Air hujan/embun butuh Logam awan dan Kayu (tumbuhan) untuk menyerap manfaatnya.' }
};

const QIMEN_MAKNA = {
  1: { nama: 'Kan', elemen: 'Air', makna: 'Kebijaksanaan, Karier', baik: true },
  2: { nama: 'Kun', elemen: 'Tanah', makna: 'Gerbang Kematian', baik: false },
  3: { nama: 'Zhen', elemen: 'Kayu', makna: 'Gerak/Pertumbuhan', baik: true },
  4: { nama: 'Xun', elemen: 'Kayu', makna: 'Angin/Perkembangan Karir', baik: true },
  5: { nama: 'Pusat', elemen: 'Tanah', makna: 'Kekuatan Besar, Rawan', baik: false },
  6: { nama: 'Qian', elemen: 'Logam', makna: 'Langit/Kekuasaan', baik: true },
  7: { nama: 'Dui', elemen: 'Logam', makna: 'Kegembiraan/Hati-hati', baik: false },
  8: { nama: 'Gen', elemen: 'Tanah', makna: 'Gunung/Stabilitas', baik: true },
  9: { nama: 'Li', elemen: 'Api', makna: 'Api/Ketenaran', baik: true }
};

// Pythagorean Table for Qimen Name
const PYTHAGOREAN_TABLE = {
  'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8, 'I':9,
  'J':1, 'K':2, 'L':3, 'M':4, 'N':5, 'O':6, 'P':7, 'Q':8, 'R':9,
  'S':1, 'T':2, 'U':3, 'V':4, 'W':5, 'X':6, 'Y':7, 'Z':8
};

const BRANCH_CLASHES = {
  '子': '午', '午': '子', // Rat - Horse
  '丑': '未', '未': '丑', // Ox - Goat
  '寅': '申', '申': '寅', // Tiger - Monkey
  '卯': '酉', '酉': '卯', // Rabbit - Rooster
  '辰': '戌', '戌': '辰', // Dragon - Dog
  '巳': '亥', '亥': '巳'  // Snake - Pig
};

export function calculateBaZi(date) {
  const solar = Solar.fromYmdHms(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), 0);
  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();
  
  const yearPillar = bazi.getYearGan() + bazi.getYearZhi();
  const monthPillar = bazi.getMonthGan() + bazi.getMonthZhi();
  const dayPillar = bazi.getDayGan() + bazi.getDayZhi();
  const hourPillar = bazi.getTimeGan() + bazi.getTimeZhi();
  
  const yearWuXing = bazi.getYearWuXing();
  const monthWuXing = bazi.getMonthWuXing();
  const dayWuXing = bazi.getDayWuXing();
  const hourWuXing = bazi.getTimeWuXing();

  // Element Counting
  const allElements = (yearWuXing + monthWuXing + dayWuXing + hourWuXing).split('');
  const count = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  
  allElements.forEach(e => {
    if (ELEMENT_MAP[e]) count[ELEMENT_MAP[e]]++;
  });
  
  // Clashes analysis
  const branches = [bazi.getYearZhi(), bazi.getMonthZhi(), bazi.getDayZhi(), bazi.getTimeZhi()];
  const clashes = [];
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (BRANCH_CLASHES[branches[i]] === branches[j]) {
        clashes.push(`${branches[i]} clashes with ${branches[j]}`);
      }
    }
  }

  const dmChar = bazi.getDayGan();
  const dayMasterDetails = DAY_MASTER_KEBUTUHAN[dmChar] || { 
    name: `${dmChar} (${ELEMENT_MAP[dayWuXing[0]]})`, 
    needs: [], 
    desc: 'Elemen Day Master unik.' 
  };

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    },
    dayMaster: dmChar,
    dayMasterElement: ELEMENT_MAP[dayWuXing[0]],
    dayMasterDetails: dayMasterDetails,
    elementBalance: count,
    missingElements: Object.entries(count).filter(([_, v]) => v === 0).map(([k]) => k),
    excessElements: Object.entries(count).filter(([_, v]) => v >= 3).map(([k]) => k),
    clashes: clashes
  };
}

export function calculateQimen(date) {
  const hour = date.getHours();
  const hourIndex = Math.floor((hour + 1) / 2) % 12;
  
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

export function checkChineseHarmony(nameElements, bazi) {
  let score = 50;
  
  nameElements.forEach(el => {
    if (bazi.missingElements.includes(el)) score += 25;
    if (bazi.excessElements.includes(el)) score -= 15;
  });
  
  return Math.min(100, Math.max(0, score));
}

export function getNameElements(name) {
  const words = name.split(/\s+/);
  const elements = new Set();
  
  for (const word of words) {
    if (!word) continue;
    const firstChar = word[0].toUpperCase();
    const els = BAZI_ELEMEN_FALLBACK[firstChar] || ['Earth'];
    els.forEach(e => elements.add(e));
  }
  
  return Array.from(elements);
}

export function calculateNameQimen(name) {
  const words = name.split(/\s+/);
  const palaces = [];
  let scoreRaw = 0;

  for (const word of words) {
    if (!word) continue;
    let total = 0;
    for (const char of word.toUpperCase()) {
      total += PYTHAGOREAN_TABLE[char] || 0;
    }
    const p = (total % 9) || 9;
    const isGood = QIMEN_MAKNA[p].baik;
    
    palaces.push({
      word,
      palace: p,
      makna: QIMEN_MAKNA[p].nama,
      desc: QIMEN_MAKNA[p].makna,
      isGood
    });

    if (isGood) scoreRaw += 3;
    else if (p === 2 || p === 5 || p === 7) scoreRaw -= 1;
    else scoreRaw += 1;
  }

  const score = Math.max(0, Math.min(10, scoreRaw));

  return {
    score,
    palaces,
    isPerfect: score >= 8
  };
}

import wukuData from '../data/wukuData.json';
import { analyzeDauh } from './dauhEngine';

const SAPTAWARA = [
  { name: 'Redite', nameBali: 'ᬭᬾᬤᬶᬢᬾ', urip: 5, alias: 'Minggu' },
  { name: 'Soma', nameBali: 'ᬲᭀᬫ', urip: 4, alias: 'Senin' },
  { name: 'Anggara', nameBali: 'ᬅᬗ᭄ᬕᬭ', urip: 3, alias: 'Selasa' },
  { name: 'Budha', nameBali: 'ᬩᬸᬥ', urip: 7, alias: 'Rabu' },
  { name: 'Wraspati', nameBali: 'ᬯ᭄ᬭᬲ᭄ᬧᬢᬶ', urip: 8, alias: 'Kamis' },
  { name: 'Sukra', nameBali: 'ᬰᬸᬓ᭄ᬭ', urip: 6, alias: 'Jumat' },
  { name: 'Saniscara', nameBali: 'ᬰᬦᬶᬰ᭄ᬘᬭ', urip: 9, alias: 'Sabtu' },
];

const PANCAWARA = [
  { name: 'Umanis', nameBali: 'ᬉᬫᬦᬶᬲ᭄', urip: 5 },
  { name: 'Paing', nameBali: 'ᬧᬳᬶᬂ', urip: 9 },
  { name: 'Pon', nameBali: 'ᬧᭀᬦ᭄', urip: 7 },
  { name: 'Wage', nameBali: 'ᬯᬕᬾ', urip: 4 },
  { name: 'Kliwon', nameBali: 'ᬓ᭄ᬮᬶᬯᭀᬦ᭄', urip: 8 },
];

const INGKEL = ['Wong', 'Sato', 'Mina', 'Manuk', 'Taru', 'Buku'];

// Lintang is based on combination of Saptawara and Pancawara (35 combinations)
// Calculated simply by index matching.
function getLintang(saptawaraIndex, pancawaraIndex) {
  const LINTANG_MAP = {
    '0-0': 'Kala Sungsang', '0-1': 'Kala Wungkulan', '0-2': 'Patrem', '0-3': 'Waluku', '0-4': 'Lawean',
    '1-0': 'Kelapa', '1-1': 'Kukus', '1-2': 'Kirim', '1-3': 'Lembu', '1-4': 'Bati',
    '2-0': 'Kuda', '2-1': 'Yuyu', '2-2': 'Asu', '2-3': 'Jong Sarat', '2-4': 'Makara',
    '3-0': 'Tangis', '3-1': 'Lumbung', '3-2': 'Bade', '3-3': 'Karti', '3-4': 'Tiwa-tiwa',
    '4-0': 'Salah Ukur', '4-1': 'Gajah', '4-2': 'Bade', '4-3': 'Kumba', '4-4': 'Naga',
    '5-0': 'Bubu Bolong', '5-1': 'Puyuh', '5-2': 'Sungenge', '5-3': 'Magelut', '5-4': 'Angsa',
    '6-0': 'Gajah Mina', '6-1': 'Ru', '6-2': 'Puu', '6-3': 'Perahu Sarat', '6-4': 'Tumenggung'
  };
  return LINTANG_MAP[`${saptawaraIndex}-${pancawaraIndex}`] || 'Lintang Tidak Diketahui';
}

// Epoch: 1 Jan 2000 = Saniscara (Sabtu=6), Umanis (0), Wuku Sungsang day 6 (index 69)
const EPOCH = new Date(2000, 0, 1);
const EPOCH_SAPTAWARA = 6;
const EPOCH_PANCAWARA = 0;
const EPOCH_WUKU_DAY = 69; 

function getDaysSinceEpoch(date) {
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const epoch = new Date(EPOCH.getFullYear(), EPOCH.getMonth(), EPOCH.getDate(), 12, 0, 0);
  const diffMs = target.getTime() - epoch.getTime();
  return Math.floor(diffMs / 86400000);
}

export function calculatePawukon(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return null;
  }

  const calculationDate = new Date(date);
  if (date.getHours() < 3) {
    calculationDate.setDate(calculationDate.getDate() - 1);
  }

  const offset = getDaysSinceEpoch(calculationDate);

  let saptawaraIndex = ((offset % 7) + EPOCH_SAPTAWARA) % 7;
  if (saptawaraIndex < 0) saptawaraIndex += 7;
  const saptawara = SAPTAWARA[saptawaraIndex];

  let pancawaraIndex = ((offset % 5) + EPOCH_PANCAWARA) % 5;
  if (pancawaraIndex < 0) pancawaraIndex += 5;
  const pancawara = PANCAWARA[pancawaraIndex];

  let wukuDayInCycle = ((offset + EPOCH_WUKU_DAY) % 210);
  if (wukuDayInCycle < 0) wukuDayInCycle += 210;
  const wukuIndex = Math.floor(wukuDayInCycle / 7);
  const wuku = wukuData[wukuIndex];

  const uripTotal = saptawara.urip + pancawara.urip;
  const otonanDescription = `${saptawara.name} ${pancawara.name} Wuku ${wuku.name}`;
  
  const ingkel = INGKEL[wukuIndex % 6];
  const lintang = getLintang(saptawaraIndex, pancawaraIndex);

  return {
    saptawara: {
      name: saptawara.name,
      nameBali: saptawara.nameBali,
      alias: saptawara.alias,
      urip: saptawara.urip,
    },
    pancawara: {
      name: pancawara.name,
      nameBali: pancawara.nameBali,
      urip: pancawara.urip,
    },
    wuku: {
      name: wuku.name,
      urip: wuku.urip,
      deity: wuku.deity,
      watak: wuku.watak,
      description: wuku.description,
      index: wuku.index,
    },
    ingkel,
    lintang,
    uripTotal,
    otonanDescription,
    dauh: analyzeDauh(date, saptawara.name),
  };
}

export function getOtonanDates(birthDate, count = 5) {
  const dates = [];
  const birthTime = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()).getTime();
  for (let i = 1; i <= count; i++) {
    const otonanDate = new Date(birthTime + i * 210 * 86400000);
    dates.push(otonanDate);
  }
  return dates;
}

export { SAPTAWARA, PANCAWARA };

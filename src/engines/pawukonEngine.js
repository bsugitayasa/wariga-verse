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

// Epoch: 1 Jan 2000 = Saniscara (Sabtu=6), Umanis (0), Wuku Sungsang day 6 (index 69)
const EPOCH = new Date(2000, 0, 1);
const EPOCH_SAPTAWARA = 6; // Saniscara
const EPOCH_PANCAWARA = 0; // Umanis
const EPOCH_WUKU_DAY = 69; // Day 6 of Wuku Sungsang (9*7 + 6)

function getDaysSinceEpoch(date) {
  // Use a reference date at 12:00 to avoid timezone/DST issues when calculating days
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const epoch = new Date(EPOCH.getFullYear(), EPOCH.getMonth(), EPOCH.getDate(), 12, 0, 0);
  const diffMs = target.getTime() - epoch.getTime();
  return Math.floor(diffMs / 86400000);
}

export function calculatePawukon(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return null;
  }

  // Adjust date for Balinese calendar: Day transition typically at Sunrise or early dawn.
  // Based on user feedback: 02:00 AM is previous day, but 04:00 AM (subuh) is already the current day.
  // Setting cut-off to 03:00 AM.
  const calculationDate = new Date(date);
  if (date.getHours() < 3) {
    calculationDate.setDate(calculationDate.getDate() - 1);
  }

  const offset = getDaysSinceEpoch(calculationDate);

  // Saptawara (7-day cycle)
  let saptawaraIndex = ((offset % 7) + EPOCH_SAPTAWARA) % 7;
  if (saptawaraIndex < 0) saptawaraIndex += 7;
  const saptawara = SAPTAWARA[saptawaraIndex];

  // Pancawara (5-day cycle)
  let pancawaraIndex = ((offset % 5) + EPOCH_PANCAWARA) % 5;
  if (pancawaraIndex < 0) pancawaraIndex += 5;
  const pancawara = PANCAWARA[pancawaraIndex];

  // Wuku (210-day cycle, 30 wuku × 7 days)
  let wukuDayInCycle = ((offset + EPOCH_WUKU_DAY) % 210);
  if (wukuDayInCycle < 0) wukuDayInCycle += 210;
  const wukuIndex = Math.floor(wukuDayInCycle / 7);
  const wuku = wukuData[wukuIndex];

  // Urip total
  const uripTotal = saptawara.urip + pancawara.urip;

  // Otonan description
  const otonanDescription = `${saptawara.name} ${pancawara.name} Wuku ${wuku.name}`;

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

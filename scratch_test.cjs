const wukuData = require('./src/data/wukuData.json');

const SAPTAWARA = [
  { name: 'Redite', urip: 5, alias: 'Minggu' },
  { name: 'Soma', urip: 4, alias: 'Senin' },
  { name: 'Anggara', urip: 3, alias: 'Selasa' },
  { name: 'Budha', urip: 7, alias: 'Rabu' },
  { name: 'Wraspati', urip: 8, alias: 'Kamis' },
  { name: 'Sukra', urip: 6, alias: 'Jumat' },
  { name: 'Saniscara', urip: 9, alias: 'Sabtu' },
];

const PANCAWARA = [
  { name: 'Umanis', urip: 5 },
  { name: 'Paing', urip: 9 },
  { name: 'Pon', urip: 7 },
  { name: 'Wage', urip: 4 },
  { name: 'Kliwon', urip: 8 },
];

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

function calculate(date) {
  const calculationDate = new Date(date);
  if (date.getHours() < 6) {
    calculationDate.setDate(calculationDate.getDate() - 1);
  }
  
  const offset = getDaysSinceEpoch(calculationDate);
  let sIdx = ((offset % 7) + EPOCH_SAPTAWARA) % 7;
  if (sIdx < 0) sIdx += 7;
  let pIdx = ((offset % 5) + EPOCH_PANCAWARA) % 5;
  if (pIdx < 0) pIdx += 5;
  let wDay = ((offset + EPOCH_WUKU_DAY) % 210);
  if (wDay < 0) wDay += 210;
  const wIdx = Math.floor(wDay / 7);
  
  return {
    date: calculationDate.toDateString(),
    saptawara: SAPTAWARA[sIdx].name,
    pancawara: PANCAWARA[pIdx].name,
    wuku: wukuData[wIdx].name
  };
}

// 10 Sept 1991, 04:00 AM
console.log("10 Sept 1991 04:00:", calculate(new Date(1991, 8, 10, 4, 0)));
// 10 Sept 1991, 08:00 AM
console.log("10 Sept 1991 08:00:", calculate(new Date(1991, 8, 10, 8, 0)));

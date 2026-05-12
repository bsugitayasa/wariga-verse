import { Lunar, Solar } from 'lunar-javascript';

const solar = Solar.fromYmdHms(2000, 1, 1, 0, 0, 0);
const lunar = solar.getLunar();

console.log('Xiu (Mansion):', lunar.getXiu()); // This is Chinese lunar mansion, similar to Nakshatra!
console.log('BaZi Month:', lunar.getMonthInGanZhiExact());

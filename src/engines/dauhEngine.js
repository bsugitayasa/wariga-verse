const ASTA_DAUH_QUALITIES = {
  'Redite': ['Ala', 'Ayu', 'Ayu', 'Ayu', 'Ayu', 'Ayu', 'Ala', 'Ala'],
  'Soma': ['Ala', 'Ala', 'Ayu', 'Ayu', 'Ala', 'Ala', 'Ayu', 'Ayu'],
  'Anggara': ['Ayu', 'Ala', 'Ala', 'Ayu', 'Ala', 'Ayu', 'Ayu', 'Ala'],
  'Budha': ['Ayu', 'Ayu', 'Ala', 'Ala', 'Ayu', 'Ala', 'Ayu', 'Ala'],
  'Wraspati': ['Ayu', 'Ayu', 'Ala', 'Ala', 'Ayu', 'Ayu', 'Ala', 'Ala'],
  'Sukra': ['Ayu', 'Ala', 'Ala', 'Ayu', 'Ala', 'Ala', 'Ala', 'Ayu'],
  'Saniscara': ['Ayu', 'Ayu', 'Ayu', 'Ala', 'Ayu', 'Ayu', 'Ala', 'Ala'],
};

const PANCA_DAUH_NAMES = ['Brahma', 'Wisnu', 'Iswara', 'Mahadewa', 'Siwa'];
const DASA_DAUH_INFO = [
  { name: 'Sri', quality: 'Ayu', desc: 'Keberuntungan dan kemakmuran' },
  { name: 'Pati', quality: 'Ala', desc: 'Halangan atau hambatan' },
  { name: 'Korah', quality: 'Ala', desc: 'Gangguan atau keributan' },
  { name: 'Labha', quality: 'Ayu', desc: 'Hasil yang melimpah' },
  { name: 'Jaya', quality: 'Ayu', desc: 'Kemenangan dan keberhasilan' },
  { name: 'Amrta', quality: 'Ayu', desc: 'Kehidupan dan penyembuhan' },
  { name: 'Mrtu', quality: 'Ala', desc: 'Kekosongan atau kemunduran' },
  { name: 'Mandi', quality: 'Ala', desc: 'Keras atau menantang' },
  { name: 'Boga', quality: 'Ayu', desc: 'Kenikmatan dan kesenangan' },
  { name: 'Sempurna', quality: 'Ayu', desc: 'Kesempurnaan dan keberkatan' },
];

export function analyzeDauh(date, saptawaraName) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Day vs Night (06:00 to 18:00)
  const isDay = totalMinutes >= 360 && totalMinutes < 1080;
  const relMinutes = isDay ? totalMinutes - 360 : (totalMinutes < 360 ? totalMinutes + 360 : totalMinutes - 1080);
  const cycleMinutes = 720; // 12 hours

  // 1. Panca Dauh (5 segments)
  const pancaIndex = Math.floor((relMinutes / cycleMinutes) * 5) % 5;
  const pancaName = PANCA_DAUH_NAMES[pancaIndex];

  // 2. Asta Dauh (8 segments)
  const astaIndex = Math.floor((relMinutes / cycleMinutes) * 8) % 8;
  const astaQuality = ASTA_DAUH_QUALITIES[saptawaraName]?.[astaIndex] || 'N/A';

  // 3. Dasa Dauh (10 segments)
  const dasaIndex = Math.floor((relMinutes / cycleMinutes) * 10) % 10;
  const dasaInfo = DASA_DAUH_INFO[dasaIndex];

  return {
    isDay,
    timeLabel: isDay ? 'Siang (Rahina)' : 'Malam (Wengi)',
    panca: {
      index: pancaIndex + 1,
      name: pancaName,
    },
    asta: {
      index: astaIndex + 1,
      quality: astaQuality,
    },
    dasa: {
      index: dasaIndex + 1,
      name: dasaInfo.name,
      quality: dasaInfo.quality,
      description: dasaInfo.description,
    }
  };
}

// nameWarigaEngine.js
// Menghitung Wariga (Asta/Panca/Dasa Dauh) berdasarkan jumlah huruf nama

const ASTA_MAKNA = {
  1: 'Langgeng (Kekal/Abadi)', 
  2: 'Ayu (Indah/Baik)',       
  3: 'Duka (Kesedihan)',       
  4: 'Sri (Kemakmuran)',       
  5: 'Pati (Kematian/Bahaya)', 
  6: 'Suka (Kebahagiaan)',     
  7: 'Brahma (Kesucian)',      
  8: 'Kerta (Sempurna)'        
};
const ASTA_BURUK = [3, 5];

const PANCA_MAKNA = {
  1: 'Pati (Kematian/Bahaya)', 
  2: 'Suka (Kebahagiaan)',     
  3: 'Duka (Kesedihan)',       
  4: 'Sri (Kemakmuran)',       
  5: 'Manggeh (Langgeng)'      
};
const PANCA_BURUK = [1, 3];

const DASA_MAKNA = {
  1: 'Werdha (Mundur/Tua)',  
  2: 'Ayu (Indah)',          
  3: 'Brahma (Suci/Agung)',  
  4: 'Indra (Berkuasa)',     
  5: 'Pati (Kematian/Bahaya)',
  6: 'Buta (Kegelapan)',     
  7: 'Sri (Kemakmuran)',     
  8: 'Hayu (Selamat)',       
  9: 'Dewa (Ilahi)',         
  10: 'Nirmala (Murni Suci)'  
};
const DASA_BURUK = [1, 5, 6];

export function calculateNameDauh(name) {
  if (!name) return null;
  
  // Hitung jumlah huruf (tanpa spasi)
  const letterCount = name.replace(/\s+/g, '').length;
  if (letterCount === 0) return null;

  const astaVal = (letterCount % 8) || 8;
  const pancaVal = (letterCount % 5) || 5;
  const dasaVal = (letterCount % 10) || 10;

  const asta = {
    value: astaVal,
    makna: ASTA_MAKNA[astaVal],
    isGood: !ASTA_BURUK.includes(astaVal)
  };

  const panca = {
    value: pancaVal,
    makna: PANCA_MAKNA[pancaVal],
    isGood: !PANCA_BURUK.includes(pancaVal)
  };

  const dasa = {
    value: dasaVal,
    makna: DASA_MAKNA[dasaVal],
    isGood: !DASA_BURUK.includes(dasaVal)
  };

  // Skor Dauh Nama (Maks 10)
  // Asta = 3, Panca = 4, Dasa = 3
  const score = (asta.isGood ? 3 : 0) + (panca.isGood ? 4 : 0) + (dasa.isGood ? 3 : 0);

  return {
    letterCount,
    asta,
    panca,
    dasa,
    score,
    isPerfect: score === 10
  };
}

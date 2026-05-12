import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import nlpEngine logic directly if needed, or we can just compile the data.
// Since nlpEngine uses some static analysis, we can pre-compute IAST, phonetics etc.
// But for now, we just compile and fetch names from internet.

const DATABASE_PATH = path.join(__dirname, '../data/namesDatabase.json');

async function scrapeSanskritNames() {
  console.log('Scraping names from internet...');
  try {
    // Example scraping a dummy/real source for Sanskrit names
    // We will just return a simulated array since actual scraping depends on specific sites
    // In a real scenario, you would use axios and cheerio to fetch names
    console.log('Using simulated scraped data for safety & speed.');
    return [
      { name: 'Aarav', meaning: 'Damai, Bijaksana', gender: 'male', origin: 'Sanskrit' },
      { name: 'Diya', meaning: 'Lampu, Cahaya', gender: 'female', origin: 'Sanskrit' },
      { name: 'Rudra', meaning: 'Penghilang rasa sakit, Kuat', gender: 'male', origin: 'Sanskrit' },
      { name: 'Kavya', meaning: 'Puisi yang indah', gender: 'female', origin: 'Sanskrit' },
      { name: 'Pranadipa', meaning: 'Cahaya kehidupan, suci', gender: 'male', origin: 'Sanskrit' },
      { name: 'Aditya', meaning: 'Matahari, Dewa Matahari', gender: 'male', origin: 'Sanskrit' },
      { name: 'Baskara', meaning: 'Pembuat cahaya, Matahari', gender: 'male', origin: 'Sanskrit' },
      { name: 'Candra', meaning: 'Bulan, Cahaya', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Dharma', meaning: 'Kebenaran, Keadilan, Hukum suci', gender: 'male', origin: 'Sanskrit' },
      { name: 'Esha', meaning: 'Keinginan, Hasrat murni', gender: 'female', origin: 'Sanskrit' },
      { name: 'Gita', meaning: 'Lagu, Nyanyian suci', gender: 'female', origin: 'Sanskrit' },
      { name: 'Hansa', meaning: 'Angsa, Jiwa yang murni', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Indra', meaning: 'Raja para dewa', gender: 'male', origin: 'Sanskrit' },
      { name: 'Jaya', meaning: 'Kemenangan', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Kiran', meaning: 'Sinar cahaya', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Laksmi', meaning: 'Dewi kekayaan, Keberuntungan', gender: 'female', origin: 'Sanskrit' },
      { name: 'Mahendra', meaning: 'Dewa Indra yang agung', gender: 'male', origin: 'Sanskrit' },
      { name: 'Nareswara', meaning: 'Raja manusia, Pemimpin', gender: 'male', origin: 'Sanskrit' },
      { name: 'Ojas', meaning: 'Kekuatan, Vitalitas', gender: 'male', origin: 'Sanskrit' },
      { name: 'Paramitha', kesempurnaan: 'Kesempurnaan, Kebijaksanaan', gender: 'female', origin: 'Sanskrit' },
      { name: 'Raka', meaning: 'Bulan purnama', gender: 'male', origin: 'Sanskrit' },
      { name: 'Saraswati', meaning: 'Dewi ilmu pengetahuan', gender: 'female', origin: 'Sanskrit' },
      { name: 'Tirta', meaning: 'Air suci', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Uma', meaning: 'Ketenangan, Dewi Parvati', gender: 'female', origin: 'Sanskrit' },
      { name: 'Vidya', meaning: 'Ilmu pengetahuan, Kebijaksanaan', gender: 'female', origin: 'Sanskrit' },
      { name: 'Wira', meaning: 'Pahlawan, Berani', gender: 'male', origin: 'Sanskrit' },
      { name: 'Yudhistira', meaning: 'Teguh dalam pertempuran', gender: 'male', origin: 'Sanskrit' },
      { name: 'Bhadra', meaning: 'Mulia, Menguntungkan', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Sanjaya', meaning: 'Berjaya, Menang', gender: 'male', origin: 'Sanskrit' },
      // Added from KAMUS_KATA in Plan
      { name: 'Narottama', meaning: 'Manusia terbaik', gender: 'male', origin: 'Sanskrit' },
      { name: 'Adnyana', meaning: 'Pengetahuan bathin', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Uttama', meaning: 'Terbaik, Utama', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Yasha', meaning: 'Kemasyhuran, Kejayaan', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Wirajaya', meaning: 'Pahlawan yang menang', gender: 'male', origin: 'Sanskrit' },
      { name: 'Tejasa', meaning: 'Cahaya, Kekuatan', gender: 'male', origin: 'Sanskrit' },
      { name: 'Raditya', meaning: 'Matahari', gender: 'male', origin: 'Sanskrit' },
      { name: 'Kerta', meaning: 'Pencapaian, Pekerjaan baik', gender: 'male', origin: 'Sanskrit' },
      { name: 'Gunarsa', meaning: 'Sifat baik yang teguh', gender: 'male', origin: 'Sanskrit' },
      { name: 'Jayanta', meaning: 'Pemenang', gender: 'male', origin: 'Sanskrit' },
      { name: 'Nirmala', meaning: 'Suci, Tanpa noda', gender: 'female', origin: 'Sanskrit' },
      { name: 'Dhyana', meaning: 'Meditasi, Pemusatan pikiran', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Tatwa', meaning: 'Kebenaran esensial', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Vedanta', meaning: 'Puncak pengetahuan weda', gender: 'male', origin: 'Sanskrit' },
      { name: 'Sanatana', meaning: 'Abadi', gender: 'male', origin: 'Sanskrit' },
      { name: 'Vijayanta', meaning: 'Selalu menang', gender: 'male', origin: 'Sanskrit' },
      { name: 'Pratama', meaning: 'Pertama, Utama', gender: 'male', origin: 'Sanskrit' },
      { name: 'Wirya', meaning: 'Keberanian, Kekuatan', gender: 'male', origin: 'Sanskrit' },
      { name: 'Samadhi', meaning: 'Konsentrasi tertinggi', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Ratnakara', meaning: 'Lautan permata', gender: 'male', origin: 'Sanskrit' },
      { name: 'Nandana', meaning: 'Anak yang membawa kebahagiaan', gender: 'male', origin: 'Sanskrit' },
      { name: 'Jiwadhana', meaning: 'Harta jiwa', gender: 'male', origin: 'Sanskrit' },
      { name: 'Vira', meaning: 'Pahlawan', gender: 'male', origin: 'Sanskrit' },
      { name: 'Vibhava', meaning: 'Kekayaan, Kemegahan', gender: 'male', origin: 'Sanskrit' },
      { name: 'Varada', meaning: 'Pemberi anugerah', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Vibhu', meaning: 'Mahakuasa, Tembus pandang', gender: 'male', origin: 'Sanskrit' },
      { name: 'Vasanta', meaning: 'Musim semi', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Vikrama', meaning: 'Keberanian, Langkah besar', gender: 'male', origin: 'Sanskrit' },
      { name: 'Vikranta', meaning: 'Berani melangkah', gender: 'male', origin: 'Sanskrit' },
      { name: 'Vinaya', meaning: 'Disiplin, Kesopanan', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Vibudha', meaning: 'Sangat bijaksana', gender: 'male', origin: 'Sanskrit' },
      { name: 'Vibhuti', meaning: 'Keagungan ilahi', gender: 'female', origin: 'Sanskrit' },
      { name: 'Ojasvi', meaning: 'Penuh kekuatan bercahaya', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Karunika', meaning: 'Penuh welas asih', gender: 'female', origin: 'Sanskrit' },
      { name: 'Karuna', meaning: 'Welas asih', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Kanaka', meaning: 'Emas', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Jayendra', meaning: 'Raja para pemenang', gender: 'male', origin: 'Sanskrit' },
      { name: 'Swadharma', meaning: 'Kewajiban diri', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Santika', meaning: 'Kedamaian', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Tejendra', meaning: 'Raja yang bercahaya', gender: 'male', origin: 'Sanskrit' },
      { name: 'Sudharma', meaning: 'Kebenaran yang baik', gender: 'male', origin: 'Sanskrit' },
      { name: 'Wiranata', meaning: 'Pemimpin para pahlawan', gender: 'male', origin: 'Sanskrit' },
      { name: 'Prawira', meaning: 'Sangat berani', gender: 'male', origin: 'Sanskrit' },
      { name: 'Anugraha', meaning: 'Pemberian ilahi, Berkat', gender: 'male', origin: 'Sanskrit' },
      { name: 'Sudhana', meaning: 'Sangat kaya', gender: 'male', origin: 'Sanskrit' },
      { name: 'Narendra', meaning: 'Raja manusia', gender: 'male', origin: 'Sanskrit' },
      { name: 'Satyendra', meaning: 'Raja kebenaran', gender: 'male', origin: 'Sanskrit' },
      { name: 'Mahavira', meaning: 'Pahlawan besar', gender: 'male', origin: 'Sanskrit' },
      { name: 'Mahatma', meaning: 'Jiwa besar', gender: 'male', origin: 'Sanskrit' },
      { name: 'Satwika', meaning: 'Murni, Kebaikan', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Jayasakti', meaning: 'Kekuatan yang menang', gender: 'male', origin: 'Sanskrit' },
      { name: 'Rajaputra', meaning: 'Anak raja', gender: 'male', origin: 'Sanskrit' },
      { name: 'Trisakti', meaning: 'Tiga kekuatan ilahi', gender: 'female', origin: 'Sanskrit' },
      { name: 'Suryajaya', meaning: 'Kejayaan matahari', gender: 'male', origin: 'Sanskrit' },
      { name: 'Parama', meaning: 'Tertinggi, Utama', gender: 'male', origin: 'Sanskrit' },
      { name: 'Amerta', meaning: 'Keabadian, Nektar', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Siddha', meaning: 'Sempurna, Tercapai', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Prakarsa', meaning: 'Prakarsa, Pemimpin', gender: 'male', origin: 'Sanskrit' },
      { name: 'Pradhana', meaning: 'Yang utama, Penting', gender: 'male', origin: 'Sanskrit' },
      { name: 'Kertajaya', meaning: 'Kejayaan pekerjaan', gender: 'male', origin: 'Sanskrit' },
      { name: 'Kuncara', meaning: 'Terkenal', gender: 'male', origin: 'Sanskrit' },
      { name: 'Kusuma', meaning: 'Bunga', gender: 'female', origin: 'Sanskrit' },
      { name: 'Jatmika', meaning: 'Sopan santun', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Jagadhita', meaning: 'Kesejahteraan dunia', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Prabawa', meaning: 'Pengaruh, Kekuatan', gender: 'male', origin: 'Sanskrit' },
      { name: 'Diksa', meaning: 'Inisiasi, Pemberkatan', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Nararya', meaning: 'Orang mulia', gender: 'male', origin: 'Sanskrit' },
      { name: 'Viraja', meaning: 'Bersih, Murni', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Sumantra', meaning: 'Penasehat yang baik', gender: 'male', origin: 'Sanskrit' },
      { name: 'Jinartha', meaning: 'Kekayaan rohani', gender: 'male', origin: 'Sanskrit' },
      { name: 'Suputra', meaning: 'Anak laki-laki yang baik', gender: 'male', origin: 'Sanskrit' },
      { name: 'Pranawa', meaning: 'Suara suci Om', gender: 'male', origin: 'Sanskrit' },
      { name: 'Swastika', meaning: 'Keberuntungan, Keselamatan', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Mahayana', meaning: 'Kendaraan besar', gender: 'male', origin: 'Sanskrit' },
      { name: 'Pranawijaya', meaning: 'Kemenangan nafas kehidupan', gender: 'male', origin: 'Sanskrit' },
      { name: 'Satyajaya', meaning: 'Kemenangan kebenaran', gender: 'male', origin: 'Sanskrit' },
      { name: 'Jnana', meaning: 'Pengetahuan spiritual', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Subhaga', meaning: 'Sangat beruntung', gender: 'unisex', origin: 'Sanskrit' },
      { name: 'Dirghayu', meaning: 'Berumur panjang', gender: 'male', origin: 'Sanskrit' },
      { name: 'Wanagiri', meaning: 'Gunung hutan', gender: 'male', origin: 'Sanskrit' },
      { name: 'Suarjana', meaning: 'Orang yang baik', gender: 'male', origin: 'Sanskrit' },
      { name: 'Suartha', meaning: 'Makna yang baik', gender: 'male', origin: 'Sanskrit' },
      { name: 'Swargajaya', meaning: 'Kejayaan surga', gender: 'male', origin: 'Sanskrit' },
      { name: 'Swardana', meaning: 'Pemberian surga', gender: 'male', origin: 'Sanskrit' }
    ];
  } catch (error) {
    console.error('Failed to scrape names:', error);
    return [];
  }
}

async function compileDatabase() {
  console.log('Reading existing database...');
  let existingData = [];
  if (fs.existsSync(DATABASE_PATH)) {
    existingData = JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf-8'));
  }

  const scrapedNames = await scrapeSanskritNames();
  
  let addedCount = 0;
  for (const newName of scrapedNames) {
    if (!existingData.find(n => n.name.toUpperCase() === newName.name.toUpperCase())) {
      existingData.push(newName);
      addedCount++;
    }
  }

  // Ensure elements and other meta are present and update based on semantic meaning
  existingData = existingData.map(entry => {
    const meaningLower = (entry.meaning || '').toLowerCase();
    
    // Heuristik Semantik untuk Elemen BaZi
    if (/air|laut|sungai|hujan|embun|dingin|suci|biru|hitam/.test(meaningLower)) {
      entry.element = 'water';
    } else if (/api|matahari|cahaya|panas|terang|merah|bakar|semangat/.test(meaningLower)) {
      entry.element = 'fire';
    } else if (/kayu|pohon|bunga|hutan|tumbuh|hijau/.test(meaningLower)) {
      entry.element = 'wood';
    } else if (/tanah|bumi|gunung|batu|kuat|teguh|kuning|raja/.test(meaningLower)) {
      entry.element = 'earth';
    } else if (/logam|emas|besi|pedang|perhiasan|putih|berani|keras/.test(meaningLower)) {
      entry.element = 'metal';
    } else {
      // Fallback rough heuristic if meaning is abstract
      const n = entry.name.toUpperCase();
      if (['A','E','I','O','U'].includes(n[0])) entry.element = 'water';
      else if (['K','G','C','J','T','D','N'].includes(n[0])) entry.element = 'earth';
      else if (['P','B','M','Y','R','L','V','W'].includes(n[0])) entry.element = 'wood';
      else entry.element = 'fire';
    }
    
    return entry;
  });

  fs.writeFileSync(DATABASE_PATH, JSON.stringify(existingData, null, 2));
  console.log(`Compilation complete. Added ${addedCount} new names. Total names: ${existingData.length}.`);
}

compileDatabase();

# Wariga Verse — Aplikasi Rekomendasi Nama Anak Hindu Bali

Aplikasi web SPA untuk menghitung keselarasan nama anak berdasarkan 5 pendekatan spiritual/tradisional, serta merekomendasikan nama terbaik dari database nama Sanskerta/Hindu/Bali.

## Keputusan Desain (Hasil Review)

1. **Bahasa UI:** Bahasa Indonesia, hasil perhitungan dikombinasi dengan Bahasa Bali dan aksara Bali
2. **Gender:** Filter rekomendasi nama berdasarkan gender (laki/perempuan) — **wajib ada**
3. **Otonan:** Otomatis dihitung dari tanggal lahir Gregorian via kalender Bali
4. **Database Nama:** Termasuk nama-nama orang Bali (Wayan, Made, Nyoman, Ketut, dll + nama pribadi Bali)

---

## Tech Stack

| Layer | Technology | Alasan |
|-------|-----------|--------|
| Framework | **Vite + React** | Cepat, familiar |
| Styling | **Vanilla CSS** (design system) | Kontrol penuh |
| State | React Context + useReducer | Cukup untuk single-page calculator |
| Calendar | Custom Pawukon engine | Tidak ada library reliable |
| Aksara Bali | Unicode Balinese block (U+1B00–U+1B7F) | Render aksara Bali native |
| Deployment | Static SPA (no backend) | Semua kalkulasi client-side |

> Aplikasi **full client-side** — tidak memerlukan backend/database. Semua data referensi di-bundle sebagai JSON static.

---

## Arsitektur Aplikasi

```
Input Form (Ayah/Ibu/Anak)
    ├── Pawukon Engine (Wariga Bali)
    ├── Numerology Engine (Pythagoras)
    ├── Astrology Engine (Western + Vedic)
    ├── Nawa Sanga Engine (Energi Penjuru)
    └── Karma Engine (Harmonisasi Keluarga)
            │
            ▼
      Score Aggregator
            │
    ┌───────┴───────┐
    ▼               ▼
Analysis        Name
Dashboard       Recommender
```

---

## Folder Structure

```
src/
├── components/          # UI components
│   ├── InputForm.jsx
│   ├── AnalysisDashboard.jsx
│   ├── ScoreRadar.jsx
│   ├── NawaSangaCompass.jsx
│   ├── NameRecommendation.jsx
│   ├── LifePatternTimeline.jsx
│   └── Header.jsx
├── engines/             # Calculation engines (pure functions)
│   ├── pawukonEngine.js
│   ├── numerologyEngine.js
│   ├── astrologyEngine.js
│   ├── nawaSangaEngine.js
│   ├── karmaEngine.js
│   └── scoreAggregator.js
├── data/                # Static JSON data files
│   ├── namesDatabase.json
│   ├── wukuData.json
│   ├── nawaSangaData.json
│   └── numerologyInterpretations.json
├── hooks/               # Custom React hooks
├── pages/               # Main page views
├── utils/               # Helper utilities
├── styles/              # CSS design system
│   └── index.css
├── App.jsx
└── main.jsx
```

---

## Calculation Engines Detail

### 1. Pawukon Engine (`pawukonEngine.js`)

Konversi tanggal Gregorian → Pawukon (Saptawara, Pancawara, Wuku).

**Algoritma:**
1. Epoch reference: 1 Januari 2000 = Saniscara (Sabtu), Kliwon, Wuku Sinta
2. Day offset: `daysSinceEpoch = Math.floor((targetDate - epoch) / 86400000)`
3. Saptawara: `(offset + epochSaptawara) % 7`
4. Pancawara: `(offset + epochPancawara) % 5`
5. Wuku: `Math.floor(((offset + epochWukuDay) % 210) / 7)` → index 0-29

**Data Urip Saptawara:**
| Hari | Urip |
|------|------|
| Redite (Minggu) | 5 |
| Soma (Senin) | 4 |
| Anggara (Selasa) | 3 |
| Budha (Rabu) | 7 |
| Wraspati (Kamis) | 8 |
| Sukra (Jumat) | 6 |
| Saniscara (Sabtu) | 9 |

**Data Urip Pancawara:**
| Pasaran | Urip |
|---------|------|
| Umanis | 5 |
| Paing | 9 |
| Pon | 7 |
| Wage | 4 |
| Kliwon | 8 |

**Data 30 Wuku + Urip:**
| No | Wuku | Urip |
|----|------|------|
| 1 | Sinta | 7 |
| 2 | Landep | 1 |
| 3 | Ukir | 4 |
| 4 | Kulantir | 6 |
| 5 | Tulu | 5 |
| 6 | Gumbreg | 8 |
| 7 | Wariga | 9 |
| 8 | Warigadean | 3 |
| 9 | Julungwangi | 7 |
| 10 | Sungsang | 1 |
| 11 | Dungulan | 4 |
| 12 | Kuningan | 6 |
| 13 | Langkir | 5 |
| 14 | Medangsia | 8 |
| 15 | Pujut | 9 |
| 16 | Pahang | 3 |
| 17 | Krulut | 7 |
| 18 | Mrakih | 1 |
| 19 | Tambir | 4 |
| 20 | Medangkungan | 6 |
| 21 | Matal | 5 |
| 22 | Uye | 8 |
| 23 | Menail | 9 |
| 24 | Prangbakat | 3 |
| 25 | Bala | 7 |
| 26 | Ugu | 1 |
| 27 | Wayang | 4 |
| 28 | Klawu | 6 |
| 29 | Dukut | 5 |
| 30 | Watugunung | 8 |

Setiap wuku juga memiliki data watak/karakter yang perlu di-include.

**Output:** `{ saptawara, pancawara, wuku, uripTotal, watak, otonanDescription }`

---

### 2. Numerology Engine (`numerologyEngine.js`)

Pythagorean Numerology — menghitung dari nama dan tanggal lahir.

**Pythagorean Chart:**
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|
| A | B | C | D | E | F | G | H | I |
| J | K | L | M | N | O | P | Q | R |
| S | T | U | V | W | X | Y | Z | |

**Kalkulasi:**
1. **Life Path Number:** Tanggal lahir → reduce ke single digit (kecuali Master Number 11, 22, 33)
2. **Destiny/Expression Number:** Semua huruf nama lengkap
3. **Soul Urge Number:** Vokal (A, E, I, O, U) dalam nama
4. **Personality Number:** Konsonan dalam nama
5. **Compatibility Score:** Harmoni angka ayah-ibu-anak

**Output:** `{ lifePath, destiny, soulUrge, personality, interpretation, compatibilityScore }`

---

### 3. Astrology Engine (`astrologyEngine.js`)

Dual system — Western Tropical + Vedic/Hindu.

1. **Western Zodiac:** Tanggal lahir → 12 zodiac signs + elemen (Api/Tanah/Udara/Air)
2. **Vedic Rashi:** Tropical - ~24° Ayanamsa (Lahiri) → Sidereal position
3. **Elemen & Kualitas:** Fire/Earth/Air/Water + Cardinal/Fixed/Mutable
4. **Family compatibility:** Elemental harmony antar tanda ayah-ibu-anak

**Output:** `{ westernSign, vedicSign, element, quality, rulingPlanet, interpretation, familyHarmony }`

---

### 4. Nawa Sanga Engine (`nawaSangaEngine.js`)

Menentukan penjuru energi berdasarkan urip total (Saptawara + Pancawara).

| Urip Total | Arah | Dewa | Warna | Bijaksara | Senjata |
|-----------|------|------|-------|-----------|---------|
| → 5 | Timur (Purwa) | Iswara | Putih | Sa | Bajra |
| → 8 | Tenggara (Agneya) | Maheswara | Dadu | Na | Dupa |
| → 9 | Selatan (Daksina) | Brahma | Merah | Ba | Gada |
| → 3 | Barat Daya (Nairiti) | Rudra | Jingga | Ma | Moksala |
| → 7 | Barat (Pascima) | Mahadewa | Kuning | Ta | Nagapasa |
| → 1 | Barat Laut (Wayabya) | Sangkara | Hijau | Si | Angkus |
| → 4 | Utara (Uttara) | Wisnu | Hitam | A | Cakra |
| → 6 | Timur Laut (Airsanya) | Sambhu | Biru | Wa | Trisula |
| → 2/10+ | Tengah (Madya) | Siwa | Panca Warna | I/Ya | Padma |

Perhitungan: `uripTotal = uripSaptawara + uripPancawara` → mapping ke arah

**Output:** `{ direction, deity, color, bijaksara, weapon, interpretation, familyDirectionHarmony }`

---

### 5. Karma Engine (`karmaEngine.js`)

Analisis keselarasan karma keluarga (simplified Karma Purusha):

1. **Urip Family Harmony:** Selisih urip ayah-ibu-anak → jika habis dibagi 3 = harmonis
2. **Wuku Compatibility:** Apakah wuku keluarga saling melengkapi
3. **Nawa Sanga Direction Balance:** Keseimbangan penjuru energi keluarga
4. **Life Path Alignment:** Keselarasan numerologi antar anggota keluarga
5. **Pola Kehidupan:** Pemetaan fase kehidupan berdasarkan kombinasi semua sistem

**Output:** `{ harmonyScore, wukuCompatibility, directionBalance, lifePattern, compiledLifePath }`

---

### 6. Score Aggregator (`scoreAggregator.js`)

Menggabungkan semua engine scores menjadi skor akhir:

| Pendekatan | Bobot |
|-----------|-------|
| Wariga Bali | 25% |
| Numerologi | 20% |
| Astrologi | 15% |
| Nawa Sanga | 20% |
| Karma Keluarga | 20% |

**Output:** `{ totalScore (0-100), breakdown, recommendation, lifePattern }`

---

## Static Data Files

### `namesDatabase.json`
Database ~300+ nama (termasuk nama Bali) dengan struktur:
```json
{
  "name": "Dharma",
  "gender": "male",
  "origin": "Sanskrit",
  "meaning": "Kebenaran, kebajikan, hukum alam",
  "meaningBali": "Kasujatian, kapatutan",
  "source": "Weda",
  "syllables": ["Dhar", "ma"],
  "element": "fire",
  "numerologyValue": 5,
  "nawaSangaAffinity": "east",
  "tags": ["spiritual", "virtue", "universal"]
}
```

Kategori nama:
- **Nama Bali tradisional:** Wayan, Made, Nyoman, Ketut + variasi
- **Nama pribadi Bali:** Arya, Widya, Krisna, Saraswati, dll
- **Nama Hindu/Weda:** Dari kitab suci Hindu
- **Nama Sanskerta:** Nama-nama bermakna spiritual

### `wukuData.json`
Data 30 wuku + watak, dewa pelindung, interpretasi.

### `nawaSangaData.json`
Data 9 penjuru lengkap dengan semua atribut.

### `numerologyInterpretations.json`
Interpretasi angka 1-9, 11, 22, 33 dalam Bahasa Indonesia.

---

## UI Components

### InputForm.jsx
- 3 section card: Ayah, Ibu, Anak
- Fields: Nama lengkap, Tanggal lahir (date picker)
- Otonan otomatis ditampilkan setelah tanggal dipilih (read-only, auto-calculated)
- Gender selector untuk anak
- Glassmorphism cards, animated transitions

### AnalysisDashboard.jsx
Dashboard 5 tab/card dengan skor individual (0-100):
1. 📜 Wariga Bali — Pawukon, Urip, Wuku + watak (termasuk aksara Bali)
2. 🔢 Numerologi — Life Path, Destiny, Soul Urge, Personality
3. 🌌 Astrologi — Western + Vedic zodiac
4. 🧭 Nawa Sanga — Kompas visual + energi penjuru
5. ⚖️ Karma Keluarga — Harmoni + pola kehidupan

### ScoreRadar.jsx
Radar chart (Canvas API) — 5 dimensi scoring visual.

### NawaSangaCompass.jsx
Kompas visual interaktif 9 penjuru dengan warna dan highlight posisi energi.

### NameRecommendation.jsx
Daftar rekomendasi nama terurut dari skor tertinggi:
- Nama + arti + sumber + aksara Bali
- Skor total + breakdown per sistem
- Badge: "Best Match", "Highly Compatible"
- **Filter: gender (wajib), sumber, minimum score**

### LifePatternTimeline.jsx
Timeline visual pola kehidupan:
- Fase: anak → remaja → dewasa → tua
- Energi dominan per fase
- Tantangan dan kekuatan yang dibawa

### Header.jsx
Branding "Mini Wariga" + tagline.

---

## Design System

- **Color Palette:** Gold/amber (#F59E0B) + deep purple (#7C3AED) + dark bg (#0F0D1A)
- **Typography:** Google Fonts — Inter (UI) + Noto Serif (headings) + Noto Sans Balinese (aksara)
- **Style:** Glassmorphism cards, gradient backgrounds, micro-animations
- **Responsive:** Mobile-first, breakpoints di 768px dan 1024px

---

## App Flow

1. **Hero Section** — Branding + pengantar singkat
2. **Input Form** — Data keluarga (ayah, ibu, anak + gender)
3. **Auto Otonan** — Setelah tanggal dipilih, otonan otomatis muncul
4. **Analysis Dashboard** — Hasil perhitungan 5 pendekatan (setelah submit)
5. **Name Recommendations** — Rekomendasi nama dengan filter gender
6. **Life Pattern** — Pola kehidupan dan kompilasi

---

## Verification Plan

### Automated
1. Pawukon Engine: Cross-check tanggal yang diketahui dengan kalender Bali
2. Numerology Engine: Test case nama dengan hasil yang sudah diketahui
3. Score Aggregator: Boundary tests (skor 0, 50, 100)
4. Browser test: Input data sample, verifikasi output

### Manual
1. Input data keluarga Bali yang otonan-nya sudah diketahui
2. Cross-check pawukon dengan referensi kalender Bali online
3. Verifikasi responsive di mobile dan desktop
4. Test flow lengkap: input → analisis → rekomendasi nama

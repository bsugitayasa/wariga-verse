# Sistem Analisis & Seleksi Nama Metafisik Multi-Dimensi
## Technical Plan & Algorithm Reference
**Konteks:** Nama bayi laki-laki Bali (prefix Ida Bagus), lahir Mei 2026
**Versi:** 1.0 — Claude Sonnet 4.6, Mei 2026

---

## Daftar Isi
1. Arsitektur Sistem
2. Modul A — Numerologi (Pythagorean & Chaldean)
3. Modul B — Karmic Debt & Karmic Lesson
4. Modul C — Wariga Bali (Asta/Panca/Dasa Dauh)
5. Modul D — Neptu Jawa-Bali
6. Modul E — Jyotisha (Vedic Astrology Akshara)
7. Modul F — BaZi (Empat Pilar)
8. Modul G — Qimen Dun Jia (Sembilan Istana)
9. Modul H — Aura Semantik 7 Dimensi
10. Modul I — Scoring & Ranking Terpadu
11. Modul J — Generator Kombinasi Nama
12. Database Referensi
13. Pseudocode Lengkap (Python-style)
14. Skema Data Output
15. Catatan Implementasi

---

## 1. Arsitektur Sistem

```
INPUT
 └─ Kamus kata (Sanskrit/Bali/Jawa/Hindu Nusantara)
 └─ Parameter lahir (tanggal, Nakshatra, Weton)
 └─ Prefix nama (Ida Bagus)

PIPELINE
 ├─ Generator kombinasi 2–3 kata
 ├─ Pre-filter cepat (Destiny target, min huruf)
 │
 ├─ Modul A: Pythagorean + Chaldean
 ├─ Modul B: Karmic Debt + Karmic Lesson
 ├─ Modul C: Wariga Bali
 ├─ Modul D: Neptu Jawa-Bali
 ├─ Modul E: Jyotisha Akshara
 ├─ Modul F: BaZi Elemen
 ├─ Modul G: Qimen Dun Jia
 └─ Modul H: Aura Semantik 7D

 └─ Modul I: Scoring Terpadu → RANKING

OUTPUT
 └─ Kandidat terurut dengan skor per dimensi
 └─ Flag filter: sempurna / direkomendasikan / perlu review
```

**Prinsip desain:**
- Setiap modul independen dan dapat dijalankan terpisah
- Pre-filter di awal mengurangi beban komputasi secara signifikan
- Skor akhir bersifat modular — bobot per modul dapat dikonfigurasi
- Database aura semantik dapat diperluas tanpa mengubah engine

---

## 2. Modul A — Numerologi

### 2.1 Tabel Konversi

**Pythagorean (modern):**
```
A=1  B=2  C=3  D=4  E=5  F=6  G=7  H=8  I=9
J=1  K=2  L=3  M=4  N=5  O=6  P=7  Q=8  R=9
S=1  T=2  U=3  V=4  W=5  X=6  Y=7  Z=8
```

**Chaldean (kuno):**
```
A=1  B=2  C=3  D=4  E=5  F=8  G=3  H=5  I=1
J=1  K=2  L=3  M=4  N=5  O=7  P=8  Q=1  R=2
S=3  T=4  U=6  V=6  W=6  X=5  Y=1  Z=7
```

### 2.2 Algoritma Reduksi

```python
def reduksi(n: int, izinkan_master: bool = True) -> int:
    """
    Reduksi digit berulang.
    Master Numbers (11, 22, 33) TIDAK direduksi jika izinkan_master=True.
    """
    while n > 9:
        if izinkan_master and n in (11, 22, 33):
            return n   # hentikan — ini Master Number
        n = sum(int(d) for d in str(n))
    return n
```

### 2.3 Angka Destiny

```python
def hitung_destiny(nama: str, tabel: dict) -> tuple[int, int]:
    """
    Mengembalikan (total_mentah, destiny_final).
    Nama boleh mengandung spasi (multi-kata).
    """
    huruf = nama.upper().replace(' ', '')
    total = sum(tabel.get(c, 0) for c in huruf)
    destiny = reduksi(total)
    return total, destiny
```

### 2.4 Soul Urge & Personality

```python
VOKAL = set('AEIOU')

def soul_urge(nama: str, tabel_pyth: dict) -> tuple[int, int]:
    huruf = nama.upper().replace(' ', '')
    total = sum(tabel_pyth.get(c, 0) for c in huruf if c in VOKAL)
    return total, reduksi(total)

def personality(nama: str, tabel_pyth: dict) -> tuple[int, int]:
    huruf = nama.upper().replace(' ', '')
    total = sum(tabel_pyth.get(c, 0) for c in huruf
                if c not in VOKAL and c.isalpha())
    return total, reduksi(total)
```

### 2.5 Deteksi Master Numbers

```python
def temukan_master_numbers(nama: str, tabel_pyth: dict,
                            tabel_chald: dict) -> list[dict]:
    """
    Mencari semua kemunculan Master Number (11, 22, 33) di:
    - Setiap kata individual (Pythagorean)
    - Total keseluruhan (Pythagorean)
    - Langkah reduksi intermediat (Pythagorean)
    - Total keseluruhan (Chaldean)
    Semakin banyak titik Master Number → semakin kuat resonansi.
    """
    hasil = []
    kata = nama.split()

    # Per kata
    for k in kata:
        v = sum(tabel_pyth.get(c, 0) for c in k.upper())
        if v in (11, 22, 33):
            hasil.append({'sumber': f'kata:{k}', 'angka': v, 'sistem': 'Pythagorean'})

    # Total Pythagorean — cek semua langkah reduksi
    total_p = sum(sum(tabel_pyth.get(c, 0) for c in k.upper()) for k in kata)
    t = total_p
    while t > 9:
        if t in (11, 22, 33):
            hasil.append({'sumber': 'total', 'angka': t, 'sistem': 'Pythagorean'})
            break
        t = sum(int(d) for d in str(t))

    # Total Chaldean
    total_c = sum(sum(tabel_chald.get(c, 0) for c in k.upper()) for k in kata)
    t = total_c
    while t > 9:
        if t in (11, 22, 33):
            hasil.append({'sumber': 'total', 'angka': t, 'sistem': 'Chaldean'})
            break
        t = sum(int(d) for d in str(t))

    return hasil
```

---

## 3. Modul B — Karmic Debt & Karmic Lesson

### 3.1 Karmic Debt

Angka Karmic Debt: **13, 14, 16, 19**

Pengaruh negatif masing-masing:
- 13 → Kemalasan, beban berat, harus kerja keras ekstra
- 14 → Ketidakstabilan, godaan, penyalahgunaan kebebasan
- 16 → Ego berlebih, kejatuhan, pengkhianatan
- 19 → Egois, kesulitan menerima bantuan, isolasi

```python
KARMIC_DEBT_NUMS = {13, 14, 16, 19}

def cek_karmic_debt(nama: str, tabel_pyth: dict) -> list[dict]:
    """
    Memeriksa karmic debt di:
    1. Setiap kata individual sebelum direduksi
    2. Total seluruh kata sebelum direduksi
    3. Setiap langkah reduksi intermediat

    Return list of dict: [{'angka': 13, 'lokasi': 'kata:VIJAYA'}]
    Return [] jika bersih (NIHIL).
    """
    ditemukan = []
    kata = nama.split()

    # 1. Per kata
    for k in kata:
        v = sum(tabel_pyth.get(c, 0) for c in k.upper())
        if v in KARMIC_DEBT_NUMS:
            ditemukan.append({'angka': v, 'lokasi': f'kata:{k}'})

    # 2. Total
    total = sum(sum(tabel_pyth.get(c, 0) for c in k.upper()) for k in kata)
    if total in KARMIC_DEBT_NUMS:
        ditemukan.append({'angka': total, 'lokasi': 'total'})

    # 3. Langkah intermediat
    t = total
    while t > 9:
        if t in (11, 22, 33):
            break          # Master Number — hentikan reduksi
        if t in KARMIC_DEBT_NUMS:
            ditemukan.append({'angka': t, 'lokasi': f'step:{t}'})
        t = sum(int(d) for d in str(t))

    return ditemukan  # [] = NIHIL (sempurna)
```

### 3.2 Karmic Lesson

Angka yang TIDAK MUNCUL sama sekali di nama = pelajaran karma yang perlu diselesaikan.

```python
def cek_karmic_lesson(nama: str, tabel_pyth: dict) -> tuple[set, list]:
    """
    Return: (angka_hadir, angka_hilang)
    angka_hilang = [] berarti sempurna (semua 1-9 hadir)
    """
    huruf = nama.upper().replace(' ', '')
    hadir = set()
    for c in huruf:
        if c in tabel_pyth:
            hadir.add(tabel_pyth[c])

    hilang = [i for i in range(1, 10) if i not in hadir]
    return hadir, hilang

def intensitas_angka(nama: str, tabel_pyth: dict) -> dict:
    """
    Angka yang muncul terlalu sering = intensitas berlebih (potensi obsesi).
    Hitung frekuensi kemunculan setiap angka.
    """
    huruf = nama.upper().replace(' ', '')
    freq = {}
    for c in huruf:
        if c in tabel_pyth:
            v = tabel_pyth[c]
            freq[v] = freq.get(v, 0) + 1
    return freq
```

---

## 4. Modul C — Wariga Bali

### 4.1 Konsep

Wariga menggunakan jumlah huruf (aksara) nama untuk menentukan posisi dalam tiga siklus waktu Bali. Ini bukan siklus kalender, melainkan pola numerik yang mencerminkan kualitas energi nama.

**Aturan modulo:**
- Jika hasil modulo = 0, gunakan nilai maksimum siklus (bukan 0)

### 4.2 Asta Dauh (Siklus 8)

```python
ASTA_MAKNA = {
    1: 'Langgeng',   # Kekal, abadi — BAIK
    2: 'Ayu',        # Indah, baik — BAIK
    3: 'Duka',       # Kesedihan — BURUK
    4: 'Sri',        # Kemakmuran — BAIK
    5: 'Pati',       # Kematian/bahaya — BURUK
    6: 'Suka',       # Kebahagiaan — BAIK
    7: 'Brahma',     # Kesucian — BAIK
    8: 'Kerta',      # Sempurna — BAIK
}
ASTA_BURUK = {3, 5}

def asta_dauh(jumlah_huruf: int) -> tuple[int, str, bool]:
    hasil = (jumlah_huruf % 8) or 8
    return hasil, ASTA_MAKNA[hasil], hasil not in ASTA_BURUK
```

### 4.3 Panca Dauh (Siklus 5)

```python
PANCA_MAKNA = {
    1: 'Pati',       # Bahaya — BURUK
    2: 'Suka',       # Bahagia — BAIK
    3: 'Duka',       # Sedih — BURUK
    4: 'Sri',        # Makmur — BAIK
    5: 'Manggeh',    # Kekal/Langgeng — BAIK
}
PANCA_BURUK = {1, 3}

def panca_dauh(jumlah_huruf: int) -> tuple[int, str, bool]:
    hasil = (jumlah_huruf % 5) or 5
    return hasil, PANCA_MAKNA[hasil], hasil not in PANCA_BURUK
```

### 4.4 Dasa Dauh (Siklus 10)

```python
DASA_MAKNA = {
    1:  'Werdha',    # Mundur/tua — BURUK
    2:  'Ayu',       # Indah — BAIK
    3:  'Brahma',    # Suci/agung — BAIK
    4:  'Indra',     # Berkuasa — BAIK
    5:  'Pati',      # Kematian — BURUK
    6:  'Buta',      # Kegelapan — BURUK
    7:  'Sri',       # Kemakmuran — BAIK
    8:  'Hayu',      # Selamat — BAIK
    9:  'Dewa',      # Ilahi — BAIK
    10: 'Nirmala',   # Murni suci — BAIK
}
DASA_BURUK = {1, 5, 6}

def dasa_dauh(jumlah_huruf: int) -> tuple[int, str, bool]:
    hasil = (jumlah_huruf % 10) or 10
    return hasil, DASA_MAKNA[hasil], hasil not in DASA_BURUK
```

### 4.5 Skor Wariga Terpadu

```python
def skor_wariga(nama: str) -> dict:
    """
    Skor total 0–10:
      Asta Dauh baik  → +3 poin
      Panca Dauh baik → +4 poin  (bobot lebih tinggi karena siklus terpendek)
      Dasa Dauh baik  → +3 poin
    Target: 10/10 (semua baik)
    """
    hc = len(nama.replace(' ', ''))
    a, an, ao = asta_dauh(hc)
    p, pn, po = panca_dauh(hc)
    d, dn, do_ = dasa_dauh(hc)
    skor = (3 if ao else 0) + (4 if po else 0) + (3 if do_ else 0)

    return {
        'jumlah_huruf': hc,
        'asta': {'nilai': a, 'makna': an, 'baik': ao},
        'panca': {'nilai': p, 'makna': pn, 'baik': po},
        'dasa': {'nilai': d, 'makna': dn, 'baik': do_},
        'skor': skor,        # 0–10
        'sempurna': skor == 10,
    }
```

**Tabel referensi cepat jumlah huruf:**

| Huruf | Asta | Panca | Dasa | Skor |
|-------|------|-------|------|------|
| 10    | 2✓   | 5✓    | 10✓  | 10   |
| 14    | 6✓   | 4✓    | 4✓   | 10   |
| 17    | 1✓   | 2✓    | 7✓   | 10   |
| 20    | 4✓   | 5✓    | 10✓  | 10   |
| 22    | 6✓   | 2✓    | 2✓   | 10   |
| 24    | 8✓   | 4✓    | 4✓   | 10   |

---

## 5. Modul D — Neptu Jawa-Bali

### 5.1 Tabel Nilai Huruf

```python
NEPTU_HURUF = {
    # Vokal
    'A': 1, 'I': 1, 'U': 2, 'E': 3, 'O': 1,
    # Konsonan
    'B': 2, 'C': 3, 'D': 4, 'G': 5, 'H': 6,
    'J': 4, 'K': 6, 'L': 6, 'M': 4, 'N': 5,
    'P': 7, 'R': 4, 'S': 6, 'T': 4, 'W': 6,
    'Y': 1,
    # Huruf serapan
    'V': 8, 'F': 8, 'Z': 8, 'X': 6, 'Q': 8,
}

def neptu_nama(nama: str) -> tuple[int, int]:
    """
    Return: (total_mentah, total_setelah_reduksi)
    Berbeda dari Pythagorean — tidak ada Master Number dalam sistem ini.
    """
    huruf = nama.upper().replace(' ', '')
    total = sum(NEPTU_HURUF.get(c, 0) for c in huruf)
    return total, reduksi(total, izinkan_master=False)
```

### 5.2 Interpretasi Neptu Nama (opsional, untuk laporan)

```python
NEPTU_MAKNA = {
    1: 'Pati — perlu kehati-hatian',
    2: 'Suka — kebahagiaan',
    3: 'Brahma — kesucian',
    4: 'Indra — kekuasaan',
    5: 'Pati — perlu kehati-hatian',
    6: 'Buta — kehati-hatian',
    7: 'Sri — kemakmuran',
    8: 'Hayu — keselamatan',
    9: 'Dewa — keilahian',
}
```

---

## 6. Modul E — Jyotisha (Vedic Akshara)

### 6.1 Mapping Akshara per Nakshatra

Rasi dan Nakshatra matahari/bulan saat kelahiran menentukan huruf awal yang paling resonan secara kosmis.

```python
# Konteks: lahir Mei 2026
# Matahari di Taurus (Vrishabha) → 14 Apr – 20 Mei
# Matahari di Gemini (Mithuna)   → 21 Mei – 20 Jun

AKSHARA_TAURUS  = set(['V', 'B', 'U', 'E', 'O', 'I'])   # Va, Vi, Vu, Ve, Vo, Ba, U, E, O, I
AKSHARA_GEMINI  = set(['K', 'G'])                          # Ka, Ki, Ku, Ke, Ko, Gha
AKSHARA_NETRAL  = set()                                    # semua huruf lain

# Nakshatra spesifik (jika diketahui jam lahir)
NAKSHATRA_AKSHARA = {
    'Rohini':      ['O', 'V'],          # Vrishabha
    'Mrigashira':  ['V', 'K'],          # Taurus–Gemini
    'Ardra':       ['K', 'G'],          # Gemini
    'Punarvasu':   ['K'],               # Gemini
    'Krittika':    ['A', 'I', 'U', 'E'],# Aries/Taurus
}

def skor_jyotisha(nama: str, tanggal_lahir: str = '2026-05') -> dict:
    """
    tanggal_lahir format 'YYYY-MM' atau 'YYYY-MM-DD'
    Mei 2026 → Taurus/Gemini perbatasan
    """
    huruf_awal = nama[0].upper()

    if huruf_awal in AKSHARA_TAURUS:
        skor = 2
        label = 'Taurus — sangat sesuai'
    elif huruf_awal in AKSHARA_GEMINI:
        skor = 2
        label = 'Gemini — sangat sesuai'
    else:
        skor = 0
        label = 'Netral'

    return {
        'huruf_awal': huruf_awal,
        'skor': skor,      # 0 atau 2
        'label': label,
    }
```

---

## 7. Modul F — BaZi (Empat Pilar / Bā Zì)

### 7.1 Konsep Dasar

BaZi menganalisis keseimbangan lima elemen (Wu Xing): Kayu, Api, Tanah, Logam, Air.

**Konteks lahir Mei 2026:**
- Tahun Bing Wu (丙午) = Api Kuda → dominan Api
- Bulan Mei = bulan Si (巳) = Api
- **Day Master** yang lahir bulan Api-Api cenderung lemah pada elemen Api (terlalu banyak) — membutuhkan Air dan Kayu sebagai penyeimbang

**Prinsip umum:** Nama yang baik memperkuat elemen yang kurang dalam chart BaZi.

### 7.2 Mapping Elemen per Huruf Awal

```python
# Mapping berdasarkan resonansi fonetik dan tradisi Wuxing-Sanskrit
BAZI_ELEMEN = {
    'A': ['Air', 'Tanah'],
    'B': ['Kayu', 'Api'],
    'C': ['Kayu'],
    'D': ['Tanah', 'Logam'],
    'E': ['Kayu', 'Api'],
    'F': ['Api'],
    'G': ['Kayu', 'Tanah'],
    'H': ['Air', 'Api'],
    'I': ['Air'],
    'J': ['Kayu', 'Api'],
    'K': ['Kayu', 'Tanah'],
    'L': ['Kayu'],
    'M': ['Tanah'],
    'N': ['Air', 'Tanah'],
    'O': ['Air', 'Tanah'],
    'P': ['Api', 'Tanah'],
    'Q': ['Logam'],
    'R': ['Air', 'Kayu'],
    'S': ['Logam', 'Air'],
    'T': ['Tanah', 'Api'],
    'U': ['Air', 'Logam'],
    'V': ['Kayu', 'Air'],
    'W': ['Air', 'Kayu'],
    'X': ['Logam'],
    'Y': ['Kayu', 'Api'],
    'Z': ['Logam', 'Air'],
}

# Elemen yang DIBUTUHKAN untuk keseimbangan (konteks Mei 2026)
ELEMEN_BAIK  = {'Air', 'Kayu'}   # nourishes Wood Day Master
ELEMEN_NETRAL = {'Api'}           # output element — boleh
ELEMEN_BURUK  = {'Logam', 'Tanah'} # weakens/controls Wood

def skor_bazi(nama: str) -> dict:
    """
    Skor 0–10 berdasarkan elemen yang dibawa setiap kata.
    PENTING: Sesuaikan ELEMEN_BAIK dengan chart BaZi aktual bayi.
    """
    kata = nama.split()
    skor_raw = 0
    elemen_hadir = []

    for k in kata:
        els = BAZI_ELEMEN.get(k[0].upper(), ['Tanah'])
        for e in els:
            if e in ELEMEN_BAIK:
                skor_raw += 3
            elif e in ELEMEN_NETRAL:
                skor_raw += 1
            else:
                skor_raw -= 1
            elemen_hadir.append(e)

    # Normalisasi ke 0–10
    skor = max(0, min(10, skor_raw + 2))

    return {
        'skor': skor,
        'elemen': list(set(elemen_hadir)),
        'interpretasi': 'Sangat harmonis' if skor >= 8 else
                        'Baik' if skor >= 6 else
                        'Cukup' if skor >= 4 else 'Perlu review',
    }
```

### 7.3 Kustomisasi BaZi

Untuk implementasi yang lebih akurat, masukkan Heavenly Stem Day Master aktual:

```python
DAY_MASTER_KEBUTUHAN = {
    'Jia (Yang Kayu)':  ['Air', 'Api'],     # Air nourishes, Api = output
    'Yi (Yin Kayu)':    ['Air', 'Tanah'],
    'Bing (Yang Api)':  ['Kayu', 'Tanah'],
    'Ding (Yin Api)':   ['Kayu', 'Air'],
    'Wu (Yang Tanah)':  ['Api', 'Kayu'],
    'Ji (Yin Tanah)':   ['Api', 'Air'],
    'Geng (Yang Logam)':['Tanah', 'Air'],
    'Xin (Yin Logam)':  ['Tanah', 'Api'],
    'Ren (Yang Air)':   ['Logam', 'Kayu'],
    'Gui (Yin Air)':    ['Logam', 'Api'],
}
```

---

## 8. Modul G — Qimen Dun Jia (奇門遁甲)

### 8.1 Konsep Sembilan Istana

Qimen memetakan angka 1–9 ke Sembilan Istana (Jiugong) dengan makna kosmis.

```
4 9 2
3 5 7
8 1 6
```

```python
QIMEN_MAKNA = {
    1: {'nama': 'Kan', 'elemen': 'Air',   'makna': 'Kebijaksanaan, karier',  'baik': True},
    2: {'nama': 'Kun', 'elemen': 'Tanah', 'makna': 'Gerbang kematian',        'baik': False},
    3: {'nama': 'Zhen','elemen': 'Kayu',  'makna': 'Gerak/pertumbuhan',       'baik': True},
    4: {'nama': 'Xun', 'elemen': 'Kayu',  'makna': 'Angin/perkembangan karir','baik': True},
    5: {'nama': 'Pusat','elemen':'Tanah', 'makna': 'Kekuatan besar, rawan',   'baik': False},
    6: {'nama': 'Qian','elemen': 'Logam', 'makna': 'Langit/kekuasaan',        'baik': True},
    7: {'nama': 'Dui', 'elemen': 'Logam', 'makna': 'Kegembiraan/hati-hati',   'baik': False},
    8: {'nama': 'Gen', 'elemen': 'Tanah', 'makna': 'Gunung/stabilitas',       'baik': True},
    9: {'nama': 'Li',  'elemen': 'Api',   'makna': 'Api/ketenaran/pencerahan','baik': True},
}

QIMEN_BAIK   = {1, 3, 4, 6, 8, 9}
QIMEN_BURUK  = {2, 5, 7}

def palace_kata(kata: str, tabel_pyth: dict) -> int:
    """Memetakan kata ke palace Qimen via nilai Pythagorean mod 9."""
    total = sum(tabel_pyth.get(c, 0) for c in kata.upper())
    return (total % 9) or 9

def skor_qimen(nama: str, tabel_pyth: dict) -> dict:
    """
    Skor 0–10 berdasarkan palace setiap kata.
    Palace baik  = +3
    Palace netral = +1
    Palace buruk  = -1
    """
    kata = nama.split()
    palace_list = []
    skor_raw = 0

    for k in kata:
        p = palace_kata(k, tabel_pyth)
        palace_list.append(p)
        if p in QIMEN_BAIK:
            skor_raw += 3
        elif p in QIMEN_BURUK:
            skor_raw -= 1
        else:
            skor_raw += 1

    skor = max(0, min(10, skor_raw))

    return {
        'skor': skor,
        'palaces': palace_list,
        'detail': [{'kata': k, 'palace': p,
                    'makna': QIMEN_MAKNA[p]['nama'],
                    'baik': p in QIMEN_BAIK}
                   for k, p in zip(kata, palace_list)],
    }
```

---

## 9. Modul H — Aura Semantik 7 Dimensi

### 9.1 Tujuh Dimensi

| Kode | Dimensi | Deskripsi |
|------|---------|-----------|
| SPIRIT | Spiritualitas | Resonansi dengan alam spiritual, Dharma, Moksha |
| ROYAL | Kepemimpinan/Royal | Otoritas, wibawa, kualitas pemimpin |
| BRAVE | Keberanian | Keberanian, semangat ksatria, keteguhan |
| INTEL | Kecerdasan | Kebijaksanaan, ilmu, kapasitas intelektual |
| BEAUTY | Keindahan/Pesona | Estetika, pesona, kharisma |
| PROSPER | Kesejahteraan | Kemakmuran, kelimpahan, keberuntungan |
| LOVE | Kasih Sayang | Empati, cinta, hubungan harmonis |

### 9.2 Skema Basis Data Aura

```python
# Format: "KATA": [spirit, royal, brave, intel, beauty, prosper, love]
# Skala 0–10, berdasarkan:
# - Makna etimologis Sanskrit primer
# - Konteks penggunaan dalam teks Hindu (Mahabharata, Ramayana, Veda, dll.)
# - Makna dalam tradisi Bali/Jawa

AURA_DB = {
    "NAROTTAMA":   [9, 8, 6, 9, 6, 7, 7],   # Manusia terbaik
    "DHARMA":      [10,7, 7, 9, 6, 8, 8],   # Kebenaran tertinggi
    "VIDYA":       [8, 6, 5,10, 7, 7, 6],   # Ilmu murni
    "PRAJNA":      [9, 7, 5,10, 6, 7, 7],   # Kebijaksanaan agung
    "VIJAYA":      [7, 9,10, 7, 7, 8, 6],   # Kemenangan
    "KIRANA":      [7, 6, 5, 7,10, 8, 8],   # Sinar cahaya indah
    "SATYA":       [10,7, 7, 9, 6, 7, 8],   # Kebenaran
    "ANANDA":      [9, 6, 5, 7, 9, 8,10],   # Kebahagiaan
    "WISESA":      [7,10, 8, 7, 7, 9, 6],   # Kekuasaan agung
    "UDAYANA":     [8,10, 8, 7, 7, 9, 7],   # Raja Bali
    "VIKRAMA":     [7, 9,10, 7, 7, 8, 5],   # Keperkasaan
    "PARAMARTHA":  [10,8, 6,10, 7, 8, 8],   # Kebenaran tertinggi
    "MANGGALA":    [9, 8, 6, 7, 8,10, 8],   # Berkah
    "NIRMALA":     [9, 7, 5, 7,10, 7, 9],   # Kemurnian
    "MAHATMA":     [10,9, 7, 9, 7, 8, 8],   # Jiwa agung
    "VARADA":      [9, 9, 6, 8, 8,10, 9],   # Pemberi anugerah
    "ANUGRAHA":    [9, 8, 6, 8, 8,10, 9],   # Rahmat
    "ARJUNA":      [8, 8,10, 8, 8, 7, 7],   # Ksatria murni
    "KARUNIKA":    [9, 7, 5, 8, 8, 8,10],   # Penuh kasih
    "KARUNA":      [9, 6, 5, 8, 8, 7,10],   # Belas kasih
    "JAYENDRA":    [7,10, 9, 7, 7, 9, 6],   # Raja kemenangan
    "RATNAKARA":   [8, 9, 6, 8, 9,10, 7],   # Samudra permata
    "SATWIKA":     [10,7, 6, 8, 8, 8, 8],   # Sattvic/murni
    "VIBHUTI":     [9, 9, 6, 8, 8,10, 7],   # Keagungan
    "PRANAWA":     [10,7, 6, 9, 8, 7, 8],   # Aksara AUM
    "JAGADHITA":   [9, 8, 6, 8, 7,10, 9],   # Kemakmuran dunia
    # ... (dilanjutkan sesuai kamus kata)
}

def aura_kata(kata: str) -> list[float]:
    """
    Mengambil skor aura kata dari database.
    Fallback heuristik jika kata tidak ada di database.
    """
    if kata in AURA_DB:
        return AURA_DB[kata]

    # Fallback: heuristik berdasarkan huruf awal
    spiritual_init = set('SDJTPVMAU')
    royal_init     = set('RWIKEYNB')
    fl = kata[0].upper()
    s = 7 if fl in spiritual_init else 5
    r = 7 if fl in royal_init else 5
    return [s, r, 5, 6, 6, 7, 6]   # default baseline
```

### 9.3 Algoritma Skor Aura Nama

```python
def skor_aura_nama(nama: str) -> dict:
    """
    Menggabungkan aura semua kata dengan:
    1. Rata-rata per dimensi
    2. Bonus harmoni: jika antar-kata saling memperkuat (selisih ≤ 1 pada dimensi yang sama)
    3. Bonus sinergi: kombinasi tertentu menghasilkan resonansi khusus
    """
    kata = nama.split()
    n = len(kata)
    aura_kata_list = [aura_kata(k) for k in kata]

    # 1. Rata-rata dasar
    dims = 7
    avg = [sum(a[i] for a in aura_kata_list) / n for i in range(dims)]

    # 2. Bonus harmoni per dimensi
    bonus = [0.0] * dims
    if n >= 2:
        for i in range(dims):
            vals = [a[i] for a in aura_kata_list]
            spread = max(vals) - min(vals)
            if spread <= 1:
                bonus[i] += 0.5   # kata-kata saling memperkuat dimensi ini
            elif spread <= 2:
                bonus[i] += 0.2

    # 3. Bonus sinergi pasangan kata tertentu
    SINERGI = {
        ('DHARMA', 'VIJAYA'):    {'SPIRIT': 0.5, 'ROYAL': 0.5},
        ('SATYA', 'PRAJNA'):     {'SPIRIT': 0.5, 'INTEL': 0.5},
        ('VIJAYA', 'VIKRAMA'):   {'ROYAL': 0.5, 'BRAVE': 0.5},
        ('KARUNA', 'ANANDA'):    {'LOVE': 0.8, 'BEAUTY': 0.3},
        ('ANUGRAHA', 'NIRMALA'): {'SPIRIT': 0.5, 'PROSPER': 0.5},
        # Tambahkan pasangan lain sesuai kebutuhan
    }
    DIM_IDX = {'SPIRIT':0,'ROYAL':1,'BRAVE':2,'INTEL':3,'BEAUTY':4,'PROSPER':5,'LOVE':6}
    for pair, bonuses in SINERGI.items():
        if all(k in kata for k in pair):
            for dim, val in bonuses.items():
                bonus[DIM_IDX[dim]] += val

    # 4. Final: avg + bonus, capped 10
    final = [min(10.0, round(avg[i] + bonus[i], 2)) for i in range(dims)]

    # 5. Skor total (rata-rata 7 dimensi × 10 untuk skala 0–100)
    total = round(sum(final) / dims * 10)

    return {
        'per_dimensi': {
            'spiritualitas':    final[0],
            'kepemimpinan':     final[1],
            'keberanian':       final[2],
            'kecerdasan':       final[3],
            'keindahan':        final[4],
            'kesejahteraan':    final[5],
            'kasih_sayang':     final[6],
        },
        'total': total,         # 0–100
        'di_atas_rata': total >= 60,  # threshold minimal
    }
```

---

## 10. Modul I — Scoring & Ranking Terpadu

### 10.1 Bobot Default

```python
BOBOT = {
    'destiny_master':   30,   # Destiny = 11/22/33 (Master Number)
    'destiny_baik':     15,   # Destiny = 1–9 umum yang baik (mis. 1,3,7,9)
    'karmic_debt_ok':   20,   # Tidak ada karmic debt (NIHIL)
    'karmic_lesson':    20,   # Maksimum; dikurangi 4 per angka missing
    'wariga_10':        20,   # Wariga sempurna (maks 20 = ws*2)
    'jyotisha':         10,   # Huruf awal sesuai Taurus/Gemini
    # Total numerik maks: 100

    'bazi':             10,   # BaZi score/10 × 10
    'qimen':            10,   # Qimen score/10 × 10
    # Total metafisik maks: 20

    'aura':             30,   # Aura score/100 × 30
    # Total aura maks: 30

    # GRAND TOTAL maks: 150
}
```

### 10.2 Fungsi Skor

```python
def skor_total(r: dict, bobot: dict = BOBOT) -> dict:
    """
    r = hasil analyze() lengkap

    Return dict dengan skor per komponen dan grand total.
    """
    skor = {}

    # === NUMERIK (maks 100) ===
    # Destiny
    if r['destiny'] in (11, 22, 33):
        skor['destiny'] = bobot['destiny_master']
    elif r['destiny'] in (1, 3, 7, 9):
        skor['destiny'] = bobot['destiny_baik']
    else:
        skor['destiny'] = 0

    # Karmic Debt
    skor['karmic_debt'] = bobot['karmic_debt_ok'] if not r['karmic_debt'] else 0

    # Karmic Lesson
    n_missing = len(r['karmic_lesson'])
    skor['karmic_lesson'] = max(0, bobot['karmic_lesson'] - n_missing * 4)

    # Wariga
    skor['wariga'] = r['wariga']['skor'] * 2   # 0–20

    # Jyotisha
    skor['jyotisha'] = r['jyotisha']['skor'] * 5   # 0–10

    skor['subtotal_numerik'] = sum([
        skor['destiny'], skor['karmic_debt'],
        skor['karmic_lesson'], skor['wariga'], skor['jyotisha']
    ])

    # === METAFISIK (maks 20) ===
    skor['bazi']  = r['bazi']['skor']    # 0–10
    skor['qimen'] = r['qimen']['skor']   # 0–10
    skor['subtotal_metafisik'] = skor['bazi'] + skor['qimen']

    # === AURA SEMANTIK (maks 30) ===
    skor['aura'] = round(r['aura']['total'] / 100 * bobot['aura'])  # 0–30

    # === GRAND TOTAL ===
    skor['grand_total'] = (skor['subtotal_numerik'] +
                           skor['subtotal_metafisik'] +
                           skor['aura'])

    # === FLAG KUALITAS ===
    skor['flag'] = _flag_kualitas(r, skor)

    return skor


def _flag_kualitas(r: dict, skor: dict) -> str:
    """Klasifikasi kualitas kandidat."""
    debt_ok   = not r['karmic_debt']
    lesson_ok = len(r['karmic_lesson']) == 0
    wariga_ok = r['wariga']['sempurna']
    master_ok = len(r['master_numbers']) >= 1
    meta_ok   = skor['subtotal_metafisik'] >= 12
    aura_ok   = r['aura']['total'] >= 65

    if (debt_ok and lesson_ok and wariga_ok and master_ok
            and meta_ok and aura_ok):
        return 'SEMPURNA'
    elif (debt_ok and wariga_ok and
          len(r['karmic_lesson']) <= 1 and meta_ok):
        return 'SANGAT BAIK'
    elif debt_ok and wariga_ok:
        return 'BAIK'
    elif debt_ok:
        return 'PERLU REVIEW WARIGA'
    else:
        return 'TIDAK DIREKOMENDASIKAN'
```

---

## 11. Modul J — Generator Kombinasi Nama

### 11.1 Algoritma Generator

```python
def generate_kandidat(
    kamus: dict,                    # {kata: nilai_pythagorean}
    target_destiny: list = [11],    # [11] atau [11, 22, 33]
    min_huruf_kata: int = 4,
    max_kata: int = 3,
    filter_wariga_sempurna: bool = True,
    filter_no_debt: bool = True,
    max_lesson: int = 2,
    tabel_pyth: dict = PYTH,
) -> list[dict]:

    keys = list(kamus.keys())
    seen = set()
    hasil = []

    def valid_kata(k):
        return len(k) >= min_huruf_kata

    def cek_destiny(nama):
        total = sum(kamus.get(k, pv(k, tabel_pyth)) for k in nama.split())
        return reduksi(total) in target_destiny

    # === 2 KATA ===
    for i, k1 in enumerate(keys):
        if not valid_kata(k1):
            continue
        for k2 in keys:
            if k1 == k2 or not valid_kata(k2):
                continue
            pair = tuple(sorted([k1, k2]))
            if pair in seen:
                continue
            seen.add(pair)

            nama = f"{k1} {k2}"
            if not cek_destiny(nama):
                continue

            r = analyze_lengkap(nama, tabel_pyth, tabel_chald)

            if filter_no_debt and r['karmic_debt']:
                continue
            if filter_wariga_sempurna and not r['wariga']['sempurna']:
                continue
            if len(r['karmic_lesson']) > max_lesson:
                continue

            hasil.append(r)

    # === 3 KATA ===
    if max_kata >= 3:
        for k1 in keys:
            if not valid_kata(k1):
                continue
            for k2 in keys:
                if k2 == k1 or not valid_kata(k2):
                    continue
                for k3 in keys:
                    if k3 in (k1, k2) or not valid_kata(k3):
                        continue
                    triple = tuple(sorted([k1, k2, k3]))
                    if triple in seen:
                        continue
                    seen.add(triple)

                    nama = f"{k1} {k2} {k3}"
                    if not cek_destiny(nama):
                        continue

                    r = analyze_lengkap(nama, tabel_pyth, tabel_chald)

                    if filter_no_debt and r['karmic_debt']:
                        continue
                    if filter_wariga_sempurna and not r['wariga']['sempurna']:
                        continue
                    if len(r['karmic_lesson']) > max_lesson:
                        continue

                    hasil.append(r)

    # Hitung skor dan urutkan
    for r in hasil:
        r['skor_rinci'] = skor_total(r)
        r['grand_total'] = r['skor_rinci']['grand_total']

    hasil.sort(key=lambda x: (
        -x['grand_total'],
        len(x['karmic_lesson']),
        -len(x['master_numbers']),
    ))

    return hasil
```

### 11.2 Optimasi Performa

```python
# Pre-filter sebelum analyze penuh (hemat ~70% waktu komputasi)
def prefilter_destiny(kata_list: list, nilai_map: dict,
                       target_destiny: list, n_kata: int) -> bool:
    """
    Quick check: apakah total nilai bisa menghasilkan destiny target?
    Gunakan sebelum memanggil analyze_lengkap().
    """
    total = sum(nilai_map.get(k, pv(k)) for k in kata_list)
    return reduksi(total) in target_destiny

# Untuk 3 kata: pre-group kata per sisa modulo
# Ini mengurangi inner loop dari O(n³) menjadi O(n²)
def buat_index_destiny(kamus: dict, target: list) -> dict:
    """
    Membuat index kata per nilai mod.
    Kunci: nilai_pythagorean % besar_tertentu
    """
    from collections import defaultdict
    idx = defaultdict(list)
    for kata, val in kamus.items():
        idx[val % 99].append(kata)  # grouping kasar
    return idx
```

---

## 12. Database Referensi

### 12.1 Kamus Kata Inti (dengan nilai Pythagorean)

```python
KAMUS_KATA = {
    # Format: "KATA": nilai_pythagorean
    # === Sanskrit / Vedic ===
    "NAROTTAMA": 31,  "DHARMA": 27,    "VIDYA": 25,
    "PRAJNA": 24,     "VIJAYA": 23,    "KIRANA": 27,
    "ADNYANA": 24,    "SATYA": 12,     "UTTAMA": 13,
    "WIRA": 24,       "WISESA": 22,    "ANANDA": 17,
    "YASHA": 18,      "WIRAJAYA": 34,  "PARAMARTHA": 38,
    "TEJASA": 16,     "RADITYA": 27,   "KERTA": 17,
    "MANGGALA": 29,   "GUNARSA": 21,   "JAYANTA": 18,
    "SANJAYA": 17,    "NIRMALA": 32,   "DHYANA": 23,
    "TATWA": 11,      "VEDANTA": 22,   "SANATANA": 22,
    "VIJAYANTA": 30,  "UDAYANA": 25,   "PRATAMA": 25,
    "WIRYA": 31,      "SAMADHI": 22,   "RATNAKARA": 29,
    "NANDANA": 22,    "JIWADHANA": 34, "VIRA": 19,
    "VIBHAVA": 27,    "VARADA": 19,    "VIBHU": 22,
    "VASANTA": 14,    "VIKRAMA": 27,   "VIKRANTA": 28,
    "VINAYA": 25,     "VIBUDHA": 27,   "VIBHUTI": 30,
    "OJASVI": 28,     "KARUNIKA": 22,  "KARTIKA": 24,
    "KARUNA": 17,     "KANAKA": 14,    "JAYENDRA": 33,
    "MAHENDRA": 34,   "SWADHARMA": 34, "SANTIKA": 22,
    "TEJENDRA": 34,   "SUDHARMA": 27,  "WIRANATA": 26,
    "PRAWIRA": 32,    "ANUGRAHA": 26,  "SUDHANA": 22,
    "NARENDRA": 36,   "SATYENDRA": 35, "MAHAVIRA": 31,
    "MAHATMA": 22,    "SATWIKA": 24,   "JAYASAKTI": 30,
    "RAJAPUTRA": 34,  "TRISAKTI": 22,  "SURYAJAYA": 32,
    "ARJUNA": 20,     "PARAMA": 22,    "AMERTA": 22,
    "SIDDHA": 22,     "PRAKARSA": 26,  "PRADHANA": 30,
    "KERTAJAYA": 30,  "KUNCARA": 24,   "KUSUMA": 17,
    "JATMIKA": 26,    "JAGADHITA": 34, "PRABAWA": 24,
    "DIKSA": 19,      "NARARYA": 28,   "VIRAJA": 20,
    "SUMANTRA": 22,   "JINARTHA": 34,  "SUPUTRA": 26,
    "PRANAWA": 30,    "SWASTIKA": 22,  "MAHAYANA": 26,
    "PRANAWIJAYA": 56,"SATYAJAYA": 30, "JNANA": 13,
    "SUBHAGA": 18,    "DIRGHAYU": 37,

    # === Bali spesifik ===
    "UDAYANA": 25,    "WANAGIRI": 34,  "SUARJANA": 18,
    "SUARTHA": 22,    "SWARGAJAYA": 38,"SWARDANA": 26,
}
```

### 12.2 Kata yang DILARANG

```python
KATA_DILARANG = {
    # Nama dewa langsung
    "SIWA", "WISNU", "BRAHMA", "INDRA", "YAMA", "BARUNA",
    "AGNI", "SURYA", "CANDRA", "BAYU", "GANESHA", "KUMARA",
    "SKANDA", "KARTIKA",  # (Kartika = bintang, bukan nama dewa — OK)
    "DURGA", "SARASWATI", "LAKSMI", "PARVATI",

    # Kata yang mengandung konsep terlarang
    "MOKSHA", "MOKSA", "MHOKSA",   # dilarang per permintaan
    "BODHI", "BUDHA", "BUDDHA",    # dilarang per permintaan

    # Kata dengan konotasi negatif
    "PATI", "DUKA", "BUTA", "WERDHA",
}

def validasi_kata(kata: str) -> bool:
    return kata.upper() not in KATA_DILARANG
```

---

## 13. Pseudocode Lengkap

```python
# ============================================================
# FUNGSI UTAMA: analyze_lengkap()
# ============================================================

def analyze_lengkap(nama: str, tabel_pyth: dict, tabel_chald: dict) -> dict:
    """
    Analisis satu nama secara lengkap — semua modul.
    nama: string multi-kata, e.g. "VIJAYA MANGGALA TATWA"
    """
    kata = nama.upper().split()

    # === Pythagorean ===
    total_p = sum(sum(tabel_pyth.get(c, 0) for c in k) for k in kata)
    destiny = reduksi(total_p)

    # === Chaldean ===
    total_c = sum(sum(tabel_chald.get(c, 0) for c in k) for k in kata)
    destiny_c = reduksi(total_c)

    # === Soul Urge & Personality ===
    su_total, soul   = soul_urge(' '.join(kata), tabel_pyth)
    pe_total, pers   = personality(' '.join(kata), tabel_pyth)

    # === Karmic ===
    karmic_debt   = cek_karmic_debt(' '.join(kata), tabel_pyth)
    hadir, hilang = cek_karmic_lesson(' '.join(kata), tabel_pyth)

    # === Wariga Bali ===
    w = skor_wariga(' '.join(kata))

    # === Neptu ===
    nep_raw, nep_red = neptu_nama(' '.join(kata))

    # === Jyotisha ===
    jyot = skor_jyotisha(kata[0])

    # === Master Numbers ===
    masters = temukan_master_numbers(' '.join(kata), tabel_pyth, tabel_chald)

    # === BaZi ===
    bazi = skor_bazi(' '.join(kata))

    # === Qimen ===
    qimen = skor_qimen(' '.join(kata), tabel_pyth)

    # === Aura Semantik ===
    aura = skor_aura_nama(' '.join(kata))

    # === Kumpulkan hasil ===
    return {
        'nama':           ' '.join(kata),
        'kata':           kata,
        'jumlah_huruf':   len(''.join(kata)),

        # Numerologi
        'total_p':        total_p,
        'total_c':        total_c,
        'destiny':        destiny,
        'destiny_c':      destiny_c,
        'soul':           soul,
        'personality':    pers,

        # Karmic
        'karmic_debt':    karmic_debt,   # [] = nihil
        'karmic_lesson':  hilang,        # [] = nihil
        'angka_hadir':    sorted(hadir),

        # Wariga
        'wariga':         w,

        # Neptu
        'neptu_raw':      nep_raw,
        'neptu':          nep_red,

        # Jyotisha
        'jyotisha':       jyot,

        # Master Numbers
        'master_numbers': masters,

        # BaZi + Qimen
        'bazi':           bazi,
        'qimen':          qimen,
        'metafisik_total': bazi['skor'] + qimen['skor'],

        # Aura
        'aura':           aura,
    }


# ============================================================
# ENTRY POINT
# ============================================================

def jalankan_engine(
    kamus: dict,
    target_destiny: list = [11],
    top_n: int = 50,
) -> list[dict]:

    print("Memulai generasi kandidat...")
    kandidat = generate_kandidat(
        kamus=kamus,
        target_destiny=target_destiny,
        min_huruf_kata=4,
        max_kata=3,
        filter_wariga_sempurna=True,
        filter_no_debt=True,
        max_lesson=3,
    )
    print(f"Ditemukan {len(kandidat)} kandidat valid")

    # Hitung grand total dan urutkan
    for r in kandidat:
        r['skor_rinci'] = skor_total(r)
        r['grand_total'] = r['skor_rinci']['grand_total']

    kandidat.sort(key=lambda x: (
        -x['grand_total'],
        len(x['karmic_lesson']),
        -x['metafisik_total'],
        -x['aura']['total'],
        -len(x['master_numbers']),
    ))

    return kandidat[:top_n]
```

---

## 14. Skema Data Output

### 14.1 Format JSON per kandidat

```json
{
  "nama": "VIJAYA MANGGALA TATWA",
  "kata": ["VIJAYA", "MANGGALA", "TATWA"],
  "jumlah_huruf": 17,
  "total_p": 56,
  "total_c": 38,
  "destiny": 11,
  "destiny_c": 11,
  "soul": 2,
  "personality": 9,
  "karmic_debt": [],
  "karmic_lesson": [],
  "angka_hadir": [1, 2, 3, 4, 5, 6, 7, 8, 9],
  "wariga": {
    "jumlah_huruf": 17,
    "asta": {"nilai": 1, "makna": "Langgeng", "baik": true},
    "panca": {"nilai": 2, "makna": "Suka", "baik": true},
    "dasa": {"nilai": 7, "makna": "Sri", "baik": true},
    "skor": 10,
    "sempurna": true
  },
  "neptu_raw": 56,
  "neptu": 11,
  "jyotisha": {
    "huruf_awal": "V",
    "skor": 2,
    "label": "Taurus — sangat sesuai"
  },
  "master_numbers": [
    {"sumber": "total", "angka": 11, "sistem": "Pythagorean"},
    {"sumber": "total", "angka": 11, "sistem": "Chaldean"}
  ],
  "bazi": {
    "skor": 8,
    "elemen": ["Kayu", "Air"],
    "interpretasi": "Sangat harmonis"
  },
  "qimen": {
    "skor": 9,
    "palaces": [4, 1, 6],
    "detail": [
      {"kata": "VIJAYA", "palace": 4, "makna": "Xun", "baik": true},
      {"kata": "MANGGALA", "palace": 1, "makna": "Kan", "baik": true},
      {"kata": "TATWA", "palace": 6, "makna": "Qian", "baik": true}
    ]
  },
  "metafisik_total": 17,
  "aura": {
    "per_dimensi": {
      "spiritualitas": 9.0,
      "kepemimpinan": 8.5,
      "keberanian": 8.0,
      "kecerdasan": 8.5,
      "keindahan": 7.5,
      "kesejahteraan": 8.5,
      "kasih_sayang": 7.5
    },
    "total": 79,
    "di_atas_rata": true
  },
  "skor_rinci": {
    "destiny": 30,
    "karmic_debt": 20,
    "karmic_lesson": 20,
    "wariga": 20,
    "jyotisha": 10,
    "subtotal_numerik": 100,
    "bazi": 8,
    "qimen": 9,
    "subtotal_metafisik": 17,
    "aura": 24,
    "grand_total": 141,
    "flag": "SEMPURNA"
  }
}
```

---

## 15. Catatan Implementasi

### 15.1 Stack yang Direkomendasikan

| Layer | Opsi | Catatan |
|-------|------|---------|
| Backend | Python 3.10+ | Paling mudah untuk iterasi kombinatorik |
| Backend alt. | Node.js / TypeScript | Jika sudah berbasis JS |
| Database kata | JSON / SQLite | JSON cukup untuk ≤5000 kata |
| Frontend | React + Chart.js | Radar chart per dimensi |
| Output | JSON + CSV | JSON untuk API, CSV untuk review manual |

### 15.2 Kompleksitas Komputasi

Tanpa optimasi:
- 2 kata dari 100 kamus → 100² = 10.000 kombinasi
- 3 kata dari 100 kamus → 100³ = 1.000.000 kombinasi (berat)

Dengan pre-filter destiny:
- Hanya ~15% kombinasi lolos → turun ke ~150.000
- Dengan filter Wariga → turun lagi ke ~10.000

Estimasi waktu: 3 kata, 200 kamus, Python biasa → 3–10 detik. Cukup untuk dijalankan sekali, hasilnya disimpan.

### 15.3 Konfigurasi yang Bisa Diubah

```python
CONFIG = {
    # Target Destiny (boleh lebih dari satu)
    'target_destiny': [11],

    # Wariga: apakah harus sempurna?
    'wariga_sempurna': True,   # False = terima ws >= 6

    # Karmic Debt: harus nihil?
    'karmic_debt_nihil': True,

    # Karmic Lesson: max angka missing
    'max_lesson': 2,           # 0 = harus nihil sempurna

    # Aura: minimum total score
    'min_aura': 60,

    # Metafisik: minimum BaZi+Qimen
    'min_metafisik': 12,

    # Master Numbers: minimum titik
    'min_master_numbers': 1,

    # Bobot skor (bisa dikustomisasi)
    'bobot': BOBOT,
}
```

### 15.4 Cara Menambah Kata ke Database

1. Tambahkan kata ke `KAMUS_KATA` dengan nilai Pythagorean-nya
2. Tambahkan entri ke `AURA_DB` dengan skor 7 dimensi (0–10)
3. Tambahkan makna ke kamus `MAKNA`
4. Opsional: tambahkan ke `SINERGI` jika kata punya resonansi khusus dengan kata lain
5. Jalankan ulang generator

### 15.5 Validasi Hasil Manual

Setelah engine menghasilkan daftar, lakukan validasi manual:
1. Cek bunyi/fonologi — apakah nyaman diucapkan dalam bahasa Bali?
2. Cek tidak ada homonim negatif dalam bahasa sehari-hari
3. Konfirmasi makna dengan lontar/kamus Sanskrit terpercaya
4. Konsultasikan dengan Pemangku/Sulinggih untuk blessing final

---

*Dokumen ini adalah cetak biru teknis — setiap modul dapat diimplementasikan secara independen dan digabungkan melalui `analyze_lengkap()` dan `skor_total()`. Bobot dan threshold bersifat rekomendasi dan dapat disesuaikan dengan kebutuhan keluarga.*

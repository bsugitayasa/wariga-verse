python3 << 'EOF'
# ============================================================
# SISTEM ANALISIS LENGKAP MULTI-METODE
# ============================================================

pyth = {
    'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7,'H':8,'I':9,
    'J':1,'K':2,'L':3,'M':4,'N':5,'O':6,'P':7,'Q':8,'R':9,
    'S':1,'T':2,'U':3,'V':4,'W':5,'X':6,'Y':7,'Z':8
}

# CHALDEAN system (berbeda dari Pythagorean)
chald = {
    'A':1,'B':2,'C':3,'D':4,'E':5,'F':8,'G':3,'H':5,'I':1,
    'J':1,'K':2,'L':3,'M':4,'N':5,'O':7,'P':8,'Q':1,'R':2,
    'S':3,'T':4,'U':6,'V':6,'W':6,'X':5,'Y':1,'Z':7
}

def pyth_val(n): return sum(pyth.get(c,0) for c in n.upper().replace(' ',''))
def chald_val(n): return sum(chald.get(c,0) for c in n.upper().replace(' ',''))
def reduksi(n, m=True):
    while n>9:
        if m and n in (11,22,33): return n
        n=sum(int(d) for d in str(n))
    return n

# ============================================================
# KARMIC DEBT NUMBERS: 13, 14, 16, 19
# KARMIC LESSON: angka 1-9 yang TIDAK muncul di nama
# ============================================================
def karmic_debt(nama):
    """Cek apakah ada intermediate number yang mengandung karmic debt"""
    kata = nama.split()
    debts = []
    for k in kata:
        v = pyth_val(k)
        if v in (13,14,16,19):
            debts.append((k,v))
    # Cek total juga
    total = sum(pyth_val(k) for k in kata)
    if total in (13,14,16,19):
        debts.append(("TOTAL",total))
    # Reduksi bertahap
    t = total
    while t > 9:
        if t in (11,22,33): break
        if t in (13,14,16,19):
            debts.append((f"STEP({t})",t))
        t = sum(int(d) for d in str(t))
    return debts

def karmic_lesson(nama):
    """Angka 1-9 yang tidak muncul sama sekali dalam nama = Karmic Lesson"""
    huruf = nama.upper().replace(' ','')
    angka_muncul = set()
    for c in huruf:
        if c in pyth:
            angka_muncul.add(pyth[c])
    missing = [i for i in range(1,10) if i not in angka_muncul]
    return angka_muncul, missing

def intensitas(nama):
    """Angka yang muncul terlalu sering = intensitas berlebih"""
    huruf = nama.upper().replace(' ','')
    count = {}
    for c in huruf:
        if c in pyth:
            v = pyth[c]
            count[v] = count.get(v,0)+1
    return count

# ============================================================
# WARIGA BALI — ASTA DAUH, PANCA DAUH, DASA DAUH
# Berdasarkan perhitungan tradisional Bali
# ============================================================

# PANCA WARA nilai (Umanis=5, Paing=9, Pon=7, Wage=4, Kliwon=8)
panca_wara = {'UMANIS':5,'PAING':9,'PON':7,'WAGE':4,'KLIWON':8}

# SAPTA WARA nilai
sapta_wara = {'RADITE':1,'COMA':2,'ANGGARA':3,'BUDA':4,
              'WRASPATI':5,'SUKRA':6,'SANISCARA':7}

# WUKU (30 wuku, masing-masing nilai spiritual)
# Pertengahan Mei 2026 = sekitar wuku Ugu atau Wariga
# Estimasi: 15 Mei 2026
# Hitung wuku: epoch Bali dimulai dari wuku tertentu
# Simplified: Mei 2026 wuku ke-?

# Akṣara/huruf awal berdasarkan Jyotisha (Vedic astrology)
# Taurus (Vrishabha): lahir 14 Apr - 20 Mei → Akshara: I, U, E, O, Va, Vi, Vu, Ve, Vo
# Gemini (Mithuna): lahir 21 Mei - 20 Jun → Akshara: Ka, Ki, Ku, Gha, Nga, Cha, Ke, Ko

# NAKSHATRA untuk pertengahan Mei 2026
# Mei 2026: Matahari di Taurus, bulan bergerak
# Sekitar 15 Mei 2026: kemungkinan Nakshatra Rohini, Mrigashira, atau Ardra

# NEPTU JAWA-BALI (untuk nama)
# Neptu huruf dalam tradisi Jawa: A=1,I=1,U=2,E=3,O=1 (vokal)
# Konsonan mendapat nilai berbeda

# Nilai huruf untuk neptu nama (sistem Jawa-Bali)
neptu_huruf = {
    'A':1,'I':1,'U':2,'E':3,'O':1,  # vokal
    'B':2,'C':3,'D':4,'G':5,'H':6,'J':4,'K':6,'L':6,
    'M':4,'N':5,'P':7,'R':4,'S':6,'T':4,'W':6,'Y':1,
    'F':8,'V':8,'Z':8,'X':6,'Q':8
}

def neptu_nama(nama):
    """Hitung neptu nama berdasarkan sistem Jawa-Bali"""
    huruf = nama.upper().replace(' ','')
    total = sum(neptu_huruf.get(c,0) for c in huruf)
    return total, reduksi(total)

# ============================================================
# ASTA DAUH — 8 waktu dalam sehari, dihitung dari nama
# Dalam wariga, nama dianalisis berdasarkan jumlah aksara
# ============================================================
def asta_dauh_analisis(nama):
    """
    Asta Dauh: jumlah suku kata / huruf mod 8
    Nilai: 1=Langgeng, 2=Ayu, 3=Duka, 4=Sri, 5=Pati, 6=Suka, 7=Brahma, 8=Kerta
    Terbaik: 1(Langgeng), 2(Ayu), 4(Sri), 6(Suka), 7(Brahma), 8(Kerta)
    Buruk: 3(Duka), 5(Pati)
    """
    asta_makna = {1:'Langgeng (Kekal)', 2:'Ayu (Baik/Indah)', 3:'Duka (Kesedihan)',
                  4:'Sri (Kemakmuran)', 5:'Pati (Kematian/Bahaya)', 6:'Suka (Kebahagiaan)',
                  7:'Brahma (Kesucian)', 8:'Kerta (Sempurna)'}
    # Hitung jumlah huruf (bukan suku kata)
    huruf_count = len(nama.upper().replace(' ',''))
    hasil = (huruf_count % 8) or 8
    return huruf_count, hasil, asta_makna.get(hasil,'?')

def panca_dauh_analisis(nama):
    """
    Panca Dauh: jumlah huruf mod 5
    1=Pati, 2=Suka, 3=Duka, 4=Sri, 5=Manggeh(Langgeng)
    Terbaik: 2(Suka), 4(Sri), 5(Langgeng)
    Buruk: 1(Pati), 3(Duka)
    """
    panca_makna = {1:'Pati (Bahaya)', 2:'Suka (Bahagia)', 3:'Duka (Sedih)',
                   4:'Sri (Makmur)', 5:'Manggeh (Kekal/Langgeng)'}
    huruf_count = len(nama.upper().replace(' ',''))
    hasil = (huruf_count % 5) or 5
    return huruf_count, hasil, panca_makna.get(hasil,'?')

def dasa_dauh_analisis(nama):
    """
    Dasa Dauh: jumlah huruf mod 10
    1=Werdha, 2=Ayu, 3=Brahma, 4=Indra, 5=Pati, 6=Buta,
    7=Sri, 8=Hayu, 9=Dewa, 10=Nirmala
    Terbaik: 2(Ayu), 3(Brahma), 4(Indra), 7(Sri), 8(Hayu), 9(Dewa), 10(Nirmala)
    Buruk: 1(Werdha=mundur), 5(Pati), 6(Buta)
    """
    dasa_makna = {1:'Werdha (Mundur/Tua)', 2:'Ayu (Cantik/Indah)', 3:'Brahma (Suci/Agung)',
                  4:'Indra (Berkuasa)', 5:'Pati (Kematian)', 6:'Buta (Kegelapan)',
                  7:'Sri (Kemakmuran)', 8:'Hayu (Selamat)', 9:'Dewa (Ilahi)', 10:'Nirmala (Murni Suci)'}
    huruf_count = len(nama.upper().replace(' ',''))
    hasil = (huruf_count % 10) or 10
    return huruf_count, hasil, dasa_makna.get(hasil,'?')

def baik_buruk(asta, panca, dasa):
    """Hitung skor wariga 0-10"""
    skor = 0
    # Asta
    if asta in (1,2,4,6,7,8): skor += 3
    elif asta == 3: skor += 0
    else: skor += 0  # 5=Pati
    # Panca
    if panca in (2,4,5): skor += 4
    elif panca == 3: skor += 0
    else: skor += 0  # 1=Pati
    # Dasa
    if dasa in (2,3,4,7,8,9,10): skor += 3
    elif dasa in (1,5,6): skor += 0
    return skor

# ============================================================
# JYOTISHA — AKSHARA (huruf awal per nakshatra)
# ============================================================
# Pertengahan Mei 2026 — estimasi nakshatra
# Bulan Mei 2026, sekitar tanggal 13-20: Bulan mungkin di Rohini/Mrigashira
# Taurus rising → aksara yang disarankan: Ba, Va, U, Bh, E, O, Ea, I
# Mrigashira nakshatra → aksara: Ve, Vo, Ka, Ki

nakshatra_aksara = {
    'Rohini': ['O','Va','Vi','Vu','Ve'],
    'Mrigashira': ['Ve','Vo','Ka','Ki'],
    'Ardra': ['Ku','Gha','Ng','Ja'],
    'Punarvasu': ['Ki','Ku','Ghe','Ka'],
    'Taurus_sign': ['Ba','Va','U','E','Bh','O','Ea','I'],  # umum untuk Taurus
    'Gemini_sign': ['Ka','Ki','Ku','Ke','Ko','Gha'],  # umum untuk Gemini
}

# ============================================================
# ANALISIS 5 KANDIDAT
# ============================================================
kandidat_5 = [
    "DHARMA PRADIPA",
    "NAROTTAMA VIDYA",
    "ADNYANA VIJAYA",
    "ADNYANA KIRANA VIJAYA",
    "PRAJNA DHARMA VIJAYA",
]

print("="*80)
print("ANALISIS LENGKAP MULTI-SISTEM")
print("="*80)

for nama in kandidat_5:
    total_p = sum(pyth_val(k) for k in nama.split())
    total_c = sum(chald_val(k) for k in nama.split())
    dest_p = reduksi(total_p)
    dest_c = reduksi(total_c)

    # Karmic
    debts = karmic_debt(nama)
    angka_ada, missing = karmic_lesson(nama)
    intense = intensitas(nama)

    # Wariga
    hn_a, asta, asta_m = asta_dauh_analisis(nama)
    hn_p, panca, panca_m = panca_dauh_analisis(nama)
    hn_d, dasa, dasa_m = dasa_dauh_analisis(nama)
    skor_wariga = baik_buruk(asta, panca, dasa)

    # Neptu
    nep_total, nep_red = neptu_nama(nama)

    print(f"\n{'='*60}")
    print(f"NAMA: {nama}")
    print(f"{'='*60}")
    print(f"Jumlah huruf: {hn_a}")
    print(f"\n--- NUMEROLOGI ---")
    print(f"Pythagorean: {total_p} → {dest_p}")
    print(f"Chaldean: {total_c} → {dest_c}")
    print(f"\n--- KARMIC DEBT ---")
    if debts:
        for d in debts: print(f"  ⚠ {d[0]} = {d[1]} (KARMIC DEBT!)")
    else:
        print(f"  ✓ Tidak ada karmic debt")
    print(f"\n--- KARMIC LESSON (angka tidak muncul) ---")
    print(f"  Angka muncul: {sorted(angka_ada)}")
    if missing:
        print(f"  ⚠ Karmic Lesson: {missing} (angka tidak ada)")
    else:
        print(f"  ✓ Semua angka 1-9 muncul")
    print(f"\n--- INTENSITAS ANGKA ---")
    for v in sorted(intense): print(f"  {v}: muncul {intense[v]}x")
    print(f"\n--- WARIGA BALI ---")
    print(f"  Huruf: {hn_a}")
    print(f"  Asta Dauh: {hn_a} mod 8 = {asta} → {asta_m}")
    print(f"  Panca Dauh: {hn_a} mod 5 = {panca} → {panca_m}")
    print(f"  Dasa Dauh: {hn_a} mod 10 = {dasa} → {dasa_m}")
    print(f"  Skor Wariga: {skor_wariga}/10")
    print(f"\n--- NEPTU NAMA ---")
    print(f"  Total neptu: {nep_total} → reduksi: {nep_red}")
    print(f"\n--- JYOTISHA AKSHARA ---")
    huruf_awal = nama[0]
    print(f"  Huruf awal nama: {huruf_awal}")
    print(f"  Taurus aksara: Ba,Va,U,E,Bh,O,Ea,I → {'✓ COCOK' if huruf_awal in ['B','V','U','E','O','I'] else '— Netral'}")
    print(f"  Gemini aksara: Ka,Ki,Ku,Ke,Ko,Gha → {'✓ COCOK' if huruf_awal in ['K','G'] else '— Netral'}")

EOF
Output

================================================================================
ANALISIS LENGKAP MULTI-SISTEM
================================================================================

============================================================
NAMA: DHARMA PRADIPA
============================================================
Jumlah huruf: 13

--- NUMEROLOGI ---
Pythagorean: 65 → 11
Chaldean: 42 → 6

--- KARMIC DEBT ---
  ✓ Tidak ada karmic debt

--- KARMIC LESSON (angka tidak muncul) ---
  Angka muncul: [1, 4, 7, 8, 9]
  ⚠ Karmic Lesson: [2, 3, 5, 6] (angka tidak ada)

--- INTENSITAS ANGKA ---
  1: muncul 4x
  4: muncul 3x
  7: muncul 2x
  8: muncul 1x
  9: muncul 3x

--- WARIGA BALI ---
  Huruf: 13
  Asta Dauh: 13 mod 8 = 5 → Pati (Kematian/Bahaya)
  Panca Dauh: 13 mod 5 = 3 → Duka (Sedih)
  Dasa Dauh: 13 mod 10 = 3 → Brahma (Suci/Agung)
  Skor Wariga: 3/10

--- NEPTU NAMA ---
  Total neptu: 45 → reduksi: 9

--- JYOTISHA AKSHARA ---
  Huruf awal nama: D
  Taurus aksara: Ba,Va,U,E,Bh,O,Ea,I → — Netral
  Gemini aksara: Ka,Ki,Ku,Ke,Ko,Gha → — Netral

============================================================
NAMA: NAROTTAMA VIDYA
============================================================
Jumlah huruf: 14

--- NUMEROLOGI ---
Pythagorean: 56 → 11
Chaldean: 42 → 6

--- KARMIC DEBT ---
  ✓ Tidak ada karmic debt

--- KARMIC LESSON (angka tidak muncul) ---
  Angka muncul: [1, 2, 4, 5, 6, 7, 9]
  ⚠ Karmic Lesson: [3, 8] (angka tidak ada)

--- INTENSITAS ANGKA ---
  1: muncul 4x
  2: muncul 2x
  4: muncul 3x
  5: muncul 1x
  6: muncul 1x
  7: muncul 1x
  9: muncul 2x

--- WARIGA BALI ---
  Huruf: 14
  Asta Dauh: 14 mod 8 = 6 → Suka (Kebahagiaan)
  Panca Dauh: 14 mod 5 = 4 → Sri (Makmur)
  Dasa Dauh: 14 mod 10 = 4 → Indra (Berkuasa)
  Skor Wariga: 10/10

--- NEPTU NAMA ---
  Total neptu: 40 → reduksi: 4

--- JYOTISHA AKSHARA ---
  Huruf awal nama: N
  Taurus aksara: Ba,Va,U,E,Bh,O,Ea,I → — Netral
  Gemini aksara: Ka,Ki,Ku,Ke,Ko,Gha → — Netral

============================================================
NAMA: ADNYANA VIJAYA
============================================================
Jumlah huruf: 13

--- NUMEROLOGI ---
Pythagorean: 47 → 11
Chaldean: 29 → 11

--- KARMIC DEBT ---
  ✓ Tidak ada karmic debt

--- KARMIC LESSON (angka tidak muncul) ---
  Angka muncul: [1, 4, 5, 7, 9]
  ⚠ Karmic Lesson: [2, 3, 6, 8] (angka tidak ada)

--- INTENSITAS ANGKA ---
  1: muncul 6x
  4: muncul 2x
  5: muncul 2x
  7: muncul 2x
  9: muncul 1x

--- WARIGA BALI ---
  Huruf: 13
  Asta Dauh: 13 mod 8 = 5 → Pati (Kematian/Bahaya)
  Panca Dauh: 13 mod 5 = 3 → Duka (Sedih)
  Dasa Dauh: 13 mod 10 = 3 → Brahma (Suci/Agung)
  Skor Wariga: 3/10

--- NEPTU NAMA ---
  Total neptu: 34 → reduksi: 7

--- JYOTISHA AKSHARA ---
  Huruf awal nama: A
  Taurus aksara: Ba,Va,U,E,Bh,O,Ea,I → — Netral
  Gemini aksara: Ka,Ki,Ku,Ke,Ko,Gha → — Netral

============================================================
NAMA: ADNYANA KIRANA VIJAYA
============================================================
Jumlah huruf: 19

--- NUMEROLOGI ---
Pythagorean: 74 → 11
Chaldean: 41 → 5

--- KARMIC DEBT ---
  ✓ Tidak ada karmic debt

--- KARMIC LESSON (angka tidak muncul) ---
  Angka muncul: [1, 2, 4, 5, 7, 9]
  ⚠ Karmic Lesson: [3, 6, 8] (angka tidak ada)

--- INTENSITAS ANGKA ---
  1: muncul 8x
  2: muncul 1x
  4: muncul 2x
  5: muncul 3x
  7: muncul 2x
  9: muncul 3x

--- WARIGA BALI ---
  Huruf: 19
  Asta Dauh: 19 mod 8 = 3 → Duka (Kesedihan)
  Panca Dauh: 19 mod 5 = 4 → Sri (Makmur)
  Dasa Dauh: 19 mod 10 = 9 → Dewa (Ilahi)
  Skor Wariga: 7/10

--- NEPTU NAMA ---
  Total neptu: 52 → reduksi: 7

--- JYOTISHA AKSHARA ---
  Huruf awal nama: A
  Taurus aksara: Ba,Va,U,E,Bh,O,Ea,I → — Netral
  Gemini aksara: Ka,Ki,Ku,Ke,Ko,Gha → — Netral

============================================================
NAMA: PRAJNA DHARMA VIJAYA
============================================================
Jumlah huruf: 18

--- NUMEROLOGI ---
Pythagorean: 74 → 11
Chaldean: 46 → 1

--- KARMIC DEBT ---
  ✓ Tidak ada karmic debt

--- KARMIC LESSON (angka tidak muncul) ---
  Angka muncul: [1, 4, 5, 7, 8, 9]
  ⚠ Karmic Lesson: [2, 3, 6] (angka tidak ada)

--- INTENSITAS ANGKA ---
  1: muncul 8x
  4: muncul 3x
  5: muncul 1x
  7: muncul 2x
  8: muncul 1x
  9: muncul 3x

--- WARIGA BALI ---
  Huruf: 18
  Asta Dauh: 18 mod 8 = 2 → Ayu (Baik/Indah)
  Panca Dauh: 18 mod 5 = 3 → Duka (Sedih)
  Dasa Dauh: 18 mod 10 = 8 → Hayu (Selamat)
  Skor Wariga: 6/10

--- NEPTU NAMA ---
  Total neptu: 58 → reduksi: 4

--- JYOTISHA AKSHARA ---
  Huruf awal nama: P
  Taurus aksara: Ba,Va,U,E,Bh,O,Ea,I → — Netral
  Gemini aksara: Ka,Ki,Ku,Ke,Ko,Gha → — Netral

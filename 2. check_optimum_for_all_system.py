python3 << 'EOF'
# Sekarang: cari nama BARU yang memenuhi SEMUA kriteria sekaligus:
# 1. Destiny 11 (Pythagorean)
# 2. Karmic Debt = NIHIL (tidak ada 13,14,16,19 di manapun)
# 3. Karmic Lesson MINIMAL (idealnya 0, max 2 angka missing)
# 4. Wariga Asta Dauh = BAIK (bukan 3/Duka atau 5/Pati)
# 5. Wariga Panca Dauh = BAIK (bukan 1/Pati atau 3/Duka)
# 6. Wariga Dasa Dauh = BAIK (bukan 1,5,6)
# 7. Tidak ada nama dewa
# 8. Bermakna mulia untuk Brahmana
# 9. Jyotisha Akshara: huruf awal sesuai Taurus/Gemini Mei 2026

pyth = {
    'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7,'H':8,'I':9,
    'J':1,'K':2,'L':3,'M':4,'N':5,'O':6,'P':7,'Q':8,'R':9,
    'S':1,'T':2,'U':3,'V':4,'W':5,'X':6,'Y':7,'Z':8
}
def pv(n): return sum(pyth.get(c,0) for c in n.upper().replace(' ',''))
def rd(n,m=True):
    while n>9:
        if m and n in (11,22,33): return n
        n=sum(int(d) for d in str(n))
    return n

def full_analisis(nama):
    kata = nama.split()
    total = sum(pv(k) for k in kata)
    dest = rd(total)
    huruf_count = len(nama.replace(' ',''))

    # Karmic Debt check
    kd = []
    for k in kata:
        v = pv(k)
        if v in (13,14,16,19): kd.append(v)
    if total in (13,14,16,19): kd.append(total)
    t2 = total
    while t2 > 9:
        if t2 in (11,22,33): break
        if t2 in (13,14,16,19): kd.append(t2)
        t2 = sum(int(d) for d in str(t2))

    # Karmic Lesson
    semua = set()
    for c in nama.upper().replace(' ',''):
        if c in pyth: semua.add(pyth[c])
    missing = [i for i in range(1,10) if i not in semua]

    # Wariga
    asta = (huruf_count % 8) or 8
    panca = (huruf_count % 5) or 5
    dasa = (huruf_count % 10) or 10
    asta_ok = asta not in (3,5)
    panca_ok = panca not in (1,3)
    dasa_ok = dasa not in (1,5,6)
    wariga_score = (3 if asta_ok else 0) + (4 if panca_ok else 0) + (3 if dasa_ok else 0)

    # Jyotisha: aksara Taurus (Apr14-May20): Va,Vi,Vu,Ve,Vo,Ba,Bi,Bu (V dan B favorit)
    # aksara Gemini (May21+): Ka,Ki,Ku,Ke,Ko,Gha
    huruf_awal = nama[0].upper()
    aksara_taurus = set('VBUEOI')
    aksara_gemini = set('KG')
    jyotisha_score = 2 if huruf_awal in aksara_taurus else (2 if huruf_awal in aksara_gemini else 0)

    return {
        'nama': nama,
        'huruf': huruf_count,
        'destiny': dest,
        'kd': kd,
        'missing': missing,
        'asta': asta, 'panca': panca, 'dasa': dasa,
        'asta_ok': asta_ok, 'panca_ok': panca_ok, 'dasa_ok': dasa_ok,
        'wariga': wariga_score,
        'jyotisha': jyotisha_score,
        'jh_awal': huruf_awal,
    }

def total_score(r):
    s = 0
    if r['destiny'] == 11: s += 30
    if not r['kd']: s += 20
    ml = len(r['missing'])
    s += max(0, 20 - ml*4)  # 20 jika 0 missing, -4 per missing
    s += r['wariga'] * 2  # max 20
    s += r['jyotisha'] * 5  # max 10
    return s

# Kata-kata aman (tanpa dewa) dengan nilai dan jumlah huruf
# Format: nama → (pyth_val, huruf_count)
kamus = {
    "NAROTTAMA":31, "DHARMA":27, "VIDYA":25, "PRAJNA":24, "VIJAYA":23,
    "KIRANA":27, "ADNYANA":24, "PRADIPA":38, "PRADIPTA":40, "SATYA":12,
    "UTTAMA":13, "WIRA":24, "WASKITA":26, "WISESA":22, "ANANDA":17,
    "MOKSHA":22, "AMERTHA":30, "YASHA":18, "WIRAJAYA":34, "JAYADHARMA":32,
    "SATYAJAYA":30, "JNANA":13, "ARYA":18, "JIWADHANA":34, "NARARYA":28,
    "MAHAJAYA":25, "PARAMARTA":35, "PARAMARTHA":38, "DIPTA":23,
    "DIPA":21, "TEJASA":16, "BASKARA":17, "RADITYA":27, "BHANU":14,
    "JYOTI":18, "KERTA":17, "MANGGALA":29, "GUNARSA":21, "JAYANTA":18,
    "SANJAYA":17, "NIRMALA":32, "BODHI":22, "DHYANA":23, "TATWA":11,
    "TATTWA":17, "SUPUTRA":26, "DHARMATEJA":32, "DHARMAJAYA":33,
    "SATYAPRADIPA":52, "SURYABRATA":32, "WIRYA":31, "NAGENDRA":32,
    "BUDHA":18, "DIKSA":19, "SAMADHI":22, "VEDANTA":22, "SANATANA":22,
    "VIJAYANTA":30, "JAYENDRA":33, "UDAYA":16, "PRATAMA":25,
    "WIRADARMA":34, "WIRAWAN":26, "SUJANA":16, "SUMANTRA":22,
    "GUNAWAN":22, "MAHARSIKA":31, "RAJENDRA":31, "RATNAKARA":29,
    "GIRINDRA":53, "NAGASENA":22, "MAHASENA":22, "SENA":10,
    "KUMARA":20, "TANAYA":17, "PUTRA":22, "NANDANA":22, "JIWA":19,
    "SUKHA":14, "KSEMA":13, "SANTI":13,
    # Tambahan variasi baru
    "VIRA":19, "VARA":13, "VEDA":14, "VIDHI":26, "VIBHAVA":27,
    "VARADA":19, "VARCAS":21, "VIRAJA":20, "VIRENDRA":42, "VIBHU":22,
    "VAYU":14, "VASU":10, "VASUDA":14, "VASUKI":19, "VASANTA":14,
    "VARUNA":18, "VIKRAMA":27, "VIKRAMADITYA":42, "VIKRANTA":28,
    "VINAYA":25, "VINAYANA":29, "VIBUDHA":27, "VIBHUTI":30,
    "VAJRA":18, "VAJRAPANI":34, "VAJRAYUDHA":38,
    "UDAY":13, "UDAYANA":25, "UPENDRA":30, "URJA":16,
    "OJAS":10, "OJASVI":28,
    # Huruf K untuk Gemini
    "KAVI":19, "KAVYA":20, "KARMA":17, "KAMALA":16, "KANAKADHARA":37,
    "KARUNIKA":22, "KAURAVA":19, "KAUNTEYA":22,
    "KANAKA":14, "KARTIKA":24, "KARUNA":17, "KSHEMA":16,
}

# Cari semua kombinasi 2-3 kata yang memenuhi syarat MAKSIMAL
print("=== PENCARIAN NAMA OPTIMAL SEMUA SISTEM ===\n")
print("Target: Destiny 11 + No Karmic Debt + Min Karmic Lesson + Wariga 10/10 + Jyotisha ✓\n")

keys = list(kamus.keys())
hasil = []
seen = set()

# 2 kata
for i in range(len(keys)):
    for j in range(len(keys)):
        if i==j: continue
        k1,k2 = keys[i],keys[j]
        v1,v2 = kamus[k1],kamus[k2]
        nama = k1+" "+k2
        if rd(v1+v2) != 11: continue
        pair = tuple(sorted([k1,k2]))
        if pair in seen: continue
        seen.add(pair)
        if len(k1)<4 or len(k2)<4: continue
        r = full_analisis(nama)
        r['score'] = total_score(r)
        hasil.append(r)

# 3 kata (pilih tema utama)
tema = ["NAROTTAMA","DHARMA","VIDYA","PRAJNA","SATYA","VIJAYA","KIRANA",
        "ADNYANA","PRADIPA","WIRA","ARYA","ANANDA","BODHI","JNANA",
        "VIRA","UDAYANA","KAVI","KARMA"]
for t in tema:
    if t not in kamus: continue
    for j in range(len(keys)):
        for k_idx in range(len(keys)):
            k2,k3 = keys[j],keys[k_idx]
            if k2==t or k3==t or k2==k3: continue
            if len(t)<4 or len(k2)<4 or len(k3)<4: continue
            v = kamus.get(t,0)+kamus.get(k2,0)+kamus.get(k3,0)
            if rd(v) != 11: continue
            nama = t+" "+k2+" "+k3
            triple = tuple(sorted([t,k2,k3]))
            if triple in seen: continue
            seen.add(triple)
            r = full_analisis(nama)
            r['score'] = total_score(r)
            hasil.append(r)

# Sort by score
hasil.sort(key=lambda x: (-x['score'], len(x['missing'])))

print(f"Total kandidat Destiny 11 ditemukan: {len(hasil)}")
print(f"\n=== TOP 20 TERBAIK (SKOR TERTINGGI) ===\n")

for r in hasil[:20]:
    print(f"★ {r['nama']}")
    print(f"  Score={r['score']} | Destiny={r['destiny']} | Huruf={r['huruf']}")
    print(f"  KarmicDebt={'NIHIL ✓' if not r['kd'] else str(r['kd'])}")
    print(f"  KarmicLesson={r['missing'] if r['missing'] else 'NIHIL ✓'} ({len(r['missing'])} angka)")
    print(f"  Asta={r['asta']}({'✓' if r['asta_ok'] else '✗'}) Panca={r['panca']}({'✓' if r['panca_ok'] else '✗'}) Dasa={r['dasa']}({'✓' if r['dasa_ok'] else '✗'}) Wariga={r['wariga']}/10")
    print(f"  Jyotisha awal={r['jh_awal']} score={r['jyotisha']}/10")
    print()

# Filter SEMPURNA: wariga 10, no debt, maks 3 lesson
sempurna = [r for r in hasil if r['wariga']==10 and not r['kd'] and len(r['missing'])<=3]
print(f"\n=== SEMPURNA (Wariga 10/10 + No Debt + Max 3 Lesson): {len(sempurna)} kandidat ===")
for r in sempurna[:15]:
    print(f"  {r['nama']} | Score={r['score']} | Missing={r['missing']} | Jyot={r['jyotisha']}")

EOF
Output

=== PENCARIAN NAMA OPTIMAL SEMUA SISTEM ===

Target: Destiny 11 + No Karmic Debt + Min Karmic Lesson + Wariga 10/10 + Jyotisha ✓

Total kandidat Destiny 11 ditemukan: 13606

=== TOP 20 TERBAIK (SKOR TERTINGGI) ===

★ VIJAYA MOKSHA MANGGALA
  Score=100 | Destiny=11 | Huruf=20
  KarmicDebt=NIHIL ✓
  KarmicLesson=NIHIL ✓ (0 angka)
  Asta=4(✓) Panca=5(✓) Dasa=10(✓) Wariga=10/10
  Jyotisha awal=V score=2/10

★ BODHI SATYAJAYA KARUNIKA
  Score=100 | Destiny=11 | Huruf=22
  KarmicDebt=NIHIL ✓
  KarmicLesson=NIHIL ✓ (0 angka)
  Asta=6(✓) Panca=2(✓) Dasa=2(✓) Wariga=10/10
  Jyotisha awal=B score=2/10

★ BODHI GUNARSA SANTI
  Score=100 | Destiny=11 | Huruf=17
  KarmicDebt=NIHIL ✓
  KarmicLesson=NIHIL ✓ (0 angka)
  Asta=1(✓) Panca=2(✓) Dasa=7(✓) Wariga=10/10
  Jyotisha awal=B score=2/10

★ BODHI VIJAYANTA KARUNIKA
  Score=100 | Destiny=11 | Huruf=22
  KarmicDebt=NIHIL ✓
  KarmicLesson=NIHIL ✓ (0 angka)
  Asta=6(✓) Panca=2(✓) Dasa=2(✓) Wariga=10/10
  Jyotisha awal=B score=2/10

★ BODHI JAYENDRA KAURAVA
  Score=100 | Destiny=11 | Huruf=20
  KarmicDebt=NIHIL ✓
  KarmicLesson=NIHIL ✓ (0 angka)
  Asta=4(✓) Panca=5(✓) Dasa=10(✓) Wariga=10/10
  Jyotisha awal=B score=2/10

★ BODHI NAGASENA VIBHUTI
  Score=100 | Destiny=11 | Huruf=20
  KarmicDebt=NIHIL ✓
  KarmicLesson=NIHIL ✓ (0 angka)
  Asta=4(✓) Panca=5(✓) Dasa=10(✓) Wariga=10/10
  Jyotisha awal=B score=2/10

★ BODHI VASANTA VAJRAYUDHA
  Score=100 | Destiny=11 | Huruf=22
  KarmicDebt=NIHIL ✓
  KarmicLesson=NIHIL ✓ (0 angka)
  Asta=6(✓) Panca=2(✓) Dasa=2(✓) Wariga=10/10
  Jyotisha awal=B score=2/10

★ BODHI VIBHUTI KAUNTEYA
  Score=100 | Destiny=11 | Huruf=20
  KarmicDebt=NIHIL ✓
  KarmicLesson=NIHIL ✓ (0 angka)
  Asta=4(✓) Panca=5(✓) Dasa=10(✓) Wariga=10/10
  Jyotisha awal=B score=2/10

★ UDAYANA MOKSHA VIKRAMA
  Score=100 | Destiny=11 | Huruf=20
  KarmicDebt=NIHIL ✓
  KarmicLesson=NIHIL ✓ (0 angka)
  Asta=4(✓) Panca=5(✓) Dasa=10(✓) Wariga=10/10
  Jyotisha awal=U score=2/10

★ UDAYANA AMERTHA OJASVI
  Score=100 | Destiny=11 | Huruf=20
  KarmicDebt=NIHIL ✓
  KarmicLesson=NIHIL ✓ (0 angka)
  Asta=4(✓) Panca=5(✓) Dasa=10(✓) Wariga=10/10
  Jyotisha awal=U score=2/10

★ VIDYA KIRANA MOKSHA
  Score=96 | Destiny=11 | Huruf=17
  KarmicDebt=NIHIL ✓
  KarmicLesson=[3] (1 angka)
  Asta=1(✓) Panca=2(✓) Dasa=7(✓) Wariga=10/10
  Jyotisha awal=V score=2/10

★ VIDYA BUDHA VEDANTA
  Score=96 | Destiny=11 | Huruf=17
  KarmicDebt=NIHIL ✓
  KarmicLesson=[6] (1 angka)
  Asta=1(✓) Panca=2(✓) Dasa=7(✓) Wariga=10/10
  Jyotisha awal=V score=2/10

★ VIDYA BUDHA NANDANA
  Score=96 | Destiny=11 | Huruf=17
  KarmicDebt=NIHIL ✓
  KarmicLesson=[6] (1 angka)
  Asta=1(✓) Panca=2(✓) Dasa=7(✓) Wariga=10/10
  Jyotisha awal=V score=2/10

★ VIDYA SANTI VIBUDHA
  Score=96 | Destiny=11 | Huruf=17
  KarmicDebt=NIHIL ✓
  KarmicLesson=[6] (1 angka)
  Asta=1(✓) Panca=2(✓) Dasa=7(✓) Wariga=10/10
  Jyotisha awal=V score=2/10

★ VIJAYA MOKSHA TATWA
  Score=96 | Destiny=11 | Huruf=17
  KarmicDebt=NIHIL ✓
  KarmicLesson=[3] (1 angka)
  Asta=1(✓) Panca=2(✓) Dasa=7(✓) Wariga=10/10
  Jyotisha awal=V score=2/10

★ VIJAYA PARAMARTHA SUMANTRA
  Score=96 | Destiny=11 | Huruf=24
  KarmicDebt=NIHIL ✓
  KarmicLesson=[6] (1 angka)
  Asta=8(✓) Panca=4(✓) Dasa=4(✓) Wariga=10/10
  Jyotisha awal=V score=2/10

★ VIJAYA PARAMARTHA KAUNTEYA
  Score=96 | Destiny=11 | Huruf=24
  KarmicDebt=NIHIL ✓
  KarmicLesson=[6] (1 angka)
  Asta=8(✓) Panca=4(✓) Dasa=4(✓) Wariga=10/10
  Jyotisha awal=V score=2/10

★ VIJAYA BODHI RATNAKARA
  Score=96 | Destiny=11 | Huruf=20
  KarmicDebt=NIHIL ✓
  KarmicLesson=[3] (1 angka)
  Asta=4(✓) Panca=5(✓) Dasa=10(✓) Wariga=10/10
  Jyotisha awal=V score=2/10

★ KIRANA MOKSHA WIRAJAYA
  Score=96 | Destiny=11 | Huruf=20
  KarmicDebt=NIHIL ✓
  KarmicLesson=[3] (1 angka)
  Asta=4(✓) Panca=5(✓) Dasa=10(✓) Wariga=10/10
  Jyotisha awal=K score=2/10

★ KIRANA AMERTHA SUPUTRA
  Score=96 | Destiny=11 | Huruf=20
  KarmicDebt=NIHIL ✓
  KarmicLesson=[6] (1 angka)
  Asta=4(✓) Panca=5(✓) Dasa=10(✓) Wariga=10/10
  Jyotisha awal=K score=2/10


=== SEMPURNA (Wariga 10/10 + No Debt + Max 3 Lesson): 2571 kandidat ===
  VIJAYA MOKSHA MANGGALA | Score=100 | Missing=[] | Jyot=2
  BODHI SATYAJAYA KARUNIKA | Score=100 | Missing=[] | Jyot=2
  BODHI GUNARSA SANTI | Score=100 | Missing=[] | Jyot=2
  BODHI VIJAYANTA KARUNIKA | Score=100 | Missing=[] | Jyot=2
  BODHI JAYENDRA KAURAVA | Score=100 | Missing=[] | Jyot=2
  BODHI NAGASENA VIBHUTI | Score=100 | Missing=[] | Jyot=2
  BODHI VASANTA VAJRAYUDHA | Score=100 | Missing=[] | Jyot=2
  BODHI VIBHUTI KAUNTEYA | Score=100 | Missing=[] | Jyot=2
  UDAYANA MOKSHA VIKRAMA | Score=100 | Missing=[] | Jyot=2
  UDAYANA AMERTHA OJASVI | Score=100 | Missing=[] | Jyot=2
  VIDYA KIRANA MOKSHA | Score=96 | Missing=[3] | Jyot=2
  VIDYA BUDHA VEDANTA | Score=96 | Missing=[6] | Jyot=2
  VIDYA BUDHA NANDANA | Score=96 | Missing=[6] | Jyot=2
  VIDYA SANTI VIBUDHA | Score=96 | Missing=[6] | Jyot=2
  VIJAYA MOKSHA TATWA | Score=96 | Missing=[3] | Jyot=2

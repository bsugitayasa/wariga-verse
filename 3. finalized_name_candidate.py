python3 << 'EOF'
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

neptu_huruf = {
    'A':1,'I':1,'U':2,'E':3,'O':1,
    'B':2,'C':3,'D':4,'G':5,'H':6,'J':4,'K':6,'L':6,
    'M':4,'N':5,'P':7,'R':4,'S':6,'T':4,'W':6,'Y':1,
    'V':8,'F':8,'Z':8,'X':6,'Q':8
}
def neptu(n):
    t = sum(neptu_huruf.get(c,0) for c in n.upper().replace(' ',''))
    return t, rd(t)

# CHALDEAN
chald = {
    'A':1,'B':2,'C':3,'D':4,'E':5,'F':8,'G':3,'H':5,'I':1,
    'J':1,'K':2,'L':3,'M':4,'N':5,'O':7,'P':8,'Q':1,'R':2,
    'S':3,'T':4,'U':6,'V':6,'W':6,'X':5,'Y':1,'Z':7
}
def cv(n): return sum(chald.get(c,0) for c in n.upper().replace(' ',''))

def full(nama):
    kata = nama.split()
    total_p = sum(pv(k) for k in kata)
    dest = rd(total_p)
    hc = len(nama.replace(' ',''))

    # Karmic Debt
    kd = []
    for k in kata:
        v = pv(k)
        if v in (13,14,16,19): kd.append((k,v))
    if total_p in (13,14,16,19): kd.append(('TOT',total_p))
    t2=total_p
    while t2>9:
        if t2 in (11,22,33): break
        if t2 in (13,14,16,19): kd.append(('STEP',t2))
        t2=sum(int(d) for d in str(t2))

    # Karmic Lesson
    semua=set()
    for c in nama.upper().replace(' ',''):
        if c in pyth: semua.add(pyth[c])
    missing=[i for i in range(1,10) if i not in semua]

    # Wariga
    asta=(hc%8) or 8; panca=(hc%5) or 5; dasa=(hc%10) or 10
    asta_ok=asta not in(3,5); panca_ok=panca not in(1,3); dasa_ok=dasa not in(1,5,6)
    ws=(3 if asta_ok else 0)+(4 if panca_ok else 0)+(3 if dasa_ok else 0)

    # Neptu
    nept, nept_r = neptu(nama)

    # Chaldean
    tc = sum(cv(k) for k in kata)
    dest_c = rd(tc)

    # Soul/Personality
    vowels='AEIOU'
    v_sum = sum(pyth.get(c,0) for c in nama.upper().replace(' ','') if c in vowels)
    con_sum = sum(pyth.get(c,0) for c in nama.upper().replace(' ','') if c not in vowels and c.isalpha())
    soul = rd(v_sum); pers = rd(con_sum)

    return {
        'nama':nama,'hc':hc,'destiny':dest,'dest_c':dest_c,
        'kd':kd,'missing':missing,'semua':sorted(semua),
        'asta':asta,'panca':panca,'dasa':dasa,
        'ao':asta_ok,'po':panca_ok,'do':dasa_ok,'ws':ws,
        'nept':nept,'nept_r':nept_r,
        'soul':soul,'pers':pers,'vsum':v_sum,'csum':con_sum,
        'total_p':total_p,'total_c':tc
    }

# Kandidat final terpilih — yang bermakna INDAH & layak direkomendasikan
# Dari 2571 kandidat sempurna, kurasi manual berdasarkan:
# 1. Makna Sanskrit/Bali mulia (bukan nama asing aneh)
# 2. Bunyi harmonis & maskulin
# 3. Tidak ada nama dewata
# 4. Panggilan enak

finalis = [
    "VIJAYA MOKSHA MANGGALA",   # Kemenangan-Moksha-Berkah → skor 100
    "VIDYA KIRANA MOKSHA",      # Ilmu-Cahaya-Pembebasan → skor 96, 1 lesson
    "VIJAYA MOKSHA TATWA",      # Kemenangan-Pembebasan-Hakikat → skor 96, 1 lesson
    "VIJAYA BODHI RATNAKARA",   # Kemenangan-Pencerahan-Sumber Permata → skor 96
    "KIRANA MOKSHA WIRAJAYA",   # Cahaya-Moksha-Ksatria Menang → skor 96
    "VIDYA BUDHA NANDANA",      # Ilmu-Bijaksana-Kegembiraan → skor 96
    "NAROTTAMA VIDYA",          # (lama, skor Wariga 10!) → cek ulang
    "VIJAYA PARAMARTHA SUMANTRA",# Kemenangan-Kebenaran Tertinggi-Penasehat Bijak
    "UDAYANA MOKSHA VIKRAMA",   # Udayana(raja Bali!)-Moksha-Perkasa
    "VIRA TATWA JIWADHANA",     # Ksatria-Hakikat-Kekayaan Jiwa → cek
]

# Verifikasi ulang NAROTTAMA VIDYA
r = full("NAROTTAMA VIDYA")
print(f"NAROTTAMA VIDYA: hc={r['hc']}, asta={r['asta']}, panca={r['panca']}, dasa={r['dasa']}, ws={r['ws']}")
print()

for nama in finalis:
    r = full(nama)
    print(f"{'='*55}")
    print(f"NAMA: {nama}")
    print(f"Huruf: {r['hc']} | Dest(Pyth)={r['destiny']} | Dest(Chald)={r['dest_c']}")
    print(f"Soul Urge: {r['vsum']}→{r['soul']} | Personality: {r['csum']}→{r['pers']}")

    print(f"\nKarmic Debt: {'NIHIL ✓' if not r['kd'] else str(r['kd'])}")
    print(f"Karmic Lesson (missing): {r['missing'] if r['missing'] else 'NIHIL ✓'}")
    print(f"Angka muncul: {r['semua']}")

    asta_n={1:'Langgeng',2:'Ayu',3:'Duka',4:'Sri',5:'Pati',6:'Suka',7:'Brahma',8:'Kerta'}
    panca_n={1:'Pati',2:'Suka',3:'Duka',4:'Sri',5:'Manggeh'}
    dasa_n={1:'Werdha',2:'Ayu',3:'Brahma',4:'Indra',5:'Pati',6:'Buta',7:'Sri',8:'Hayu',9:'Dewa',10:'Nirmala'}

    print(f"\nWARIGA:")
    print(f"  Asta Dauh : {r['asta']} = {asta_n.get(r['asta'],'?')} {'✓' if r['ao'] else '✗'}")
    print(f"  Panca Dauh: {r['panca']} = {panca_n.get(r['panca'],'?')} {'✓' if r['po'] else '✗'}")
    print(f"  Dasa Dauh : {r['dasa']} = {dasa_n.get(r['dasa'],'?')} {'✓' if r['do'] else '✗'}")
    print(f"  Skor Wariga: {r['ws']}/10")

    print(f"\nNeptu Nama: {r['nept']} → {r['nept_r']}")
    print(f"Jyotisha awal: {nama[0]} → {'✓ Taurus/Gemini' if nama[0] in 'VBKGUEOI' else '— Netral'}")
    print()

EOF
Output

NAROTTAMA VIDYA: hc=14, asta=6, panca=4, dasa=4, ws=10

=======================================================
NAMA: VIJAYA MOKSHA MANGGALA
Huruf: 20 | Dest(Pyth)=11 | Dest(Chald)=9
Soul Urge: 21→3 | Personality: 53→8

Karmic Debt: NIHIL ✓
Karmic Lesson (missing): NIHIL ✓
Angka muncul: [1, 2, 3, 4, 5, 6, 7, 8, 9]

WARIGA:
  Asta Dauh : 4 = Sri ✓
  Panca Dauh: 5 = Manggeh ✓
  Dasa Dauh : 10 = Nirmala ✓
  Skor Wariga: 10/10

Neptu Nama: 68 → 5
Jyotisha awal: V → ✓ Taurus/Gemini

=======================================================
NAMA: VIDYA KIRANA MOKSHA
Huruf: 17 | Dest(Pyth)=11 | Dest(Chald)=11
Soul Urge: 28→1 | Personality: 46→1

Karmic Debt: NIHIL ✓
Karmic Lesson (missing): [3]
Angka muncul: [1, 2, 4, 5, 6, 7, 8, 9]

WARIGA:
  Asta Dauh : 1 = Langgeng ✓
  Panca Dauh: 2 = Suka ✓
  Dasa Dauh : 7 = Sri ✓
  Skor Wariga: 10/10

Neptu Nama: 57 → 3
Jyotisha awal: V → ✓ Taurus/Gemini

=======================================================
NAMA: VIJAYA MOKSHA TATWA
Huruf: 17 | Dest(Pyth)=11 | Dest(Chald)=4
Soul Urge: 20→2 | Personality: 36→9

Karmic Debt: NIHIL ✓
Karmic Lesson (missing): [3]
Angka muncul: [1, 2, 4, 5, 6, 7, 8, 9]

WARIGA:
  Asta Dauh : 1 = Langgeng ✓
  Panca Dauh: 2 = Suka ✓
  Dasa Dauh : 7 = Sri ✓
  Skor Wariga: 10/10

Neptu Nama: 56 → 11
Jyotisha awal: V → ✓ Taurus/Gemini

=======================================================
NAMA: VIJAYA BODHI RATNAKARA
Huruf: 20 | Dest(Pyth)=11 | Dest(Chald)=4
Soul Urge: 30→3 | Personality: 53→8

Karmic Debt: NIHIL ✓
Karmic Lesson (missing): [3]
Angka muncul: [1, 2, 4, 5, 6, 7, 8, 9]

WARIGA:
  Asta Dauh : 4 = Sri ✓
  Panca Dauh: 5 = Manggeh ✓
  Dasa Dauh : 10 = Nirmala ✓
  Skor Wariga: 10/10

Neptu Nama: 57 → 3
Jyotisha awal: V → ✓ Taurus/Gemini

=======================================================
NAMA: KIRANA MOKSHA WIRAJAYA
Huruf: 20 | Dest(Pyth)=11 | Dest(Chald)=3
Soul Urge: 30→3 | Personality: 53→8

Karmic Debt: NIHIL ✓
Karmic Lesson (missing): [3]
Angka muncul: [1, 2, 4, 5, 6, 7, 8, 9]

WARIGA:
  Asta Dauh : 4 = Sri ✓
  Panca Dauh: 5 = Manggeh ✓
  Dasa Dauh : 10 = Nirmala ✓
  Skor Wariga: 10/10

Neptu Nama: 61 → 7
Jyotisha awal: K → ✓ Taurus/Gemini

=======================================================
NAMA: VIDYA BUDHA NANDANA
Huruf: 17 | Dest(Pyth)=11 | Dest(Chald)=8
Soul Urge: 17→8 | Personality: 48→3

Karmic Debt: NIHIL ✓
Karmic Lesson (missing): [6]
Angka muncul: [1, 2, 3, 4, 5, 7, 8, 9]

WARIGA:
  Asta Dauh : 1 = Langgeng ✓
  Panca Dauh: 2 = Suka ✓
  Dasa Dauh : 7 = Sri ✓
  Skor Wariga: 10/10

Neptu Nama: 52 → 7
Jyotisha awal: V → ✓ Taurus/Gemini

=======================================================
NAMA: NAROTTAMA VIDYA
Huruf: 14 | Dest(Pyth)=11 | Dest(Chald)=6
Soul Urge: 19→1 | Personality: 37→1

Karmic Debt: NIHIL ✓
Karmic Lesson (missing): [3, 8]
Angka muncul: [1, 2, 4, 5, 6, 7, 9]

WARIGA:
  Asta Dauh : 6 = Suka ✓
  Panca Dauh: 4 = Sri ✓
  Dasa Dauh : 4 = Indra ✓
  Skor Wariga: 10/10

Neptu Nama: 40 → 4
Jyotisha awal: N → — Netral

=======================================================
NAMA: VIJAYA PARAMARTHA SUMANTRA
Huruf: 24 | Dest(Pyth)=11 | Dest(Chald)=3
Soul Urge: 20→2 | Personality: 72→9

Karmic Debt: NIHIL ✓
Karmic Lesson (missing): [6]
Angka muncul: [1, 2, 3, 4, 5, 7, 8, 9]

WARIGA:
  Asta Dauh : 8 = Kerta ✓
  Panca Dauh: 4 = Sri ✓
  Dasa Dauh : 4 = Indra ✓
  Skor Wariga: 10/10

Neptu Nama: 76 → 4
Jyotisha awal: V → ✓ Taurus/Gemini

=======================================================
NAMA: UDAYANA MOKSHA VIKRAMA
Huruf: 20 | Dest(Pyth)=11 | Dest(Chald)=4
Soul Urge: 24→6 | Personality: 50→5

Karmic Debt: NIHIL ✓
Karmic Lesson (missing): NIHIL ✓
Angka muncul: [1, 2, 3, 4, 5, 6, 7, 8, 9]

WARIGA:
  Asta Dauh : 4 = Sri ✓
  Panca Dauh: 5 = Manggeh ✓
  Dasa Dauh : 10 = Nirmala ✓
  Skor Wariga: 10/10

Neptu Nama: 64 → 1
Jyotisha awal: U → ✓ Taurus/Gemini

=======================================================
NAMA: VIRA TATWA JIWADHANA
Huruf: 18 | Dest(Pyth)=6 | Dest(Chald)=6
Soul Urge: 24→6 | Personality: 45→9

Karmic Debt: NIHIL ✓
Karmic Lesson (missing): [3, 6, 7]
Angka muncul: [1, 2, 4, 5, 8, 9]

WARIGA:
  Asta Dauh : 2 = Ayu ✓
  Panca Dauh: 3 = Duka ✗
  Dasa Dauh : 8 = Hayu ✓
  Skor Wariga: 6/10

Neptu Nama: 59 → 5
Jyotisha awal: V → ✓ Taurus/Gemini

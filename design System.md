# 🎞️ Rona Masa: Design System Bertema "Kenangan"

> *"Setiap warna punya cerita, dan setiap sudut menyimpan rindu."*
> 
> **Rona Masa** adalah sistem desain (Design System) yang dirancang untuk membangkitkan rasa hangat, nostalgik, dan intim. Menggabungkan kontras warna yang berani antara **Hijau Daun Muda (`#76C457`)** dan **Merah Segel Klasik (`#BC0202`)**, sistem ini menjembatani masa lalu dan masa kini melalui estetika jurnal analog, cetakan foto era 90-an, dan editorial klasik.

---

## 🎨 1. Filosofi & Palet Warna (Color Palette)

Memadukan `#76C457` (hijau cerah) dan `#BC0202` (merah pekat) memiliki tantangan tersendiri agar tidak terlihat seperti dekorasi hari raya. Kunci dari tema **Kenangan** adalah **mengubah latar belakang putih murni menjadi warna Kertas Usang (Warm Cream)** dan menggunakan **Hitam Arang** sebagai penyeimbang.

### Warna Utama (Primary & Accent)
| Peran Warna | Nama Nostalgik | Kode Hex | Penggunaan & Makna Emosional |
| :--- | :--- | :--- | :--- |
| **Primary** | **Rerumputan Sore** | `#76C457` | Melambangkan masa muda, pertumbuhan, dan halaman rumah tempat bermain dulu. Digunakan untuk elemen segar, *highlight*, dan status sukses/aktif. |
| **Secondary / Accent** | **Segel Surat** | `#BC0202` | Melambangkan emosi yang dalam, tinta stempel pos, lampu kamar gelap pencetak foto, dan kenangan yang membekas kuat. Digunakan untuk *Call to Action* (CTA) penting, cap/label, dan penekanan emosional. |

### Warna Netral Penyeimbang (The Nostalgic Canvas)
*Jangan gunakan putih murni (`#FFFFFF`) atau hitam pekat (`#000000`). Gunakan warna di bawah ini untuk mengikat warna hijau dan merah agar terasa hangat:*

| Peran Warna | Nama Nostalgik | Kode Hex | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Background Primary** | **Kertas Buku Harian** | `#F9F6F0` | Latar belakang utama halaman. Memberikan kesan hangat seperti kertas novel lama. |
| **Background Surface** | **Bingkai Polaroid** | `#EFECE6` | Latar belakang untuk *Card*, kotak dialog, atau bingkai foto. |
| **Text Primary** | **Tinta Mesin Ketik** | `#2C2623` | Warna teks utama. Hitam kecokelatan yang lembut di mata. |
| **Text Muted** | **Abu Memori** | `#7A7267` | Teks sekunder, keterangan waktu (*timestamp*), dan *caption* foto. |

### Aturan Proporsi Warna (Aturan 60-30-10)
1. **70% Netral (`#F9F6F0` & `#2C2623`):** Biarkan ruang bernapas seperti halaman album foto.
2. **20% Hijau Rerumputan (`#76C457`):** Sebagai aksen visual, *badge*, ilustrasi pendukung, atau *border* dekoratif.
3. **10% Merah Segel (`#BC0202`):** Sebagai titik fokus utama (Tombol aksi utama, ikon hati/favorit, penanda tanggal penting).

---

## ✒️ 2. Tipografi (The Dual-Font Harmony)

Untuk menciptakan nuansa kenangan yang autentik, kita mencampurkan **Font Serif Klasik yang Puitis** (mewakili cerita dan perasaan) dengan **Font Monospace / Typewriter** (mewakili waktu, tanggal, dan catatan arsip).

### Kombinasi Font yang Direkomendasikan:
1. **Heading & Cerita: `Fraunces` atau `Playfair Display` (Serif)**
   * *Karakter:* Hangat, memiliki lekukan klasik era 70-an/80-an, terasa seperti judul buku cerita lama atau majalah lawas.
   * *Kesan:* Emosional, puitis, dan elegan.
2. **Body, Tanggal & Label: `Courier Prime` atau `Space Mono` (Monospace) / `Plus Jakarta Sans` (Untuk teks panjang)**
   * *Karakter:* Seperti ketikan mesin tik atau cetakan tanggal di pojok foto analog (`'98 10 24`).
   * *Kesan:* Autentik, personal, dan dokumentatif.

### Skala Tipografi (Typography Scale)

| Elemen | Font Family | Ukuran (rem/px) | Weight / Style | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `Fraunces` | `3.0rem` (48px) | Bold / *Italic* | Judul halaman utama atau kutipan kenangan pembuka. |
| **Heading 1 (H1)** | `Fraunces` | `2.25rem` (36px) | Semi-Bold | Judul bab atau nama album kenangan. |
| **Heading 2 (H2)** | `Fraunces` | `1.5rem` (24px) | Medium | Judul kartu cerita (*Story Card*). |
| **Body Text** | `Plus Jakarta Sans` | `1.0rem` (16px) | Regular (Line-height 1.6) | Paragraf cerita agar tetap nyaman dibaca di layar modern. |
| **Caption & Meta** | `Space Mono` | `0.875rem` (14px) | Regular / Uppercase | Tanggal kejadian, lokasi, nomor arsip, dan label tombol. |

> 💡 **Tips Styling Tipografi:** Gunakan gaya *Italic* pada kata-kata emosional di dalam Judul, dan beri garis bawah berwarna `#76C457` atau teks berwarna `#BC0202`.

---

## 🧩 3. Komponen Utama (UI Components)

### A. Tombol (Buttons)
Tombol tidak menggunakan bayangan kabur (*blurry shadows*), melainkan **bayangan tegas (*hard offset shadow*)** seperti potongan kertas atau perangko.

* **Primary Button (Simpan Kenangan):**
  * Background: `#BC0202` (Merah Segel)
  * Teks: `#F9F6F0` (Kertas Buku Harian) - Font `Space Mono`
  * Border: `2px solid #2C2623`
  * Shadow: `4px 4px 0px #2C2623` (Bergeser saat di-*hover*)
* **Secondary Button (Lihat Arsip):**
  * Background: `#76C457` (Hijau Rerumputan)
  * Teks: `#2C2623` (Tinta Mesin Ketik) — *Penting: Gunakan teks gelap di atas `#76C457` agar kontras keterbacaan (WCAG) sangat baik!*
  * Border: `2px solid #2C2623`
  * Shadow: `4px 4px 0px #2C2623`

### B. Kartu Memori (Polaroid / Story Card)
* **Wadah:** Background `#EFECE6`, padding bawah lebih lebar (`24px`) dibanding atas/samping (`12px`) menyerupai bingkai foto Polaroid.
* **Sudut (Border Radius):** `4px` (Jangan terlalu bulat agar terasa seperti cetakan kertas fisik).
* **Aksen:** Tambahkan elemen visual seperti selotip (*washi tape*) berwarna `#76C457` (dengan *opacity* 80%) di bagian atas kartu, atau ikon stempel `#BC0202` di pojok kanan bawah.

### C. Badge & Tag Waktu
* Menggunakan font `Space Mono`.
* Contoh: `[ 24 OKT 1999 ]` dengan latar `#76C457` dan teks `#2C2623`, atau gaya stempel berbingkai `#BC0202` dengan teks `#BC0202`.

---

## ✨ 4. Tekstur, Ilustrasi & Efek Visual

Agar tema "Kenangan" benar-benar hidup:
1. **Efek Grain / Noise Halus:** Lapisi seluruh latar belakang dengan tekstur *noise* tipis (opacity 3-5%) untuk menghilangkan kesan layar digital yang terlalu licin.
2. **Filter Foto:** Foto yang diunggah ke dalam sistem sebaiknya memiliki sedikit sentuhan *warm tint* (agak kekuningan) dengan kontras yang lembut.
3. **Garis Pembatas (Dividers):** Gunakan garis putus-putus (`dashed border`) seperti sobekan tiket bioskop lama atau garis buku tulis.

---

## 💻 5. Implementasi Kode (CSS Variables)

Salin potongan kode CSS berikut untuk langsung memulai proyek Anda:

```css
/* Import Google Fonts: Fraunces (Serif), Plus Jakarta Sans (Body), Space Mono (Meta) */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Plus+Jakarta+Sans:wght@400;500;600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

:root {
  /* Core Brand Colors (Sesuai Permintaan) */
  --color-memory-green: #76C457;
  --color-wax-red: #BC0202;

  /* Supporting Tones (Untuk Hover & Background lembut) */
  --color-memory-green-soft: #E5F5DF;
  --color-wax-red-soft: #FBE6E6;

  /* Nostalgic Neutrals */
  --bg-paper: #F9F6F0;
  --bg-polaroid: #EFECE6;
  --text-ink: #2C2623;
  --text-muted: #7A7267;

  /* Typography */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Plus Jakarta Sans', -apple-system, sans-serif;
  --font-mono: 'Space Mono', monospace;

  /* Borders & Retro Shadows */
  --border-ink: 1.5px solid var(--text-ink);
  --shadow-retro: 4px 4px 0px var(--text-ink);
  --radius-paper: 4px;
}

body {
  background-color: var(--bg-paper);
  color: var(--text-ink);
  font-family: var(--font-body);
  line-height: 1.6;
}

h1, h2, h3, .serif-quote {
  font-family: var(--font-display);
  font-weight: 600;
}

/* Contoh Penggunaan Komponen Tombol */
.btn-kenangan-utama {
  background-color: var(--color-wax-red);
  color: var(--bg-paper);
  font-family: var(--font-mono);
  padding: 10px 20px;
  border: var(--border-ink);
  border-radius: var(--radius-paper);
  box-shadow: var(--shadow-retro);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-kenangan-utama:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--text-ink);
}

.badge-waktu {
  background-color: var(--color-memory-green);
  color: var(--text-ink);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 4px 10px;
  border: var(--border-ink);
  border-radius: 2px;
}
```
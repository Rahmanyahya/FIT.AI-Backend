# FitAI – Asisten Nutrisi Cerdas Berbasis AI 🍽️🤖

**FitAI** adalah aplikasi berbasis kecerdasan buatan yang memberikan rekomendasi makanan secara otomatis sesuai dengan tujuan pengguna: bulking, cutting, atau maintenance. Cukup dengan mengisi data dasar seperti berat badan, tinggi, umur, dan frekuensi olahraga, pengguna akan mendapatkan menu harian yang sesuai kebutuhan nutrisi mereka.

---

## 🚀 Fitur Utama

- Perhitungan kebutuhan kalori & makronutrien otomatis
- Rekomendasi menu harian berbasis AI
- Personalisasi berdasarkan preferensi makanan, alergi, dan budget
- Didukung oleh algoritma genetika untuk hasil optimal

---

## 🧠 Teknologi yang Digunakan

- **Backend:** Node.js / Python (bisa disesuaikan)
- **AI Engine:** Algoritma Genetika untuk pemilihan menu terbaik
- **Database:** MongoDB / PostgreSQL (untuk menyimpan makanan & user profile)
- **Frontend:** Next Js
- **Deployment:** Vercel / Netlify (untuk frontend), Docker / VPS (backend)

---

## 🛠️ Cara Menjalankan Proyek Ini
```bash
git clone https://github.com/username/fitai.git
cd fitai

touch .env

vim .env

## Tambahkan variabel ini
DATABASE_URL=
LLM_URL=
JWT_SECRET=
ALGHORITH=
SECRET_KEY=
PORT=

npm run build

npm start

## atau kamu dapat menggunakan docker
docker build -t <image name> .

docker run -d -p yourport:containerport <image name> <container name>


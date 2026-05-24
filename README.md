# DocID Classifier — Sistem Klasifikasi Dokumen Identitas

Sistem web app klasifikasi dokumen identitas (KTP, SIM, Paspor, Other) menggunakan Deep Learning dengan arsitektur MobileNetV2 + Transfer Learning.

---

## Struktur Folder

```
document-classifier/
├── backend/
│   ├── main.py                 ← FastAPI app + endpoint /predict
│   ├── requirements.txt        ← Dependency Python
│   └── model/
│       └── .gitkeep            ← Letakkan file .keras di sini
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx      ← Navbar + status API
│   │   │   ├── UploadZone.jsx  ← Drag & drop upload
│   │   │   ├── ResultCard.jsx  ← Tampilan hasil prediksi
│   │   │   └── HistoryPanel.jsx← Riwayat klasifikasi
│   │   ├── App.jsx             ← Main component
│   │   ├── main.jsx            ← Entry point React
│   │   └── index.css           ← Global styles + Tailwind
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## Setup Backend

### 1. Masuk ke folder backend
```bash
cd backend
```

### 2. Buat virtual environment (recommended)
```bash
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Letakkan model
Salin file `model_klasifikasi_dokumen_kelompok10.keras` ke dalam folder `backend/model/`

```
backend/model/model_klasifikasi_dokumen_kelompok10.keras
```

### 5. Jalankan server
```bash
uvicorn main:app --reload --port 8000
```

Server berjalan di: http://localhost:8000
Dokumentasi API: http://localhost:8000/docs

---

## Setup Frontend

### 1. Masuk ke folder frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Jalankan development server
```bash
npm run dev
```

App berjalan di: http://localhost:3000

---

## Cara Pakai

1. Pastikan backend sudah jalan di port 8000
2. Buka browser ke http://localhost:3000
3. Upload foto dokumen (JPG/PNG/WEBP, maks 10MB)
4. Hasil klasifikasi muncul otomatis dengan confidence score

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | Status server |
| GET | `/health` | Health check + model status |
| POST | `/predict` | Klasifikasi dokumen (multipart/form-data) |

### Contoh Response /predict
```json
{
  "success": true,
  "prediction": {
    "class": "KTP",
    "label": "Kartu Tanda Penduduk",
    "icon": "🪪",
    "confidence": 99.82,
    "confidence_level": "Sangat Tinggi"
  },
  "all_confidences": {
    "KTP": 99.82,
    "Other": 0.10,
    "Passport": 0.05,
    "SIM": 0.03
  },
  "file_info": {
    "filename": "foto_ktp.jpg",
    "size_kb": 234.5,
    "type": "image/jpeg"
  },
  "process_time_ms": 145.23
}
```

---

## Deploy ke Hugging Face Spaces (Gratis)

### Backend
1. Buat Space baru di huggingface.co/spaces
2. Pilih SDK: **Docker**
3. Upload file backend + tambahkan `Dockerfile`

### Frontend
1. Build React: `npm run build`
2. Upload folder `dist/` ke Space atau Netlify/Vercel

---

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI + Uvicorn
- **Model**: TensorFlow/Keras · MobileNetV2
- **Deployment**: Hugging Face Spaces / Railway / Render

---

Dibuat oleh: Zayyandra Rajel Ahsan — 2355301208 · 3TIF · Politeknik Caltex Riau

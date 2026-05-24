import os
import sys
import json
import zipfile
import logging

os.environ["PYTHONIOENCODING"]     = "utf-8"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
logging.getLogger("tensorflow").setLevel(logging.ERROR)
logging.getLogger("absl").setLevel(logging.ERROR)

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
import keras
from PIL import Image
import io
import time
import hashlib
from datetime import datetime, timedelta
from collections import OrderedDict
from contextlib import redirect_stdout

app = FastAPI(
    title="DocID Classifier API",
    description="API untuk klasifikasi dokumen identitas: KTP, SIM, Paspor, Other",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH        = "model/model_klasifikasi_dokumen_kelompok10.keras"
MODEL_PATCHED     = "model/model_patched.keras"
IMG_SIZE          = (224, 224)
CLASS_NAMES       = ["KTP", "Other", "Passport", "SIM"]
CLASS_LABELS      = {
    "KTP":      "Kartu Tanda Penduduk",
    "SIM":      "Surat Izin Mengemudi",
    "Passport": "Paspor",
    "Other":    "Dokumen Lainnya"
}
CLASS_ICONS = {
    "KTP": "🪪", "SIM": "🚗", "Passport": "📘", "Other": "📄"
}

CACHE_MAX_SIZE    = 100
CACHE_TTL_MINUTES = 60


def patch_config(obj):
    if isinstance(obj, dict):
        obj.pop('quantization_config', None)
        for v in obj.values():
            patch_config(v)
    elif isinstance(obj, list):
        for item in obj:
            patch_config(item)


def create_patched_model():
    if os.path.exists(MODEL_PATCHED):
        return
    print("🔧 Patching model config...")
    with zipfile.ZipFile(MODEL_PATH, 'r') as zin:
        with zipfile.ZipFile(MODEL_PATCHED, 'w', zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename == 'config.json':
                    config = json.loads(zin.read(item.filename).decode('utf-8'))
                    patch_config(config)
                    zout.writestr(item, json.dumps(config))
                else:
                    zout.writestr(item, zin.read(item.filename))
    print("✅ Patching selesai")


class PredictionCache:
    def __init__(self, max_size: int, ttl_minutes: int):
        self.max_size = max_size
        self.ttl      = timedelta(minutes=ttl_minutes)
        self._store: OrderedDict = OrderedDict()
        self.hits   = 0
        self.misses = 0

    def _make_key(self, file_bytes: bytes) -> str:
        return hashlib.md5(file_bytes).hexdigest()

    def get(self, file_bytes: bytes):
        key = self._make_key(file_bytes)
        if key not in self._store:
            self.misses += 1
            return None
        entry, created_at = self._store[key]
        if datetime.utcnow() - created_at > self.ttl:
            del self._store[key]
            self.misses += 1
            return None
        self._store.move_to_end(key)
        self.hits += 1
        return entry

    def set(self, file_bytes: bytes, result: dict):
        key = self._make_key(file_bytes)
        if key in self._store:
            self._store.move_to_end(key)
            self._store[key] = (result, datetime.utcnow())
            return
        if len(self._store) >= self.max_size:
            self._store.popitem(last=False)
        self._store[key] = (result, datetime.utcnow())

    def clear(self):
        self._store.clear()
        self.hits   = 0
        self.misses = 0

    def stats(self) -> dict:
        total = self.hits + self.misses
        return {
            "entries":      len(self._store),
            "max_size":     self.max_size,
            "ttl_minutes":  int(self.ttl.total_seconds() / 60),
            "hits":         self.hits,
            "misses":       self.misses,
            "hit_rate_pct": round(self.hits / total * 100, 1) if total else 0.0,
        }


cache = PredictionCache(max_size=CACHE_MAX_SIZE, ttl_minutes=CACHE_TTL_MINUTES)
model = None


@app.on_event("startup")
async def load_model():
    global model
    if not os.path.exists(MODEL_PATH):
        print(f"⚠️  Model tidak ditemukan di {MODEL_PATH}", flush=True)
        return
    try:
        create_patched_model()
        with open(os.devnull, "w") as devnull:
            with redirect_stdout(devnull):
                model = keras.models.load_model(MODEL_PATCHED, compile=False)
        print(f"✅ Model berhasil dimuat", flush=True)
    except Exception as e:
        print(f"❌ Gagal memuat model: {e}", flush=True)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)


@app.get("/")
async def root():
    return {
        "status":       "running",
        "message":      "DocID Classifier API aktif",
        "model_loaded": model is not None,
        "cache":        cache.stats()
    }


@app.get("/health")
async def health_check():
    return {
        "status":       "ok",
        "model_loaded": model is not None,
        "classes":      CLASS_NAMES,
        "cache":        cache.stats()
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model belum dimuat.")

    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Format tidak didukung: {file.content_type}"
        )

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ukuran file maksimal 10MB")

    cached = cache.get(contents)
    if cached is not None:
        cached["file_info"]["filename"] = file.filename
        cached["file_info"]["size_kb"]  = round(len(contents) / 1024, 2)
        cached["file_info"]["type"]     = file.content_type
        cached["from_cache"]            = True
        return JSONResponse(cached)

    try:
        start       = time.time()
        img_array   = preprocess_image(contents)
        predictions = model.predict(img_array, verbose=0)[0]
        process_ms  = round((time.time() - start) * 1000, 2)

        predicted_idx   = int(np.argmax(predictions))
        predicted_class = CLASS_NAMES[predicted_idx]
        confidence      = float(predictions[predicted_idx])

        all_confidences = {
            CLASS_NAMES[i]: round(float(predictions[i]) * 100, 2)
            for i in range(len(CLASS_NAMES))
        }

        result = {
            "success": True,
            "prediction": {
                "class":            predicted_class,
                "label":            CLASS_LABELS[predicted_class],
                "icon":             CLASS_ICONS[predicted_class],
                "confidence":       round(confidence * 100, 2),
                "confidence_level": (
                    "Sangat Tinggi" if confidence >= 0.90 else
                    "Tinggi"        if confidence >= 0.75 else
                    "Sedang"        if confidence >= 0.50 else
                    "Rendah"
                )
            },
            "all_confidences": all_confidences,
            "file_info": {
                "filename": file.filename,
                "size_kb":  round(len(contents) / 1024, 2),
                "type":     file.content_type
            },
            "process_time_ms": process_ms,
            "from_cache":      False
        }

        cache.set(contents, result)
        return JSONResponse(result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error prediksi: {str(e)}")


@app.get("/cache/stats")
async def cache_stats():
    return cache.stats()


@app.delete("/cache/clear")
async def cache_clear():
    cache.clear()
    return {"message": "Cache berhasil dikosongkan"}
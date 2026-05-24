FROM python:3.10-slim

# Set working directory di dalam container
WORKDIR /app

# Install dependencies sistem yang dibutuhkan oleh TensorFlow/Keras
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy dan install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh source code backend
COPY . .

# Expose port internal container
EXPOSE 8000

# Jalankan FastAPI menggunakan uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
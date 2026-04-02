import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn

# 1. Inisialisasi FastAPI
app = FastAPI()

# 2. Setup Jalur Folder (Penting buat Vercel)
# Ini bakal nyari lokasi file main.py berada secara absolut
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(BASE_DIR, "static")
index_file = os.path.join(BASE_DIR, "index.html")

# 3. Mount Folder Static
# Biar Vercel tau kalau folder /static/ itu isinya script.js dkk
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# 4. Route Utama (Halaman Depan)
@app.get("/", response_class=HTMLResponse)
async def read_index():
    try:
        with open(index_file, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return """
        <html>
            <body style="background:#121212; color:white; font-family:sans-serif; text-align:center; padding-top:50px;">
                <h1>⚠️ Error: index.html Tidak Ditemukan!</h1>
                <p>Pastikan file index.html berada di folder yang sama dengan main.py</p>
            </body>
        </html>
        """

# 5. Jalankan Server (Hanya buat testing lokal)
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
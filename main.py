import os
import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Ambil lokasi folder tempat file main.py ini berada
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
index_path = os.path.join(BASE_DIR, "index.html")
static_path = os.path.join(BASE_DIR, "static")

# Mount folder static secara absolut
if os.path.exists(static_path):
    app.mount("/static", StaticFiles(directory=static_path), name="static")

@app.get("/")
async def index():
    if os.path.exists(index_path):
        with open(index_path, "r") as f:
            return HTMLResponse(content=f.read(), status_code=200)
    else:
        return HTMLResponse(content=f"<h1>Error: index.html tidak ketemu!</h1><p>Lokasi yang dicari: {index_path}</p>", status_code=404)

if __name__ == "__main__":
    # Pakai 127.0.0.1 biar lebih stabil di Mac
    uvicorn.run(app, host="127.0.0.1", port=8000)
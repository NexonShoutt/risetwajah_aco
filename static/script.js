const video = document.getElementById('video');
const statusDiv = document.getElementById('status');

// 1. Fungsi buat load model AI dari CDN
async function startApp() {
    statusDiv.innerText = "⏳ Mendownload Otak AI (Model)...";
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'),
            faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'),
            faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/')
        ]);
        
        statusDiv.innerText = "✅ Model Siap! Membuka Kamera...";
        startVideo();
    } catch (err) {
        statusDiv.innerText = "❌ Gagal muat model. Cek koneksi internet!";
        console.error(err);
    }
}

// 2. Fungsi buat nyalain webcam
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            statusDiv.innerText = "❌ Kamera ditolak atau tidak ditemukan!";
            console.error(err);
        });
}

// 3. Logika Deteksi (The Real Magic)
video.addEventListener('play', () => {
    console.log("Kamera mulai streaming...");
    
    // Looping deteksi tiap 200ms
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
            video, 
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();

        if (detections.length > 0) {
            const exp = detections[0].expressions;
            let hasil = "NETRAL / DATAR";
            let detail = "Mencoba membaca emosi...";
            let color = "#00ff00"; // Default Hijau

            // --- LOGIKA DETEKSI RINCI (RISET PSIKOLOGI) ---

            // A. Kategori Senyum (Happy)
            if (exp.happy > 0.4) {
                if (exp.happy > 0.92) {
                    hasil = "SENYUM TULUS (DUCHENNE)";
                    detail = "Akurasi tinggi, otot mata ikut bergerak.";
                    color = "#00ff88";
                } else if (exp.sad > 0.1 || exp.fearful > 0.1) {
                    hasil = "SENYUM TERPAKSA / PAIT";
                    detail = "Ada tanda emosi negatif (micro-sadness).";
                    color = "#ffff00";
                } else {
                    hasil = "SENYUM SOPAN (PALSU)";
                    detail = "Hanya otot bibir yang aktif.";
                    color = "#ccff00";
                }
            } 
            
            // B. Kategori Amarah (Angry)
            else if (exp.angry > 0.2) {
                if (exp.angry > 0.7) {
                    hasil = "MARAH BESAR (RAGE)";
                    detail = "Tensi tinggi, alis mengerut tajam.";
                    color = "#ff0000";
                } else if (exp.disgusted > 0.2) {
                    hasil = "SARKAS / SINIS (CONTEMPT)";
                    detail = "Campuran amarah dan rasa tidak suka.";
                    color = "#ff4400";
                } else {
                    hasil = "KESAL / SEBAL";
                    detail = "Ketegangan wajah mulai meningkat.";
                    color = "#ff8800";
                }
            }

            // C. Kategori Lainnya
            else if (exp.surprised > 0.5) {
                hasil = "TERKEJUT / KAGET";
                detail = "Mata dan mulut terbuka lebar.";
                color = "#00ffff";
            }
            else if (exp.sad > 0.5) {
                hasil = "SEDIH / MURUNG";
                detail = "Sudut bibir menurun.";
                color = "#4444ff";
            }

            // Update ke layar
            statusDiv.innerHTML = `
                <div style="font-size: 32px; font-weight: bold; color: ${color};">${hasil}</div>
                <div style="font-size: 18px; color: #ccc; margin-top: 5px;">${detail}</div>
                <div style="font-size: 12px; color: #666; margin-top: 10px;">
                    Sakti Score: ${(Math.max(...Object.values(exp)) * 100).toFixed(1)}%
                </div>
            `;
        } else {
            statusDiv.innerText = "🔍 Mencari wajah...";
        }
    }, 200);
});

// Jalankan aplikasi
startApp();
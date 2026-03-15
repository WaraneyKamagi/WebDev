import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import io
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import numpy as np
import cv2

from rembg import remove, new_session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = None
REMBG_SESSION = None
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

TOMATO_CLASSES = [
    "Tomato___Bacterial_spot",    # Index 0
    "Tomato___Early_blight",     # Index 1
    "Tomato___Late_blight",      # Index 2
    "Tomato___Leaf_Mold",        # Index 3
    "Tomato___Septoria_leaf_spot",# Index 4
    "Tomato___Spider_mites Two-spotted_spider_mite", # Index 5
    "Tomato___Target_Spot",      # Index 6
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus", # Index 7
    "Tomato___Tomato_mosaic_virus", # Index 8
    "Tomato___healthy"           # Index 9
]

@app.on_event("startup")
async def load_model():
    global MODEL
    print(f"Loading SOTA PyTorch Model (EfficientNet-B1) on {DEVICE}...")
    try:
        # Reconstruct Architecture
        model = models.efficientnet_b1()
        num_ftrs = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(num_ftrs, len(TOMATO_CLASSES))
        
        # Load Weights (Production Ready: relative path)
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Railway will have it in /app/backend/model/...
        weight_path = os.path.join(current_dir, "model", "SOTA_Tomato_EfficientNet.pth")
        
        if not os.path.exists(weight_path):
            # Fallback for local development
            weight_path = os.path.join(current_dir, "model", "SOTA_Tomato_EfficientNet.pth") # Keep safe locally
        model.load_state_dict(torch.load(weight_path, map_location=DEVICE))
        model.to(DEVICE)
        model.eval()
        
        MODEL = model
        print("SOTA Model loaded successfully (99.83% Accuracy).")
        
        global REMBG_SESSION
        print("Initializing Rembg session (U2Net) to prevent timeouts...")
        REMBG_SESSION = new_session("u2net")
        print("Rembg session loaded successfully.")
    except Exception as e:
        print("Failed to load SOTA model:", e)

def transform_image(image):
    transform = transforms.Compose([
        transforms.Resize((384, 384)), # SOTA Model uses 384x384 for high detail
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return transform(image).unsqueeze(0).to(DEVICE)

def calculate_pixel_severity(bg_removed_image):
    """
    Menghitung persentase area yang rusak dibandingkan total area daun.
    Menggunakan space warna HSV untuk segmentasi.
    """
    # Pastikan dalam mode RGBA untuk akses alpha channel (mask daun)
    if bg_removed_image.mode != 'RGBA':
        return 0, 0
    
    # Konversi ke numpy array
    img_array = np.array(bg_removed_image)
    
    # Mask untuk area daun (alpha > 0)
    leaf_mask = img_array[:, :, 3] > 0
    total_leaf_pixels = np.sum(leaf_mask)
    
    if total_leaf_pixels == 0:
        return 0, 0

    # Konversi RGB ke HSV untuk deteksi warna yang lebih stabil
    # PIL HSV: H(0-255), S(0-255), V(0-255)
    hsv_image = bg_removed_image.convert('HSV')
    hsv_array = np.array(hsv_image)
    
    h = hsv_array[:, :, 0]
    s = hsv_array[:, :, 1]
    v = hsv_array[:, :, 2]
    
    # Rentang warna "Sehat" (Hijau): Hue approx 40-100 (dalam skala 0-255)
    # Rentang warna "Rusak" (Cokelat/Kuning/Bercak): Hue 0-35 atau yang memiliki saturasi/value rendah
    
    # Masking Hijau
    healthy_mask = (h >= 40) & (h <= 100) & (s > 20) & leaf_mask
    
    # Masking Rusak: Area daun yang TIDAK sehat
    damaged_mask = leaf_mask & ~healthy_mask
    
    damaged_pixels = np.sum(damaged_mask)
    severity_pct = (damaged_pixels / total_leaf_pixels) * 100
    
    return round(severity_pct, 2), total_leaf_pixels

def is_valid_leaf(bg_removed_image):
    """
    Memvalidasi apakah objek di gambar kemungkinan besar adalah daun tomat.
    Mengandalkan ukuran keseluruhan dari foreground dan warna HSV dominan
    yang wajar untuk daun (hijau atau kecoklatan).
    """
    if bg_removed_image.mode != 'RGBA':
        return True, ""
        
    img_array = np.array(bg_removed_image)
    leaf_mask = img_array[:, :, 3] > 0
    total_pixels = np.sum(leaf_mask)
    
    h_img, w_img = img_array.shape[:2]
    img_area = h_img * w_img
    
    if total_pixels == 0:
        return False, "Tidak ada objek yang terdeteksi. Pastikan foto fokus pada daun tomat."
        
    if total_pixels / img_area < 0.03:
        return False, "Objek terlalu kecil. Mohon foto daun dari jarak yang lebih dekat agar terlihat lebih jelas."
        
    hsv_image = bg_removed_image.convert('HSV')
    hsv_array = np.array(hsv_image)
    
    h = hsv_array[:, :, 0]
    s = hsv_array[:, :, 1]
    v = hsv_array[:, :, 2]
    
    # Deteksi warna tidak wajar (Merah terang, Biru, Ungu, Magenta)
    unnatural_mask = ((h > 110) & (h < 240) & (s > 40)) | (((h < 10) | (h > 240)) & (s > 100) & (v > 100))
    unnatural_pixels = np.sum(unnatural_mask & leaf_mask)
    unnatural_ratio = unnatural_pixels / total_pixels
    
    if unnatural_ratio > 0.20:
        return False, "Sistem merekomendasikan mengambil ulang foto. Objek terlalu banyak mengandung warna tidak wajar (biru/ungu/merah cerah)."
        
    # Deteksi warna hijau dan coklat/kuning (warna rata-rata daun normal atau sakit)
    green_mask = (h >= 30) & (h <= 100) & (s > 20) & (v > 20)
    green_pixels = np.sum(green_mask & leaf_mask)
    green_ratio = green_pixels / total_pixels
    
    brown_mask = (h >= 10) & (h < 30) & (s > 20) & (v > 20)
    brown_pixels = np.sum(brown_mask & leaf_mask)
    brown_ratio = brown_pixels / total_pixels
    
    valid_color_ratio = green_ratio + brown_ratio
    
    if valid_color_ratio < 0.45:
        return False, "Sistem merekomendasikan mengambil ulang foto. Objek dominan warna selain hijau/coklat, tidak merepresentasikan daun tomat."
        
    # --- TEXTURE AND EDGE ANALYSIS (OPENCV) ---
    # Convert RGBA numpy array to BGR for OpenCV
    cv_image = cv2.cvtColor(img_array, cv2.COLOR_RGBA2BGR)
    gray_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
    
    # 1. Laplacian Variance (mendeteksi blur / permukaan terlalu halus seperti gambar ilustrasi)
    variance = cv2.Laplacian(gray_image, cv2.CV_64F).var()
    print(f"Texture Variance (Laplacian): {variance}")
    
    if variance < 20: 
         return False, "Permukaan objek terlalu halus atau sangat buram. Pastikan foto adalah daun sungguhan berduri/urat yang terlihat jelas."

    # 2. Edge Density (mendeteksi urat daun dan tepi kasar)
    # Gunakan Canny edge detector
    edges = cv2.Canny(gray_image, 50, 150)
    edges_inside = edges & leaf_mask # Hanya hitung edge di dalam area daun
    edge_density = np.sum(edges_inside > 0) / total_pixels
    print(f"Edge Density: {edge_density}")
    
    if edge_density < 0.01: 
         return False, "Objek tidak memiliki pola urat daun yang wajar. Kemungkinan besar bukan daun tanaman asli."
        
    return True, "Valid"

@app.get("/")
def read_root():
    return {"message": "Agriscan SOTA EfficientNet-B1 API is running"}

@app.options("/predict")
async def options_predict():
    return {"message": "CORS OK"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if MODEL is None:
        return {"success": False, "message": "Model not loaded"}
    
    try:
        image_bytes = await file.read()
        # 1. Load original image
        original_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # --- BACKGROUND REMOVAL ---
        print("Removing background for focus analysis...")
        bg_removed = remove(original_image, session=REMBG_SESSION)
        
        # --- VALIDASI OBJEK DAUN ---
        is_leaf, leaf_msg = is_valid_leaf(bg_removed)
        if not is_leaf:
            return {
                "success": True,
                "data": {
                    "name": "Bukan Daun Tomat",
                    "sciName": "Invalid Image",
                    "confidence": 0,
                    "severity": "Unknown",
                    "severityClass": "severity-none",
                    "condition": leaf_msg,
                    "processingMode": "Validation",
                    "damage_pct": 0.0,
                    "related": [],
                    "note": "Silakan ambil ulang foto dan pastikan fokus utama adalah daun tomat."
                }
            }
        
        # Handle transparency (convert to white background)
        if bg_removed.mode == 'RGBA':
            clean_image = Image.new("RGB", bg_removed.size, (255, 255, 255))
            clean_image.paste(bg_removed, mask=bg_removed.split()[3])
        else:
            clean_image = bg_removed.convert("RGB")

        # 2. TRANSFORM BOTH IMAGES
        orig_tensor = transform_image(original_image)
        clean_tensor = transform_image(clean_image)
        
        # 3. RUN ENSEMBLE PREDICTION
        with torch.no_grad():
            # Predict Original
            out_orig = MODEL(orig_tensor)
            prob_orig = torch.nn.functional.softmax(out_orig, dim=1)[0]
            conf_orig, idx_orig = prob_orig.topk(1)
            
            # Predict Cleaned
            out_clean = MODEL(clean_tensor)
            prob_clean = torch.nn.functional.softmax(out_clean, dim=1)[0]
            conf_clean, idx_clean = prob_clean.topk(1)

        # 4. ADAPTIVE LOGIC: Pick the one with higher confidence
        if conf_clean.item() > conf_orig.item():
            confidence = round(conf_clean.item() * 100, 2)
            idx = idx_clean.item()
            mode = "High Focus (Cleaned)"
        else:
            confidence = round(conf_orig.item() * 100, 2)
            idx = idx_orig.item()
            mode = "Context Aware (Original)"
        
        print(f"Prediction Mode: {mode} | Confidence: {confidence}%")

        # 5. PIXEL BASED SEVERITY ANALYSIS
        severity_pct, leaf_area = calculate_pixel_severity(bg_removed)
        print(f"Visual Damage Analysis: {severity_pct}% of leaf area damaged.")

        # --- BENTENG KEAMANAN (GUARDRAIL) ---
        if confidence < 80.0: # Sedikit lebih toleran karena kita punya pixel analysis sekarang
            return {
                "success": True,
                "data": {
                    "name": "Hasil Kurang Meyakinkan",
                    "sciName": "Low Confidence",
                    "confidence": confidence,
                    "severity": "Unknown",
                    "severityClass": "severity-none",
                    "damage_pct": severity_pct,
                    "related": [],
                    "note": "Mohon ambil foto lebih dekat dengan pencahayaan yang lebih terang."
                }
            }

        predicted_class_mapped = TOMATO_CLASSES[idx]
        split_name = predicted_class_mapped.split("___")
        disease_name = split_name[1].replace("_", " ") if len(split_name) > 1 else split_name[0]
        
        if disease_name.lower() == "healthy":
            severity = "None"
            severity_class = "severity-none"
            condition_msg = "Tanaman Bapak terlihat sehat dan segar. Pertahankan perawatan rutin."
        else:
            # INTEGRASI PIXEL ANALYSIS KE SEVERITY
            if severity_pct > 35 or confidence > 97:
                severity = "High"
                severity_class = "severity-high"
                condition_msg = f"Gejala {disease_name} sudah parah ({severity_pct}% area terdampak). Segera lakukan penanganan."
            elif severity_pct > 15 or confidence > 90:
                severity = "Medium"
                severity_class = "severity-medium"
                condition_msg = f"Terdeteksi indikasi sedang {disease_name}. {severity_pct}% daun mulai menunjukkan bercak."
            else:
                severity = "Low"
                severity_class = "severity-low"
                condition_msg = f"Ada tanda-tanda awal {disease_name}. Baru {severity_pct}% area terdampak, bersihkan segera."

        return {
            "success": True,
            "data": {
                "name": disease_name,
                "sciName": disease_name,
                "confidence": confidence,
                "severity": severity,
                "severityClass": severity_class,
                "condition": condition_msg,
                "processingMode": mode,
                "damage_pct": severity_pct,
                "related": []
            }
        }
        
    except Exception as e:
        return {"success": False, "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

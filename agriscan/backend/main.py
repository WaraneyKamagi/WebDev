from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import io
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = None
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
        
        # Load Weights
        weight_path = r"C:\Users\Administrator\OneDrive\Documents\coding\web_dev\WebDev\model\SOTA_Tomato_EfficientNet.pth"
        model.load_state_dict(torch.load(weight_path, map_location=DEVICE))
        model.to(DEVICE)
        model.eval()
        
        MODEL = model
        print("SOTA Model loaded successfully (99.83% Accuracy).")
    except Exception as e:
        print("Failed to load SOTA model:", e)

def transform_image(image_bytes):
    transform = transforms.Compose([
        transforms.Resize((384, 384)), # SOTA Model uses 384x384 for high detail
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return transform(image).unsqueeze(0).to(DEVICE)

@app.get("/")
def read_root():
    return {"message": "Agriscan SOTA EfficientNet-B1 API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if MODEL is None:
        return {"success": False, "message": "Model not loaded"}
    
    try:
        image_bytes = await file.read()
        img_tensor = transform_image(image_bytes)
        
        with torch.no_grad():
            outputs = MODEL(img_tensor)
            probs = torch.nn.functional.softmax(outputs, dim=1)[0]
        
        top_prob, top_idx = probs.topk(1)
        confidence = round(top_prob.item() * 100, 2)
        idx = top_idx.item()
        
        # --- BENTENG KEAMANAN (GUARDRAIL) ---
        # Jika AI ragu (dibawah 85%), kita beri peringatan daripada salah diagnosa
        if confidence < 85.0:
            return {
                "success": True,
                "data": {
                    "name": "Hasil Kurang Meyakinkan",
                    "sciName": "Low Confidence",
                    "confidence": confidence,
                    "severity": "Unknown",
                    "severityClass": "severity-none",
                    "related": [],
                    "note": "Mohon ambil foto lebih dekat dengan pencahayaan yang lebih terang untuk hasil yang lebih akurat."
                }
            }

        predicted_class_mapped = TOMATO_CLASSES[idx]
        split_name = predicted_class_mapped.split("___")
        disease_name = split_name[1].replace("_", " ") if len(split_name) > 1 else split_name[0]
        
        if disease_name.lower() == "healthy":
            severity = "None"
            severity_class = "severity-none"
        else:
            severity = "High" if confidence > 90 else "Medium"
            severity_class = "severity-high" if confidence > 90 else "severity-medium"

        return {
            "success": True,
            "data": {
                "name": disease_name,
                "sciName": disease_name,
                "confidence": confidence,
                "severity": severity,
                "severityClass": severity_class,
                "related": []
            }
        }
        
    except Exception as e:
        return {"success": False, "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

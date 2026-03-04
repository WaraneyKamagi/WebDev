import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
import os
import time

# ==========================================
# KONFIGURASI UNTUK RTX 3050 (4GB VRAM)
# ==========================================
BATCH_SIZE = 8            # Sengaja dikecilkan agar VRAM 4GB tidak meledak (Out of Memory)
IMG_SIZE = 384            # Resolusi besar sangat krusial agar AI bisa melihat beda Leaf Mold & Blight
EPOCHS = 20               # Ditambah agar model belajar lebih kuat menghadapi gangguan
LEARNING_RATE = 1e-4

DATASET_DIR = r"C:\Users\Administrator\OneDrive\Documents\coding\web_dev\WebDev\dataset"
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
VAL_DIR = os.path.join(DATASET_DIR, "val")

# ==========================================
# 1. IMAGE AUGMENTATION (AGAR AI CERDAS)
# ==========================================
# Memutar, membalik, dan mencerahkan gambar agar AI tidak kaget melihat bayangan / foto kebun asli
train_transforms = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),      # Tambahan: agar AI tahu daun bisa dari arah mana saja
    transforms.RandomRotation(30),        # Ditambah agar lebih fleksibel
    transforms.RandomPerspective(distortion_scale=0.2, p=0.5), # Simulasi sudut foto miring
    transforms.ColorJitter(brightness=0.4, contrast=0.4, saturation=0.4), # Melawan pencahayaan ekstrem
    transforms.GaussianBlur(kernel_size=(5, 9), sigma=(0.1, 5)), # Menangani foto agak buram
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    transforms.RandomErasing(p=0.2, scale=(0.02, 0.1), ratio=(0.3, 3.3)), # Simulasi daun tertutup kotoran/daun lain
])

val_transforms = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# ==========================================
# 2. DATA LOADERS
# ==========================================
print("Loading Datasets...")
train_dataset = datasets.ImageFolder(TRAIN_DIR, transform=train_transforms)
val_dataset = datasets.ImageFolder(VAL_DIR, transform=val_transforms)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, pin_memory=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, pin_memory=True)

class_names = train_dataset.classes
print(f"Ditemukan {len(class_names)} Kelas Penyakit.")

# ==========================================
# 3. MEMBANGUN MODEL (EFFICIENTNET-B1)
# ==========================================
# Menggunakan model standar industri terbaru: EfficientNet
def train_model():
    print("Memeriksa kesiapan GPU...")
    if not torch.cuda.is_available():
        print("\n" + "="*50)
        print("ERROR: GPU NVIDIA TIDAK TERDETEKSI!")
        print("="*50)
        print("Penyebab 1: Driver NVIDIA belum terinstal atau perlu di-update.")
        print("Penyebab 2: PyTorch yang terinstal bukan versi CUDA.")
        print("Penyebab 3: Kabel charger laptop belum dicolok (beberapa laptop mematikan GPU di mode baterai).")
        print("Penyebab 4: GPU sedang digunakan oleh aplikasi lain.")
        print("="*50)
        print("Proses dihentikan untuk mencegah training lambat di CPU.\n")
        return

    device = torch.device("cuda")
    print(f"Menggunakan GPU: {torch.cuda.get_device_name(0)}")
    
    print("Mengunduh Model Utama (EfficientNet-B1)...")
    model = models.efficientnet_b1(weights=models.EfficientNet_B1_Weights.DEFAULT)

    # Mengganti lapisan terakhir (Classifier) agar cocok dengan jumlah penyakit kita (10 kelas)
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_ftrs, len(class_names))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

    print(f"\nMemulai Pelatihan di: {device.type.upper()}...")
    best_acc = 0.0

    for epoch in range(EPOCHS):
        start_time = time.time()
        print(f"\n--- Epoch {epoch+1}/{EPOCHS} ---")

        # TRAINING PHASE
        model.train()
        running_loss, running_corrects = 0.0, 0
        
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            optimizer.zero_grad()
            
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            _, preds = torch.max(outputs, 1)
            
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data)
            
        train_loss = running_loss / len(train_dataset)
        train_acc = running_corrects.double() / len(train_dataset) * 100

        # VALIDATION PHASE
        model.eval()
        val_loss, val_corrects = 0.0, 0
        
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                _, preds = torch.max(outputs, 1)
                
                val_loss += loss.item() * inputs.size(0)
                val_corrects += torch.sum(preds == labels.data)

        val_loss = val_loss / len(val_dataset)
        val_acc = val_corrects.double() / len(val_dataset) * 100

        epoch_time = time.time() - start_time
        print(f"[{epoch_time:.0f} detik] Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}% | Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.2f}%")

        # Simpan Model Terbaik
        if val_acc > best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), "SOTA_Tomato_EfficientNet.pth")
            print(">>> Model baru disimpan! (Akurasi Meningkat)")

    print(f"\nTraining Selesai! Akurasi Tertinggi: {best_acc:.2f}%")

if __name__ == "__main__":
    train_model()

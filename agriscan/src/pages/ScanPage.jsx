import { useState, useRef, useEffect } from 'react';
import { UploadIcon, CameraIcon, ImageIcon, CheckCircleIcon } from '../icons.jsx';

const ANALYSIS_STEPS = [
    { id: 1, label: 'Menyiapkan gambar', delay: 0 },
    { id: 2, label: 'Mendeteksi area tanaman', delay: 800 },
    { id: 3, label: 'Menjalankan klasifikasi AI', delay: 1800 },
    { id: 4, label: 'Membuat saran perawatan', delay: 2600 },
];

export default function ScanPage({ onNavigate, uploadedFile, onFileSelected }) {
    const [dragover, setDragover] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [stepsDone, setStepsDone] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const fileRef = useRef();
    const cameraRef = useRef();

    useEffect(() => {
        if (uploadedFile) {
            const url = URL.createObjectURL(uploadedFile);
            setPreviewUrl(url);
            // We use a ref or an inline call to avoid useEffect dependency on startScan which is redefined on every render
            return () => URL.revokeObjectURL(url);
        }
    }, [uploadedFile]);

    useEffect(() => {
        if (uploadedFile && previewUrl) {
            startScan();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previewUrl]); // Trigger scan only when preview URL is ready

    const startScan = async () => {
        setScanning(true);
        setStepsDone([]);
        setCurrentStep(0);
        setProgress(0);

        // Start UI progress simulation
        const progressInterval = setInterval(() => {
            setProgress(p => {
                if (p < 90) return p + 5;
                return p;
            });
        }, 300);

        // Step 1: Preprocessing UI
        setTimeout(() => {
            setCurrentStep(1);
            setStepsDone([1]);
        }, 800);

        // Step 2: Detecting regions UI
        setTimeout(() => {
            setCurrentStep(2);
            setStepsDone([1, 2]);
        }, 1800);

        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);

            const apiUrl = import.meta.env.VITE_AI_API_URL || 'http://210.79.191.138:8002/predict';

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            clearInterval(progressInterval);
            setCurrentStep(3);
            setStepsDone([1, 2, 3]);
            setProgress(100);

            setTimeout(() => {
                setStepsDone([1, 2, 3, 4]);
                setTimeout(() => onNavigate('results', { scanResult: result.data }), 600);
            }, 800);

        } catch (error) {
            console.error("Error during scan:", error);
            clearInterval(progressInterval);
            // Handle error gracefully, maybe navigate to a generic error page
            alert("Gagal menghubungi layanan AI. Pastikan backend sudah berjalan.");
            setScanning(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragover(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            onFileSelected(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) onFileSelected(file);
    };

    return (
        <div className="page">
            <div className="scan-page">
                {/* Header */}
                <div className="scan-page__header">
                    <h1 className="scan-page__title">
                        {scanning ? 'Menganalisis Tanaman...' : 'Pindai Tanaman anda'}
                    </h1>
                    <p className="scan-page__subtitle">
                        {scanning
                            ? 'AI kami sedang memeriksa tanda-tanda penyakit pada gambar. Mohon tunggu sejenak.'
                            : 'Ambil foto bagian tanaman tomat yang sakit secara jelas untuk diagnosa akurat.'}
                    </p>
                </div>

                <div className="scan-content">
                    {/* Main Image Area */}
                    <div className="scan-main">
                        <div className="image-card">
                            <div className="image-card__toolbar">
                                <span className="image-card__name">
                                    <ImageIcon size={16} color="var(--color-primary)" />
                                    {uploadedFile ? uploadedFile.name : 'Belum ada gambar terpilih'}
                                </span>
                                {uploadedFile && (
                                    <span className="image-card__meta">
                                        {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                                    </span>
                                )}
                            </div>

                            {previewUrl ? (
                                <div style={{ position: 'relative' }}>
                                    <img className="image-card__preview-img" src={previewUrl} alt="Plant preview" />
                                    {scanning && (
                                        <div className="scanning-overlay">
                                            <div className="scanning-overlay__line" />
                                            <div className="scanning-overlay__ring">
                                                <div className="scanning-overlay__spinner" />
                                            </div>
                                            <span className="scanning-overlay__text">Pemindaian AI...</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className={`dropzone ${dragover ? 'dragover' : ''}`}
                                    style={{ borderRadius: 0, border: 'none', minHeight: '280px', background: 'var(--color-surface-2)' }}
                                    onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
                                    onDragLeave={() => setDragover(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileRef.current?.click()}
                                >
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    <input
                                        ref={cameraRef}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    <div className="dropzone__icon">
                                        <UploadIcon size={28} color="var(--color-primary)" />
                                    </div>
                                    <div className="dropzone__title">Lepas atau klik untuk memilih</div>
                                    <p className="dropzone__subtitle">JPG, PNG, WEBP · Maks 10MB</p>
                                </div>
                            )}
                        </div>

                        {/* Bottom buttons */}
                        {!scanning && (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    className="btn btn-primary btn-lg"
                                    style={{ flex: 1 }}
                                    onClick={() => fileRef.current?.click()}
                                >
                                    <UploadIcon size={17} color="white" />
                                    {previewUrl ? 'Ganti Gambar' : 'Ambil Gambar'}
                                </button>
                                <button
                                    className="btn btn-outline btn-lg"
                                    style={{ flex: 1 }}
                                    onClick={() => cameraRef.current?.click()}
                                >
                                    <CameraIcon size={17} color="currentColor" />
                                    Gunakan Kamera
                                </button>
                                {previewUrl && (
                                    <button
                                        className="btn btn-primary btn-lg"
                                        style={{ flex: 1 }}
                                        onClick={startScan}
                                    >
                                        Analisis Sekarang
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="scan-sidebar">
                        {/* Progress Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card__title">Kemajuan Analisis</div>
                            <div className="progress-bar">
                                <div
                                    className="progress-bar__fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="progress-label">
                                <span>{scanning ? 'Memproses...' : progress === 100 ? 'Selesai' : 'Menunggu'}</span>
                                <span>{progress}%</span>
                            </div>
                        </div>

                        {/* Steps Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card__title">Alur Deteksi AI</div>
                            <div className="analysis-steps">
                                {ANALYSIS_STEPS.map((step, i) => {
                                    const isDone = stepsDone.includes(step.id);
                                    const isLoading = scanning && currentStep === i && !isDone;

                                    return (
                                        <div className="analysis-step" key={step.id}>
                                            <div
                                                className={`analysis-step__icon ${isDone ? 'analysis-step__icon--done' :
                                                    isLoading ? 'analysis-step__icon--loading' :
                                                        'analysis-step__icon--pending'
                                                    }`}
                                            >
                                                {isDone ? (
                                                    <CheckCircleIcon size={14} color="var(--color-success)" />
                                                ) : isLoading ? (
                                                    <div className="analysis-step__spinner" />
                                                ) : (
                                                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)' }}>
                                                        {i + 1}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="analysis-step__label">{step.label}</span>
                                            <span className={`analysis-step__status ${isDone ? 'status-done' : isLoading ? 'status-loading' : 'status-pending'}`}>
                                                {isDone ? 'Selesai' : isLoading ? 'Berjalan' : 'Menunggu'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card__title">Tips Pengambilan Foto</div>
                            <div className="tips-list">
                                {[
                                    { icon: '☀️', text: 'Gunakan cahaya alami (siang hari)' },
                                    { icon: '🔍', text: 'Fokus pada area yang paling sakit' },
                                    { icon: '📏', text: 'Jarak kamera 15-30cm dari daun' },
                                    { icon: '🚫', text: 'Hindari gambar buram atau gelap' },
                                ].map((tip, i) => (
                                    <div className="tip-item" key={i}>
                                        <span className="tip-item__icon">{tip.icon}</span>
                                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{tip.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

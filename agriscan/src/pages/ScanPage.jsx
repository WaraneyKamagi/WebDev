import { useState, useRef, useEffect } from 'react';
import { UploadIcon, CameraIcon, ImageIcon, CheckCircleIcon } from '../icons.jsx';

const ANALYSIS_STEPS = [
    { id: 1, label: 'Preprocessing image', delay: 0 },
    { id: 2, label: 'Detecting plant regions', delay: 800 },
    { id: 3, label: 'Running disease classifier', delay: 1800 },
    { id: 4, label: 'Generating treatment plan', delay: 2600 },
];

export default function ScanPage({ onNavigate, uploadedFile, onFileSelected }) {
    const [dragover, setDragover] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [stepsDone, setStepsDone] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const fileRef = useRef();

    useEffect(() => {
        if (uploadedFile) {
            const url = URL.createObjectURL(uploadedFile);
            setPreviewUrl(url);
            startScan();
            return () => URL.revokeObjectURL(url);
        }
    }, [uploadedFile]);

    const startScan = () => {
        setScanning(true);
        setStepsDone([]);
        setCurrentStep(0);
        setProgress(0);

        ANALYSIS_STEPS.forEach((step, i) => {
            setTimeout(() => {
                setCurrentStep(i);
                setProgress(Math.round(((i + 1) / ANALYSIS_STEPS.length) * 100));
                if (i > 0) setStepsDone(prev => [...prev, ANALYSIS_STEPS[i - 1].id]);
            }, step.delay);
        });

        setTimeout(() => {
            setStepsDone(ANALYSIS_STEPS.map(s => s.id));
            setProgress(100);
            setTimeout(() => onNavigate('results'), 600);
        }, 3500);
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
                        {scanning ? 'Analyzing Your Plant...' : 'Scan Your Plant'}
                    </h1>
                    <p className="scan-page__subtitle">
                        {scanning
                            ? 'Our AI is inspecting your image for disease signatures. Please wait a moment.'
                            : 'Upload a clear photo of the affected tomato plant area for accurate diagnosis.'}
                    </p>
                </div>

                <div className="scan-content">
                    {/* Main Image Area */}
                    <div className="scan-main">
                        <div className="image-card">
                            <div className="image-card__toolbar">
                                <span className="image-card__name">
                                    <ImageIcon size={16} color="var(--color-primary)" />
                                    {uploadedFile ? uploadedFile.name : 'No image selected'}
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
                                            <span className="scanning-overlay__text">AI Scanning...</span>
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
                                    <div className="dropzone__icon">
                                        <UploadIcon size={28} color="var(--color-primary)" />
                                    </div>
                                    <div className="dropzone__title">Drop or click to upload</div>
                                    <p className="dropzone__subtitle">JPG, PNG, WEBP · Max 10MB</p>
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
                                    {previewUrl ? 'Replace Image' : 'Upload Image'}
                                </button>
                                <button className="btn btn-outline btn-lg" style={{ flex: 1 }}>
                                    <CameraIcon size={17} color="currentColor" />
                                    Use Camera
                                </button>
                                {previewUrl && (
                                    <button
                                        className="btn btn-primary btn-lg"
                                        style={{ flex: 1 }}
                                        onClick={startScan}
                                    >
                                        Analyze Now
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="scan-sidebar">
                        {/* Progress Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card__title">Analysis Progress</div>
                            <div className="progress-bar">
                                <div
                                    className="progress-bar__fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="progress-label">
                                <span>{scanning ? 'Processing...' : progress === 100 ? 'Complete' : 'Waiting'}</span>
                                <span>{progress}%</span>
                            </div>
                        </div>

                        {/* Steps Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card__title">Detection Pipeline</div>
                            <div className="analysis-steps">
                                {ANALYSIS_STEPS.map((step, i) => {
                                    const isDone = stepsDone.includes(step.id);
                                    const isLoading = scanning && currentStep === i && !isDone;
                                    const isPending = !isDone && !isLoading;

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
                                                {isDone ? 'Done' : isLoading ? 'Running' : 'Pending'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="sidebar-card">
                            <div className="sidebar-card__title">Photo Tips</div>
                            <div className="tips-list">
                                {[
                                    { icon: '☀️', text: 'Use natural daylight for best results' },
                                    { icon: '🔍', text: 'Focus on the most affected area' },
                                    { icon: '📏', text: 'Keep camera 15-30cm from the leaf' },
                                    { icon: '🚫', text: 'Avoid blurry or dark images' },
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

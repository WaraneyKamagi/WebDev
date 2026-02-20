import { useState, useRef } from 'react';
import { UploadIcon, CameraIcon, ZapIcon, ShieldIcon, CheckCircleIcon, ImageIcon } from '../icons.jsx';

const FEATURES = [
    { icon: <ZapIcon size={14} color="var(--color-primary)" />, text: 'Results in under 3 seconds' },
    { icon: <ShieldIcon size={14} color="var(--color-primary)" />, text: '98.4% detection accuracy' },
    { icon: <CheckCircleIcon size={14} color="var(--color-primary)" />, text: '32+ diseases identified' },
];

const STEPS = [
    {
        num: '01',
        icon: '📷',
        title: 'Upload a Photo',
        desc: 'Take a clear photo of your tomato plant leaves, fruits, or stem showing the affected area.',
    },
    {
        num: '02',
        icon: '🤖',
        title: 'AI Analysis',
        desc: 'Our deep learning model analyzes your image against a database of 32+ tomato diseases.',
    },
    {
        num: '03',
        icon: '💊',
        title: 'Get Treatment',
        desc: 'Receive instant diagnosis with expert-recommended treatment plans and prevention tips.',
    },
];

const FEAT_CARDS = [
    { icon: '🎯', title: 'High Accuracy', desc: 'Trained on 500K+ labeled images for industry-leading 98.4% accuracy across all disease types.' },
    { icon: '⚡', title: 'Instant Results', desc: 'Real-time analysis delivers diagnosis in under 3 seconds, so you can act before damage spreads.' },
    { icon: '🌿', title: '32+ Diseases', desc: 'From early blight to bacterial spot, we cover the full spectrum of tomato plant diseases.' },
    { icon: '💊', title: 'Treatment Plans', desc: 'Each diagnosis comes with expert-curated treatment protocols and organic alternatives.' },
    { icon: '📊', title: 'Confidence Score', desc: 'Understand how certain the AI is with detailed confidence breakdowns for every result.' },
    { icon: '🔒', title: 'Privacy First', desc: 'Images are never stored. Your farm data stays completely private and secure.' },
];

export default function HomePage({ onNavigate, onFileSelected }) {
    const [dragover, setDragover] = useState(false);
    const fileRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        setDragover(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            onFileSelected(file);
            onNavigate('scanning');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelected(file);
            onNavigate('scanning');
        }
    };

    return (
        <div className="page">
            {/* Hero */}
            <section className="hero">
                {/* Left Content */}
                <div className="hero__content">
                    <div className="hero__badge">
                        <span className="hero__badge-dot" />
                        AI-Powered Plant Health
                    </div>
                    <h1 className="hero__title">
                        Detect Tomato<br />
                        Diseases <span className="hero__title-accent">Instantly</span>
                    </h1>
                    <p className="hero__subtitle">
                        Upload a photo of your tomato plant and our AI will identify diseases,
                        analyze severity, and provide targeted treatment recommendations in seconds.
                    </p>
                    <div className="hero__actions">
                        <button
                            id="cta-scan-btn"
                            className="btn btn-primary btn-lg"
                            onClick={() => onNavigate('scan')}
                        >
                            <UploadIcon size={18} color="white" />
                            Scan Your Plant
                        </button>
                        <button className="btn btn-outline btn-lg">
                            View Demo
                        </button>
                    </div>

                    <div className="hero__stats">
                        <div className="hero__stat">
                            <div className="hero__stat-value">98.4%</div>
                            <div className="hero__stat-label">Accuracy rate</div>
                        </div>
                        <div className="hero__stat-divider" />
                        <div className="hero__stat">
                            <div className="hero__stat-value">32+</div>
                            <div className="hero__stat-label">Diseases detected</div>
                        </div>
                        <div className="hero__stat-divider" />
                        <div className="hero__stat">
                            <div className="hero__stat-value">&lt;3s</div>
                            <div className="hero__stat-label">Analysis time</div>
                        </div>
                    </div>
                </div>

                {/* Upload Panel */}
                <div className="upload-panel">
                    <div className="upload-panel__header">
                        <span className="upload-panel__title">Quick Scan</span>
                        <span className="upload-panel__tag">Free</span>
                    </div>

                    <div
                        className={`dropzone ${dragover ? 'dragover' : ''}`}
                        id="hero-dropzone"
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
                            <UploadIcon size={24} color="var(--color-primary)" />
                        </div>
                        <div className="dropzone__title">Drop your image here</div>
                        <p className="dropzone__subtitle">
                            or <span className="dropzone__browse">browse files</span> to upload
                        </p>
                        <div className="dropzone__formats">
                            <span className="dropzone__format-tag">JPG</span>
                            <span className="dropzone__format-tag">PNG</span>
                            <span className="dropzone__format-tag">WEBP</span>
                            <span className="dropzone__format-tag">HEIC</span>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>up to 10MB</span>
                        </div>
                    </div>

                    <div className="upload-panel__features">
                        {FEATURES.map((f, i) => (
                            <div className="upload-panel__feature" key={i}>
                                <div className="upload-panel__feature-icon">{f.icon}</div>
                                <span className="upload-panel__feature-text">{f.text}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            onClick={() => fileRef.current?.click()}
                        >
                            <UploadIcon size={15} color="white" />
                            Upload Image
                        </button>
                        <button className="btn btn-outline" style={{ flex: 1 }}>
                            <CameraIcon size={15} color="currentColor" />
                            Use Camera
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '64px 0' }}>
                <div className="section" style={{ padding: '0 40px' }}>
                    <div className="section__header">
                        <span className="section__eyebrow">How It Works</span>
                        <h2 className="section__title">Three simple steps to plant health</h2>
                        <p className="section__subtitle">
                            No expertise needed. Our AI does the heavy lifting so you can focus on what matters — your crops.
                        </p>
                    </div>
                    <div className="steps-grid">
                        {STEPS.map((step, i) => (
                            <div className="step-card" key={i}>
                                <div className="step-card__number">{step.num}</div>
                                <div className="step-card__icon">{step.icon}</div>
                                <div className="step-card__title">{step.title}</div>
                                <p className="step-card__desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section>
                <div className="section">
                    <div className="section__header">
                        <span className="section__eyebrow">Features</span>
                        <h2 className="section__title">Everything you need</h2>
                        <p className="section__subtitle">
                            Professional-grade plant diagnostics, powered by cutting-edge computer vision.
                        </p>
                    </div>
                    <div className="features-grid">
                        {FEAT_CARDS.map((f, i) => (
                            <div className="feature-card" key={i}>
                                <div className="feature-card__icon">{f.icon}</div>
                                <div className="feature-card__title">{f.title}</div>
                                <p className="feature-card__desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" style={{ marginTop: 'auto' }}>
                <div className="footer__inner">
                    <span className="footer__copy">© 2026 AgriScan AI. All rights reserved.</span>
                    <div className="footer__links">
                        <a href="#" className="footer__link">Privacy</a>
                        <a href="#" className="footer__link">Terms</a>
                        <a href="#" className="footer__link">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

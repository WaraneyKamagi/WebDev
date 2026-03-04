import { useState, useRef } from 'react';
import { UploadIcon, CameraIcon, ZapIcon, ShieldIcon, CheckCircleIcon, ImageIcon } from '../icons.jsx';

const FEATURES = [
    { icon: <ZapIcon size={14} color="var(--color-primary)" />, text: 'Hasil dalam < 3 detik' },
    { icon: <ShieldIcon size={14} color="var(--color-primary)" />, text: 'Akurasi SOTA 99.7%' },
    { icon: <CheckCircleIcon size={14} color="var(--color-primary)" />, text: 'Analisis Terakselerasi GPU' },
];

const STEPS = [
    {
        num: '01',
        icon: '📷',
        title: 'Ambil Foto',
        desc: 'Ambil foto daun, buah, atau batang tomat yang terkena penyakit secara jelas.',
    },
    {
        num: '02',
        icon: '🤖',
        title: 'Analisis AI',
        desc: 'Model deep learning kami menganalisis gambar Anda secara instan tanpa menyimpan data.',
    },
    {
        num: '03',
        icon: '💊',
        title: 'Dapatkan Solusi',
        desc: 'Terima hasil diagnosa instan beserta saran perawatan dan pencegahan dari ahli.',
    },
];

const FEAT_CARDS = [
    { icon: '🎯', title: 'Akurasi Tertinggi', desc: 'Dilatih dengan arsitektur SOTA EfficientNet-B1 untuk akurasi validasi 99.7% yang memimpin industri.' },
    { icon: '🚀', title: 'Akselerasi GPU', desc: 'Ditenagai oleh komputasi NVIDIA RTX untuk inferensi secepat kilat dalam hitungan detik.' },
    { icon: '🌿', title: 'Augmentasi Padat', desc: 'Model tangguh yang tahan terhadap gangguan cahaya, blur, dan noise lingkungan di lapangan.' },
    { icon: '💊', title: 'Rencana Perawatan', desc: 'Setiap diagnosa dilengkapi dengan protokol perawatan kurasi ahli dan alternatif organik.' },
    { icon: '📊', title: 'Batas Keamanan', desc: 'Penyaringan berbasis kepercayaan memastikan Bapak hanya mendapatkan hasil yang valid dan akurat.' },
    { icon: '🔒', title: 'Privasi Mutlak', desc: 'Gambar diproses secara lokal dan instan. Data lahan Bapak aman dan tidak disimpan di database.' },
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
                        Kesehatan Tanaman Berbasis AI
                    </div>
                    <h1 className="hero__title">
                        Deteksi Penyakit<br />
                        Tomat <span className="hero__title-accent">Instan</span>
                    </h1>
                    <p className="hero__subtitle">
                        Ambil foto tanaman tomat Anda dan AI kami akan mengidentifikasi penyakit,
                        menganalisis keparahan, dan memberikan solusi perawatan dalam sekejap.
                    </p>
                    <div className="hero__actions">
                        <button
                            id="cta-scan-btn"
                            className="btn btn-primary btn-lg"
                            onClick={() => onNavigate('scan')}
                        >
                            <UploadIcon size={18} color="white" />
                            Pindai Tanaman Anda
                        </button>
                        <button className="btn btn-outline btn-lg">
                            Lihat Demo
                        </button>
                    </div>

                    <div className="hero__stats">
                        <div className="hero__stat">
                            <div className="hero__stat-value">99.7%</div>
                            <div className="hero__stat-label">Akurasi SOTA</div>
                        </div>
                        <div className="hero__stat-divider" />
                        <div className="hero__stat">
                            <div className="hero__stat-value">Instan</div>
                            <div className="hero__stat-label">Tanpa Database</div>
                        </div>
                        <div className="hero__stat-divider" />
                        <div className="hero__stat">
                            <div className="hero__stat-value">&lt;3 dtk</div>
                            <div className="hero__stat-label">Waktu Deteksi</div>
                        </div>
                    </div>
                </div>

                {/* Upload Panel */}
                <div className="upload-panel">
                    <div className="upload-panel__header">
                        <span className="upload-panel__title">Pindai Cepat</span>
                        <span className="upload-panel__tag">Gratis</span>
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
                        <div className="dropzone__title">Lepas gambar di sini</div>
                        <p className="dropzone__subtitle">
                            atau <span className="dropzone__browse">pilih file</span> untuk memulai
                        </p>
                        <div className="dropzone__formats">
                            <span className="dropzone__format-tag">JPG</span>
                            <span className="dropzone__format-tag">PNG</span>
                            <span className="dropzone__format-tag">WEBP</span>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Maks 10MB</span>
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
                            Ambil Gambar
                        </button>
                        <button className="btn btn-outline" style={{ flex: 1 }}>
                            <CameraIcon size={15} color="currentColor" />
                            Gunakan Kamera
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '64px 0' }}>
                <div className="section" style={{ padding: '0 40px' }}>
                    <div className="section__header">
                        <span className="section__eyebrow">Cara Kerja</span>
                        <h2 className="section__title">Tiga langkah mudah menuju panen sehat</h2>
                        <p className="section__subtitle">
                            Bapak tidak perlu jadi ahli botani. AI kami merangkum semuanya agar Bapak bisa fokus pada hasil panen.
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
                        <span className="section__eyebrow">Fitur Utama</span>
                        <h2 className="section__title">Semua yang Bapak butuhkan</h2>
                        <p className="section__subtitle">
                            Diagnostik tanaman tingkat profesional, ditenagai oleh computer vision tercanggih.
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
                    <span className="footer__copy">© 2026 AgriScan AI Indonesia. Seluruh hak cipta dilindungi.</span>
                    <div className="footer__links">
                        <a href="#" className="footer__link">Privasi</a>
                        <a href="#" className="footer__link">Ketentuan</a>
                        <a href="#" className="footer__link">Kontak</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

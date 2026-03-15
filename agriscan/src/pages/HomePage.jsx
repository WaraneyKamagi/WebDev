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
        desc: 'Ambil foto daun yang terkena penyakit secara jelas.',
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
    { icon: '🎯', title: 'Diagnosis Tepat Sasaran', desc: 'Dapatkan hasil identifikasi penyakit yang akurat untuk mencegah gagal panen lebih dini.' },
    { icon: '🌿', title: 'Andal di Segala Kondisi', desc: 'Sistem tetap bekerja maksimal meskipun foto diambil dengan cahaya redup atau sedikit buram.' },
    { icon: '💊', title: 'Panduan Praktis', desc: 'Tidak hanya mendeteksi masalah, kami juga memberikan langkah perawatan spesifik untuk menyelamatkan tanaman Anda.' },
    { icon: '📊', title: 'Hasil yang Bisa Dipercaya', desc: 'Memberikan informasi yang jujur dan valid, sehingga Anda bisa mengambil tindakan dengan tenang.' },
    { icon: '🔒', title: 'Aman dan Rahasia', desc: 'Foto tanaman Anda langsung diproses tanpa disimpan di sistem kami, menjaga privasi data kebun Anda.' },
    { icon: '⚡', title: 'Respon Super Cepat', desc: 'Dapatkan hasil analisis penyakit dan solusi perawatannya dalam hitungan detik tanpa perlu menunggu lama.' },
];

export default function HomePage({ onNavigate, onFileSelected }) {
    const [dragover, setDragover] = useState(false);
    const fileRef = useRef();
    const cameraRef = useRef();

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
                        <input
                            ref={cameraRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
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

                    <div className="upload-panel__buttons">
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            onClick={() => fileRef.current?.click()}
                        >
                            <UploadIcon size={15} color="white" />
                            Ambil Gambar
                        </button>
                        <button
                            className="btn btn-outline"
                            style={{ flex: 1 }}
                            onClick={() => cameraRef.current?.click()}
                        >
                            <CameraIcon size={15} color="currentColor" />
                            Gunakan Kamera
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="section" style={{ padding: '0 40px' }}>
                    <div className="section__header">
                        <span className="section__eyebrow">Cara Kerja</span>
                        <h2 className="section__title">Tiga langkah mudah menuju panen sehat</h2>
                        <p className="section__subtitle">
                            anda tidak perlu jadi ahli botani. AI kami merangkum semuanya agar anda bisa fokus pada hasil panen.
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
                        <h2 className="section__title">Semua yang anda butuhkan</h2>
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

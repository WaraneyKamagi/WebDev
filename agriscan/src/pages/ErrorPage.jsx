import { ArrowLeftIcon, RefreshIcon, UploadIcon } from '../icons.jsx';

const TIPS = {
    no_tomato: [
        { icon: '🍅', text: 'Pastikan gambar menunjukkan daun, buah, atau batang tomat dengan jelas' },
        { icon: '🔍', text: 'Hindari gambar dengan banyak jenis tanaman dalam satu bingkai' },
        { icon: '📐', text: 'Posisikan tanaman tomat di tengah foto' },
        { icon: '💡', text: 'Pencahayaan yang baik membantu AI mengidentifikasi tanaman' },
    ],
    blurry: [
        { icon: '🔍', text: 'Pegang kamera dengan stabil atau sandarkan ke permukaan' },
        { icon: '☀️', text: 'Pastikan cahaya cukup agar kamera dapat fokus' },
        { icon: '📐', text: 'Jaga jarak 15–30cm dari daun untuk fokus terbaik' },
        { icon: '⏱️', text: 'Tunggu kamera fokus otomatis sebelum memotret' },
    ],
};

export default function ErrorPage({ onNavigate, errorType = 'no_tomato', previewUrl }) {
    const isBlurry = errorType === 'blurry';

    const config = {
        no_tomato: {
            badgeIcon: '🔍',
            badgeTitle: 'Tomat Tidak Terdeteksi',
            badgeSubtitle: 'Gagal mengidentifikasi tanaman tomat',
            bodyTitle: 'Tanaman Tomat Tidak Ditemukan',
            bodyDesc:
                "AI kami tidak dapat mendeteksi jaringan tanaman tomat pada gambar yang Bapak unggah. Hal ini mungkin karena gambar tidak berisi tanaman tomat, tanaman tidak terlihat jelas, atau resolusi gambar terlalu rendah.",
            tipsTitle: 'Cara mendapatkan hasil lebih baik',
        },
        blurry: {
            badgeIcon: '⚠️',
            badgeTitle: 'Masalah Kualitas Gambar',
            badgeSubtitle: 'Foto terlalu buram untuk dianalisis',
            bodyTitle: 'Gambar Terlalu Buram untuk Dianalisis',
            bodyDesc:
                "Gambar yang Bapak unggah tidak memiliki ketajaman yang cukup bagi AI kami untuk melakukan deteksi penyakit secara akurat. Gambar yang buram dapat menyebabkan hasil yang salah, jadi kami memerlukan foto yang fokus dan jelas.",
        },
    };

    const c = config[errorType] || config.no_tomato;
    const tips = TIPS[errorType] || TIPS.no_tomato;

    return (
        <div className="page">
            <div className="error-page">
                {/* Header */}
                <div className="error-header">
                    <button
                        className="results-back-btn"
                        onClick={() => onNavigate('scan')}
                    >
                        <ArrowLeftIcon size={18} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text)' }}>
                            Analisis Gagal
                        </h1>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                            Kami menemukan kendala pada gambar Bapak
                        </p>
                    </div>
                </div>

                {/* Error Card */}
                <div className="error-content">
                    <div className="error-card">
                        {/* Image with overlay */}
                        <div className="error-image-wrap">
                            {previewUrl ? (
                                <img
                                    className={`error-image ${isBlurry ? 'error-image--blur' : ''}`}
                                    src={previewUrl}
                                    alt="Analyzed upload"
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #2d2d2d, #1a1a1a)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '220px',
                                    }}
                                >
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <path d="m21 15-5-5L5 21" />
                                    </svg>
                                </div>
                            )}
                            <div className="error-badge-overlay">
                                <div className="error-badge">
                                    <div className="error-badge__icon">{c.badgeIcon}</div>
                                    <div className="error-badge__title">{c.badgeTitle}</div>
                                    <div className="error-badge__subtitle">{c.badgeSubtitle}</div>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="error-body">
                            <h2 className="error-body__title">{c.bodyTitle}</h2>
                            <p className="error-body__desc">{c.bodyDesc}</p>

                            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                                Tips agar foto lebih baik
                            </div>
                            <div className="tips-list">
                                {tips.map((tip, i) => (
                                    <div className="tip-item" key={i}>
                                        <span className="tip-item__icon">{tip.icon}</span>
                                        <span>{tip.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="error-actions">
                        <button
                            className="btn btn-primary btn-lg"
                            style={{ flex: 1 }}
                            onClick={() => onNavigate('scan')}
                        >
                            <UploadIcon size={17} color="white" />
                            Coba Lagi dengan Foto Baru
                        </button>
                        <button
                            className="btn btn-outline btn-lg"
                            style={{ flex: 1 }}
                            onClick={() => onNavigate('home')}
                        >
                            <RefreshIcon size={16} />
                            Kembali ke Beranda
                        </button>
                    </div>

                    {/* Support note */}
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '13px',
                            color: 'var(--color-text-muted)',
                            padding: '0 20px',
                        }}
                    >
                        Masih ada kendala?{' '}
                        <a href="#" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            Lihat panduan foto
                        </a>{' '}
                        atau{' '}
                        <a href="#" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            hubungi bantuan
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

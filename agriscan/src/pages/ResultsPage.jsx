import { useState, useEffect } from 'react';
import { ArrowLeftIcon, DownloadIcon, RefreshIcon, CheckCircleIcon, ClockIcon, DropletIcon, SunIcon } from '../icons.jsx';

const DISEASE_DATABASE = {
    'Bacterial spot': {
        name: 'Bacterial Spot',
        sciName: 'Xanthomonas spp.',
        description: 'Penyakit yang menyebabkan bercak kecil gelap pada daun dan buah. Sangat menular melalui percikan air dan kelembaban tinggi.',
        symptoms: [
            'Bercak kecil berair dengan warna kuning kehijauan',
            'Daun tua menunjukkan luka gelap dan berminyak',
            'Tepi bercak sering memiliki lingkaran kuning',
            'Daun yang terinfeksi parah akan menguning dan rontok'
        ],
        treatments: [
            'Gunakan bakterisida berbahan aktif tembaga sebagai pelindung',
            'Rendam benih dalam air panas (50°C) selama 25 menit sebelum tanam',
            'Cabut dan musnahkan tanaman yang terinfeksi parah agar tidak menular',
            'Kurangi pemupukan nitrogen yang berlebihan'
        ],
        prevention: [
            { icon: '🔄', label: 'Rotasi Tanaman', tip: 'Ganti dengan tanaman non-solanaceae' },
            { icon: '🚿', label: 'Irigasi Tepat', tip: 'Hindari menyiram dari atas daun' },
            { icon: '🌱', label: 'Benih Unggul', tip: 'Gunakan benih bersertifikat bebas bakteri' }
        ],
        tags: [
            { label: 'Bacterial Disease', type: 'error' },
            { label: 'Act Quickly', type: 'warning' },
            { label: 'Treatable', type: 'primary' }
        ]
    },
    'Early blight': {
        name: 'Early Blight',
        sciName: 'Alternaria solani',
        description: 'Jamur yang biasanya menyerang daun tua di bagian bawah terlebih dahulu, ditandai dengan pola target yang khas.',
        symptoms: [
            'Bercak coklat tua melingkar dengan cincin konsentris (pola target)',
            'Bercak pertama kali muncul pada daun yang paling tua',
            'Batang tanaman mungkin menunjukkan luka coklat yang cekung',
            'Daun menguning dan rontok seiring penyebaran penyakit'
        ],
        treatments: [
            'Semprot fungisida berbahan aktif Mankozeb atau Klorotalonil',
            'Pangkas daun bagian bawah untuk meningkatkan sirkulasi udara',
            'Pastikan tanaman mendapatkan nutrisi cukup untuk daya tahan',
            'Gunakan mulsa organik untuk mencegah percikan spora dari tanah'
        ],
        prevention: [
            { icon: '📏', label: 'Jarak Tanam', tip: 'Minimal 45-60cm antar tanaman' },
            { icon: '🧹', label: 'Sanitasi Lahan', tip: 'Bersihkan sisa tanaman musim lalu' },
            { icon: '🩹', label: 'Mulsa Tanah', tip: 'Cegah spora naik saat disiram' }
        ],
        tags: [
            { label: 'Fungal Disease', type: 'error' },
            { label: 'Act Quickly', type: 'warning' },
            { label: 'Treatable', type: 'primary' }
        ]
    },
    'Late blight': {
        name: 'Late Blight',
        sciName: 'Phytophthora infestans',
        description: 'Salah satu penyakit tomat paling merusak yang dapat mematikan seluruh lahan dalam hitungan hari jika cuaca lembab.',
        symptoms: [
            'Bercak basah berwarna hijau gelap atau abu-abu pada daun',
            'Lapisan putih seperti kapas di bagian bawah daun saat lembab',
            'Batang berubah menjadi coklat hitam dan mudah patah',
            'Buah mengalami pembusukan coklat yang keras dan berkerut'
        ],
        treatments: [
            'Semprotkan fungisida sistemik segera setelah gejala terlihat',
            'Musnahkan (bakar) tanaman yang terinfeksi segera, jangan dijadikan kompos',
            'Hentikan penyiraman jika sedang terjadi wabah di sekitar lahan',
            'Gunakan varietas yang memiliki ketahanan terhadap Phytophthora'
        ],
        prevention: [
            { icon: '🚫', label: 'Isolasi', tip: 'Jangan menanam dekat tanaman kentang' },
            { icon: '☀️', label: 'Lokasi Tanam', tip: 'Pilih area dengan sinar matahari penuh' },
            { icon: '🛡️', label: 'Proteksi Preventif', tip: 'Semprot fungisida sebelum musim hujan' }
        ],
        tags: [
            { label: 'Fungal Disease', type: 'error' },
            { label: 'Highly Dangerous', type: 'warning' },
            { label: 'Urgent Care', type: 'primary' }
        ]
    },
    'Leaf Mold': {
        name: 'Leaf Mold',
        sciName: 'Passalora fulva',
        description: 'Penyakit jamur yang berkembang pesat di lingkungan dengan kelembaban sangat tinggi dan sirkulasi udara buruk.',
        symptoms: [
            'Bercak hijau pucat atau kuning di permukaan atas daun',
            'Lapisan beludru berwarna coklat zaitun di bawah daun',
            'Daun menggulung, layu, dan akhirnya mengering',
            'Sangat jarang menyerang buah, tetapi menurunkan produksi'
        ],
        treatments: [
            'Semprot fungisida berbahan tembaga atau belerang',
            'Tingkatkan ventilasi udara di area penanaman',
            'Jaga agar daun tetap kering selama penyiraman',
            'Gunakan jarak tanam yang lebih lebar'
        ],
        prevention: [
            { icon: '🌬️', label: 'Ventilasi', tip: 'Pastikan aliran udara lancar' },
            { icon: '✂️', label: 'Pemangkasan', tip: 'Buang daun yang terlalu rimbun' },
            { icon: '🌡️', label: 'Kontrol Kelembaban', tip: 'Usahakan RH di bawah 85%' }
        ],
        tags: [
            { label: 'Fungal Disease', type: 'error' },
            { label: 'High Humidity', type: 'warning' },
            { label: 'Preventable', type: 'primary' }
        ]
    },
    'Septoria leaf spot': {
        name: 'Septoria Leaf Spot',
        sciName: 'Septoria lycopersici',
        description: 'Jamur daun yang sering dikelirukan dengan hawar awal, namun biasanya memiliki titik-titik hitam kecil di tengahnya.',
        symptoms: [
            'Bercak bulat kecil dengan pusat abu-abu dan tepi gelap',
            'Titik-titik hitam kecil (piknidia) di tengah bercak',
            'Daun bawah terinfeksi lebih dulu, menyebar ke atas',
            'Menyebabkan kerontokan daun yang parah namun buah tetap sehat'
        ],
        treatments: [
            'Aplikasi fungisida Mankozeb atau Tembaga Hidroksida setiap 7 hari',
            'Buang daun yang terinfeksi di awal serangan',
            'Cuci tangan setelah memegang tanaman sakit',
            'Jangan menyentuh tanaman saat kondisi basah'
        ],
        prevention: [
            { icon: '🧹', label: 'Bersihkan Lahan', tip: 'Buang inang gulma solanaceous' },
            { icon: '📅', label: 'Jadwal Tanam', tip: 'Gunakan rotasi 3 tahun' },
            { icon: '💧', label: 'Aliran Air', tip: 'Perbaiki drainase agar tidak menggenang' }
        ],
        tags: [
            { label: 'Fungal Disease', type: 'error' },
            { label: 'Leaf Issue', type: 'warning' },
            { label: 'Treatable', type: 'primary' }
        ]
    },
    'Spider mites Two-spotted_spider_mite': {
        name: 'Spider Mites',
        sciName: 'Tetranychus urticae',
        description: 'Hama mikroskopis pengisap cairan daun yang sangat aktif dalam kondisi cuaca panas dan kering.',
        symptoms: [
            'Titik-titik kuning kecil (stippling) di permukaan daun',
            'Jaring halus seperti laba-laba di bagian bawah daun',
            'Daun berubah warna menjadi perunggu atau coklat',
            'Tanaman terlihat layu meskipun air cukup'
        ],
        treatments: [
            'Gunakan akarisida (Abamektin) sesuai dosis',
            'Semprotkan air dengan tekanan kuat ke bawah daun',
            'Gunakan sabun insektisida atau minyak neem di sore hari',
            'Lestarikan predator alami seperti kumbang kecil'
        ],
        prevention: [
            { icon: '🌡️', label: 'Suhu Lahan', tip: 'Jaga lahan tidak terlalu kering/panas' },
            { icon: '🦟', label: 'Musuh Alami', tip: 'Gunakan predator alami tungau' },
            { icon: '🔍', label: 'Cek Rutin', tip: 'Amati bagian bawah daun tiap pagi' }
        ],
        tags: [
            { label: 'Plant Pest', type: 'error' },
            { label: 'Dry Weather', type: 'warning' },
            { label: 'Eradicable', type: 'primary' }
        ]
    },
    'Target Spot': {
        name: 'Target Spot',
        sciName: 'Corynespora cassiicola',
        description: 'Penyakit jamur yang menyebabkan bercak yang sangat mirip dengan Early Blight tetapi pusatnya sering pecah.',
        symptoms: [
            'Bercak bulat coklat dengan cincin konsentris yang rapi',
            'Pusat bercak seringkali rapuh dan mudah bolong',
            'Luka pada batang dan tangkai daun',
            'Bercak pada buah berukuran kecil dan berlesung'
        ],
        treatments: [
            'Semprot fungisida berbahan aktif Azoksistrobin',
            'Pastikan sanitasi lahan bersih dari tanaman inang kain',
            'Kurangi kelembaban dengan pemangkasan rutin',
            'Jangan menanam di lahan bekas tanaman timun/kedelai'
        ],
        prevention: [
            { icon: '🩹', label: 'Proteksi Benih', tip: 'Gunakan benih yang sudah diberi fungisida' },
            { icon: '🌬️', label: 'Alir Udara', tip: 'Pangkas tunas air yang tidak perlu' },
            { icon: '🔄', label: 'Pola Tanam', tip: 'Hindari inang bersilangan' }
        ],
        tags: [
            { label: 'Fungal Disease', type: 'error' },
            { label: 'Blight-like', type: 'warning' },
            { label: 'Treatable', type: 'primary' }
        ]
    },
    'Tomato Yellow Leaf Curl Virus': {
        name: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
        sciName: 'Begomovirus',
        description: 'Virus berbahaya yang dibawa oleh hama kutu kebul (whitefly). Dapat menyebabkan kegagalan panen total.',
        symptoms: [
            'Tepi daun menggulung ke arah atas secara mencolok',
            'Warna daun menjadi kuning terang atau pucat',
            'Tanaman menjadi kerdil dan ruas batang memendek',
            'Bunga rontok dan tanaman berhenti menghasilkan buah'
        ],
        treatments: [
            'Tidak ada obat untuk virus; cabut dan bakar tanaman terinfeksi',
            'Kendalikan vektor (kutu kebul) dengan insektisida rutin',
            'Gunakan mulsa reflektif (perak) untuk mengusir serangga',
            'Gunakan perangkap kuning berperekat di sekitar lahan'
        ],
        prevention: [
            { icon: '🦟', label: 'Kontrol Hama', tip: 'Basmi kutu kebul sejak dini' },
            { icon: '🥅', label: 'Kelambu Tanaman', tip: 'Gunakan jaring serangga halus' },
            { icon: '🚫', label: 'Bibit Sehat', tip: 'Pastikan bibit bebas virus sejak semai' }
        ],
        tags: [
            { label: 'Viral Infection', type: 'error' },
            { label: 'Whitefly Vektor', type: 'warning' },
            { label: 'No Remedy', type: 'primary' }
        ]
    },
    'Tomato mosaic virus': {
        name: 'Tomato Mosaic Virus (TMV)',
        sciName: 'Tomato Mosaic Virus',
        description: 'Virus yang sangat stabil dan mudah menular hanya melalui kontak fisik atau alat pertanian yang kotor.',
        symptoms: [
            'Pola belang hijau muda dan tua (mosaik) pada daun',
            'Daun mengerut atau berubah bentuk menjadi sempit',
            'Bercak coklat di dalam daging buah tomat',
            'Pertumbuhan tanaman terhambat secara umum'
        ],
        treatments: [
            'Segera musnahkan tanaman yang menunjukkan gejala',
            'Sterilkan semua alat pertanian dengan alkohol atau pemutih',
            'Cuci tangan dengan sabun setelah memegang tanaman sakit',
            'Jangan merokok di dekat tanaman (virus ada di tembakau)'
        ],
        prevention: [
            { icon: '🛡️', label: 'Varietas Tahan', tip: 'Pilih benih dengan kode ketahanan TMV' },
            { icon: '🧼', label: 'Kebersihan', tip: 'Terapkan protokol sanitasi ketat' },
            { icon: '🚫', label: 'Interaksi Terbatas', tip: 'Kurangi kontak fisik antar tanaman' }
        ],
        tags: [
            { label: 'Viral Infection', type: 'error' },
            { label: 'Highly Stable', type: 'warning' },
            { label: 'Strict Protocol', type: 'primary' }
        ]
    },
    'healthy': {
        name: 'Healthy',
        sciName: 'Solanum lycopersicum',
        description: 'Tanaman tomat Bapak terlihat optimal dan tidak menunjukkan gejala penyakit patogen yang nyata.',
        symptoms: [
            'Daun berwarna hijau segar dan merata',
            'Tekstur daun kaku dan batang kokoh',
            'Tunas baru tumbuh aktif tanpa hambatan',
            'Bunga dan buah terbentuk secara normal'
        ],
        treatments: [
            'Lanjutkan pemupukan sesuai jadwal (fase vegetatif/generatif)',
            'Penyiraman rutin secukupnya (hindari genangan)',
            'Monitor kebersihan lahan dari gulma secara berkala',
            'Berikan kalsium untuk mencegah busuk ujung buah (BER)'
        ],
        prevention: [
            { icon: '🔍', label: 'Monitoring', tip: 'Cek kondisi tanaman setiap pagi' },
            { icon: '🌿', label: 'Nutrisi Seimbang', tip: 'Gunakan pupuk NPK sesuai dosis' },
            { icon: '☀️', label: 'Cahaya Cukup', tip: 'Pastikan sinar matahari minimal 6 jam' }
        ],
        tags: [
            { label: 'Healthy Plant', type: 'primary' },
            { label: 'Good Vigor', type: 'warning' },
            { label: 'Optimal', type: 'primary' }
        ]
    }
};

export default function ResultsPage({ onNavigate, previewUrl, scanResult }) {
    // Dynamic resolution from the expert database
    const rawName = scanResult?.name || 'healthy';

    // Robust lookup: try exact match first, then normalized
    let dbEntry = DISEASE_DATABASE[rawName];

    if (!dbEntry && scanResult?.name) {
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
        const target = normalize(rawName);
        const foundKey = Object.keys(DISEASE_DATABASE).find(k => normalize(k) === target);
        if (foundKey) dbEntry = DISEASE_DATABASE[foundKey];
    }

    if (!dbEntry) dbEntry = DISEASE_DATABASE['healthy'];

    const resultData = {
        ...dbEntry,
        confidence: scanResult?.confidence || 0,
        severity: scanResult?.severity || 'Normal',
        severityClass: scanResult?.severityClass || 'severity-none',
        note: scanResult?.note,
        condition: scanResult?.condition, // New field from backend
        damage_pct: scanResult?.damage_pct || 0,
        related: scanResult?.related || []
    };

    const isLowConfidence = rawName === "Hasil Kurang Meyakinkan";

    if (isLowConfidence) {
        resultData.description = scanResult.note || "AI kami ragu dengan gambar ini. Hal ini biasanya terjadi karena cahaya redup, kamera goyang, atau jarak daun terlalu jauh.";
        resultData.severity = "Tidak Pasti";
        resultData.severityClass = "severity-warning";
        resultData.symptoms = ["Gangguan visual terdeteksi", "Fitur kurang jelas"];
        resultData.treatments = ["Foto ulang dengan cahaya lebih terang", "Dekatkan kamera ke permukaan daun"];
        resultData.tags = [
            { label: 'Uncertain', type: 'warning' },
            { label: 'Re-scan', type: 'primary' }
        ];
    }

    return (
        <div className="results-page">
            {/* Header */}
            <div className="results-header">
                <button
                    id="results-back-btn"
                    className="results-back-btn"
                    onClick={() => onNavigate('scan')}
                    title="Back to scan"
                >
                    <ArrowLeftIcon size={18} />
                </button>
                <div className="results-header__info">
                    <h1 className="results-header__title">Hasil Diagnosa</h1>
                    <div className="results-header__meta">
                        <ClockIcon size={13} color="currentColor" />
                        <span>Analisis selesai</span>
                        <span style={{ color: 'var(--color-border)' }}>·</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>Proses Lokal (Tanpa Database)</span>
                    </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => onNavigate('scan')}>
                        <RefreshIcon size={14} />
                        Pindai Baru
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <DownloadIcon size={14} color="white" />
                        Ekspor Laporan
                    </button>
                </div>
            </div>

            <div className="results-grid">
                {isLowConfidence && (
                    <div className="confidence-warning-banner">
                        <div className="confidence-warning-banner__icon">⚠️</div>
                        <div className="confidence-warning-banner__content">
                            <div className="confidence-warning-banner__title">Hasil Kurang Meyakinkan</div>
                            <div className="confidence-warning-banner__text">
                                AI kami kesulitan menganalisis foto ini. {resultData.description}
                            </div>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={() => onNavigate('scan')}>Ambil Ulang</button>
                    </div>
                )}
                {/* Left: Disease Card */}
                <div className="disease-card">
                    <div className="disease-card__image-wrap">
                        {previewUrl ? (
                            <img className="disease-card__image" src={previewUrl} alt="Analyzed plant" />
                        ) : (
                            <div className="img-placeholder" style={{ width: '100%', height: '100%' }}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="m21 15-5-5L5 21" />
                                </svg>
                            </div>
                        )}
                        <span className={`disease-card__severity-badge ${resultData.severityClass}`}>
                            {resultData.severity === 'High' ? 'Keparahan Tinggi' : resultData.severity}
                        </span>
                        {resultData.name !== 'Healthy' && !isLowConfidence && (
                            <div className="damage-indicator">
                                <span className="damage-indicator__label">Index Kerusakan</span>
                                <span className="damage-indicator__value">{resultData.damage_pct}%</span>
                            </div>
                        )}
                    </div>

                    <div className="disease-card__body">
                        <div className="disease-card__name">{resultData.name}</div>
                        <div className="disease-card__sci-name">{resultData.sciName}</div>

                        {/* Tags moved to match image exactly */}
                        <div className="disease-card__tags">
                            {resultData.tags?.map((tag, i) => (
                                <span key={i} className={`tag tag-${tag.type}`}>{tag.label}</span>
                            ))}
                        </div>

                        {/* Other detections */}
                        <div style={{ marginTop: '18px' }}>
                            <div
                                style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.4px',
                                    marginBottom: '10px',
                                }}
                            >
                                Kemungkinan Lain
                            </div>
                            <div className="related-list">
                                {resultData.related.map((r, i) => (
                                    <div className="related-item" key={i}>
                                        <div className="related-item__name">{r.name}</div>
                                        <div className="related-item__bar-wrap" style={{ width: '60px' }}>
                                            <div className="related-item__bar">
                                                <div className="related-item__bar-fill" style={{ width: `${r.pct * 10}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Details */}
                <div className="results-content">
                    {/* Description */}
                    <div className="result-section">
                        <div className="result-section__title">
                            <div className="result-section__title-icon">📋</div>
                            Ikhtisar Penyakit
                        </div>
                        {resultData.condition && (
                            <p className="result-condition-msg" style={{
                                fontWeight: '600',
                                color: 'var(--color-primary)',
                                padding: '10px',
                                background: 'var(--color-primary-bg)',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                fontSize: '14px'
                            }}>
                                💡 {resultData.condition}
                            </p>
                        )}
                        <p className="result-desc">{resultData.description}</p>
                    </div>

                    {/* Symptoms */}
                    <div className="result-section">
                        <div className="result-section__title">
                            <div className="result-section__title-icon">🔍</div>
                            Gejala Utama
                        </div>
                        <div className="symptoms-list">
                            {resultData.symptoms.map((s, i) => (
                                <div className="symptom-item" key={i}>
                                    <span className="symptom-dot" />
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Treatment */}
                    <div className="result-section">
                        <div className="result-section__title">
                            <div className="result-section__title-icon">💊</div>
                            Saran Perawatan {resultData.severity === 'High' ? '(Tindakan Intensif)' : '(Tindakan Awal)'}
                        </div>
                        <div className="treatment-list">
                            {(resultData.severity === 'High'
                                ? [...resultData.treatments].reverse() // Show most critical first if high severity
                                : resultData.treatments
                            ).map((t, i) => (
                                <div className="treatment-item" key={i}>
                                    <div className="treatment-item__num" style={resultData.severity === 'High' && i === 0 ? { background: 'var(--color-error)', color: 'white' } : {}}>{i + 1}</div>
                                    <span className="treatment-item__text" style={resultData.severity === 'High' && i === 0 ? { fontWeight: '700' } : {}}>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Prevention */}
                    <div className="result-section">
                        <div className="result-section__title">
                            <div className="result-section__title-icon">🛡️</div>
                            Strategi Pencegahan
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {resultData.prevention.map((p, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'var(--color-surface-2)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '14px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                    }}
                                >
                                    <span style={{ fontSize: '22px' }}>{p.icon}</span>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>{p.label}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{p.tip}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '12px',
                            padding: '20px',
                            background: 'linear-gradient(135deg, var(--color-primary-bg), var(--color-surface))',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--color-border)',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>
                                Butuh saran ahli?
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                                Hubungi agronomis bersertifikat untuk panduan lebih lanjut.
                            </div>
                        </div>
                        <button className="btn btn-primary">Hubungi Ahli</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { ArrowLeftIcon, DownloadIcon, RefreshIcon, CheckCircleIcon, ClockIcon, DropletIcon, SunIcon } from '../icons.jsx';

const DISEASE_DATA = {
    name: 'Early Blight',
    sciName: 'Alternaria solani',
    confidence: 94,
    severity: 'High',
    severityClass: 'severity-high',
    description:
        'Early Blight is a common fungal disease caused by Alternaria solani. It typically appears on older leaves first, moving upward through the plant. The disease can significantly reduce yield if left untreated and thrives in warm, humid conditions with overhead irrigation.',
    symptoms: [
        'Dark brown concentric rings forming "target" pattern',
        'Yellow halo surrounding lesion',
        'Lesions first appear on oldest leaves',
        'Defoliation of lower leaves',
        'Dark, sunken lesions on stem',
        'Brown spots on fruit near stem',
    ],
    treatments: [
        'Remove and destroy all infected plant material immediately',
        'Apply copper-based fungicide every 7–10 days during wet weather',
        'Use mancozeb or chlorothalonil as preventative treatment',
        'Improve air circulation by proper plant spacing (45–60cm)',
        'Water at base of plants only — avoid wetting foliage',
        'Apply organic mulch to prevent soil splash',
    ],
    prevention: [
        { icon: '💧', label: 'Water Management', tip: 'Drip irrigation only, morning watering' },
        { icon: '🌬️', label: 'Air Circulation', tip: 'Space plants 45–60cm apart' },
        { icon: '🔄', label: 'Crop Rotation', tip: 'Rotate with non-solanaceous crops' },
    ],
    related: [
        { name: 'Late Blight', pct: 3 },
        { name: 'Septoria Leaf Spot', pct: 2 },
        { name: 'Healthy', pct: 1 },
    ],
};

export default function ResultsPage({ onNavigate, previewUrl }) {
    const [confWidth, setConfWidth] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => setConfWidth(DISEASE_DATA.confidence), 200);
        return () => clearTimeout(t);
    }, []);

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
                    <h1 className="results-header__title">Diagnosis Results</h1>
                    <div className="results-header__meta">
                        <ClockIcon size={13} color="currentColor" />
                        <span>Analysis completed in 2.4 seconds</span>
                        <span style={{ color: 'var(--color-border)' }}>·</span>
                        <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>✓ AI Verified</span>
                    </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => onNavigate('scan')}>
                        <RefreshIcon size={14} />
                        New Scan
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <DownloadIcon size={14} color="white" />
                        Export Report
                    </button>
                </div>
            </div>

            <div className="results-grid">
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
                        <span className={`disease-card__severity-badge ${DISEASE_DATA.severityClass}`}>
                            {DISEASE_DATA.severity} Severity
                        </span>
                    </div>

                    <div className="disease-card__body">
                        <div className="disease-card__name">{DISEASE_DATA.name}</div>
                        <div className="disease-card__sci-name">{DISEASE_DATA.sciName}</div>

                        <div className="confidence-row">
                            <span className="confidence-label">AI Confidence</span>
                            <span className="confidence-value">{DISEASE_DATA.confidence}%</span>
                        </div>
                        <div className="confidence-bar">
                            <div className="confidence-bar__fill" style={{ width: `${confWidth}%` }} />
                        </div>

                        <div className="disease-card__tags">
                            <span className="tag tag-error">Fungal Disease</span>
                            <span className="tag tag-warning">Act Quickly</span>
                            <span className="tag tag-primary">Treatable</span>
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
                                Other Possibilities
                            </div>
                            <div className="related-list">
                                {DISEASE_DATA.related.map((r, i) => (
                                    <div className="related-item" key={i}>
                                        <div className="related-item__bar-wrap">
                                            <div className="related-item__name">{r.name}</div>
                                            <div className="related-item__bar">
                                                <div className="related-item__bar-fill" style={{ width: `${r.pct * 10}%` }} />
                                            </div>
                                        </div>
                                        <span className="related-item__pct">{r.pct}%</span>
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
                            Disease Overview
                        </div>
                        <p className="result-desc">{DISEASE_DATA.description}</p>
                    </div>

                    {/* Symptoms */}
                    <div className="result-section">
                        <div className="result-section__title">
                            <div className="result-section__title-icon">🔍</div>
                            Key Symptoms
                        </div>
                        <div className="symptoms-list">
                            {DISEASE_DATA.symptoms.map((s, i) => (
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
                            Recommended Treatment
                        </div>
                        <div className="treatment-list">
                            {DISEASE_DATA.treatments.map((t, i) => (
                                <div className="treatment-item" key={i}>
                                    <div className="treatment-item__num">{i + 1}</div>
                                    <span className="treatment-item__text">{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Prevention */}
                    <div className="result-section">
                        <div className="result-section__title">
                            <div className="result-section__title-icon">🛡️</div>
                            Prevention Strategies
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {DISEASE_DATA.prevention.map((p, i) => (
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
                                Need expert advice?
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                                Connect with a certified agronomist for personalized guidance.
                            </div>
                        </div>
                        <button className="btn btn-primary">Contact Expert</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

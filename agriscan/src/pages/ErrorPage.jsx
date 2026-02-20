import { ArrowLeftIcon, RefreshIcon, UploadIcon } from '../icons.jsx';

const TIPS = {
    no_tomato: [
        { icon: '🍅', text: 'Ensure the image clearly shows tomato plant leaves, fruit, or stem' },
        { icon: '🔍', text: 'Avoid images with multiple plant types in frame' },
        { icon: '📐', text: 'Center the tomato plant in your photo' },
        { icon: '💡', text: 'Good lighting helps the AI identify the plant correctly' },
    ],
    blurry: [
        { icon: '🔍', text: 'Hold the camera steady — use a tripod or rest against a surface' },
        { icon: '☀️', text: 'Ensure adequate lighting so the camera can focus' },
        { icon: '📏', text: 'Keep 15–30cm distance from the leaf for best focus' },
        { icon: '⏱️', text: 'Wait for the camera to autofocus before capturing' },
    ],
};

export default function ErrorPage({ onNavigate, errorType = 'no_tomato', previewUrl }) {
    const isBlurry = errorType === 'blurry';

    const config = {
        no_tomato: {
            badgeIcon: '🔍',
            badgeTitle: 'No Tomato Detected',
            badgeSubtitle: 'Unable to identify tomato plant',
            bodyTitle: 'No Tomato Plant Found in Image',
            bodyDesc:
                "Our AI couldn't detect any tomato plant tissue in the uploaded image. This may be because the image doesn't contain a tomato plant, the plant is not clearly visible, or the resolution is too low for accurate detection.",
            tipsTitle: 'How to get better results',
        },
        blurry: {
            badgeIcon: '⚠️',
            badgeTitle: 'Image Quality Issue',
            badgeSubtitle: 'Photo is too blurry for analysis',
            bodyTitle: 'Image Too Blurry to Analyze',
            bodyDesc:
                "The uploaded image doesn't have sufficient sharpness for our AI to perform accurate disease detection. Blurry images cause false positives and unreliable results, so we require clear, focused photographs.",
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
                            Analysis Failed
                        </h1>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                            We encountered an issue with your image
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
                                Tips for better photos
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
                            Try Again with New Photo
                        </button>
                        <button
                            className="btn btn-outline btn-lg"
                            style={{ flex: 1 }}
                            onClick={() => onNavigate('home')}
                        >
                            <RefreshIcon size={16} />
                            Back to Home
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
                        Still having trouble?{' '}
                        <a href="#" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            View photo guidelines
                        </a>{' '}
                        or{' '}
                        <a href="#" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            contact support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

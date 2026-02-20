import { LeafIcon } from '../icons.jsx';

export default function Navbar({ onNavigate, activePage }) {
    return (
        <nav className="navbar">
            <div className="navbar__inner">
                {/* Logo */}
                <div className="navbar__logo" style={{ cursor: 'pointer' }} onClick={() => onNavigate('home')}>
                    <div className="navbar__logo-icon">
                        <LeafIcon size={20} color="white" />
                    </div>
                    <span className="navbar__logo-text">
                        Agri<span>Scan</span> AI
                    </span>
                </div>

                {/* Navigation Links */}
                <div className="navbar__nav">
                    <button
                        className={`navbar__nav-item ${activePage === 'home' ? 'active' : ''}`}
                        onClick={() => onNavigate('home')}
                    >
                        Home
                    </button>
                    <button
                        className={`navbar__nav-item ${activePage === 'scan' ? 'active' : ''}`}
                        onClick={() => onNavigate('scan')}
                    >
                        Scan
                    </button>
                    <button className="navbar__nav-item">Database</button>
                    <button className="navbar__nav-item">About</button>
                </div>

                {/* CTA */}
                <div className="navbar__cta">
                    <button className="btn btn-outline">Sign In</button>
                    <button
                        className="btn btn-primary"
                        onClick={() => onNavigate('scan')}
                    >
                        Try Free
                    </button>
                </div>
            </div>
        </nav>
    );
}

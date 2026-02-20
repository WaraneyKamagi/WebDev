import { useState } from 'react';
import './index.css';
import './App.css';

import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ScanPage from './pages/ScanPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

export default function App() {
  const [page, setPage] = useState('home');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Demo mode: clicking "Force Error" shows error states
  const [demoError, setDemoError] = useState(null);

  const navigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileSelected = (file) => {
    setUploadedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setDemoError(null);
    navigate('scanning');
  };

  // Simple page routing
  const navPage = page === 'scanning' ? 'scan' : page;

  return (
    <div className="app">
      {/* Background decorations */}
      <div className="bg-decoration">
        <div className="bg-blob bg-blob--1" />
        <div className="bg-blob bg-blob--2" />
      </div>

      <Navbar onNavigate={navigate} activePage={navPage} />

      <div className="page-content">
        {/* Demo toolbar for navigating states */}
        <div
          style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '8px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontWeight: '600', color: 'var(--color-text-secondary)', flexShrink: 0 }}>View Screens:</span>
          {[
            { label: '🏠 Landing', target: 'home' },
            { label: '📷 Scan Upload', target: 'scan' },
            { label: '⚡ AI Scanning', target: 'scanning' },
            { label: '✅ Results', target: 'results' },
            { label: '🔍 No Tomato Error', target: 'error_no_tomato' },
            { label: '⚠️ Blurry Error', target: 'error_blurry' },
          ].map((item) => (
            <button
              key={item.target}
              onClick={() => {
                if (item.target.startsWith('error_')) {
                  setDemoError(item.target.replace('error_', ''));
                  setPage('error');
                } else {
                  setDemoError(null);
                  setPage(item.target);
                }
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                background: page === item.target || (page === 'error' && item.target === `error_${demoError}`)
                  ? 'var(--color-primary)'
                  : 'var(--color-surface)',
                color: page === item.target || (page === 'error' && item.target === `error_${demoError}`)
                  ? 'white'
                  : 'var(--color-text-secondary)',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                fontWeight: '500',
                flexShrink: 0,
                transition: 'all 150ms ease',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Page Routing */}
        {page === 'home' && (
          <HomePage
            onNavigate={navigate}
            onFileSelected={handleFileSelected}
          />
        )}

        {(page === 'scan' || page === 'scanning') && (
          <ScanPage
            onNavigate={navigate}
            uploadedFile={page === 'scanning' ? uploadedFile : null}
            onFileSelected={handleFileSelected}
          />
        )}

        {page === 'results' && (
          <ResultsPage
            onNavigate={navigate}
            previewUrl={previewUrl}
          />
        )}

        {page === 'error' && (
          <ErrorPage
            onNavigate={navigate}
            errorType={demoError || 'no_tomato'}
            previewUrl={previewUrl}
          />
        )}
      </div>
    </div>
  );
}

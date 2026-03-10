import { useState } from 'react';
import './index.css';

import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ScanPage from './pages/ScanPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

export default function App() {
  const [page, setPage] = useState('home');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [scanResult, setScanResult] = useState(null);
  const [demoError, setDemoError] = useState(null);

  const navigate = (target, params = {}) => {
    if (params.scanResult) {
      setScanResult(params.scanResult);
    }
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      <Navbar onNavigate={navigate} activePage={navPage} />

      <main className="w-full">

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
            scanResult={scanResult}
          />
        )}

        {page === 'error' && (
          <ErrorPage
            onNavigate={navigate}
            errorType={demoError || 'no_tomato'}
            previewUrl={previewUrl}
          />
        )}
      </main>
    </div>
  );
}

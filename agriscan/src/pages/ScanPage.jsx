import { useState, useRef, useEffect } from 'react';

export default function ScanPage({ onNavigate, uploadedFile, onFileSelected }) {
    const [dragover, setDragover] = useState(false);
    const fileRef = useRef();

    const [scanning, setScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(null);

    const STEPS = [
        "Inisialisasi sistem visi AI...",
        "Mengekstrak fitur daun tomat...",
        "Menganalisis pola penyakit...",
        "Mencocokkan dengan database patogen...",
        "Menghasilkan laporan final..."
    ];

    const previewUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : null;

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragover(false);
        if (scanning) return;
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            onFileSelected(file);
        }
    };

    const handleFileChange = (e) => {
        if (scanning) return;
        const file = e.target.files[0];
        if (file) {
            onFileSelected(file);
        }
    };

    const startScan = async () => {
        if (!uploadedFile) return;

        setScanning(true);
        setError(null);
        setScanProgress(0);
        setCurrentStep(0);

        // Simulate progress steps visually
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < STEPS.length - 1) return prev + 1;
                return prev;
            });
        }, 800);

        const progressInterval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 95) return 95;
                return prev + 5;
            });
        }, 150);

        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);

            const apiUrl = import.meta.env.VITE_AI_API_URL || 'http://localhost:8002/predict';

            console.log('Sending request to API:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            console.log('API Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Success Response:', data);

            clearInterval(stepInterval);
            clearInterval(progressInterval);
            setScanProgress(100);
            setCurrentStep(STEPS.length - 1);

            setTimeout(() => {
                onNavigate('results', { scanResult: data, previewUrl });
            }, 600);

        } catch (err) {
            console.error('Fetch error:', err);
            clearInterval(stepInterval);
            clearInterval(progressInterval);
            setScanning(false);
            setError(err.message || 'Gagal menghubungi server AI. Pastikan server backend berjalan.');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header elements */}
                <div className="mb-8">
                    <button
                        className="flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-4 group"
                        onClick={() => onNavigate('home')}
                        disabled={scanning}
                    >
                        <span className="material-icons-round text-lg mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Upload Crop Image</h1>
                    <p className="text-slate-600 dark:text-slate-400">Provide a clear image of the affected plant for the most accurate diagnosis.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Upload/Scanning Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                                <span className="material-icons-round text-red-500 mt-0.5">error_outline</span>
                                <div>
                                    <h4 className="text-sm font-bold text-red-800 dark:text-red-300">Analysis Failed</h4>
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                                </div>
                                <button className="ml-auto text-red-400 hover:text-red-600" onClick={() => setError(null)}>
                                    <span className="material-icons-round text-sm">close</span>
                                </button>
                            </div>
                        )}

                        <div
                            className={`bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed ${dragover ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-700'} p-8 md:p-12 text-center transition-all duration-300`}
                            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
                            onDragLeave={() => setDragover(false)}
                            onDrop={handleDrop}
                        >
                            {!uploadedFile ? (
                                <>
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                        <span className="material-icons-round">add_photo_alternate</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Click or drag image here</h3>
                                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">Upload a clear, well-lit photo of the affected plant part to ensure accurate AI analysis.</p>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <button
                                            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md shadow-primary/20 flex items-center gap-2"
                                            onClick={() => fileRef.current?.click()}
                                        >
                                            <span className="material-icons-round">folder_open</span>
                                            Browse Files
                                        </button>
                                        <button
                                            className="bg-white dark:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                                            onClick={() => fileRef.current?.click()}
                                        >
                                            <span className="material-icons-round">camera_alt</span>
                                            Use Camera
                                        </button>
                                    </div>
                                    <div className="mt-8 text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center justify-center gap-2">
                                        <span>JPG</span>•<span>PNG</span>•<span>Max 10MB</span>
                                    </div>
                                </>
                            ) : (
                                <div className="max-w-md mx-auto relative group rounded-xl overflow-hidden shadow-lg border-2 border-slate-200 dark:border-slate-700">
                                    <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover aspect-[4/3]" />

                                    {scanning && (
                                        <>
                                            <div className="scan-line"></div>
                                            <div className="absolute inset-0 scan-overlay"></div>
                                        </>
                                    )}

                                    {/* Image Overlay (Visible on hover if not scanning) */}
                                    {!scanning && (
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                            <button
                                                className="bg-white/20 hover:bg-white text-white hover:text-slate-900 w-12 h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-md" title="Change Image"
                                                onClick={() => {
                                                    onFileSelected(null);
                                                    if (fileRef.current) fileRef.current.value = "";
                                                }}
                                            >
                                                <span className="material-icons-round">refresh</span>
                                            </button>
                                            <button
                                                className="bg-red-500/80 hover:bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-md" title="Remove Image"
                                                onClick={() => {
                                                    onFileSelected(null);
                                                    if (fileRef.current) fileRef.current.value = "";
                                                }}
                                            >
                                                <span className="material-icons-round">delete_outline</span>
                                            </button>
                                        </div>
                                    )}

                                </div>
                            )}
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                disabled={scanning}
                            />
                        </div>

                        {/* Action Bar (Only when file is uploaded) */}
                        {uploadedFile && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                {!scanning ? (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="bg-green-100 text-green-700 p-3 rounded-xl flex-shrink-0">
                                                <span className="material-icons-round">image</span>
                                            </div>
                                            <div className="truncate flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{uploadedFile.name}</p>
                                                <p className="text-xs text-slate-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                                            onClick={startScan}
                                        >
                                            <span className="material-icons-round">document_scanner</span>
                                            Analyze Image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">Analyzing Crop...</h4>
                                                <p className="text-sm text-slate-500">{STEPS[currentStep]}</p>
                                            </div>
                                            <span className="text-primary font-bold">{scanProgress}%</span>
                                        </div>
                                        {/* Progress Bar Container */}
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-primary h-3 rounded-full relative transition-all duration-300 ease-out"
                                                style={{ width: `${scanProgress}%` }}
                                            >
                                                {/* Shimmer effect inside progress bar */}
                                                <div className="absolute inset-0 bg-white/30" style={{
                                                    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                                    backgroundSize: '200% 100%',
                                                    animation: 'shimmer 2s infinite linear'
                                                }}></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium text-slate-400">
                                            <span>Processing AI Model</span>
                                            <span>Est. time remaining: 2s</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Guidelines */}
                    <div className="space-y-6">
                        {/* Photography Tips Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-icons-round text-primary">tips_and_updates</span>
                                Perfect Photo Guide
                            </h3>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-100 text-green-700 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                                        <span className="material-icons-round text-sm">wb_sunny</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Good Lighting</p>
                                        <p className="text-xs text-slate-500 mt-1">Ensure the affected area is well-lit and clearly visible without harsh shadows.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-100 text-green-700 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                                        <span className="material-icons-round text-sm">center_focus_strong</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Focus on Symptoms</p>
                                        <p className="text-xs text-slate-500 mt-1">Get close enough to capture spots, discoloration, or pests clearly.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-100 text-green-700 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                                        <span className="material-icons-round text-sm">filter_center_focus</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">One Leaf at a Time</p>
                                        <p className="text-xs text-slate-500 mt-1">Isolate the affected leaf against a clear background if possible for best results.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Bad Examples Card */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Things to Avoid</h3>
                            <div className="flex gap-4">
                                <div className="flex-1 text-center group cursor-not-allowed">
                                    <div className="w-full aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg mb-2 relative overflow-hidden backdrop-blur-sm">
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                                            <span className="material-icons-round text-white/80 text-3xl">blur_on</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium group-hover:text-red-500 transition-colors">Too Blurry</span>
                                </div>
                                <div className="flex-1 text-center group cursor-not-allowed">
                                    <div className="w-full aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg mb-2 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                            <span className="material-icons-round text-white/80 text-3xl">brightness_medium</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium group-hover:text-red-500 transition-colors">Too Dark</span>
                                </div>
                                <div className="flex-1 text-center group cursor-not-allowed">
                                    <div className="w-full aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg mb-2 flex items-center justify-center relative border border-slate-300">
                                        <span className="material-icons-round text-slate-400 text-sm absolute top-1 right-1">zoom_out_map</span>
                                        <span className="material-icons-round text-primary text-xl">eco</span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium group-hover:text-red-500 transition-colors">Too Far</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

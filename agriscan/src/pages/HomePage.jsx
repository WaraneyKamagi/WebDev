import { useState, useRef } from 'react';

export default function HomePage({ onNavigate, onFileSelected }) {
    const [dragover, setDragover] = useState(false);
    const fileRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        setDragover(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            onFileSelected(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelected(file);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-40 pointer-events-none"></div>
                <div className="blob-bg bg-primary w-96 h-96 rounded-full -top-20 -left-20 animate-pulse"></div>
                <div className="blob-bg bg-green-300 w-80 h-80 rounded-full top-40 right-0 opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Text Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
                                <span className="material-icons-round text-sm">auto_awesome</span>
                                <span>AI-Powered Precision Agriculture</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-slate-900 dark:text-white">
                                Diagnose Plant Diseases in <span className="text-primary relative inline-block">
                                    Seconds
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                                        <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
                                    </svg>
                                </span> with AI
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Protect your harvest. Simply upload a photo of your crop, and our advanced AI will identify diseases and recommend specific treatments instantly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    className="bg-primary hover:bg-primary-dark text-white text-lg px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50 flex items-center justify-center gap-2 group"
                                    onClick={() => onNavigate('scan')}
                                >
                                    Start Diagnosis
                                    <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                                <button className="glass-card hover:bg-white/80 text-slate-700 dark:text-slate-200 text-lg px-8 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700">
                                    <span className="material-icons-round text-primary">play_circle</span>
                                    See Demo
                                </button>
                            </div>
                            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-round text-primary">check_circle</span>
                                    <span>99.7% Accuracy</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-round text-primary">check_circle</span>
                                    <span>Instant Analysis</span>
                                </div>
                            </div>
                        </div>
                        {/* Hero Visual / Upload Zone */}
                        <div className="relative lg:h-[600px] flex items-center justify-center">
                            <div
                                className={`relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 ${dragover ? 'border-primary' : 'border-white/50 dark:border-slate-700/50'} glass-card transform rotate-2 lg:rotate-3 transition hover:rotate-0 duration-500 cursor-pointer group hover:bg-primary/5`}
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

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-100/30 dark:bg-slate-800/30">
                                    <div className="w-20 h-20 bg-white dark:bg-[#2a3830] rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 mb-6 group-hover:text-primary">
                                        <span className="material-icons-round text-4xl text-primary/80 group-hover:text-primary">cloud_upload</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Drop your image here</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Or click to browse from your device</p>

                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        <span>JPG</span>
                                        <span>•</span>
                                        <span>PNG</span>
                                        <span>•</span>
                                        <span>Max 10MB</span>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Background Elements behind the card */}
                            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-neutral-surface/50 dark:bg-background-dark relative" id="features">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Why Choose AgroVision AI?</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Bringing lab-quality diagnostics to your field. Our technology empowers farmers to make data-driven decisions.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass-card bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors group">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                <span className="material-icons-round text-3xl text-primary group-hover:text-white transition-colors">add_a_photo</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Instant Analysis</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Upload photos from any device directly in the field. Our optimized engine processes images in milliseconds, even on slower connections.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="glass-card bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors group">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                <span className="material-icons-round text-3xl text-primary group-hover:text-white transition-colors">psychology</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">AI Disease Detection</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Powered by a deep learning model trained on over 1 million plant samples, achieving diagnostic accuracy comparable to expert agronomists.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="glass-card bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors group">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                <span className="material-icons-round text-3xl text-primary group-hover:text-white transition-colors">medical_services</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Smart Treatment</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Don't just identify the problem—solve it. Get tailored chemical and organic treatment plans specific to your crop and region.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 relative overflow-hidden" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <span className="text-primary font-bold tracking-wider uppercase text-sm">Process</span>
                            <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-slate-900 dark:text-white">From Photo to Cure in 3 Steps</h2>
                        </div>
                    </div>
                    {/* Steps Container */}
                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Step 1 */}
                            <div className="relative flex flex-col items-center md:items-start text-center md:text-left group">
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-4 border-neutral-surface dark:border-slate-700 shadow-xl flex items-center justify-center relative z-10 mb-6 group-hover:border-primary transition-colors duration-300">
                                    <span className="material-icons-round text-4xl text-slate-400 group-hover:text-primary transition-colors">camera_alt</span>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full text-white flex items-center justify-center font-bold shadow-md">1</div>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Snap a Photo</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Use your smartphone camera to take a clear picture of the affected part of the plant.
                                </p>
                            </div>
                            {/* Step 2 */}
                            <div className="relative flex flex-col items-center md:items-start text-center md:text-left group">
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-4 border-neutral-surface dark:border-slate-700 shadow-xl flex items-center justify-center relative z-10 mb-6 group-hover:border-primary transition-colors duration-300">
                                    <span className="material-icons-round text-4xl text-slate-400 group-hover:text-primary transition-colors">qr_code_scanner</span>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full text-white flex items-center justify-center font-bold shadow-md">2</div>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">AI Scan & Analyze</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Our algorithms analyze visual patterns, comparing them against thousands of disease signatures.
                                </p>
                            </div>
                            {/* Step 3 */}
                            <div className="relative flex flex-col items-center md:items-start text-center md:text-left group">
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-4 border-neutral-surface dark:border-slate-700 shadow-xl flex items-center justify-center relative z-10 mb-6 group-hover:border-primary transition-colors duration-300">
                                    <span className="material-icons-round text-4xl text-slate-400 group-hover:text-primary transition-colors">healing</span>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full text-white flex items-center justify-center font-bold shadow-md">3</div>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Get Solutions</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Receive an instant diagnosis report along with recommended organic or chemical treatments.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Large CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto bg-primary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-primary/40">
                    {/* Decorative patterns */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to maximize your crop yield?</h2>
                        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                            Join thousands of farmers using AgroVision AI to detect issues early and save their harvest.
                        </p>
                        <button
                            className="bg-white text-primary hover:bg-slate-50 font-bold py-4 px-10 rounded-xl shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
                            onClick={() => onNavigate('scan')}
                        >
                            Start Your Free Scan
                            <span className="material-icons-round">arrow_upward</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© 2026 AgroVision AI. All rights reserved.</p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Privacy</a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Terms</a>
                            <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

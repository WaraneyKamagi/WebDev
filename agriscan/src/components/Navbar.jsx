export default function Navbar({ onNavigate, activePage }) {
    return (
        <nav className="w-full bg-white dark:bg-[#1c2a21] border-b border-gray-100 dark:border-white/5 py-4 px-6 md:px-8 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onNavigate('home')}
                >
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                        <span className="material-icons-round text-xl">eco</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        AgroVision <span className="text-primary">AI</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <button
                        className={`${activePage === 'home' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'} hover:text-primary transition-colors`}
                        onClick={() => onNavigate('home')}
                    >
                        Beranda
                    </button>
                    <button
                        className={`${activePage === 'scan' || activePage === 'scanning' || activePage === 'results' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'} hover:text-primary transition-colors`}
                        onClick={() => onNavigate('scan')}
                    >
                        Pindai
                    </button>
                    <button className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                        Tentang
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <span className="material-icons-round">notifications</span>
                    </button>
                    <button
                        className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-medium transition-all shadow-md shadow-primary/20 text-sm hidden md:block"
                        onClick={() => onNavigate('scan')}
                    >
                        Mulai Diagnosa
                    </button>
                    <div className="md:hidden flex items-center">
                        <button className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                            <span className="material-icons-round text-2xl">menu</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

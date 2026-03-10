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
            { label: 'Penyakit Bakteri', type: 'error' },
            { label: 'Sangat Menular', type: 'warning' },
            { label: 'Bisa Diobati', type: 'primary' }
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
            { label: 'Penyakit Jamur', type: 'error' },
            { label: 'Segera Tangani', type: 'warning' },
            { label: 'Bisa Diobati', type: 'primary' }
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
            { label: 'Penyakit Jamur', type: 'error' },
            { label: 'Sangat Berbahaya', type: 'warning' },
            { label: 'Tindakan Cepat', type: 'primary' }
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
            { label: 'Penyakit Jamur', type: 'error' },
            { label: 'Kelembaban Tinggi', type: 'warning' },
            { label: 'Bisa Dicegah', type: 'primary' }
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
            { label: 'Penyakit Jamur', type: 'error' },
            { label: 'Masalah Daun', type: 'warning' },
            { label: 'Bisa Diobati', type: 'primary' }
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
            { label: 'Hama Tanaman', type: 'error' },
            { label: 'Cuaca Panas', type: 'warning' },
            { label: 'Bisa Dibasmi', type: 'primary' }
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
            { label: 'Penyakit Jamur', type: 'error' },
            { label: 'Mirip Hawar', type: 'warning' },
            { label: 'Bisa Diobati', type: 'primary' }
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
            { label: 'Infeksi Virus', type: 'error' },
            { label: 'Vektor Kutu', type: 'warning' },
            { label: 'Tanpa Obat', type: 'primary' }
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
            { label: 'Infeksi Virus', type: 'error' },
            { label: 'Sangat Stabil', type: 'warning' },
            { label: 'Protokol Ketat', type: 'primary' }
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
            { label: 'Tanaman Sehat', type: 'primary' },
            { label: 'Pertumbuhan Baik', type: 'warning' },
            { label: 'Lanjutkan', type: 'primary' }
        ]
    }
};

export default function ResultsPage({ onNavigate, previewUrl, scanResult }) {
    // Determine which key to use from API response
    const rawName = scanResult?.name || 'healthy';

    // In actual implementation, match response.name to database keys
    // Fallback to 'Tomato_healthy' logic if needed, but for now map broadly
    const getDbEntry = (name) => {
        if (DISEASE_DATABASE[name]) return DISEASE_DATABASE[name];

        // fuzzy match fallback
        const lowerName = name.toLowerCase();
        for (let key in DISEASE_DATABASE) {
            if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
                return DISEASE_DATABASE[key];
            }
        }
        return DISEASE_DATABASE['healthy']; // ultimate fallback
    };

    const resultData = getDbEntry(rawName);

    // Fallbacks if data is missing
    const confidence = scanResult?.confidence ? (scanResult.confidence * 100).toFixed(1) : resultData.confidence;
    const severityMap = {
        'Ringan': { color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
        'Tinggi': { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
        'Kritis': { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
        'Normal': { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' }
    };

    const sevStyle = severityMap[resultData.severity] || severityMap['Ringan'];

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Navigation */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                            <button className="hover:text-primary transition-colors flex items-center" onClick={() => onNavigate('home')}>
                                Dashboard
                            </button>
                            <span className="material-icons-round text-xs">chevron_right</span>
                            <button className="hover:text-primary transition-colors flex items-center" onClick={() => onNavigate('scan')}>
                                Scan
                            </button>
                            <span className="material-icons-round text-xs">chevron_right</span>
                            <span className="text-primary">Results</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analysis Results</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
                            <span className="material-icons-round text-[20px]">print</span>
                            <span className="hidden sm:inline">Print Report</span>
                        </button>
                        <button
                            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-primary/20 flex items-center gap-2"
                            onClick={() => onNavigate('scan')}
                        >
                            <span className="material-icons-round text-[20px]">add_a_photo</span>
                            New Scan
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Image & Status (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Image Preview Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 group">
                                <img src={previewUrl || 'https://via.placeholder.com/400x300'} alt="Analyzed Crop" className="w-full h-full object-cover" />

                                <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium">
                                    <span className="material-icons-round text-green-400 text-sm">verified_user</span>
                                    Analyzed
                                </div>

                                {/* AI Scanning Box visual overlay (purely aesthetic) */}
                                <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] border-2 border-primary border-dashed rounded-lg opacity-80 pointer-events-none">
                                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary rounded-sm"></div>
                                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary rounded-sm"></div>
                                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-primary rounded-sm"></div>
                                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary rounded-sm"></div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Primary Detection</div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{resultData.name}</h2>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1 ${sevStyle.bg} ${sevStyle.color} border-${sevStyle.color}/20`}>
                                        <span className="material-icons-round text-[14px]">
                                            {resultData.severity === 'Normal' ? 'check_circle' : 'warning_amber'}
                                        </span>
                                        {resultData.severity}
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">AI Confidence Map</span>
                                        <span className="text-primary font-bold text-lg">{confidence}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-1 overflow-hidden">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: `${confidence}%` }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Our neural network is {confidence}% confident in this diagnosis based on 7 distinct visual markers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Similar Diseases (Only if relevant) */}
                        {resultData.related && resultData.related.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="material-icons-round text-slate-400 text-[18px]">find_replace</span>
                                    Similar Possibilities
                                </h3>
                                <div className="space-y-3">
                                    {resultData.related.map((rel, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600 cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                                    <span className="material-icons-round text-slate-500 text-[16px]">biotech</span>
                                                </div>
                                                <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{rel.name}</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">{rel.match}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details & Treatment (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Summary Description */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <span className="material-icons-round text-primary">info</span>
                                Disease Overview
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{resultData.description}</p>
                        </div>

                        {/* Visual Symptoms */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-icons-round text-primary">visibility</span>
                                Identified Symptoms
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {resultData.symptoms.map((sym, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="mt-0.5 text-primary">
                                            <span className="material-icons-round">check_circle_outline</span>
                                        </div>
                                        <span className="text-slate-700 dark:text-slate-300">{sym}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Plan */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-1 shadow-sm overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-icons-round text-primary text-[28px]">healing</span>
                                    Recommended Treatment Plan
                                </h3>
                                <p className="text-slate-500 mt-2">Take immediate action with our curated agricultural solutions.</p>
                            </div>

                            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                                {/* Organic / Cultural Control */}
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <span className="material-icons-round">eco</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Organic & Cultural</h4>
                                    </div>
                                    <ul className="space-y-4">
                                        {resultData.treatments.organic.map((org, i) => (
                                            <li key={i} className="flex items-start gap-3 group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 group-hover:scale-150 transition-transform"></div>
                                                <span className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                                    {org}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Chemical Control */}
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <span className="material-icons-round">science</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Chemical Options</h4>
                                    </div>
                                    <ul className="space-y-4">
                                        {resultData.treatments.chemical.map((chem, i) => (
                                            <li key={i} className="flex items-start gap-3 group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 group-hover:scale-150 transition-transform"></div>
                                                <span className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                                    {chem}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Prevention */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-icons-round text-primary">shield</span>
                                Future Prevention
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {resultData.prevention.map((prev, i) => (
                                    <div key={i} className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-4 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-primary flex items-center justify-center shadow-sm mb-3">
                                            <span className="text-sm font-bold">{i + 1}</span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{prev}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

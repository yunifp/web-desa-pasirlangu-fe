import React from 'react';

export const PurposeSection: React.FC = () => {
  // Deretan pilar tujuan strategis Perminas yang diperbanyak agar durasi gulir panjang
  const purposeItems = [
    "Optimasi Sumber Daya",
    "Kemakmuran Indonesia",
    "Kehidupan Berkelanjutan",
    "Kedaulatan Mineral Strategis",
    "Kemandirian Rantai Pasok Global",
    "Hilirisasi Logam Tanah Jarang",
    "Ketahanan Teknologi & Industri",
    "Kedaulatan Daya Anagata Nusantara",
    "Pusat Pemurnian Logam Kritis",
    "Ekosistem Energi Hijau Masa Depan"
  ];

  // Menduplikasi array untuk menciptakan ilusi putaran mulus tanpa ujung (infinite loop)
  const duplicatedItems = [...purposeItems, ...purposeItems, ...purposeItems];

  return (
    <section className="relative w-full h-[65vh] min-h-[500px] max-h-[700px] bg-black overflow-hidden font-sans flex items-center select-none">
      
      {/* INJEKSI GAYA ANIMASI MARQUEE VERTIKAL SECARA LOKAL */}
      <style>{`
        @keyframes scrollMarqueeVertical {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        .animate-marquee-v {
          animation: scrollMarqueeVertical 40s linear infinite;
        }
        .mask-vertical-fade {
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
        }
      `}</style>

      {/* --- PENAMPANG KANAN: GRAFIS PETA GLOBE TITIK-TITIK (DIPERJELAS) --- */}
      <div className="absolute right-[-15%] sm:right-[-5%] top-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] pointer-events-none opacity-95 flex items-center justify-center">
        {/* Lapis Dasar Lingkaran Globe */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-white/10 border border-white/15" />
        <div className="absolute inset-4 rounded-full border border-white/10 border-dashed" />
        
        {/* Gambar Peta Titik Resolusi Tinggi (Filter Diperkuat Agar Jelas Terlihat) */}
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop" 
          alt="Globe Map Matrix"
          className="w-full h-full object-cover rounded-full mix-blend-lighten opacity-60 contrast-150" 
        />
        
        {/* Lapisan Bayangan Gelap untuk Kedalaman 3D */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-black via-black/40 to-transparent" />
        
        {/* Simulasi Pola Titik Peta Kritis di Permukaan Globe */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
          <div className="w-3/4 h-3/4 rounded-full border border-[#C5A059]/40 border-dotted transform -rotate-45" />
          <div className="absolute w-1/2 h-1/2 rounded-full border border-white/30 border-dotted transform rotate-12" />
        </div>
      </div>

      {/* --- PENAMPANG KIRI: KONTEN TEKS TUJUAN --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-xl sm:max-w-2xl space-y-4">
          
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Tujuan Kami
          </span>

          {/* Wadah Teks Bergulir ala Movie Credits */}
          <div className="h-[220px] sm:h-[280px] overflow-hidden relative mask-vertical-fade">
            <div className="animate-marquee-v flex flex-col pt-10">
              {duplicatedItems.map((text, idx) => (
                <div key={idx} className="py-2.5 sm:py-3.5 transition-colors">
                  <h2 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-none hover:text-[#C5A059] transition-colors cursor-default">
                    {text}
                  </h2>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed max-w-lg pt-4 border-t border-white/10">
            Mengamankan rantai pasok cadangan kritis nusantara guna menopang kemakmuran rakyat serta kedaulatan industri teknologi tinggi di ranah persaingan global.
          </p>

        </div>
      </div>

    </section>
  );
};
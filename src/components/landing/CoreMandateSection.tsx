import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CoreMandateSection: React.FC = () => {
  // Enam unit/pilar utama BUMN mineral untuk mengisi kepadatan slider
  const mandateCards = [
    {
      id: "asset",
      title: "Perminas Asset\nManagement",
      desc: "Mengembangkan fasilitas pemurnian terpadu (smelter) dan pencucian awal LTJ berkelas dunia dengan tumpukan teknologi berefisiensi tinggi.",
      bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
      isDefaultImg: true, // Gambar langsung tampil
      vectorIcon: "🏭",
      vectorText: "Fasilitas"
    },
    {
      id: "invest",
      title: "Perminas Investment\nManagement",
      desc: "Berinvestasi pada sektor-sektor prioritas hilirisasi logam kritis dan material magnet permanen berdampak tinggi bagi rantai pasok global.",
      bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
      isDefaultImg: false, // Gambar muncul saat hover
      vectorIcon: "📈",
      vectorText: "Hilirisasi"
    },
    {
      id: "smelter",
      title: "Perminas Smelter\nHolding",
      desc: "Mengonsolidasikan kapasitas pabrik pengolahan unsur tanah jarang cair menjadi oksida murni berstandar industri semikonduktor internasional.",
      bgImage: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2070&auto=format&fit=crop",
      isDefaultImg: false,
      vectorIcon: "🔥",
      vectorText: "Pemurnian"
    },
    {
      id: "ree",
      title: "Perminas Rare Earth\nExploration",
      desc: "Melakukan pemetaan geologis dan penambangan primer endapan monasit serta xenotim nusantara secara terukur dan berkelanjutan.",
      bgImage: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=2070&auto=format&fit=crop",
      isDefaultImg: false,
      vectorIcon: "⛏️",
      vectorText: "Cadangan"
    },
    {
      id: "ev",
      title: "Perminas EV\nEcosystem",
      desc: "Menyambung mata rantai material magnet Neodymium langsung menuju pabrikan raksasa penggerak motor dan penyimpan daya kendaraan listrik.",
      bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
      isDefaultImg: false,
      vectorIcon: "🔋",
      vectorText: "Rantai Pasok"
    },
    {
      id: "green",
      title: "Perminas Green\nEnergy",
      desc: "Membangun suplai daya mandiri dari sumber energi terbarukan guna menekan jejak emisi karbon di seluruh klaster pabrik pengolahan mineral.",
      bgImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop",
      isDefaultImg: false,
      vectorIcon: "🌱",
      vectorText: "Kelestarian"
    }
  ];

  // Duplikasi array untuk menciptakan perputaran mulus tanpa ujung (infinite loop)
  const marqueeSliderCards = [...mandateCards, ...mandateCards];

  return (
    <section className="py-24 bg-white border-b border-slate-100 font-sans overflow-hidden">
      
      {/* INJEKSI GAYA ANIMASI MARQUEE HORIZONTAL LOKAL */}
      <style>{`
        @keyframes scrollMarqueeHorizontal {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-h {
          animation: scrollMarqueeHorizontal 35s linear infinite;
        }
        /* Membekukan (Pause) animasi slider saat area seksi atau card disentuh kursor */
        .pause-on-hover:hover .animate-marquee-h {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 space-y-12 pause-on-hover">
        
        {/* Tajuk Atas */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Lingkup Kerja</span>
            <h2 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-tight max-w-3xl leading-snug">
              Melalui pendekatan terintegrasi, <strong className="font-black text-slate-950">Perminas</strong> memastikan cadangan mineral strategis negara dikelola secara efektif, dimurnikan, dan diindustrialisasikan demi kemajuan bangsa.
            </h2>
          </div>
          <Link to="/tentang-kami/profil" className="inline-flex items-center gap-1.5 text-xs font-black text-[#0B4028] hover:text-[#C5A059] transition-colors flex-shrink-0">
            <span>Baca Selengkapnya</span> <ArrowRight size={14} className="text-[#C5A059]" />
          </Link>
        </div>

        {/* Wadah Slider Marquee Horizontal (Geser Kiri, Beku Saat Hover) */}
        <div className="w-full overflow-hidden relative">
          <div className="animate-marquee-h flex gap-6 w-max">
            
            {marqueeSliderCards.map((card, idx) => {
              
              // LOGIKA RENDER CARD
              // Jika isDefaultImg true: Gambar langsung tampil dari awal.
              // Jika isDefaultImg false: Latar berwarna Hijau Tua, gambar tersembunyi di bawah dan meluncur naik saat di-hover.
              if (card.isDefaultImg) {
                return (
                  <div 
                    key={`${card.id}-${idx}`}
                    className="relative rounded-3xl overflow-hidden w-[360px] sm:w-[400px] h-[420px] bg-slate-100 border border-slate-200/80 shadow-md group flex flex-col justify-end p-8 flex-shrink-0 select-none"
                  >
                    <img 
                      src={card.bgImage} 
                      alt={card.vectorText} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                    
                    <div className="relative z-10 space-y-3 max-w-md">
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight whitespace-pre-line">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-3">
                        {card.desc}
                      </p>
                      <button onClick={() => alert(`Membuka Portofolio: ${card.vectorText}`)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all mt-2">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={`${card.id}-${idx}`}
                  className="relative rounded-3xl overflow-hidden w-[360px] sm:w-[400px] h-[420px] bg-[#0B4028] border border-slate-900 shadow-md group flex flex-col justify-between p-8 transition-colors flex-shrink-0 select-none"
                >
                  {/* Gambar Latar Sembunyi di Bawah, Meluncur Naik saat Hover */}
                  <img 
                    src={card.bgImage} 
                    alt={card.vectorText} 
                    className="absolute inset-0 w-full h-full object-cover transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B4028] via-[#0B4028]/80 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10" />

                  <div className="relative z-20 space-y-3 max-w-md">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight whitespace-pre-line">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed line-clamp-3">
                      {card.desc}
                    </p>
                  </div>

                  {/* Vektor Kanan Bawah yang Memudar saat Gambar Meluncur */}
                  <div className="relative z-20 flex justify-between items-end w-full">
                    <button onClick={() => alert(`Membuka Portofolio: ${card.vectorText}`)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all">
                      <ArrowRight size={16} />
                    </button>

                    {/* Vektor Ilustrasi Koin/Ikon (Memudar saat di-hover) */}
                    <div className="w-24 h-24 bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg group-hover:opacity-0 transition-opacity duration-200 border border-slate-100 flex-shrink-0">
                      <span className="text-2xl">{card.vectorIcon}</span>
                      <span className="text-[8px] font-black text-slate-900 uppercase mt-1 truncate max-w-full">{card.vectorText}</span>
                    </div>
                  </div>

                </div>
              );

            })}

          </div>
        </div>

      </div>
    </section>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const StrategicSectors: React.FC = () => {
  // 4 Sektor Khusus Perusahaan Mineral
  const sectors = [
    {
      id: 1,
      title: "Logam Tanah Jarang",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2000&auto=format&fit=crop", 
      icon: "⚡",
      url: "/operasi/logam-tanah-jarang"
    },
    {
      id: 2,
      title: "Mineral Kritis",
      image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=2070&auto=format&fit=crop", 
      icon: "⛏️",
      url: "/operasi/mineral-kritis"
    },
    {
      id: 3,
      title: "Fasilitas Smelter",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop", 
      icon: "🏭",
      url: "/operasi/smelter"
    },
    {
      id: 4,
      title: "Rantai Pasok EV",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop", 
      icon: "🔋",
      url: "/operasi/ekosistem-ev"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sektor Strategis</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sektor-sektor utama yang menopang rencana kami
          </h2>
        </div>

        {/* Deretan 4 Card Vertikal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sec) => (
            <div 
              key={sec.id}
              className="relative rounded-3xl overflow-hidden h-[380px] bg-slate-900 border border-slate-200 shadow-sm group flex flex-col justify-between p-6"
            >
              <img 
                src={sec.image} 
                alt={sec.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />

              {/* Ikon Kiri Atas */}
              <div className="relative z-20 w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm font-bold text-sm">
                {sec.icon}
              </div>

              {/* Judul & Tombol Panah Bawah */}
              <div className="relative z-20 flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {sec.title}
                </h3>

                <Link 
                  to={sec.url} 
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#C5A059] flex items-center justify-center text-slate-950 hover:text-white transition-colors flex-shrink-0"
                >
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
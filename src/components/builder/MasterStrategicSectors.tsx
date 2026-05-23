import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface StrategicCard {
  title: string;
  image: string;
  icon: string;
  url: string;
}

export interface MasterStrategicSectorsProps {
  badge?: string;
  title?: string;
  cards?: StrategicCard[];
}

export const MasterStrategicSectors: React.FC<MasterStrategicSectorsProps> = ({
  badge = "Sektor Strategis",
  title = "Sektor-sektor utama yang menopang rencana kami",
  cards = []
}) => {
  return (
    <section className="py-24 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Posisi Header: Diubah menjadi sejajar di tengah dengan aksen */}
        <div className="flex flex-col items-center text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-black text-blue-900 bg-blue-50 px-4 py-1.5 rounded-md uppercase tracking-widest border border-blue-100">
            {badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((sec, idx) => (
            <div 
              key={idx}
              // Bentuk Kartu Daun (Leaf Shape)
              className="relative overflow-hidden h-[420px] rounded-tl-[60px] rounded-br-[60px] rounded-tr-xl rounded-bl-xl bg-blue-950 shadow-lg group flex flex-col justify-between p-6 hover:shadow-2xl transition-shadow"
            >
              <img 
                src={sec.image} 
                alt={sec.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0 opacity-70"
              />
              {/* Overlay Gradient Biru Tua */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/60 to-blue-950 z-10" />

              {/* Ikon dipindah ke Kanan Atas */}
              <div className="relative z-20 self-end w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm font-bold text-xl">
                {sec.icon}
              </div>

              {/* Teks & Panah di Bawah */}
              <div className="relative z-20 space-y-4">
                <h3 className="text-xl font-black text-white tracking-tight leading-snug">
                  {sec.title}
                </h3>

                <Link 
                  to={sec.url || '#'} 
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-white flex items-center justify-between px-5 text-blue-950 font-black transition-colors"
                >
                  <span className="text-xs uppercase tracking-wider">Eksplorasi</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
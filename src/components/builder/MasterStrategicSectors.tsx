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
    <section className="py-24 bg-slate-50 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{badge}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((sec, idx) => (
            <div 
              key={idx}
              className="relative rounded-3xl overflow-hidden h-[380px] bg-slate-900 border border-slate-200 shadow-sm group flex flex-col justify-between p-6"
            >
              <img 
                src={sec.image} 
                alt={sec.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />

              <div className="relative z-20 w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm font-bold text-sm">
                {sec.icon}
              </div>

              <div className="relative z-20 flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {sec.title}
                </h3>

                <Link 
                  to={sec.url || '#'} 
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
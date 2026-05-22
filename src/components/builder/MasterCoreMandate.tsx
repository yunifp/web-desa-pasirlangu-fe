import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface MandateCard {
  title: string;
  desc: string;
  bgImage: string;
  isDefaultImg: string | boolean;
  vectorIcon: string;
  vectorText: string;
  linkUrl?: string;
}

export interface MasterCoreMandateProps {
  badge?: string;
  titleHtml?: string;
  linkText?: string;
  linkUrl?: string;
  cards?: MandateCard[];
}

export const MasterCoreMandate: React.FC<MasterCoreMandateProps> = ({
  badge = "Lingkup Kerja",
  titleHtml = "Melalui pendekatan terintegrasi, <strong class=\"font-black text-slate-950\">Perminas</strong> memastikan cadangan mineral strategis negara dikelola secara efektif.",
  linkText = "Baca Selengkapnya",
  linkUrl = "/tentang-kami/profil",
  cards = []
}) => {
  // Duplikasi array untuk menciptakan perputaran mulus tanpa ujung (infinite loop)
  const marqueeSliderCards = [...cards, ...cards];

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
        .pause-on-hover:hover .animate-marquee-h {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 space-y-12 pause-on-hover">
        
        {/* Tajuk Atas */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{badge}</span>
            <h2 
              className="text-2xl sm:text-3xl font-light text-slate-800 tracking-tight max-w-3xl leading-snug"
              dangerouslySetInnerHTML={{ __html: titleHtml }}
            />
          </div>
          {linkText && linkUrl && (
            <a href={linkUrl} className="inline-flex items-center gap-1.5 text-xs font-black text-[#0B4028] hover:text-[#C5A059] transition-colors flex-shrink-0">
              <span>{linkText}</span> <ArrowRight size={14} className="text-[#C5A059]" />
            </a>
          )}
        </div>

        {/* Wadah Slider Marquee Horizontal */}
        <div className="w-full overflow-hidden relative">
          <div className="animate-marquee-h flex gap-6 w-max">
            
            {marqueeSliderCards.map((card, idx) => {
              
              if (card.isDefaultImg === true || card.isDefaultImg === 'true') {
                return (
                  <div 
                    key={`${idx}`}
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
                      <a href={card.linkUrl || '#'} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all mt-2">
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={`${idx}`}
                  className="relative rounded-3xl overflow-hidden w-[360px] sm:w-[400px] h-[420px] bg-[#0B4028] border border-slate-900 shadow-md group flex flex-col justify-between p-8 transition-colors flex-shrink-0 select-none"
                >
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

                  <div className="relative z-20 flex justify-between items-end w-full">
                    <a href={card.linkUrl || '#'} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all">
                      <ArrowRight size={16} />
                    </a>

                    <div className="w-24 h-24 bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg group-hover:opacity-0 transition-opacity duration-200 border border-slate-100 flex-shrink-0">
                      <span className="text-2xl">{card.vectorIcon}</span>
                      <span className="text-[8px] font-black text-slate-900 uppercase mt-1 truncate max-w-full text-center">{card.vectorText}</span>
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
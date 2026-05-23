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
  titleHtml = "Melalui pendekatan terintegrasi, <strong class=\"font-black text-blue-950\">Perminas</strong> memastikan cadangan mineral strategis negara dikelola secara efektif.",
  linkText = "Baca Selengkapnya",
  linkUrl = "/tentang-kami/profil",
  cards = []
}) => {
  const marqueeSliderCards = [...cards, ...cards];

  return (
    <section className="py-24 bg-blue-50/50 border-b border-blue-100 font-sans overflow-hidden">
      
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

      <div className="max-w-7xl mx-auto px-6 space-y-16 pause-on-hover">
        
        {/* Tajuk Tengah (Dulu Kiri) */}
        <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-black uppercase tracking-widest block">{badge}</span>
          <h2 
            className="text-2xl sm:text-4xl font-light text-slate-700 tracking-tight leading-snug"
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
          {linkText && linkUrl && (
            <a href={linkUrl} className="mt-2 inline-flex items-center gap-2 text-xs font-black text-blue-900 hover:text-cyan-600 transition-colors border-b-2 border-transparent hover:border-cyan-600 pb-1">
              <span>{linkText}</span> <ArrowRight size={14} />
            </a>
          )}
        </div>

        {/* Wadah Slider Marquee Horizontal */}
        <div className="w-full overflow-hidden relative">
          <div className="animate-marquee-h flex gap-8 w-max px-4">
            
            {marqueeSliderCards.map((card, idx) => {
              
              if (card.isDefaultImg === true || card.isDefaultImg === 'true') {
                return (
                  <div 
                    key={`${idx}`}
                    // Bentuk Kartu Kapsul/Arch
                    className="relative rounded-t-full rounded-b-[40px] overflow-hidden w-[320px] sm:w-[360px] h-[480px] bg-white border border-blue-100 shadow-xl group flex flex-col justify-end p-8 flex-shrink-0 select-none"
                  >
                    <img 
                      src={card.bgImage} 
                      alt={card.vectorText} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent" />
                    
                    <div className="relative z-10 text-center space-y-4 max-w-md mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/20">
                        {card.vectorIcon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight whitespace-pre-line">
                        {card.title}
                      </h3>
                      <p className="text-xs text-blue-100 font-medium leading-relaxed line-clamp-3">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={`${idx}`}
                  // Kartu Solid Biru Tua
                  className="relative rounded-t-full rounded-b-[40px] overflow-hidden w-[320px] sm:w-[360px] h-[480px] bg-blue-950 border border-blue-900 shadow-xl group flex flex-col justify-between p-8 transition-colors flex-shrink-0 select-none text-center"
                >
                  <img 
                    src={card.bgImage} 
                    alt={card.vectorText} 
                    className="absolute inset-0 w-full h-full object-cover transform opacity-0 group-hover:opacity-30 mix-blend-overlay transition-opacity duration-500 ease-out z-0"
                  />

                  <div className="relative z-20 flex flex-col items-center pt-8">
                    <span className="text-5xl drop-shadow-md mb-2">{card.vectorIcon}</span>
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{card.vectorText}</span>
                  </div>

                  <div className="relative z-20 space-y-4 max-w-md mx-auto flex flex-col items-center">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight whitespace-pre-line">
                      {card.title}
                    </h3>
                    <p className="text-xs text-blue-200 font-medium leading-relaxed line-clamp-3">
                      {card.desc}
                    </p>
                    <a href={card.linkUrl || '#'} className="mt-2 w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-blue-950 flex items-center justify-center transition-all shadow-lg hover:-translate-y-1">
                      <ArrowRight size={18} />
                    </a>
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
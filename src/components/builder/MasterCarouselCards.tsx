import React from 'react';
import { Zap, Shield, Cpu, Compass, ArrowRight } from 'lucide-react';

interface CarouselCardItem {
  title: string;
  imgUrl: string;
  iconType?: string;
  linkUrl?: string;
}

interface MasterCarouselCardsProps {
  sectionLabel: string;
  sectionTitle: string;
  cards: CarouselCardItem[];
}

export const MasterCarouselCards: React.FC<MasterCarouselCardsProps> = ({
  sectionLabel,
  sectionTitle,
  cards
}) => {
  const safeCards = Array.isArray(cards) ? cards : [];

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'shield': return <Shield size={16} />;
      case 'cpu': return <Cpu size={16} />;
      case 'compass': return <Compass size={16} />;
      default: return <Zap size={16} />;
    }
  };

  return (
    <section className="py-24 bg-white border-b border-blue-50 font-sans select-none overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Header Seksi (Rata Tengah) */}
        <div className="flex flex-col items-center text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-black text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full uppercase tracking-widest">
            {sectionLabel || 'Sektor Strategis'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
            {sectionTitle || 'Sektor-sektor utama yang menopang rencana kami'}
          </h2>
        </div>

        {/* Wadah Korsel / Slider Horizontal */}
        <div className="flex gap-6 overflow-x-auto pb-8 pt-4 px-4 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {safeCards.map((card, idx) => (
            <div 
              key={idx}
              className="relative w-[280px] h-[380px] rounded-t-full rounded-b-3xl bg-slate-50 border border-slate-200 shadow-md flex-shrink-0 snap-center group flex flex-col items-center p-4 hover:border-blue-900 transition-colors"
            >
              {/* Gambar Melingkar di Atas */}
              <div className="w-full aspect-square rounded-full overflow-hidden relative mb-6 shadow-inner">
                <img 
                  src={card.imgUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop'} 
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Teks Judul */}
              <h3 className="text-blue-950 font-black text-xl tracking-tight leading-tight text-center px-2">
                {card.title || 'Sektor Operasi'}
              </h3>

              {/* Ikon & Tombol Bulat di Bawah */}
              <div className="mt-auto flex items-center justify-between w-full px-4 pt-4 border-t border-slate-200">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
                  {renderIcon(card.iconType)}
                </div>
                <button 
                  onClick={() => card.linkUrl && alert(`Menuju tautan: ${card.linkUrl}`)}
                  className="w-10 h-10 rounded-full bg-blue-950 hover:bg-cyan-500 flex items-center justify-center text-white transition-colors cursor-pointer"
                  title="Eksplorasi Sektor"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
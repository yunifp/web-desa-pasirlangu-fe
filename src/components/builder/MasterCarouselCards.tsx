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
      case 'shield': return <Shield size={16} className="text-slate-900" />;
      case 'cpu': return <Cpu size={16} className="text-slate-900" />;
      case 'compass': return <Compass size={16} className="text-slate-900" />;
      default: return <Zap size={16} className="text-slate-900" />;
    }
  };

  return (
    <section className="py-20 bg-white border-b border-slate-100 font-sans select-none overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Header Seksi */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 block tracking-tight">
            {sectionLabel || 'Sektor Strategis'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight">
            {sectionTitle || 'Sektor-sektor utama yang menopang rencana kami'}
          </h2>
        </div>

        {/* Wadah Korsel / Slider Horizontal */}
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {safeCards.map((card, idx) => (
            <div 
              key={idx}
              className="relative w-[260px] sm:w-[280px] h-[340px] rounded-2xl overflow-hidden shadow-md flex-shrink-0 snap-start group border border-slate-100 bg-slate-900"
            >
              {/* Gambar Latar */}
              <img 
                src={card.imgUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop'} 
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              
              {/* Gradien Penjelas Teks Bawah */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Ikon Kiri Atas */}
              <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                {renderIcon(card.iconType)}
              </div>

              {/* Tombol Panah Kanan (Muncul saat hover atau interaktif) */}
              <button 
                onClick={() => card.linkUrl && alert(`Menuju tautan: ${card.linkUrl}`)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-slate-900"
                title="Eksplorasi Sektor"
              >
                <ArrowRight size={16} />
              </button>

              {/* Judul Kiri Bawah */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-normal text-lg tracking-tight leading-tight">
                  {card.title || 'Sektor Operasi'}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
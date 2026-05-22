import React from 'react';
// Jika path default gambar ini berbeda, sesuaikan importnya. Kita bisa jadikan fallback jika prop bgImage kosong
import DefaultBgImage from '../../assets/leader_quote.png';

export interface MasterLeaderQuoteProps {
  quoteHtml?: string;
  authorTitle?: string;
  authorSubtitle?: string;
  bgImage?: string;
}

export const MasterLeaderQuote: React.FC<MasterLeaderQuoteProps> = ({
  quoteHtml = "“Semua <strong class=\"font-black text-[#0B4028]\">kekayaan</strong> kita harus <strong class=\"font-black text-[#0B4028]\">sebesar-besarnya</strong> untuk kepentingan dan <strong class=\"font-black text-[#0B4028]\">kemakmuran</strong> keluarga.”",
  authorTitle = "Amanat Pimpinan Eksekutif",
  authorSubtitle = "PT Perusahaan Mineral Nasional (Perminas)",
  bgImage = ""
}) => {
  
  const finalBgImage = bgImage || DefaultBgImage;

  return (
    <section className="relative w-full bg-white border-b border-slate-100 font-sans select-none overflow-hidden">
      
      <div className="relative w-full aspect-[21/9] min-h-[380px] sm:min-h-[480px] flex items-center">
        
        <img 
          src={finalBgImage} 
          alt={authorTitle} 
          className="absolute inset-0 w-full h-full object-cover object-left sm:object-center z-0"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/70 to-transparent w-full md:w-3/5 right-0 ml-auto z-10" />

        <div className="relative z-20 max-w-7xl mx-auto w-full flex justify-end px-6 sm:px-12 md:px-16">
          <div className="max-w-lg space-y-4 text-left">
            
            <blockquote 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-slate-900 tracking-tight leading-snug"
              dangerouslySetInnerHTML={{ __html: quoteHtml }}
            />

            <div className="pt-2 space-y-0.5 border-l-2 border-[#C5A059] pl-3.5">
              <cite className="text-xs font-black text-slate-950 block not-italic uppercase tracking-wide">
                {authorTitle}
              </cite>
              <span className="text-[10px] text-slate-600 block font-bold tracking-wider">
                {authorSubtitle}
              </span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
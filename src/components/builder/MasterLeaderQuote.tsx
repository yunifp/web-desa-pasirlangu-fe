import React from 'react';
import DefaultBgImage from '../../assets/leader_quote.png';

export interface MasterLeaderQuoteProps {
  quoteHtml?: string;
  authorTitle?: string;
  authorSubtitle?: string;
  bgImage?: string;
}

export const MasterLeaderQuote: React.FC<MasterLeaderQuoteProps> = ({
  quoteHtml = "“Semua <strong class=\"font-black text-blue-950\">kekayaan</strong> kita harus <strong class=\"font-black text-cyan-600\">sebesar-besarnya</strong> untuk kepentingan dan <strong class=\"font-black text-blue-950\">kemakmuran</strong> keluarga.”",
  authorTitle = "Amanat Pimpinan Eksekutif",
  authorSubtitle = "PT Perusahaan Mineral Nasional (Perminas)",
  bgImage = ""
}) => {
  
  const finalBgImage = bgImage || DefaultBgImage;

  return (
    <section className="relative w-full bg-white border-b border-slate-100 font-sans select-none overflow-hidden">
      
      <div className="relative w-full aspect-[21/9] min-h-[400px] sm:min-h-[500px] flex items-center">
        
        <img 
          src={finalBgImage} 
          alt={authorTitle} 
          className="absolute inset-0 w-full h-full object-cover object-left sm:object-center z-0"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-transparent w-full md:w-2/3 right-0 ml-auto z-10 mix-blend-screen" />

        <div className="relative z-20 max-w-7xl mx-auto w-full flex justify-end px-6 sm:px-12 md:px-16">
          <div className="max-w-xl space-y-6 text-left">
            
            <blockquote 
              className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-700 tracking-tight leading-snug"
              dangerouslySetInnerHTML={{ __html: quoteHtml }}
            />

            <div className="pt-2 space-y-1 border-l-4 border-cyan-500 pl-4 bg-white/40 backdrop-blur-sm py-2 pr-4 rounded-r-2xl">
              <cite className="text-sm font-black text-blue-950 block not-italic uppercase tracking-wide">
                {authorTitle}
              </cite>
              <span className="text-[11px] text-slate-600 block font-bold tracking-wider">
                {authorSubtitle}
              </span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
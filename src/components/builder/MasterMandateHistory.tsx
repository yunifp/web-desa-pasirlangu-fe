import React from 'react';
import { Layers } from 'lucide-react';

export interface MasterMandateHistoryProps {
  titleHtml?: string;
  desc1?: string;
  desc2?: string;
  youtubeId?: string;
  watermark?: string;
  quote?: string;
}

export const MasterMandateHistory: React.FC<MasterMandateHistoryProps> = ({
  titleHtml = "Kami berpegang pada <strong class='font-black text-[#0B4028]'>tujuan</strong>...",
  desc1 = "Deskripsi paragraf 1",
  desc2 = "Deskripsi paragraf 2",
  youtubeId = "BMyw1deZ17c",
  watermark = "PT Perminas",
  quote = "Kedaulatan daya anagata nusantara melalui optimasi mineral kritis."
}) => {
  return (
    <section className="py-20 bg-white border-b border-slate-100 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 tracking-tight leading-[1.1]" dangerouslySetInnerHTML={{ __html: titleHtml }} />
          </div>
          <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <p>{desc1}</p>
            {desc2 && <p className="text-[11px] text-slate-400">{desc2}</p>}
          </div>
        </div>
        {youtubeId && (
          <div className="relative w-full rounded-3xl overflow-hidden bg-black aspect-video max-h-[600px] shadow-2xl border border-slate-900 flex items-center justify-center group">
            <iframe 
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`}
              title="Video Profil" className="absolute inset-0 w-full h-full pointer-events-none scale-[1.02] opacity-90 transition-opacity duration-700" allow="autoplay; encrypted-media" frameBorder="0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />
            <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Layers size={12} className="text-[#C5A059]" />
              <span className="text-[10px] font-black text-white tracking-widest uppercase block leading-none">{watermark}</span>
            </div>
            <div className="absolute bottom-8 inset-x-0 z-20 text-center px-6">
              <p className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide drop-shadow-lg italic">"{quote}"</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
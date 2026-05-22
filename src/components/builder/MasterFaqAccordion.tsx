/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

interface MasterFaqAccordionProps {
  title: string;
  subtitle: string;
  faqs: any[];
}

export const MasterFaqAccordion: React.FC<MasterFaqAccordionProps> = ({
  title, 
  subtitle, 
  faqs
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const safeFaqs = Array.isArray(faqs) ? faqs : [];

  return (
    <section className="py-20 bg-white border-b border-slate-100 font-sans select-none overflow-hidden w-full">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-[#0B4028] uppercase tracking-widest block">
            Pusat Bantuan Informasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title || 'Pertanyaan yang Sering Diajukan'}
          </h2>
          <p className="text-xs text-slate-500 font-medium max-w-lg mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="space-y-3">
          {safeFaqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="border border-slate-200/80 rounded-2xl overflow-hidden transition-colors">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left bg-slate-50 hover:bg-slate-100/60 flex items-center justify-between gap-4 transition-colors cursor-pointer block"
                >
                  <span className="text-xs sm:text-sm font-black text-slate-800">{item.q || 'Pertanyaan?'}</span>
                  <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${isOpen ? 'bg-[#0B4028] text-white rotate-180' : 'bg-white text-slate-400 border border-slate-200'}`}>
                    ↓
                  </span>
                </button>
                {isOpen && (
                  <div className="p-5 bg-white border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
                    {item.a || 'Penjelasan jawaban.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
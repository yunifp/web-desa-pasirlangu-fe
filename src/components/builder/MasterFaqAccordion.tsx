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
    <section className="py-24 bg-white font-sans select-none overflow-hidden w-full">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        <div className="text-center space-y-6 flex flex-col items-center">
          <span className="text-[11px] font-black text-cyan-600 uppercase tracking-widest block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
            Pusat Bantuan Informasi
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-700 tracking-tight mt-6">
            {title || 'Pertanyaan yang Sering Diajukan'}
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {safeFaqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="border-2 border-blue-50 rounded-[2rem] rounded-tr-none overflow-hidden transition-all duration-300 hover:border-blue-100 shadow-sm">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left bg-white hover:bg-slate-50 flex items-center justify-between gap-6 transition-colors cursor-pointer block group"
                >
                  <span className={`text-sm sm:text-base font-black transition-colors ${isOpen ? 'text-blue-950' : 'text-slate-800 group-hover:text-blue-900'}`}>
                    {item.q || 'Pertanyaan?'}
                  </span>
                  <span className={`text-xs font-bold w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 shadow-sm ${isOpen ? 'bg-blue-950 text-cyan-400 rotate-180' : 'bg-blue-50 text-blue-900'}`}>
                    ↓
                  </span>
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 bg-white text-sm text-slate-600 leading-relaxed font-medium">
                    <div className="pt-4 border-t border-blue-50">
                      {item.a || 'Penjelasan jawaban.'}
                    </div>
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface ElementItem {
  symbol: string;
  name: string;
  number: string;
  desc: string;
  icon: any;
}

interface MasterElementsGridProps {
  sectionSection: string;
  sectionTitle: string;
  sectionDesc: string;
  items: ElementItem[];
}

export const MasterElementsGrid: React.FC<MasterElementsGridProps> = ({
  sectionSection,
  sectionTitle,
  sectionDesc,
  items
}) => {
  return (
    <section className="py-24 bg-white border-b border-slate-100 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              {sectionSection}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {sectionTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium max-w-md leading-relaxed">
            {sectionDesc}
          </p>
        </div>

        {/* Matriks Kartu Dinamis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((el, idx) => {
            const IconComp = el.icon;
            return (
              <div 
                key={idx}
                className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6 flex flex-col justify-between group hover:border-[#0B4028] hover:bg-white transition-all"
              >
                {/* Bagian Atas: Nomor/Kode & Ikon */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-[#C5A059] transition-colors uppercase">
                    {el.number.startsWith('ATOMIC') ? el.number : `CODE_${el.number}`}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-150 flex items-center justify-center text-slate-600 group-hover:text-[#0B4028] group-hover:border-[#0B4028]/20 transition-all shadow-2xs">
                    {IconComp && <IconComp size={14} />}
                  </div>
                </div>

                {/* Bagian Tengah: Simbol Raksasa */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 group-hover:text-[#0B4028] transition-colors">
                      {el.symbol}
                    </span>
                    <span className="text-xs font-bold text-[#C5A059] block truncate">
                      {el.name}
                    </span>
                  </div>
                </div>

                {/* Bagian Bawah: Penjelasan Fungsi */}
                <p className="text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-150 pt-4 line-clamp-4">
                  {el.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
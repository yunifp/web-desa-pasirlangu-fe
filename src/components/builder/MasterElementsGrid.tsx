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
    <section className="py-24 bg-white font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b-2 border-slate-100 pb-8">
          <div className="space-y-6">
            <span className="text-[11px] font-black text-cyan-600 block uppercase tracking-widest relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
              {sectionSection}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-700 tracking-tight leading-snug mt-6">
              {sectionTitle}
            </h2>
          </div>
          <p className="text-sm text-slate-600 font-medium max-w-md leading-relaxed pl-6 border-l-4 border-blue-100">
            {sectionDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((el, idx) => {
            const IconComp = el.icon;
            return (
              <div 
                key={idx}
                className="p-8 bg-white rounded-[2rem] rounded-tr-none border-4 border-blue-50 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-blue-100 transition-all space-y-8 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-slate-300 group-hover:text-cyan-600 transition-colors uppercase">
                    {el.number.startsWith('ATOMIC') ? el.number : `CODE_${el.number}`}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900 group-hover:bg-blue-950 group-hover:text-cyan-400 transition-all shadow-sm">
                    {IconComp && <IconComp size={16} />}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black tracking-tight text-slate-800 group-hover:text-blue-950 transition-colors">
                      {el.symbol}
                    </span>
                    <span className="text-sm font-black text-cyan-600 block truncate">
                      {el.name}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-medium border-t border-blue-50 group-hover:border-blue-100 pt-5 line-clamp-4 transition-colors">
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
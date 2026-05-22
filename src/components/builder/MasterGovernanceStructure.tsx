import React from 'react';
import { Network, ArrowDown } from 'lucide-react';

export interface MasterGovernanceStructureProps {
  badge?: string; title?: string; desc?: string;
  topBadge?: string; topTitle?: string; topDesc?: string;
  midTitle?: string; midDesc?: string;
  botBadge?: string; botTitle?: string; botDesc?: string;
}

export const MasterGovernanceStructure: React.FC<MasterGovernanceStructureProps> = ({
  badge, title, desc, topBadge, topTitle, topDesc, midTitle, midDesc, botBadge, botTitle, botDesc
}) => {
  return (
    <section className="py-24 bg-slate-50/50 border-b border-slate-100 font-sans select-none overflow-hidden text-center">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#0B4028] uppercase tracking-widest block">{badge}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto">{desc}</p>
        </div>
        <div className="flex flex-col items-center justify-center pt-4">
          <div className="p-5 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl w-72 space-y-1 relative">
            <span className="text-[8px] font-bold text-[#C5A059] uppercase tracking-widest block">{topBadge}</span>
            <h4 className="text-xs font-black tracking-wider uppercase">{topTitle}</h4>
            <p className="text-[9px] text-slate-400 font-medium">{topDesc}</p>
          </div>
          <div className="h-10 w-0.5 bg-slate-300 relative my-1">
            <ArrowDown size={14} className="absolute bottom-[-6px] left-[-6px] text-slate-400" />
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm w-64 space-y-0.5 mt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase">{midTitle}</h4>
            <p className="text-[9px] text-slate-500 font-medium">{midDesc}</p>
          </div>
          <div className="h-10 w-0.5 bg-slate-300 relative my-1">
            <ArrowDown size={14} className="absolute bottom-[-6px] left-[-6px] text-slate-400" />
          </div>
          <div className="p-6 bg-[#0B4028] text-white rounded-2xl border border-[#C5A059]/30 shadow-xl w-80 space-y-2.5 mt-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C5A059] mx-auto">
              <Network size={16} />
            </div>
            <div>
              <span className="text-[9px] font-bold text-[#C5A059] uppercase tracking-widest block">{botBadge}</span>
              <h4 className="text-sm font-black tracking-tight uppercase mt-0.5">{botTitle}</h4>
              <p className="text-[10px] text-slate-200 font-medium mt-1">{botDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
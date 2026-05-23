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
    <section className="py-24 bg-white font-sans select-none overflow-hidden text-center">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        <div className="space-y-6 flex flex-col items-center">
          <span className="text-[11px] font-black text-cyan-600 uppercase tracking-widest block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
            {badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-700 tracking-tight mt-6">{title}</h2>
          <p className="text-sm text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">{desc}</p>
        </div>

        <div className="flex flex-col items-center justify-center pt-6">
          
          {/* Top Node */}
          <div className="p-6 bg-slate-900 text-white rounded-[2rem] rounded-tr-none border-2 border-slate-800 shadow-xl w-80 space-y-2 relative transform hover:scale-[1.02] transition-transform">
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest block">{topBadge}</span>
            <h4 className="text-sm font-black tracking-wider uppercase text-white">{topTitle}</h4>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{topDesc}</p>
          </div>
          
          {/* Connector */}
          <div className="h-12 w-0.5 bg-blue-200 relative my-2">
            <ArrowDown size={16} className="absolute bottom-[-8px] left-[-8px] text-blue-400 animate-pulse" />
          </div>
          
          {/* Middle Node */}
          <div className="p-5 bg-white rounded-2xl border-2 border-blue-50 shadow-md w-72 space-y-1 mt-2 transform hover:border-blue-200 transition-colors">
            <h4 className="text-sm font-black text-slate-800 uppercase">{midTitle}</h4>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{midDesc}</p>
          </div>
          
          {/* Connector */}
          <div className="h-12 w-0.5 bg-blue-200 relative my-2">
            <ArrowDown size={16} className="absolute bottom-[-8px] left-[-8px] text-blue-400 animate-pulse" />
          </div>
          
          {/* Bottom Node */}
          <div className="p-8 bg-blue-950 text-white rounded-[2.5rem] rounded-tr-none border-t-4 border-cyan-500 shadow-2xl w-96 space-y-4 mt-2 transform hover:scale-[1.02] transition-transform relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-cyan-400 mx-auto backdrop-blur-sm border border-white/5">
              <Network size={20} />
            </div>
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">{botBadge}</span>
              <h4 className="text-base font-black tracking-tight uppercase mt-1 text-white">{botTitle}</h4>
              <p className="text-xs text-blue-100 font-medium leading-relaxed mt-2 border-t border-white/10 pt-3">{botDesc}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
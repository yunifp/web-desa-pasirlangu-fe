import React from 'react';
import { Compass, Target, Award, Shield, Zap, Users } from 'lucide-react';

export interface CoreValueItem { title: string; desc: string; iconType: string; }
export interface MissionItem { text: string; }

export interface MasterCoreValuesGridProps {
  visionBadge?: string; visionTitle?: string; visionDesc?: string; visionTarget?: string;
  missionBadge?: string; missionTitle?: string; missions?: MissionItem[];
  valuesBadge?: string; valuesTitle?: string; valuesDesc?: string; coreValues?: CoreValueItem[];
}

const getIcon = (type: string) => {
  switch(type) {
    case 'award': return Award; case 'users': return Users; case 'target': return Target;
    case 'zap': return Zap; case 'compass': return Compass; default: return Shield;
  }
};

export const MasterCoreValuesGrid: React.FC<MasterCoreValuesGridProps> = ({
  visionBadge, visionTitle, visionDesc, visionTarget,
  missionBadge, missionTitle, missions = [],
  valuesBadge, valuesTitle, valuesDesc, coreValues = []
}) => {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 p-8 bg-[#0B4028] text-white rounded-3xl border border-slate-900 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-[-10%] bottom-[-10%] w-48 h-48 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest block">{visionBadge}</span>
              <h3 className="text-3xl font-black tracking-tight leading-tight">{visionTitle}</h3>
              <p className="text-sm text-slate-200 font-medium leading-relaxed pt-2">"{visionDesc}"</p>
            </div>
            <div className="pt-6 border-t border-white/10 relative z-10">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Target Realisasi</span>
              <p className="text-xs font-black text-[#C5A059] mt-0.5">{visionTarget}</p>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{missionBadge}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{missionTitle}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {missions.map((misi, idx) => (
                <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                  <span className="w-7 h-7 rounded-lg bg-[#0B4028]/10 text-[#0B4028] font-black text-xs flex items-center justify-center">0{idx + 1}</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">{misi.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-8 pt-6 border-t border-slate-200/60">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-[#0B4028] uppercase tracking-widest block">{valuesBadge}</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{valuesTitle}</h3>
            <p className="text-xs text-slate-500 font-medium">{valuesDesc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => {
              const IconComponent = getIcon(val.iconType);
              return (
                <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 group hover:border-[#0B4028] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-[#0B4028] text-slate-700 group-hover:text-[#C5A059] flex items-center justify-center transition-colors border border-slate-100">
                      <IconComponent size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-[#C5A059] transition-colors">VALUE_{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0B4028] transition-colors tracking-tight">{val.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
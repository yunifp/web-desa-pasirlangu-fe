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
    <section className="py-24 bg-slate-50 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Kotak Visi bergaya Kapsul Oval */}
          <div className="lg:col-span-5 p-10 bg-blue-950 text-white rounded-[3rem] rounded-tr-none border-4 border-blue-100/10 shadow-2xl flex flex-col justify-between relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute right-[-10%] bottom-[-10%] w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest block">{visionBadge}</span>
              <h3 className="text-3xl lg:text-4xl font-light tracking-tight leading-snug">{visionTitle}</h3>
              <p className="text-sm text-blue-100 font-medium leading-relaxed italic">"{visionDesc}"</p>
            </div>
            
            <div className="pt-8 mt-8 border-t border-white/10 relative z-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Realisasi</span>
              <p className="text-sm font-black text-cyan-400 mt-1">{visionTarget}</p>
            </div>
          </div>

          {/* Misi dengan gaya Border Left */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <span className="text-[11px] font-black text-cyan-600 block uppercase tracking-widest relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
                {missionBadge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-slate-700 tracking-tight mt-6">{missionTitle}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {missions.map((misi, idx) => (
                <div key={idx} className="pl-6 border-l-4 border-blue-100 space-y-2 group">
                  <span className="text-cyan-600 font-black text-sm block">0{idx + 1}.</span>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">{misi.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-12 pt-12">
          <div className="text-center max-w-2xl mx-auto space-y-6 flex flex-col items-center">
            <span className="text-[11px] font-black text-cyan-600 block uppercase tracking-widest relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
              {valuesBadge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-slate-700 tracking-tight mt-6">{valuesTitle}</h3>
            <p className="text-sm text-slate-500 font-medium">{valuesDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => {
              const IconComponent = getIcon(val.iconType);
              return (
                <div key={idx} className="p-8 bg-white rounded-3xl border-2 border-blue-50 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all space-y-5 group">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-950 text-blue-900 group-hover:text-cyan-400 flex items-center justify-center transition-all duration-300 shadow-sm">
                      <IconComponent size={20} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-cyan-600 transition-colors">VALUE_{idx + 1}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-black text-slate-800 group-hover:text-blue-950 transition-colors tracking-tight">{val.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
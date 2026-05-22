import React from 'react';
import { Globe, TrendingUp, ShieldCheck } from 'lucide-react';

interface MetricObj {
  label: string;
  value: string;
  unit: string;
  subtitle: string;
  desc: string;
}

interface MasterImpactDashboardProps {
  sectionSection: string;
  sectionTitle: string;
  badgeText: string;
  metric1: MetricObj;
  metric2: MetricObj;
  metric3: MetricObj;
  disclaimerTitle: string;
  disclaimerDesc: string;
  buttonText: string;
}

export const MasterImpactDashboard: React.FC<MasterImpactDashboardProps> = ({
  sectionSection,
  sectionTitle,
  badgeText,
  metric1,
  metric2,
  metric3,
  disclaimerTitle,
  disclaimerDesc,
  buttonText
}) => {
  return (
    <section className="py-24 bg-slate-900 text-white font-sans select-none overflow-hidden relative">
      
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-[#0B4028]/20 z-0" />
      <div className="absolute left-[-10%] bottom-[-10%] w-[400px] h-[400px] bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest block">
              {sectionSection}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
              {sectionTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 text-xs font-bold flex-shrink-0">
            <Globe size={14} className="text-[#C5A059]" /> {badgeText}
          </div>
        </div>

        {/* Dasbor 3 Metrik Utama Dinamis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Metrik 1 */}
          <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3 backdrop-blur-sm relative group hover:border-[#C5A059]/50 transition-colors">
            <div className="flex items-center justify-between text-[#C5A059]">
              <TrendingUp size={18} />
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-500">{metric1.label}</span>
            </div>
            <span className="text-4xl font-black block tracking-tight text-white group-hover:text-[#C5A059] transition-colors">
              {metric1.value} <span className="text-sm font-bold text-slate-400 uppercase">{metric1.unit}</span>
            </span>
            <p className="text-xs font-bold text-slate-200">{metric1.subtitle}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              {metric1.desc}
            </p>
          </div>

          {/* Metrik 2 */}
          <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3 backdrop-blur-sm relative group hover:border-[#0B4028] transition-colors">
            <div className="flex items-center justify-between text-[#0B4028]">
              <ShieldCheck size={18} />
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-500">{metric2.label}</span>
            </div>
            <span className="text-4xl font-black block tracking-tight text-white group-hover:text-[#0B4028] transition-colors">
              {metric2.value} <span className="text-sm font-bold text-slate-400 uppercase">{metric2.unit}</span>
            </span>
            <p className="text-xs font-bold text-slate-200">{metric2.subtitle}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              {metric2.desc}
            </p>
          </div>

          {/* Metrik 3 */}
          <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3 backdrop-blur-sm relative group hover:border-[#C5A059]/50 transition-colors">
            <div className="flex items-center justify-between text-blue-400">
              <Globe size={18} />
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-500">{metric3.label}</span>
            </div>
            <span className="text-4xl font-black block tracking-tight text-white group-hover:text-blue-400 transition-colors">
              {metric3.value} <span className="text-sm font-bold text-slate-400 uppercase">{metric3.unit}</span>
            </span>
            <p className="text-xs font-bold text-slate-200">{metric3.subtitle}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              {metric3.desc}
            </p>
          </div>

        </div>

        {/* Blok Catatan Kedaulatan */}
        <div className="p-8 bg-[#0B4028]/40 rounded-3xl border border-[#0B4028] flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-black tracking-tight text-white uppercase">
              {disclaimerTitle}
            </h4>
            <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
              {disclaimerDesc}
            </p>
          </div>
          <button 
            onClick={() => alert(`Mengunduh Kajian Prospektus...`)}
            className="px-5 py-3 bg-[#C5A059] hover:bg-white text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest shadow-lg hover:shadow-white/10 transition-all flex-shrink-0"
          >
            {buttonText}
          </button>
        </div>

      </div>
    </section>
  );
};
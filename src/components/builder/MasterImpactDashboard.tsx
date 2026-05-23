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
  buttonUrl: string; // 👇 TAMBAHAN PROP BARU
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
  buttonText,
  buttonUrl // 👇 TERIMA PROP BARU
}) => {
  return (
    <section className="py-24 bg-blue-950 text-white font-sans select-none overflow-hidden relative">
      
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-cyan-950/20 z-0" />
      <div className="absolute left-[-10%] bottom-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-blue-900/50 pb-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest block relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-800 after:rounded-full">
              {sectionSection}
            </span>
            <h2 className="text-3xl lg:text-4xl font-light text-white tracking-tight leading-snug mt-6">
              {sectionTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-blue-100 text-xs font-bold flex-shrink-0 shadow-sm">
            <Globe size={16} className="text-cyan-400" /> {badgeText}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 bg-white/5 rounded-[2rem] rounded-tr-none border border-white/10 space-y-4 backdrop-blur-md relative group hover:border-cyan-500/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between text-cyan-400">
              <TrendingUp size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-200">{metric1.label}</span>
            </div>
            <span className="text-4xl font-black block tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              {metric1.value} <span className="text-sm font-bold text-slate-400 uppercase">{metric1.unit}</span>
            </span>
            <p className="text-sm font-bold text-blue-50">{metric1.subtitle}</p>
            <p className="text-xs text-blue-200/70 leading-relaxed font-medium border-t border-white/10 pt-3">
              {metric1.desc}
            </p>
          </div>

          <div className="p-8 bg-white/5 rounded-[2rem] rounded-tr-none border border-white/10 space-y-4 backdrop-blur-md relative group hover:border-blue-400/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between text-blue-400">
              <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-200">{metric2.label}</span>
            </div>
            <span className="text-4xl font-black block tracking-tight text-white group-hover:text-blue-300 transition-colors">
              {metric2.value} <span className="text-sm font-bold text-slate-400 uppercase">{metric2.unit}</span>
            </span>
            <p className="text-sm font-bold text-blue-50">{metric2.subtitle}</p>
            <p className="text-xs text-blue-200/70 leading-relaxed font-medium border-t border-white/10 pt-3">
              {metric2.desc}
            </p>
          </div>

          <div className="p-8 bg-white/5 rounded-[2rem] rounded-tr-none border border-white/10 space-y-4 backdrop-blur-md relative group hover:border-cyan-500/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between text-cyan-400">
              <Globe size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-200">{metric3.label}</span>
            </div>
            <span className="text-4xl font-black block tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              {metric3.value} <span className="text-sm font-bold text-slate-400 uppercase">{metric3.unit}</span>
            </span>
            <p className="text-sm font-bold text-blue-50">{metric3.subtitle}</p>
            <p className="text-xs text-blue-200/70 leading-relaxed font-medium border-t border-white/10 pt-3">
              {metric3.desc}
            </p>
          </div>

        </div>

        <div className="p-8 bg-blue-900/40 rounded-[2.5rem] rounded-tr-none border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md shadow-lg">
          <div className="space-y-2 text-center md:text-left border-l-4 border-cyan-500 pl-4">
            <h4 className="text-base font-black tracking-tight text-white uppercase">
              {disclaimerTitle}
            </h4>
            <p className="text-sm text-blue-100 font-medium max-w-xl leading-relaxed">
              {disclaimerDesc}
            </p>
          </div>
          {/* 👇 PERBAIKAN: Ubah <button> menjadi <a> dan tambahkan href 👇 */}
          <a 
            href={buttonUrl}
            target="_blank" // Opsional: buka di tab baru
            rel="noopener noreferrer" // Keamanan tambahan saat menggunakan target="_blank"
            className="px-8 py-4 bg-white hover:bg-cyan-50 text-blue-950 font-black rounded-full text-xs uppercase tracking-widest shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all flex-shrink-0 inline-block text-center"
          >
            {buttonText}
          </a>
        </div>

      </div>
    </section>
  );
};
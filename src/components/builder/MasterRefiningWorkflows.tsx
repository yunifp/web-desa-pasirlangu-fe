import React, { useState } from 'react';
import { Settings2, ArrowRight, CheckCircle2, FlaskConical, Gauge } from 'lucide-react';

interface WorkflowItem {
  title: string;
  subtitle: string;
  desc: string;
  metric: string;
  efficiency: string;
  imgUrl: string;
}

interface MasterRefiningWorkflowsProps {
  sectionBadge: string;
  sectionTitle: string;
  sectionDesc: string;
  workflows: WorkflowItem[];
}

export const MasterRefiningWorkflows: React.FC<MasterRefiningWorkflowsProps> = ({
  sectionBadge,
  sectionTitle,
  sectionDesc,
  workflows
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!workflows || workflows.length === 0) return null;

  return (
    <section className="py-24 bg-slate-900 text-white font-sans select-none overflow-hidden relative">
      
      {/* Pendar Ornamen Latar */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0B4028]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        
        {/* Tajuk Seksi Cara Kerja */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest block flex items-center gap-1.5">
              <Settings2 size={14} className="text-[#C5A059]" /> {sectionBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
              {sectionTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-medium max-w-md leading-relaxed">
            {sectionDesc}
          </p>
        </div>

        {/* Tata Letak Akordeon Kiri & Dasbor Reaktor Kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Kolom Kiri: Daftar Akordeon Navigasi */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
            {workflows.map((item, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden group ${
                    isActive 
                      ? 'bg-[#0B4028] border-[#C5A059]/40 shadow-xl' 
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                        isActive ? 'bg-white text-[#0B4028] border-white/20' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        0{idx + 1}
                      </span>
                      <span className={`text-sm font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {item.title}
                      </span>
                    </div>

                    <ArrowRight size={16} className={`transform transition-transform ${
                      isActive ? 'text-[#C5A059] translate-x-1' : 'text-slate-600 group-hover:text-slate-400'
                    }`} />
                  </div>

                  {/* Teks Penjelasan Singkat Muncul Saat Aktif */}
                  {isActive && (
                    <div className="pt-4 mt-3 border-t border-white/10 space-y-1.5 animate-in fade-in duration-300">
                      <span className="text-[10px] font-bold text-[#C5A059] block uppercase tracking-wider">
                        {item.subtitle}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kolom Kanan: Panel Indikator Reaktor */}
          <div className="lg:col-span-6 bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity">
              <img 
                src={workflows[activeStep]?.imgUrl} 
                alt={workflows[activeStep]?.title} 
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FlaskConical size={16} className="text-[#C5A059]" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Sistem Monitoring Reaktor
                </span>
              </div>
              <span className="inline-flex items-center gap-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                <CheckCircle2 size={10} /> Optimal
              </span>
            </div>

            <div className="relative z-10 my-6 space-y-3">
              <span className="text-[10px] font-mono font-bold text-[#C5A059] block uppercase tracking-widest">
                TAHAPAN_0{activeStep + 1} // {workflows[activeStep]?.subtitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {workflows[activeStep]?.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium text-justify">
                {workflows[activeStep]?.desc}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800/50 backdrop-blur-md">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider flex items-center gap-1">
                  <Gauge size={10} className="text-[#C5A059]" /> Parameter Kritis
                </span>
                <span className="text-xs font-black text-white block truncate">
                  {workflows[activeStep]?.metric}
                </span>
              </div>

              <div className="space-y-1 border-l border-slate-800 pl-4">
                <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider">
                  Efisiensi Proses
                </span>
                <span className="text-xs font-black text-[#C5A059] block truncate">
                  {workflows[activeStep]?.efficiency}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
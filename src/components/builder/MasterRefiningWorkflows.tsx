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
    <section className="py-24 bg-blue-950 text-white font-sans select-none overflow-hidden relative">
      
      {/* Pendar Ornamen Latar */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        
        {/* Tajuk Seksi Cara Kerja */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest block flex items-center gap-2 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-800 after:rounded-full">
              <Settings2 size={16} className="text-cyan-500" /> {sectionBadge}
            </span>
            <h2 className="text-3xl lg:text-4xl font-light tracking-tight leading-snug text-white mt-6">
              {sectionTitle}
            </h2>
          </div>
          <p className="text-sm text-blue-200 font-medium max-w-md leading-relaxed border-l-2 border-blue-800 pl-4">
            {sectionDesc}
          </p>
        </div>

        {/* Tata Letak Akordeon Kiri & Dasbor Reaktor Kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Kolom Kiri: Daftar Akordeon Navigasi */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            {workflows.map((item, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-6 rounded-[2rem] rounded-tr-none border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                    isActive 
                      ? 'bg-white/10 border-cyan-500/50 shadow-lg' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-black px-3 py-1.5 rounded-xl rounded-tr-none border shadow-sm transition-colors ${
                        isActive ? 'bg-cyan-500 text-blue-950 border-cyan-400' : 'bg-blue-900/50 text-cyan-600 border-blue-800'
                      }`}>
                        0{idx + 1}
                      </span>
                      <span className={`text-sm sm:text-base font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-cyan-100 transition-colors'}`}>
                        {item.title}
                      </span>
                    </div>

                    <ArrowRight size={18} className={`transform transition-transform duration-500 ${
                      isActive ? 'text-cyan-400 translate-x-1' : 'text-blue-700 group-hover:text-cyan-600'
                    }`} />
                  </div>

                  {/* Teks Penjelasan Singkat Muncul Saat Aktif */}
                  {isActive && (
                    <div className="pt-5 mt-4 border-t border-white/10 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <span className="text-[10px] font-black text-cyan-400 block uppercase tracking-widest">
                        {item.subtitle}
                      </span>
                      <p className="text-sm text-blue-100 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kolom Kanan: Panel Indikator Reaktor */}
          <div className="lg:col-span-6 bg-slate-900 rounded-[2rem] rounded-tr-none border-2 border-blue-800/50 p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
              <img 
                src={workflows[activeStep]?.imgUrl} 
                alt={workflows[activeStep]?.title} 
                className="w-full h-full object-cover transition-all duration-700 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/80 to-transparent mix-blend-multiply" />
            </div>

            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-2.5">
                <FlaskConical size={18} className="text-cyan-400" />
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
                  Sistem Monitoring Reaktor
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                <CheckCircle2 size={12} /> Optimal
              </span>
            </div>

            <div className="relative z-10 my-8 space-y-4 border-l-2 border-cyan-500 pl-5">
              <span className="text-[11px] font-mono font-black text-cyan-400 block uppercase tracking-widest">
                TAHAPAN_0{activeStep + 1} // {workflows[activeStep]?.subtitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight leading-snug">
                {workflows[activeStep]?.title}
              </h3>
              <p className="text-sm text-blue-100 leading-relaxed font-medium">
                {workflows[activeStep]?.desc}
              </p>
            </div>

            <div className="relative z-10 pt-5 border-t border-white/10 grid grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl rounded-tr-none border border-white/10 backdrop-blur-md">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-blue-300 block uppercase tracking-widest flex items-center gap-1.5">
                  <Gauge size={12} className="text-cyan-500" /> Parameter Kritis
                </span>
                <span className="text-sm font-black text-white block truncate">
                  {workflows[activeStep]?.metric}
                </span>
              </div>

              <div className="space-y-1.5 border-l border-white/10 pl-6">
                <span className="text-[10px] font-black text-blue-300 block uppercase tracking-widest">
                  Efisiensi Proses
                </span>
                <span className="text-sm font-black text-cyan-400 block truncate">
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
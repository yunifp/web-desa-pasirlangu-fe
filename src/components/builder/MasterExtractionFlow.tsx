import React from 'react';
import { Layers, ArrowDown } from 'lucide-react';

interface FlowStep {
  phase: string;
  title: string;
  desc: string;
}

interface MasterExtractionFlowProps {
  badge: string;
  title: string;
  subtitle: string;
  steps: FlowStep[];
}

export const MasterExtractionFlow: React.FC<MasterExtractionFlowProps> = ({
  badge,
  title,
  subtitle,
  steps
}) => {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100 font-sans select-none overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-[#0B4028] uppercase tracking-widest block">
            {badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 font-medium max-w-lg mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Alur Proses Vertikal Dinamis */}
        <div className="space-y-4 relative">
          {steps.map((st, idx) => (
            <div key={idx} className="relative">
              <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-[#0B4028] transition-colors">
                
                {/* Lencana Nomor Fase */}
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-[#0B4028] text-slate-700 group-hover:text-[#C5A059] font-black text-sm flex items-center justify-center flex-shrink-0 transition-colors border border-slate-200">
                  {st.phase}
                </div>

                {/* Deskripsi Tahapan */}
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight group-hover:text-[#0B4028] transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                {/* Ikon Sudut Kanan */}
                <div className="hidden sm:flex w-8 h-8 rounded-lg bg-slate-50 items-center justify-center text-slate-400 flex-shrink-0 border border-slate-100">
                  <Layers size={14} />
                </div>

              </div>

              {/* Tanda Panah Penghubung */}
              {idx < steps.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowDown size={16} className="text-slate-300 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
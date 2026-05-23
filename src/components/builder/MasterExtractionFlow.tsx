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
    <section className="py-24 bg-slate-50 font-sans select-none overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        <div className="text-center space-y-6 flex flex-col items-center">
          <span className="text-[11px] font-black text-cyan-600 uppercase tracking-widest block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
            {badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-700 tracking-tight mt-6">
            {title}
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4 relative">
          {steps.map((st, idx) => (
            <div key={idx} className="relative">
              <div className="p-8 bg-white rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                
                <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-950 text-blue-900 group-hover:text-cyan-400 font-black text-base flex items-center justify-center flex-shrink-0 transition-colors shadow-sm">
                  {st.phase}
                </div>

                <div className="space-y-2 flex-1 border-l-2 border-transparent sm:border-blue-50 sm:pl-6 group-hover:border-cyan-100 transition-colors">
                  <h3 className="text-base font-black text-slate-800 tracking-tight group-hover:text-blue-950 transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-50 items-center justify-center text-slate-400 flex-shrink-0 group-hover:text-cyan-500 group-hover:bg-cyan-50 transition-colors">
                  <Layers size={18} />
                </div>

              </div>

              {idx < steps.length - 1 && (
                <div className="flex justify-center my-4">
                  <ArrowDown size={20} className="text-blue-200 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
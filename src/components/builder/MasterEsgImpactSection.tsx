import React from 'react';
import { Leaf, Droplet, Wind, Zap, Activity, ShieldCheck } from 'lucide-react';

export interface EsgMetric {
  tag: string;
  value: string;
  title: string;
  desc: string;
  iconType: string;
}

export interface MasterEsgImpactSectionProps {
  badge?: string;
  title?: string;
  description?: string;
  metrics?: EsgMetric[];
}

export const MasterEsgImpactSection: React.FC<MasterEsgImpactSectionProps> = ({
  badge = "Kepatuhan ESG",
  title = "Dasbor Kelestarian Lingkungan Real-Time",
  description = "Transparansi parameter baku mutu air limbah dan kualitas udara di seluruh kawasan ekstraksi LTJ Perminas.",
  metrics = []
}) => {
  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'leaf': return { icon: <Leaf size={18} />, color: 'text-cyan-400' };
      case 'droplet': return { icon: <Droplet size={18} />, color: 'text-teal-400' };
      case 'wind': return { icon: <Wind size={18} />, color: 'text-blue-400' };
      case 'zap': return { icon: <Zap size={18} />, color: 'text-yellow-400' };
      case 'activity': return { icon: <Activity size={18} />, color: 'text-red-400' };
      case 'shield': return { icon: <ShieldCheck size={18} />, color: 'text-emerald-400' };
      default: return { icon: <Leaf size={18} />, color: 'text-cyan-400' };
    }
  };

  return (
    <section className="py-24 bg-blue-950 text-white font-sans overflow-hidden relative border-t-4 border-cyan-500">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-6 flex flex-col items-center">
          <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-blue-800 after:rounded-full">
            {badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight leading-snug mt-6">{title}</h2>
          <p className="text-sm text-blue-100 font-medium leading-relaxed">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((m, idx) => {
            const { icon, color } = getIconAndColor(m.iconType);
            return (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-[2rem] rounded-tr-none p-8 backdrop-blur-md space-y-4 hover:bg-white/10 hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300 group">
                <div className={`flex items-center justify-between ${color}`}>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 group-hover:text-cyan-300 transition-colors">{m.tag}</span>
                </div>
                <div className="pt-2">
                  <span className="text-4xl font-black block tracking-tight">{m.value}</span>
                  <p className="text-sm font-bold mt-1 text-blue-50">{m.title}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed border-t border-white/10 pt-3">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
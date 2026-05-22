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
      case 'leaf': return { icon: <Leaf size={18} />, color: 'text-[#C5A059]' };
      case 'droplet': return { icon: <Droplet size={18} />, color: 'text-teal-400' };
      case 'wind': return { icon: <Wind size={18} />, color: 'text-blue-400' };
      case 'zap': return { icon: <Zap size={18} />, color: 'text-yellow-400' };
      case 'activity': return { icon: <Activity size={18} />, color: 'text-red-400' };
      case 'shield': return { icon: <ShieldCheck size={18} />, color: 'text-emerald-400' };
      default: return { icon: <Leaf size={18} />, color: 'text-[#C5A059]' };
    }
  };

  return (
    <section className="py-20 bg-[#0B4028] text-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest block">{badge}</span>
          <h2 className="text-3xl font-black tracking-tight">{title}</h2>
          <p className="text-xs text-slate-300 font-medium">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m, idx) => {
            const { icon, color } = getIconAndColor(m.iconType);
            return (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className={`flex items-center justify-between ${color}`}>
                  {icon}
                  <span className="text-[10px] font-mono">{m.tag}</span>
                </div>
                <span className="text-3xl font-black block">{m.value}</span>
                <p className="text-xs font-bold">{m.title}</p>
                <p className="text-[10px] text-slate-400">{m.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
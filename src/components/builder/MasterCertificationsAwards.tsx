import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

export interface CertItem { title: string; desc: string; }
export interface MasterCertificationsAwardsProps {
  title?: string;
  description?: string;
  certs?: CertItem[];
}

export const MasterCertificationsAwards: React.FC<MasterCertificationsAwardsProps> = ({
  title, description, certs = []
}) => {
  return (
    <section className="py-20 bg-white border-b border-slate-100 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
        <div className="space-y-3 max-w-lg">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0B4028] flex items-center justify-center border border-teal-100">
            <Award size={20} />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">{description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto flex-1 lg:max-w-2xl">
          {certs.map((c, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-start gap-3">
              <CheckCircle2 size={16} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-slate-900 tracking-tight">{c.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
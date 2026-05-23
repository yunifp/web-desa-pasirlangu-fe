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
    <section className="py-24 bg-blue-50 font-sans select-none overflow-hidden border-y border-blue-100">
      <div className="max-w-7xl mx-auto px-6 space-y-12 text-center">
        
        {/* Teks Tengah */}
        <div className="space-y-4 max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-blue-900 text-cyan-400 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Award size={24} />
          </div>
          <h3 className="text-3xl font-black text-blue-950 tracking-tight">{title}</h3>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">{description}</p>
        </div>

        {/* Grid Kartu Sertifikat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((c, idx) => (
            <div key={idx} className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 border-l-4 border-l-cyan-500 flex flex-col text-left gap-3 transition-all transform hover:-translate-y-1">
              <CheckCircle2 size={20} className="text-cyan-500" />
              <div>
                <h4 className="text-sm font-black text-blue-950 tracking-tight">{c.title}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
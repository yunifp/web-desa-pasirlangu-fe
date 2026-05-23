import React from 'react';
import { Globe2, MapPin } from 'lucide-react';

export interface MasterGlobalSupplyChainProps {
  badge?: string;
  title?: string;
  descriptionHtml?: string;
  regions?: { name: string }[];
}

export const MasterGlobalSupplyChain: React.FC<MasterGlobalSupplyChainProps> = ({
  badge = "Jaringan Distribusi Kritis",
  title = "Simpul Utama Rantai Pasok Teknologi Global",
  descriptionHtml = "Produksi material olahan <strong class=\"text-blue-950 font-black\">Rare Earth Oxide (REO)</strong> Perminas ditransmisikan secara langsung.",
  regions = []
}) => {
  return (
    <section className="py-24 bg-slate-50 font-sans text-center selection:bg-blue-900 selection:text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        
        <div className="w-20 h-20 bg-white rounded-[2rem] rounded-tr-none border-4 border-blue-50 shadow-md flex items-center justify-center text-blue-950 mx-auto hover:-translate-y-1 transition-transform">
          <Globe2 size={36} strokeWidth={1.5} className="text-cyan-500" />
        </div>

        <div className="space-y-6 flex flex-col items-center">
          <span className="text-[11px] font-black text-cyan-600 uppercase tracking-widest block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
            {badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-slate-700 tracking-tight leading-snug mt-6">
            {title}
          </h2>
          <p 
            className="text-sm text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto mt-2"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
          {regions.map((reg, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-blue-200 transition-colors">
              <MapPin size={16} className="text-cyan-500" />
              <span className="text-sm font-black text-slate-700 tracking-tight">{reg.name}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
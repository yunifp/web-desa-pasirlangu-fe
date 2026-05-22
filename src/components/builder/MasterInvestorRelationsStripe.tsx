import React from 'react';
import { FileText, Download } from 'lucide-react';

export interface InvestorDoc {
  title: string;
  url: string;
}

export interface MasterInvestorRelationsStripeProps {
  title?: string;
  subtitle?: string;
  documents?: InvestorDoc[];
}

export const MasterInvestorRelationsStripe: React.FC<MasterInvestorRelationsStripeProps> = ({
  title = "Keterbukaan Informasi Publik",
  subtitle = "Sekretariat & Hubungan Investor",
  documents = []
}) => {
  return (
    <section className="py-10 bg-white border-b border-slate-100 font-sans selection:bg-[#0B4028] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-center text-[#0B4028] flex-shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <span className="text-[11px] font-black text-slate-900 block tracking-tight">
              {title}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              {subtitle}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto">
          {documents.map((doc, idx) => (
            <a 
              key={idx}
              href={doc.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-50 hover:bg-[#0B4028] text-slate-700 hover:text-white rounded-lg border border-slate-200/80 text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-2xs group cursor-pointer"
            >
              <Download size={13} className="text-[#C5A059] group-hover:text-white transition-colors" /> 
              <span>{doc.title}</span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
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
    <section className="py-12 bg-white border-b-2 border-slate-50 font-sans selection:bg-blue-900 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
          <div className="w-12 h-12 rounded-[1rem] rounded-tr-none bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-950 flex-shrink-0 shadow-sm">
            <FileText size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[13px] font-black text-slate-800 block tracking-tight">
              {title}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {subtitle}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
          {documents.map((doc, idx) => (
            <a 
              key={idx}
              href={doc.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white hover:bg-blue-950 text-slate-600 hover:text-white rounded-[1rem] rounded-tr-none border-2 border-blue-50 hover:border-blue-950 text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow-md group cursor-pointer hover:-translate-y-0.5"
            >
              <Download size={14} className="text-cyan-600 group-hover:text-cyan-400 transition-colors" /> 
              <span>{doc.title}</span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
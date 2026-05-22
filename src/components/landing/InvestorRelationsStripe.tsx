import React from 'react';
import { FileText, Download } from 'lucide-react';

export const InvestorRelationsStripe: React.FC = () => {
  return (
    <section className="py-10 bg-white border-b border-slate-100 font-sans selection:bg-[#0B4028] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Identitas Kiri */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-center text-[#0B4028] flex-shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <span className="text-[11px] font-black text-slate-900 block tracking-tight">
              Keterbukaan Informasi Publik
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Sekretariat & Hubungan Investor
            </span>
          </div>
        </div>

        {/* Tombol Unduh Dokumen Resmi */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto">
          <button 
            onClick={() => alert("Mengunduh Laporan Tahunan PT Perminas...")} 
            className="px-4 py-2 bg-slate-50 hover:bg-[#0B4028] text-slate-700 hover:text-white rounded-lg border border-slate-200/80 text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-2xs group"
          >
            <Download size={13} className="text-[#C5A059] group-hover:text-white transition-colors" /> 
            <span>Annual Report 2025</span>
          </button>

          <button 
            onClick={() => alert("Mengunduh Pedoman Tata Kelola (GCG)...")} 
            className="px-4 py-2 bg-slate-50 hover:bg-[#0B4028] text-slate-700 hover:text-white rounded-lg border border-slate-200/80 text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-2xs group"
          >
            <Download size={13} className="text-[#C5A059] group-hover:text-white transition-colors" /> 
            <span>Piagam GCG Korporat</span>
          </button>
        </div>

      </div>
    </section>
  );
};
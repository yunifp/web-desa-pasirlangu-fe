import React from 'react';
import { Network, ArrowDown } from 'lucide-react';

export const GovernanceStructure: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50/50 border-b border-slate-100 font-sans select-none overflow-hidden text-center">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#0B4028] uppercase tracking-widest block">Skema Hierarki</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Struktur Organisasi & Tata Kelola
          </h2>
          <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto">Garis komando pertanggungjawaban mutlak yang menjamin efisiensi dan transparansi pengelolaan modal ventura negara.</p>
        </div>

        {/* Bagan Hierarki Vektor Sederhana */}
        <div className="flex flex-col items-center justify-center pt-4">
          
          {/* Node Puncak: Danantara */}
          <div className="p-5 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl w-72 space-y-1 relative">
            <span className="text-[8px] font-bold text-[#C5A059] uppercase tracking-widest block">Supervisi Kelembagaan</span>
            <h4 className="text-xs font-black tracking-wider uppercase">BPI Danantara</h4>
            <p className="text-[9px] text-slate-400 font-medium">Badan Pengelola Investasi Negara</p>
          </div>

          {/* Garis & Tanda Panah */}
          <div className="h-10 w-0.5 bg-slate-300 relative my-1">
            <ArrowDown size={14} className="absolute bottom-[-6px] left-[-6px] text-slate-400" />
          </div>

          {/* Node Tengah: Komisaris */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm w-64 space-y-0.5 mt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase">Dewan Komisaris</h4>
            <p className="text-[9px] text-slate-500 font-medium">Pengawas & Penasihat Strategi</p>
          </div>

          {/* Garis & Tanda Panah */}
          <div className="h-10 w-0.5 bg-slate-300 relative my-1">
            <ArrowDown size={14} className="absolute bottom-[-6px] left-[-6px] text-slate-400" />
          </div>

          {/* Node Bawah: Direksi Perminas */}
          <div className="p-6 bg-[#0B4028] text-white rounded-2xl border border-[#C5A059]/30 shadow-xl w-80 space-y-2.5 mt-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C5A059] mx-auto">
              <Network size={16} />
            </div>
            <div>
              <span className="text-[9px] font-bold text-[#C5A059] uppercase tracking-widest block">Pelaksana Mandat Eksekutif</span>
              <h4 className="text-sm font-black tracking-tight uppercase mt-0.5">Direksi PT Perminas</h4>
              <p className="text-[10px] text-slate-200 font-medium mt-1">Mengelola seluruh klaster fasilitas ekstraksi, pemurnian smelter, dan integrasi rantai pasok EV.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
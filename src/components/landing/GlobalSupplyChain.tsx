import React from 'react';
import { Globe2, MapPin } from 'lucide-react';

export const GlobalSupplyChain: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100 font-sans text-center selection:bg-[#0B4028] selection:text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        
        {/* Ikon Puncak Bernuansa Zamrud */}
        <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center text-[#0B4028] mx-auto">
          <Globe2 size={32} strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Jaringan Distribusi Kritis
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Simpul Utama Rantai Pasok Teknologi Global
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Produksi material olahan <strong className="text-slate-900 font-black">Rare Earth Oxide (REO)</strong> Perminas ditransmisikan secara langsung untuk menyuplai pabrikan manufaktur magnet permanen bernilai tinggi di pusat-pusat industri dunia.
          </p>
        </div>

        {/* Deretan Koridor Pasar (Murni Menggunakan Ikon Lucide) */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-2xs">
            <MapPin size={14} className="text-[#C5A059]" />
            <span className="text-xs font-bold text-slate-700">Asia Pasifik</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-2xs">
            <MapPin size={14} className="text-[#C5A059]" />
            <span className="text-xs font-bold text-slate-700">Uni Eropa</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-2xs">
            <MapPin size={14} className="text-[#C5A059]" />
            <span className="text-xs font-bold text-slate-700">Amerika Utara</span>
          </div>
        </div>

      </div>
    </section>
  );
};
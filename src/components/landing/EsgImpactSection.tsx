import React from 'react';
import { Leaf, Droplet, Wind } from 'lucide-react';

export const EsgImpactSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#0B4028] text-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest block">Kepatuhan ESG</span>
          <h2 className="text-3xl font-black tracking-tight">Dasbor Kelestarian Lingkungan Real-Time</h2>
          <p className="text-xs text-slate-300 font-medium">Transparansi parameter baku mutu air limbah dan kualitas udara di seluruh kawasan ekstraksi LTJ Perminas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between text-[#C5A059]">
              <Leaf size={18} />
              <span className="text-[10px] font-mono">Audit Danantara</span>
            </div>
            <span className="text-3xl font-black block">94.5%</span>
            <p className="text-xs font-bold">Keberhasilan Reklamasi Lahan</p>
            <p className="text-[10px] text-slate-400">Pemulihan tajuk kanopi vegetasi endemik pada bekas area penambangan monasit.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between text-teal-400">
              <Droplet size={18} />
              <span className="text-[10px] font-mono">Baku Mutu Air</span>
            </div>
            <span className="text-3xl font-black block">pH 6.8</span>
            <p className="text-xs font-bold">Netralisasi Limbah Cair</p>
            <p className="text-[10px] text-slate-400">Kadar asam tersaring optimal di bawah ambang batas aman kementerian lingkungan.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between text-blue-400">
              <Wind size={18} />
              <span className="text-[10px] font-mono">Indeks Udara</span>
            </div>
            <span className="text-3xl font-black block">12 µg/m³</span>
            <p className="text-xs font-bold">Partikulat Debu Terkendali</p>
            <p className="text-[10px] text-slate-400">Sistem penyiram kabut otomatis beroperasi 24 jam pada seluruh sabuk konveyor pengangkut.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
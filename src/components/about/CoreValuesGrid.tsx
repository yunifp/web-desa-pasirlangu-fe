import React from 'react';
import { Compass, Target, Award, Shield, Zap, Users } from 'lucide-react';

export const CoreValuesGrid: React.FC = () => {
  const coreValues = [
    {
      title: "Amanah",
      desc: "Memegang teguh kepercayaan dan mandat ekstraksi mineral kritis negara dengan integritas moral dan transparansi absolut.",
      icon: Shield
    },
    {
      title: "Kompeten",
      desc: "Terus mengasah kepakaran teknis dalam bidang pemurnian logam tanah jarang demi mencapai tingkat kemurnian tertinggi.",
      icon: Award
    },
    {
      title: "Harmonis",
      desc: "Saling peduli dan menghargai keragaman dalam ekosistem operasional serta mengutamakan keselamatan kerja masyarakat.",
      icon: Users
    },
    {
      title: "Loyal",
      desc: "Berdedikasi dan mengutamakan kepentingan bangsa di atas segalanya guna mewujudkan kedaulatan rantai pasok global.",
      icon: Target
    },
    {
      title: "Adaptif",
      desc: "Cepat menyesuaikan diri menghadapi dinamika pasar teknologi tinggi dan terus berinovasi dalam tumpukan metode ekstraksi.",
      icon: Zap
    },
    {
      title: "Kolaboratif",
      desc: "Mendorong sinergi berkelanjutan di bawah supervisi BPI Danantara serta membangun kemitraan strategis mancanegara.",
      icon: Compass
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* --- BLOK VISI & MISI --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Visi Korporat (Lebar 5 Kolom) */}
          <div className="lg:col-span-5 p-8 bg-[#0B4028] text-white rounded-3xl border border-slate-900 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-[-10%] bottom-[-10%] w-48 h-48 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest block">
                Cita-Cita Utama
              </span>
              <h3 className="text-3xl font-black tracking-tight leading-tight">
                Visi Perminas
              </h3>
              <p className="text-sm text-slate-200 font-medium leading-relaxed pt-2">
                "Menjadi korporasi pengelola mineral strategis dan logam tanah jarang berkelas dunia yang memimpin rantai pasok semikonduktor serta ekosistem energi ramah lingkungan."
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 relative z-10">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Target Realisasi</span>
              <p className="text-xs font-black text-[#C5A059] mt-0.5">Kedaulatan Hilirisasi Penuh</p>
            </div>
          </div>

          {/* Misi Korporat (Lebar 7 Kolom) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Peta Jalan Operasional</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Misi Strategis Korporasi
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Eksplorasi dan ekstraksi cadangan monasit serta xenotim secara terukur dan presisi.",
                "Pembangunan kemandirian fasilitas pemurnian (smelter) mutakhir di dalam negeri.",
                "Integrasi produk material magnet NdFeB ke rantai pasok ekosistem global EV.",
                "Penerapan prinsip tata kelola perusahaan yang bersih di bawah supervisi Danantara."
              ].map((misi, idx) => (
                <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                  <span className="w-7 h-7 rounded-lg bg-[#0B4028]/10 text-[#0B4028] font-black text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    {misi}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* --- BLOK NILAI INTI (CORE VALUES GRID) --- */}
        <div className="space-y-8 pt-6 border-t border-slate-200/60">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-[#0B4028] uppercase tracking-widest block">Landasan Budaya Kerja</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Nilai-Nilai Inti Korporasi
            </h3>
            <p className="text-xs text-slate-500 font-medium">Prinsip moral yang menjiwai setiap insan Perminas dalam mengoperasikan aset strategis negara.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => {
              const IconComponent = val.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 group hover:border-[#0B4028] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-[#0B4028] text-slate-700 group-hover:text-[#C5A059] flex items-center justify-center transition-colors border border-slate-100">
                      <IconComponent size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-[#C5A059] transition-colors">
                     {idx + 1}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0B4028] transition-colors tracking-tight">
                    {val.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
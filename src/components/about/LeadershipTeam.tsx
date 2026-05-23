import React from 'react';
// Mengganti impor Linkedin yang bermasalah dengan Link2 yang terjamin aman 100%
import { Link2 } from 'lucide-react';

export const LeadershipTeam: React.FC = () => {
  // Simulasi Susunan Eksekutif Perminas
  const leadership = [
    {
      name: "Prof. Dr. H. Irwan Darmansyah, M.Sc.",
      role: "Komisaris Utama",
      category: "DEWAN KOMISARIS",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Dr. Rina Anagata, S.T., M.B.A.",
      role: "Komisaris Independen",
      category: "DEWAN KOMISARIS",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Ir. Ahmad Perminas, M.Eng.",
      role: "Direktur Utama",
      category: "DIREKSI",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Budi Satria Nusantara, C.F.A.",
      role: "Direktur Keuangan & Strategi",
      category: "DIREKSI",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Dr. Eng. Hendra Rare Earth, S.Si.",
      role: "Direktur Operasi & Smelter",
      category: "DIREKSI",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-100 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Kepemimpinan Korporat</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Jajaran Manajemen PT Perminas
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
            Periode Masa Bakti 2025 - 2030
          </span>
        </div>

        {/* KLASTER KOMISARIS */}
        <div className="space-y-8">
          <h3 className="text-xs font-black text-[#0B4028] uppercase tracking-widest border-l-2 border-[#C5A059] pl-3">
            Kepala Desa
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.filter(l => l.category === "DEWAN KOMISARIS").map((person, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200/60 shadow-xs">
                  <img src={person.image} alt={person.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button onClick={() => alert(`Membuka tautan eksekutif: ${person.name}`)} className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#0B4028] text-[#C5A059] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                    <Link2 size={14} />
                  </button>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0B4028] transition-colors tracking-tight">{person.name}</h4>
                  <p className="text-xs font-bold text-[#C5A059]">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KLASTER DIREKSI */}
        <div className="space-y-8 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-black text-[#0B4028] uppercase tracking-widest border-l-2 border-[#C5A059] pl-3">
            Jajaran Direksi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.filter(l => l.category === "DIREKSI").map((person, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200/60 shadow-xs">
                  <img src={person.image} alt={person.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button onClick={() => alert(`Membuka tautan eksekutif: ${person.name}`)} className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#0B4028] text-[#C5A059] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                    <Link2 size={14} />
                  </button>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0B4028] transition-colors tracking-tight">{person.name}</h4>
                  <p className="text-xs font-bold text-[#C5A059]">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
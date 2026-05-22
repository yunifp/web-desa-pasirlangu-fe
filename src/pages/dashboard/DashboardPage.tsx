import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Layers, ShieldCheck, Database, LayoutGrid, Activity, Cpu, HardDrive, Network } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* --- BANNER UTAMA EKSEKUTIF --- */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-teal-400 font-bold text-xs uppercase tracking-widest">
            <Layers size={14} /> Command Center
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Selamat Datang, {user?.name || 'Eksekutif'}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
            Portal administrasi terpusat PT Perminas. Gunakan panel navigasi kiri untuk merangkai tata letak halaman publik, mengelola pustaka media, serta meninjau distribusi artikel.
          </p>
        </div>
      </div>

      {/* --- SEKSI BARU: MONITORING KESEHATAN SISTEM (SYSTEM MONITORING) --- */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Monitoring Infrastruktur Server</h2>
              <p className="text-[11px] text-slate-500 font-medium">Pengawasan waktu nyata utilitas perangkat keras dan latensi jaringan.</p>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metrik 1: CPU */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold text-slate-600 uppercase">Beban CPU</span>
              <Cpu size={16} className="text-teal-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">18.4%</span>
              <span className="text-[10px] text-emerald-600 font-bold">Normal</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: '18.4%' }}></div>
            </div>
          </div>

          {/* Metrik 2: Memory RAM */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold text-slate-600 uppercase">Memori Terpakai</span>
              <HardDrive size={16} className="text-teal-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">4.2 GB</span>
              <span className="text-[10px] text-slate-400 font-mono">/ 16 GB</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: '26.25%' }}></div>
            </div>
          </div>

          {/* Metrik 3: Database I/O */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold text-slate-600 uppercase">Kueri Database</span>
              <Database size={16} className="text-teal-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">142</span>
              <span className="text-[10px] text-slate-500 font-medium">req/sec</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          {/* Metrik 4: Network Traffic */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold text-slate-600 uppercase">Lalu Lintas API</span>
              <Network size={16} className="text-teal-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">99.8%</span>
              <span className="text-[10px] text-emerald-600 font-bold">Uptime</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.8%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PILAR FITUR CEPAT --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold">
            <LayoutGrid size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Modular Page Engine</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">Sistem penataan halaman mandiri berbasis drag-and-drop 8 komponen pintar tanpa modifikasi kodingan dasar.</p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
            <Database size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Pustaka Aset Terpusat</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">Manajemen unggah multi-file dan penyisipan visual atau video secara langsung ke dalam tubuh paragraf artikel.</p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Keamanan Terenkripsi</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">Sistem perlindungan akses berlapis dengan validasi token OTP korespondensi surel dan RBAC hierarki mutlak.</p>
        </div>
      </div>

      {/* --- INFO FOOTER STATUS --- */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-800">Sistem Operasional Eksekutif Terpusat</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider">PT PERMINAS CORE v2.5</span>
      </div>

    </div>
  );
};
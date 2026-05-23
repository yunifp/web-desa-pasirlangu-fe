import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Layers, ShieldCheck, Database, LayoutGrid} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* --- BANNER UTAMA EKSEKUTIF --- */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-bold text-xs uppercase tracking-widest">
            <Layers size={14} /> Command Center
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Selamat Datang, {user?.name || 'Admin'}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed">
            Portal administrasi terpusat Desa Pasir Langu, Kec. Cisarua. Gunakan panel navigasi kiri untuk merangkai tata letak halaman publik, mengelola pustaka media, serta meninjau distribusi artikel dan berita desa.
          </p>
        </div>
      </div>

      {/* --- PILAR FITUR CEPAT --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
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
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-sm font-black text-slate-900">Keamanan Terenkripsi</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">Sistem perlindungan akses berlapis dengan validasi token OTP korespondensi surel dan RBAC hierarki mutlak.</p>
        </div>
      </div>

    </div>
  );
};
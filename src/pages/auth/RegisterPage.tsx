/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Mail, Lock, User as UserIcon, ShieldCheck, Layers, Loader2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/register', { name, email, password });
      alert('Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070d16] p-4 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Aksen Cahaya Latar Belakang Biru Tua */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-700/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-indigo-700/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 transition-all duration-300 animate-in fade-in zoom-in-95">
        
        {/* Header Identitas Desa */}
        <div className="p-8 bg-slate-950 text-white text-center relative overflow-hidden border-b border-slate-900">
          <div className="flex justify-center mb-4 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-900 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/40">
              <Layers size={32} className="text-white" />
            </div>
          </div>

          <h1 className="text-xl font-black tracking-tight text-white uppercase relative z-10">
            DESA PASIR LANGU
          </h1>
          <p className="text-slate-400 text-[10px] mt-1.5 uppercase tracking-widest font-bold relative z-10">
            KEC. CISARUA, BANDUNG BARAT
          </p>
        </div>

        {/* Formulir Pendaftaran */}
        <form onSubmit={handleRegister} className="p-8 space-y-5 bg-white flex flex-col justify-between">
          
          {error && (
            <div className="bg-red-50 flex items-center gap-3 text-red-700 p-3.5 rounded-xl text-xs font-bold border border-red-100 animate-in fade-in duration-200">
              <ShieldCheck size={16} className="text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-700 transition-colors">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={18} />
                <input 
                  type="text" required
                  value={name} onChange={e => setName(e.target.value)} 
                  placeholder="Masukkan nama lengkap" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-700 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-700 transition-colors">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={18} />
                <input 
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)} 
                  placeholder="admin@pasirlangu.desa.id" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-700 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-700 transition-colors">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={18} />
                <input 
                  type="password" required
                  value={password} onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-700 transition-all"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {isLoading ? <><Loader2 className="animate-spin" size={16} /> Memproses...</> : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500 pb-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-900 font-black hover:text-blue-600 hover:underline transition-colors">
            Masuk di sini
          </Link>
        </p>

        {/* Sub-footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                DESA PASIR LANGU &copy; {new Date().getFullYear()}
            </p>
        </div>

      </div>
    </div>
  );
};
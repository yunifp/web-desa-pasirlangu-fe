/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, KeyRound, Layers } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const loginStore = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, refreshToken, user } = response.data;

            loginStore.login(token, refreshToken, user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Akses ditolak. Kredensial tidak terdaftar dalam klaster otorisasi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070d16] p-4 relative overflow-hidden font-sans selection:bg-teal-500 selection:text-white">

            {/* Aksen Cahaya Latar Belakang Korporat */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-40 w-96 h-96 bg-teal-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 transition-all duration-300 animate-in fade-in zoom-in-95">

                {/* Mahkota Eksklusif Perminas */}
                <div className="p-8 bg-slate-950 text-white text-center relative overflow-hidden border-b border-slate-900">
                    <div className="flex justify-center mb-4 relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-teal-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-900/40">
                            <Layers size={32} className="text-white" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-white uppercase relative z-10">
                        PT PERMINAS
                    </h1>

                    <p className="text-slate-400 text-[10px] mt-1.5 uppercase tracking-widest font-bold relative z-10">
                        Secure Enterprise Gateway
                    </p>
                </div>

                {/* Form Otorisasi */}
                <form onSubmit={handleLogin} className="p-8 space-y-5 bg-white flex flex-col justify-between">
                    {error && (
                        <div className="bg-red-50 flex items-center gap-3 text-red-700 p-3 rounded-xl text-xs font-bold border border-red-100 animate-in fade-in duration-200">
                            <KeyRound size={16} className="text-red-600 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5 group">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">
                                Surel Otorisasi
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                                <input
                                    type="email" required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-teal-600 transition-all"
                                    placeholder="eksekutif@perminas.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 group">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">
                                    Kata Sandi
                                </label>
                                <Link to="/forgot-password" className="text-[10px] font-bold text-teal-600 hover:text-teal-800 transition-colors">
                                    Lupa Sandi?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"} required
                                    className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-teal-600 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-teal-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin" size={16} /> Autentikasi Sesi...</>
                        ) : (
                            <><LogIn size={16} /> Masuk Sistem</>
                        )}
                    </button>
                </form>

                {/* Sub-footer Hak Cipta Swasta */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        PT PERMINAS &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};
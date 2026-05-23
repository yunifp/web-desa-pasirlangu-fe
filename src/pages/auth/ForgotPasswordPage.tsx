/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Mail, Lock, KeyRound, Loader2, ArrowLeft, CheckCircle, Eye, EyeOff, ShieldCheck, Layers } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal memproses permintaan. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/verify-otp', { email, otp });
            setStep(3);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Kode OTP tidak valid atau sudah kedaluwarsa.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Konfirmasi password tidak cocok.');
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setStep(4);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal mereset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070d16] p-4 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
            {/* Latar Belakang Biru Tua */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-700/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-indigo-700/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-500">
                
                {/* Penampang Atas Eksklusif */}
                <div className="p-8 bg-slate-950 text-white text-center relative overflow-hidden border-b border-slate-900">
                    <div className="flex justify-center mb-4 relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-tr from-blue-900 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                            <Layers size={28} className="text-white" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black tracking-tight text-white uppercase relative z-10 mb-2">
                        {step === 1 && "Pemulihan Akses"}
                        {step === 2 && "Verifikasi Keamanan"}
                        {step === 3 && "Kredensial Baru"}
                        {step === 4 && "Akses Pulih!"}
                    </h1>
                    <p className="text-slate-400 text-xs font-medium relative z-10 max-w-xs mx-auto">
                        {step === 1 && "Masukkan alamat email akun Sistem Informasi Desa Pasir Langu Anda untuk instruksi pemulihan."}
                        {step === 2 && "Sistem telah mentransmisikan kode 6 digit rahasia ke kotak masuk Anda."}
                        {step === 3 && "Tetapkan kombinasi kata sandi baru berstandar enkripsi tinggi."}
                        {step === 4 && "Kata sandi otorisasi Anda berhasil disinkronisasi ke dalam server."}
                    </p>
                </div>

                <div className="p-8 bg-white space-y-6">
                    {error && (
                        <div className="bg-red-50 flex items-center gap-3 text-red-700 p-3.5 rounded-xl text-xs font-bold border border-red-100">
                            <ShieldCheck size={16} className="text-red-600 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* STEP 1 */}
                    {step === 1 && (
                        <form onSubmit={handleRequestOtp} className="space-y-5 animate-in fade-in duration-300">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                    Alamat Email Resmi
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email" required autoFocus
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-700 transition-all"
                                        placeholder="admin@pasirlangu.desa.id"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <><Loader2 className="animate-spin" size={16} /> Memverifikasi...</> : 'Kirim Instruksi Pemulihan'}
                            </button>

                            <div className="text-center pt-2">
                                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">
                                    <ArrowLeft size={14} /> Kembali ke Gerbang Login
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in duration-300">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                    Token Otorisasi (OTP)
                                </label>
                                <div className="relative">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text" required autoFocus maxLength={6}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-blue-700 transition-all font-mono font-bold text-base tracking-[0.6em] text-center"
                                        placeholder="••••••"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading || otp.length < 6}
                                className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <><Loader2 className="animate-spin" size={16} /> Otentikasi...</> : 'Validasi Token'}
                            </button>

                            <div className="text-center pt-2">
                                <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">
                                    <ArrowLeft size={14} /> Koreksi Alamat Email
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                    Kata Sandi Baru
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"} required autoFocus minLength={6}
                                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-700 transition-all"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                    Konfirmasi Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"} required minLength={6}
                                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-700 transition-all"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading || !newPassword || !confirmPassword}
                                className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-950/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                            >
                                {loading ? <><Loader2 className="animate-spin" size={16} /> Enkripsi...</> : 'Terapkan Sandi Permanen'}
                            </button>
                        </form>
                    )}

                    {/* STEP 4 */}
                    {step === 4 && (
                        <div className="text-center py-6 animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-base font-black text-slate-900 mb-1">Kredensial Siap Digunakan</h3>
                            <p className="text-xs text-slate-500 mb-6 font-medium max-w-xs mx-auto">Autentikasi Anda berhasil diubah. Silakan masuk menggunakan kata sandi baru.</p>
                            <Link
                                to="/login"
                                className="w-full inline-block py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
                            >
                                Menuju Gerbang Autentikasi
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
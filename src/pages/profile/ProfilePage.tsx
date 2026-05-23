/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import {
    User as UserIcon, Lock, ShieldCheck,
    CheckCircle, XCircle, Loader2, Eye, EyeOff, KeyRound, Save,
    Globe, Mail, X, Layers
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const { user: sessionUser, token, refreshToken, login } = useAuthStore();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);

    const [profileInfo, setProfileInfo] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [otp, setOtp] = useState('');
    const [pendingPayload, setPendingPayload] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/users/profile');
                const data = response.data.data;

                setProfileInfo(data);
                setFormData(prev => ({ ...prev, name: data.name, email: data.email }));
            } catch (error: any) {
                setErrorMessage(error.response?.data?.message || 'Gagal memuat data profil.');
                setIsErrorModalOpen(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = () => {
        const { oldPassword, newPassword, confirmPassword } = formData;
        const isChangingPassword = oldPassword || newPassword || confirmPassword;

        if (isChangingPassword) {
            if (!oldPassword) return "Password lama wajib diisi.";
            if (!newPassword) return "Password baru wajib diisi.";
            if (!confirmPassword) return "Konfirmasi password wajib diisi.";
            if (newPassword.length < 6) return "Password baru minimal 6 karakter.";
            if (newPassword !== confirmPassword) return "Password baru dan konfirmasi tidak cocok.";
        }

        if (!formData.name.trim()) return "Nama tidak boleh kosong.";
        if (!formData.email.trim()) return "Email tidak boleh kosong.";
        return null;
    };

    const executeProfileUpdate = async (payload: any) => {
        setIsSaving(true);
        try {
            const response = await api.put('/users/profile', payload);

            setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
            setOtp('');
            setIsOtpModalOpen(false);
            setPendingPayload(null);

            setSuccessMessage('Kredensial identitas Anda berhasil disinkronisasi!');
            setIsSuccessModalOpen(true);

            if (sessionUser && token && refreshToken) {
                const updatedUser = {
                    ...sessionUser,
                    name: response.data.data.name,
                    email: response.data.data.email
                };
                login(token, refreshToken, updatedUser);
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan profil.');
            setIsErrorModalOpen(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            setIsErrorModalOpen(true);
            return;
        }

        const payload: any = { name: formData.name, email: formData.email };
        if (formData.newPassword) {
            payload.oldPassword = formData.oldPassword;
            payload.newPassword = formData.newPassword;
            payload.confirmPassword = formData.confirmPassword;
        }

        if (formData.email !== profileInfo?.email) {
            setIsRequestingOtp(true);
            try {
                await api.post('/users/request-email-otp', { newEmail: formData.email });
                setPendingPayload(payload);
                setIsOtpModalOpen(true);
            } catch (error: any) {
                setErrorMessage(error.response?.data?.message || 'Gagal mengirim OTP ke email baru.');
                setIsErrorModalOpen(true);
            } finally {
                setIsRequestingOtp(false);
            }
        } else {
            executeProfileUpdate(payload);
        }
    };

    const handleVerifyOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) return;

        const finalPayload = { ...pendingPayload, otp };
        executeProfileUpdate(finalPayload);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-700 mb-4" size={40} />
                <p className="text-slate-500 font-medium animate-pulse">Mengautentikasi data profil administrator...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto font-sans animate-in fade-in duration-300">
            {/* Header Ruas */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Konfigurasi Akun Pengguna</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Manajemen parameter otorisasi, identitas personal, dan tingkat keamanan akses portal.</p>
                </div>
                <div className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-bold text-xs flex items-center gap-1.5">
                    <Layers size={14} /> DESA PASIR LANGU
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* --- KIRI: CARD IDENTITAS PENGGUNA --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center relative overflow-hidden flex flex-col justify-between">
                        {/* Ornamen Latar Biru Gelap */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 rounded-t-3xl border-b border-slate-800"></div>
                        
                        <div className="relative z-10 flex flex-col items-center mt-6">
                            <div className="w-24 h-24 bg-gradient-to-tr from-blue-800 to-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-900/20 border-4 border-white mb-4 text-white font-bold">
                                <UserIcon size={40} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">{profileInfo?.name}</h2>
                            <p className="text-xs font-semibold text-blue-700 mb-6">{profileInfo?.email}</p>

                            <div className="w-full text-left space-y-4 border-t border-slate-100 pt-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                        <ShieldCheck size={14} className="text-blue-700" /> Grup Hak Akses
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {profileInfo?.roles?.map((r: any) => (
                                            <span key={r.role.id} className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-lg font-bold shadow-2xs uppercase tracking-wider">
                                                {r.role.name.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                        <Globe size={14} className="text-blue-700" /> Cakupan Otoritas
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-150 font-bold">
                                        <Globe size={15} className="text-blue-700 flex-shrink-0" /> Administrator Desa
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- KANAN: FORM PEMBARUAN DATA --- */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-black text-slate-900 text-sm tracking-wide">Pembaruan Formulir Kredensial</h3>
                        </div>

                        <div className="p-8 space-y-8 flex-1">
                            
                            {/* Ruas 1: Info Dasar */}
                            <div className="space-y-5">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <UserIcon size={14} className="text-blue-700" /> Parameter Identitas
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-700 transition-colors">Nama Lengkap Administrator</label>
                                        <input
                                            name="name" required value={formData.name} onChange={handleChange}
                                            className="w-full border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-700 transition-colors">Surel Korespondensi</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={18} />
                                            <input
                                                name="email" type="email" required value={formData.email} onChange={handleChange}
                                                className="w-full pl-11 pr-4 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white"
                                            />
                                        </div>
                                        {formData.email !== profileInfo?.email && (
                                            <p className="text-[10px] text-blue-700 font-bold mt-1">* Autentikasi token OTP akan ditransmisikan ke surel baru.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Ruas 2: Kata Sandi */}
                            <div className="space-y-5 pt-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <KeyRound size={14} className="text-blue-700" /> Kata Sandi Otorisasi (Opsional)
                                </h4>
                                <p className="text-xs text-slate-400 mb-4 font-medium">Kosongkan ruas di bawah apabila tidak ada instruksi perubahan kata sandi.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 group md:col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-700 transition-colors">Kata Sandi Saat Ini</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={18} />
                                            <input
                                                name="oldPassword" type={showPasswords.old ? "text" : "password"} value={formData.oldPassword} onChange={handleChange}
                                                className="w-full pl-11 pr-12 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white placeholder:font-normal"
                                                placeholder="Kredensial sandi lama..."
                                            />
                                            <button type="button" onClick={() => togglePasswordVisibility('old')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600">
                                                {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-700 transition-colors">Kata Sandi Baru</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={18} />
                                            <input
                                                name="newPassword" type={showPasswords.new ? "text" : "password"} value={formData.newPassword} onChange={handleChange}
                                                className="w-full pl-11 pr-12 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white placeholder:font-normal"
                                                placeholder="Minimal 6 karakter"
                                            />
                                            <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600">
                                                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-blue-700 transition-colors">Konfirmasi Kata Sandi</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors" size={18} />
                                            <input
                                                name="confirmPassword" type={showPasswords.confirm ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange}
                                                className="w-full pl-11 pr-12 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white placeholder:font-normal"
                                                placeholder="Ulangi kombinasi sandi"
                                            />
                                            <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600">
                                                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Simpan */}
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving || isRequestingOtp}
                                className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-950/20 hover:from-blue-900 hover:to-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                            >
                                {isSaving || isRequestingOtp ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : <><Save size={16} /> Terapkan Sinkronisasi</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL OTP */}
            {isOtpModalOpen && (
                <div className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="p-6 bg-slate-950 text-white flex justify-between items-center border-b border-slate-900">
                            <h2 className="text-base font-black tracking-tight uppercase">Validasi Perubahan Surel</h2>
                            <button onClick={() => { setIsOtpModalOpen(false); setOtp(''); }} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleVerifyOtpSubmit} className="p-7 space-y-5">
                            <p className="text-xs text-slate-500 text-center font-medium leading-relaxed max-w-xs mx-auto">
                                Token OTP telah ditransmisikan ke alamat baru: <br />
                                <strong className="text-blue-700 block mt-1">{formData.email}</strong>
                            </p>
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Token 6 Digit</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required autoFocus maxLength={6}
                                        value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl outline-none focus:border-blue-700 font-mono font-bold text-center text-lg tracking-[0.6em] text-slate-900 bg-slate-50/50"
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={isSaving || otp.length < 6} className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md mt-2">
                                {isSaving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Otorisasi Token'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ERROR */}
            {isErrorModalOpen && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 text-center p-8">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                            <XCircle size={32} />
                        </div>
                        <h2 className="text-lg font-black text-slate-900">Sinkronisasi Ditolak</h2>
                        <p className="text-xs text-slate-500 mt-1.5 mb-6 font-medium max-w-xs mx-auto">{errorMessage}</p>
                        <button onClick={() => setIsErrorModalOpen(false)} className="w-full py-3 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-slate-900">
                            Tutup Peringatan
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL SUKSES */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 text-center p-8">
                        <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-lg font-black text-slate-900">Pembaruan Berhasil</h2>
                        <p className="text-xs text-slate-500 mt-1.5 mb-6 font-medium max-w-xs mx-auto">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="w-full py-3 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-slate-900">
                            Tutup Panel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
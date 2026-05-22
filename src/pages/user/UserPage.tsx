/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useAuthStore } from '../../store/useAuthStore';
import type { User, UserFormData } from '../../types/user';
import {
    Search, Plus, Edit, Trash2,
    Shield, X, ChevronDown, ChevronUp,
    Eye, EyeOff, Loader2, Inbox, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';

export const UserPage: React.FC = () => {
    const { users, roles, meta, isLoading, createUser, updateUser, deleteUser, fetchUsers } = useUsers();
    const { hasPermission } = useAuthStore();

    const canCreate = hasPermission('/users', 'CREATE');
    const canUpdate = hasPermission('/users', 'UPDATE');
    const canDelete = hasPermission('/users', 'DELETE');

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        name: '', email: '', password: '', roleIds: []
    });

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchUsers(page, limit);
    }, [page, limit, fetchUsers]);

    const processedUsers = useMemo(() => {
        let result = [...users];
        if (searchTerm) {
            const lowTerm = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.name.toLowerCase().includes(lowTerm) ||
                u.email.toLowerCase().includes(lowTerm)
            );
        }
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = (a[sortConfig.key] || '').toString().toLowerCase();
                const bVal = (b[sortConfig.key] || '').toString().toLowerCase();
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [users, searchTerm, sortConfig]);

    const requestSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const openModal = (userTarget?: User) => {
        setShowPassword(false);
        if (userTarget) {
            setCurrentUser(userTarget);
            setFormData({
                name: userTarget.name, email: userTarget.email,
                roleIds: userTarget.roles.map((r: any) => r.role.id)
            });
        } else {
            setCurrentUser(null);
            setFormData({ name: '', email: '', password: '', roleIds: [] });
        }
        setIsModalOpen(true);
    };

    const toggleRole = (roleId: string) => {
        setFormData(prev => ({
            ...prev,
            roleIds: prev.roleIds.includes(roleId)
                ? prev.roleIds.filter(id => id !== roleId)
                : [...prev.roleIds, roleId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = { ...formData };
        const result = currentUser ? await updateUser(currentUser.id, finalData) : await createUser(finalData);

        if (result.success) {
            setIsModalOpen(false);
            setSuccessMessage(currentUser ? "Data otorisasi staf diperbarui!" : "Akun staf eksekutif baru terdaftar!");
            setIsSuccessModalOpen(true);
            fetchUsers(page, limit);
        } else {
            setErrorMessage(result.message || "Gagal sinkronisasi data pengguna.");
            setIsErrorModalOpen(true);
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!deleteTargetId) return;
        const result = await deleteUser(deleteTargetId);
        if (result.success) {
            setIsDeleteModalOpen(false);
            setSuccessMessage("Akun pengguna dicabut permanen dari server!");
            setIsSuccessModalOpen(true);
            fetchUsers(page, limit);
        } else {
            setIsDeleteModalOpen(false);
            setErrorMessage(result.message || "Gagal mencabut hak akses.");
            setIsErrorModalOpen(true);
        }
        setDeleteTargetId(null);
    };

    return (
        <div className="space-y-6 font-sans animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Staf Pengguna</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Pengendalian kredensial administrator eksekutif dan pemetaan wewenang penulis pada sistem.</p>
                </div>
                {canCreate && (
                    <button onClick={() => openModal()} className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-950/20 hover:from-teal-700 hover:to-emerald-700 transition-all font-bold text-xs uppercase tracking-wider active:scale-95">
                        <Plus size={16} /> Registrasi Staf
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text" placeholder="Kueri pencarian nama atau surel..."
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none text-xs font-semibold shadow-2xs transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-150">
                            <tr>
                                <th className="p-4 pl-6 cursor-pointer hover:text-teal-600 transition-colors whitespace-nowrap" onClick={() => requestSort('name')}>
                                    <div className="flex items-center gap-1.5">
                                        Identitas Lengkap {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                                    </div>
                                </th>
                                <th className="p-4 whitespace-nowrap">Surel Korespondensi</th>
                                <th className="p-4 whitespace-nowrap">Pemetaan Hak Akses</th>
                                {(canUpdate || canDelete) && <th className="p-4 pr-6 text-center whitespace-nowrap">Otoritas</th>}
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-16 text-center text-slate-400 font-medium"><Loader2 className="animate-spin mx-auto mb-2 text-teal-600" size={24} />Memuat registri staf...</td></tr>
                            ) : processedUsers.length > 0 ? (
                                processedUsers.map(userItem => (
                                    <tr key={userItem.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="p-4 pl-6 font-bold text-slate-900 text-sm tracking-wide">{userItem.name}</td>
                                        <td className="p-4 text-slate-500 font-medium">{userItem.email}</td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {userItem.roles.map((ur: any, idx: number) => (
                                                    <span key={idx} className="bg-slate-900 text-white font-bold text-[9px] px-2.5 py-0.5 rounded shadow-2xs uppercase tracking-wide">
                                                        {ur.role.name.replace(/_/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-4 pr-6">
                                                <div className="flex justify-center gap-1.5">
                                                    {canUpdate && <button onClick={() => openModal(userItem)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="Koreksi"><Edit size={16} /></button>}
                                                    {canDelete && <button onClick={() => confirmDelete(userItem.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Cabut"><Trash2 size={16} /></button>}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="p-16 text-center text-slate-400"><Inbox className="mx-auto mb-2 text-slate-300" size={36} /> <p className="font-medium text-xs">Arsip staf pengguna kosong.</p></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total {meta.totalItems} Pengguna</span>
                    <div className="flex items-center gap-2">
                        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border border-slate-200 rounded-lg text-xs font-bold px-2.5 py-1 outline-none focus:border-teal-600 bg-white text-slate-700 shadow-2xs cursor-pointer">
                            <option value={10}>10 Baris</option>
                            <option value={25}>25 Baris</option>
                        </select>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={meta.currentPage <= 1} className="px-3 py-1 text-xs font-bold disabled:opacity-30 text-slate-600 hover:text-slate-900 transition-colors">Prev</button>
                            <span className="px-3 py-1 text-xs font-black text-white bg-slate-900 rounded-lg shadow-xs">{meta.currentPage} / {meta.totalPages || 1}</span>
                            <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={meta.currentPage >= meta.totalPages || meta.totalPages === 0} className="px-3 py-1 text-xs font-bold disabled:opacity-30 text-slate-600 hover:text-slate-900 transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-xl p-7 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">{currentUser ? 'Koreksi Kredensial Staf' : 'Otorisasi Pengguna Baru'}</h2>
                                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Tetapkan identitas surel dan pemetaan klaster peran wewenang.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 p-1"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1 group">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Nama Lengkap Eksekutif</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white transition-all" placeholder="e.g. Ir. H. Ahmad Perminas" />
                                </div>

                                <div className="col-span-2 space-y-1 group">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Surel Korespondensi</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white transition-all" placeholder="ahmad@perminas.com" />
                                </div>

                                {!currentUser && (
                                    <div className="col-span-2 space-y-1 group">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Kata Sandi Pertama</label>
                                        <div className="relative">
                                            <input required type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full border border-slate-200 p-3 pr-11 rounded-xl outline-none focus:border-teal-600 font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white transition-all placeholder:font-normal" placeholder="••••••••" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600" tabIndex={-1}>
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1.5"><Shield size={13} className="text-teal-600" /> Pengikatan Kelompok Wewenang</label>
                                <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-150">
                                    {roles.map(role => (
                                        <label key={role.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all border ${formData.roleIds.includes(role.id) ? 'bg-white border-teal-600 text-teal-700 shadow-2xs' : 'bg-white/50 border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                            <input type="checkbox" className="w-3.5 h-3.5 accent-teal-600 rounded" checked={formData.roleIds.includes(role.id)} onChange={() => toggleRole(role.id)} />
                                            <span className="text-[11px] font-bold uppercase tracking-wide truncate">{role.name.replace(/_/g, ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                                <button type="submit" className="bg-slate-950 text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-md hover:bg-slate-900 transition-all active:scale-95 text-xs">
                                    {currentUser ? 'Sinkronisasi' : 'Simpan Staf'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ERROR */}
            {isErrorModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <XCircle className="text-red-600 mx-auto mb-3" size={40} />
                        <h2 className="text-base font-black text-slate-900 uppercase">Sinkronisasi Gagal</h2>
                        <p className="text-xs text-slate-500 mt-1 mb-6 font-medium leading-relaxed">{errorMessage}</p>
                        <button onClick={() => setIsErrorModalOpen(false)} className="w-full py-3 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-slate-900 transition-colors">Tutup Jendela</button>
                    </div>
                </div>
            )}

            {/* MODAL HAPUS */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <AlertTriangle className="text-red-600 mx-auto mb-3" size={40} />
                        <h2 className="text-base font-black text-slate-900 uppercase">Cabut Hak Staf?</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Surel ini akan kehilangan otorisasi total untuk memasuki gerbang enkripsi server.</p>
                        <div className="flex gap-2 mt-6">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors">Batalkan</button>
                            <button onClick={executeDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-red-700 shadow-md transition-colors">Cabut Permanen</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SUKSES */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <CheckCircle className="text-teal-600 mx-auto mb-3" size={40} />
                        <h2 className="text-base font-black text-slate-900 uppercase">Perubahan Diterapkan</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="mt-6 w-full py-3 bg-slate-950 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-900 shadow-md transition-colors">Tutup Panel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
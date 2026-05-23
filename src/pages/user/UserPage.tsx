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
        <div className="space-y-8 font-sans animate-in fade-in duration-300 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors group">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Manajemen Staf Pengguna</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Pengendalian kredensial administrator eksekutif dan pemetaan wewenang penulis pada sistem.</p>
                </div>
                {canCreate && (
                    <button onClick={() => openModal()} className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3.5 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest active:scale-95 group/btn">
                        <Plus size={16} className="text-cyan-400 group-hover/btn:rotate-90 transition-transform" /> Registrasi Staf
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[2rem] rounded-tr-none shadow-sm border-2 border-blue-50 overflow-hidden flex flex-col hover:border-cyan-100 transition-colors">
                <div className="p-6 lg:p-8 border-b border-blue-50 bg-slate-50/50">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
                        <input
                            type="text" placeholder="Kueri pencarian nama atau surel..."
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b-2 border-blue-50">
                            <tr>
                                <th className="p-6 pl-8 cursor-pointer hover:text-cyan-600 transition-colors whitespace-nowrap" onClick={() => requestSort('name')}>
                                    <div className="flex items-center gap-2">
                                        Identitas Lengkap {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </div>
                                </th>
                                <th className="p-6 whitespace-nowrap">Surel Korespondensi</th>
                                <th className="p-6 whitespace-nowrap">Pemetaan Hak Akses</th>
                                {(canUpdate || canDelete) && <th className="p-6 pr-8 text-center whitespace-nowrap">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-blue-50">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-24 text-center text-slate-400 font-bold"><Loader2 className="animate-spin mx-auto mb-4 text-cyan-500" size={32} />Memuat registri staf...</td></tr>
                            ) : processedUsers.length > 0 ? (
                                processedUsers.map(userItem => (
                                    <tr key={userItem.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-6 pl-8 font-black text-slate-800 group-hover:text-blue-950 transition-colors">{userItem.name}</td>
                                        <td className="p-6 text-slate-500 font-medium">{userItem.email}</td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-2">
                                                {userItem.roles.map((ur: any, idx: number) => (
                                                    <span key={idx} className="bg-blue-950 text-white font-black text-[10px] px-3 py-1.5 rounded-xl shadow-sm uppercase tracking-widest">
                                                        {ur.role.name.replace(/_/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-6 pr-8">
                                                <div className="flex justify-center gap-2">
                                                    {canUpdate && <button onClick={() => openModal(userItem)} className="p-2.5 text-blue-900 hover:text-white hover:bg-blue-950 rounded-xl transition-all shadow-sm hover:shadow-md" title="Koreksi"><Edit size={16} /></button>}
                                                    {canDelete && <button onClick={() => confirmDelete(userItem.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="Cabut"><Trash2 size={16} /></button>}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="p-24 text-center text-slate-400 font-bold bg-slate-50 border-2 border-dashed border-blue-100 rounded-[2rem]"><Inbox className="mx-auto mb-4 text-slate-300" size={48} /> <p>Arsip staf pengguna kosong.</p></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-6 lg:px-8 py-5 bg-white border-t-2 border-blue-50 rounded-b-[2rem] rounded-bl-none">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-l-2 border-cyan-400 pl-3">Total {meta.totalItems} Pengguna</span>
                    <div className="flex items-center gap-4">
                        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border border-blue-100 rounded-xl text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-slate-50 text-slate-700 shadow-sm cursor-pointer transition-all">
                            <option value={10}>10 Baris</option>
                            <option value={25}>25 Baris</option>
                        </select>
                        <div className="flex items-center gap-2 bg-slate-50 border border-blue-100 rounded-2xl rounded-tr-none p-1.5 shadow-sm">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={meta.currentPage <= 1} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Prev</button>
                            <span className="px-4 py-2 text-[11px] font-black text-white bg-blue-950 rounded-xl shadow-sm">{meta.currentPage} / {meta.totalPages || 1}</span>
                            <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={meta.currentPage >= meta.totalPages || meta.totalPages === 0} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b-2 border-blue-50 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-950 rounded-2xl rounded-tr-none border border-blue-100 shadow-sm"><Shield size={24} className="text-cyan-600" /></div>
                                <div>
                                    <h2 className="text-xl font-light text-slate-800 leading-tight">{currentUser ? 'Koreksi Kredensial Staf' : 'Otorisasi Pengguna Baru'}</h2>
                                    <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mt-1">Sistem Keamanan</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 font-black transition-colors shadow-sm"><X size={18} /></button>
                        </div>

                        <div className="p-8 bg-slate-50/50 overflow-y-auto custom-scrollbar flex-1">
                            <form id="userForm" onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Nama Lengkap Eksekutif *</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all" placeholder="Contoh: Ir. H. Ahmad Perminas" />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Surel Korespondensi *</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all" placeholder="ahmad@desapasirlangu.go.id" />
                                </div>

                                {!currentUser && (
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Kata Sandi Pertama *</label>
                                        <div className="relative">
                                            <input required type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full pl-4 pr-12 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all placeholder:font-normal" placeholder="••••••••" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors" tabIndex={-1}>
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3 pt-4 border-t-2 border-blue-50">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Shield size={14} className="text-cyan-600" /> Pengikatan Kelompok Wewenang</label>
                                    <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-[2rem] rounded-tr-none border border-blue-50 shadow-sm">
                                        {roles.map(role => (
                                            <label key={role.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${formData.roleIds.includes(role.id) ? 'bg-cyan-50 border-cyan-400 text-blue-950 shadow-sm' : 'bg-slate-50 border-blue-50 text-slate-600 hover:border-cyan-200'}`}>
                                                <input type="checkbox" className="w-4 h-4 accent-cyan-600 rounded cursor-pointer" checked={formData.roleIds.includes(role.id)} onChange={() => toggleRole(role.id)} />
                                                <span className="text-[11px] font-black uppercase tracking-widest truncate">{role.name.replace(/_/g, ' ')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-5 border-t-2 border-blue-50 bg-white flex justify-end gap-4 rounded-b-[2rem]">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-wider">Batalkan</button>
                            <button form="userForm" type="submit" className="px-8 py-3 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-widest">
                                {currentUser ? 'Sinkronisasi' : 'Simpan Staf'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ERROR */}
            {isErrorModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-sm shadow-2xl text-center p-8 border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
                            <XCircle className="text-red-500" size={36} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Sinkronisasi Gagal</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed mb-6">{errorMessage}</p>
                        <button onClick={() => setIsErrorModalOpen(false)} className="w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-widest active:scale-95">Tutup Jendela</button>
                    </div>
                </div>
            )}

            {/* MODAL HAPUS */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-sm shadow-2xl text-center p-8 border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
                            <AlertTriangle className="text-red-500" size={36} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Cabut Hak Staf?</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Surel ini akan kehilangan otorisasi total untuk memasuki gerbang enkripsi server.</p>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wider">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-md shadow-red-500/20 transition-all active:scale-95 uppercase tracking-wider">Cabut Permanen</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SUKSES */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-sm shadow-2xl text-center p-8 border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-cyan-100">
                            <CheckCircle className="text-cyan-500" size={40} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Berhasil!</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="mt-8 w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-widest active:scale-95">Tutup Panel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
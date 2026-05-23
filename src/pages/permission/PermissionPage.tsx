import React, { useState, useMemo } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuthStore } from '../../store/useAuthStore';
import { Search, Plus, Trash2, ChevronUp, ChevronDown, Key, X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

export const PermissionPage: React.FC = () => {
    const { permissions, isLoading, createPermission, deletePermission } = usePermissions();
    const { hasPermission } = useAuthStore();

    const canCreate = hasPermission('/permissions', 'CREATE');
    const canDelete = hasPermission('/permissions', 'DELETE');

    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [permissionName, setPermissionName] = useState('');

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const processedData = useMemo(() => {
        let result = [...permissions];
        if (searchTerm) {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        result.sort((a, b) => {
            if (sortDirection === 'asc') return a.name.localeCompare(b.name);
            return b.name.localeCompare(a.name);
        });
        return result;
    }, [permissions, searchTerm, sortDirection]);

    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await createPermission({ name: permissionName.toUpperCase() });
        if (result.success) {
            setIsModalOpen(false);
            setPermissionName('');
            setSuccessMessage("Parameter izin berhasil ditambahkan!");
            setIsSuccessModalOpen(true);
        } else {
            alert(result.message);
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!deleteTargetId) return;
        const result = await deletePermission(deleteTargetId);
        if (result.success) {
            setIsDeleteModalOpen(false);
            setSuccessMessage("Parameter otorisasi dicabut secara permanen!");
            setIsSuccessModalOpen(true);
        } else {
            alert(result.message);
        }
        setDeleteTargetId(null);
    };

    return (
        <div className="space-y-8 font-sans animate-in fade-in duration-300 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors group">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Master Tindakan Otorisasi</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Definisikan klaster parameter izin (*action privileges*) yang berlaku pada matriks sistem.</p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3.5 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest active:scale-95 group/btn"
                    >
                        <Plus size={16} className="text-cyan-400 group-hover/btn:rotate-90 transition-transform" /> Tambah Izin Aksi
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[2rem] rounded-tr-none shadow-sm border-2 border-blue-50 overflow-hidden flex flex-col hover:border-cyan-100 transition-colors">
                <div className="p-6 lg:p-8 border-b border-blue-50 bg-slate-50/50">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
                        <input
                            type="text" placeholder="Kueri pencarian aksi (e.g. APPROVE)..."
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-blue-50">
                            <tr>
                                <th
                                    className="p-6 pl-8 cursor-pointer hover:text-cyan-600 transition-colors w-1/2 whitespace-nowrap"
                                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                                >
                                    <div className="flex items-center gap-2">
                                        Identitas Parameter Izin {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </div>
                                </th>
                                <th className="p-6 w-1/4 whitespace-nowrap">ID Unik Registri</th>
                                {canDelete && <th className="p-6 pr-8 text-center w-1/4 whitespace-nowrap">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50 text-sm">
                            {isLoading ? (
                                <tr><td colSpan={canDelete ? 3 : 2} className="p-24 text-center text-slate-400 font-bold"><Loader2 className="animate-spin mx-auto mb-4 text-cyan-500" size={32} />Memuat registri...</td></tr>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((p) => (
                                    <tr key={p.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-6 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-950 text-cyan-400 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                                    <Key size={18} />
                                                </div>
                                                <span className="font-black text-slate-800 group-hover:text-blue-950 transition-colors uppercase tracking-widest">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-[11px] font-mono font-bold text-cyan-600 bg-cyan-50/50 rounded-lg px-3 py-1 w-fit border border-cyan-100">{p.id}</td>
                                        {canDelete && (
                                            <td className="p-6 pr-8">
                                                <div className="flex justify-center">
                                                    <button onClick={() => confirmDelete(p.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="Cabut Izin">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={canDelete ? 3 : 2} className="p-24 text-center text-slate-400 font-bold bg-slate-50 border-2 border-dashed border-blue-100 rounded-[2rem]">Registri tindakan kosong.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 0 && (
                    <div className="flex items-center justify-between px-6 lg:px-8 py-5 bg-white border-t-2 border-blue-50 rounded-b-[2rem] rounded-bl-none">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-l-2 border-cyan-400 pl-3">Total {processedData.length} Izin</span>
                        <div className="flex items-center gap-2 bg-slate-50 border border-blue-100 rounded-2xl rounded-tr-none p-1.5 shadow-sm">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Prev</button>
                            <span className="px-4 py-2 text-[11px] font-black text-white bg-blue-950 rounded-xl shadow-sm">{currentPage} / {totalPages}</span>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL TAMBAH */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-sm shadow-2xl overflow-hidden border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="p-6 lg:p-8 bg-blue-950 text-white flex justify-between items-center border-b-2 border-blue-900">
                            <h2 className="text-sm font-black tracking-widest uppercase">Injeksi Parameter Izin</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-cyan-400 hover:text-white p-2 bg-blue-900 rounded-xl transition-colors"><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">String Identifikasi *</label>
                                <input
                                    required autoFocus value={permissionName} onChange={(e) => setPermissionName(e.target.value)}
                                    className="w-full p-3.5 bg-slate-50 border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-black uppercase text-slate-800 shadow-sm transition-all placeholder:normal-case placeholder:font-normal"
                                    placeholder="e.g. EXPORT, VALIDATE"
                                />
                                <p className="text-[10px] text-cyan-600 mt-2 font-black uppercase tracking-widest bg-cyan-50 p-2 rounded-lg border border-cyan-100">* Format standarisasi global adalah UPPERCASE.</p>
                            </div>
                            <button type="submit" className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-white font-black rounded-2xl rounded-tr-none text-xs uppercase tracking-widest shadow-md transition-all active:scale-95">
                                Simpan Parameter
                            </button>
                        </form>
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
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Cabut Izin Permanen?</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Pencabutan registri akan mempengaruhi validasi matriks otorisasi pengguna.</p>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wider">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-md shadow-red-500/20 transition-all active:scale-95 uppercase tracking-wider">Eksekusi Cabut</button>
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
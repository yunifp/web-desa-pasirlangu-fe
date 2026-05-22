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
        <div className="space-y-6 font-sans animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Master Tindakan Otorisasi</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Definisikan klaster parameter izin (*action privileges*) yang berlaku pada matriks sistem.</p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-950/20 hover:from-teal-700 hover:to-emerald-700 transition-all font-bold text-xs uppercase tracking-wider active:scale-95"
                    >
                        <Plus size={16} /> Tambah Izin Aksi
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text" placeholder="Kueri pencarian aksi (e.g. APPROVE)..."
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none text-xs font-semibold shadow-2xs transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-150">
                            <tr>
                                <th
                                    className="p-4 pl-6 cursor-pointer hover:text-teal-600 transition-colors w-1/2 whitespace-nowrap"
                                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        Identitas Parameter Izin {sortDirection === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                    </div>
                                </th>
                                <th className="p-4 w-1/4 whitespace-nowrap">ID Unik Registri</th>
                                {canDelete && <th className="p-4 pr-6 text-center w-1/4 whitespace-nowrap">Otoritas</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {isLoading ? (
                                <tr><td colSpan={canDelete ? 3 : 2} className="p-16 text-center text-slate-400 font-medium"><Loader2 className="animate-spin mx-auto mb-2 text-teal-600" size={24} />Memuat registri...</td></tr>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-slate-900 text-white rounded-md shadow-2xs">
                                                    <Key size={14} className="text-teal-400" />
                                                </div>
                                                <span className="font-bold text-slate-900 tracking-wide text-sm">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[11px] font-mono text-slate-400 font-semibold">{p.id}</td>
                                        {canDelete && (
                                            <td className="p-4 pr-6">
                                                <div className="flex justify-center">
                                                    <button onClick={() => confirmDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Cabut Izin">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={canDelete ? 3 : 2} className="p-16 text-center text-slate-400 font-medium">Registri tindakan kosong.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total {processedData.length} Izin</span>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 text-xs font-bold disabled:opacity-30 text-slate-600 hover:text-slate-900 transition-colors">Prev</button>
                            <span className="px-3 py-1 text-xs font-black text-white bg-slate-900 rounded-lg shadow-xs">{currentPage} / {totalPages}</span>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 text-xs font-bold disabled:opacity-30 text-slate-600 hover:text-slate-900 transition-colors">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL TAMBAH */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="p-6 bg-slate-950 text-white flex justify-between items-center border-b border-slate-900">
                            <h2 className="text-base font-black tracking-tight uppercase">Injeksi Parameter Izin</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-7 space-y-4">
                            <div className="space-y-1 group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">String Identifikasi</label>
                                <input
                                    required autoFocus value={permissionName} onChange={(e) => setPermissionName(e.target.value)}
                                    className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-bold uppercase text-xs text-slate-900 bg-slate-50/50 focus:bg-white transition-all placeholder:normal-case"
                                    placeholder="e.g. EXPORT, VALIDATE"
                                />
                                <p className="text-[9px] text-slate-400 mt-1 font-medium">* Format standarisasi global adalah UPPERCASE.</p>
                            </div>
                            <button type="submit" className="w-full py-3 bg-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-900 transition-all active:scale-95 shadow-md mt-2">
                                Simpan Parameter
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL HAPUS */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <AlertTriangle className="text-red-600 mx-auto mb-3" size={40} />
                        <h2 className="text-base font-black text-slate-900 uppercase">Cabut Izin Permanen?</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Pencabutan registri akan mempengaruhi validasi matriks otorisasi pengguna.</p>
                        <div className="flex gap-2 mt-6">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors">Batalkan</button>
                            <button onClick={executeDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-red-700 shadow-md transition-colors">Eksekusi Cabut</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SUKSES */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <CheckCircle className="text-teal-600 mx-auto mb-3" size={40} />
                        <h2 className="text-base font-black text-slate-900 uppercase">Registri Tersimpan</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="mt-6 w-full py-3 bg-slate-950 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-900 shadow-md transition-colors">Tutup Jendela</button>
                    </div>
                </div>
            )}
        </div>
    );
};
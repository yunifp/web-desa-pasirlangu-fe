import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePages } from '../../hooks/usePages';
import { useAuthStore } from '../../store/useAuthStore';
import type { PostStatus } from '../../types/cms';
import { 
    Plus, Edit, Trash2, Layers, Loader2, FileText, 
    AlertTriangle, CheckCircle, User 
} from 'lucide-react';

export const PageListPage: React.FC = () => {
    const navigate = useNavigate();
    const { pages, isLoading, fetchPages, deletePage } = usePages();

    const { hasPermission } = useAuthStore();
    const canCreate = hasPermission('/pages', 'CREATE');
    const canUpdate = hasPermission('/pages', 'UPDATE');
    const canDelete = hasPermission('/pages', 'DELETE');

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    useEffect(() => { 
        fetchPages(); 
    }, [fetchPages]);

    const StatusBadge = ({ status }: { status: PostStatus }) => {
        switch (status) {
            case 'PUBLISHED':
                return <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200/80 uppercase tracking-wide">PUBLISHED</span>;
            case 'DRAFT':
                return <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-200/80 uppercase tracking-wide">DRAFT</span>;
            case 'ARCHIVED':
                return <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 uppercase tracking-wide">ARCHIVED</span>;
            default:
                return null;
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!deleteTargetId) return;
        const res = await deletePage(deleteTargetId);
        if (res.success) {
            setIsDeleteModalOpen(false);
            setSuccessMessage("Halaman statis berhasil dihapus!");
            setIsSuccessModalOpen(true);
            fetchPages();
        } else {
            alert(res.message);
        }
        setDeleteTargetId(null);
    };

    return (
        <div className="space-y-6 font-sans animate-in fade-in duration-300">
            {/* Navigasi Ruas */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Halaman Statis</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Kelola halaman statis tunggal yang diikatkan langsung ke template tata letak.</p>
                </div>
                {canCreate && (
                    <button 
                        onClick={() => navigate('/pages/create')} 
                        className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-lg shadow-teal-950/20 transition-all active:scale-95"
                    >
                        <Plus size={16} /> Buat Halaman Baru
                    </button>
                )}
            </div>

            {/* Tabel Penampang */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="p-5 whitespace-nowrap">Judul & Pengenal (Slug)</th>
                                <th className="p-5 whitespace-nowrap">Pemetaan Template</th>
                                <th className="p-5 whitespace-nowrap">Penulis Terdaftar</th>
                                <th className="p-5 whitespace-nowrap">Status Publikasi</th>
                                {(canUpdate || canDelete) && <th className="p-5 text-center whitespace-nowrap">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-slate-100 font-medium">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-slate-400 font-bold">
                                        <Loader2 className="animate-spin mx-auto mb-2 text-teal-600" size={24} />
                                        Memuat data halaman...
                                    </td>
                                </tr>
                            ) : pages.length > 0 ? (
                                pages.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-5 max-w-xs">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg mt-0.5 flex-shrink-0">
                                                    <FileText size={16} />
                                                </div>
                                                <div className="truncate">
                                                    <div className="font-black text-slate-900 text-sm truncate" title={p.title}>{p.title}</div>
                                                    {p.titleEn && <div className="text-[11px] text-slate-500 truncate italic">EN: {p.titleEn}</div>}
                                                    <div className="text-[11px] font-mono text-teal-600 mt-0.5 truncate">{p.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 whitespace-nowrap">
                                            <span className="bg-slate-50 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit border border-slate-200 shadow-2xs">
                                                <Layers size={13} className="text-teal-600" /> {p.template?.name || 'Layout Default Statis'}
                                            </span>
                                        </td>
                                        <td className="p-5 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                                <User size={13} className="text-slate-400" /> {p.author?.name || 'Eksekutif'}
                                            </div>
                                        </td>
                                        <td className="p-5 whitespace-nowrap">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-5 whitespace-nowrap">
                                                <div className="flex justify-center gap-1.5">
                                                    {canUpdate && (
                                                        <button 
                                                            onClick={() => navigate(`/pages/edit/${p.id}`)} 
                                                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all" 
                                                            title="Edit Tata Letak"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button 
                                                            onClick={() => confirmDelete(p.id)} 
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                                                            title="Hapus Halaman"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-slate-400 font-bold">
                                        Belum ada halaman statis yang terdaftar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Rekap */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 font-black uppercase tracking-wider">
                    Total {pages.length} Halaman Statis Terdaftar
                </div>
            </div>

            {/* MODAL DELETE */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 border border-slate-100 animate-in zoom-in-95 duration-200">
                        <AlertTriangle className="text-red-500 mx-auto mb-4" size={40} />
                        <h2 className="text-lg font-black text-slate-900">Hapus Halaman Statis?</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Halaman statis yang dihapus tidak dapat dipulihkan kembali.</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-3 bg-red-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-red-700 transition-colors">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SUKSES */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 border border-slate-100 animate-in zoom-in-95 duration-200">
                        <CheckCircle className="text-teal-600 mx-auto mb-4" size={40} />
                        <h2 className="text-lg font-black text-slate-900">Konfirmasi Penghapusan</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="mt-6 w-full py-3 bg-slate-950 text-white font-bold text-xs rounded-xl shadow-md hover:bg-slate-900 transition-all">Tutup Panel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
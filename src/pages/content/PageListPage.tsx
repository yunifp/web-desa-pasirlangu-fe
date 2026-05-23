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
            case 'PUBLISHED': return <span className="bg-cyan-50 text-cyan-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-cyan-200/80 uppercase tracking-widest shadow-sm">PUBLISHED</span>;
            case 'DRAFT': return <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-amber-200/80 uppercase tracking-widest shadow-sm">DRAFT</span>;
            case 'ARCHIVED': return <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-slate-200 uppercase tracking-widest shadow-sm">ARCHIVED</span>;
            default: return null;
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
        <div className="space-y-8 font-sans animate-in fade-in duration-300 pb-10">
            {/* Navigasi Ruas */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors group">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Daftar Halaman Statis</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Kelola halaman statis tunggal yang diikatkan langsung ke template tata letak.</p>
                </div>
                {canCreate && (
                    <button 
                        onClick={() => navigate('/pages/create')} 
                        className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3.5 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest active:scale-95 group/btn"
                    >
                        <Plus size={16} className="text-cyan-400 group-hover/btn:rotate-90 transition-transform" /> Buat Halaman Baru
                    </button>
                )}
            </div>

            {/* Tabel Penampang */}
            <div className="bg-white rounded-[2rem] rounded-tr-none border-2 border-blue-50 overflow-hidden shadow-sm flex flex-col hover:border-cyan-100 transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b-2 border-blue-50">
                            <tr>
                                <th className="p-6 whitespace-nowrap">Judul & Pengenal (Slug)</th>
                                <th className="p-6 whitespace-nowrap">Pemetaan Template</th>
                                <th className="p-6 whitespace-nowrap">Penulis Terdaftar</th>
                                <th className="p-6 whitespace-nowrap text-center">Status Publikasi</th>
                                {(canUpdate || canDelete) && <th className="p-6 text-center whitespace-nowrap">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-blue-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center text-slate-400 font-bold">
                                        <Loader2 className="animate-spin mx-auto mb-4 text-cyan-500" size={32} />
                                        Memuat data halaman...
                                    </td>
                                </tr>
                            ) : pages.length > 0 ? (
                                pages.map(p => (
                                    <tr key={p.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-6 max-w-xs">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-2xl rounded-tr-none bg-cyan-50 flex items-center justify-center flex-shrink-0 border border-cyan-100 shadow-sm group-hover:scale-105 transition-transform">
                                                    <FileText size={20} className="text-cyan-600" />
                                                </div>
                                                <div className="truncate py-1">
                                                    <div className="font-black text-slate-800 text-sm truncate group-hover:text-blue-950 transition-colors" title={p.title}>{p.title}</div>
                                                    {p.titleEn && <div className="text-[11px] text-slate-500 truncate mt-1 italic">EN: {p.titleEn}</div>}
                                                    <div className="text-[10px] text-cyan-600 font-mono mt-2 px-2 py-1 bg-cyan-50 rounded-lg w-fit border border-cyan-100">{p.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 whitespace-nowrap">
                                            <span className="bg-slate-50 text-slate-800 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-2 w-fit border border-slate-200 shadow-sm">
                                                <Layers size={14} className="text-cyan-600" /> {p.template?.name || 'Layout Default Statis'}
                                            </span>
                                        </td>
                                        <td className="p-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                                <User size={14} className="text-slate-400" /> {p.author?.name || 'Eksekutif'}
                                            </div>
                                        </td>
                                        <td className="p-6 whitespace-nowrap text-center">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-6 whitespace-nowrap">
                                                <div className="flex justify-center gap-2">
                                                    {canUpdate && (
                                                        <button 
                                                            onClick={() => navigate(`/pages/edit/${p.id}`)} 
                                                            className="p-2.5 text-blue-900 hover:text-white hover:bg-blue-950 rounded-xl transition-all shadow-sm hover:shadow-md" title="Edit Tata Letak"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button 
                                                            onClick={() => confirmDelete(p.id)} 
                                                            className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="Hapus Halaman"
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
                                    <td colSpan={5} className="p-24 text-center text-slate-400 font-bold bg-slate-50 border-2 border-dashed border-blue-100 rounded-[2rem]">
                                        Belum ada halaman statis yang terdaftar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Rekap */}
                <div className="px-6 lg:px-8 py-5 bg-white border-t-2 border-blue-50 rounded-b-[2rem] rounded-bl-none text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    <span className="border-l-2 border-cyan-400 pl-3">Total {pages.length} Halaman Statis Terdaftar</span>
                </div>
            </div>

            {/* MODAL DELETE */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-sm shadow-2xl text-center p-8 border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
                            <AlertTriangle className="text-red-500" size={36} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Hapus Halaman Statis?</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Halaman statis yang dihapus tidak dapat dipulihkan kembali.</p>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wider">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-md shadow-red-500/20 transition-all active:scale-95 uppercase tracking-wider">Ya, Hapus</button>
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
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Konfirmasi Penghapusan</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="mt-8 w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-widest active:scale-95">Tutup Panel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
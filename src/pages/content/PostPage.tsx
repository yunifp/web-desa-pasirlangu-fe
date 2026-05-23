/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { useAuthStore } from '../../store/useAuthStore';
import type { PostStatus } from '../../types/cms';
import {
    Search, Plus, Edit, Trash2, AlertTriangle, CheckCircle,
    Loader2, FileText, Calendar, User, Folder, Layers
} from 'lucide-react';

export const PostPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        posts, categories, meta, isLoading,
        fetchPosts, fetchCategoriesList, deletePost
    } = usePosts();

    const { hasPermission } = useAuthStore();
    const canCreate = hasPermission('/posts', 'CREATE');
    const canUpdate = hasPermission('/posts', 'UPDATE');
    const canDelete = hasPermission('/posts', 'DELETE');

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    useEffect(() => { fetchCategoriesList(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPosts(page, limit, searchTerm, filterStatus, filterCategory);
        }, 300);
        return () => clearTimeout(timer);
    }, [page, limit, searchTerm, filterStatus, filterCategory]);

    const StatusBadge = ({ status }: { status: PostStatus }) => {
        switch (status) {
            case 'PUBLISHED': return <span className="bg-cyan-50 text-cyan-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-cyan-200/80 uppercase tracking-widest shadow-sm">PUBLISHED</span>;
            case 'DRAFT': return <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-amber-200/80 uppercase tracking-widest shadow-sm">DRAFT</span>;
            case 'ARCHIVED': return <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-slate-200 uppercase tracking-widest shadow-sm">ARCHIVED</span>;
            default: return null;
        }
    };

    const formatDate = (isoString?: string | null) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const confirmDelete = (id: string) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!deleteTargetId) return;
        const res = await deletePost(deleteTargetId);
        if (res.success) {
            setIsDeleteModalOpen(false);
            setSuccessMessage("Artikel berhasil dihapus!");
            setIsSuccessModalOpen(true);
            fetchPosts(page, limit, searchTerm, filterStatus, filterCategory);
        } else { alert(res.message); }
        setDeleteTargetId(null);
    };

    return (
        <div className="space-y-8 font-sans animate-in fade-in duration-300 pb-10">
            {/* Header Seksi */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors group">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Manajemen Artikel</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Pengelolaan postingan web dengan mode halaman penuh (*dedicated page*).</p>
                </div>
                {canCreate && (
                    <button 
                        onClick={() => navigate('/posts/create')} 
                        className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3.5 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest active:scale-95 group/btn"
                    >
                        <Plus size={16} className="text-cyan-400 group-hover/btn:rotate-90 transition-transform" /> Tulis Postingan Baru
                    </button>
                )}
            </div>

            {/* Kontainer Utama */}
            <div className="bg-white rounded-[2rem] rounded-tr-none shadow-sm border-2 border-blue-50 overflow-hidden flex flex-col hover:border-cyan-100 transition-colors">
                
                {/* Bar Filter & Pencarian */}
                <div className="p-6 lg:p-8 border-b border-blue-50 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
                        <input
                            type="text" placeholder="Cari judul artikel..."
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all"
                        />
                    </div>
                    <select
                        value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                        className="border border-blue-100 p-3.5 rounded-2xl rounded-tr-none outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 bg-white text-sm font-bold text-slate-700 shadow-sm cursor-pointer transition-all"
                    >
                        <option value="">-- Semua Kategori --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select
                        value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                        className="border border-blue-100 p-3.5 rounded-2xl rounded-tr-none outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 bg-white text-sm font-bold text-slate-700 shadow-sm cursor-pointer transition-all"
                    >
                        <option value="">-- Semua Status --</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                </div>

                {/* Tabel Konten */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b-2 border-blue-50">
                            <tr>
                                <th className="p-6 whitespace-nowrap">Informasi Artikel</th>
                                <th className="p-6 whitespace-nowrap">Kategori & Layout Bawaan</th>
                                <th className="p-6 whitespace-nowrap">Penulis & Tanggal</th>
                                <th className="p-6 whitespace-nowrap text-center">Status</th>
                                {(canUpdate || canDelete) && <th className="p-6 text-center whitespace-nowrap">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-blue-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-24 text-center text-slate-400 font-bold"><Loader2 className="animate-spin mx-auto mb-4 text-cyan-500" size={32} />Memuat data...</td></tr>
                            ) : posts.length > 0 ? (
                                posts.map(item => (
                                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-6 max-w-xs">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-2xl rounded-tr-none bg-cyan-50 flex items-center justify-center flex-shrink-0 border border-cyan-100 shadow-sm group-hover:scale-105 transition-transform">
                                                    <FileText size={20} className="text-cyan-600" />
                                                </div>
                                                <div className="truncate py-1">
                                                    <div className="font-black text-slate-800 text-sm truncate group-hover:text-blue-950 transition-colors" title={item.title}>{item.title}</div>
                                                    {item.titleEn && <div className="text-[11px] text-slate-500 truncate mt-1 italic">EN: {item.titleEn}</div>}
                                                    <div className="text-[10px] text-cyan-600 font-mono mt-2 px-2 py-1 bg-cyan-50 rounded-lg w-fit border border-cyan-100">{item.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                                                <Folder size={14} className="text-cyan-500" /> {item.category?.name}
                                            </div>
                                            {item.category?.template && (
                                                <div className="flex items-center gap-1.5 text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md w-fit mt-2 border border-slate-200 font-semibold shadow-sm">
                                                    <Layers size={12} className="text-cyan-600" /> Auto-Layout: {item.category.template.name}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                                <User size={14} className="text-slate-400" /> {item.author?.name || 'Eksekutif'}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 mt-2">
                                                <Calendar size={12} /> {formatDate(item.publishedAt || item.createdAt)}
                                            </div>
                                        </td>
                                        <td className="p-6 whitespace-nowrap text-center"><StatusBadge status={item.status} /></td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-6 whitespace-nowrap">
                                                <div className="flex justify-center gap-2">
                                                    {canUpdate && (
                                                        <button 
                                                            onClick={() => navigate(`/posts/edit/${item.id}`)} 
                                                            className="p-2.5 text-blue-900 hover:text-white hover:bg-blue-950 rounded-xl transition-all shadow-sm hover:shadow-md" title="Edit Halaman"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button 
                                                            onClick={() => confirmDelete(item.id)} 
                                                            className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="Hapus Artikel"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (<tr><td colSpan={5} className="p-24 text-center text-slate-400 font-bold bg-slate-50 border-2 border-dashed border-blue-100 rounded-[2rem]">Artikel belum tersedia.</td></tr>)}
                        </tbody>
                    </table>
                </div>

                {/* Footer Paginasi */}
                <div className="flex items-center justify-between px-6 lg:px-8 py-5 bg-white border-t-2 border-blue-50 rounded-b-[2rem] rounded-bl-none">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-l-2 border-cyan-400 pl-3">Total {meta.totalItems} Artikel</span>
                    <div className="flex items-center gap-2 bg-slate-50 border border-blue-100 rounded-2xl rounded-tr-none p-1.5 shadow-sm">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={meta.currentPage <= 1} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Prev</button>
                        <span className="px-4 py-2 text-[11px] font-black text-white bg-blue-950 rounded-xl shadow-sm">{meta.currentPage} / {meta.totalPages || 1}</span>
                        <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={meta.currentPage >= meta.totalPages || meta.totalPages === 0} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {/* MODAL DELETE */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-sm shadow-2xl text-center p-8 border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
                            <AlertTriangle className="text-red-500" size={36} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Hapus Artikel?</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Aksi ini bersifat mutlak dan tidak dapat dipulihkan.</p>
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
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Berhasil!</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="mt-8 w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-widest active:scale-95">Tutup Panel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
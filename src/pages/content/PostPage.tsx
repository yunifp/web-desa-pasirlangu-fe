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
            case 'PUBLISHED': return <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200/80 uppercase tracking-wide">PUBLISHED</span>;
            case 'DRAFT': return <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-200/80 uppercase tracking-wide">DRAFT</span>;
            case 'ARCHIVED': return <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 uppercase tracking-wide">ARCHIVED</span>;
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
        <div className="space-y-6 font-sans animate-in fade-in duration-300">
            {/* Header Seksi */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Artikel</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Pengelolaan postingan web dengan mode halaman penuh (*dedicated page*).</p>
                </div>
                {canCreate && (
                    <button 
                        onClick={() => navigate('/posts/create')} 
                        className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-950/20 transition-all font-bold text-xs uppercase tracking-widest active:scale-95"
                    >
                        <Plus size={16} /> Tulis Postingan Baru
                    </button>
                )}
            </div>

            {/* Kontainer Utama */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                {/* Bar Filter & Pencarian */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text" placeholder="Cari judul artikel..."
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none text-xs font-bold text-slate-800 shadow-2xs transition-all"
                        />
                    </div>
                    <select
                        value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
                    >
                        <option value="">-- Semua Kategori --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select
                        value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                        className="border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
                    >
                        <option value="">-- Semua Status --</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                </div>

                {/* Tabel Konten */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="p-5 whitespace-nowrap">Informasi Artikel</th>
                                <th className="p-5 whitespace-nowrap">Kategori & Layout Bawaan</th>
                                <th className="p-5 whitespace-nowrap">Penulis & Tanggal</th>
                                <th className="p-5 whitespace-nowrap">Status</th>
                                {(canUpdate || canDelete) && <th className="p-5 text-center whitespace-nowrap">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-bold"><Loader2 className="animate-spin mx-auto mb-2 text-teal-600" size={24} />Memuat data...</td></tr>
                            ) : posts.length > 0 ? (
                                posts.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-5 max-w-xs">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg mt-0.5 flex-shrink-0"><FileText size={16} /></div>
                                                <div className="truncate">
                                                    <div className="font-black text-slate-900 text-sm truncate" title={item.title}>{item.title}</div>
                                                    {item.titleEn && <div className="text-[11px] text-slate-500 truncate italic">EN: {item.titleEn}</div>}
                                                    <div className="text-[11px] text-teal-600 truncate font-mono mt-0.5">{item.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                                                <Folder size={13} className="text-teal-600" /> {item.category?.name}
                                            </div>
                                            {item.category?.template && (
                                                <div className="flex items-center gap-1 text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md w-fit mt-1.5 border border-slate-200 font-semibold">
                                                    <Layers size={10} className="text-teal-600" /> Auto-Layout: {item.category.template.name}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-5 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                                <User size={13} className="text-slate-400" /> {item.author?.name || 'Eksekutif'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-1">
                                                <Calendar size={12} /> {formatDate(item.publishedAt || item.createdAt)}
                                            </div>
                                        </td>
                                        <td className="p-5 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-5 whitespace-nowrap">
                                                <div className="flex justify-center gap-1.5">
                                                    {canUpdate && (
                                                        <button 
                                                            onClick={() => navigate(`/posts/edit/${item.id}`)} 
                                                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="Edit Halaman"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                    )}
                                                    {canDelete && <button onClick={() => confirmDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (<tr><td colSpan={5} className="p-20 text-center text-slate-400 font-bold">Artikel belum tersedia.</td></tr>)}
                        </tbody>
                    </table>
                </div>

                {/* Footer Paginasi */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Total {meta.totalItems} Artikel</span>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={meta.currentPage <= 1} className="px-3 py-1 text-[11px] font-bold disabled:opacity-30 text-slate-700">Prev</button>
                        <span className="px-3 py-1 text-[11px] font-black text-teal-700 bg-teal-50 rounded-md">{meta.currentPage} / {meta.totalPages || 1}</span>
                        <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={meta.currentPage >= meta.totalPages || meta.totalPages === 0} className="px-3 py-1 text-[11px] font-bold disabled:opacity-30 text-slate-700">Next</button>
                    </div>
                </div>
            </div>

            {/* MODAL DELETE */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 border border-slate-100 animate-in zoom-in-95 duration-200">
                        <AlertTriangle className="text-red-500 mx-auto mb-4" size={40} />
                        <h2 className="text-lg font-black text-slate-900">Hapus Artikel?</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Aksi ini bersifat mutlak dan tidak dapat dipulihkan.</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SUKSES */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 border border-slate-100 animate-in zoom-in-95 duration-200">
                        <CheckCircle className="text-teal-600 mx-auto mb-4" size={40} />
                        <h2 className="text-lg font-black text-slate-900">Konfirmasi Rilis!</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="mt-6 w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md">Tutup Panel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
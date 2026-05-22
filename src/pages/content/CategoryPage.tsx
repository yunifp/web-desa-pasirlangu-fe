/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useCmsConfig } from '../../hooks/useCmsConfig';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import type { Category, CategoryFormData, Template } from '../../types/cms';
import {
    Search, Plus, Edit, Trash2, X, AlertTriangle, CheckCircle,
    Loader2, Folder, Layers
} from 'lucide-react';

export const CategoryPage: React.FC = () => {
    const {
        categories, categoryMeta, isLoadingCategories,
        fetchCategories, createCategory, updateCategory, deleteCategory
    } = useCmsConfig();

    const { hasPermission } = useAuthStore();
    const canCreate = hasPermission('/categories', 'CREATE');
    const canUpdate = hasPermission('/categories', 'UPDATE');
    const canDelete = hasPermission('/categories', 'DELETE');

    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>({ name: '', slug: '', description: '', templateId: null });

    // Dropdown List Template Bawaan
    const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // Ambil data list template saat modal form dibuka
    useEffect(() => {
        if (isModalOpen) {
            api.get('/templates/all').then(res => setAvailableTemplates(res.data.data)).catch(console.error);
        }
    }, [isModalOpen]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCategories(page, limit, searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [page, limit, searchTerm]);

    const openModal = (target?: Category) => {
        if (target) {
            setCurrentCategory(target);
            setFormData({ name: target.name, slug: target.slug, description: target.description || '', templateId: target.templateId });
        } else {
            setCurrentCategory(null);
            setFormData({ name: '', slug: '', description: '', templateId: null });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = currentCategory
            ? await updateCategory(currentCategory.id, formData)
            : await createCategory(formData);

        if (res.success) {
            setIsModalOpen(false);
            setSuccessMessage(currentCategory ? "Kategori berhasil diperbarui!" : "Kategori baru berhasil disimpan!");
            setIsSuccessModalOpen(true);
            fetchCategories(page, limit, searchTerm);
        } else {
            alert(res.message);
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!deleteTargetId) return;
        const res = await deleteCategory(deleteTargetId);
        if (res.success) {
            setIsDeleteModalOpen(false);
            setSuccessMessage("Kategori berhasil dihapus!");
            setIsSuccessModalOpen(true);
            fetchCategories(page, limit, searchTerm);
        } else {
            alert(res.message);
        }
        setDeleteTargetId(null);
    };

    return (
        <div className="space-y-6 font-sans animate-in fade-in duration-300">
            {/* Ruas Judul Eksekutif */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kategori & Pemetaan Template</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Kelola hierarki pengelompokan informasi dan otomatisasi penataan (*dynamic templating*).</p>
                </div>
                {canCreate && (
                    <button onClick={() => openModal()} className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-950/20 hover:from-teal-700 hover:to-emerald-700 transition-all font-bold text-xs uppercase tracking-wider active:scale-95">
                        <Plus size={16} /> Tambah Kategori
                    </button>
                )}
            </div>

            {/* Tubuh Tabel Utama */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                {/* Bar Pencarian */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text" placeholder="Kueri pencarian kategori..."
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none text-xs font-semibold shadow-2xs transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-150">
                            <tr>
                                <th className="p-4 pl-6 whitespace-nowrap">Nama Kategori</th>
                                <th className="p-4 whitespace-nowrap">Slug (Rute Dinamis)</th>
                                <th className="p-4 whitespace-nowrap">Otomatisasi Tata Letak</th>
                                {(canUpdate || canDelete) && <th className="p-4 pr-6 text-center whitespace-nowrap">Otoritas Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-slate-100">
                            {isLoadingCategories ? (
                                <tr><td colSpan={4} className="p-16 text-center text-slate-400 font-medium"><Loader2 className="animate-spin mx-auto mb-2 text-teal-600" size={24} />Memuat struktur...</td></tr>
                            ) : categories.length > 0 ? (
                                categories.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg flex-shrink-0 border border-teal-100/50"><Folder size={16} /></div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">{item.description || 'Tanpa atribusi deskripsi'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-mono text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 font-semibold">{item.slug}</span>
                                        </td>
                                        <td className="p-4">
                                            {item.template ? (
                                                <span className="flex items-center gap-1.5 bg-slate-900 text-white font-bold text-[10px] px-3 py-1 rounded-lg shadow-2xs w-fit tracking-wide uppercase">
                                                    <Layers size={12} className="text-teal-400" /> {item.template.name}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] italic text-slate-400 font-medium">Pengikatan Tata Letak Standar</span>
                                            )}
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-4 pr-6">
                                                <div className="flex justify-center gap-1.5">
                                                    {canUpdate && <button onClick={() => openModal(item)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="Koreksi"><Edit size={16} /></button>}
                                                    {canDelete && <button onClick={() => confirmDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus"><Trash2 size={16} /></button>}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="p-16 text-center text-slate-400 font-medium">Struktur kategori kosong.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Paginasi Mewah */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total {categoryMeta.totalItems} Entitas</span>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={categoryMeta.currentPage <= 1} className="px-3 py-1 text-xs font-bold disabled:opacity-30 text-slate-600 hover:text-slate-900 transition-colors">Prev</button>
                        <span className="px-3 py-1 text-xs font-black text-white bg-slate-900 rounded-lg shadow-xs">{categoryMeta.currentPage} / {categoryMeta.totalPages || 1}</span>
                        <button onClick={() => setPage(p => Math.min(categoryMeta.totalPages, p + 1))} disabled={categoryMeta.currentPage >= categoryMeta.totalPages || categoryMeta.totalPages === 0} className="px-3 py-1 text-xs font-bold disabled:opacity-30 text-slate-600 hover:text-slate-900 transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-7 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">{currentCategory ? 'Koreksi Kategori' : 'Entitas Kategori Baru'}</h2>
                                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Terapkan parameter penamaan dan pengikatan layout dinamis.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 p-1"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Nama Identitas Kategori</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white transition-all" placeholder="e.g. Klaster Operasional" />
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Custom Slug (Rute)</label>
                                <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-mono text-xs text-slate-900 bg-slate-50/50 focus:bg-white transition-all" placeholder="klaster-operasional" />
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Otomatisasi Template Utama</label>
                                <select
                                    value={formData.templateId || ''}
                                    onChange={e => setFormData({ ...formData, templateId: e.target.value || null })}
                                    className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-bold text-xs text-slate-800 bg-slate-50/50 focus:bg-white cursor-pointer transition-all"
                                >
                                    <option value="">-- Pengikatan Tata Letak Dasar --</option>
                                    {availableTemplates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} (Rute: {t.slug})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Deskripsi Peruntukan</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 h-20 text-xs font-medium resize-none text-slate-800 bg-slate-50/50 focus:bg-white transition-all" placeholder="Tuliskan atribusi ringkas..." />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                                <button type="submit" className="bg-slate-950 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-900 transition-all active:scale-95 shadow-md">Simpan Entitas</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL HAPUS */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <AlertTriangle className="text-red-600 mx-auto mb-3" size={40} />
                        <h2 className="text-base font-black text-slate-900 uppercase">Hapus Entitas Kategori?</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Distribusi artikel yang mengikat pada identitas ini akan kehilangan rujukan otomatisnya.</p>
                        <div className="flex gap-2 mt-6">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors">Batalkan</button>
                            <button onClick={executeDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-red-700 shadow-md transition-colors">Eksekusi Hapus</button>
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
                        <button onClick={() => setIsSuccessModalOpen(false)} className="mt-6 w-full py-3 bg-slate-950 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-900 shadow-md transition-colors">Tutup Jendela</button>
                    </div>
                </div>
            )}
        </div>
    );
};
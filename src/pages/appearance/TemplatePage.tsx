/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useCmsConfig } from '../../hooks/useCmsConfig';
import { useAuthStore } from '../../store/useAuthStore';
import type { Template, TemplateFormData } from '../../types/cms';
import {
    Search, Plus, Edit, Trash2, X, AlertTriangle, CheckCircle,
    Loader2, Monitor, Code, FileCode
} from 'lucide-react';

export const TemplatePage: React.FC = () => {
    const {
        templates, templateMeta, isLoadingTemplates,
        fetchTemplates, createTemplate, updateTemplate, deleteTemplate
    } = useCmsConfig();

    const { hasPermission } = useAuthStore();
    const canCreate = hasPermission('/templates', 'CREATE');
    const canUpdate = hasPermission('/templates', 'UPDATE');
    const canDelete = hasPermission('/templates', 'DELETE');

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
    const [formData, setFormData] = useState<TemplateFormData>({ name: '', slug: '', description: '' });

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTemplates(page, limit, searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [page, limit, searchTerm]);

    const openModal = (target?: Template) => {
        if (target) {
            setCurrentTemplate(target);
            setFormData({ name: target.name, slug: target.slug, description: target.description || '' });
        } else {
            setCurrentTemplate(null);
            setFormData({ name: '', slug: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = currentTemplate
            ? await updateTemplate(currentTemplate.id, formData)
            : await createTemplate(formData);

        if (res.success) {
            setIsModalOpen(false);
            setSuccessMessage(currentTemplate ? "Template berhasil diperbarui!" : "Entitas template baru ditambahkan!");
            setIsSuccessModalOpen(true);
            fetchTemplates(page, limit, searchTerm);
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
        const res = await deleteTemplate(deleteTargetId);
        if (res.success) {
            setIsDeleteModalOpen(false);
            setSuccessMessage("Entitas template berhasil dihapus!");
            setIsSuccessModalOpen(true);
            fetchTemplates(page, limit, searchTerm);
        } else {
            alert(res.message);
        }
        setDeleteTargetId(null);
    };

    return (
        <div className="space-y-8 font-sans animate-in fade-in duration-300 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors group">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Manajemen Template</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Definisikan pengikat komponen fisik (*layout specification*) untuk diintegrasikan pada hierarki kategori.</p>
                </div>
                {canCreate && (
                    <button onClick={() => openModal()} className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3.5 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest active:scale-95 group/btn">
                        <Plus size={16} className="text-cyan-400 group-hover/btn:rotate-90 transition-transform" /> Tambah Template
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[2rem] rounded-tr-none shadow-sm border-2 border-blue-50 overflow-hidden flex flex-col hover:border-cyan-100 transition-colors">
                <div className="p-6 lg:p-8 border-b border-blue-50 bg-slate-50/50">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
                        <input
                            type="text" placeholder="Kueri pencarian template..."
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b-2 border-blue-50">
                            <tr>
                                <th className="p-6 pl-8 whitespace-nowrap">Nama Identitas Template</th>
                                <th className="p-6 whitespace-nowrap">Slug Komponen Fisik</th>
                                <th className="p-6 whitespace-nowrap">Deskripsi Peruntukan</th>
                                {(canUpdate || canDelete) && <th className="p-6 pr-8 text-center whitespace-nowrap">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-blue-50">
                            {isLoadingTemplates ? (
                                <tr><td colSpan={4} className="p-24 text-center text-slate-400 font-bold"><Loader2 className="animate-spin mx-auto mb-4 text-cyan-500" size={32} />Memuat spesifikasi...</td></tr>
                            ) : templates.length > 0 ? (
                                templates.map(item => (
                                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-6 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl rounded-tr-none bg-cyan-50 flex items-center justify-center flex-shrink-0 border border-cyan-100 shadow-sm group-hover:scale-105 transition-transform"><Monitor size={20} className="text-cyan-600" /></div>
                                                <span className="font-black text-slate-800 text-sm group-hover:text-blue-950 transition-colors">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="flex items-center gap-2 bg-blue-950 text-white font-mono text-[10px] font-black px-3 py-1.5 rounded-xl w-fit shadow-sm">
                                                <Code size={14} className="text-cyan-400" /> {item.slug}
                                            </span>
                                        </td>
                                        <td className="p-6 text-slate-500 text-xs font-medium">{item.description || 'Tanpa atribusi deskripsi'}</td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-6 pr-8">
                                                <div className="flex justify-center gap-2">
                                                    {canUpdate && <button onClick={() => openModal(item)} className="p-2.5 text-blue-900 hover:text-white hover:bg-blue-950 rounded-xl transition-all shadow-sm hover:shadow-md" title="Koreksi"><Edit size={16} /></button>}
                                                    {canDelete && <button onClick={() => confirmDelete(item.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="Hapus"><Trash2 size={16} /></button>}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="p-24 text-center text-slate-400 font-bold bg-slate-50 border-2 border-dashed border-blue-100 rounded-[2rem]">Spesifikasi template kosong.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Paginasi */}
                <div className="flex items-center justify-between px-6 lg:px-8 py-5 bg-white border-t-2 border-blue-50 rounded-b-[2rem] rounded-bl-none">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-l-2 border-cyan-400 pl-3">Total {templateMeta.totalItems} Entitas</span>
                    <div className="flex items-center gap-2 bg-slate-50 border border-blue-100 rounded-2xl rounded-tr-none p-1.5 shadow-sm">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={templateMeta.currentPage <= 1} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Prev</button>
                        <span className="px-4 py-2 text-[11px] font-black text-white bg-blue-950 rounded-xl shadow-sm">{templateMeta.currentPage} / {templateMeta.totalPages || 1}</span>
                        <button onClick={() => setPage(p => Math.min(templateMeta.totalPages, p + 1))} disabled={templateMeta.currentPage >= templateMeta.totalPages || templateMeta.totalPages === 0} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-xl shadow-2xl flex flex-col border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b-2 border-blue-50 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-950 rounded-2xl rounded-tr-none border border-blue-100 shadow-sm"><Monitor size={24} className="text-cyan-600" /></div>
                                <div>
                                    <h2 className="text-xl font-light text-slate-800 leading-tight">{currentTemplate ? 'Koreksi Spesifikasi' : 'Entitas Template Baru'}</h2>
                                    <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mt-1">Konfigurasi Modul</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 font-black transition-colors shadow-sm"><X size={18} /></button>
                        </div>

                        <div className="p-8 bg-slate-50/50">
                            <form id="templateForm" onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Nama Identitas Template *</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all" placeholder="Contoh: Klaster Artikel Eksekutif" />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Slug Komponen Fisik (Rujukan Code)</label>
                                    <div className="relative">
                                        <FileCode className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-600" size={18} />
                                        <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-mono text-slate-800 shadow-sm transition-all" placeholder="layout-artikel-eksekutif" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Deskripsi Peruntukan</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-medium text-slate-700 shadow-sm transition-all resize-none leading-relaxed h-24" placeholder="Tuliskan atribusi ringkas..." />
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-5 border-t-2 border-blue-50 bg-white flex justify-end gap-4 rounded-b-[2rem]">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-wider">Batalkan</button>
                            <button form="templateForm" type="submit" className="px-8 py-3 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2">
                                Simpan Entitas
                            </button>
                        </div>
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
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Hapus Spesifikasi?</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Kategori yang terikat dengan spesifikasi ini akan kehilangan rujukan render utamanya.</p>
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
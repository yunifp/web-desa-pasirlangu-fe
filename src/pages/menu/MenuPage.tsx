/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import { useMenus } from '../../hooks/useMenus';
import { useAuthStore } from '../../store/useAuthStore';
import type { Menu, MenuFormData } from '../../types/menu';
import { Search, Plus, Edit, Trash2, FolderTree, Layout, ChevronRight, X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

export const MenuPage: React.FC = () => {
    const { menus, isLoading, createMenu, updateMenu, deleteMenu } = useMenus();
    const { hasPermission } = useAuthStore();

    const canCreate = hasPermission('/menus', 'CREATE');
    const canUpdate = hasPermission('/menus', 'UPDATE');
    const canDelete = hasPermission('/menus', 'DELETE');

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
    const [formData, setFormData] = useState<MenuFormData>({
        title: '', path: '', icon: '', order: 0, parentId: null
    });

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const flattenMenus = (items: Menu[], level = 0): (Menu & { level: number })[] => {
        return items.reduce((acc: any[], item) => {
            acc.push({ ...item, level });
            if (item.children && item.children.length > 0) {
                const sortedChildren = [...item.children].sort((a, b) => a.order - b.order);
                acc.push(...flattenMenus(sortedChildren, level + 1));
            }
            return acc;
        }, []);
    };

    const processedMenus = useMemo(() => {
        let flattened = flattenMenus(menus);
        if (searchTerm) {
            flattened = flattened.filter(m =>
                m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.path.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return flattened;
    }, [menus, searchTerm]);

    const openModal = (menu?: Menu) => {
        if (menu) {
            setCurrentMenu(menu);
            setFormData({
                title: menu.title, path: menu.path,
                icon: menu.icon || '', order: menu.order, parentId: menu.parentId
            });
        } else {
            setCurrentMenu(null);
            setFormData({ title: '', path: '', icon: '', order: 0, parentId: null });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = currentMenu
            ? await updateMenu(currentMenu.id, formData)
            : await createMenu(formData);

        if (result.success) {
            setIsModalOpen(false);
            setSuccessMessage(currentMenu ? "Struktur menu diperbarui!" : "Entitas menu ditambahkan!");
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
        const result = await deleteMenu(deleteTargetId);
        if (result.success) {
            setIsDeleteModalOpen(false);
            setSuccessMessage("Entitas menu berhasil dihapus dari hierarki!");
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
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Struktur Navigasi Sidebar</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Manajemen pengarah rute internal dan hierarki sub-menu pada panel kiri.</p>
                </div>
                {canCreate && (
                    <button onClick={() => openModal()} className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-950/20 hover:from-teal-700 hover:to-emerald-700 transition-all font-bold text-xs uppercase tracking-wider active:scale-95">
                        <Plus size={16} /> Tambah Rute Menu
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text" placeholder="Kueri pencarian menu..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none text-xs font-semibold shadow-2xs transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-150">
                            <tr>
                                <th className="p-4 w-20 text-center whitespace-nowrap">Urutan</th>
                                <th className="p-4 whitespace-nowrap">Atribusi Menu & Kedalaman</th>
                                <th className="p-4 whitespace-nowrap">Rute / Path</th>
                                <th className="p-4 whitespace-nowrap">Kategori Level</th>
                                {(canUpdate || canDelete) && <th className="p-4 text-center whitespace-nowrap">Otoritas</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {isLoading ? (
                                <tr><td colSpan={(canUpdate || canDelete) ? 5 : 4} className="p-16 text-center text-slate-400 font-medium"><Loader2 className="animate-spin mx-auto mb-2 text-teal-600" size={24} />Memuat rantai menu...</td></tr>
                            ) : processedMenus.length > 0 ? (
                                processedMenus.map((menu: any) => (
                                    <tr key={menu.id} className={`${menu.level > 0 ? 'bg-slate-50/40' : 'bg-white'} hover:bg-slate-50/80 transition-colors group`}>
                                        <td className="p-4 text-center">
                                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-2xs border border-slate-200/80">
                                                {menu.order}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-900" style={{ paddingLeft: `${menu.level * 20}px` }}>
                                                {menu.level > 0 && <ChevronRight size={14} className="text-slate-300" />}
                                                {menu.level > 0 ? <FolderTree size={15} className="text-slate-400" /> : <Layout size={15} className="text-teal-600" />}
                                                <span className={menu.level === 0 ? 'font-bold text-sm' : 'font-semibold text-slate-700'}>
                                                    {menu.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <code className="text-[11px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md font-mono font-semibold border border-slate-200">
                                                {menu.path || '(Wadah Induk)'}
                                            </code>
                                        </td>
                                        <td className="p-4">
                                            {menu.level === 0 ? (
                                                <span className="text-[9px] font-black text-white bg-slate-900 px-2.5 py-0.5 rounded shadow-2xs tracking-wide uppercase">INDUK</span>
                                            ) : (
                                                <span className="text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded tracking-wide uppercase">SUBMENU</span>
                                            )}
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-4">
                                                <div className="flex justify-center gap-1.5">
                                                    {canUpdate && <button onClick={() => openModal(menu)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="Koreksi"><Edit size={16} /></button>}
                                                    {canDelete && <button onClick={() => confirmDelete(menu.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus"><Trash2 size={16} /></button>}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={(canUpdate || canDelete) ? 5 : 4} className="p-16 text-center text-slate-400 font-medium">Struktur navigasi kosong.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="p-6 bg-slate-950 text-white flex justify-between items-center border-b border-slate-900">
                            <h2 className="text-base font-black tracking-tight uppercase">{currentMenu ? 'Koreksi Rute Menu' : 'Registrasi Menu Internal'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-7 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1 group">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Label Teks Menu</label>
                                    <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white transition-all" placeholder="e.g. Klaster Dokumen" />
                                </div>

                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Jalur Internal (Path)</label>
                                    <input value={formData.path} onChange={e => setFormData({ ...formData, path: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-mono text-xs text-slate-900 bg-slate-50/50 focus:bg-white transition-all placeholder:font-sans" placeholder="/dashboard/dokumen" />
                                </div>

                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Ikon Modul (Lucide)</label>
                                    <input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-semibold text-xs text-slate-900 bg-slate-50/50 focus:bg-white transition-all" placeholder="FileText, Folder, dll" />
                                </div>

                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Nomor Pengurut</label>
                                    <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-bold text-teal-700 text-sm bg-slate-50/50 focus:bg-white transition-all" />
                                </div>

                                <div className="space-y-1 group">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Induk Keterikatan</label>
                                    <select
                                        value={formData.parentId || ''}
                                        onChange={e => setFormData({ ...formData, parentId: e.target.value || null })}
                                        className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-bold text-xs text-slate-800 bg-slate-50/50 focus:bg-white cursor-pointer transition-all"
                                    >
                                        <option value="">-- Menu Utama Mandiri --</option>
                                        {menus.filter(m => !m.parentId && m.id !== currentMenu?.id).map(m => (
                                            <option key={m.id} value={m.id}>{m.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                                <button type="submit" className="bg-slate-950 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-900 transition-all active:scale-95 shadow-md">
                                    {currentMenu ? 'Terapkan Perubahan' : 'Simpan Rute'}
                                </button>
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
                        <h2 className="text-base font-black text-slate-900 uppercase">Hapus Rute Navigasi?</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Penghapusan entitas induk akan berdampak pada penyajian sub-menu di bawahnya.</p>
                        <div className="flex gap-2 mt-6">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors">Batalkan</button>
                            <button onClick={executeDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-red-700 shadow-md transition-colors">Hapus Permanen</button>
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
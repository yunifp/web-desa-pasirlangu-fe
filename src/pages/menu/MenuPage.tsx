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
        <div className="space-y-8 font-sans animate-in fade-in duration-300 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors group">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Struktur Navigasi Sidebar</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Manajemen pengarah rute internal dan hierarki sub-menu pada panel kiri.</p>
                </div>
                {canCreate && (
                    <button onClick={() => openModal()} className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3.5 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest active:scale-95 group/btn">
                        <Plus size={16} className="text-cyan-400 group-hover/btn:rotate-90 transition-transform" /> Tambah Rute Menu
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[2rem] rounded-tr-none shadow-sm border-2 border-blue-50 overflow-hidden flex flex-col hover:border-cyan-100 transition-colors">
                <div className="p-6 lg:p-8 border-b border-blue-50 bg-slate-50/50">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
                        <input
                            type="text" placeholder="Kueri pencarian menu..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b-2 border-blue-50">
                            <tr>
                                <th className="p-6 w-24 text-center whitespace-nowrap">Urutan</th>
                                <th className="p-6 whitespace-nowrap">Atribusi Menu & Kedalaman</th>
                                <th className="p-6 whitespace-nowrap">Rute / Path</th>
                                <th className="p-6 whitespace-nowrap text-center">Kategori Level</th>
                                {(canUpdate || canDelete) && <th className="p-6 text-center whitespace-nowrap">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-blue-50">
                            {isLoading ? (
                                <tr><td colSpan={(canUpdate || canDelete) ? 5 : 4} className="p-24 text-center text-slate-400 font-bold"><Loader2 className="animate-spin mx-auto mb-4 text-cyan-500" size={32} />Memuat rantai menu...</td></tr>
                            ) : processedMenus.length > 0 ? (
                                processedMenus.map((menu: any) => (
                                    <tr key={menu.id} className={`${menu.level > 0 ? 'bg-blue-50/30' : 'bg-white'} hover:bg-blue-50/60 transition-colors group`}>
                                        <td className="p-6 text-center">
                                            <span className="bg-white text-blue-950 px-3 py-1.5 rounded-xl text-[11px] font-black shadow-sm border border-blue-100">
                                                {menu.order}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3 text-slate-900" style={{ paddingLeft: `${menu.level * 24}px` }}>
                                                {menu.level > 0 && <ChevronRight size={16} className="text-slate-300" />}
                                                {menu.level > 0 ? <FolderTree size={18} className="text-cyan-500" /> : <Layout size={18} className="text-blue-950" />}
                                                <span className={menu.level === 0 ? 'font-black text-sm group-hover:text-blue-950' : 'font-bold text-slate-700 group-hover:text-cyan-600'}>
                                                    {menu.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <code className="text-[11px] bg-slate-50 text-cyan-600 px-3 py-1.5 rounded-lg font-mono font-bold border border-slate-100">
                                                {menu.path || '(Wadah Induk)'}
                                            </code>
                                        </td>
                                        <td className="p-6 text-center">
                                            {menu.level === 0 ? (
                                                <span className="text-[9px] font-black text-white bg-blue-950 px-3 py-1.5 rounded-xl shadow-sm tracking-widest uppercase">INDUK</span>
                                            ) : (
                                                <span className="text-[9px] font-black text-cyan-700 bg-cyan-50 border border-cyan-100 px-3 py-1.5 rounded-xl tracking-widest uppercase">SUBMENU</span>
                                            )}
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-6">
                                                <div className="flex justify-center gap-2">
                                                    {canUpdate && <button onClick={() => openModal(menu)} className="p-2.5 text-blue-900 hover:text-white hover:bg-blue-950 rounded-xl transition-all shadow-sm hover:shadow-md" title="Koreksi"><Edit size={16} /></button>}
                                                    {canDelete && <button onClick={() => confirmDelete(menu.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="Hapus"><Trash2 size={16} /></button>}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={(canUpdate || canDelete) ? 5 : 4} className="p-24 text-center text-slate-400 font-bold bg-slate-50 border-2 border-dashed border-blue-100 rounded-[2rem]">Struktur navigasi kosong.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-xl shadow-2xl flex flex-col border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b-2 border-blue-50 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-950 rounded-2xl rounded-tr-none border border-blue-100 shadow-sm"><Layout size={24} className="text-cyan-600" /></div>
                                <div>
                                    <h2 className="text-xl font-light text-slate-800 leading-tight">{currentMenu ? 'Koreksi Rute Menu' : 'Registrasi Menu Internal'}</h2>
                                    <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mt-1">Struktur Navigasi</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 font-black transition-colors shadow-sm"><X size={18} /></button>
                        </div>

                        <div className="p-8 bg-slate-50/50">
                            <form id="menuForm" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Label Teks Menu *</label>
                                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all" placeholder="Contoh: Klaster Dokumen" />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Jalur Internal (Path)</label>
                                        <input value={formData.path} onChange={e => setFormData({ ...formData, path: e.target.value })} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-mono text-slate-800 shadow-sm transition-all placeholder:font-sans" placeholder="/dashboard/dokumen" />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Ikon Modul (Lucide)</label>
                                        <input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all" placeholder="FileText, Folder, dll" />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Nomor Pengurut</label>
                                        <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-black text-cyan-600 shadow-sm transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Induk Keterikatan</label>
                                        <select
                                            value={formData.parentId || ''}
                                            onChange={e => setFormData({ ...formData, parentId: e.target.value || null })}
                                            className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm cursor-pointer transition-all"
                                        >
                                            <option value="">-- Menu Utama Mandiri --</option>
                                            {menus.filter(m => !m.parentId && m.id !== currentMenu?.id).map(m => (
                                                <option key={m.id} value={m.id}>{m.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-5 border-t-2 border-blue-50 bg-white flex justify-end gap-4 rounded-b-[2rem]">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-wider">Batalkan</button>
                            <button form="menuForm" type="submit" className="px-8 py-3 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-widest">
                                {currentMenu ? 'Terapkan Perubahan' : 'Simpan Rute'}
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
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Hapus Rute Navigasi?</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Penghapusan entitas induk akan berdampak pada hilangnya sub-menu di bawahnya.</p>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wider">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-md shadow-red-500/20 transition-all active:scale-95 uppercase tracking-wider">Hapus Permanen</button>
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
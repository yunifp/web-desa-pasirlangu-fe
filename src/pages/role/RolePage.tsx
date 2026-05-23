/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { useRoles } from '../../hooks/useRoles';
import { useAuthStore } from '../../store/useAuthStore';
import type { Role, RoleFormData, RoleMenuAccess, Menu } from '../../types/role';
import {
    Search, Plus, Edit, Trash2, ShieldCheck, X,
    ChevronUp, ChevronDown, FolderTree, Layout, ChevronRight, CheckSquare,
    AlertTriangle, CheckCircle, Loader2, Eye, EyeOff
} from 'lucide-react';

export const RolePage: React.FC = () => {
    const {
        roles, meta, permissions, menus, isLoading,
        fetchRoles, createRole, updateRole, deleteRole, updateRoleAccess
    } = useRoles();
    const { hasPermission } = useAuthStore();

    const canCreate = hasPermission('/roles', 'CREATE');
    const canUpdate = hasPermission('/roles', 'UPDATE');
    const canDelete = hasPermission('/roles', 'DELETE');

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Role; direction: 'asc' | 'desc' } | null>(null);

    const [isModalRoleOpen, setIsModalRoleOpen] = useState(false);
    const [isModalAccessOpen, setIsModalAccessOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role | null>(null);

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const [formData, setFormData] = useState<RoleFormData>({ name: '', description: '' });
    const [accessData, setAccessData] = useState<RoleMenuAccess[]>([]);

    useEffect(() => {
        fetchRoles(page, limit);
    }, [page, limit, fetchRoles]);

    const processedRoles = useMemo(() => {
        let result = [...roles];
        if (searchTerm) {
            result = result.filter(r =>
                r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = (a[sortConfig.key] || '').toString().toLowerCase();
                const bValue = (b[sortConfig.key] || '').toString().toLowerCase();
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [roles, searchTerm, sortConfig]);

    const requestSort = (key: keyof Role) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const flattenMenusForMatrix = (items: Menu[], level = 0): (Menu & { level: number })[] => {
        return items.reduce((acc: any[], item) => {
            acc.push({ ...item, level });
            if (item.children && item.children.length > 0) {
                const sortedChildren = [...item.children].sort((a, b) => a.order - b.order);
                acc.push(...flattenMenusForMatrix(sortedChildren, level + 1));
            }
            return acc;
        }, []);
    };

    const flatMenusMatrix = useMemo(() => flattenMenusForMatrix(menus), [menus]);

    const openModalAccess = (role: Role) => {
        setCurrentRole(role);
        const initialAccess: RoleMenuAccess[] = [];
        if (role.menuAccess) {
            const grouped = role.menuAccess.reduce((acc: any, curr) => {
                if (!acc[curr.menuId]) acc[curr.menuId] = [];
                acc[curr.menuId].push(curr.permissionId);
                return acc;
            }, {});
            Object.keys(grouped).forEach(mId => {
                initialAccess.push({ menuId: mId, permissionIds: grouped[mId] });
            });
        }
        setAccessData(initialAccess);
        setIsModalAccessOpen(true);
    };

    const toggleAccess = (menuId: string, permId: string) => {
        setAccessData(prev => {
            const visibilityPerm = permissions.find(p => p.name.toUpperCase() === 'VISIBILITY');
            const visibilityId = visibilityPerm?.id;
            const otherPermIds = permissions.filter(p => p.id !== visibilityId).map(p => p.id);

            const existingMenu = prev.find(a => a.menuId === menuId);
            let newPermissionIds: string[] = [];

            if (existingMenu) {
                const hasPerm = existingMenu.permissionIds.includes(permId);
                newPermissionIds = hasPerm
                    ? existingMenu.permissionIds.filter(id => id !== permId)
                    : [...existingMenu.permissionIds, permId];
            } else {
                newPermissionIds = [permId];
            }

            if (visibilityId && permId !== visibilityId) {
                const hasAllOther = otherPermIds.length > 0 && otherPermIds.every(id => newPermissionIds.includes(id));
                if (hasAllOther && !newPermissionIds.includes(visibilityId)) {
                    newPermissionIds.push(visibilityId);
                }
            }

            if (existingMenu) {
                return prev.map(a => a.menuId === menuId ? { ...a, permissionIds: newPermissionIds } : a);
            }
            return [...prev, { menuId, permissionIds: newPermissionIds }];
        });
    };

    const handleSelectAllInRow = (menuId: string) => {
        const allPermIds = permissions.map(p => p.id);
        const currentMenuAccess = accessData.find(a => a.menuId === menuId);
        const isAlreadyFull = currentMenuAccess?.permissionIds.length === allPermIds.length;

        setAccessData(prev => {
            const otherMenus = prev.filter(a => a.menuId !== menuId);
            if (isAlreadyFull) return otherMenus;
            return [...otherMenus, { menuId, permissionIds: allPermIds }];
        });
    };

    const handleSaveAccess = async () => {
        if (!currentRole) return;
        const res = await updateRoleAccess(currentRole.id, accessData);
        if (res.success) {
            setIsModalAccessOpen(false);
            setSuccessMessage("Matriks otorisasi " + currentRole.name + " berhasil disinkronisasi!");
            setIsSuccessModalOpen(true);
            fetchRoles(page, limit);
        }
    };

    const openModalRole = (role?: Role) => {
        setCurrentRole(role || null);
        setFormData({ name: role?.name || '', description: role?.description || '' });
        setIsModalRoleOpen(true);
    };

    const handleSubmitRole = async () => {
        const res = currentRole ? await updateRole(currentRole.id, formData) : await createRole(formData);
        if (res.success) {
            setIsModalRoleOpen(false);
            setSuccessMessage(currentRole ? "Grup peran diperbarui!" : "Grup otorisasi baru terbentuk!");
            setIsSuccessModalOpen(true);
            fetchRoles(page, limit);
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
        const res = await deleteRole(deleteTargetId);
        if (res.success) {
            setIsDeleteModalOpen(false);
            setSuccessMessage("Grup peran berhasil dilucuti dari sistem!");
            setIsSuccessModalOpen(true);
            fetchRoles(page, limit);
        } else {
            alert(res.message);
        }
        setDeleteTargetId(null);
    };

    return (
        <div className="space-y-8 font-sans animate-in fade-in duration-300 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors group">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Manajemen Grup Peran (*Roles*)</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Definisikan klaster otorisasi pengguna dan pengikatan hak akses pada setiap lapisan sistem.</p>
                </div>
                {canCreate && (
                    <button onClick={() => openModalRole()} className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3.5 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest active:scale-95 group/btn">
                        <Plus size={16} className="text-cyan-400 group-hover/btn:rotate-90 transition-transform" /> Bentuk Peran Baru
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[2rem] rounded-tr-none shadow-sm border-2 border-blue-50 overflow-hidden flex flex-col hover:border-cyan-100 transition-colors">
                <div className="p-6 lg:p-8 border-b border-blue-50 bg-slate-50/50">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
                        <input
                            type="text" placeholder="Kueri pencarian grup peran..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b-2 border-blue-50">
                            <tr>
                                <th className="p-6 pl-8 cursor-pointer hover:text-cyan-600 transition-colors whitespace-nowrap" onClick={() => requestSort('name')}>
                                    <div className="flex items-center gap-2">
                                        Identitas Grup Peran {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </div>
                                </th>
                                <th className="p-6 whitespace-nowrap">Deskripsi Peruntukan</th>
                                {(canUpdate || canDelete) && <th className="p-6 pr-8 text-center whitespace-nowrap">Otoritas</th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-blue-50">
                            {isLoading ? (
                                <tr><td colSpan={3} className="p-24 text-center text-slate-400 font-bold"><Loader2 className="animate-spin mx-auto mb-4 text-cyan-500" size={32} />Memuat grup...</td></tr>
                            ) : processedRoles.length > 0 ? (
                                processedRoles.map(role => (
                                    <tr key={role.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-6 pl-8">
                                            <span className="font-black text-slate-800 text-sm group-hover:text-blue-950 transition-colors uppercase tracking-widest">{role.name.replace(/_/g, ' ')}</span>
                                        </td>
                                        <td className="p-6 text-slate-500 font-medium">
                                            {role.description || 'Tanpa atribusi deskripsi'}
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-6 pr-8">
                                                <div className="flex justify-center gap-2">
                                                    {canUpdate && (
                                                        <>
                                                            <button onClick={() => openModalAccess(role)} className="p-2.5 text-cyan-600 hover:text-white hover:bg-cyan-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="Matriks Otorisasi"><ShieldCheck size={16} /></button>
                                                            <button onClick={() => openModalRole(role)} className="p-2.5 text-blue-900 hover:text-white hover:bg-blue-950 rounded-xl transition-all shadow-sm hover:shadow-md" title="Koreksi"><Edit size={16} /></button>
                                                        </>
                                                    )}
                                                    {canDelete && (
                                                        <button onClick={() => confirmDelete(role.id)} className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="Hapus"><Trash2 size={16} /></button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={3} className="p-24 text-center text-slate-400 font-bold bg-slate-50 border-2 border-dashed border-blue-100 rounded-[2rem]">Data grup kosong.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-6 lg:px-8 py-5 bg-white border-t-2 border-blue-50 rounded-b-[2rem] rounded-bl-none">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-l-2 border-cyan-400 pl-3">Total {meta.totalItems} Entitas</span>
                    <div className="flex items-center gap-4">
                        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border border-blue-100 rounded-xl text-xs font-bold px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-slate-50 text-slate-700 shadow-sm cursor-pointer transition-all">
                            <option value={10}>10 Baris</option>
                            <option value={25}>25 Baris</option>
                        </select>
                        <div className="flex items-center gap-2 bg-slate-50 border border-blue-100 rounded-2xl rounded-tr-none p-1.5 shadow-sm">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={meta.currentPage <= 1} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Prev</button>
                            <span className="px-4 py-2 text-[11px] font-black text-white bg-blue-950 rounded-xl shadow-sm">{meta.currentPage} / {meta.totalPages || 1}</span>
                            <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={meta.currentPage >= meta.totalPages || meta.totalPages === 0} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL MATRIKS AKSES EKSKLUSIF --- */}
            {isModalAccessOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border-4 border-white/20">
                        <div className="p-6 lg:p-8 border-b-2 border-blue-50 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl rounded-tr-none border border-cyan-100 shadow-sm"><ShieldCheck size={24} /></div>
                                <div>
                                    <h2 className="text-xl font-light text-slate-800 leading-tight">Sinkronisasi Matriks Otorisasi</h2>
                                    <p className="text-[10px] text-cyan-600 mt-1 font-black tracking-widest uppercase">Identitas Mengikat: {currentRole?.name.replace(/_/g, ' ')}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalAccessOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 font-black transition-colors shadow-sm"><X size={18} /></button>
                        </div>

                        <div className="flex-1 p-6 lg:p-8 bg-slate-50/50 flex flex-col min-h-0 overflow-hidden">
                            <div className="border-2 border-blue-50 rounded-3xl bg-white shadow-sm flex-1 overflow-auto custom-scrollbar">
                                <table className="w-full border-collapse relative min-w-[800px]">
                                    <thead className="sticky top-0 z-20 bg-blue-50/90 backdrop-blur-sm shadow-sm border-b-2 border-blue-100">
                                        <tr>
                                            <th className="p-5 pl-6 text-left text-[10px] uppercase tracking-widest font-black text-blue-900">Klaster Rute Menu</th>
                                            {permissions.map(p => (
                                                <th key={p.id} className="p-5 text-center text-[10px] font-black uppercase tracking-widest text-cyan-800 bg-cyan-100/50 border-l-2 border-white">
                                                    {p.name}
                                                </th>
                                            ))}
                                            <th className="p-5 pr-6 text-center text-[10px] uppercase tracking-widest font-black text-slate-500 bg-slate-200/50 border-l-2 border-white">Beri Mutlak</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-blue-50 text-sm">
                                        {flatMenusMatrix.map((menu: any) => {
                                            const currentMenuAccess = accessData.find(a => a.menuId === menu.id);
                                            const isAllSelected = currentMenuAccess?.permissionIds.length === permissions.length;

                                            return (
                                                <tr key={menu.id} className={`${menu.level > 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50/50 transition-colors`}>
                                                    <td className="p-5 pl-6 border-r-2 border-blue-50">
                                                        <div className="flex items-center gap-3" style={{ paddingLeft: `${menu.level * 24}px` }}>
                                                            {menu.level > 0 && <ChevronRight size={16} className="text-slate-300" />}
                                                            {menu.level > 0 ? <FolderTree size={18} className="text-cyan-500" /> : <Layout size={18} className="text-blue-950" />}
                                                            <span className={`${menu.level === 0 ? 'font-black text-slate-800' : 'font-bold text-slate-600'}`}>
                                                                {menu.title}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    {permissions.map(perm => {
                                                        const isVisibility = perm.name.toUpperCase() === 'VISIBILITY';
                                                        const isChecked = currentMenuAccess?.permissionIds.includes(perm.id) || false;

                                                        return (
                                                            <td key={perm.id} className="p-5 text-center border-r-2 border-blue-50 bg-white">
                                                                {isVisibility ? (
                                                                    <div className="flex justify-center">
                                                                        <button
                                                                            type="button" onClick={() => toggleAccess(menu.id, perm.id)}
                                                                            className={`p-2 rounded-xl transition-all border-2 flex items-center justify-center ${isChecked ? 'bg-cyan-50 text-cyan-600 border-cyan-400 shadow-sm' : 'bg-slate-50 text-slate-300 hover:bg-slate-100 border-slate-100'}`}
                                                                            title={isChecked ? 'Ditampilkan' : 'Disembunyikan'}
                                                                        >
                                                                            {isChecked ? <Eye size={18} /> : <EyeOff size={18} />}
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <input
                                                                        type="checkbox" checked={isChecked} onChange={() => toggleAccess(menu.id, perm.id)}
                                                                        className="w-5 h-5 accent-cyan-500 cursor-pointer rounded transition-transform active:scale-90"
                                                                    />
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="p-5 pr-6 text-center bg-slate-50/80">
                                                        <button
                                                            type="button" onClick={() => handleSelectAllInRow(menu.id)}
                                                            className={`p-2 rounded-xl transition-all border-2 ${isAllSelected ? 'bg-blue-950 text-white border-blue-950 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-950 hover:text-blue-950'}`}
                                                        >
                                                            <CheckSquare size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-6 lg:px-8 border-t-2 border-blue-50 flex justify-end gap-4 bg-white rounded-b-[2rem]">
                            <button onClick={() => setIsModalAccessOpen(false)} className="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-wider">Batal</button>
                            <button onClick={handleSaveAccess} className="px-8 py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95">
                                Terapkan Matriks
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CRUD ROLE */}
            {isModalRoleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-xl shadow-2xl flex flex-col border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b-2 border-blue-50 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-950 rounded-2xl rounded-tr-none border border-blue-100 shadow-sm"><ShieldCheck size={24} className="text-cyan-600" /></div>
                                <div>
                                    <h2 className="text-xl font-light text-slate-800 leading-tight">{currentRole ? 'Koreksi Identitas Peran' : 'Entitas Peran Baru'}</h2>
                                    <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mt-1">Grup Otorisasi</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalRoleOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 font-black transition-colors shadow-sm"><X size={18} /></button>
                        </div>

                        <div className="p-8 bg-slate-50/50 space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Identitas Grup Peran *</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all" placeholder="Contoh: EDITOR_EKSEKUTIF" />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Atribusi Deskripsi</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-medium text-slate-700 shadow-sm transition-all resize-none leading-relaxed h-24" placeholder="Tuliskan atribusi ringkas..." />
                            </div>
                        </div>

                        <div className="px-8 py-5 border-t-2 border-blue-50 bg-white flex justify-end gap-4 rounded-b-[2rem]">
                            <button onClick={() => setIsModalRoleOpen(false)} className="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-wider">Batal</button>
                            <button onClick={handleSubmitRole} className="px-8 py-3 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2">
                                Simpan Peran
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
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Lucuti Grup Peran?</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Pengguna yang terikat pada otoritas ini akan kehilangan parameter izin utamanya.</p>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wider">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-md shadow-red-500/20 transition-all active:scale-95 uppercase tracking-wider">Eksekusi Hapus</button>
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
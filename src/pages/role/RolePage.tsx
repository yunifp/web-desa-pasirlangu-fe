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
        <div className="space-y-6 font-sans animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Grup Peran (*Roles*)</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Definisikan klaster otorisasi pengguna dan pengikatan hak akses pada setiap lapisan sistem.</p>
                </div>
                {canCreate && (
                    <button onClick={() => openModalRole()} className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-950/20 hover:from-teal-700 hover:to-emerald-700 transition-all font-bold text-xs uppercase tracking-wider active:scale-95">
                        <Plus size={16} /> Bentuk Peran Baru
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text" placeholder="Kueri pencarian grup peran..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none text-xs font-semibold shadow-2xs transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-150">
                            <tr>
                                <th className="p-4 pl-6 cursor-pointer hover:text-teal-600 transition-colors whitespace-nowrap" onClick={() => requestSort('name')}>
                                    <div className="flex items-center gap-1.5">
                                        Identitas Grup Peran {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                                    </div>
                                </th>
                                <th className="p-4 whitespace-nowrap">Deskripsi Peruntukan</th>
                                {(canUpdate || canDelete) && <th className="p-4 pr-6 text-center whitespace-nowrap">Otoritas</th>}
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={3} className="p-16 text-center text-slate-400 font-medium"><Loader2 className="animate-spin mx-auto mb-2 text-teal-600" size={24} />Memuat grup...</td></tr>
                            ) : processedRoles.length > 0 ? (
                                processedRoles.map(role => (
                                    <tr key={role.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <span className="font-bold text-slate-900 text-sm tracking-wide">{role.name}</span>
                                        </td>
                                        <td className="p-4 text-slate-500 font-medium">
                                            {role.description || 'Tanpa atribusi deskripsi'}
                                        </td>
                                        {(canUpdate || canDelete) && (
                                            <td className="p-4 pr-6">
                                                <div className="flex justify-center gap-1.5">
                                                    {canUpdate && (
                                                        <>
                                                            <button onClick={() => openModalAccess(role)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Matriks Otorisasi"><ShieldCheck size={16} /></button>
                                                            <button onClick={() => openModalRole(role)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="Koreksi"><Edit size={16} /></button>
                                                        </>
                                                    )}
                                                    {canDelete && (
                                                        <button onClick={() => confirmDelete(role.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus"><Trash2 size={16} /></button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={3} className="p-16 text-center text-slate-400 font-medium">Data grup kosong.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total {meta.totalItems} Entitas</span>
                    <div className="flex items-center gap-2">
                        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border border-slate-200 rounded-lg text-xs font-bold px-2.5 py-1 outline-none focus:border-teal-600 bg-white text-slate-700 shadow-2xs cursor-pointer">
                            <option value={10}>10 Baris</option>
                            <option value={25}>25 Baris</option>
                        </select>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={meta.currentPage <= 1} className="px-3 py-1 text-xs font-bold disabled:opacity-30 text-slate-600 hover:text-slate-900 transition-colors">Prev</button>
                            <span className="px-3 py-1 text-xs font-black text-white bg-slate-900 rounded-lg shadow-xs">{meta.currentPage} / {meta.totalPages || 1}</span>
                            <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={meta.currentPage >= meta.totalPages || meta.totalPages === 0} className="px-3 py-1 text-xs font-bold disabled:opacity-30 text-slate-600 hover:text-slate-900 transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL MATRIKS AKSES EKSKLUSIF --- */}
            {isModalAccessOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-100">
                        <div className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-950 text-white">
                            <div>
                                <h2 className="text-base font-black tracking-tight uppercase">Sinkronisasi Matriks Otorisasi</h2>
                                <p className="text-[11px] text-teal-500 mt-0.5 font-bold tracking-wide uppercase">Identitas Mengikat: {currentRole?.name}</p>
                            </div>
                            <button onClick={() => setIsModalAccessOpen(false)} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
                        </div>

                        <div className="flex-1 p-6 bg-slate-50/50 flex flex-col min-h-0 overflow-hidden">
                            <div className="border border-slate-200 rounded-2xl bg-white shadow-2xs flex-1 overflow-auto custom-scrollbar">
                                <table className="w-full border-collapse relative">
                                    <thead className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-xs shadow-2xs border-b border-slate-200">
                                        <tr>
                                            <th className="p-4 pl-6 text-left text-[10px] uppercase tracking-wider font-black text-slate-500">Klaster Rute Menu</th>
                                            {permissions.map(p => (
                                                <th key={p.id} className="p-4 text-center text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50/40 border-l border-white">
                                                    {p.name}
                                                </th>
                                            ))}
                                            <th className="p-4 pr-6 text-center text-[10px] uppercase tracking-wider font-black text-slate-500 bg-slate-100/50 border-l border-white">Beri Mutlak</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                        {flatMenusMatrix.map((menu: any) => {
                                            const currentMenuAccess = accessData.find(a => a.menuId === menu.id);
                                            const isAllSelected = currentMenuAccess?.permissionIds.length === permissions.length;

                                            return (
                                                <tr key={menu.id} className={`${menu.level > 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-slate-50/80 transition-colors`}>
                                                    <td className="p-4 pl-6 border-r border-slate-100">
                                                        <div className="flex items-center gap-2" style={{ paddingLeft: `${menu.level * 20}px` }}>
                                                            {menu.level > 0 && <ChevronRight size={14} className="text-slate-300" />}
                                                            {menu.level > 0 ? <FolderTree size={15} className="text-slate-400" /> : <Layout size={15} className="text-teal-600" />}
                                                            <span className={`${menu.level === 0 ? 'font-bold text-slate-900 text-sm' : 'font-semibold text-slate-700'}`}>
                                                                {menu.title}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    {permissions.map(perm => {
                                                        const isVisibility = perm.name.toUpperCase() === 'VISIBILITY';
                                                        const isChecked = currentMenuAccess?.permissionIds.includes(perm.id) || false;

                                                        return (
                                                            <td key={perm.id} className="p-4 text-center border-r border-slate-100 bg-white">
                                                                {isVisibility ? (
                                                                    <div className="flex justify-center">
                                                                        <button
                                                                            type="button" onClick={() => toggleAccess(menu.id, perm.id)}
                                                                            className={`p-1.5 rounded-lg transition-all border flex items-center justify-center ${isChecked ? 'bg-teal-50 text-teal-700 border-teal-200 shadow-2xs' : 'bg-slate-50 text-slate-300 hover:bg-slate-100 border-slate-200'}`}
                                                                            title={isChecked ? 'Ditampilkan' : 'Disembunyikan'}
                                                                        >
                                                                            {isChecked ? <Eye size={16} /> : <EyeOff size={16} />}
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <input
                                                                        type="checkbox" checked={isChecked} onChange={() => toggleAccess(menu.id, perm.id)}
                                                                        className="w-4 h-4 accent-teal-600 cursor-pointer rounded transition-transform active:scale-90 border-slate-200"
                                                                    />
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="p-4 pr-6 text-center bg-slate-50/30">
                                                        <button
                                                            type="button" onClick={() => handleSelectAllInRow(menu.id)}
                                                            className={`p-1.5 rounded-lg transition-all ${isAllSelected ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-900 hover:text-slate-900'}`}
                                                        >
                                                            <CheckSquare size={15} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-5 border-t border-slate-100 flex justify-end gap-2 bg-white">
                            <button onClick={() => setIsModalAccessOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all">Batal</button>
                            <button onClick={handleSaveAccess} className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-slate-900 transition-all active:scale-95">
                                Terapkan Matriks
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CRUD ROLE */}
            {isModalRoleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-7 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">{currentRole ? 'Koreksi Identitas Peran' : 'Entitas Peran Baru'}</h2>
                                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Tetapkan penamaan pengikat dan atribusi deskripsi singkat.</p>
                            </div>
                            <button onClick={() => setIsModalRoleOpen(false)} className="text-slate-400 hover:text-slate-900 p-1"><X size={18} /></button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1 group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Identitas Grup Peran</label>
                                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 font-bold text-xs text-slate-900 bg-slate-50/50 focus:bg-white transition-all" placeholder="e.g. EDITOR_EKSEKUTIF" />
                            </div>

                            <div className="space-y-1 group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Atribusi Deskripsi</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-teal-600 h-20 text-xs font-medium resize-none text-slate-800 bg-slate-50/50 focus:bg-white transition-all" placeholder="Tuliskan atribusi ringkas..." />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button onClick={() => setIsModalRoleOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                                <button onClick={handleSubmitRole} className="bg-slate-950 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-900 transition-all active:scale-95 shadow-md">
                                    Simpan Peran
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL HAPUS */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl text-center p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <AlertTriangle className="text-red-600 mx-auto mb-3" size={40} />
                        <h2 className="text-base font-black text-slate-900 uppercase">Lucuti Grup Peran?</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Pengguna yang terikat pada otoritas ini akan kehilangan parameter izin utamanya.</p>
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
                        <h2 className="text-base font-black text-slate-900 uppercase">Sinkronisasi Siap</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="mt-6 w-full py-3 bg-slate-950 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-900 shadow-md transition-colors">Tutup Panel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
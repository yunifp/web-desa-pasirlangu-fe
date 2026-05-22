/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ChevronDown, Loader2, Layers } from 'lucide-react';
import { api } from '../services/api';

interface SidebarProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed
}) => {
    const location = useLocation();
    const [menus, setMenus] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

    const renderIcon = (iconName: string | null) => {
        if (!iconName) return <Icons.Circle size={16} />;
        const LucideIcon = (Icons as any)[iconName];
        return LucideIcon ? <LucideIcon size={18} /> : <Icons.HelpCircle size={18} />;
    };

    useEffect(() => {
        const fetchMyMenus = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/menus/my-menus');
                setMenus(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyMenus();
    }, []);

    useEffect(() => {
        if (menus.length > 0) {
            menus.forEach((menu: any) => {
                const isChildActive = menu.children?.some((c: any) => c.path === location.pathname);

                if (isChildActive) {
                    setOpenSubmenus((prev) =>
                        prev.includes(menu.id) ? prev : [...prev, menu.id]
                    );
                }
            });
        }
    }, [location.pathname, menus]);

    const toggleSubmenu = (id: string) => {
        if (isCollapsed) setIsCollapsed(false);
        setOpenSubmenus((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <>
            {/* Latar penutup mobile bergaya glassmorphism */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-md transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-screen bg-[#0b131f] border-r border-slate-900 text-slate-300 transition-all duration-300 shadow-2xl flex flex-col font-sans
                ${isCollapsed ? 'w-20' : 'w-64'} 
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Bagian Merek / Logo Perusahaan */}
                <div className={`h-20 flex items-center border-b border-slate-900/80 bg-[#070d16] transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
                    <div className="flex items-center gap-3 overflow-hidden w-full">
                        <div className={`bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-900/30 transition-all duration-300 ${isCollapsed ? 'w-10 h-10 rounded-xl' : 'w-10 h-10 rounded-xl'}`}>
                            {/* Memanfaatkan aset lama sebagai fallback, atau mencetak inisial mewah jika gambar tidak sesuai */}
                            <Layers size={20} className="text-white" />
                        </div>

                        {!isCollapsed && (
                            <div className="flex flex-col animate-in fade-in duration-300 truncate">
                                <span className="text-base font-black tracking-tight text-white uppercase block leading-none">
                                    PT PERMINAS
                                </span>
                                <span className="text-[9px] font-bold text-teal-500 uppercase tracking-widest block mt-1">
                                    Enterprise Portal
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Struktur Tautan Navigasi */}
                <nav className="flex-1 overflow-y-auto py-6 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="animate-spin text-teal-500" size={24} />
                        </div>
                    ) : (
                        <ul className="space-y-1 px-4">
                            {menus.map((menu) => {
                                const isOpen = openSubmenus.includes(menu.id);
                                const hasChildren = menu.children && menu.children.length > 0;

                                const isParentActive = location.pathname === menu.path ||
                                    menu.children?.some((c: any) => c.path === location.pathname);

                                return (
                                    <li key={menu.id}>
                                        {hasChildren ? (
                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => toggleSubmenu(menu.id)}
                                                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group
                                                    ${isParentActive ? 'bg-slate-900/90 text-white font-bold border border-slate-800/80 shadow-inner' : 'hover:bg-slate-900/40 text-slate-400 hover:text-slate-200'}
                                                    ${isCollapsed ? 'justify-center' : ''}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`min-w-[20px] transition-colors ${isParentActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-teal-500'}`}>
                                                            {renderIcon(menu.icon)}
                                                        </span>
                                                        {!isCollapsed && <span className="text-xs font-semibold tracking-wide">{menu.title}</span>}
                                                    </div>
                                                    {!isCollapsed && (
                                                        <ChevronDown size={14} className={`transition-transform duration-200 text-slate-500 group-hover:text-slate-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                    )}
                                                </button>

                                                {/* Dropdown Laci Anak */}
                                                <div className={`overflow-hidden transition-all duration-300 ${isOpen && !isCollapsed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <ul className="space-y-1 pl-9 pr-2 py-1.5 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                                                        {menu.children.map((child: any) => {
                                                            const isChildActive = location.pathname === child.path;
                                                            return (
                                                                <li key={child.id}>
                                                                    <Link
                                                                        to={child.path}
                                                                        onClick={() => setIsMobileOpen(false)}
                                                                        className={`block px-3 py-2 text-xs rounded-lg transition-all duration-200 font-medium
                                                                        ${isChildActive
                                                                                ? 'bg-teal-500/10 text-teal-400 font-bold tracking-wide'
                                                                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'}`}
                                                                    >
                                                                        {child.title}
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                to={menu.path || '#'}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group
                                                ${location.pathname === menu.path
                                                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-lg shadow-teal-950/40 tracking-wide'
                                                        : 'hover:bg-slate-900/40 text-slate-400 hover:text-slate-200'}
                                                ${isCollapsed ? 'justify-center' : ''}`}
                                            >
                                                <span className={`min-w-[20px] transition-colors ${location.pathname === menu.path ? 'text-white' : 'text-slate-500 group-hover:text-teal-500'}`}>
                                                    {renderIcon(menu.icon)}
                                                </span>
                                                {!isCollapsed && <span className="text-xs font-semibold tracking-wide truncate">{menu.title}</span>}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </nav>
            </aside>
        </>
    );
};
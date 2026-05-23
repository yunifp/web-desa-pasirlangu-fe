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
        return LucideIcon ? <LucideIcon size={isCollapsed ? 20 : 18} /> : <Icons.HelpCircle size={18} />;
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
                    className="fixed inset-0 bg-blue-950/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-screen bg-slate-900 border-r border-blue-900/50 text-slate-300 transition-all duration-300 shadow-2xl flex flex-col font-sans
                ${isCollapsed ? 'w-20' : 'w-72'} 
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Bagian Merek / Logo Perusahaan */}
                <div className={`h-20 flex items-center border-b border-blue-900/80 bg-[#070b12] transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
                    <div className="flex items-center gap-4 overflow-hidden w-full justify-center lg:justify-start">
                        <div className={`bg-blue-950 border-2 border-blue-800 flex items-center justify-center ml-5 flex-shrink-0 shadow-lg shadow-cyan-900/20 transition-all duration-300 ${isCollapsed ? 'w-10 h-10 rounded-2xl rounded-tr-none' : 'w-12 h-12 rounded-2xl rounded-tr-none'}`}>
                            <Layers size={isCollapsed ? 20 : 24} className="text-cyan-400" />
                        </div>

                        {!isCollapsed && (
                            <div className="flex flex-col animate-in fade-in duration-300 truncate">
                                <span className="text-[15px] font-black tracking-tight text-white uppercase block leading-none">
                                    DESA PASIRLANGU
                                </span>
                                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest block mt-1.5 opacity-90 truncate">
                                    KEC. CISARUA, KAB. BANDUNG BARAT
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Struktur Tautan Navigasi */}
                <nav className="flex-1 overflow-y-auto py-6 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="animate-spin text-cyan-500" size={24} />
                        </div>
                    ) : (
                        <ul className="space-y-1.5 px-3">
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
                                                    className={`w-full flex items-center justify-between rounded-[1rem] rounded-tr-none transition-all duration-200 group
                                                    ${isParentActive ? 'bg-blue-950 text-white font-black border border-blue-900/50 shadow-inner' : 'hover:bg-blue-900/40 text-slate-400 hover:text-slate-200'}
                                                    ${isCollapsed ? 'w-12 h-12 justify-center p-0 mx-auto' : 'px-4 py-3.5'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`flex items-center justify-center transition-colors ${isParentActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`}>
                                                            {renderIcon(menu.icon)}
                                                        </span>
                                                        {!isCollapsed && <span className="text-xs font-bold tracking-wide uppercase">{menu.title}</span>}
                                                    </div>
                                                    {!isCollapsed && (
                                                        <ChevronDown size={14} className={`transition-transform duration-200 text-slate-500 group-hover:text-cyan-400 ${isOpen ? 'rotate-180' : ''}`} />
                                                    )}
                                                </button>

                                                {/* Dropdown Laci Anak */}
                                                <div className={`overflow-hidden transition-all duration-300 ${isOpen && !isCollapsed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <ul className="space-y-1 pl-10 pr-2 py-2 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-blue-900/50">
                                                        {menu.children.map((child: any) => {
                                                            const isChildActive = location.pathname === child.path;
                                                            return (
                                                                <li key={child.id}>
                                                                    <Link
                                                                        to={child.path}
                                                                        onClick={() => setIsMobileOpen(false)}
                                                                        className={`block px-4 py-2.5 text-[11px] rounded-[1rem] rounded-tr-none transition-all duration-200 font-bold uppercase tracking-wider
                                                                        ${isChildActive
                                                                                ? 'bg-blue-900/50 text-cyan-400 font-black border border-blue-800/50'
                                                                                : 'text-slate-500 hover:text-slate-300 hover:bg-blue-900/30'}`}
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
                                                className={`flex items-center gap-3 rounded-[1rem] rounded-tr-none transition-all duration-200 group
                                                ${location.pathname === menu.path
                                                        ? 'bg-blue-950 text-white font-black shadow-lg shadow-blue-900/40 tracking-wider uppercase border border-blue-900/50'
                                                        : 'hover:bg-blue-900/40 text-slate-400 hover:text-slate-200 font-bold uppercase tracking-wider'}
                                                ${isCollapsed ? 'w-12 h-12 justify-center p-0 mx-auto' : 'px-4 py-3.5'}`}
                                            >
                                                <span className={`flex items-center justify-center transition-colors ${location.pathname === menu.path ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`}>
                                                    {renderIcon(menu.icon)}
                                                </span>
                                                {!isCollapsed && <span className="text-xs truncate">{menu.title}</span>}
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
import React, { useState, useRef, useEffect } from 'react';
import { Menu, User as UserIcon, LogOut, Settings, Menu as MenuIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface HeaderProps {
    setIsMobileOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setIsMobileOpen, isCollapsed, setIsCollapsed }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { user, logout } = useAuthStore();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsProfileOpen(false);
        logout();
    };

    const formatRole = (roleStr?: string) => {
        if (!roleStr) return 'User Enterprise';
        return roleStr.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <header className="h-20 bg-white/90 backdrop-blur-md shadow-sm border-b-2 border-blue-50 flex items-center justify-between px-6 z-10 relative transition-all duration-300 font-sans">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden p-2.5 rounded-2xl rounded-tr-none bg-blue-50 text-blue-900 hover:bg-cyan-50 hover:text-cyan-700 transition-colors border border-blue-100"
                >
                    <Menu size={20} />
                </button>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden ml-6 lg:flex p-2.5 rounded-2xl rounded-tr-none bg-blue-50 text-blue-900 hover:bg-blue-100 transition-colors border border-blue-100"
                >
                    <MenuIcon size={18} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>

                {/* Judul Teks Mobile Khusus Tema Baru */}
                <div className="lg:hidden flex flex-col">
                    <span className="text-sm font-black tracking-tight text-slate-900 uppercase leading-none truncate max-w-[150px]">
                        DESA PASIRLANGU
                    </span>
                    <span className="text-[8px] font-black text-cyan-600 uppercase tracking-widest mt-1 truncate max-w-[150px]">
                        KEC. CISARUA, KAB. BANDUNG BARAT
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 bg-white hover:bg-blue-50 rounded-full transition-all border-2 border-blue-50 shadow-sm"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-cyan-400 shadow-sm font-black text-xs">
                            {user?.name ? user.name[0].toUpperCase() : <UserIcon size={16} />}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-black text-slate-900 leading-none truncate max-w-[120px]">
                                {user?.name || 'User Eksekutif'}
                            </p>
                            <p className="text-[10px] text-cyan-600 font-bold mt-1.5">
                                {formatRole(user?.roles?.[0]?.name)}
                            </p>
                        </div>
                    </div>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] rounded-tr-none shadow-xl border-2 border-blue-50 py-3 z-50 transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-5 py-4 border-b-2 border-blue-50 md:hidden bg-blue-50/50 mx-2 rounded-2xl mb-2">
                                <p className="text-xs font-black text-slate-900 truncate">{user?.name || 'User Eksekutif'}</p>
                                <p className="text-[10px] text-cyan-600 font-bold mt-1">{formatRole(user?.roles?.[0]?.name)}</p>
                            </div>

                            <Link
                                to="/profile"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors mx-2 rounded-2xl"
                            >
                                <Settings size={16} className="text-slate-400" />
                                Konfigurasi Akun
                            </Link>

                            <div className="h-px bg-blue-50 my-2 mx-4" />

                            <button
                                onClick={handleLogout}
                                className="w-[calc(100%-16px)] flex items-center gap-3 px-5 py-3 text-xs text-red-600 hover:bg-red-50 font-black transition-colors mx-2 rounded-2xl"
                            >
                                <LogOut size={16} />
                                Keluar Sistem
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
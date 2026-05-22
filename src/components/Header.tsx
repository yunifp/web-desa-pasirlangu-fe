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
        <header className="h-20 bg-white/80 backdrop-blur-md shadow-2xs border-b border-slate-100 flex items-center justify-between px-6 z-10 relative transition-all duration-300 font-sans">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors border border-slate-100"
                >
                    <Menu size={20} />
                </button>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors border border-slate-100"
                >
                    <MenuIcon size={18} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>

                {/* Judul Teks Mobile Khusus Perminas */}
                <div className="lg:hidden flex flex-col">
                    <span className="text-sm font-black tracking-tight text-slate-900 uppercase leading-none">
                        PT PERMINAS
                    </span>
                    <span className="text-[8px] font-bold text-teal-600 uppercase tracking-widest mt-0.5">
                        Portal Admin
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 bg-slate-50/80 hover:bg-slate-100 rounded-full transition-all border border-slate-200/60 shadow-2xs"
                    >
                        <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-sm font-bold text-xs">
                            {user?.name ? user.name[0].toUpperCase() : <UserIcon size={16} />}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                                {user?.name || 'User Eksekutif'}
                            </p>
                            <p className="text-[10px] text-teal-600 font-semibold mt-1">
                                {formatRole(user?.roles?.[0]?.name)}
                            </p>
                        </div>
                    </div>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 border-b border-slate-50 md:hidden bg-slate-50/50 mx-2 rounded-xl mb-2">
                                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User Eksekutif'}</p>
                                <p className="text-[10px] text-teal-600 font-semibold mt-0.5">{formatRole(user?.roles?.[0]?.name)}</p>
                            </div>

                            <Link
                                to="/profile"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors mx-1.5 rounded-xl"
                            >
                                <Settings size={15} className="text-slate-400" />
                                Konfigurasi Akun
                            </Link>

                            <div className="h-px bg-slate-100 my-1 mx-3" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 font-bold transition-colors mx-1.5 rounded-xl"
                            >
                                <LogOut size={15} />
                                Keluar Sistem
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const DashboardLayout: React.FC = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-teal-100 selection:text-teal-900">
            <Sidebar
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
            >
                <Header
                    setIsMobileOpen={setIsMobileOpen}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />

                <main className="flex-1 p-6 lg:p-10 overflow-x-hidden max-w-7xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
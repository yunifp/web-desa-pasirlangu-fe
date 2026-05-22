import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer'; // Import Footer mandiri

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-blue-100">
      {/* Pengikat Navigasi Atas */}
      <Navbar />

      {/* Ruang Konten Dinamis Halaman */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Pengikat Navigasi Bawah */}
      <Footer />
    </div>
  );
};
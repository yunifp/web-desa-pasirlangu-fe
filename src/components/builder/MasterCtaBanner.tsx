import React from 'react';
import { Link } from 'react-router-dom';

interface MasterCtaBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl?: string; // Menambahkan prop untuk URL
}

export const MasterCtaBanner: React.FC<MasterCtaBannerProps> = ({
  title, 
  subtitle, 
  buttonText,
  buttonUrl = '#'
}) => {
  const isExternal = buttonUrl.startsWith('http');

  const buttonClasses = "px-6 py-3.5 bg-[#C5A059] hover:bg-white text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest shadow-xl hover:shadow-white/10 transition-all flex-shrink-0 cursor-pointer text-center block w-fit";

  return (
    <section className="py-16 bg-[#0B4028] text-white font-sans select-none overflow-hidden relative border-b border-[#C5A059]/30 w-full">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-2xl text-center md:text-left">
          <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest block bg-white/5 px-2.5 py-1 rounded-md w-max mx-auto md:mx-0 border border-white/10">
            KONSOLIDASI INDUSTRI
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {title || 'Mari Membangun Kedaulatan Rantai Pasok Bersama'}
          </h2>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>
        
        {/* Tombol Dinamis */}
        {isExternal ? (
          <a 
            href={buttonUrl} 
            target="_blank" 
            rel="noreferrer" 
            className={buttonClasses}
          >
            {buttonText || 'Hubungi Kemitraan'}
          </a>
        ) : (
          <Link 
            to={buttonUrl} 
            className={buttonClasses}
          >
            {buttonText || 'Hubungi Kemitraan'}
          </Link>
        )}
      </div>
    </section>
  );
};
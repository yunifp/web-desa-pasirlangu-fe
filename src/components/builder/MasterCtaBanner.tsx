import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface MasterCtaBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl?: string;
}

export const MasterCtaBanner: React.FC<MasterCtaBannerProps> = ({
  title, 
  subtitle, 
  buttonText,
  buttonUrl = '#'
}) => {
  const isExternal = buttonUrl.startsWith('http');

  const buttonClasses = "inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-950 rounded-full text-xs font-black hover:bg-cyan-50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group/cta flex-shrink-0 cursor-pointer w-full md:w-auto";

  return (
    <section className="py-20 bg-blue-950 text-white font-sans select-none overflow-hidden relative border-b-4 border-cyan-500 w-full">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-800/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-4 max-w-2xl text-center md:text-left">
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block bg-white/5 px-4 py-1.5 rounded-full w-max mx-auto md:mx-0 border border-white/10">
            KONSOLIDASI INDUSTRI
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white leading-snug">
            {title || 'Mari Membangun Kedaulatan Rantai Pasok Bersama'}
          </h2>
          <p className="text-sm text-blue-100 font-medium leading-relaxed border-l-4 border-blue-800 pl-4 mx-auto md:mx-0">
            {subtitle}
          </p>
        </div>
        
        {isExternal ? (
          <a href={buttonUrl} target="_blank" rel="noreferrer" className={buttonClasses}>
            <span>{buttonText || 'Hubungi Kemitraan'}</span>
            <ArrowRight size={16} className="text-cyan-500 transform group-hover/cta:translate-x-1 transition-transform" />
          </a>
        ) : (
          <Link to={buttonUrl} className={buttonClasses}>
            <span>{buttonText || 'Hubungi Kemitraan'}</span>
            <ArrowRight size={16} className="text-cyan-500 transform group-hover/cta:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </section>
  );
};
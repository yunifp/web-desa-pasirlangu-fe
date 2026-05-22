// src/components/builder/MasterAboutSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface MasterAboutSectionProps {
  badge?: string;
  headlineHtml?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  imgUrl?: string;
  imgCaption?: string;
}

export const MasterAboutSection: React.FC<MasterAboutSectionProps> = ({
  badge = "Tentang Kami",
  headlineHtml = "<strong class=\"font-black text-slate-950\">PT Perminas (Perusahaan Mineral Nasional)</strong> merupakan badan pengelola investasi strategis yang menangani, mengoptimalkan, dan mengembangkan industrialisasi logam tanah jarang serta mineral kritis Indonesia.",
  description = "Sebagai badan investasi negara di bawah naungan BPI Danantara, kami menyediakan platform terpercaya bagi mitra global untuk mengakses potensi hilirisasi mineral bernilai tinggi yang berdaulat dan berkelanjutan.",
  linkText = "Pelajari Lebih Lanjut",
  linkUrl = "/tentang-kami/profil",
  imgUrl = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop",
  imgCaption = "Site Operasi LTJ"
}) => {
  return (
    <section className="py-24 bg-white border-b border-slate-100 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {badge && (
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest mb-3">
            {badge}
          </span>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-800 tracking-tight leading-snug"
              dangerouslySetInnerHTML={{ __html: headlineHtml }}
            />

            <div className="pt-6 border-t border-slate-100 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-xl">
                {description}
              </p>
              
              {linkText && linkUrl && (
                <Link 
                  to={linkUrl} 
                  className="inline-flex items-center gap-2 text-xs font-black text-[#0B4028] hover:text-[#C5A059] transition-colors group/link"
                >
                  <span>{linkText}</span>
                  <ArrowRight size={14} className="text-[#C5A059] transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 aspect-[4/3] w-full transform hover:-translate-y-1 transition-transform duration-500">
              <img 
                src={imgUrl} 
                alt={imgCaption || "Operasional Perminas"} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {imgCaption && (
                <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                  {imgCaption}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
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
  headlineHtml = "<strong class=\"font-black text-blue-950\">PT Perminas (Perusahaan Mineral Nasional)</strong> merupakan badan pengelola investasi strategis yang menangani, mengoptimalkan, dan mengembangkan industrialisasi logam tanah jarang serta mineral kritis Indonesia.",
  description = "Sebagai badan investasi negara di bawah naungan BPI Danantara, kami menyediakan platform terpercaya bagi mitra global untuk mengakses potensi hilirisasi mineral bernilai tinggi yang berdaulat dan berkelanjutan.",
  linkText = "Pelajari Lebih Lanjut",
  linkUrl = "/tentang-kami/profil",
  imgUrl = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop",
  imgCaption = "Site Operasi LTJ"
}) => {
  return (
    <section className="py-24 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center flex-col-reverse lg:flex-row">
          
          {/* KIRI: Gambar Kapsul Oval (Dulu Kanan) */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-full rounded-tr-none overflow-hidden shadow-2xl border-4 border-blue-50 aspect-[3/4] w-full transform hover:scale-[1.02] transition-transform duration-500">
              <img 
                src={imgUrl} 
                alt={imgCaption || "Operasional Perminas"} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/40 to-transparent" />
            </div>
            
            {/* Takarir Dipindah ke Atas Kanan */}
            {imgCaption && (
              <span className="absolute -top-4 right-4 bg-white border border-blue-100 text-blue-950 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-xl z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" /> {imgCaption}
              </span>
            )}
          </div>

          {/* KANAN: Konten Teks (Dulu Kiri) */}
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            {badge && (
              <span className="text-[11px] font-black text-cyan-600 block uppercase tracking-widest relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
                {badge}
              </span>
            )}

            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-700 tracking-tight leading-snug mt-6"
              dangerouslySetInnerHTML={{ __html: headlineHtml }}
            />

            <div className="pl-6 border-l-4 border-blue-100 space-y-5">
              <p className="text-sm text-slate-600 leading-relaxed font-medium max-w-xl">
                {description}
              </p>
              
              {linkText && linkUrl && (
                <Link 
                  to={linkUrl} 
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-950 text-white rounded-full text-xs font-black hover:bg-blue-900 transition-all group/link shadow-md hover:shadow-lg hover:-translate-y-1"
                >
                  <span>{linkText}</span>
                  <ArrowRight size={16} className="text-cyan-400 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
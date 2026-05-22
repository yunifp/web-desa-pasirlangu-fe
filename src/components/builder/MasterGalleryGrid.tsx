import React from 'react';
import { Camera, Maximize2 } from 'lucide-react';

interface GalleryAssetItem {
  id: string;
  title: string;
  caption: string;
  sizeClass: string;
  imgUrl: string;
}

interface MasterGalleryGridProps {
  badge: string;
  title: string;
  tagline: string;
  images: GalleryAssetItem[];
}

export const MasterGalleryGrid: React.FC<MasterGalleryGridProps> = ({
  badge,
  title,
  tagline,
  images
}) => {
  return (
    <section className="py-20 bg-white border-b border-slate-100 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Tajuk Pengantar Galeri */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
              <Camera size={12} className="text-[#C5A059]" /> {badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
            {tagline}
          </span>
        </div>

        {/* Bento Grid Layout Dinamis */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {images.map((item) => (
            <div 
              key={item.id}
              className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-md group ${item.sizeClass}`}
            >
              <img 
                src={item.imgUrl} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent z-10" />

              <button 
                onClick={() => alert(`Memperbesar citra lapangan: ${item.title}`)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
                title="Perbesar Citra"
              >
                <Maximize2 size={12} />
              </button>

              <div className="absolute bottom-0 inset-x-0 p-6 z-20 space-y-1 pointer-events-none">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight drop-shadow-xs">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed line-clamp-2 drop-shadow-xs">
                  {item.caption}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
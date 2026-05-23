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
    <section className="py-24 bg-white font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b-2 border-slate-100">
          <div className="space-y-6">
            <span className="text-[11px] font-black text-cyan-600 uppercase tracking-widest block flex items-center gap-2 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
              <Camera size={14} className="text-blue-950" /> {badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-700 tracking-tight mt-6">
              {title}
            </h2>
          </div>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
            {tagline}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {images.map((item) => (
            <div 
              key={item.id}
              className={`relative rounded-[2rem] rounded-tr-none overflow-hidden bg-slate-900 border-4 border-blue-50 shadow-md group hover:border-cyan-100 hover:shadow-xl transition-all duration-500 ${item.sizeClass}`}
            >
              <img 
                src={item.imgUrl} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent z-10 mix-blend-multiply" />

              <button 
                onClick={() => alert(`Memperbesar citra lapangan: ${item.title}`)}
                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500/80 backdrop-blur-md flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
                title="Perbesar Citra"
              >
                <Maximize2 size={16} />
              </button>

              <div className="absolute bottom-0 inset-x-0 p-8 z-20 space-y-2 pointer-events-none transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-xs text-blue-100 font-medium leading-relaxed line-clamp-2 drop-shadow-sm border-l-2 border-cyan-400 pl-3">
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
import React, { useEffect, useState } from "react";
import { publicProductApi } from "../../services/publicApi";
import type { Product } from "../../types/cms";
import { ShoppingBag, ArrowRight, X, MessageCircle, Box } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  badge?: string;
  title?: string;
  subtitle?: string;
}

export const MasterProductCatalog: React.FC<Props> = ({
  badge = "PRODUK LOKAL",
  title = "Katalog UMKM Desa",
  subtitle = "Mendukung kedaulatan ekonomi melalui produk unggulan daerah yang terverifikasi."
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await publicProductApi.getPublishedProducts();
        if (res.success) setProducts(res.data);
      } catch (err) {
        console.error("Gagal memuat katalog:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return "";
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    return `${apiBase.replace('/api', '')}${imagePath}`;
  };
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6 flex flex-col items-center">
          <span className="text-[11px] font-black text-cyan-600 uppercase tracking-widest block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
            {badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-light text-slate-700 tracking-tight mt-6">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">{subtitle}</p>}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-50">
            <ShoppingBag size={48} className="text-blue-200 animate-bounce mb-4" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menyiapkan Etalase...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/produk/${p.slug}`)} 
                className="bg-white border-2 border-blue-50 rounded-[2rem] rounded-tr-none flex flex-col overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-cyan-100 transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                  {p.image ? (
                    <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ShoppingBag size={32} /></div>
                  )}
                  {p.stock === 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md">HABIS TERJUAL</div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-800 line-clamp-1 group-hover:text-blue-950 transition-colors">{p.name}</h3>
                    <p className="text-[12px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="mt-6 pt-5 border-t border-blue-50 flex items-center justify-between">
                    <span className="text-base font-black text-cyan-600 group-hover:text-blue-950 transition-colors">Rp {p.price.toLocaleString("id-ID")}</span>
                    <span className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-950 text-blue-900 group-hover:text-cyan-400 flex items-center justify-center transition-all shadow-sm">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-blue-100 bg-blue-50/50 rounded-[2rem] rounded-tr-none">
            <p className="text-slate-500 font-bold text-sm">Belum ada produk yang dipublikasikan.</p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 border-4 border-white/20">

            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">
              <X size={20} />
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-50 relative">
              {selectedProduct.image ? (
                <img src={getImageUrl(selectedProduct.image)} alt={selectedProduct.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300"><ShoppingBag size={64} className="mb-4" /><span>Tidak Ada Foto</span></div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto bg-white flex flex-col">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-black text-blue-900 uppercase tracking-widest mb-6">
                  <Box size={14} className="text-cyan-600" /> Sisa Stok: {selectedProduct.stock} unit
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-slate-800 leading-tight mb-2 tracking-tight">{selectedProduct.name}</h2>
                <div className="text-3xl font-black text-cyan-600 mb-8 tracking-tight">Rp {selectedProduct.price.toLocaleString("id-ID")}</div>

                <div className="prose prose-sm prose-slate border-l-4 border-blue-50 pl-4">
                  <p className="text-slate-600 leading-relaxed text-justify">{selectedProduct.description}</p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4 relative flex justify-center items-center">
                  <span className="bg-white px-3 relative z-10">Pilih Saluran Pembelian</span>
                  <span className="absolute w-full h-px bg-slate-100 left-0"></span>
                </p>

                {selectedProduct.button1Url && (
                  <a href={selectedProduct.button1Url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white py-4 rounded-2xl rounded-tr-none font-black text-sm uppercase tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95">
                    <MessageCircle size={18} /> {selectedProduct.button1Label || "Beli via WhatsApp"}
                  </a>
                )}
                {selectedProduct.button2Url && (
                  <a href={selectedProduct.button2Url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#EE4D2D] hover:bg-[#D74225] text-white py-4 rounded-2xl rounded-tr-none font-black text-sm uppercase tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95">
                    <ShoppingBag size={18} /> {selectedProduct.button2Label || "Beli via Shopee"}
                  </a>
                )}
                {!selectedProduct.button1Url && !selectedProduct.button2Url && (
                  <div className="text-center p-5 bg-blue-50 text-blue-900 rounded-2xl rounded-tr-none text-xs font-bold border border-blue-100">
                    Penjual belum mengatur tautan pembelian untuk produk ini.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
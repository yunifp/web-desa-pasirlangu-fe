/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../../services/product.api';
import type { Product } from '../../types/cms';

import {
  ShoppingBag, MessageCircle, Tag,
  ShieldCheck, Truck, BadgeCheck, Sparkles,
  PackageCheck, ChevronRight
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return '';
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    return `${apiBase.replace('/api', '')}${imagePath}`;
  };

  useEffect(() => {
    if (slug) {
      setLoading(true);
      productApi
        .getByIdOrSlug(slug)
        .then((res) => {
            setProduct(res.data);
            setActiveImage(res.data.image || null);
        })
        .catch((err) => console.error('Gagal memuat detail produk:', err))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 pt-48">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="h-[500px] rounded-[3rem] rounded-tr-none bg-blue-100/50 border border-blue-50"></div>
          <div className="space-y-6 pt-4">
            <div className="h-6 w-48 rounded-xl bg-blue-100/50"></div>
            <div className="h-12 w-full rounded-2xl bg-blue-100/50"></div>
            <div className="h-10 w-64 rounded-xl bg-blue-100/50"></div>
            <div className="space-y-4 pt-6">
              <div className="h-5 rounded-lg bg-blue-100/50"></div>
              <div className="h-5 rounded-lg bg-blue-100/50"></div>
              <div className="h-5 w-5/6 rounded-lg bg-blue-100/50"></div>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-12">
              <div className="h-16 rounded-2xl bg-blue-100/50"></div>
              <div className="h-16 rounded-2xl bg-blue-100/50"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-50 pt-48">
        <div className="w-28 h-28 rounded-[2rem] rounded-tr-none bg-white shadow-xl flex items-center justify-center mb-8 border-4 border-blue-50 animate-bounce">
          <ShoppingBag className="text-cyan-500" size={48} />
        </div>
        <h2 className="text-3xl font-black text-blue-950 mb-4 tracking-tight">Produk Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-10 max-w-md text-sm leading-relaxed">Produk yang kamu cari mungkin sudah ditarik dari etalase, dihapus, atau tautannya tidak lagi valid.</p>
        <Link to="/" className="px-8 py-4 rounded-full bg-blue-950 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-900 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/20 transition-all">
          Kembali ke Katalog Utama
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-24">
      
      {/* =========================================================
          HERO SECTION (Tema Gelap ala Blue-950)
      ========================================================= */}
      <section className="relative w-full bg-blue-950 text-white overflow-hidden font-sans select-none pt-36 pb-32 md:pb-40 border-b-4 border-cyan-500">
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950 to-blue-900 z-0" />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-8">
          
          <nav className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-blue-200/50 uppercase">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Beranda</Link>
            <ChevronRight size={12} />
            <Link to="/katalog" className="hover:text-cyan-400 transition-colors">Katalog Produk</Link>
            <ChevronRight size={12} />
            <span className="text-cyan-400 truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
          </nav>
          
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl rounded-tr-none bg-blue-900 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <ShieldCheck size={14} className="text-cyan-500" /> {product.category?.name || "Produk Unggulan"}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-snug">
              {product.name}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed max-w-2xl line-clamp-2 border-l-2 border-cyan-500 pl-4">
              {product.description}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT (Dengan Efek Overlap -mt-16)
      ========================================================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 -mt-16 md:-mt-28">
        
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          
          {/* IMAGE & GALLERY KIRI */}
          <div className="space-y-6">
            
            {/* Main Image Display */}
            <div className="relative overflow-hidden rounded-[3rem] rounded-tr-none bg-white border-4 border-blue-50 shadow-xl group">
              {activeImage ? (
                <img
                  src={getImageUrl(activeImage)}
                  alt={product.name}
                  className="w-full h-[450px] md:h-[550px] object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="h-[450px] md:h-[550px] flex flex-col items-center justify-center bg-blue-50 text-blue-300">
                  <ShoppingBag size={80} className="mb-6 animate-pulse" />
                  <span className="font-bold text-sm tracking-wide">Tidak Ada Foto Produk</span>
                </div>
              )}
              <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl rounded-tr-none bg-white/90 backdrop-blur-md shadow-lg border border-white/20">
                <Sparkles size={16} className="text-cyan-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-950">Premium Label</span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-4 px-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`aspect-square rounded-2xl rounded-tr-none overflow-hidden border-4 transition-all duration-300 cursor-pointer bg-white ${activeImage === imgUrl ? 'border-cyan-400 shadow-lg scale-110 z-10 relative' : 'border-blue-50 opacity-60 hover:opacity-100 hover:scale-105'}`}
                  >
                    <img src={getImageUrl(imgUrl)} alt={`Galeri ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* FEATURE BOXES */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-white rounded-2xl rounded-tr-none p-5 border-2 border-blue-50 shadow-sm text-center transition-all hover:shadow-lg hover:-translate-y-1 hover:border-cyan-100 group">
                <Truck className="text-cyan-500 mx-auto mb-3 group-hover:scale-110 transition-transform" size={24} />
                <h4 className="font-black text-[11px] uppercase tracking-wider text-slate-800 group-hover:text-blue-950">Pengiriman Cepat</h4>
              </div>
              <div className="bg-white rounded-2xl rounded-tr-none p-5 border-2 border-blue-50 shadow-sm text-center transition-all hover:shadow-lg hover:-translate-y-1 hover:border-cyan-100 group">
                <ShieldCheck className="text-cyan-500 mx-auto mb-3 group-hover:scale-110 transition-transform" size={24} />
                <h4 className="font-black text-[11px] uppercase tracking-wider text-slate-800 group-hover:text-blue-950">Produk Original</h4>
              </div>
              <div className="bg-white rounded-2xl rounded-tr-none p-5 border-2 border-blue-50 shadow-sm text-center transition-all hover:shadow-lg hover:-translate-y-1 hover:border-cyan-100 group">
                <BadgeCheck className="text-cyan-500 mx-auto mb-3 group-hover:scale-110 transition-transform" size={24} />
                <h4 className="font-black text-[11px] uppercase tracking-wider text-slate-800 group-hover:text-blue-950">Seller Trusted</h4>
              </div>
            </div>
          </div>

          {/* CONTENT KANAN */}
          <div className="space-y-8 lg:pt-20">
            
            {/* STOCK & PRICE KARTU */}
            <div className="bg-white rounded-[2rem] rounded-tr-none p-8 md:p-10 border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 shadow-sm mb-6">
                <PackageCheck size={16} className="text-cyan-600" />
                <span className="text-[11px] font-black uppercase tracking-widest text-blue-900">
                  Stok Tersedia : {product.stock} Unit
                </span>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl rounded-tr-none bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                  <Tag className="text-cyan-500" size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">Harga Produk</p>
                  <h2 className="text-4xl font-black text-cyan-600 tracking-tight">
                    Rp {product.price.toLocaleString('id-ID')}
                  </h2>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-[2rem] rounded-tr-none p-8 md:p-10 border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors">
              <h3 className="text-lg font-black text-blue-950 mb-6 flex items-center gap-3 border-b-2 border-blue-50 pb-4">
                <Sparkles size={20} className="text-cyan-500" /> Deskripsi Produk
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                {product.description || 'Belum ada deskripsi spesifik untuk produk ini.'}
              </p>
            </div>

            {/* BENEFIT */}
            <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-[2rem] rounded-tr-none p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <Sparkles className="text-cyan-400" size={24} />
                <h3 className="font-light text-xl md:text-2xl tracking-tight">Kenapa Memilih Produk Ini?</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 relative z-10">
                <div className="bg-white/5 rounded-2xl rounded-tr-none p-6 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-black text-sm mb-2 text-white tracking-wide">Kualitas Premium</h4>
                  <p className="text-xs text-blue-100/80 leading-relaxed font-medium">Produk dipilih dengan standar operasional kualitas terbaik.</p>
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tr-none p-6 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-black text-sm mb-2 text-white tracking-wide">Layanan Responsif</h4>
                  <p className="text-xs text-blue-100/80 leading-relaxed font-medium">Tim operasional siap membantu kebutuhan pembelian Anda.</p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="bg-white rounded-[2rem] rounded-tr-none p-8 md:p-10 border-2 border-cyan-100 shadow-md">
              <div className="flex items-center justify-between mb-8 pb-5 border-b-2 border-blue-50">
                <div>
                  <h3 className="text-xl font-black text-blue-950 tracking-tight">Proses Transaksi</h3>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium uppercase tracking-wider">Pilih platform afiliasi resmi</p>
                </div>
                
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {product.button1Url ? (
                  <a href={product.button1Url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1DA851] active:scale-95 text-white py-4 px-6 rounded-2xl rounded-tr-none font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-md hover:shadow-xl shadow-green-900/10">
                    <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="relative z-10">{product.button1Label || 'WhatsApp'}</span>
                  </a>
                ) : (
                  <div className="py-4 rounded-2xl rounded-tr-none bg-slate-50 text-center text-xs text-slate-400 font-bold border-2 border-dashed border-slate-200 uppercase tracking-widest flex items-center justify-center gap-2">
                    <MessageCircle size={16} /> WA Tidak Aktif
                  </div>
                )}

                {product.button2Url ? (
                  <a href={product.button2Url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden flex items-center justify-center gap-3 bg-[#EE4D2D] hover:bg-[#D74225] active:scale-95 text-white py-4 px-6 rounded-2xl rounded-tr-none font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-md hover:shadow-xl shadow-orange-900/10">
                    <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="relative z-10">{product.button2Label || 'Shopee'}</span>
                  </a>
                ) : (
                  <div className="py-4 rounded-2xl rounded-tr-none bg-slate-50 text-center text-xs text-slate-400 font-bold border-2 border-dashed border-slate-200 uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShoppingBag size={16} /> Marketplace Off
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE CTA FLOATING */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t-2 border-blue-50 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <div className="flex gap-4">
          {product.button1Url && (
            <a href={product.button1Url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl font-black text-xs tracking-widest uppercase shadow-lg active:scale-95 transition-transform">
              <MessageCircle size={18} /> WA
            </a>
          )}
          {product.button2Url && (
            <a href={product.button2Url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#EE4D2D] text-white py-4 rounded-xl font-black text-xs tracking-widest uppercase shadow-lg active:scale-95 transition-transform">
              <ShoppingBag size={18} /> Marketplace
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
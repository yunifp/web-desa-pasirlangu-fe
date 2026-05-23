/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { productApi } from "../../services/product.api";
import type { Product } from "../../types/cms";
import {
    Search, Plus, Edit, Trash2, AlertTriangle, CheckCircle,
    Loader2, ShoppingBag, Tag, Box, ImageIcon, Link2, MessageCircle, X,
    ArrowRight
} from 'lucide-react';

export const ProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [meta, setMeta] = useState({ totalItems: 0, currentPage: 1, totalPages: 1 });

    // Filter & Pagination State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    // Modal States
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // Form State (Tambahan 'images' berupa array)
    const [formData, setFormData] = useState({
        name: "", description: "", price: 0, stock: 0, 
        image: "", 
        images: [] as string[], 
        button1Label: "Beli via WhatsApp", button1Url: "",
        button2Label: "Beli via Shopee", button2Url: "",
        status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED"
    });

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return "";
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
        const serverUrl = apiBase.replace('/api', ''); 
        return `${serverUrl}${imagePath}`;
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await productApi.getAll({
                search: searchTerm,
                status: filterStatus,
                page,
                limit
            });
            if (res.success) {
                setProducts(res.data);
                if (res.meta) setMeta(res.meta);
            }
        } catch (err) {
            console.error("Gagal mengambil data produk:", err);
        } finally {
            setLoading(false);
        }
    };

    // Debounce pencarian
    useEffect(() => {
        const timer = setTimeout(() => { fetchProducts(); }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, filterStatus, page, limit]);

    // Handle Upload Multiple Image
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const files = Array.from(e.target.files);
        
        if (formData.images.length + files.length > 5) {
            alert("Maksimal hanya boleh 5 gambar secara keseluruhan!");
            return;
        }

        const uploadData = new FormData();
        files.forEach(file => {
            uploadData.append("images", file);
        });

        try {
            setUploading(true);
            const res = await productApi.uploadImage(uploadData);
            if (res.success && res.data?.urls) {
                const newUrls = res.data.urls;
                setFormData(prev => {
                    const mainImage = prev.image ? prev.image : newUrls[0];
                    return { 
                        ...prev, 
                        image: mainImage, 
                        images: [...prev.images, ...newUrls].slice(0, 5) 
                    };
                });
            }
        } catch (err) {
            alert("Gagal mengunggah gambar produk.");
        } finally {
            setUploading(false);
            e.target.value = ""; 
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => {
            const newImages = prev.images.filter((_, idx) => idx !== indexToRemove);
            let newMain = prev.image;
            if (prev.image === prev.images[indexToRemove]) {
                newMain = newImages.length > 0 ? newImages[0] : "";
            }
            return { ...prev, images: newImages, image: newMain };
        });
    };

    const setAsMainImage = (imgUrl: string) => {
        setFormData(prev => ({ ...prev, image: imgUrl }));
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: "", description: "", price: 0, stock: 0, image: "", images: [],
            button1Label: "Beli via WhatsApp", button1Url: "",
            button2Label: "Beli via Shopee", button2Url: "",
            status: "DRAFT"
        });
        setShowFormModal(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name, description: product.description,
            price: product.price, stock: product.stock, 
            image: product.image || "", 
            images: product.images || (product.image ? [product.image] : []),
            button1Label: product.button1Label || "Beli via WhatsApp", button1Url: product.button1Url || "",
            button2Label: product.button2Label || "Beli via Shopee", button2Url: product.button2Url || "",
            status: product.status
        });
        setShowFormModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await productApi.update(editingProduct.id, formData);
                setSuccessMessage("Informasi produk berhasil diperbarui!");
            } else {
                await productApi.create(formData);
                setSuccessMessage("Produk dagangan baru berhasil ditambahkan!");
            }
            setShowFormModal(false);
            setIsSuccessModalOpen(true);
            fetchProducts();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal menyimpan data produk.";
            alert(errorMessage);
        }
    };

    const confirmDelete = (id: string) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!deleteTargetId) return;
        try {
            const res = await productApi.delete(deleteTargetId);
            if (res.success) {
                setIsDeleteModalOpen(false);
                setSuccessMessage("Produk dagangan berhasil dihapus!");
                setIsSuccessModalOpen(true);
                fetchProducts();
            }
        } catch (err) {
            alert("Gagal menghapus produk.");
        } finally {
            setDeleteTargetId(null);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'PUBLISHED': return <span className="bg-cyan-50 text-cyan-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-cyan-200/80 uppercase tracking-widest shadow-sm">PUBLISHED</span>;
            case 'DRAFT': return <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-amber-200/80 uppercase tracking-widest shadow-sm">DRAFT</span>;
            case 'ARCHIVED': return <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-slate-200 uppercase tracking-widest shadow-sm">ARCHIVED</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 font-sans animate-in fade-in duration-300 pb-10">
            {/* Header Seksi */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors group">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Manajemen Produk UMKM</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Kelola katalog barang dagangan dan integrasi kontak pembelian langsung.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3.5 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest active:scale-95 group/btn"
                >
                    <Plus size={16} className="text-cyan-400 group-hover/btn:rotate-90 transition-transform" /> Tambah Produk Baru
                </button>
            </div>

            {/* Kontainer Utama */}
            <div className="bg-white rounded-[2rem] rounded-tr-none shadow-sm border-2 border-blue-50 overflow-hidden flex flex-col hover:border-cyan-100 transition-colors">
                
                {/* Bar Filter & Pencarian */}
                <div className="p-6 lg:p-8 border-b border-blue-50 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
                        <input
                            type="text" placeholder="Cari nama produk..."
                            value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all"
                        />
                    </div>
                    <select
                        value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                        className="border border-blue-100 p-3.5 rounded-2xl rounded-tr-none outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 bg-white text-sm font-bold text-slate-700 shadow-sm cursor-pointer transition-all"
                    >
                        <option value="">-- Semua Status Etalase --</option>
                        <option value="PUBLISHED">PUBLISHED (Tampil)</option>
                        <option value="DRAFT">DRAFT (Sembunyi)</option>
                        <option value="ARCHIVED">ARCHIVED (Arsip)</option>
                    </select>
                </div>

                {/* Tabel Konten */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b-2 border-blue-50">
                            <tr>
                                <th className="p-6 whitespace-nowrap">Produk & Deskripsi</th>
                                <th className="p-6 whitespace-nowrap">Harga Jual</th>
                                <th className="p-6 whitespace-nowrap text-center">Stok Sedia</th>
                                <th className="p-6 whitespace-nowrap text-center">Status</th>
                                <th className="p-6 text-center whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-blue-50">
                            {loading ? (
                                <tr><td colSpan={5} className="p-24 text-center text-slate-400 font-bold"><Loader2 className="animate-spin mx-auto mb-4 text-cyan-500" size={32} />Memuat katalog...</td></tr>
                            ) : products.length > 0 ? (
                                products.map(p => (
                                    <tr key={p.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-6 max-w-xs">
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 rounded-2xl rounded-tr-none border border-blue-100 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center shadow-sm">
                                                    {p.image ? (
                                                        <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />) : (
                                                        <ImageIcon size={24} className="text-slate-300" />
                                                    )}
                                                </div>
                                                <div className="truncate py-1">
                                                    <div className="font-black text-slate-800 text-sm truncate group-hover:text-blue-950 transition-colors" title={p.name}>{p.name}</div>
                                                    <div className="text-xs text-slate-500 truncate mt-1">{p.description || "Tidak ada deskripsi"}</div>
                                                    <div className="text-[10px] text-cyan-600 font-mono mt-2 px-2 py-1 bg-cyan-50 rounded-lg w-fit border border-cyan-100">{p.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 font-black text-blue-950 text-sm">
                                                <Tag size={16} className="text-cyan-500" /> Rp {p.price.toLocaleString("id-ID")}
                                            </div>
                                        </td>
                                        <td className="p-6 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 font-black text-slate-700 shadow-sm">
                                                <Box size={16} className={p.stock > 0 ? "text-blue-900" : "text-red-500"} />
                                                {p.stock}
                                            </div>
                                        </td>
                                        <td className="p-6 whitespace-nowrap text-center">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="p-6 whitespace-nowrap">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(p)}
                                                    className="p-2.5 text-blue-900 hover:text-white hover:bg-blue-950 rounded-xl transition-all shadow-sm hover:shadow-md" title="Edit Produk"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(p.id)}
                                                    className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-md" title="Hapus Produk"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (<tr><td colSpan={5} className="p-24 text-center text-slate-400 font-bold bg-slate-50 border-2 border-dashed border-blue-100 rounded-[2rem]">Produk belum tersedia di etalase.</td></tr>)}
                        </tbody>
                    </table>
                </div>

                {/* Footer Paginasi */}
                <div className="flex items-center justify-between px-6 lg:px-8 py-5 bg-white border-t-2 border-blue-50 rounded-b-[2rem] rounded-bl-none">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-l-2 border-cyan-400 pl-3">Total {meta.totalItems || products.length} Produk</span>
                    <div className="flex items-center gap-2 bg-slate-50 border border-blue-100 rounded-2xl rounded-tr-none p-1.5 shadow-sm">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={meta.currentPage <= 1} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Prev</button>
                        <span className="px-4 py-2 text-[11px] font-black text-white bg-blue-950 rounded-xl shadow-sm">{meta.currentPage} / {meta.totalPages || 1}</span>
                        <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={meta.currentPage >= meta.totalPages || meta.totalPages === 0} className="px-4 py-2 text-[11px] font-black disabled:opacity-30 text-slate-700 hover:bg-white rounded-xl transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {/* =========================================================
                MODAL FORM: E-COMMERCE STYLE INPUT
            ========================================================= */}
            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b-2 border-blue-50 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-950 rounded-2xl rounded-tr-none border border-blue-100 shadow-sm"><ShoppingBag size={24} className="text-cyan-600" /></div>
                                <div>
                                    <h2 className="text-xl font-light text-slate-800 leading-tight">
                                        {editingProduct ? "Edit Informasi Produk" : "Tambah Produk UMKM Baru"}
                                    </h2>
                                    <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mt-1">Katalog Etalase Desa</p>
                                </div>
                            </div>
                            <button onClick={() => setShowFormModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 font-black transition-colors shadow-sm">✕</button>
                        </div>

                        {/* Modal Body / Form */}
                        <div className="p-8 overflow-y-auto bg-slate-50/50 flex-1">
                            <form id="productForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

                                {/* Kolom Kiri: Info Dasar & Detail */}
                                <div className="md:col-span-2 space-y-6">
                                    <h3 className="text-sm font-black text-blue-950 border-b-2 border-blue-50 pb-3 inline-flex items-center gap-2">
                                        <Box size={16} className="text-cyan-500" /> Informasi Umum
                                    </h3>
                                    
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Nama Produk *</label>
                                        <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all" placeholder="Contoh: Kripik Singkong Pasirlangu" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Harga Jual (Rp) *</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-600 font-black text-sm">Rp</span>
                                                <input type="number" required value={formData.price} onChange={e => setFormData(p => ({ ...p, price: Number(e.target.value) }))} className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-black text-slate-900 shadow-sm transition-all" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Stok Barang *</label>
                                            <div className="relative">
                                                <Box className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-600" size={16} />
                                                <input type="number" required value={formData.stock} onChange={e => setFormData(p => ({ ...p, stock: Number(e.target.value) }))} className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-black text-slate-900 shadow-sm transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Deskripsi Produk *</label>
                                        <textarea required rows={5} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full p-4 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-medium text-slate-700 shadow-sm transition-all resize-none leading-relaxed" placeholder="Tuliskan spesifikasi, rasa, atau ukuran produk dengan detail..." />
                                    </div>

                                    <h3 className="text-sm font-black text-blue-950 border-b-2 border-blue-50 pb-3 pt-6 flex items-center gap-2">
                                        <Link2 size={16} className="text-cyan-500" /> Konfigurasi Tombol Checkout
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-[2rem] rounded-tr-none border border-blue-50 shadow-sm">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Label Tombol 1</label>
                                            <input type="text" value={formData.button1Label} onChange={e => setFormData(p => ({ ...p, button1Label: e.target.value }))} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none text-xs font-bold transition-colors" />
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 mb-2">Link WhatsApp / Web</label>
                                            <div className="relative">
                                                <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                                <input type="url" value={formData.button1Url} onChange={e => setFormData(p => ({ ...p, button1Url: e.target.value }))} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none text-xs transition-colors" placeholder="https://wa.me/628..." />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Label Tombol 2</label>
                                            <input type="text" value={formData.button2Label} onChange={e => setFormData(p => ({ ...p, button2Label: e.target.value }))} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none text-xs font-bold transition-colors" />
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 mb-2">Link Shopee / Toko</label>
                                            <div className="relative">
                                                <ShoppingBag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                                                <input type="url" value={formData.button2Url} onChange={e => setFormData(p => ({ ...p, button2Url: e.target.value }))} className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none text-xs transition-colors" placeholder="https://shopee.co.id/..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Kolom Kanan: Media & Status */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-blue-950 border-b-2 border-blue-50 pb-3 inline-flex items-center gap-2">
                                        <ImageIcon size={16} className="text-cyan-500" /> Media & Etalase
                                    </h3>

                                    <div className="bg-white p-5 rounded-2xl rounded-tr-none border border-blue-50 shadow-sm">
                                        <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Status Tayang</label>
                                        <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none text-sm font-black text-slate-800 cursor-pointer transition-all">
                                            <option value="DRAFT">DRAFT (Sembunyikan)</option>
                                            <option value="PUBLISHED">PUBLISHED (Tampilkan)</option>
                                            <option value="ARCHIVED">ARCHIVED (Arsipkan)</option>
                                        </select>
                                    </div>

                                    <div className="bg-white p-5 rounded-[2rem] rounded-tr-none border border-blue-50 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Galeri Produk ({formData.images.length}/5)</label>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            {formData.images.map((imgUrl, idx) => (
                                                <div key={idx} className={`relative aspect-square rounded-xl border-2 overflow-hidden group transition-all ${formData.image === imgUrl ? 'border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'border-slate-200'}`}>
                                                    <img src={getImageUrl(imgUrl)} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-blue-950/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2 backdrop-blur-sm">
                                                        {formData.image !== imgUrl && (
                                                            <button type="button" onClick={() => setAsMainImage(imgUrl)} className="text-[9px] font-black uppercase text-white bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 rounded-lg shadow-sm transition-colors">Jadikan Utama</button>
                                                        )}
                                                        <button type="button" onClick={() => removeImage(idx)} className="w-8 h-8 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center shadow-md transition-colors">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    {formData.image === imgUrl && (
                                                        <div className="absolute top-1.5 left-1.5 bg-cyan-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm">UTAMA</div>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            {formData.images.length < 5 && (
                                                <div className="border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50 hover:bg-blue-50 hover:border-cyan-400 transition-colors flex flex-col items-center justify-center relative cursor-pointer aspect-square group">
                                                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploading} title="Unggah gambar" />
                                                    {uploading ? (
                                                        <Loader2 className="animate-spin text-cyan-500" size={24} />
                                                    ) : (
                                                        <>
                                                            <Plus size={24} className="text-cyan-500 mb-1 group-hover:scale-110 transition-transform" />
                                                            <span className="text-[10px] font-black text-blue-900">Tambah</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium bg-blue-50 p-3 rounded-xl border border-blue-100">
                                            Gambar pertama otomatis menjadi cover utama. Anda bisa mengubah cover utama dengan hover dan klik <strong className="text-cyan-600">"Jadikan Utama"</strong>.
                                        </p>
                                    </div>
                                </div>

                            </form>
                        </div>

                        {/* Modal Footer (Action Buttons) */}
                        <div className="px-8 py-5 border-t-2 border-blue-50 bg-white flex justify-end gap-4 rounded-b-[2rem]">
                            <button type="button" onClick={() => setShowFormModal(false)} className="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-100 transition-colors uppercase tracking-wider">Batalkan</button>
                            <button form="productForm" type="submit" className="px-8 py-3 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2">
                                {editingProduct ? 'Simpan Perubahan' : 'Rilis Produk'} <ArrowRight size={16} className="text-cyan-400" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                MODAL DELETE 
            ========================================================= */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-sm shadow-2xl text-center p-8 border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-100">
                            <AlertTriangle className="text-red-500" size={36} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Hapus Produk?</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Aksi ini bersifat mutlak dan produk akan hilang dari etalase.</p>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-black text-xs rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wider">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-md shadow-red-500/20 transition-all active:scale-95 uppercase tracking-wider">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                MODAL SUKSES 
            ========================================================= */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-sm shadow-2xl text-center p-8 border-4 border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-cyan-100">
                            <CheckCircle className="text-cyan-500" size={40} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Berhasil!</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="mt-8 w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-widest active:scale-95">Tutup Panel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
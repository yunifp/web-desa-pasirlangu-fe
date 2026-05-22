import React, { useState } from 'react';
import { Send, MessageSquare, User, Mail, Clock, Smartphone, PenLine } from 'lucide-react';

interface MasterContactFormProps {
  sectionBadge?: string;
  title: string;
  subtitle: string;
  whatsappNumber: string; // Format: 628xxxxxxxxxx (tanpa + atau 0 di depan)
  buttonText?: string;
}

export const MasterContactForm: React.FC<MasterContactFormProps> = ({
  sectionBadge = "LAYANAN INFORMASI",
  title = "Mari Mulai Percakapan",
  subtitle = "Tim representatif kami siap menjawab pertanyaan dan mendiskusikan peluang kolaborasi Anda.",
  whatsappNumber = "6281234567890",
  buttonText = "Kirim via WhatsApp"
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana
    if (!formData.name || !formData.message) {
      alert("Mohon isi nama dan pesan Anda terlebih dahulu.");
      return;
    }

    // Format pesan untuk dikirim ke WhatsApp
    const textMessage = `Halo Perminas,\n\nPerkenalkan saya *${formData.name}* (${formData.email || 'Tanpa Email'}).\n\n${formData.message}\n\nTerima kasih.`;
    
    // Buka URL WhatsApp Web/App
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textMessage)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section className="py-24 bg-white border-b border-slate-100 font-sans select-none w-full">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Kolom Teks Kiri */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black text-[#0B4028] uppercase tracking-widest">
              <MessageSquare size={14} className="text-[#C5A059]"/> {sectionBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              {subtitle}
            </p>
          </div>
          
          <div className="pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Indikator Respon */}
            <div className="space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-[#0B4028] group-hover:border-[#0B4028] transition-all shadow-sm">
                <Clock size={18} className="text-slate-400 group-hover:text-[#C5A059] transition-colors" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Respon Rata-rata</span>
                <span className="text-sm font-black text-slate-800 block">&lt; 30 Menit (Jam Kerja)</span>
              </div>
            </div>

            {/* Indikator Saluran */}
            <div className="space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-[#0B4028] group-hover:border-[#0B4028] transition-all shadow-sm">
                <Smartphone size={18} className="text-slate-400 group-hover:text-[#C5A059] transition-colors" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Saluran Utama</span>
                <span className="text-sm font-black text-slate-800 block">WhatsApp Bisnis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Formulir Kanan */}
        <div className="lg:col-span-7 bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl relative overflow-hidden group">
          {/* Aksen Latar Belakang */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#0B4028]/5 rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C5A059]/10 rounded-tr-full pointer-events-none" />
          
          <form onSubmit={handleWhatsAppSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Input Nama */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Nama Lengkap *</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleChange} required
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:border-[#0B4028] focus:ring-1 focus:ring-[#0B4028] outline-none transition-all placeholder:font-normal placeholder:text-slate-400 shadow-sm"
                  />
                </div>
              </div>

              {/* Input Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Alamat Surel (Opsional)</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="budi@perusahaan.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:border-[#0B4028] focus:ring-1 focus:ring-[#0B4028] outline-none transition-all placeholder:font-normal placeholder:text-slate-400 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Input Pesan */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Pesan / Keperluan *</label>
              <div className="relative">
                <PenLine size={16} className="absolute left-4 top-4 text-slate-400" />
                <textarea 
                  name="message" value={formData.message} onChange={handleChange} required rows={5}
                  placeholder="Tuliskan pertanyaan atau detail keperluan Anda secara singkat di sini..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:border-[#0B4028] focus:ring-1 focus:ring-[#0B4028] outline-none transition-all resize-none placeholder:font-normal placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-2">
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#0B4028] hover:bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all group/btn"
              >
                {buttonText} <Send size={16} className="text-[#C5A059] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
              <p className="text-[10px] text-center text-slate-400 font-medium mt-4">
                Sistem akan secara otomatis membuka aplikasi WhatsApp Anda.
              </p>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};
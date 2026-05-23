import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  User,
  Mail,
  Clock,
  Smartphone,
  PenLine,
} from 'lucide-react';

interface MasterContactFormProps {
  sectionBadge?: string;
  title: string;
  subtitle: string;
  whatsappNumber: string;
  buttonText?: string;
}

export const MasterContactForm: React.FC<MasterContactFormProps> = ({
  sectionBadge = 'LAYANAN INFORMASI',
  title = 'Mari Mulai Percakapan',
  subtitle = 'Tim representatif kami siap menjawab pertanyaan dan mendiskusikan peluang kolaborasi Anda.',
  whatsappNumber = '6281234567890',
  buttonText = 'Kirim via WhatsApp',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.message) {
      alert('Mohon isi nama dan pesan Anda terlebih dahulu.');
      return;
    }

    const textMessage = `Halo Perminas,

Perkenalkan saya *${formData.name}* (${
      formData.email || 'Tanpa Email'
    }).

${formData.message}

Terima kasih.`;

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      textMessage
    )}`;

    window.open(waUrl, '_blank');
  };

  return (
    <section className="relative py-24 bg-[#020817] border-b border-blue-950/40 font-sans select-none overflow-hidden w-full">
      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] rounded-full bg-blue-700/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-5">
            {/* BADGE */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-[10px] font-black text-cyan-300 uppercase tracking-[0.25em] backdrop-blur-md">
              <MessageSquare size={14} className="text-cyan-400" />
              {sectionBadge}
            </span>

            {/* TITLE */}
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {title}
            </h2>

            {/* SUBTITLE */}
            <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed max-w-md">
              {subtitle}
            </p>
          </div>

          {/* INFO BOX */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* RESPONSE */}
            <div className="space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-blue-900/40 flex items-center justify-center group-hover:bg-blue-950 group-hover:border-cyan-400/40 transition-all duration-300 shadow-xl">
                <Clock
                  size={18}
                  className="text-cyan-300 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block">
                  Respon Rata-rata
                </span>

                <span className="text-sm font-black text-white block">
                  &lt; 30 Menit (Jam Kerja)
                </span>
              </div>
            </div>

            {/* CHANNEL */}
            <div className="space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-blue-900/40 flex items-center justify-center group-hover:bg-blue-950 group-hover:border-cyan-400/40 transition-all duration-300 shadow-xl">
                <Smartphone
                  size={18}
                  className="text-cyan-300 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block">
                  Saluran Utama
                </span>

                <span className="text-sm font-black text-white block">
                  WhatsApp Bisnis
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-[32px] border border-blue-900/40 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] p-8 sm:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          {/* GLOW */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />

          <form
            onSubmit={handleWhatsAppSubmit}
            className="relative z-10 space-y-6"
          >
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* NAME */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Nama Lengkap *
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    className="
                      w-full
                      pl-11
                      pr-4
                      py-4
                      bg-slate-900/80
                      border
                      border-blue-900/40
                      rounded-2xl
                      text-sm
                      font-medium
                      text-white
                      placeholder:text-slate-500
                      outline-none
                      transition-all
                      focus:border-cyan-400
                      focus:ring-4
                      focus:ring-cyan-500/10
                      shadow-lg
                      backdrop-blur-md
                    "
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Alamat Surel
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="budi@perusahaan.com"
                    className="
                      w-full
                      pl-11
                      pr-4
                      py-4
                      bg-slate-900/80
                      border
                      border-blue-900/40
                      rounded-2xl
                      text-sm
                      font-medium
                      text-white
                      placeholder:text-slate-500
                      outline-none
                      transition-all
                      focus:border-cyan-400
                      focus:ring-4
                      focus:ring-cyan-500/10
                      shadow-lg
                      backdrop-blur-md
                    "
                  />
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                Pesan / Keperluan *
              </label>

              <div className="relative">
                <PenLine
                  size={16}
                  className="absolute left-4 top-5 text-slate-500"
                />

                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tuliskan pertanyaan atau detail keperluan Anda secara singkat di sini..."
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-4
                    bg-slate-900/80
                    border
                    border-blue-900/40
                    rounded-2xl
                    text-sm
                    font-medium
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    transition-all
                    resize-none
                    focus:border-cyan-400
                    focus:ring-4
                    focus:ring-cyan-500/10
                    shadow-lg
                    backdrop-blur-md
                  "
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="pt-3">
              <button
                type="submit"
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-3
                  px-6
                  py-4
                  rounded-2xl
                  text-xs
                  uppercase
                  tracking-[0.25em]
                  font-black
                  text-white
                  bg-gradient-to-r
                  from-blue-900
                  via-blue-800
                  to-cyan-700
                  hover:from-cyan-600
                  hover:to-blue-700
                  transition-all
                  duration-300
                  shadow-[0_10px_40px_rgba(6,182,212,0.25)]
                  hover:shadow-[0_20px_60px_rgba(6,182,212,0.35)]
                  group/btn
                "
              >
                {buttonText}

                <Send
                  size={16}
                  className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                />
              </button>

              <p className="text-[10px] text-center text-slate-500 font-medium mt-4">
                Sistem akan otomatis membuka aplikasi WhatsApp Anda.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
import React from 'react';

interface MasterSplitHeadlineProps {
  headlineHtml: string;
  narrative: string;
  imgUrl: string;
}

export const MasterSplitHeadline: React.FC<MasterSplitHeadlineProps> = ({
  headlineHtml,
  narrative,
  imgUrl
}) => {
  return (
    <section className="py-24 bg-white font-sans select-none overflow-hidden w-full">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Sisi Kiri: Foto Pilar Vertikal */}
        <div className="md:col-span-5 flex justify-center md:justify-start">
          <div className="relative w-full max-w-[340px] h-[450px] rounded-[2.5rem] rounded-tr-none overflow-hidden shadow-lg border-4 border-blue-50 bg-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <img 
              src={imgUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop'} 
              alt="Ilustrasi Korporat"
              className="w-full h-full object-cover"
            />
            {/* Lapis gradient halus bawah agar lebih menyatu */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Sisi Kanan: Tumpukan Teks Penjelas */}
        <div className="md:col-span-7 space-y-8 text-center md:text-left">
          {/* Judul Utama */}
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-700 tracking-tight leading-snug [&>strong]:font-black [&>strong]:text-blue-950"
            dangerouslySetInnerHTML={{ 
              __html: headlineHtml || '<strong>Danantara Indonesia</strong> dibentuk untuk memperkuat ekonomi negara.' 
            }}
          />

          {/* Paragraf Narasi Pendukung */}
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto md:mx-0 border-l-4 border-cyan-500 pl-5">
            {narrative || 'Dengan mengonsolidasikan aset-aset strategis, kami mentransformasikan manajemen investasi menjadi platform yang terpadu dan dikelola secara profesional.'}
          </p>
        </div>

      </div>
    </section>
  );
};
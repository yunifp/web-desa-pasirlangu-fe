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
    <section className="py-20 bg-white border-b border-slate-100 font-sans select-none overflow-hidden w-full">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        
        {/* Sisi Kiri: Foto Pilar Vertikal */}
        <div className="md:col-span-5 flex justify-center md:justify-start">
          <div className="relative w-full max-w-[320px] h-[400px] rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-100">
            <img 
              src={imgUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop'} 
              alt="Ilustrasi Korporat"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Sisi Kanan: Tumpukan Teks Penjelas */}
        <div className="md:col-span-7 space-y-6 text-center md:text-left">
          {/* Judul Utama (Mendukung tag HTML seperti <strong> untuk penonjolan teks) */}
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-normal text-slate-800 tracking-tight leading-tight [&>strong]:font-bold [&>strong]:text-slate-950"
            dangerouslySetInnerHTML={{ 
              __html: headlineHtml || '<strong>Danantara Indonesia</strong> dibentuk untuk memperkuat ekonomi negara.' 
            }}
          />

          {/* Paragraf Narasi Pendukung */}
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-xl mx-auto md:mx-0">
            {narrative || 'Dengan mengonsolidasikan aset-aset strategis, kami mentransformasikan manajemen investasi menjadi platform yang terpadu dan dikelola secara profesional.'}
          </p>
        </div>

      </div>
    </section>
  );
};
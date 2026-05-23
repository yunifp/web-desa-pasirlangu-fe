import React from 'react';
import { 
  Layers, Settings2, Camera, TrendingUp, Sparkles, Zap, 
  HelpCircle, Megaphone, Sliders, SplitSquareVertical, 
  MessageSquare, FileText,
  Compass,
  Briefcase,
  Newspaper,
  Quote,
  Grid,
  Activity,
  Globe2,
  Award,
  Network,
  Users,
  Target,
  ShoppingBag
} from 'lucide-react';

export interface LibraryTool {
  type: 'hero' | 'elements' | 'flow' | 'workflows' | 'gallery' | 'dashboard' | 'cta' | 'faq' | 'slider_cards' | 'split_headline' | 'post_grid' |'contact_form'| 'hero_banner' | 'about_section' |'core_mandate'|'purpose_section' | 'strategic_sectors' | 'leader_quote' |'newsroom_section' |'esg_impact'| 'global_supply_chain' | 'career_apprenticeship' |'investor_relations' |'profile_hero' | 'mandate_history' | 'core_values_grid' | 'leadership_team' | 'governance_structure' | 'certifications_awards' | 'product_catalog';
  name: string;
  desc: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
  accent: string;
  previewSketch: React.ReactNode;
}

export const LIBRARY_TOOLS: LibraryTool[] = [
  { 
    type: 'hero', 
    name: 'Hero Bleed Gelap', 
    desc: 'Panggung latar penuh pendar zamrud dengan tipografi besar.', 
    icon: Sparkles, 
    color: 'border-[#0B4028] bg-white', 
    accent: 'bg-[#0B4028]',
    previewSketch: (
      <div className="w-full bg-slate-900 rounded-lg p-2.5 border border-slate-800 space-y-1.5 my-2">
        <div className="w-1/3 h-1.5 bg-[#C5A059] rounded-xs" />
        <div className="w-3/4 h-2.5 bg-white rounded-xs" />
        <div className="w-1/2 h-1 bg-slate-500 rounded-xs" />
        <div className="pt-1">
          <div className="w-full h-0.5 bg-gradient-to-r from-[#0B4028] to-[#C5A059]" />
        </div>
      </div>
    )
  },
  { 
    type: 'product_catalog', 
    name: 'Katalog Produk UMKM', 
    desc: 'Grid produk interaktif dengan popup checkout WA/Shopee otomatis.', 
    icon: ShoppingBag, 
    color: 'border-[#0B4028] bg-white', 
    accent: 'bg-[#C5A059]',
    previewSketch: (
      <div className="space-y-1 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
        <div className="w-1/3 h-1.5 bg-[#C5A059] rounded-xs mx-auto" />
        <div className="grid grid-cols-3 gap-1 pt-1">
          <div className="h-6 bg-slate-300 rounded-xs border border-slate-400" />
          <div className="h-6 bg-slate-300 rounded-xs border border-slate-400" />
          <div className="h-6 bg-slate-300 rounded-xs border border-slate-400" />
        </div>
      </div>
    )
  },
  { 
    type: 'elements', 
    name: 'Matriks Pilar Grid', 
    desc: 'Susunan 4 kolom kartu karakteristik dengan pendaran simbol raksasa.', 
    icon: Zap, 
    color: 'border-[#C5A059] bg-white', 
    accent: 'bg-[#C5A059]',
    previewSketch: (
      <div className="grid grid-cols-4 gap-1 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="bg-white p-1 rounded-xs border border-slate-150 shadow-2xs space-y-0.5">
            <div className="w-3 h-3 bg-slate-200 rounded-xs text-[6px] font-black text-center leading-none text-slate-700 flex items-center justify-center">A</div>
            <div className="w-full h-0.5 bg-slate-300 rounded-xs" />
          </div>
        ))}
      </div>
    )
  },
  { 
    type: 'flow', 
    name: 'Alur Ekstraksi Flow', 
    desc: 'Urutan tata kerja vertikal bergradasi dengan lencana angka fase.', 
    icon: Layers, 
    color: 'border-blue-500 bg-white', 
    accent: 'bg-blue-500',
    previewSketch: (
      <div className="space-y-1 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xs border border-slate-150">
          <div className="w-3 h-3 bg-blue-100 rounded-xs text-[6px] font-bold text-center leading-none text-blue-800 flex items-center justify-center">1</div>
          <div className="w-2/3 h-1 bg-slate-700 rounded-xs" />
        </div>
        <div className="text-center leading-none text-[6px] text-slate-400">↓</div>
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xs border border-slate-150">
          <div className="w-3 h-3 bg-blue-100 rounded-xs text-[6px] font-bold text-center leading-none text-blue-800 flex items-center justify-center">2</div>
          <div className="w-1/2 h-1 bg-slate-700 rounded-xs" />
        </div>
      </div>
    )
  },
  { 
    type: 'workflows', 
    name: 'Akordeon Panel Reaktor', 
    desc: 'Daftar tahapan di kiri yang memicu panel gambar pemantauan di kanan.', 
    icon: Settings2, 
    color: 'border-teal-500 bg-white', 
    accent: 'bg-teal-500',
    previewSketch: (
      <div className="grid grid-cols-2 gap-1.5 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
        <div className="space-y-1">
          <div className="bg-[#0B4028] h-3 rounded-xs" />
          <div className="bg-white border border-slate-200 h-3 rounded-xs" />
        </div>
        <div className="bg-slate-900 rounded-xs border border-slate-800 flex flex-col justify-between p-1 h-8">
          <div className="w-1/2 h-0.5 bg-teal-400 rounded-xs" />
          <div className="w-full h-1 bg-white rounded-xs" />
        </div>
      </div>
    )
  },
  { 
    type: 'gallery', 
    name: 'Galeri Bento Fisik', 
    desc: 'Susunan foto udara asimetris dengan efek pembesaran dan takarir melayang.', 
    icon: Camera, 
    color: 'border-purple-500 bg-white', 
    accent: 'bg-purple-500',
    previewSketch: (
      <div className="grid grid-cols-3 gap-1 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
        <div className="col-span-2 h-6 bg-slate-800 rounded-xs relative">
          <div className="absolute bottom-0.5 left-0.5 w-1/2 h-0.5 bg-white rounded-xs" />
        </div>
        <div className="h-6 bg-slate-700 rounded-xs" />
      </div>
    )
  },
  { 
    type: 'dashboard', 
    name: 'Dasbor Metrik Akhir', 
    desc: 'Seksi gelap penutup dengan 3 metrik kunci dan panggilan aksi unduhan.', 
    icon: TrendingUp, 
    color: 'border-slate-800 bg-white', 
    accent: 'bg-slate-800',
    previewSketch: (
      <div className="w-full bg-slate-950 rounded-lg p-2 border border-slate-800 space-y-1 my-2">
        <div className="grid grid-cols-3 gap-1">
          <div className="bg-slate-900 p-1 rounded-xs border border-slate-800 text-center">
            <div className="w-3/4 h-1 bg-[#C5A059] mx-auto rounded-xs" />
          </div>
          <div className="bg-slate-900 p-1 rounded-xs border border-slate-800 text-center">
            <div className="w-3/4 h-1 bg-[#0B4028] mx-auto rounded-xs" />
          </div>
          <div className="bg-slate-900 p-1 rounded-xs border border-slate-800 text-center">
            <div className="w-3/4 h-1 bg-blue-400 mx-auto rounded-xs" />
          </div>
        </div>
      </div>
    )
  },
  { 
    type: 'cta', 
    name: 'CTA Banner Zamrud', 
    desc: 'Spanduk ringkas pemikat aksi berlatar hijau eksklusif dengan tombol emas.', 
    icon: Megaphone, 
    color: 'border-[#0B4028] bg-white', 
    accent: 'bg-[#C5A059]',
    previewSketch: (
      <div className="w-full bg-[#0B4028] rounded-lg p-2 border border-[#C5A059]/30 flex items-center justify-between gap-2 my-2">
        <div className="space-y-1 w-2/3">
          <div className="w-1/3 h-0.5 bg-[#C5A059] rounded-xs" />
          <div className="w-full h-1.5 bg-white rounded-xs" />
        </div>
        <div className="w-1/4 h-3 bg-[#C5A059] rounded-xs flex-shrink-0" />
      </div>
    )
  },
  { 
    type: 'faq', 
    name: 'FAQ Lipat (Akordeon)', 
    desc: 'Daftar pertanyaan dan jawaban ringkas yang dapat dibuka-tutup dengan rapi.', 
    icon: HelpCircle, 
    color: 'border-amber-600 bg-white', 
    accent: 'bg-amber-600',
    previewSketch: (
      <div className="space-y-1 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
        <div className="bg-white p-1 rounded-xs border border-slate-150 flex justify-between items-center">
          <div className="w-2/3 h-1 bg-slate-800 rounded-xs" />
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
        </div>
        <div className="bg-white p-1 rounded-xs border border-slate-150 flex justify-between items-center">
          <div className="w-1/2 h-1 bg-slate-800 rounded-xs" />
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
        </div>
      </div>
    )
  },
  { 
    type: 'slider_cards', 
    name: 'Slider Kartu Sektor', 
    desc: 'Korsel horizontal memajang deretan kartu vertikal berlatar foto dan ikon bulat.', 
    icon: Sliders, 
    color: 'border-emerald-600 bg-white', 
    accent: 'bg-emerald-600',
    previewSketch: (
      <div className="flex gap-1 overflow-hidden my-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
        {[1, 2, 3].map(n => (
          <div key={n} className="w-8 h-12 bg-slate-800 rounded-xs relative flex-shrink-0 border border-slate-700">
            <div className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-white" />
            <div className="absolute bottom-0.5 left-0.5 w-5 h-0.5 bg-white rounded-xs" />
          </div>
        ))}
      </div>
    )
  },
  { 
    type: 'split_headline', 
    name: 'Split Kop Asimetris', 
    desc: 'Tata letak belah menampilkan foto vertikal di kiri dan headline berwibawa di kanan.', 
    icon: SplitSquareVertical, 
    color: 'border-indigo-600 bg-white', 
    accent: 'bg-indigo-600',
    previewSketch: (
      <div className="grid grid-cols-3 gap-1.5 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 items-center">
        <div className="h-10 bg-slate-300 rounded-xs border border-slate-400" />
        <div className="col-span-2 space-y-1">
          <div className="h-1.5 bg-slate-900 rounded-xs" />
          <div className="h-1.5 bg-slate-900 rounded-xs w-5/6" />
          <div className="h-0.5 bg-slate-400 rounded-xs w-2/3 pt-1" />
        </div>
      </div>
    )
  },
  { 
    type: 'post_grid', 
    name: 'Dynamic Post Grid', 
    desc: 'Menampilkan postingan/berita secara dinamis berdasarkan kategori.', 
    icon: Layers, 
    color: 'border-emerald-600 bg-white', 
    accent: 'bg-emerald-600',
    previewSketch: (
      <div className="space-y-1 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
        <div className="w-1/3 h-1.5 bg-[#0B4028] rounded-xs" />
        <div className="grid grid-cols-3 gap-1">
          <div className="h-6 bg-slate-200 rounded-xs" />
          <div className="h-6 bg-slate-200 rounded-xs" />
          <div className="h-6 bg-slate-200 rounded-xs" />
        </div>
      </div>
    )
  },
  { 
    type: 'contact_form', 
    name: 'Formulir Kontak WA', 
    desc: 'Formulir input nama & pesan yang mengarahkan pengguna langsung ke WhatsApp.', 
    icon: MessageSquare, 
    color: 'border-green-600 bg-white', 
    accent: 'bg-[#0B4028]',
    previewSketch: (
      <div className="grid grid-cols-2 gap-2 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 items-center">
        <div className="space-y-1">
          <div className="h-2 bg-slate-800 rounded-xs w-3/4" />
          <div className="h-1 bg-slate-400 rounded-xs w-full" />
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-1.5 space-y-1 shadow-2xs">
          <div className="h-1.5 bg-slate-100 border border-slate-200 rounded-xs" />
          <div className="h-3 bg-slate-100 border border-slate-200 rounded-xs" />
          <div className="h-2 bg-[#0B4028] rounded-xs mt-1" />
        </div>
      </div>
    )
  },
  { 
    type: 'hero_banner', 
    name: 'Hero Slider Dinamis', 
    desc: 'Spanduk layar penuh dengan efek geser otomatis untuk beberapa slide.', 
    icon: Sparkles, 
    color: 'border-[#0B4028] bg-white', 
    accent: 'bg-[#0B4028]',
    previewSketch: (
      <div className="w-full bg-slate-900 rounded-lg p-2.5 border border-slate-800 space-y-1.5 my-2">
        <div className="w-3/4 h-2.5 bg-white rounded-xs" />
        <div className="w-1/2 h-1 bg-slate-500 rounded-xs" />
        <div className="flex gap-1 pt-1 justify-end">
          <div className="w-2 h-0.5 bg-white rounded-xs" />
          <div className="w-1 h-0.5 bg-slate-500 rounded-xs" />
        </div>
      </div>
    )
  },
  { 
    type: 'about_section', 
    name: 'Tentang Kami', 
    desc: 'Seksi narasi dengan headline teks di kiri dan gambar di sebelah kanan.', 
    icon: FileText, 
    color: 'border-slate-800 bg-white', 
    accent: 'bg-slate-800',
    previewSketch: (
      <div className="grid grid-cols-2 gap-2 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 items-center">
        <div className="space-y-1">
          <div className="h-1 bg-slate-400 rounded-xs w-1/3" />
          <div className="h-2 bg-slate-800 rounded-xs w-full" />
          <div className="h-1.5 bg-slate-300 rounded-xs w-5/6" />
        </div>
        <div className="h-10 bg-slate-300 rounded-xs border border-slate-400 relative overflow-hidden">
            <div className="absolute bottom-1 left-1 w-1/2 h-1 bg-white/80 rounded-xs" />
        </div>
      </div>
    )
  },
  {
    type: 'purpose_section',
    name: 'Tujuan (Marquee Vertikal)',
    desc: 'Pilar tujuan strategis dengan animasi teks bergulir vertikal dan grafis globe.',
    icon: Compass,
    color: 'border-slate-800 bg-white',
    accent: 'bg-slate-800',
    previewSketch: (
      <div className="flex gap-2 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
        <div className="w-1/2 space-y-1">
          <div className="h-1 bg-slate-400 w-1/2 rounded-xs" />
          <div className="h-2 bg-slate-800 w-3/4 rounded-xs" />
          <div className="h-2 bg-slate-800 w-full rounded-xs" />
        </div>
        <div className="w-1/2 h-8 bg-slate-300 rounded-full" />
      </div>
    )
  },
  {
    type: 'core_mandate',
    name: 'Core Mandate (Marquee)',
    desc: 'Kartu sektor dengan animasi geser horizontal dan efek hover meluncur yang memukau.',
    icon: Briefcase,
    color: 'border-[#0B4028] bg-white',
    accent: 'bg-[#0B4028]',
    previewSketch: (
      <div className="flex gap-1 overflow-hidden my-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
        {[1, 2, 3].map(n => (
          <div key={n} className="w-8 h-10 bg-[#0B4028] rounded-xs border border-slate-700" />
        ))}
      </div>
    )
  },
  {
    type: 'strategic_sectors',
    name: 'Sektor Strategis',
    desc: 'Grid 4 kolom dengan efek zoom gelap dan ikon melingkar.',
    icon: Grid,
    color: 'border-slate-800 bg-white',
    accent: 'bg-slate-800',
    previewSketch: (
      <div className="grid grid-cols-4 gap-1 my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="bg-slate-900 h-10 rounded-xs border border-slate-700 relative">
            <div className="w-2 h-2 rounded-full bg-white absolute top-1 left-1" />
          </div>
        ))}
      </div>
    )
  },
  {
    type: 'leader_quote',
    name: 'Kutipan Pimpinan',
    desc: 'Spanduk lebar penuh dengan tipografi serif besar dan latar belakang foto.',
    icon: Quote,
    color: 'border-[#C5A059] bg-white',
    accent: 'bg-[#C5A059]',
    previewSketch: (
      <div className="w-full bg-slate-100 h-12 rounded-lg border border-slate-200 relative my-2 overflow-hidden flex justify-end p-2 items-center">
        <div className="w-1/2 bg-slate-300 absolute inset-0 h-full" />
        <div className="w-1/2 space-y-1 z-10 text-right flex flex-col items-end">
          <div className="h-2 w-full bg-slate-800 rounded-xs" />
          <div className="h-2 w-3/4 bg-slate-800 rounded-xs" />
        </div>
      </div>
    )
  },
  {
    type: 'newsroom_section',
    name: 'Pusat Media (Geser)',
    desc: 'Menampilkan berita secara dinamis yang dapat digeser secara horizontal.',
    icon: Newspaper,
    color: 'border-red-600 bg-white',
    accent: 'bg-red-600',
    previewSketch: (
      <div className="my-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 space-y-1">
        <div className="h-1.5 w-1/3 bg-slate-800 rounded-xs" />
        <div className="flex gap-1 overflow-hidden">
          <div className="w-10 h-12 bg-white border border-slate-200 rounded-xs flex-shrink-0" />
          <div className="w-10 h-12 bg-white border border-slate-200 rounded-xs flex-shrink-0" />
          <div className="w-10 h-12 bg-white border border-slate-200 rounded-xs flex-shrink-0" />
        </div>
      </div>
    )
  },
  {
    type: 'esg_impact',
    name: 'Kepatuhan ESG',
    desc: 'Dasbor gelap 3 metrik real-time untuk laporan lingkungan hijau.',
    icon: Activity,
    color: 'border-emerald-700 bg-white',
    accent: 'bg-emerald-700',
    previewSketch: (
      <div className="my-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800 space-y-1">
        <div className="h-1.5 w-1/3 bg-slate-400 rounded-xs mx-auto" />
        <div className="grid grid-cols-3 gap-1">
          <div className="h-8 bg-slate-800 rounded-xs border border-slate-700" />
          <div className="h-8 bg-slate-800 rounded-xs border border-slate-700" />
          <div className="h-8 bg-slate-800 rounded-xs border border-slate-700" />
        </div>
      </div>
    )
  },
  {
    type: 'global_supply_chain',
    name: 'Rantai Pasok Global',
    desc: 'Grafis putih terang dengan daftar tag pin lokasi distribusi dunia.',
    icon: Globe2,
    color: 'border-blue-500 bg-white',
    accent: 'bg-blue-500',
    previewSketch: (
      <div className="my-2 bg-white p-1.5 rounded-lg border border-slate-200 text-center space-y-1">
        <div className="w-4 h-4 mx-auto border border-slate-200 rounded-xs" />
        <div className="h-1.5 w-2/3 bg-slate-800 rounded-xs mx-auto" />
        <div className="flex gap-1 justify-center">
          <div className="w-4 h-2 bg-slate-200 rounded-xs" />
          <div className="w-4 h-2 bg-slate-200 rounded-xs" />
        </div>
      </div>
    )
  },
  {
    type: 'career_apprenticeship',
    name: 'Karier & Magang',
    desc: 'Seksi panggil-aksi (CTA) karir dengan nuansa gelap dan pendaran emas.',
    icon: Briefcase,
    color: 'border-amber-700 bg-white',
    accent: 'bg-amber-700',
    previewSketch: (
      <div className="my-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
        <div className="space-y-1 w-2/3">
          <div className="h-1.5 w-full bg-white rounded-xs" />
          <div className="h-1 w-3/4 bg-slate-500 rounded-xs" />
        </div>
        <div className="w-6 h-3 bg-[#C5A059] rounded-xs" />
      </div>
    )
  },
  {
    type: 'investor_relations',
    name: 'Pita Investor',
    desc: 'Pita tipis minimalis berisi tombol-tombol unduhan dokumen publik/GCG.',
    icon: FileText,
    color: 'border-slate-400 bg-white',
    accent: 'bg-slate-400',
    previewSketch: (
      <div className="my-2 bg-white p-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1 w-1/2">
          <div className="w-3 h-3 bg-slate-200 rounded-xs" />
          <div className="h-1.5 w-full bg-slate-400 rounded-xs" />
        </div>
        <div className="flex gap-0.5">
          <div className="w-4 h-2 bg-slate-200 rounded-xs" />
          <div className="w-4 h-2 bg-slate-200 rounded-xs" />
        </div>
      </div>
    )
  },
  { 
    type: 'profile_hero', 
    name: 'Hero Profil Utama', 
    desc: 'Spanduk lebar penuh dengan teks elegan di sebelah kiri.', 
    icon: Sparkles, 
    color: 'border-[#0B4028] bg-white', 
    accent: 'bg-[#0B4028]',
    previewSketch: (
      <div className="w-full bg-slate-900 rounded-lg p-2.5 space-y-1 my-2"><div className="w-1/3 h-1 bg-[#C5A059]" /><div className="w-3/4 h-2 bg-white" /></div>
    )
  },
  { 
    type: 'mandate_history', 
    name: 'Sejarah & Mandat', 
    desc: 'Penjelasan tekstual di atas video YouTube eksklusif.', 
    icon: Layers, 
    color: 'border-slate-800 bg-white', 
    accent: 'bg-slate-800',
    previewSketch: (
      <div className="space-y-1 my-2 bg-slate-50 p-1.5"><div className="w-1/2 h-2 bg-slate-800" /><div className="w-full h-8 bg-slate-300 rounded" /></div>
    )
  },
  { 
    type: 'core_values_grid', 
    name: 'Visi Misi & Nilai', 
    desc: 'Grid perpaduan kartu Visi Misi yang estetik dan Core Values (AKHLAK).', 
    icon: Target, 
    color: 'border-emerald-700 bg-white', 
    accent: 'bg-emerald-700',
    previewSketch: (
      <div className="grid grid-cols-3 gap-1 my-2 bg-slate-50 p-1"><div className="bg-[#0B4028] h-10 rounded-xs" /><div className="col-span-2 bg-white border h-10 rounded-xs" /></div>
    )
  },
  { 
    type: 'leadership_team', 
    name: 'Jajaran Kepemimpinan', 
    desc: 'Menampilkan jajaran dewan direksi dan komisaris dalam grid vertikal.', 
    icon: Users, 
    color: 'border-blue-600 bg-white', 
    accent: 'bg-blue-600',
    previewSketch: (
      <div className="grid grid-cols-3 gap-1 my-2 bg-slate-50 p-1"><div className="bg-slate-300 h-8 rounded-xs" /><div className="bg-slate-300 h-8 rounded-xs" /><div className="bg-slate-300 h-8 rounded-xs" /></div>
    )
  },
  { 
    type: 'governance_structure', 
    name: 'Struktur Tata Kelola', 
    desc: 'Diagram vertikal sederhana yang menampilkan hierarki korporasi.', 
    icon: Network, 
    color: 'border-slate-800 bg-white', 
    accent: 'bg-slate-800',
    previewSketch: (
      <div className="flex flex-col items-center gap-0.5 my-2 bg-slate-50 p-1"><div className="w-1/2 h-3 bg-slate-900 rounded" /><div className="h-2 w-px bg-slate-400" /><div className="w-2/3 h-4 bg-[#0B4028] rounded" /></div>
    )
  },
  { 
    type: 'certifications_awards', 
    name: 'Sertifikasi & Mutu', 
    desc: 'Grid list untuk memamerkan sertifikasi ISO atau penghargaan Proper.', 
    icon: Award, 
    color: 'border-teal-600 bg-white', 
    accent: 'bg-teal-600',
    previewSketch: (
      <div className="flex gap-1 my-2 bg-slate-50 p-1"><div className="w-1/3 h-6 bg-white border" /><div className="flex-1 grid grid-cols-2 gap-0.5"><div className="bg-white border h-3" /><div className="bg-white border h-3" /></div></div>
    )
  }
];
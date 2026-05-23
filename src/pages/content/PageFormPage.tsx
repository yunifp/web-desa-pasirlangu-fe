/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Plus, Trash2, ArrowLeft, ArrowUp, ArrowDown, Save, Eye, Edit3,
  Zap, Shield, Cpu, Compass, Layers, Award, Image, Upload
} from 'lucide-react';

import { LIBRARY_TOOLS } from '../../components/builder/builderConstants';
import type { LibraryTool } from '../../components/builder/builderConstants';

import { MasterHero } from '../../components/builder/MasterHero';
import { MasterElementsGrid } from '../../components/builder/MasterElementsGrid';
import { MasterExtractionFlow } from '../../components/builder/MasterExtractionFlow';
import { MasterRefiningWorkflows } from '../../components/builder/MasterRefiningWorkflows';
import { MasterGalleryGrid } from '../../components/builder/MasterGalleryGrid';
import { MasterImpactDashboard } from '../../components/builder/MasterImpactDashboard';
import { MasterCtaBanner } from '../../components/builder/MasterCtaBanner';
import { MasterFaqAccordion } from '../../components/builder/MasterFaqAccordion';
import { MasterCarouselCards } from '../../components/builder/MasterCarouselCards';
import { MasterSplitHeadline } from '../../components/builder/MasterSplitHeadline';
import { MasterPostGrid } from '../../components/builder/MasterPostGrid';
import { MasterContactForm } from '../../components/builder/MasterContactForm';
import { MasterHeroBannerPage } from '../../components/builder/MasterHeroBannerPage';
import { MasterAboutSection } from '../../components/builder/MasterAboutSection';
import { MasterPurposeSection } from '../../components/builder/MasterPurposeSection';
import { MasterCoreMandate } from '../../components/builder/MasterCoreMandate';
import { MasterStrategicSectors } from '../../components/builder/MasterStrategicSectors';
import { MasterLeaderQuote } from '../../components/builder/MasterLeaderQuote';
import { MasterNewsroomSection } from '../../components/builder/MasterNewsroomSection';
import { MediaPickerModal } from '../../components/media/MediaPickerModal';
import { MasterEsgImpactSection } from '../../components/builder/MasterEsgImpactSection';
import { MasterGlobalSupplyChain } from '../../components/builder/MasterGlobalSupplyChain';
import { MasterCareerApprenticeship } from '../../components/builder/MasterCareerApprenticeship';
import { MasterInvestorRelationsStripe } from '../../components/builder/MasterInvestorRelationsStripe';
import { MasterProfileHero } from '../../components/builder/MasterProfileHero';
import { MasterMandateHistory } from '../../components/builder/MasterMandateHistory';
import { MasterCoreValuesGrid } from '../../components/builder/MasterCoreValuesGrid';
import { MasterLeadershipTeam } from '../../components/builder/MasterLeadershipTeam';
import { MasterGovernanceStructure } from '../../components/builder/MasterGovernanceStructure';
import { MasterCertificationsAwards } from '../../components/builder/MasterCertificationsAwards';
import { MasterProductCatalog } from '../../components/builder/MasterProductCatalog';


interface BlockItem {
  id: string;
  type: LibraryTool['type'] | 'post_grid' | 'contact_form' | 'hero_banner' | 'about_section' | 'purpose_section' | 'core_mandate' | 'strategic_sectors' | 'leader_quote' | 'newsroom_section' | 'esg_impact' | 'global_supply_chain' | 'career_apprenticeship' | 'investor_relations' | 'profile_hero' | 'mandate_history' | 'core_values_grid' | 'leadership_team' | 'governance_structure' | 'certifications_awards';
  data: any;
}

interface ActiveMediaTarget {
  blockId: string;
  fieldKey: string;
  isSubItem: boolean;
  subItemIndex?: number;
  subItemArrayKey?: string;
}

export const PageFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [activeTabMode, setActiveTabMode] = useState<'FORM' | 'PREVIEW'>('FORM');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [templateType, setTemplateType] = useState('Layout Halaman Statis');

  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<ActiveMediaTarget | null>(null);
  const [categories, setCategories] = useState<{ name: string, slug: string }[]>([]);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data?.data || []));
  }, []);

  const sanitizeUrl = (url?: string) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) {
      return cleanUrl;
    }
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/api$/, '').replace(/\/$/, '');
    const prefix = cleanUrl.startsWith('/') ? '' : '/';
    return `${baseUrl}${prefix}${cleanUrl}`;
  };

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      api.get(`/pages/${id}`).then(res => {
        const d = res.data?.data || {};
        setTitle(d.title || '');
        setSlug(d.slug || '');
        setStatus(d.status || 'DRAFT');
        setTemplateType(d.templateType || 'Layout Halaman Statis');

        if (d.content) {
          try {
            const parsed = JSON.parse(d.content);
            if (Array.isArray(parsed)) {
              setBlocks(parsed);
            }
          } catch (err) {
            console.error(err);
          }
        }
      }).finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  const getMappedIcon = (index: number) => {
    const icons = [Zap, Shield, Cpu, Compass, Layers, Award];
    return icons[index % icons.length];
  };

  const addBlock = (type: BlockItem['type']) => {
    const newId = `${type}-${Date.now()}`;
    let defaultData: any = {};

    switch (type) {
      case 'product_catalog':
        defaultData = { badge: "PRODUK LOKAL", title: "Katalog UMKM Desa", subtitle: "Mendukung kedaulatan ekonomi melalui produk unggulan daerah yang terverifikasi." };
        break;
      case 'hero':
        defaultData = { badge: 'INFORMASI TERKINI', title: title || 'Judul Utama Halaman', desc: 'Deskripsi singkat atau rangkuman eksekutif.', breadcrumb: title || 'Halaman Kustom', imgUrl: '' };
        break;
      case 'elements':
        defaultData = { section: 'KLASTER INFORMASI', title: 'Matriks Pilar Utama', desc: 'Penampang data terstruktur yang dikelompokkan ke dalam kartu-kartu rapi.', items: [{ symbol: "A1", name: "Item Pertama", number: "CODE_01", desc: "Penjelasan fungsionalitas item pertama." }, { symbol: "A2", name: "Item Kedua", number: "CODE_02", desc: "Penjelasan fungsionalitas item kedua." }] };
        break;
      case 'flow':
        defaultData = { badge: 'ALUR TERSTRUKTUR', title: 'Tahapan Proses Operasional', subtitle: 'Penjelasan vertikal mengenai urutan langkah kerja.', steps: [{ phase: "01", title: "Langkah Awal", desc: "Rincian eksekusi tahapan pertama." }, { phase: "02", title: "Langkah Lanjutan", desc: "Rincian eksekusi tahapan kedua." }] };
        break;
      case 'workflows':
        defaultData = { badge: 'ARSITEKTUR KERJA', title: 'Dasbor Akordeon Terpadu', desc: 'Mekanisme interaktif yang menyajikan parameter detail di sisi kanan layar.', items: [{ title: "Tahap Inti 1", subtitle: "Sub-keterangan Tahap 1", desc: "Ulasan komprehensif mengenai cara kerja reaktor atau fasilitas.", metric: "Parameter: Optimal", efficiency: "Keluaran: 99%", imgUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop" }] };
        break;
      case 'gallery':
        defaultData = { badge: 'GALERI LAPANGAN', title: 'Dokumentasi Visual Aset', tagline: 'Terverifikasi BUMN', images: [{ id: "img-1", title: "Fasilitas Utama", caption: "Takarir singkat mengenai kegiatan di area tersebut.", sizeClass: "md:col-span-8 md:row-span-2 h-[380px]", imgUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop" }] };
        break;
      case 'dashboard':
        // 👇 PERBAIKAN 1: Tambahkan default data buttonUrl 👇
        defaultData = { section: 'DAMPAK STRATEGIS', title: 'Prospeksi Pencapaian Kapasitas', badge: 'Metrik 2030', metric1: { label: "Kapasitas A", value: "10.000", unit: "MT", subtitle: "Output Tahunan", desc: "Penjelasan metrik pertama." }, metric2: { label: "Kedaulatan B", value: "99%", unit: "Purity", subtitle: "Tingkat Keberhasilan", desc: "Penjelasan metrik kedua." }, metric3: { label: "Distribusi C", value: "50%", unit: "Share", subtitle: "Kontribusi Ekspor", desc: "Penjelasan metrik ketiga." }, disclaimerTitle: "Catatan Keterbukaan Publik", disclaimerDesc: "Penjelasan regulasi atau komitmen integrasi rantai pasok.", buttonText: "Unduh Dokumen", buttonUrl: "#" };
        break;
      case 'cta':
        defaultData = { title: "Mari Membangun Kedaulatan Rantai Pasok Bersama", subtitle: "Bergabung sebagai mitra strategis dalam hilirisasi mineral kritis nusantara.", buttonText: "Hubungi Kemitraan", buttonUrl: "/p/kemitraan" };
        break;
      case 'faq':
        defaultData = { title: "Pertanyaan yang Sering Diajukan", subtitle: "Menjawab prosedur dan tata kelola di bawah supervisi korporat.", faqs: [{ q: "Bagaimana mekanisme penyaluran material?", a: "Penyaluran dikendalikan melalui sistem kuota terpusat." }, { q: "Apakah terbuka peluang kemitraan?", a: "Tentu, kami menyambut baik kemitraan rantai pasok global." }] };
        break;
      case 'slider_cards':
        defaultData = { sectionLabel: "Sektor Strategis", sectionTitle: "Sektor-sektor utama yang menopang rencana kami", cards: [{ title: "Energi Terbarukan", imgUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop", iconType: "zap", linkUrl: "#" }, { title: "Mineral Kritis", imgUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop", iconType: "shield", linkUrl: "#" }] };
        break;
      case 'split_headline':
        defaultData = { headlineHtml: "<strong>Danantara Indonesia</strong> dibentuk untuk memperkuat ekonomi negara.", narrative: "Dengan mengonsolidasikan aset-aset strategis, kami mentransformasikan manajemen investasi menjadi platform yang terpadu dan dikelola secara profesional.", imgUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=600&auto=format&fit=crop" };
        break;
      case 'post_grid':
        defaultData = { sectionTitle: "Arsip Berita & Publikasi", categorySlug: "", limit: 3 };
        break;
      case 'contact_form':
        defaultData = { sectionBadge: "JALUR CEPAT KEMITRAAN", title: "Hubungi Tim Representatif Kami", subtitle: "Silakan isi formulir di bawah ini untuk memulai percakapan langsung via WhatsApp.", whatsappNumber: "6281234567890", buttonText: "Kirim Pesan via WhatsApp" };
        break;
      case 'hero_banner':
        defaultData = {
          slides: [
            { title: "Mendorong transformasi...", desc: "Mengakselerasi lompatan industrialisasi...", image: "" }
          ],
          quickLinks: [
            { label: "Tentang Danantara Indonesia", url: "/tentang-kami/profil" },
            { label: "Cara Kami Mengelola Aset", url: "/investor/keuangan" },
            { label: "Cara Kami Berinvestasi", url: "/investor/prospektus" }
          ]
        };
        break;
      case 'about_section':
        defaultData = {
          badge: "Tentang Kami",
          headlineHtml: "<strong class=\"font-black text-slate-950\">PT Perminas (Perusahaan Mineral Nasional)</strong> merupakan badan pengelola investasi strategis yang menangani, mengoptimalkan, dan mengembangkan industrialisasi logam tanah jarang serta mineral kritis Indonesia.",
          description: "Sebagai badan investasi negara di bawah naungan BPI Danantara, kami menyediakan platform terpercaya bagi mitra global untuk mengakses potensi hilirisasi mineral bernilai tinggi yang berdaulat dan berkelanjutan.",
          linkText: "Pelajari Lebih Lanjut",
          linkUrl: "/tentang-kami/profil",
          imgUrl: "",
          imgCaption: "Site Operasi LTJ"
        };
        break;
      case 'purpose_section':
        defaultData = {
          badge: "Tujuan Kami",
          description: "Mengamankan rantai pasok cadangan kritis nusantara guna menopang kemakmuran rakyat serta kedaulatan industri teknologi tinggi di ranah persaingan global.",
          bgImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
          items: [
            { text: "Optimasi Sumber Daya" },
            { text: "Kemakmuran Indonesia" },
            { text: "Kehidupan Berkelanjutan" }
          ]
        };
        break;
      case 'core_mandate':
        defaultData = {
          badge: "Lingkup Kerja",
          titleHtml: "Melalui pendekatan terintegrasi, <strong class=\"font-black text-slate-950\">Perminas</strong> memastikan cadangan mineral strategis negara dikelola secara efektif, dimurnikan, dan diindustrialisasikan demi kemajuan bangsa.",
          linkText: "Baca Selengkapnya",
          linkUrl: "/tentang-kami/profil",
          cards: [
            {
              title: "Perminas Asset\nManagement",
              desc: "Mengembangkan fasilitas pemurnian terpadu (smelter) dan pencucian awal LTJ berkelas dunia dengan tumpukan teknologi berefisiensi tinggi.",
              bgImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
              isDefaultImg: "true",
              vectorIcon: "🏭",
              vectorText: "Fasilitas",
              linkUrl: "#"
            },
            {
              title: "Perminas Investment\nManagement",
              desc: "Berinvestasi pada sektor-sektor prioritas hilirisasi logam kritis dan material magnet permanen berdampak tinggi bagi rantai pasok global.",
              bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
              isDefaultImg: "false",
              vectorIcon: "📈",
              vectorText: "Hilirisasi",
              linkUrl: "#"
            }
          ]
        };
        break;
      case 'strategic_sectors':
        defaultData = {
          badge: "Sektor Strategis",
          title: "Sektor-sektor utama yang menopang rencana kami",
          cards: [
            { title: "Logam Tanah Jarang", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2000&auto=format&fit=crop", icon: "⚡", url: "/operasi/logam-tanah-jarang" },
            { title: "Mineral Kritis", image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=2070&auto=format&fit=crop", icon: "⛏️", url: "/operasi/mineral-kritis" }
          ]
        };
        break;
      case 'leader_quote':
        defaultData = {
          quoteHtml: "“Semua <strong class=\"font-black text-[#0B4028]\">kekayaan</strong> kita harus <strong class=\"font-black text-[#0B4028]\">sebesar-besarnya</strong> untuk kepentingan dan <strong class=\"font-black text-[#0B4028]\">kemakmuran</strong> keluarga.”",
          authorTitle: "Amanat Pimpinan Eksekutif",
          authorSubtitle: "PT Perusahaan Mineral Nasional (Perminas)",
          bgImage: ""
        };
        break;
      case 'newsroom_section':
        defaultData = {
          badge: "Pusat Media",
          title: "Siaran Pers & Publikasi Resmi",
          linkText: "Lihat Semua",
          linkUrl: "/p/siaran-pers",
          categorySlug: "",
          limit: 4
        };
        break;
      case 'esg_impact':
        defaultData = {
          badge: "Kepatuhan ESG",
          title: "Dasbor Kelestarian Lingkungan Real-Time",
          description: "Transparansi parameter baku mutu air limbah dan kualitas udara di seluruh kawasan.",
          metrics: [
            { tag: "Audit Danantara", value: "94.5%", title: "Keberhasilan Reklamasi", desc: "Pemulihan tajuk kanopi vegetasi", iconType: "leaf" },
            { tag: "Baku Mutu Air", value: "pH 6.8", title: "Netralisasi Limbah", desc: "Kadar asam tersaring optimal", iconType: "droplet" },
            { tag: "Indeks Udara", value: "12 µg/m³", title: "Partikulat Terkendali", desc: "Sistem penyiram kabut beroperasi", iconType: "wind" }
          ]
        };
        break;
      case 'global_supply_chain':
        defaultData = {
          badge: "Jaringan Distribusi Kritis",
          title: "Simpul Utama Rantai Pasok Teknologi Global",
          descriptionHtml: "Produksi material olahan <strong class=\"text-slate-900 font-black\">Rare Earth Oxide (REO)</strong> Perminas ditransmisikan secara langsung.",
          regions: [{ name: "Asia Pasifik" }, { name: "Uni Eropa" }, { name: "Amerika Utara" }]
        };
        break;
      case 'career_apprenticeship':
        defaultData = {
          badge: "Rekrutmen BUMN",
          title: "Karier Profesional & Magang Vokasi",
          description: "Bergabunglah bersama kami membangun kedaulatan industri hilir mineral.",
          buttonText: "Eksplorasi Posisi",
          buttonUrl: "/karier/lowongan"
        };
        break;
      case 'investor_relations':
        defaultData = {
          title: "Keterbukaan Informasi Publik",
          subtitle: "Sekretariat & Hubungan Investor",
          documents: [
            { title: "Annual Report 2025", url: "#" },
            { title: "Piagam GCG Korporat", url: "#" }
          ]
        };
        break;
      case 'profile_hero':
        defaultData = { breadcrumb: "Profil Perusahaan", badge: "BUMN Strategis Danantara", title: "PT Perusahaan Mineral Nasional", description: "Entitas berdaulat penggerak hilirisasi logam tanah jarang dan mineral kritis." };
        break;
      case 'mandate_history':
        defaultData = { titleHtml: "Kami berpegang pada <strong class=\"font-black text-[#0B4028]\">tujuan</strong>...", desc1: "Penjelasan paragraf pertama.", desc2: "Penjelasan pelengkap.", youtubeId: "BMyw1deZ17c", watermark: "PT Perminas", quote: "Membangun kemakmuran bangsa." };
        break;
      case 'core_values_grid':
        defaultData = { visionBadge: "Cita-Cita Utama", visionTitle: "Visi Perminas", visionDesc: "Menjadi korporasi pengelola mineral strategis berkelas dunia.", visionTarget: "Kedaulatan Penuh", missionBadge: "Peta Jalan", missionTitle: "Misi Strategis", missions: [{ text: "Pembangunan kemandirian fasilitas pemurnian." }], valuesBadge: "Budaya Kerja", valuesTitle: "Nilai-Nilai Inti", valuesDesc: "Prinsip moral Perminas.", coreValues: [{ title: "Amanah", desc: "Memegang teguh kepercayaan.", iconType: "shield" }] };
        break;
      case 'leadership_team':
        defaultData = { badge: "Kepemimpinan Korporat", title: "Jajaran Manajemen PT Perminas", period: "Periode 2025 - 2030", commissaries: [{ name: "Prof. Irwan", role: "Komisaris Utama", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop", url: "" }], directors: [{ name: "Ir. Ahmad", role: "Direktur Utama", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop", url: "" }] };
        break;
      case 'governance_structure':
        defaultData = { badge: "Skema Hierarki", title: "Struktur Organisasi", desc: "Garis komando pertanggungjawaban mutlak.", topBadge: "Supervisi", topTitle: "BPI Danantara", topDesc: "Badan Pengelola", midTitle: "Kepala Desa", midDesc: "Pengawas", botBadge: "Pelaksana", botTitle: "Direksi PT Perminas", botDesc: "Mengelola seluruh klaster" };
        break;
      case 'certifications_awards':
        defaultData = { title: "Sertifikasi Mutu", desc: "Pencapaian kepatuhan standar internasional.", certs: [{ title: "ISO 9001:2015", desc: "Sistem Manajemen Mutu" }] };
        break;
    }

    setBlocks([...blocks, { id: newId, type, data: defaultData }]);
    setActiveTabMode('FORM');
  };

  const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const updated = [...blocks];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setBlocks(updated);
  };

  const updateBlockData = (blockId: string, updatedData: any) => setBlocks(blocks.map(b => b.id === blockId ? { ...b, data: updatedData } : b));
  const addBlockSubItem = (blockId: string, arrayKey: string, defaultSubItem: any) => setBlocks(blocks.map(b => b.id === blockId ? { ...b, data: { ...b.data, [arrayKey]: [...(Array.isArray(b.data[arrayKey]) ? b.data[arrayKey] : []), defaultSubItem] } } : b));
  const removeBlockSubItem = (blockId: string, arrayKey: string, subIndex: number) => setBlocks(blocks.map(b => { if (b.id === blockId) { const currentArr = Array.isArray(b.data[arrayKey]) ? [...b.data[arrayKey]] : []; currentArr.splice(subIndex, 1); return { ...b, data: { ...b.data, [arrayKey]: currentArr } }; } return b; }));
  const updateBlockSubItem = (blockId: string, arrayKey: string, subIndex: number, newSubObj: any) => setBlocks(blocks.map(b => { if (b.id === blockId) { const currentArr = Array.isArray(b.data[arrayKey]) ? [...b.data[arrayKey]] : []; currentArr[subIndex] = newSubObj; return { ...b, data: { ...b.data, [arrayKey]: currentArr } }; } return b; }));

  const handleOpenMediaLibrary = (target: ActiveMediaTarget) => {
    setActiveMediaTarget(target);
    setIsMediaModalOpen(true);
  };

  const handleMediaSelected = (fileUrl: string) => {
    if (!activeMediaTarget || !fileUrl) return;
    const { blockId, fieldKey, isSubItem, subItemIndex, subItemArrayKey } = activeMediaTarget;
    if (isSubItem && subItemArrayKey && subItemIndex !== undefined) {
      setBlocks(prev => prev.map(b => {
        if (b.id === blockId) {
          const currentArr = Array.isArray(b.data[subItemArrayKey]) ? [...b.data[subItemArrayKey]] : [];
          if (currentArr[subItemIndex]) {
            currentArr[subItemIndex] = { ...currentArr[subItemIndex], [fieldKey]: fileUrl };
          }
          return { ...b, data: { ...b.data, [subItemArrayKey]: currentArr } };
        }
        return b;
      }));
    } else {
      setBlocks(prev => prev.map(b => {
        if (b.id === blockId) {
          return { ...b, data: { ...b.data, [fieldKey]: fileUrl } };
        }
        return b;
      }));
    }
    setIsMediaModalOpen(false);
    setActiveMediaTarget(null);
  };

  const handleUploadImageLocal = async (
    e: React.ChangeEvent<HTMLInputElement>,
    blockId: string,
    fieldKey: string,
    isSubItem: boolean = false,
    subItemIndex: number = 0,
    subItemArrayKey: string = ''
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const uploadedUrl = res.data?.url || res.data?.fileUrl || res.data?.data?.url || res.data?.data?.fileUrl || '';
      if (!uploadedUrl) {
        alert("Server berhasil merespons, namun gagal mengekstrak tautan URL file.");
        return;
      }
      if (isSubItem) {
        setBlocks(prev => prev.map(b => {
          if (b.id === blockId) {
            const currentArr = Array.isArray(b.data[subItemArrayKey]) ? [...b.data[subItemArrayKey]] : [];
            if (currentArr[subItemIndex]) {
              currentArr[subItemIndex] = { ...currentArr[subItemIndex], [fieldKey]: uploadedUrl };
            }
            return { ...b, data: { ...b.data, [subItemArrayKey]: currentArr } };
          }
          return b;
        }));
      } else {
        setBlocks(prev => prev.map(b => {
          if (b.id === blockId) {
            return { ...b, data: { ...b.data, [fieldKey]: uploadedUrl } };
          }
          return b;
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi saat mengunggah berkas media.");
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  const handleSavePage = async () => {
    if (!title.trim()) { alert("Judul Halaman wajib diisi!"); return; }
    setIsLoading(true);
    const payload = { title, slug: slug.trim() || undefined, status, templateType, content: JSON.stringify(blocks) };
    try {
      if (isEditMode) { await api.put(`/pages/${id}`, payload); alert("Halaman berhasil diperbarui!"); }
      else { await api.post(`/pages`, payload); alert("Halaman baru berhasil dirilis!"); }
      navigate('/pages');
    } catch (err) { console.error(err); alert("Terjadi kesalahan sistem saat menyimpan data."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32 select-none relative">
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => { setIsMediaModalOpen(false); setActiveMediaTarget(null); }}
        onSelect={(fileUrl: string, _type: 'IMAGE' | 'VIDEO' | 'DOCUMENT') => handleMediaSelected(fileUrl)}
      />
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/pages')} className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0B4028] transition-colors cursor-pointer"><ArrowLeft size={16} /> <span>Kembali ke Arsip</span></button>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setActiveTabMode('FORM')} className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${activeTabMode === 'FORM' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}><Edit3 size={13} /> <span>Isi Konten</span></button>
            <button onClick={() => setActiveTabMode('PREVIEW')} className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${activeTabMode === 'PREVIEW' ? 'bg-[#0B4028] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}><Eye size={13} className={activeTabMode === 'PREVIEW' ? 'text-[#C5A059]' : ''} /> <span>Live Preview</span></button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 hidden sm:inline-block">{blocks.length} Blok</span>
            <button onClick={handleSavePage} disabled={isLoading} className="px-5 py-2.5 bg-[#0B4028] hover:bg-[#0B4028]/90 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"><Save size={14} className="text-[#C5A059]" /> <span>{isLoading ? 'Menyimpan...' : 'Simpan Halaman'}</span></button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 pt-8">
        {activeTabMode === 'FORM' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xs font-black text-[#0B4028] uppercase tracking-widest border-b border-slate-100 pb-3">Identitas & Atribut</h2>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Headline Utama *</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Fasilitas Pengolahan" className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-xl px-3 py-2 bg-white" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Slug</label><input type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="otomatis-jika-kosong" className="w-full font-mono text-xs text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-white" /></div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 uppercase block">Status Edar</label><select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full text-xs font-bold border border-slate-200 rounded-lg p-1.5 bg-white"><option value="DRAFT">DRAFT</option><option value="PUBLISHED">PUBLISHED</option></select></div>
                  <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 uppercase block">Pengikat Layout</label><select value={templateType} onChange={e => setTemplateType(e.target.value)} className="w-full text-xs font-bold border border-slate-200 rounded-lg p-1.5 bg-white truncate"><option value="Layout Halaman Statis">Halaman Modular</option><option value="Layout Kustom Default">Pola Bawaan</option></select></div>
                </div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="space-y-1"><h2 className="text-xs font-black text-[#0B4028] uppercase tracking-widest">Pustaka Komponen</h2><p className="text-[11px] text-slate-500 font-medium">Klik miniatur untuk menambah seksi baru.</p></div>
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {LIBRARY_TOOLS.map((tool, idx) => {
                    const IconComp = tool.icon;
                    const isDark = tool.color.includes('bg-slate-900');
                    return (
                      <button key={idx} onClick={() => addBlock(tool.type)} className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 active:scale-95 shadow-2xs flex flex-col justify-between relative overflow-hidden group cursor-pointer ${tool.color}`}>
                        <div className={`absolute left-0 inset-y-0 w-1.5 ${tool.accent}`} />
                        <div className="flex items-start gap-3 w-full"><div className={`p-2 rounded-lg flex-shrink-0 ${isDark ? 'bg-white/10 text-[#C5A059]' : 'bg-white text-slate-700 border border-slate-150'}`}><IconComp size={16} /></div><div className="space-y-0.5 flex-1 pr-2"><span className={`text-xs font-black block tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{tool.name}</span><p className={`text-[10px] leading-relaxed line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tool.desc}</p></div></div>
                        {tool.previewSketch}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"><div className="w-4 h-4 rounded-full bg-[#0B4028] text-white flex items-center justify-center"><Plus size={10} /></div></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              {blocks.length === 0 ? (
                <div className="p-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-4"><div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto"><Layers size={32} strokeWidth={1.5} /></div><h3 className="text-sm font-black text-slate-800">Wadah Penataan Kosong</h3><p className="text-xs text-slate-400 max-w-md mx-auto">Klik instrumen di kiri untuk merangkai komponen.</p></div>
              ) : (
                <div className="space-y-6">
                  {blocks.map((block, index) => {
                    const bData = block.data || {};
                    return (
                      <div key={block.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#0B4028] text-[#C5A059] flex items-center justify-center text-[10px] font-black">{index + 1}</span><span className="text-xs font-black text-slate-900 uppercase">Blok: {block.type}</span></div><div className="flex items-center gap-1"><button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 hover:bg-white rounded text-slate-400 disabled:opacity-30 cursor-pointer"><ArrowUp size={12} /></button><button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1 hover:bg-white rounded text-slate-400 disabled:opacity-30 cursor-pointer"><ArrowDown size={12} /></button><span className="w-px h-3 bg-slate-200 mx-1" /><button onClick={() => removeBlock(block.id)} className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 cursor-pointer"><Trash2 size={12} /></button></div></div>
                        <div className="p-5 space-y-4">
                          {block.type === 'product_catalog' && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Judul Katalog</label>
                                <input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} placeholder="Judul Katalog" className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2 bg-white" />
                              </div>
                              <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Deskripsi Pendek</label>
                                <textarea rows={2} value={bData.subtitle || ''} onChange={e => updateBlockData(block.id, { ...bData, subtitle: e.target.value })} placeholder="Penjelasan..." className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white" />
                              </div>
                              <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Lencana Emas (Badge)</label>
                                <input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} placeholder="Label Badge" className="w-full text-xs border border-slate-200 rounded-lg p-2 text-[#C5A059] font-bold bg-white" />
                              </div>
                              <div className="col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 font-medium">
                                💡 Catatan: Blok ini akan secara otomatis menarik data produk yang berstatus <strong className="text-emerald-600">PUBLISHED</strong> dari menu Manajemen Produk UMKM.
                              </div>
                            </div>
                          )}
                          {block.type === 'hero' && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2 space-y-1"><label className="text-[10px] font-bold text-slate-400 block">Judul Utama</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} placeholder="Judul Utama" className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2 bg-white" /></div>
                              <div className="col-span-2 space-y-1"><label className="text-[10px] font-bold text-slate-400 block">Deskripsi Singkat</label><textarea rows={2} value={bData.desc || ''} onChange={e => updateBlockData(block.id, { ...bData, desc: e.target.value })} placeholder="Deskripsi..." className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white" /></div>
                              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 block">Lencana Emas</label><input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} placeholder="Label Badge" className="w-full text-xs border border-slate-200 rounded-lg p-2 text-[#C5A059] font-bold bg-white" /></div>
                              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 block">Teks Breadcrumb</label><input type="text" value={bData.breadcrumb || ''} onChange={e => updateBlockData(block.id, { ...bData, breadcrumb: e.target.value })} placeholder="Breadcrumb" className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white" /></div>
                              <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Gambar Latar Belakang (Opsional)</label>
                                <div className="flex items-center gap-1">
                                  <input type="text" value={bData.imgUrl || ''} onChange={e => updateBlockData(block.id, { ...bData, imgUrl: e.target.value })} placeholder="URL Ilustrasi / Foto" className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white font-mono" />
                                  <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'imgUrl', isSubItem: false })} className="px-3 py-1.5 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer flex-shrink-0"><Image size={12} /><span>Pustaka</span></button>
                                  <label className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'imgUrl', false)} /></label>
                                </div>
                              </div>
                            </div>
                          )}
                          {block.type === 'contact_form' && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 block">Lencana Seksi</label><input type="text" value={bData.sectionBadge || ''} onChange={e => updateBlockData(block.id, { ...bData, sectionBadge: e.target.value })} placeholder="Badge" className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white" /></div>
                              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 block">Nomor WhatsApp (Awali 62)</label><input type="text" value={bData.whatsappNumber || ''} onChange={e => updateBlockData(block.id, { ...bData, whatsappNumber: e.target.value })} placeholder="628..." className="w-full text-xs font-mono border border-slate-200 rounded-lg p-2 bg-white" /></div>
                              <div className="col-span-2 space-y-1"><label className="text-[10px] font-bold text-slate-400 block">Judul Utama</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} placeholder="Judul Kontak" className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2 bg-white" /></div>
                              <div className="col-span-2 space-y-1"><label className="text-[10px] font-bold text-slate-400 block">Teks Sub-Judul</label><textarea rows={2} value={bData.subtitle || ''} onChange={e => updateBlockData(block.id, { ...bData, subtitle: e.target.value })} placeholder="Deskripsi pendek..." className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white" /></div>
                              <div className="col-span-2 space-y-1"><label className="text-[10px] font-bold text-slate-400 block">Teks Tombol Aksi</label><input type="text" value={bData.buttonText || ''} onChange={e => updateBlockData(block.id, { ...bData, buttonText: e.target.value })} placeholder="Kirim via WhatsApp" className="w-full text-xs border border-slate-200 rounded-lg p-2 text-[#0B4028] font-bold bg-white" /></div>
                            </div>
                          )}
                          {block.type === 'elements' && (
                            <div className="space-y-3"><div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200"><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Kategori</label><input type="text" value={bData.section || ''} onChange={e => updateBlockData(block.id, { ...bData, section: e.target.value })} placeholder="Kategori" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /></div><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Judul Seksi</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} placeholder="Judul Seksi" className="w-full text-xs font-bold border border-slate-200 rounded p-1 bg-white" /></div><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Deskripsi</label><input type="text" value={bData.desc || ''} onChange={e => updateBlockData(block.id, { ...bData, desc: e.target.value })} placeholder="Sub-deskripsi" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /></div></div><div className="space-y-2"><div className="flex justify-between items-center"><span className="text-[9px] font-bold text-[#0B4028] uppercase">Daftar Kartu</span><button onClick={() => addBlockSubItem(block.id, 'items', { symbol: "X", name: "Baru", number: "CODE", desc: "Ket" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah</button></div>{(bData.items || []).map((sub: any, sIdx: number) => (<div key={sIdx} className="grid grid-cols-12 gap-1.5 items-center border border-slate-200 p-1.5 rounded bg-white"><input type="text" value={sub.symbol} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, symbol: e.target.value })} placeholder="Simbol" className="col-span-2 text-xs font-black border border-slate-200 rounded p-0.5 text-center bg-white" /><input type="text" value={sub.name} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, name: e.target.value })} placeholder="Nama" className="col-span-3 text-xs font-bold border border-slate-200 rounded p-0.5 bg-white" /><input type="text" value={sub.number} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, number: e.target.value })} placeholder="Kode" className="col-span-2 text-xs font-mono border border-slate-200 rounded p-0.5 bg-white" /><input type="text" value={sub.desc} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, desc: e.target.value })} placeholder="Penjelasan..." className="col-span-4 text-xs border border-slate-200 rounded p-0.5 bg-white" /><button onClick={() => removeBlockSubItem(block.id, 'items', sIdx)} className="col-span-1 text-slate-300 hover:text-red-500 mx-auto cursor-pointer"><Trash2 size={10} /></button></div>))}</div></div>
                          )}
                          {block.type === 'flow' && (
                            <div className="space-y-3"><div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200"><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Badge</label><input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} placeholder="Badge" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /></div><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Judul Alur</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} placeholder="Judul Alur" className="w-full text-xs font-bold border border-slate-200 rounded p-1 bg-white" /></div><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Sub-judul</label><input type="text" value={bData.subtitle || ''} onChange={e => updateBlockData(block.id, { ...bData, subtitle: e.target.value })} placeholder="Sub" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /></div></div><div className="space-y-2"><div className="flex justify-between items-center"><span className="text-[9px] font-bold text-[#0B4028] uppercase">Tahapan Alur</span><button onClick={() => addBlockSubItem(block.id, 'steps', { phase: "0X", title: "Langkah", desc: "Ket" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah</button></div>{(bData.steps || []).map((sub: any, sIdx: number) => (<div key={sIdx} className="grid grid-cols-12 gap-1.5 items-center border border-slate-200 p-1.5 rounded bg-white"><input type="text" value={sub.phase} onChange={e => updateBlockSubItem(block.id, 'steps', sIdx, { ...sub, phase: e.target.value })} placeholder="No" className="col-span-2 text-xs font-black border border-slate-200 rounded p-0.5 text-center bg-white" /><input type="text" value={sub.title} onChange={e => updateBlockSubItem(block.id, 'steps', sIdx, { ...sub, title: e.target.value })} placeholder="Judul" className="col-span-4 text-xs font-bold border border-slate-200 rounded p-0.5 bg-white" /><input type="text" value={sub.desc} onChange={e => updateBlockSubItem(block.id, 'steps', sIdx, { ...sub, desc: e.target.value })} placeholder="Deskripsi..." className="col-span-5 text-xs border border-slate-200 rounded p-0.5 bg-white" /><button onClick={() => removeBlockSubItem(block.id, 'steps', sIdx)} className="col-span-1 text-slate-300 hover:text-red-500 mx-auto cursor-pointer"><Trash2 size={10} /></button></div>))}</div></div>
                          )}
                          {block.type === 'workflows' && (
                            <div className="space-y-3"><div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200"><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Badge</label><input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} placeholder="Badge" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /></div><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Judul Akordeon</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} placeholder="Judul Akordeon" className="w-full text-xs font-bold border border-slate-200 rounded p-1 bg-white" /></div></div><div className="space-y-2"><div className="flex justify-between items-center"><span className="text-[9px] font-bold text-[#0B4028] uppercase">Item Panel Reaktor</span><button onClick={() => addBlockSubItem(block.id, 'items', { title: "Item", subtitle: "Sub", desc: "Ket", metric: "Suhu: 0", efficiency: "Purity: 0", imgUrl: "" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah</button></div>{(bData.items || []).map((sub: any, sIdx: number) => (<div key={sIdx} className="border border-slate-200 p-2 rounded bg-slate-50 space-y-1.5"><div className="grid grid-cols-1 sm:grid-cols-3 gap-1"><input type="text" value={sub.title} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, title: e.target.value })} placeholder="Judul" className="text-xs font-bold border border-slate-200 rounded p-1 bg-white" /><input type="text" value={sub.subtitle} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, subtitle: e.target.value })} placeholder="Sub" className="text-xs border border-slate-200 rounded p-1 bg-white" /><div className="flex items-center gap-1"><input type="text" value={sub.imgUrl || ''} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, imgUrl: e.target.value })} placeholder="URL Latar" className="w-full text-xs border border-slate-200 rounded p-1 bg-white font-mono truncate" /><button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'imgUrl', isSubItem: true, subItemIndex: sIdx, subItemArrayKey: 'items' })} className="px-2 py-1 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0" title="Buka Pustaka Media"><Image size={12} /><span>Pustaka</span></button><label className="p-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0" title="Unggah File Lokal"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'imgUrl', true, sIdx, 'items')} /></label></div></div><textarea rows={1} value={sub.desc} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, desc: e.target.value })} placeholder="Penjelasan teknis..." className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /><div className="grid grid-cols-2 gap-1"><input type="text" value={sub.metric} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, metric: e.target.value })} placeholder="Parameter" className="text-xs border border-slate-200 rounded p-1 bg-white" /><div className="flex gap-1"><input type="text" value={sub.efficiency} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, efficiency: e.target.value })} placeholder="Keluaran" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /><button onClick={() => removeBlockSubItem(block.id, 'items', sIdx)} className="text-slate-300 hover:text-red-500 cursor-pointer"><Trash2 size={12} /></button></div></div></div>))}</div></div>
                          )}
                          {block.type === 'gallery' && (
                            <div className="space-y-3"><div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200"><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Badge</label><input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} placeholder="Badge" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /></div><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Judul Galeri</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} placeholder="Judul Galeri" className="w-full text-xs font-bold border border-slate-200 rounded p-1 bg-white" /></div><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Tagline</label><input type="text" value={bData.tagline || ''} onChange={e => updateBlockData(block.id, { ...bData, tagline: e.target.value })} placeholder="Tagline" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /></div></div><div className="space-y-2"><div className="flex justify-between items-center"><span className="text-[9px] font-bold text-[#0B4028] uppercase">Foto Bento</span><button onClick={() => addBlockSubItem(block.id, 'images', { id: `img-${Date.now()}`, title: "Aset", caption: "Ket", sizeClass: "md:col-span-4 h-[220px]", imgUrl: "" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah</button></div>{(bData.images || []).map((sub: any, sIdx: number) => (<div key={sIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-1 items-center border border-slate-200 p-1.5 rounded bg-white"><input type="text" value={sub.title} onChange={e => updateBlockSubItem(block.id, 'images', sIdx, { ...sub, title: e.target.value })} placeholder="Judul" className="sm:col-span-3 text-xs border border-slate-200 rounded p-0.5 bg-white" /><input type="text" value={sub.caption} onChange={e => updateBlockSubItem(block.id, 'images', sIdx, { ...sub, caption: e.target.value })} placeholder="Takarir" className="sm:col-span-4 text-xs border border-slate-200 rounded p-0.5 bg-white" /><select value={sub.sizeClass} onChange={e => updateBlockSubItem(block.id, 'images', sIdx, { ...sub, sizeClass: e.target.value })} className="sm:col-span-2 text-[9px] border border-slate-200 rounded p-0.5 bg-slate-50"><option value="md:col-span-8 md:row-span-2 h-[380px]">Besar</option><option value="md:col-span-6 h-[260px]">Sedang</option><option value="md:col-span-4 h-[220px]">Kecil</option></select><div className="sm:col-span-2 flex items-center gap-0.5"><input type="text" value={sub.imgUrl || ''} onChange={e => updateBlockSubItem(block.id, 'images', sIdx, { ...sub, imgUrl: e.target.value })} placeholder="URL Foto" className="w-full text-xs border border-slate-200 rounded p-0.5 font-mono bg-white truncate" /><button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'imgUrl', isSubItem: true, subItemIndex: sIdx, subItemArrayKey: 'images' })} className="px-1.5 py-0.5 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold transition-colors flex items-center gap-0.5 cursor-pointer flex-shrink-0" title="Buka Pustaka Media"><Image size={10} /></button><label className="p-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0" title="Unggah File Lokal"><Upload size={10} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'imgUrl', true, sIdx, 'images')} /></label></div><button onClick={() => removeBlockSubItem(block.id, 'images', sIdx)} className="sm:col-span-1 text-slate-300 hover:text-red-500 mx-auto cursor-pointer"><Trash2 size={10} /></button></div>))}</div></div>
                          )}
                          {/* 👇 PERBAIKAN: FIELD INPUT DASHBOARD BUTTON URL DITAMBAHKAN DI SINI 👇 */}
                          {block.type === 'dashboard' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Kategori Atas</label><input type="text" value={bData.section || ''} onChange={e => updateBlockData(block.id, { ...bData, section: e.target.value })} placeholder="Kategori Atas" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Headline Penutup</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} placeholder="Headline" className="w-full text-xs font-bold border border-slate-200 rounded p-1 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Label Badge</label><input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} placeholder="Badge Kanan" className="w-full text-xs border border-slate-200 rounded p-1 text-[#C5A059] bg-white" /></div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {[1, 2, 3].map((num) => { 
                                  const mKey = `metric${num}`; 
                                  const mObj = bData[mKey] || {}; 
                                  return (
                                    <div key={num} className="border border-slate-200 p-2 rounded bg-slate-50 space-y-1.5">
                                      <span className="text-[8px] font-bold text-[#0B4028] block">METRIK {num}</span>
                                      <div className="space-y-1"><label className="text-[8px] text-slate-400 block">Label</label><input type="text" value={mObj.label || ''} onChange={e => updateBlockData(block.id, { ...bData, [mKey]: { ...mObj, label: e.target.value } })} placeholder="Label" className="w-full text-xs font-bold border border-slate-200 rounded p-1 bg-white" /></div>
                                      <div className="grid grid-cols-2 gap-1"><div className="space-y-1"><label className="text-[8px] text-slate-400 block">Angka</label><input type="text" value={mObj.value || ''} onChange={e => updateBlockData(block.id, { ...bData, [mKey]: { ...mObj, value: e.target.value } })} placeholder="Nilai" className="w-full text-xs font-black border border-slate-200 rounded p-1 text-center bg-white" /></div><div className="space-y-1"><label className="text-[8px] text-slate-400 block">Satuan</label><input type="text" value={mObj.unit || ''} onChange={e => updateBlockData(block.id, { ...bData, [mKey]: { ...mObj, unit: e.target.value } })} placeholder="Unit" className="w-full text-xs border border-slate-200 rounded p-1 text-center bg-white text-slate-500" /></div></div>
                                      <div className="space-y-1"><label className="text-[8px] text-slate-400 block">Sub-keterangan</label><input type="text" value={mObj.subtitle || ''} onChange={e => updateBlockData(block.id, { ...bData, [mKey]: { ...mObj, subtitle: e.target.value } })} placeholder="Sub-judul" className="w-full text-[10px] border border-slate-200 rounded p-1 bg-white" /></div>
                                      <div className="space-y-1"><label className="text-[8px] text-slate-400 block">Deskripsi Detail</label><input type="text" value={mObj.desc || ''} onChange={e => updateBlockData(block.id, { ...bData, [mKey]: { ...mObj, desc: e.target.value } })} placeholder="Ket..." className="w-full text-[9px] border border-slate-200 rounded p-1 bg-white" /></div>
                                    </div>
                                  ); 
                                })}
                              </div>
                              <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-200">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 block">Catatan Bawah</label>
                                  <input type="text" value={bData.disclaimerTitle || ''} onChange={e => updateBlockData(block.id, { ...bData, disclaimerTitle: e.target.value })} placeholder="Judul..." className="w-full text-xs font-bold border border-slate-200 rounded p-1 bg-white" />
                                </div>
                                <div className="space-y-1 col-span-2">
                                  <label className="text-[9px] font-bold text-slate-400 block">Isi Catatan</label>
                                  <input type="text" value={bData.disclaimerDesc || ''} onChange={e => updateBlockData(block.id, { ...bData, disclaimerDesc: e.target.value })} placeholder="Penjelasan..." className="w-full text-xs border border-slate-200 rounded p-1 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 block">Tombol Aksi (Teks & Link)</label>
                                  <input type="text" value={bData.buttonText || ''} onChange={e => updateBlockData(block.id, { ...bData, buttonText: e.target.value })} placeholder="Teks Tombol" className="w-full text-xs border border-slate-200 rounded p-1 text-[#0B4028] font-bold bg-white mb-1" />
                                  <input type="text" value={bData.buttonUrl || ''} onChange={e => updateBlockData(block.id, { ...bData, buttonUrl: e.target.value })} placeholder="URL (Cth: https://...)" className="w-full text-[10px] font-mono border border-slate-200 rounded p-1 bg-white" />
                                </div>
                              </div>
                            </div>
                          )}
                          {/* 👆 PERBAIKAN SELESAI 👆 */}
                          
                          {block.type === 'cta' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Pernyataan Aksi</label>
                                <input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} placeholder="Pernyataan Aksi Utama" className="w-full text-xs font-bold border border-slate-200 rounded p-2 bg-white" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Teks Tombol</label>
                                <input type="text" value={bData.buttonText || ''} onChange={e => updateBlockData(block.id, { ...bData, buttonText: e.target.value })} placeholder="Teks Tombol Kanan" className="w-full text-xs font-bold border border-slate-200 rounded p-2 text-[#C5A059] bg-white" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Tautan URL Destinasi</label>
                                <input type="text" value={bData.buttonUrl || ''} onChange={e => updateBlockData(block.id, { ...bData, buttonUrl: e.target.value })} placeholder="Cth: /p/kontak atau https://..." className="w-full text-xs font-mono border border-slate-200 rounded p-2 bg-white" />
                              </div>
                              <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Sub-kalimat</label>
                                <input type="text" value={bData.subtitle || ''} onChange={e => updateBlockData(block.id, { ...bData, subtitle: e.target.value })} placeholder="Sub-kalimat pendukung..." className="w-full text-xs border border-slate-200 rounded p-2 bg-white" />
                              </div>
                            </div>
                          )}
                          {block.type === 'faq' && (
                            <div className="space-y-3"><div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200"><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Judul FAQ</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} placeholder="Judul Utama FAQ" className="w-full text-xs font-bold border border-slate-200 rounded p-1 bg-white" /></div><div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Deskripsi Pendek</label><input type="text" value={bData.subtitle || ''} onChange={e => updateBlockData(block.id, { ...bData, subtitle: e.target.value })} placeholder="Deskripsi Pendek" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /></div></div><div className="space-y-2"><div className="flex justify-between items-center"><span className="text-[9px] font-bold text-[#0B4028] uppercase">Daftar Pertanyaan</span><button onClick={() => addBlockSubItem(block.id, 'faqs', { q: "Pertanyaan Baru?", a: "Jawaban penjelasan." })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah</button></div>{(bData.faqs || []).map((sub: any, sIdx: number) => (<div key={sIdx} className="border border-slate-200 p-2 rounded bg-slate-50 space-y-1.5"><div className="flex gap-2 items-center"><input type="text" value={sub.q} onChange={e => updateBlockSubItem(block.id, 'faqs', sIdx, { ...sub, q: e.target.value })} placeholder="Tulis Pertanyaan..." className="w-full text-xs font-bold border border-slate-200 rounded p-1 bg-white" /><button onClick={() => removeBlockSubItem(block.id, 'faqs', sIdx)} className="text-slate-300 hover:text-red-500 cursor-pointer"><Trash2 size={12} /></button></div><textarea rows={1} value={sub.a} onChange={e => updateBlockSubItem(block.id, 'faqs', sIdx, { ...sub, a: e.target.value })} placeholder="Tulis Jawaban lengkap..." className="w-full text-xs border border-slate-200 rounded p-1 bg-white" /></div>))}</div></div>
                          )}
                          {block.type === 'slider_cards' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 block">Kop Label Atas</label>
                                  <input type="text" value={bData.sectionLabel || ''} onChange={e => updateBlockData(block.id, { ...bData, sectionLabel: e.target.value })} placeholder="e.g. Sektor Strategis" className="w-full text-xs border border-slate-200 rounded p-1 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 block">Headline Korsel</label>
                                  <input type="text" value={bData.sectionTitle || ''} onChange={e => updateBlockData(block.id, { ...bData, sectionTitle: e.target.value })} placeholder="Judul Utama" className="w-full text-xs font-bold border border-slate-200 rounded p-1 bg-white" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Kartu Sektor</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'cards', { title: "Sektor Baru", imgUrl: "", iconType: "zap", linkUrl: "#" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah</button>
                                </div>
                                {(bData.cards || []).map((sub: any, sIdx: number) => (
                                  <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center border border-slate-200 p-1.5 rounded bg-white">
                                    <input type="text" value={sub.title} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, title: e.target.value })} placeholder="Nama Sektor" className="sm:col-span-3 text-xs font-bold border border-slate-200 rounded p-0.5 bg-white" />
                                    <select value={sub.iconType} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, iconType: e.target.value })} className="sm:col-span-2 text-[9px] border border-slate-200 rounded p-0.5 bg-slate-50">
                                      <option value="zap">Petir (Zap)</option>
                                      <option value="shield">Perisai (Shield)</option>
                                      <option value="cpu">Prosesor (Cpu)</option>
                                      <option value="compass">Kompas</option>
                                    </select>
                                    <input type="text" value={sub.linkUrl} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, linkUrl: e.target.value })} placeholder="URL Aksi" className="sm:col-span-2 text-xs border border-slate-200 rounded p-0.5 bg-white font-mono" />
                                    <div className="sm:col-span-4 flex items-center gap-0.5">
                                      <input type="text" value={sub.imgUrl || ''} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, imgUrl: e.target.value })} placeholder="URL Foto Latar" className="w-full text-xs border border-slate-200 rounded p-0.5 font-mono bg-white truncate" />
                                      <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'imgUrl', isSubItem: true, subItemIndex: sIdx, subItemArrayKey: 'cards' })} className="px-1.5 py-0.5 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold transition-colors flex items-center gap-0.5 cursor-pointer flex-shrink-0" title="Pustaka"><Image size={10} /></button>
                                      <label className="p-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0" title="Upload Lokal"><Upload size={10} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'imgUrl', true, sIdx, 'cards')} /></label>
                                    </div>
                                    <button onClick={() => removeBlockSubItem(block.id, 'cards', sIdx)} className="sm:col-span-1 text-slate-300 hover:text-red-500 mx-auto cursor-pointer"><Trash2 size={10} /></button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {block.type === 'split_headline' && (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Headline Format HTML</label>
                                <textarea rows={2} value={bData.headlineHtml || ''} onChange={e => updateBlockData(block.id, { ...bData, headlineHtml: e.target.value })} placeholder="e.g. <strong>Danantara</strong> dibentuk..." className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-mono" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Paragraf Penjelas</label>
                                <textarea rows={2} value={bData.narrative || ''} onChange={e => updateBlockData(block.id, { ...bData, narrative: e.target.value })} placeholder="Teks narasi..." className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Gambar Pilar Kiri</label>
                                <div className="flex items-center gap-1">
                                  <input type="text" value={bData.imgUrl || ''} onChange={e => updateBlockData(block.id, { ...bData, imgUrl: e.target.value })} placeholder="URL Ilustrasi" className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white font-mono" />
                                  <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'imgUrl', isSubItem: false })} className="px-3 py-1.5 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer flex-shrink-0"><Image size={12} /><span>Pustaka</span></button>
                                  <label className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'imgUrl', false)} /></label>
                                </div>
                              </div>
                            </div>
                          )}

                          {block.type === 'post_grid' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="col-span-1 sm:col-span-3 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Judul Seksi Berita</label>
                                <input type="text" value={bData.sectionTitle || ''} onChange={e => updateBlockData(block.id, { ...bData, sectionTitle: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-2 bg-white" />
                              </div>
                              <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Pilih Kategori</label>
                                <select value={bData.categorySlug || ''} onChange={e => updateBlockData(block.id, { ...bData, categorySlug: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-2 bg-white">
                                  <option value="">-- Pilih Kategori --</option>
                                  {categories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Limit</label>
                                <input type="number" min="1" max="12" value={bData.limit || 3} onChange={e => updateBlockData(block.id, { ...bData, limit: Number(e.target.value) })} className="w-full text-xs border border-slate-200 rounded p-2 bg-white" />
                              </div>
                            </div>
                          )}

                          {block.type === 'hero_banner' && (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <span className="text-[9px] font-bold text-[#0B4028] uppercase">Daftar Slide Banner</span>
                                <button onClick={() => addBlockSubItem(block.id, 'slides', { title: "Slide Baru", desc: "Deskripsi", image: "" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer">
                                  <Plus size={10} className="inline" /> Tambah Slide
                                </button>
                              </div>
                              {(bData.slides || []).map((sub: any, sIdx: number) => (
                                <div key={sIdx} className="grid grid-cols-1 gap-2 items-center border border-slate-200 p-2.5 rounded-lg bg-white shadow-sm relative">
                                  <div className="absolute -top-2 -left-2 w-5 h-5 bg-[#0B4028] text-[#C5A059] flex items-center justify-center rounded text-[9px] font-black">{sIdx + 1}</div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 block">Judul Slide</label>
                                    <input type="text" value={sub.title} onChange={e => updateBlockSubItem(block.id, 'slides', sIdx, { ...sub, title: e.target.value })} placeholder="Judul Utama Slide" className="text-xs font-bold border border-slate-200 rounded p-1.5 bg-white w-full" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 block">Deskripsi Slide</label>
                                    <textarea value={sub.desc} onChange={e => updateBlockSubItem(block.id, 'slides', sIdx, { ...sub, desc: e.target.value })} placeholder="Deskripsi Slide..." className="text-xs border border-slate-200 rounded p-1.5 bg-white w-full" rows={2} />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 block">Gambar Latar Belakang</label>
                                    <div className="flex items-center gap-1">
                                      <input type="text" value={sub.image || ''} onChange={e => updateBlockSubItem(block.id, 'slides', sIdx, { ...sub, image: e.target.value })} placeholder="URL Gambar Latar" className="w-full text-xs border border-slate-200 rounded p-1.5 font-mono bg-white truncate" />
                                      <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'image', isSubItem: true, subItemIndex: sIdx, subItemArrayKey: 'slides' })} className="px-3 py-1.5 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0" title="Pustaka"><Image size={12} /> Pustaka</button>
                                      <label className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0" title="Upload Lokal"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'image', true, sIdx, 'slides')} /></label>
                                    </div>
                                  </div>
                                  <button onClick={() => removeBlockSubItem(block.id, 'slides', sIdx)} className="text-slate-400 hover:text-red-500 w-fit cursor-pointer flex items-center gap-1 text-[10px] font-bold mt-1">
                                    <Trash2 size={12} /> Hapus Slide Ini
                                  </button>
                                </div>
                              ))}

                              <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Tautan Cepat Bawah</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'quickLinks', { label: "Tautan Baru", url: "#" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer">
                                    <Plus size={10} className="inline" /> Tambah Tautan
                                  </button>
                                </div>
                                {(bData.quickLinks || []).map((ql: any, qIdx: number) => (
                                  <div key={`ql-${qIdx}`} className="grid grid-cols-12 gap-1.5 items-center border border-slate-200 p-1.5 rounded bg-white mt-2">
                                    <input type="text" value={ql.label} onChange={e => updateBlockSubItem(block.id, 'quickLinks', qIdx, { ...ql, label: e.target.value })} placeholder="Label Tautan (Misal: Profil Perusahaan)" className="col-span-5 text-xs font-bold border border-slate-200 rounded p-1 bg-white" />
                                    <input type="text" value={ql.url} onChange={e => updateBlockSubItem(block.id, 'quickLinks', qIdx, { ...ql, url: e.target.value })} placeholder="URL (Misal: /tentang)" className="col-span-6 text-xs font-mono border border-slate-200 rounded p-1 bg-white" />
                                    <button onClick={() => removeBlockSubItem(block.id, 'quickLinks', qIdx)} className="col-span-1 text-slate-300 hover:text-red-500 mx-auto cursor-pointer">
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === 'about_section' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Badge Atas</label>
                                  <input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-2 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Takarir Gambar</label>
                                  <input type="text" value={bData.imgCaption || ''} onChange={e => updateBlockData(block.id, { ...bData, imgCaption: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-2 bg-white" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Headline (Mendukung HTML)</label>
                                <textarea rows={3} value={bData.headlineHtml || ''} onChange={e => updateBlockData(block.id, { ...bData, headlineHtml: e.target.value })} className="w-full text-xs font-mono border border-slate-200 rounded p-2 bg-white" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Deskripsi Pendek</label>
                                <textarea rows={2} value={bData.description || ''} onChange={e => updateBlockData(block.id, { ...bData, description: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-2 bg-white" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Teks Tautan</label>
                                  <input type="text" value={bData.linkText || ''} onChange={e => updateBlockData(block.id, { ...bData, linkText: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-2 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">URL Tautan</label>
                                  <input type="text" value={bData.linkUrl || ''} onChange={e => updateBlockData(block.id, { ...bData, linkUrl: e.target.value })} className="w-full text-xs font-mono border border-slate-200 rounded p-2 bg-white" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Gambar Pendamping</label>
                                <div className="flex items-center gap-1">
                                  <input type="text" value={bData.imgUrl || ''} onChange={e => updateBlockData(block.id, { ...bData, imgUrl: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white font-mono" />
                                  <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'imgUrl', isSubItem: false })} className="px-3 py-1.5 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer flex-shrink-0"><Image size={12} /><span>Pustaka</span></button>
                                  <label className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'imgUrl', false)} /></label>
                                </div>
                              </div>
                            </div>
                          )}

                          {block.type === 'purpose_section' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Badge Lencana</label>
                                  <input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Deskripsi Bawah</label>
                                  <textarea rows={2} value={bData.description || ''} onChange={e => updateBlockData(block.id, { ...bData, description: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Gambar Latar Globe (Kanan)</label>
                                  <div className="flex items-center gap-1">
                                    <input type="text" value={bData.bgImageUrl || ''} onChange={e => updateBlockData(block.id, { ...bData, bgImageUrl: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 font-mono bg-white truncate" />
                                    <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'bgImageUrl', isSubItem: false })} className="px-3 py-1.5 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"><Image size={12} /> Pustaka</button>
                                    <label className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'bgImageUrl', false)} /></label>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Teks Tujuan (Marquee)</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'items', { text: "Tujuan Baru" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah</button>
                                </div>
                                {(bData.items || []).map((sub: any, sIdx: number) => (
                                  <div key={sIdx} className="flex gap-2 items-center border border-slate-200 p-1.5 rounded bg-white">
                                    <input type="text" value={sub.text} onChange={e => updateBlockSubItem(block.id, 'items', sIdx, { ...sub, text: e.target.value })} placeholder="Masukkan Tujuan" className="flex-1 text-xs font-bold border border-slate-200 rounded p-1 bg-white" />
                                    <button onClick={() => removeBlockSubItem(block.id, 'items', sIdx)} className="text-slate-300 hover:text-red-500 cursor-pointer p-1"><Trash2 size={12} /></button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === 'core_mandate' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Badge Atas</label>
                                  <input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Headline (HTML)</label>
                                  <textarea rows={2} value={bData.titleHtml || ''} onChange={e => updateBlockData(block.id, { ...bData, titleHtml: e.target.value })} className="w-full text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Teks Tautan</label>
                                  <input type="text" value={bData.linkText || ''} onChange={e => updateBlockData(block.id, { ...bData, linkText: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">URL Tautan</label>
                                  <input type="text" value={bData.linkUrl || ''} onChange={e => updateBlockData(block.id, { ...bData, linkUrl: e.target.value })} className="w-full text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Kartu Mandat (Marquee)</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'cards', { title: "Judul", desc: "Desk", bgImage: "", isDefaultImg: "false", vectorIcon: "🔥", vectorText: "Ikon", linkUrl: "#" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah Kartu</button>
                                </div>
                                {(bData.cards || []).map((sub: any, sIdx: number) => (
                                  <div key={sIdx} className="border border-slate-200 p-2 rounded-lg bg-slate-50 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <input type="text" value={sub.title} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, title: e.target.value })} placeholder="Judul (Pakai \n untuk baris baru)" className="text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                      <textarea rows={1} value={sub.desc} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, desc: e.target.value })} placeholder="Deskripsi Singkat" className="text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                      <input type="text" value={sub.vectorIcon} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, vectorIcon: e.target.value })} placeholder="Emoji/Ikon" className="text-xs border border-slate-200 rounded p-1.5 bg-white text-center" />
                                      <input type="text" value={sub.vectorText} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, vectorText: e.target.value })} placeholder="Label Ikon" className="text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                      <select value={sub.isDefaultImg} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, isDefaultImg: e.target.value })} className="text-[10px] border border-slate-200 rounded p-1.5 bg-white">
                                        <option value="true">Gambar Default Tampil</option>
                                        <option value="false">Tampil Saat Hover</option>
                                      </select>
                                      <input type="text" value={sub.linkUrl} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, linkUrl: e.target.value })} placeholder="URL Tujuan" className="text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <input type="text" value={sub.bgImage || ''} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, bgImage: e.target.value })} placeholder="URL Gambar Latar" className="w-full text-xs font-mono border border-slate-200 rounded p-1.5 bg-white truncate" />
                                      <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'bgImage', isSubItem: true, subItemIndex: sIdx, subItemArrayKey: 'cards' })} className="px-2 py-1 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0" title="Buka Pustaka"><Image size={12} /></button>
                                      <label className="p-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'bgImage', true, sIdx, 'cards')} /></label>
                                      <button onClick={() => removeBlockSubItem(block.id, 'cards', sIdx)} className="p-1 ml-1 text-slate-400 hover:text-red-500 cursor-pointer flex-shrink-0"><Trash2 size={12} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {block.type === 'strategic_sectors' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Badge Lencana</label>
                                  <input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Judul Seksi</label>
                                  <input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Kartu Sektor</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'cards', { title: "Sektor Baru", image: "", icon: "⚡", url: "#" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah</button>
                                </div>
                                {(bData.cards || []).map((sub: any, sIdx: number) => (
                                  <div key={sIdx} className="border border-slate-200 p-2 rounded-lg bg-slate-50 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <input type="text" value={sub.title} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, title: e.target.value })} placeholder="Judul Sektor" className="text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                      <input type="text" value={sub.url} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, url: e.target.value })} placeholder="URL Tujuan" className="text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" />
                                    </div>
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                      <input type="text" value={sub.icon} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, icon: e.target.value })} placeholder="Ikon" className="col-span-2 text-xs border border-slate-200 rounded p-1.5 bg-white text-center" />
                                      <div className="col-span-9 flex items-center gap-1">
                                        <input type="text" value={sub.image || ''} onChange={e => updateBlockSubItem(block.id, 'cards', sIdx, { ...sub, image: e.target.value })} placeholder="URL Gambar Latar" className="w-full text-xs font-mono border border-slate-200 rounded p-1.5 bg-white truncate" />
                                        <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'image', isSubItem: true, subItemIndex: sIdx, subItemArrayKey: 'cards' })} className="px-2 py-1 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0" title="Pustaka"><Image size={12} /></button>
                                        <label className="p-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0" title="Upload Lokal"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'image', true, sIdx, 'cards')} /></label>
                                      </div>
                                      <button onClick={() => removeBlockSubItem(block.id, 'cards', sIdx)} className="col-span-1 p-1 text-slate-400 hover:text-red-500 cursor-pointer flex-shrink-0"><Trash2 size={12} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {block.type === 'leader_quote' && (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Kutipan (Bisa menggunakan Tag HTML)</label>
                                <textarea rows={3} value={bData.quoteHtml || ''} onChange={e => updateBlockData(block.id, { ...bData, quoteHtml: e.target.value })} className="w-full text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Nama / Posisi</label>
                                  <input type="text" value={bData.authorTitle || ''} onChange={e => updateBlockData(block.id, { ...bData, authorTitle: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Sub-Teks (Instansi)</label>
                                  <input type="text" value={bData.authorSubtitle || ''} onChange={e => updateBlockData(block.id, { ...bData, authorSubtitle: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Gambar Foto (Opsional, Ada Default)</label>
                                <div className="flex items-center gap-1">
                                  <input type="text" value={bData.bgImage || ''} onChange={e => updateBlockData(block.id, { ...bData, bgImage: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 font-mono bg-white truncate" />
                                  <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'bgImage', isSubItem: false })} className="px-3 py-1.5 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"><Image size={12} /> Pustaka</button>
                                  <label className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer flex-shrink-0"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'bgImage', false)} /></label>
                                </div>
                              </div>
                            </div>
                          )}

                          {block.type === 'newsroom_section' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Badge Lencana</label>
                                  <input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Judul Seksi</label>
                                  <input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Teks Tautan</label>
                                  <input type="text" value={bData.linkText || ''} onChange={e => updateBlockData(block.id, { ...bData, linkText: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">URL Tautan</label>
                                  <input type="text" value={bData.linkUrl || ''} onChange={e => updateBlockData(block.id, { ...bData, linkUrl: e.target.value })} className="w-full text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2 space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Kategori Berita</label>
                                  <select value={bData.categorySlug || ''} onChange={e => updateBlockData(block.id, { ...bData, categorySlug: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white">
                                    <option value="">-- Semua Kategori --</option>
                                    {categories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Limit</label>
                                  <input type="number" min="1" max="12" value={bData.limit || 4} onChange={e => updateBlockData(block.id, { ...bData, limit: Number(e.target.value) })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>
                            </div>
                          )}
                          {block.type === 'esg_impact' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Badge Lencana</label>
                                  <input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Judul Utama</label>
                                  <input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Deskripsi Pendek</label>
                                  <textarea rows={2} value={bData.description || ''} onChange={e => updateBlockData(block.id, { ...bData, description: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Kartu Metrik</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'metrics', { tag: "Tag", value: "0%", title: "Judul", desc: "Ket", iconType: "leaf" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah</button>
                                </div>
                                {(bData.metrics || []).map((sub: any, sIdx: number) => (
                                  <div key={sIdx} className="border border-slate-200 p-2 rounded-lg bg-slate-50 space-y-2">
                                    <div className="grid grid-cols-3 gap-2">
                                      <select value={sub.iconType} onChange={e => updateBlockSubItem(block.id, 'metrics', sIdx, { ...sub, iconType: e.target.value })} className="text-xs border border-slate-200 rounded p-1.5 bg-white">
                                        <option value="leaf">Daun (Leaf)</option><option value="droplet">Air (Droplet)</option>
                                        <option value="wind">Udara (Wind)</option><option value="zap">Petir (Zap)</option>
                                        <option value="activity">Grafik (Activity)</option><option value="shield">Perisai (Shield)</option>
                                      </select>
                                      <input type="text" value={sub.tag} onChange={e => updateBlockSubItem(block.id, 'metrics', sIdx, { ...sub, tag: e.target.value })} placeholder="Tag Atas" className="text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                      <input type="text" value={sub.value} onChange={e => updateBlockSubItem(block.id, 'metrics', sIdx, { ...sub, value: e.target.value })} placeholder="Angka/Nilai" className="text-xs font-black border border-slate-200 rounded p-1.5 bg-white" />
                                    </div>
                                    <div className="flex gap-2 items-start">
                                      <div className="flex-1 space-y-1">
                                        <input type="text" value={sub.title} onChange={e => updateBlockSubItem(block.id, 'metrics', sIdx, { ...sub, title: e.target.value })} placeholder="Judul Metrik" className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                        <input type="text" value={sub.desc} onChange={e => updateBlockSubItem(block.id, 'metrics', sIdx, { ...sub, desc: e.target.value })} placeholder="Deskripsi Ringkas" className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                      </div>
                                      <button onClick={() => removeBlockSubItem(block.id, 'metrics', sIdx)} className="p-1.5 mt-1 text-slate-400 hover:text-red-500 cursor-pointer bg-white border border-slate-200 rounded"><Trash2 size={12} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === 'global_supply_chain' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Badge Atas</label>
                                  <input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Judul Seksi</label>
                                  <input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Deskripsi (Mendukung HTML)</label>
                                <textarea rows={2} value={bData.descriptionHtml || ''} onChange={e => updateBlockData(block.id, { ...bData, descriptionHtml: e.target.value })} className="w-full text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" />
                              </div>
                              <div className="space-y-2 border-t border-slate-100 pt-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Label Lokasi</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'regions', { name: "Lokasi Baru" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah</button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {(bData.regions || []).map((sub: any, sIdx: number) => (
                                    <div key={sIdx} className="flex gap-1 items-center border border-slate-200 p-1 rounded bg-white">
                                      <input type="text" value={sub.name} onChange={e => updateBlockSubItem(block.id, 'regions', sIdx, { ...sub, name: e.target.value })} placeholder="Nama Benua" className="flex-1 text-xs border border-slate-200 rounded p-1 bg-white" />
                                      <button onClick={() => removeBlockSubItem(block.id, 'regions', sIdx)} className="text-slate-300 hover:text-red-500 cursor-pointer p-1"><Trash2 size={12} /></button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {block.type === 'career_apprenticeship' && (
                            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Badge Kiri Atas</label>
                                <input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Judul CTA</label>
                                <input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                              </div>
                              <div className="col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Teks Deskripsi</label>
                                <textarea rows={2} value={bData.description || ''} onChange={e => updateBlockData(block.id, { ...bData, description: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">Teks Tombol Aksi</label>
                                <input type="text" value={bData.buttonText || ''} onChange={e => updateBlockData(block.id, { ...bData, buttonText: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white text-[#C5A059]" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 block">URL Tombol Aksi</label>
                                <input type="text" value={bData.buttonUrl || ''} onChange={e => updateBlockData(block.id, { ...bData, buttonUrl: e.target.value })} className="w-full text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" />
                              </div>
                            </div>
                          )}

                          {block.type === 'investor_relations' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Judul Kiri</label>
                                  <input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 block">Sub-Judul Kiri</label>
                                  <input type="text" value={bData.subtitle || ''} onChange={e => updateBlockData(block.id, { ...bData, subtitle: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Tombol Dokumen / Link</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'documents', { title: "Dokumen Baru", url: "#" })} className="text-[9px] font-bold text-[#C5A059] cursor-pointer"><Plus size={10} className="inline" /> Tambah Tombol</button>
                                </div>
                                {(bData.documents || []).map((sub: any, sIdx: number) => (
                                  <div key={sIdx} className="flex gap-2 items-center border border-slate-200 p-1.5 rounded bg-white">
                                    <input type="text" value={sub.title} onChange={e => updateBlockSubItem(block.id, 'documents', sIdx, { ...sub, title: e.target.value })} placeholder="Label Tombol" className="w-1/2 text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                    <input type="text" value={sub.url} onChange={e => updateBlockSubItem(block.id, 'documents', sIdx, { ...sub, url: e.target.value })} placeholder="URL Dokumen / Link" className="flex-1 text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" />
                                    <button onClick={() => removeBlockSubItem(block.id, 'documents', sIdx)} className="text-slate-300 hover:text-red-500 cursor-pointer p-1.5"><Trash2 size={12} /></button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === 'profile_hero' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Breadcrumb</label><input type="text" value={bData.breadcrumb || ''} onChange={e => updateBlockData(block.id, { ...bData, breadcrumb: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Badge Lencana</label><input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="col-span-2 space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Judul Utama</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="col-span-2 space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Deskripsi</label><textarea rows={2} value={bData.description || ''} onChange={e => updateBlockData(block.id, { ...bData, description: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                              </div>
                            </div>
                          )}

                          {block.type === 'mandate_history' && (
                            <div className="space-y-3">
                              <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Headline (Mendukung HTML)</label><textarea rows={2} value={bData.titleHtml || ''} onChange={e => updateBlockData(block.id, { ...bData, titleHtml: e.target.value })} className="w-full text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" /></div>
                              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Paragraf 1</label><textarea rows={3} value={bData.desc1 || ''} onChange={e => updateBlockData(block.id, { ...bData, desc1: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Paragraf 2 (Kecil)</label><textarea rows={3} value={bData.desc2 || ''} onChange={e => updateBlockData(block.id, { ...bData, desc2: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">ID YouTube</label><input type="text" value={bData.youtubeId || ''} onChange={e => updateBlockData(block.id, { ...bData, youtubeId: e.target.value })} placeholder="Cth: BMyw1deZ17c" className="w-full text-xs font-mono border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Watermark Video</label><input type="text" value={bData.watermark || ''} onChange={e => updateBlockData(block.id, { ...bData, watermark: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Kutipan Bawah Video</label><input type="text" value={bData.quote || ''} onChange={e => updateBlockData(block.id, { ...bData, quote: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                              </div>
                            </div>
                          )}

                          {block.type === 'core_values_grid' && (
                            <div className="space-y-4">
                              {/* Visi */}
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-2">
                                <span className="text-[9px] font-bold text-[#0B4028] uppercase">Bagian Visi</span>
                                <div className="grid grid-cols-2 gap-2">
                                  <input type="text" value={bData.visionBadge || ''} onChange={e => updateBlockData(block.id, { ...bData, visionBadge: e.target.value })} placeholder="Badge Visi" className="text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                  <input type="text" value={bData.visionTitle || ''} onChange={e => updateBlockData(block.id, { ...bData, visionTitle: e.target.value })} placeholder="Judul Visi" className="text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                  <textarea value={bData.visionDesc || ''} onChange={e => updateBlockData(block.id, { ...bData, visionDesc: e.target.value })} placeholder="Deskripsi Visi" className="col-span-2 text-xs border border-slate-200 rounded p-1.5 bg-white" rows={2} />
                                  <input type="text" value={bData.visionTarget || ''} onChange={e => updateBlockData(block.id, { ...bData, visionTarget: e.target.value })} placeholder="Target Realisasi" className="col-span-2 text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>

                              {/* Misi */}
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Bagian Misi</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'missions', { text: "Misi Baru" })} className="text-[9px] font-bold text-[#C5A059]"><Plus size={10} className="inline" /> Tambah Misi</button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <input type="text" value={bData.missionBadge || ''} onChange={e => updateBlockData(block.id, { ...bData, missionBadge: e.target.value })} placeholder="Badge Misi" className="text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                  <input type="text" value={bData.missionTitle || ''} onChange={e => updateBlockData(block.id, { ...bData, missionTitle: e.target.value })} placeholder="Judul Misi" className="text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                {(bData.missions || []).map((m: any, mIdx: number) => (
                                  <div key={`m-${mIdx}`} className="flex gap-2 items-center">
                                    <input type="text" value={m.text} onChange={e => updateBlockSubItem(block.id, 'missions', mIdx, { ...m, text: e.target.value })} className="flex-1 text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                    <button onClick={() => removeBlockSubItem(block.id, 'missions', mIdx)} className="text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                  </div>
                                ))}
                              </div>

                              {/* Core Values */}
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Budaya Kerja / Nilai</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'coreValues', { title: "Nilai", desc: "Deskripsi", iconType: "shield" })} className="text-[9px] font-bold text-[#C5A059]"><Plus size={10} className="inline" /> Tambah Nilai</button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <input type="text" value={bData.valuesBadge || ''} onChange={e => updateBlockData(block.id, { ...bData, valuesBadge: e.target.value })} placeholder="Badge Nilai" className="text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                  <input type="text" value={bData.valuesTitle || ''} onChange={e => updateBlockData(block.id, { ...bData, valuesTitle: e.target.value })} placeholder="Judul Nilai" className="text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                  <input type="text" value={bData.valuesDesc || ''} onChange={e => updateBlockData(block.id, { ...bData, valuesDesc: e.target.value })} placeholder="Deskripsi Singkat" className="text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                                {(bData.coreValues || []).map((cv: any, cvIdx: number) => (
                                  <div key={`cv-${cvIdx}`} className="grid grid-cols-12 gap-1.5 items-center bg-white p-1.5 border border-slate-200 rounded">
                                    <input type="text" value={cv.title} onChange={e => updateBlockSubItem(block.id, 'coreValues', cvIdx, { ...cv, title: e.target.value })} placeholder="Judul" className="col-span-3 text-xs font-bold border border-slate-200 rounded p-1" />
                                    <select value={cv.iconType} onChange={e => updateBlockSubItem(block.id, 'coreValues', cvIdx, { ...cv, iconType: e.target.value })} className="col-span-2 text-xs border border-slate-200 rounded p-1">
                                      <option value="shield">Shield</option><option value="award">Award</option><option value="users">Users</option>
                                      <option value="target">Target</option><option value="zap">Zap</option><option value="compass">Compass</option>
                                    </select>
                                    <input type="text" value={cv.desc} onChange={e => updateBlockSubItem(block.id, 'coreValues', cvIdx, { ...cv, desc: e.target.value })} placeholder="Deskripsi" className="col-span-6 text-xs border border-slate-200 rounded p-1" />
                                    <button onClick={() => removeBlockSubItem(block.id, 'coreValues', cvIdx)} className="col-span-1 text-slate-400 hover:text-red-500 mx-auto"><Trash2 size={12} /></button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === 'leadership_team' && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Badge</label><input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Judul</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Periode</label><input type="text" value={bData.period || ''} onChange={e => updateBlockData(block.id, { ...bData, period: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                              </div>

                              {/* Komisaris */}
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Kepala Desa</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'commissaries', { name: "Nama Baru", role: "Jabatan", image: "", url: "" })} className="text-[9px] font-bold text-[#C5A059]"><Plus size={10} className="inline" /> Tambah Komisaris</button>
                                </div>
                                {(bData.commissaries || []).map((c: any, cIdx: number) => (
                                  <div key={`com-${cIdx}`} className="bg-white p-2 border border-slate-200 rounded space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <input type="text" value={c.name} onChange={e => updateBlockSubItem(block.id, 'commissaries', cIdx, { ...c, name: e.target.value })} placeholder="Nama Lengkap" className="text-xs font-bold border border-slate-200 rounded p-1.5" />
                                      <input type="text" value={c.role} onChange={e => updateBlockSubItem(block.id, 'commissaries', cIdx, { ...c, role: e.target.value })} placeholder="Jabatan" className="text-xs border border-slate-200 rounded p-1.5" />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <input type="text" value={c.image || ''} onChange={e => updateBlockSubItem(block.id, 'commissaries', cIdx, { ...c, image: e.target.value })} placeholder="URL Foto" className="flex-1 text-xs font-mono border border-slate-200 rounded p-1.5 truncate" />
                                      <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'image', isSubItem: true, subItemIndex: cIdx, subItemArrayKey: 'commissaries' })} className="px-2 py-1.5 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-[10px]"><Image size={12} /></button>
                                      <label className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'image', true, cIdx, 'commissaries')} /></label>
                                      <input type="text" value={c.url || ''} onChange={e => updateBlockSubItem(block.id, 'commissaries', cIdx, { ...c, url: e.target.value })} placeholder="URL LinkedIn/Bio" className="w-1/4 text-xs font-mono border border-slate-200 rounded p-1.5" />
                                      <button onClick={() => removeBlockSubItem(block.id, 'commissaries', cIdx)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Direksi */}
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Jajaran Direksi</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'directors', { name: "Nama Baru", role: "Jabatan", image: "", url: "" })} className="text-[9px] font-bold text-[#C5A059]"><Plus size={10} className="inline" /> Tambah Direksi</button>
                                </div>
                                {(bData.directors || []).map((d: any, dIdx: number) => (
                                  <div key={`dir-${dIdx}`} className="bg-white p-2 border border-slate-200 rounded space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <input type="text" value={d.name} onChange={e => updateBlockSubItem(block.id, 'directors', dIdx, { ...d, name: e.target.value })} placeholder="Nama Lengkap" className="text-xs font-bold border border-slate-200 rounded p-1.5" />
                                      <input type="text" value={d.role} onChange={e => updateBlockSubItem(block.id, 'directors', dIdx, { ...d, role: e.target.value })} placeholder="Jabatan" className="text-xs border border-slate-200 rounded p-1.5" />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <input type="text" value={d.image || ''} onChange={e => updateBlockSubItem(block.id, 'directors', dIdx, { ...d, image: e.target.value })} placeholder="URL Foto" className="flex-1 text-xs font-mono border border-slate-200 rounded p-1.5 truncate" />
                                      <button type="button" onClick={() => handleOpenMediaLibrary({ blockId: block.id, fieldKey: 'image', isSubItem: true, subItemIndex: dIdx, subItemArrayKey: 'directors' })} className="px-2 py-1.5 bg-slate-100 hover:bg-[#0B4028] hover:text-[#C5A059] border border-slate-200 rounded text-slate-700 font-bold text-[10px]"><Image size={12} /></button>
                                      <label className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 cursor-pointer"><Upload size={12} /><input type="file" accept="image/*" className="hidden" onChange={e => handleUploadImageLocal(e, block.id, 'image', true, dIdx, 'directors')} /></label>
                                      <input type="text" value={d.url || ''} onChange={e => updateBlockSubItem(block.id, 'directors', dIdx, { ...d, url: e.target.value })} placeholder="URL LinkedIn/Bio" className="w-1/4 text-xs font-mono border border-slate-200 rounded p-1.5" />
                                      <button onClick={() => removeBlockSubItem(block.id, 'directors', dIdx)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === 'governance_structure' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Badge Utama</label><input type="text" value={bData.badge || ''} onChange={e => updateBlockData(block.id, { ...bData, badge: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Judul Utama</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Deskripsi Utama</label><input type="text" value={bData.desc || ''} onChange={e => updateBlockData(block.id, { ...bData, desc: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                              </div>
                              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 space-y-2">
                                <span className="text-[9px] font-bold text-white uppercase block">Node Atas (Puncak)</span>
                                <div className="grid grid-cols-3 gap-2">
                                  <input type="text" value={bData.topBadge || ''} onChange={e => updateBlockData(block.id, { ...bData, topBadge: e.target.value })} placeholder="Badge Atas" className="text-xs border border-slate-700 rounded p-1.5 bg-slate-800 text-white" />
                                  <input type="text" value={bData.topTitle || ''} onChange={e => updateBlockData(block.id, { ...bData, topTitle: e.target.value })} placeholder="Judul Atas" className="text-xs font-bold border border-slate-700 rounded p-1.5 bg-slate-800 text-white" />
                                  <input type="text" value={bData.topDesc || ''} onChange={e => updateBlockData(block.id, { ...bData, topDesc: e.target.value })} placeholder="Deskripsi Atas" className="text-xs border border-slate-700 rounded p-1.5 bg-slate-800 text-white" />
                                </div>
                              </div>
                              <div className="bg-white p-2 rounded-lg border border-slate-200 space-y-2">
                                <span className="text-[9px] font-bold text-slate-800 uppercase block">Node Tengah</span>
                                <div className="grid grid-cols-2 gap-2">
                                  <input type="text" value={bData.midTitle || ''} onChange={e => updateBlockData(block.id, { ...bData, midTitle: e.target.value })} placeholder="Judul Tengah" className="text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" />
                                  <input type="text" value={bData.midDesc || ''} onChange={e => updateBlockData(block.id, { ...bData, midDesc: e.target.value })} placeholder="Deskripsi Tengah" className="text-xs border border-slate-200 rounded p-1.5 bg-white" />
                                </div>
                              </div>
                              <div className="bg-[#0B4028] p-2 rounded-lg border border-[#C5A059]/30 space-y-2">
                                <span className="text-[9px] font-bold text-white uppercase block">Node Bawah</span>
                                <div className="grid grid-cols-3 gap-2">
                                  <input type="text" value={bData.botBadge || ''} onChange={e => updateBlockData(block.id, { ...bData, botBadge: e.target.value })} placeholder="Badge Bawah" className="text-xs border border-[#0B4028] rounded p-1.5 bg-white text-slate-900" />
                                  <input type="text" value={bData.botTitle || ''} onChange={e => updateBlockData(block.id, { ...bData, botTitle: e.target.value })} placeholder="Judul Bawah" className="text-xs font-bold border border-[#0B4028] rounded p-1.5 bg-white text-slate-900" />
                                  <input type="text" value={bData.botDesc || ''} onChange={e => updateBlockData(block.id, { ...bData, botDesc: e.target.value })} placeholder="Deskripsi Bawah" className="text-xs border border-[#0B4028] rounded p-1.5 bg-white text-slate-900" />
                                </div>
                              </div>
                            </div>
                          )}

                          {block.type === 'certifications_awards' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Judul Seksi</label><input type="text" value={bData.title || ''} onChange={e => updateBlockData(block.id, { ...bData, title: e.target.value })} className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 bg-white" /></div>
                                <div className="space-y-1"><label className="text-[9px] font-bold text-slate-400 block">Deskripsi Pendek</label><input type="text" value={bData.description || ''} onChange={e => updateBlockData(block.id, { ...bData, description: e.target.value })} className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white" /></div>
                              </div>
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-bold text-[#0B4028] uppercase">Daftar Sertifikat / Penghargaan</span>
                                  <button onClick={() => addBlockSubItem(block.id, 'certs', { title: "Nama Sertifikat", desc: "Deskripsi singkat" })} className="text-[9px] font-bold text-[#C5A059]"><Plus size={10} className="inline" /> Tambah Item</button>
                                </div>
                                {(bData.certs || []).map((c: any, cIdx: number) => (
                                  <div key={`cert-${cIdx}`} className="flex gap-2 items-center bg-white p-1.5 border border-slate-200 rounded">
                                    <input type="text" value={c.title} onChange={e => updateBlockSubItem(block.id, 'certs', cIdx, { ...c, title: e.target.value })} placeholder="Misal: ISO 9001:2015" className="w-1/3 text-xs font-bold border border-slate-200 rounded p-1.5" />
                                    <input type="text" value={c.desc} onChange={e => updateBlockSubItem(block.id, 'certs', cIdx, { ...c, desc: e.target.value })} placeholder="Deskripsi Singkat" className="flex-1 text-xs border border-slate-200 rounded p-1.5" />
                                    <button onClick={() => removeBlockSubItem(block.id, 'certs', cIdx)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-300">
            <div className="bg-slate-900 px-6 py-3 flex items-center justify-between border-b border-slate-800"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 block shadow-xs" /><span className="w-3 h-3 rounded-full bg-yellow-500 block shadow-xs" /><span className="w-3 h-3 rounded-full bg-green-500 block shadow-xs" /></div><span className="text-xs font-mono text-slate-400 bg-slate-950 px-6 py-1 rounded-full border border-slate-800 shadow-inner">localhost:5173/p/{slug || 'halaman-preview'}</span><span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest block flex items-center gap-1"><Eye size={12} /> MODE PENUH</span></div>
            <div className="w-full select-none pointer-events-none min-h-[600px] flex flex-col items-center justify-start">
              {blocks.length === 0 ? (
                <div className="p-32 text-center space-y-3 my-auto"><Eye size={48} className="text-slate-200 mx-auto animate-pulse" /><p className="text-sm font-black text-slate-400 uppercase tracking-widest">Panggung Pratinjau Kosong</p></div>
              ) : (
                blocks.map((block) => {
                  const bData = block.data || {};
                  const defaultMetric = { label: "Data", value: "0", unit: "Unit", subtitle: "Parameter", desc: "-" };
                  switch (block.type) {
                    case 'product_catalog': return <MasterProductCatalog key={block.id} badge={bData.badge} title={bData.title} subtitle={bData.subtitle} />;
                    case 'hero': return <MasterHero key={block.id} badgeText={bData.badge || 'KETERBUKAAN'} title={bData.title || title || 'Judul Halaman'} description={bData.desc || ''} breadcrumbCurrent={bData.breadcrumb || title || 'Preview'} imgUrl={sanitizeUrl(bData.imgUrl)} />;
                    case 'contact_form': return <MasterContactForm key={block.id} sectionBadge={bData.sectionBadge} title={bData.title} subtitle={bData.subtitle} whatsappNumber={bData.whatsappNumber} buttonText={bData.buttonText} />;
                    case 'elements': { const mappedItems = (Array.isArray(bData.items) ? bData.items : []).map((it: any, idx: number) => ({ ...it, icon: getMappedIcon(idx) })); return <MasterElementsGrid key={block.id} sectionSection={bData.section || 'KLASTER'} sectionTitle={bData.title || 'Atribut'} sectionDesc={bData.desc || ''} items={mappedItems} />; }
                    case 'flow': return <MasterExtractionFlow key={block.id} badge={bData.badge || 'ALUR'} title={bData.title || 'Mekanisme'} subtitle={bData.subtitle || ''} steps={Array.isArray(bData.steps) ? bData.steps : []} />;
                    case 'workflows': { const sanitizedWfs = (Array.isArray(bData.items) ? bData.items : []).map((wf: any) => ({ ...wf, imgUrl: sanitizeUrl(wf.imgUrl) })); return <MasterRefiningWorkflows key={block.id} sectionBadge={bData.badge || 'KERJA'} sectionTitle={bData.title || 'Sistem'} sectionDesc={bData.desc || ''} workflows={sanitizedWfs} />; }
                    case 'gallery': { const sanitizedImgs = (Array.isArray(bData.images) ? bData.images : []).map((img: any) => ({ ...img, imgUrl: sanitizeUrl(img.imgUrl) })); return <MasterGalleryGrid key={block.id} badge={bData.badge || 'CITRA'} title={bData.title || 'Aset'} tagline={bData.tagline || 'BUMN'} images={sanitizedImgs} />; }
                    case 'slider_cards': { const sanitizedCards = (Array.isArray(bData.cards) ? bData.cards : []).map((c: any) => ({ ...c, imgUrl: sanitizeUrl(c.imgUrl) })); return <MasterCarouselCards key={block.id} sectionLabel={bData.sectionLabel || ''} sectionTitle={bData.sectionTitle || ''} cards={sanitizedCards} />; }
                    case 'split_headline': return <MasterSplitHeadline key={block.id} headlineHtml={bData.headlineHtml || ''} narrative={bData.narrative || ''} imgUrl={sanitizeUrl(bData.imgUrl)} />;
                    // 👇 Meneruskan data buttonUrl ke Pratinjau 👇
                    case 'dashboard': return <MasterImpactDashboard key={block.id} sectionSection={bData.section || 'DAMPAK'} sectionTitle={bData.title || 'Kinerja'} badgeText={bData.badge || 'Metrik'} metric1={bData.metric1 || defaultMetric} metric2={bData.metric2 || defaultMetric} metric3={bData.metric3 || defaultMetric} disclaimerTitle={bData.disclaimerTitle || 'Catatan'} disclaimerDesc={bData.disclaimerDesc || 'Keterbukaan GCG'} buttonText={bData.buttonText || 'Unduh'} buttonUrl={bData.buttonUrl || '#'} />;
                    case 'cta': return <MasterCtaBanner key={block.id} title={bData.title || 'Membangun Kedaulatan'} subtitle={bData.subtitle || ''} buttonText={bData.buttonText || 'Aksi'} buttonUrl={bData.buttonUrl || '#'} />;
                    case 'faq': return <MasterFaqAccordion key={block.id} title={bData.title || 'FAQ'} subtitle={bData.subtitle || ''} faqs={Array.isArray(bData.faqs) ? bData.faqs : []} />;
                    case 'post_grid': return <MasterPostGrid key={block.id} sectionTitle={bData.sectionTitle} categorySlug={bData.categorySlug} limit={bData.limit} />;
                    case 'hero_banner': {
                      const sanitizedSlides = (Array.isArray(bData.slides) ? bData.slides : []).map((s: any) => ({ ...s, image: sanitizeUrl(s.image) }));
                      return <MasterHeroBannerPage key={block.id} slides={sanitizedSlides} quickLinks={bData.quickLinks || []} />;
                    }
                    case 'about_section': return <MasterAboutSection key={block.id} badge={bData.badge} headlineHtml={bData.headlineHtml} description={bData.description} linkText={bData.linkText} linkUrl={bData.linkUrl} imgUrl={sanitizeUrl(bData.imgUrl)} imgCaption={bData.imgCaption} />;
                    default: return null;
                    case 'purpose_section': {
                      const parsedItems = (Array.isArray(bData.items) ? bData.items : []).map((i: any) => i.text);
                      return <MasterPurposeSection key={block.id} badge={bData.badge} description={bData.description} bgImageUrl={sanitizeUrl(bData.bgImageUrl)} items={parsedItems} />;
                    }
                    case 'core_mandate': {
                      const sanitizedCards = (Array.isArray(bData.cards) ? bData.cards : []).map((c: any) => ({ ...c, bgImage: sanitizeUrl(c.bgImage) }));
                      return <MasterCoreMandate key={block.id} badge={bData.badge} titleHtml={bData.titleHtml} linkText={bData.linkText} linkUrl={bData.linkUrl} cards={sanitizedCards} />;
                    }
                    case 'strategic_sectors': {
                      const sanitizedCards = (Array.isArray(bData.cards) ? bData.cards : []).map((c: any) => ({ ...c, image: sanitizeUrl(c.image) }));
                      return <MasterStrategicSectors key={block.id} badge={bData.badge} title={bData.title} cards={sanitizedCards} />;
                    }
                    case 'leader_quote':
                      return <MasterLeaderQuote key={block.id} quoteHtml={bData.quoteHtml} authorTitle={bData.authorTitle} authorSubtitle={bData.authorSubtitle} bgImage={sanitizeUrl(bData.bgImage)} />;
                    case 'newsroom_section':
                      return <MasterNewsroomSection key={block.id} badge={bData.badge} title={bData.title} linkText={bData.linkText} linkUrl={bData.linkUrl} categorySlug={bData.categorySlug} limit={bData.limit} />;
                    case 'esg_impact':
                      return <MasterEsgImpactSection key={block.id} badge={bData.badge} title={bData.title} description={bData.description} metrics={bData.metrics} />;
                    case 'global_supply_chain':
                      return <MasterGlobalSupplyChain key={block.id} badge={bData.badge} title={bData.title} descriptionHtml={bData.descriptionHtml} regions={bData.regions} />;
                    case 'career_apprenticeship':
                      return <MasterCareerApprenticeship key={block.id} badge={bData.badge} title={bData.title} description={bData.description} buttonText={bData.buttonText} buttonUrl={bData.buttonUrl} />;
                    case 'investor_relations':
                      return <MasterInvestorRelationsStripe key={block.id} title={bData.title} subtitle={bData.subtitle} documents={bData.documents} />;
                    case 'profile_hero':
                      return <MasterProfileHero key={block.id} {...bData} />;
                    case 'mandate_history':
                      return <MasterMandateHistory key={block.id} {...bData} />;
                    case 'core_values_grid':
                      return <MasterCoreValuesGrid key={block.id} {...bData} />;
                    case 'leadership_team': {
                      const cImg = (bData.commissaries || []).map((c: any) => ({ ...c, image: sanitizeUrl(c.image) }));
                      const dImg = (bData.directors || []).map((d: any) => ({ ...d, image: sanitizeUrl(d.image) }));
                      return <MasterLeadershipTeam key={block.id} {...bData} commissaries={cImg} directors={dImg} />;
                    }
                    case 'governance_structure':
                      return <MasterGovernanceStructure key={block.id} {...bData} />;
                    case 'certifications_awards':
                      return <MasterCertificationsAwards key={block.id} {...bData} />;
                  }
                })
              )}
            </div>
            <div className="bg-slate-100 p-3 text-center border-t border-slate-200 text-xs font-bold text-slate-500 shadow-inner">Panggung merender muatan tata letak secara absolut (Full-Bleed). Klik tombol <strong className="text-[#0B4028]">"Isi Konten"</strong> di atas untuk kembali menyunting.</div>
          </div>
        )}
      </main>
    </div>
  );
};
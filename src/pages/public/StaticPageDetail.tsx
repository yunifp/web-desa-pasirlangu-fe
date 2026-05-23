/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';
import { Award, ArrowLeft, Zap, Shield, Cpu, Compass, Layers } from 'lucide-react';

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
import { MasterContactForm } from '../../components/builder/MasterContactForm';
import { MasterHeroBannerPage } from '../../components/builder/MasterHeroBannerPage';
import { MasterPostGrid } from '../../components/builder/MasterPostGrid';
import { MasterAboutSection } from '../../components/builder/MasterAboutSection';
import { MasterPurposeSection } from '../../components/builder/MasterPurposeSection';
import { MasterCoreMandate } from '../../components/builder/MasterCoreMandate';
import { MasterStrategicSectors } from '../../components/builder/MasterStrategicSectors';
import { MasterLeaderQuote } from '../../components/builder/MasterLeaderQuote';
import { MasterNewsroomSection } from '../../components/builder/MasterNewsroomSection';
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
import { MasterProductCatalog } from '../../components/builder/MasterProductCatalog'; // IMPORT BARU

interface PageDataState {
  title: string;
  slug: string;
  templateType: string;
  content: string;
}

export const StaticPageDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageData, setPageData] = useState<PageDataState | null>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isJsonContent, setIsJsonContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    if (!slug) return;

    setIsLoading(true);

    publicApi.get(`/pages/${slug}`)
      .then(res => {
        handleSuccessResponse(res.data?.data);
      })
      .catch(err => {
        console.error(err);
        setPageData(null);
        setIsLoading(false);
      });
  }, [slug]);

  const handleSuccessResponse = (d: any) => {
    if (d) {
      setPageData(d);

      if (d.content && d.content.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(d.content);
          if (Array.isArray(parsed)) {
            setBlocks(parsed);
            setIsJsonContent(true);
            setIsLoading(false);
            window.scrollTo(0, 0);
            return;
          }
        } catch (err) {
          console.warn(err);
        }
      }
      setIsJsonContent(false);
    } else {
      setPageData(null);
    }
    setIsLoading(false);
    window.scrollTo(0, 0);
  };

  const getMappedIcon = (index: number) => {
    const icons = [Zap, Shield, Cpu, Compass, Layers, Award];
    return icons[index % icons.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center font-sans select-none">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-4 border-[#0B4028]/20 border-t-[#C5A059] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Menarik Muatan Data Halaman...
          </p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-6 font-sans select-none text-center">
        <div className="max-w-md space-y-4">
          <Award size={48} className="text-slate-300 mx-auto" />
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Arsip dokumen publik dengan rute <strong className="text-slate-900 font-mono">/p/{slug}</strong> tidak terdaftar atau belum diedarkan secara resmi oleh PT Perminas.
          </p>
          <Link to="/" className="inline-block text-xs font-bold text-[#0B4028] hover:underline pt-2">
            &larr; Kembali ke Beranda Utama
          </Link>
        </div>
      </div>
    );
  }

  if (isJsonContent && blocks.length > 0) {
    return (
      <div className="w-full font-sans select-none">
        {blocks.map((block) => {
          const bData = block.data || {};

          switch (block.type) {
            case 'product_catalog':
              return <MasterProductCatalog key={block.id} badge={bData.badge} title={bData.title} subtitle={bData.subtitle} />;
            case 'hero':
              return (
                <MasterHero
                  key={block.id}
                  badgeText={bData.badge || 'KETERBUKAAN INFORMASI'}
                  title={bData.title || pageData.title}
                  description={bData.desc || ''}
                  breadcrumbCurrent={bData.breadcrumb || pageData.title}
                  imgUrl={sanitizeUrl(bData.imgUrl)}
                />
              )
            case 'elements': {
              const mappedItems = (Array.isArray(bData.items) ? bData.items : []).map((it: any, idx: number) => ({ ...it, icon: getMappedIcon(idx) }));
              return <MasterElementsGrid key={block.id} sectionSection={bData.section || 'KLASTER DATA'} sectionTitle={bData.title || 'Atribut Pokok Halaman'} sectionDesc={bData.desc || ''} items={mappedItems} />;
            }
            case 'contact_form':
              return (
                <MasterContactForm
                  key={block.id}
                  sectionBadge={bData.sectionBadge}
                  title={bData.title}
                  subtitle={bData.subtitle}
                  whatsappNumber={bData.whatsappNumber}
                  buttonText={bData.buttonText}
                />
              );
            case 'flow':
              return <MasterExtractionFlow key={block.id} badge={bData.badge || 'PETA ALUR'} title={bData.title || 'Mekanisme Pelaksanaan'} subtitle={bData.subtitle || ''} steps={Array.isArray(bData.steps) ? bData.steps : []} />;
            case 'workflows': {
              const sanitizedWorkflows = (Array.isArray(bData.items) ? bData.items : []).map((wf: any) => ({ ...wf, imgUrl: sanitizeUrl(wf.imgUrl) }));
              return <MasterRefiningWorkflows key={block.id} sectionBadge={bData.badge || 'ARSITEKTUR KERJA'} sectionTitle={bData.title || 'Tata Kelola Operasional'} sectionDesc={bData.desc || ''} workflows={sanitizedWorkflows} />;
            }
            case 'gallery': {
              const sanitizedImages = (Array.isArray(bData.images) ? bData.images : []).map((img: any) => ({ ...img, imgUrl: sanitizeUrl(img.imgUrl) }));
              return <MasterGalleryGrid key={block.id} badge={bData.badge || 'DOKUMENTASI VISUAL'} title={bData.title || 'Infrastruktur Terkait'} tagline={bData.tagline || 'Aset Resmi Korporat'} images={sanitizedImages} />;
            }
           case 'dashboard': {
              const defaultMetric = { label: "Data", value: "0", unit: "Unit", subtitle: "Parameter", desc: "-" };
              return <MasterImpactDashboard key={block.id} sectionSection={bData.section || 'PROSPEKSI STRATEGIS'} sectionTitle={bData.title || 'Peta Pencapaian Kinerja'} badgeText={bData.badge || 'Metrik Terukur'} metric1={bData.metric1 || defaultMetric} metric2={bData.metric2 || defaultMetric} metric3={bData.metric3 || defaultMetric} disclaimerTitle={bData.disclaimerTitle || 'Catatan Pengawasan BUMN'} disclaimerDesc={bData.disclaimerDesc || 'Seluruh data di atas disiarkan secara resmi guna mematuhi prinsip Good Corporate Governance (GCG).'} buttonText={bData.buttonText || 'Unduh Kajian Terkait'} buttonUrl={bData.buttonUrl || '#'} />;
            }
            case 'cta':
              return <MasterCtaBanner key={block.id} title={bData.title || 'Mari Membangun Kedaulatan Rantai Pasok Bersama'} subtitle={bData.subtitle || ''} buttonText={bData.buttonText || 'Hubungi Kemitraan'} buttonUrl={bData.buttonUrl || '#'} />;
            case 'faq':
              return <MasterFaqAccordion key={block.id} title={bData.title || 'Pertanyaan yang Sering Diajukan'} subtitle={bData.subtitle || ''} faqs={Array.isArray(bData.faqs) ? bData.faqs : []} />;
            case 'slider_cards': {
              const sanitizedCards = (Array.isArray(bData.cards) ? bData.cards : []).map((c: any) => ({ ...c, imgUrl: sanitizeUrl(c.imgUrl) }));
              return <MasterCarouselCards key={block.id} sectionLabel={bData.sectionLabel || ''} sectionTitle={bData.sectionTitle || ''} cards={sanitizedCards} />;
            }
            case 'split_headline':
              return <MasterSplitHeadline key={block.id} headlineHtml={bData.headlineHtml || ''} narrative={bData.narrative || ''} imgUrl={sanitizeUrl(bData.imgUrl)} />;
            case 'hero_banner': {
              const sanitizedSlides = (Array.isArray(bData.slides) ? bData.slides : []).map((s: any) => ({ ...s, image: sanitizeUrl(s.image) }));
              return <MasterHeroBannerPage key={block.id} slides={sanitizedSlides} quickLinks={bData.quickLinks || []} />;
            }
            case 'post_grid':
              return <MasterPostGrid key={block.id} sectionTitle={bData.sectionTitle} categorySlug={bData.categorySlug} limit={bData.limit} />;
            case 'about_section':
              return <MasterAboutSection key={block.id} badge={bData.badge} headlineHtml={bData.headlineHtml} description={bData.description} linkText={bData.linkText} linkUrl={bData.linkUrl} imgUrl={sanitizeUrl(bData.imgUrl)} imgCaption={bData.imgCaption} />;
            default:
              return null;
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
        })}
      </div>
    );
  }

  return (
    <div className="bg-white pb-24 font-sans selection:bg-[#0B4028] selection:text-white">
      <header className="relative pt-32 pb-12 overflow-hidden bg-slate-50 border-b border-slate-100 text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B4028]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0B4028] transition-colors">
              <ArrowLeft size={12} /> Kembali ke Beranda
            </Link>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {pageData.title}
          </h1>
          <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest block">
            DOKUMEN RESMI // SLUG: {pageData.slug}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <article
          className="prose prose-slate prose-lg max-w-none 
            font-serif text-slate-700 leading-relaxed
            prose-headings:font-sans prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
            prose-strong:text-slate-900 prose-strong:font-black
            prose-p:mb-6 prose-p:text-justify
            prose-a:text-[#0B4028] prose-a:font-bold hover:prose-a:text-[#C5A059]"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </main>
    </div>
  );
};
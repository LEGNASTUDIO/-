import React from 'react';
import { WorkItem, ProcessStep, SiteContent, PageView } from '../types';
import { ArrowRight, ArrowDown, Mail, Instagram } from 'lucide-react';

interface HomeViewProps {
  works: WorkItem[];
  processSteps: ProcessStep[];
  siteContent: SiteContent;
  onNavigate: (page: PageView) => void;
  onSelectWork: (work: WorkItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  works,
  processSteps,
  siteContent,
  onNavigate,
  onSelectWork,
}) => {
  // Sort or take works for selected layout
  const sortedWorks = [...works].sort((a, b) => a.order - b.order);
  const featuredWork = sortedWorks.find((w) => w.isFeatured) || sortedWorks[0];

  const getInstagramUrl = () => {
    if (siteContent.instagramUrl && siteContent.instagramUrl.trim()) {
      return siteContent.instagramUrl.startsWith('http')
        ? siteContent.instagramUrl
        : `https://${siteContent.instagramUrl}`;
    }
    if (siteContent.instagramHandle && siteContent.instagramHandle.trim()) {
      if (siteContent.instagramHandle.startsWith('http')) return siteContent.instagramHandle;
      const cleanHandle = siteContent.instagramHandle.replace(/^@/, '').trim();
      return `https://instagram.com/${cleanHandle}`;
    }
    return 'https://instagram.com';
  };

  const getInstagramDisplay = () => {
    if (!siteContent.instagramHandle || !siteContent.instagramHandle.trim()) return '@legna_hanji';
    const handle = siteContent.instagramHandle.trim();
    if (handle.startsWith('http')) {
      const parts = handle.split('/').filter(Boolean);
      const last = parts[parts.length - 1] || 'instagram';
      return `@${last}`;
    }
    return handle.startsWith('@') ? handle : `@${handle}`;
  };

  const email = siteContent.contactEmail || 'contact@legnacraft.com';
  const instaUrl = getInstagramUrl();
  const instaDisplay = getInstagramDisplay();

  // Featured Project: either marked isFeatured or the primary work
  const scrollToWorks = () => {
    const el = document.getElementById('section-selected-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-32 sm:space-y-40 md:space-y-48">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 01: HERO
          Minimal, quiet, spacious opening
          ───────────────────────────────────────────────────────────── */}
      <section
        id="home-hero"
        className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-12 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto"
      >
        <div className="pt-10 md:pt-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#77736B] font-mono">
              Craft Practice & Light Objects
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
            <div>
              {siteContent.logoImage ? (
                <div className="space-y-3">
                  <img
                    src={siteContent.heroLogoImage || siteContent.logoImage}
                    alt={siteContent.brandName || 'LEGNA'}
                    className="max-h-14 sm:max-h-16 md:max-h-20 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#77736B] font-sans font-light block">
                    Hanji, Bamboo & Soft Illuminations
                  </span>
                </div>
              ) : (
                <div>
                  <h1 className="font-brand font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.22em] text-[#171717] leading-tight">
                    {siteContent.brandName || 'LEGNA'}
                  </h1>
                  <span className="text-[10px] sm:text-xs tracking-[0.32em] uppercase text-[#77736B] font-sans font-light block mt-3">
                    Hanji, Bamboo & Soft Illuminations
                  </span>
                </div>
              )}
            </div>

            {siteContent.heroSubheadline && (
              <p className="text-sm sm:text-base text-[#77736B] max-w-md font-light leading-relaxed pb-2">
                {siteContent.heroSubheadline}
              </p>
            )}
          </div>
        </div>

        {/* Hero Ambient Image Framing */}
        <div className="my-8 w-full">
          {(() => {
            const fitMode = siteContent.heroImageFitMode || 'cover';
            const aspectRatio = siteContent.heroImageAspectRatio || 'wide';
            const bgColor = siteContent.heroImageBgColor || '#EAE6DC';
            const customHeight = siteContent.heroImageHeight;
            const isBlurBg = bgColor === 'blur';

            // Default aspect classes: expanded with taller default ratios
            let aspectClass = 'aspect-[16/10] sm:aspect-[16/9] lg:aspect-[19/9] w-full min-h-[460px] sm:min-h-[560px] lg:min-h-[640px]';
            if (customHeight && customHeight > 0) {
              aspectClass = 'w-full';
            } else if (fitMode === 'natural' || aspectRatio === 'natural') {
              aspectClass = 'w-full max-h-[88vh] min-h-[400px] flex items-center justify-center';
            } else if (aspectRatio === 'tall') {
              aspectClass = 'aspect-[16/11] sm:aspect-[16/10] w-full min-h-[520px] sm:min-h-[680px] lg:min-h-[780px]';
            } else if (aspectRatio === 'cinematic') {
              aspectClass = 'aspect-[16/9] sm:aspect-[21/9] w-full min-h-[400px] sm:min-h-[500px]';
            } else if (aspectRatio === 'standard') {
              aspectClass = 'aspect-[4/3] sm:aspect-[16/10] w-full max-w-5xl mx-auto min-h-[480px]';
            } else if (aspectRatio === 'square') {
              aspectClass = 'aspect-square w-full max-w-3xl mx-auto min-h-[480px]';
            } else if (aspectRatio === 'portrait') {
              aspectClass = 'aspect-[3/4] sm:aspect-[4/5] w-full max-w-3xl mx-auto min-h-[560px]';
            }

            const imgUrl = siteContent.heroMainImage || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=2000&q=85';

            return (
              <div
                className={`editorial-img-container ${aspectClass} overflow-hidden border border-[#DEDAD2]/80 relative transition-all duration-300`}
                style={{
                  backgroundColor: !isBlurBg ? bgColor : undefined,
                  height: customHeight && customHeight > 0 ? `${customHeight}px` : undefined,
                }}
              >
                {/* Optional subtle blurred backdrop for contain mode */}
                {isBlurBg && (
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-30 pointer-events-none"
                    style={{ backgroundImage: `url(${imgUrl})` }}
                  />
                )}

                <img
                  src={imgUrl}
                  alt="LEGNA Hanji and Light Study"
                  className={`w-full h-full relative z-10 transition-all duration-200 ${
                    fitMode === 'contain'
                      ? 'object-contain p-2 sm:p-4'
                      : fitMode === 'natural'
                      ? 'object-contain max-h-[85vh] w-auto h-auto mx-auto'
                      : 'object-cover'
                  }`}
                  style={{
                    objectPosition: `${siteContent.heroImagePositionX ?? 50}% ${siteContent.heroImagePositionY ?? 50}%`,
                    transform: siteContent.heroImageZoom && siteContent.heroImageZoom !== 100 ? `scale(${siteContent.heroImageZoom / 100})` : undefined,
                    transformOrigin: `${siteContent.heroImagePositionX ?? 50}% ${siteContent.heroImagePositionY ?? 50}%`,
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
            );
          })()}
        </div>

        {/* Bottom subtle scroll indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-[#DEDAD2]/60">
          <span className="text-[10px] tracking-[0.25em] text-[#9E9A91] uppercase font-mono">
            Seoul, Korea • 2026
          </span>
          <button
            id="hero-scroll-down-btn"
            onClick={scrollToWorks}
            className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-[#77736B] hover:text-[#171717] transition-colors uppercase font-mono"
          >
            <span>SCROLL</span>
            <ArrowDown className="w-3 h-3 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 02: SELECTED WORKS
          Magazine-style asymmetric layout (Not generic 3-column cards)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="section-selected-works"
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
      >
        <div className="flex items-baseline justify-between mb-12 sm:mb-16 border-b border-[#DEDAD2] pb-4">
          <h2 className="text-xs sm:text-sm tracking-[0.25em] font-medium uppercase text-[#171717]">
            SELECTED WORKS
          </h2>
          <button
            onClick={() => onNavigate('WORKS')}
            className="text-xs tracking-[0.15em] text-[#77736B] hover:text-[#171717] transition-colors inline-flex items-center gap-1"
          >
            <span>VIEW ALL ({works.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 sm:gap-x-12 gap-y-16 sm:gap-y-20">
          {sortedWorks.slice(0, 4).map((work) => (
            <div
              key={work.id}
              id={`selected-work-${work.id}`}
              onClick={() => onSelectWork(work)}
              className="group cursor-pointer space-y-4"
            >
              {/* Uniform Clean Aspect Ratio for all Selected Works */}
              <div className="editorial-img-container aspect-[16/11] bg-[#EAE6DC] w-full border border-[#DEDAD2]/80 transition-all duration-300 group-hover:border-[#171717]/40">
                <img
                  src={work.coverImage}
                  alt={work.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Clean, Uniform Caption Layout */}
              <div className="pt-2 border-t border-[#DEDAD2]/60 group-hover:border-[#171717] transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#77736B] tracking-wider">
                    NO. {work.numberCode}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-[#9E9A91] uppercase">
                    {work.category}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-light text-[#171717] group-hover:underline underline-offset-4 decoration-[0.5px]">
                    {work.title}
                  </h3>
                  <span className="text-xs text-[#77736B] font-mono flex-shrink-0">
                    {work.year}
                  </span>
                </div>

                <p className="text-xs text-[#77736B] font-mono truncate">
                  {work.materials}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 03: ABOUT LEGNA & ARTIST
          Left: Short Statement / Right: Work Detail Image
          ───────────────────────────────────────────────────────────── */}
      <section
        id="section-about-legna"
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
      >
        <div className="border-t border-[#DEDAD2] pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-8">
            <span className="text-xs tracking-[0.25em] uppercase text-[#77736B] font-medium block">
              ABOUT {siteContent.brandName || 'LEGNA'}
            </span>
            <div className="space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light leading-snug text-[#171717]">
                {siteContent.aboutLegnaIntro || `${siteContent.brandName || 'LEGNA'} is a craft practice built around Hanji.`}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#77736B] font-light leading-relaxed whitespace-pre-line">
                {siteContent.aboutLegnaBody || (
                  <p>
                    한 장의 종이가 색을 만나고,
                    <br />
                    구조를 만나고,
                    <br />
                    하나의 오브제가 되는 과정을 기록합니다.
                  </p>
                )}
              </div>

              {/* Artist Statement if provided */}
              {siteContent.artistIntro && (
                <div className="p-4 bg-[#EAE6DC]/40 border-l-2 border-[#171717] space-y-1.5 mt-2">
                  <span className="text-[10px] font-mono tracking-widest text-[#77736B] uppercase block font-semibold">
                    Artist Statement / 작가 소개
                  </span>
                  <p className="text-xs sm:text-sm text-[#171717] font-light leading-relaxed whitespace-pre-line">
                    {siteContent.artistIntro}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                id="about-read-more-btn"
                onClick={() => onNavigate('ABOUT')}
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#171717] hover:text-[#77736B] transition-colors border-b border-[#171717] pb-1"
              >
                <span>READ PHILOSOPHY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-6">
            <div className="editorial-img-container aspect-[4/5] bg-[#EAE6DC] border border-[#DEDAD2]/80">
              <img
                src={siteContent.aboutSectionImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'}
                alt="LEGNA Studio Detail"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[10px] text-[#77736B] tracking-widest uppercase font-mono mt-3 text-right">
              Studio Tactile Detail • Paper & Light
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 04: MATERIAL (HANJI)
          Extreme macro texture + poetic one-liner
          ───────────────────────────────────────────────────────────── */}
      <section
        id="section-material"
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
      >
        <div className="border-t border-[#DEDAD2] pt-16 sm:pt-24 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm tracking-[0.25em] font-medium uppercase text-[#171717]">
              MATERIAL — HANJI
            </h2>
            <span className="text-[11px] font-mono text-[#77736B]">
              KOREAN MULBERRY PAPER
            </span>
          </div>

          {/* Extreme Macro Texture Photo */}
          <div className="editorial-img-container aspect-[21/9] sm:aspect-[24/9] w-full bg-[#EAE6DC] border border-[#DEDAD2]/80">
            <img
              src={siteContent.materialSectionImage || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=2000&q=85'}
              alt="Extreme macro Hanji texture and fibers"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Quote & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 pt-4">
            <div className="space-y-2 max-w-xl">
              <p className="font-serif text-xl sm:text-2xl md:text-3xl font-light italic text-[#171717]">
                “{siteContent.materialQuoteEn}”
              </p>
              <p className="text-sm sm:text-base text-[#77736B] font-light">
                {siteContent.materialQuoteKo}
              </p>
            </div>

            <button
              id="material-view-process-btn"
              onClick={() => onNavigate('PROCESS')}
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#171717] hover:text-[#77736B] transition-colors border-b border-[#171717] pb-1 w-fit"
            >
              <span>VIEW PROCESS →</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 05: PROCESS PREVIEW
          4 Pure Photos + Clean Typography (NO infographic clutter)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="section-process-preview"
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
      >
        <div className="border-t border-[#DEDAD2] pt-16 sm:pt-24 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm tracking-[0.25em] font-medium uppercase text-[#171717]">
              PROCESS
            </h2>
            <button
              onClick={() => onNavigate('PROCESS')}
              className="text-xs tracking-[0.15em] text-[#77736B] hover:text-[#171717] transition-colors"
            >
              FULL STORY →
            </button>
          </div>

          {/* 4 Image + Typography Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="space-y-4 group cursor-pointer"
                onClick={() => onNavigate('PROCESS')}
              >
                <div className="editorial-img-container aspect-[3/4] bg-[#EAE6DC] border border-[#DEDAD2]/80">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#77736B]">
                      {step.stepNumber}
                    </span>
                    <h3 className="font-serif text-base tracking-[0.15em] font-medium text-[#171717]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#77736B] font-light leading-relaxed">
                    {step.koreanTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 06: FEATURED PROJECT
          In-depth focus on a signature piece with disciplined photo alignment
          ───────────────────────────────────────────────────────────── */}
      {featuredWork && (
        <section
          id="section-featured-project"
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
        >
          <div className="border-t border-[#DEDAD2] pt-16 sm:pt-24 space-y-12">
            <div className="flex items-baseline justify-between border-b border-[#DEDAD2] pb-4">
              <h2 className="text-xs sm:text-sm tracking-[0.25em] font-medium uppercase text-[#171717]">
                FEATURED PROJECT
              </h2>
              <span className="text-xs font-mono text-[#77736B]">
                NO. {featuredWork.numberCode} • {featuredWork.year}
              </span>
            </div>

            {/* Disciplined 2-column Gallery & Specs Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Photos Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div
                  className="editorial-img-container aspect-[16/10] w-full bg-[#EAE6DC] border border-[#DEDAD2]/80 cursor-pointer group"
                  onClick={() => onSelectWork(featuredWork)}
                >
                  <img
                    src={featuredWork.coverImage}
                    alt={featuredWork.title}
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Structured Sub-photos Grid (Equal 4:3 Ratio) */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {featuredWork.detailImage && (
                    <div className="space-y-2">
                      <div className="editorial-img-container aspect-[4/3] bg-[#EAE6DC] border border-[#DEDAD2]/80">
                        <img
                          src={featuredWork.detailImage}
                          alt="Texture Detail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-[10px] text-[#77736B] uppercase font-mono tracking-wider">
                        Detail • Texture
                      </p>
                    </div>
                  )}
                  {featuredWork.spaceImage && (
                    <div className="space-y-2">
                      <div className="editorial-img-container aspect-[4/3] bg-[#EAE6DC] border border-[#DEDAD2]/80">
                        <img
                          src={featuredWork.spaceImage}
                          alt="Space Installation"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-[10px] text-[#77736B] uppercase font-mono tracking-wider">
                        Context • Space
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Project Details Column (5 cols) */}
              <div className="lg:col-span-5 space-y-8 lg:pl-2">
                <div className="space-y-3">
                  <span className="text-[11px] font-mono tracking-[0.25em] text-[#77736B] uppercase block">
                    PROJECT {featuredWork.numberCode} / {featuredWork.category}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#171717] leading-tight">
                    {featuredWork.title}
                  </h3>
                  {featuredWork.subtitle && (
                    <p className="text-sm text-[#77736B] italic font-serif">
                      {featuredWork.subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-4 text-sm text-[#77736B] font-light leading-relaxed">
                  <p className="text-[#171717] font-normal leading-relaxed">
                    {featuredWork.shortDescription}
                  </p>
                  <p className="text-xs leading-relaxed">
                    {featuredWork.fullDescription}
                  </p>
                </div>

                {/* Clean Specs Table */}
                <div className="border-t border-b border-[#DEDAD2] py-4 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#9E9A91]">Materials</span>
                    <span className="text-[#171717] text-right">{featuredWork.materials}</span>
                  </div>
                  {featuredWork.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-[#9E9A91]">Dimensions</span>
                      <span className="text-[#171717]">{featuredWork.dimensions}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#9E9A91]">Year</span>
                    <span className="text-[#171717]">{featuredWork.year}</span>
                  </div>
                </div>

                <div>
                  <button
                    id="view-featured-project-btn"
                    onClick={() => onSelectWork(featuredWork)}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-[#171717] text-[#F7F5F0] hover:bg-[#333333] transition-colors text-xs tracking-[0.2em] uppercase font-medium"
                  >
                    <span>VIEW PROJECT →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 07: CONTACT
          Quiet invitation to collaborate
          ───────────────────────────────────────────────────────────── */}
      <section
        id="section-home-contact"
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
      >
        <div className="border-t border-[#DEDAD2] pt-20 sm:pt-28 pb-8 text-center space-y-8 max-w-2xl mx-auto">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#77736B] font-mono block">
            Studio Contact
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-[#171717]">
            Let's work together.
          </h2>

          <p className="text-sm sm:text-base text-[#77736B] font-light leading-relaxed">
            작품에 대한 문의와
            <br />
            전시, 공간 협업, 제작 문의를 받습니다.
          </p>

          <div className="pt-4">
            <button
              id="home-contact-btn"
              onClick={() => onNavigate('CONTACT')}
              className="inline-flex items-center justify-center px-10 py-4 bg-[#171717] text-[#F7F5F0] hover:bg-[#333333] transition-colors text-xs tracking-[0.25em] uppercase font-medium"
            >
              CONTACT
            </button>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#77736B] font-mono tracking-wider">
            <a
              href={instaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#171717] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{instaDisplay}</span>
            </a>
            <span className="text-[#DEDAD2]">•</span>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 hover:text-[#171717] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{email}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

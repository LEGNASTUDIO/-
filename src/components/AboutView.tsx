import React from 'react';
import { SiteContent } from '../types';

interface AboutViewProps {
  siteContent: SiteContent;
}

export const AboutView: React.FC<AboutViewProps> = ({ siteContent }) => {
  return (
    <div className="pt-32 sm:pt-40 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-[85vh] space-y-24 sm:space-y-32">
      {/* Title Header */}
      <div className="border-b border-[#DEDAD2] pb-6">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#77736B] block mb-2 font-mono">
          PRACTICE & PHILOSOPHY
        </span>
        <h1 className="font-brand font-normal text-4xl sm:text-5xl tracking-[0.2em] text-[#171717]">
          ABOUT
        </h1>
      </div>

      {/* 01: LEGNA Brand */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[11px] tracking-[0.25em] font-mono uppercase text-[#77736B] block">
            01 — LEGNA
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light leading-snug text-[#171717]">
            Light & Form from Traditional Korean Paper
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[#77736B] font-light leading-relaxed">
            <p>
              LEGNA는 한지를 기반으로
              <br />
              빛과 형태를 탐구하는 공예 브랜드입니다.
            </p>
            <p>
              손으로 만들어지는 과정에서 생기는
              <br />
              미세한 차이를 작업의 일부로 받아들이며,
            </p>
            <p>
              일상 속에 오래 머무를 수 있는
              <br />
              조용한 오브제를 만듭니다.
            </p>
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="editorial-img-container aspect-[4/3] bg-[#EAE6DC] border border-[#DEDAD2]/80">
            <img
              src={siteContent.aboutSectionImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'}
              alt="LEGNA Studio"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* 02: ARTIST */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-t border-[#DEDAD2] pt-20">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <div className="editorial-img-container aspect-[4/5] bg-[#EAE6DC] border border-[#DEDAD2]/80">
            <img
              src={siteContent.artistSectionImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85'}
              alt="Artist in Craft Studio"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
          <span className="text-[11px] tracking-[0.25em] font-mono uppercase text-[#77736B]">
            02 — ARTIST & PRACTICE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light leading-snug text-[#171717]">
            Hands, Material, and Quiet Breath
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[#77736B] font-light leading-relaxed">
            <p>
              {siteContent.artistIntro}
            </p>
            <p>
              한지 장인이 떠낸 닥나무 종이를 마주할 때, 종이 한 장에 깃든 햇살과 바람, 물의 시간을 먼저 읽어냅니다.
              빛이 종이를 통과할 때 드러나는 섬유의 불규칙한 결은 기계가 흉내 낼 수 없는 따뜻한 음영을 공간에 선사합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 03: PHILOSOPHY */}
      <section className="border-t border-[#DEDAD2] pt-20 pb-12 max-w-3xl mx-auto space-y-8 text-center">
        <span className="text-[11px] tracking-[0.25em] font-mono uppercase text-[#77736B]">
          03 — PHILOSOPHY
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-light leading-snug text-[#171717]">
          “시간이 지날수록 깊어지는 조용한 빛”
        </h2>
        <p className="text-sm sm:text-base text-[#77736B] font-light leading-relaxed">
          {siteContent.philosophyText}
        </p>
        <p className="text-xs sm:text-sm text-[#9E9A91] italic font-serif pt-4">
          — LEGNA Studio, Seoul
        </p>
      </section>
    </div>
  );
};

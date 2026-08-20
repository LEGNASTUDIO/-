import React from 'react';
import { ProcessStep } from '../types';

interface ProcessViewProps {
  processSteps: ProcessStep[];
}

export const ProcessView: React.FC<ProcessViewProps> = ({ processSteps }) => {
  return (
    <div className="pt-32 sm:pt-40 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-[85vh] space-y-28 sm:space-y-36">
      {/* Page Header */}
      <div className="border-b border-[#DEDAD2] pb-6">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#77736B] block mb-2 font-mono">
          MAKING & CRAFT
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-[#171717]">
          HOW IT'S MADE
        </h1>
        <p className="mt-4 text-sm sm:text-base text-[#77736B] font-light max-w-2xl">
          손으로 재료를 만지고, 형태를 빚고, 빛을 담아내는 LEGNA의 제작 과정을 소개합니다.
        </p>
      </div>

      {/* Large Hero Hanji Material Visual */}
      <div className="space-y-4">
        <div className="editorial-img-container aspect-[21/9] sm:aspect-[24/9] w-full bg-[#EAE6DC] border border-[#DEDAD2]/80">
          <img
            src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=2000&q=85"
            alt="Raw Korean Mulberry Hanji Texture"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex justify-between items-baseline text-xs text-[#77736B] font-mono">
          <span>RAW MATERIAL: KOREAN DAK HANJI</span>
          <span>100% NATURAL FIBERS</span>
        </div>
      </div>

      {/* 4 In-depth Craft Steps */}
      <div className="space-y-24 sm:space-y-32">
        {processSteps.map((step, index) => {
          const isEven = index % 2 === 1;
          return (
            <section
              key={step.stepNumber}
              id={`process-step-${step.stepNumber}`}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-t border-[#DEDAD2] pt-16 sm:pt-24`}
            >
              {/* Image side */}
              <div
                className={`lg:col-span-6 ${
                  isEven ? 'order-1 lg:order-2' : 'order-1'
                }`}
              >
                <div className="editorial-img-container aspect-[4/3] bg-[#EAE6DC] border border-[#DEDAD2]/80">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Text side */}
              <div
                className={`lg:col-span-6 space-y-6 ${
                  isEven ? 'order-2 lg:order-1' : 'order-2'
                }`}
              >
                <span className="text-xs tracking-[0.3em] font-mono uppercase text-[#77736B]">
                  STEP {step.stepNumber}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-[#171717]">
                  {step.title}
                </h2>
                <h3 className="text-base sm:text-lg font-light text-[#171717]">
                  {step.koreanTitle}
                </h3>
                <p className="text-sm sm:text-base text-[#77736B] font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

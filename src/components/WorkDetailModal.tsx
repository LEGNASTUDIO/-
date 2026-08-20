import React, { useEffect } from 'react';
import { WorkItem } from '../types';
import { X, ArrowRight } from 'lucide-react';

interface WorkDetailModalProps {
  work: WorkItem | null;
  onClose: () => void;
  onInquire: (workTitle: string) => void;
}

export const WorkDetailModal: React.FC<WorkDetailModalProps> = ({
  work,
  onClose,
  onInquire,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (work) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [work, onClose]);

  if (!work) return null;

  return (
    <div
      id="work-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#171717]/60 backdrop-blur-sm flex justify-center p-0 sm:p-4 md:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#F7F5F0] text-[#171717] w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-none shadow-2xl p-6 sm:p-10 md:p-14 relative my-auto border border-[#DEDAD2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center pb-6 border-b border-[#DEDAD2]">
          <span className="text-[11px] tracking-[0.25em] text-[#77736B] uppercase font-mono">
            PROJECT {work.numberCode}
          </span>
          <button
            id="close-work-detail-btn"
            onClick={onClose}
            className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#77736B] hover:text-[#171717] transition-colors p-1"
          >
            <span>CLOSE</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header Information */}
        <div className="pt-8 pb-10 space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-[#171717]">
            {work.title}
          </h2>
          {work.subtitle && (
            <p className="text-sm text-[#77736B] italic font-serif">
              {work.subtitle}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#77736B] font-mono">
            <span>{work.year}</span>
            <span>•</span>
            <span>{work.materials}</span>
            {work.dimensions && (
              <>
                <span>•</span>
                <span>{work.dimensions}</span>
              </>
            )}
          </div>
        </div>

        {/* Imagery Section - Order: Overall -> Detail -> Space -> Craft */}
        <div className="space-y-12 my-8">
          {/* 1. Large Main View (전체 이미지) */}
          <div className="space-y-2">
            <div className="bg-[#EAE6DC] overflow-hidden aspect-[4/3] sm:aspect-[16/10]">
              <img
                src={work.coverImage}
                alt={`${work.title} - Main View`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[11px] text-[#77736B] tracking-wider uppercase font-mono">
              [ 01 Overall Form / 전체 형태 ]
            </p>
          </div>

          {/* Text Story Interlude */}
          <div className="py-6 border-y border-[#DEDAD2] max-w-2xl">
            <p className="text-base sm:text-lg text-[#171717] font-light leading-relaxed mb-3">
              {work.shortDescription}
            </p>
            <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed">
              {work.fullDescription}
            </p>
          </div>

          {/* 2 & 3. Detail & Space Images Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {work.detailImage && (
              <div className="space-y-2">
                <div className="bg-[#EAE6DC] overflow-hidden aspect-square sm:aspect-[4/3]">
                  <img
                    src={work.detailImage}
                    alt={`${work.title} - Detail & Texture`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[11px] text-[#77736B] tracking-wider uppercase font-mono">
                  [ 02 Detail & Tactile Texture / 디테일 ]
                </p>
              </div>
            )}

            {work.spaceImage && (
              <div className="space-y-2">
                <div className="bg-[#EAE6DC] overflow-hidden aspect-square sm:aspect-[4/3]">
                  <img
                    src={work.spaceImage}
                    alt={`${work.title} - Space Installation`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[11px] text-[#77736B] tracking-wider uppercase font-mono">
                  [ 03 Space & Ambient Light / 공간 적용 ]
                </p>
              </div>
            )}
          </div>

          {/* 4. Craft Process image if available */}
          {work.craftImage && (
            <div className="space-y-2 pt-4">
              <div className="bg-[#EAE6DC] overflow-hidden aspect-[16/9]">
                <img
                  src={work.craftImage}
                  alt={`${work.title} - Craft Process`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[11px] text-[#77736B] tracking-wider uppercase font-mono">
                [ 04 Handcraft & Making / 제작 과정 ]
              </p>
            </div>
          )}

          {/* 5. Additional Multiple Gallery Images (다중 첨부 이미지 갤러리) */}
          {work.galleryImages && work.galleryImages.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-[#DEDAD2]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono tracking-[0.2em] text-[#171717] uppercase font-semibold">
                  ADDITIONAL PHOTOGRAPHS ({work.galleryImages.length})
                </span>
                <span className="text-[10px] font-mono text-[#77736B]">
                  [ 추가 첨부 사진 아카이브 ]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {work.galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="space-y-2 group">
                    <div className="bg-[#EAE6DC] border border-[#DEDAD2] overflow-hidden aspect-[4/3] relative">
                      <img
                        src={imgUrl}
                        alt={`${work.title} - Additional View ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-[10px] text-[#77736B] tracking-widest uppercase font-mono">
                      VIEW {String(idx + 1).padStart(2, '0')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Bottom */}
        <div className="pt-10 mt-10 border-t border-[#DEDAD2] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs text-[#77736B]">
              작품 소장, 공간 맞춤 제작 및 전시 대여 문의
            </p>
          </div>
          <button
            id={`inquire-btn-${work.id}`}
            onClick={() => {
              onClose();
              onInquire(work.title);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#171717] text-[#F7F5F0] hover:bg-[#333333] transition-colors text-xs tracking-[0.2em] uppercase font-medium"
          >
            <span>INQUIRE ABOUT THIS WORK</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { WorkItem, WorkCategory } from '../types';

interface WorksViewProps {
  works: WorkItem[];
  onSelectWork: (work: WorkItem) => void;
}

type FilterOption = 'ALL' | WorkCategory;

export const WorksView: React.FC<WorksViewProps> = ({ works, onSelectWork }) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('ALL');

  const filterOptions: FilterOption[] = ['ALL', 'LIGHT', 'OBJECTS', 'EXPERIMENTS'];

  const filteredWorks = works.filter((work) => {
    if (selectedFilter === 'ALL') return true;
    return work.category === selectedFilter;
  });

  return (
    <div className="pt-32 sm:pt-40 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 min-h-[85vh]">
      {/* Top Title & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#DEDAD2] pb-6 mb-16 gap-6">
        <div>
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#77736B] block mb-2 font-mono">
            ARCHIVE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-[#171717]">
            WORKS
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center flex-wrap gap-6 sm:gap-8 text-xs tracking-[0.2em] font-mono">
          {filterOptions.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <button
                key={filter}
                id={`filter-btn-${filter.toLowerCase()}`}
                onClick={() => setSelectedFilter(filter)}
                className={`py-1 relative transition-colors ${
                  isActive
                    ? 'text-[#171717] font-semibold'
                    : 'text-[#9E9A91] hover:text-[#171717]'
                }`}
              >
                {filter}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#171717]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial Gallery Grid */}
      {filteredWorks.length === 0 ? (
        <div className="py-24 text-center text-sm text-[#77736B]">
          해당 카테고리의 작품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-10 gap-y-16 sm:gap-y-20">
          {filteredWorks.map((work) => (
            <div
              key={work.id}
              id={`work-grid-item-${work.id}`}
              onClick={() => onSelectWork(work)}
              className="group cursor-pointer space-y-4"
            >
              <div className="editorial-img-container aspect-[4/3] bg-[#EAE6DC] border border-[#DEDAD2]/80 transition-all duration-300 group-hover:border-[#171717]/40 w-full">
                <img
                  src={work.coverImage}
                  alt={work.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Information Underneath */}
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
                  <h2 className="font-serif text-lg sm:text-xl font-light text-[#171717] group-hover:underline underline-offset-4 decoration-[0.5px]">
                    {work.title}
                  </h2>
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
      )}
    </div>
  );
};

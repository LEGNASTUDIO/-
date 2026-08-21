import React from 'react';
import { PageView, SiteContent } from '../types';
import { Mail, Instagram } from 'lucide-react';

interface FooterProps {
  siteContent: SiteContent;
  onNavigate: (page: PageView) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  siteContent,
  onNavigate,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
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

  return (
    <footer id="main-footer" className="border-t border-[#DEDAD2] bg-[#F7F5F0] pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <button
              onClick={() => {
                onNavigate('HOME');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left focus:outline-none group"
            >
              {siteContent.logoImage ? (
                <div className="flex items-center gap-3">
                  <img
                    src={siteContent.logoImage}
                    alt={siteContent.brandName || 'LEGNA'}
                    style={{ height: `${siteContent.logoHeight || 30}px` }}
                    className="max-h-10 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <span className="sr-only">{siteContent.brandName || 'LEGNA'}</span>
                </div>
              ) : (
                <>
                  <span className="font-brand font-normal text-2xl tracking-[0.26em] text-[#171717] block leading-tight">
                    {siteContent.brandName || 'LEGNA'}
                  </span>
                  <span className="text-[9px] tracking-[0.32em] uppercase text-[#77736B] font-sans font-light block mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    Contemporary Hanji Craft
                  </span>
                </>
              )}
            </button>
            <p className="text-xs text-[#77736B] leading-relaxed max-w-sm font-sans pt-1 whitespace-pre-line">
              {siteContent.aboutLegnaBody ||
                siteContent.heroSubheadline ||
                '한지와 대나무, 빛을 탐구하는 조용한 오브제를 만듭니다.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-[11px] tracking-[0.25em] text-[#77736B] uppercase block mb-3 font-medium">
              Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('WORKS');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#171717] hover:text-[#77736B] transition-colors"
                >
                  Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('ABOUT');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#171717] hover:text-[#77736B] transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('PROCESS');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#171717] hover:text-[#77736B] transition-colors"
                >
                  Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('CONTACT');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#171717] hover:text-[#77736B] transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Inquiries */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[11px] tracking-[0.25em] text-[#77736B] uppercase block mb-3 font-medium">
              Inquiries & Connect
            </span>
            <div className="space-y-2 text-xs font-mono">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-[#171717] hover:text-amber-800 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#77736B]" />
                <span className="truncate">{email}</span>
              </a>
              <a
                href={instaUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#77736B] hover:text-[#171717] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#77736B]" />
                <span className="truncate">{instaDisplay}</span>
              </a>
            </div>
            {siteContent.artistIntro ? (
              <p className="text-[11px] text-[#9E9A91] pt-2 border-t border-[#EAE6DC] leading-relaxed max-w-xs line-clamp-3">
                {siteContent.artistIntro}
              </p>
            ) : (
              <p className="text-[11px] text-[#9E9A91] pt-1">
                Custom commissions, exhibitions & architectural lighting
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#EAE6DC] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#77736B]">
          <div>
            © {new Date().getFullYear()} {siteContent.brandName || 'LEGNA'}. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <button
              id="footer-admin-link"
              onClick={onOpenAdmin}
              className="text-[#9E9A91] hover:text-[#171717] transition-colors"
            >
              {isAdminLoggedIn ? '• Admin Mode Active' : 'Admin (Password: 1111)'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { PageView, SiteContent } from '../types';
import { Menu, X, Shield, Lock } from 'lucide-react';

interface NavigationProps {
  currentPage: PageView;
  siteContent: SiteContent;
  onNavigate: (page: PageView) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  siteContent,
  onNavigate,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: PageView }[] = [
    { label: 'WORKS', page: 'WORKS' },
    { label: 'ABOUT', page: 'ABOUT' },
    { label: 'PROCESS', page: 'PROCESS' },
    { label: 'CONTACT', page: 'CONTACT' },
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F7F5F0]/90 backdrop-blur-md border-b border-[#DEDAD2]/80 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Brand Wordmark / Custom Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => handleNavClick('HOME')}
          className="group text-left focus:outline-none transition-opacity hover:opacity-80 flex items-center gap-3"
        >
          {siteContent.logoImage ? (
            <div className="flex items-center gap-3">
              <img
                src={siteContent.logoImage}
                alt={siteContent.brandName || 'LEGNA'}
                style={{ height: `${siteContent.logoHeight || 32}px` }}
                className="max-h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="sr-only">{siteContent.brandName || 'LEGNA'}</span>
            </div>
          ) : (
            <div>
              <span className="font-brand text-2xl sm:text-[27px] tracking-[0.26em] text-[#171717] block leading-tight font-normal">
                {siteContent.brandName || 'LEGNA'}
              </span>
              <span className="text-[8.5px] tracking-[0.34em] uppercase text-[#77736B] font-sans font-normal block mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                Hanji & Light
              </span>
            </div>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                id={`nav-link-${item.page.toLowerCase()}`}
                onClick={() => handleNavClick(item.page)}
                className={`relative text-xs tracking-[0.25em] font-medium transition-colors duration-200 py-1 ${
                  isActive ? 'text-[#171717]' : 'text-[#77736B] hover:text-[#171717]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#171717]" />
                )}
              </button>
            );
          })}

          {/* Discreet Admin Lock/Badge */}
          <button
            id="nav-admin-btn"
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? '관리자 모드 활성화됨' : '관리자 로그인 (비밀번호: 1111)'}
            className={`p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs ${
              isAdminLoggedIn
                ? 'bg-[#171717] text-[#F7F5F0] px-2.5 py-1'
                : 'text-[#9E9A91] hover:text-[#171717] hover:bg-[#EAE6DC]'
            }`}
          >
            {isAdminLoggedIn ? (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[10px] tracking-wider uppercase font-sans">ADMIN</span>
              </>
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <button
            id="mobile-admin-btn"
            onClick={onOpenAdmin}
            className="p-2 text-[#77736B] hover:text-[#171717]"
            title="Admin"
          >
            {isAdminLoggedIn ? <Shield className="w-4 h-4 text-[#171717]" /> : <Lock className="w-4 h-4" />}
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#171717] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-dropdown"
          className="md:hidden bg-[#F7F5F0] border-b border-[#DEDAD2] px-6 py-6 space-y-4 shadow-lg animate-in fade-in duration-200"
        >
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`block w-full text-left py-2 text-sm tracking-[0.25em] ${
                currentPage === item.page ? 'text-[#171717] font-semibold' : 'text-[#77736B]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-[#DEDAD2] flex justify-between items-center text-xs text-[#77736B]">
            <span>LEGNA Craft Studio</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="underline text-[11px]"
            >
              {isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

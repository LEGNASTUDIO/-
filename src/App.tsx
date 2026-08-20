import React, { useState, useEffect } from 'react';
import { PageView, WorkItem, SiteContent, ProcessStep } from './types';
import {
  getStoredWorks,
  saveStoredWorks,
  getStoredSiteContent,
  saveStoredSiteContent,
  getStoredProcessSteps,
  saveStoredProcessSteps,
  resetToDefaults,
} from './utils/storage';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { WorksView } from './components/WorksView';
import { AboutView } from './components/AboutView';
import { ProcessView } from './components/ProcessView';
import { ContactView } from './components/ContactView';
import { WorkDetailModal } from './components/WorkDetailModal';
import { AdminModal } from './components/AdminModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('HOME');
  const [works, setWorks] = useState<WorkItem[]>(getStoredWorks);
  const [siteContent, setSiteContent] = useState<SiteContent>(getStoredSiteContent);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(getStoredProcessSteps);

  // Selected work for detail view modal
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);

  // Inquiries topic state for pre-filling contact form
  const [inquiryTopic, setInquiryTopic] = useState<string>('');

  // Admin state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('legna_admin_auth') === 'true';
  });

  // Handle navigating to contact with a specific work inquiry
  const handleInquireWork = (workTitle: string) => {
    setInquiryTopic(workTitle);
    setCurrentPage('CONTACT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('legna_admin_auth', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('legna_admin_auth');
  };

  const handleSaveWorks = (updatedWorks: WorkItem[]) => {
    setWorks(updatedWorks);
    saveStoredWorks(updatedWorks);
  };

  const handleSaveSiteContent = (updatedContent: SiteContent) => {
    setSiteContent(updatedContent);
    saveStoredSiteContent(updatedContent);
  };

  const handleSaveProcessSteps = (updatedSteps: ProcessStep[]) => {
    setProcessSteps(updatedSteps);
    saveStoredProcessSteps(updatedSteps);
  };

  const handleResetDefaults = () => {
    const defaultData = resetToDefaults();
    setWorks(defaultData.works);
    setSiteContent(defaultData.content);
    setProcessSteps(defaultData.steps);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#171717]">
      {/* Top Header Navigation */}
      <Navigation
        currentPage={currentPage}
        siteContent={siteContent}
        onNavigate={(page) => {
          setCurrentPage(page);
          if (page !== 'CONTACT') {
            setInquiryTopic('');
          }
        }}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area based on active PageView */}
      <main className="flex-1">
        {currentPage === 'HOME' && (
          <HomeView
            works={works}
            processSteps={processSteps}
            siteContent={siteContent}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectWork={(work) => setSelectedWork(work)}
          />
        )}

        {currentPage === 'WORKS' && (
          <WorksView
            works={works}
            onSelectWork={(work) => setSelectedWork(work)}
          />
        )}

        {currentPage === 'ABOUT' && (
          <AboutView siteContent={siteContent} />
        )}

        {currentPage === 'PROCESS' && (
          <ProcessView processSteps={processSteps} />
        )}

        {currentPage === 'CONTACT' && (
          <ContactView
            siteContent={siteContent}
            initialInquiryTopic={inquiryTopic}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        siteContent={siteContent}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Work Detail Modal */}
      <WorkDetailModal
        work={selectedWork}
        onClose={() => setSelectedWork(null)}
        onInquire={handleInquireWork}
      />

      {/* Admin Panel Modal (Password: 1111) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        works={works}
        siteContent={siteContent}
        processSteps={processSteps}
        onSaveWorks={handleSaveWorks}
        onSaveSiteContent={handleSaveSiteContent}
        onSaveProcessSteps={handleSaveProcessSteps}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}

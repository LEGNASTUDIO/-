import React, { useState, useRef, useEffect } from 'react';
import { WorkItem, SiteContent, ProcessStep, WorkCategory } from '../types';
import { processImageFile, processMultipleImageFiles } from '../utils/imageUtils';
import {
  Lock,
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Star,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Sliders,
  LogOut,
  Upload,
  Eye,
  Sparkles,
  Layers,
  CheckCircle2,
  Camera,
  Move,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Grid,
  Maximize2,
  Minimize2,
  Palette,
  Layout,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  works: WorkItem[];
  siteContent: SiteContent;
  processSteps: ProcessStep[];
  onSaveWorks: (works: WorkItem[]) => void;
  onSaveSiteContent: (content: SiteContent) => void;
  onSaveProcessSteps: (steps: ProcessStep[]) => void;
  onResetDefaults: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdminLoggedIn,
  onLogin,
  onLogout,
  works,
  siteContent,
  processSteps,
  onSaveWorks,
  onSaveSiteContent,
  onSaveProcessSteps,
  onResetDefaults,
}) => {
  // Password prompt state
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'WORKS' | 'HERO_PHOTO' | 'LOGO_BRAND' | 'SITE_TEXT' | 'PROCESS' | 'INQUIRIES'>('WORKS');

  // Work Editor State
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Editable Form State
  const [localWorks, setLocalWorks] = useState<WorkItem[]>(works);
  const [localContent, setLocalContent] = useState<SiteContent>(siteContent);
  const [localSteps, setLocalSteps] = useState<ProcessStep[]>(processSteps);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // File input refs for main/site imagery
  const heroMainImageInputRef = useRef<HTMLInputElement>(null);
  const heroPreviewContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingHero, setIsDraggingHero] = useState(false);
  const [dragStart, setDragStart] = useState<{ clientX: number; clientY: number; posX: number; posY: number } | null>(null);

  const aboutSectionImageInputRef = useRef<HTMLInputElement>(null);
  const materialSectionImageInputRef = useRef<HTMLInputElement>(null);
  const artistSectionImageInputRef = useRef<HTMLInputElement>(null);

  // File input refs for direct logo uploading
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const heroLogoFileInputRef = useRef<HTMLInputElement>(null);

  // File input refs for work images
  const multiImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const detailImageInputRef = useRef<HTMLInputElement>(null);
  const spaceImageInputRef = useRef<HTMLInputElement>(null);
  const craftImageInputRef = useRef<HTMLInputElement>(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('legna_inquiries_v1') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (isOpen) {
      setLocalWorks(works);
      setLocalContent(siteContent);
      setLocalSteps(processSteps);
    }
  }, [isOpen, works, siteContent, processSteps]);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1111') {
      setPasswordError(false);
      setPassword('');
      onLogin();
    } else {
      setPasswordError(true);
    }
  };

  // Work Editing Handlers
  const handleStartEdit = (work: WorkItem) => {
    setEditingWork({ ...work });
    setIsCreatingNew(false);
  };

  const handleStartCreate = () => {
    const nextNumber = String(localWorks.length + 1).padStart(2, '0');
    const newWork: WorkItem = {
      id: 'work-' + Date.now(),
      numberCode: nextNumber,
      title: 'New Light Object',
      subtitle: 'Hanji Craft Work',
      category: 'LIGHT',
      year: new Date().getFullYear().toString(),
      materials: 'Hanji / Bamboo',
      dimensions: '400 × 400 × 500 mm',
      shortDescription: '한지와 빛의 온기를 담아낸 새로운 오브제.',
      fullDescription: '전통 닥한지와 천연 목재를 사용하여 손으로 형태를 조율한 신작입니다.',
      coverImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85',
      detailImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      spaceImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
      craftImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85',
      isFeatured: false,
      order: localWorks.length + 1,
    };
    setEditingWork(newWork);
    setIsCreatingNew(true);
  };

  const handleSaveCurrentWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWork) return;

    let updatedList: WorkItem[];
    if (isCreatingNew) {
      updatedList = [...localWorks, editingWork];
    } else {
      updatedList = localWorks.map((w) =>
        w.id === editingWork.id ? editingWork : w
      );
    }

    // If marked featured, remove featured from others
    if (editingWork.isFeatured) {
      updatedList = updatedList.map((w) => ({
        ...w,
        isFeatured: w.id === editingWork.id,
      }));
    }

    setLocalWorks(updatedList);
    onSaveWorks(updatedList);
    setEditingWork(null);
    setIsCreatingNew(false);
    showToast('작품 정보가 저장되었습니다.');
  };

  const handleDeleteWork = (id: string) => {
    if (window.confirm('정말 이 작품을 삭제하시겠습니까?')) {
      const updated = localWorks.filter((w) => w.id !== id);
      setLocalWorks(updated);
      onSaveWorks(updated);
      showToast('작품이 삭제되었습니다.');
    }
  };

  const handleMoveWork = (index: number, direction: 'UP' | 'DOWN') => {
    if (
      (direction === 'UP' && index === 0) ||
      (direction === 'DOWN' && index === localWorks.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    const newItems = [...localWorks];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    // Update order numbers
    const reordered = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    setLocalWorks(reordered);
    onSaveWorks(reordered);
  };

  const handleToggleFeatured = (id: string) => {
    const updated = localWorks.map((w) => ({
      ...w,
      isFeatured: w.id === id ? !w.isFeatured : false,
    }));
    setLocalWorks(updated);
    onSaveWorks(updated);
    showToast('대표 프로젝트가 업데이트되었습니다.');
  };

  // Work multi-image upload handler (내 컴퓨터에서 여러 장 첨부)
  const handleWorkMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingWork) return;

    try {
      showToast('이미지를 최적화하여 업로드 중입니다...');
      const base64List = await processMultipleImageFiles(files);
      const currentGallery = editingWork.galleryImages || [];
      const updatedGallery = [...currentGallery, ...base64List];

      // Auto-set cover image if cover is default or empty
      let updatedCover = editingWork.coverImage;
      if (!updatedCover || updatedCover.includes('unsplash.com')) {
        updatedCover = base64List[0] || updatedCover;
      }

      setEditingWork({
        ...editingWork,
        coverImage: updatedCover,
        galleryImages: updatedGallery,
      });
      showToast(`${base64List.length}장의 이미지가 성공적으로 추가되었습니다.`);
    } catch (err) {
      console.error(err);
      alert('이미지 업로드 처리 중 오류가 발생했습니다.');
    }
    if (e.target) e.target.value = '';
  };

  // Work single slot upload handler (대표/디테일/공간/제작 컷 개별 업로드)
  const handleWorkSingleImageUpload = async (
    field: 'coverImage' | 'detailImage' | 'spaceImage' | 'craftImage',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingWork) return;

    try {
      showToast('이미지 업로드 중...');
      const dataUrl = await processImageFile(file);
      setEditingWork({
        ...editingWork,
        [field]: dataUrl,
      });
      showToast('해당 슬롯 이미지가 등록되었습니다.');
    } catch (err) {
      console.error(err);
      alert('이미지 업로드에 실패했습니다.');
    }
    if (e.target) e.target.value = '';
  };

  // Delete a specific photo from galleryImages
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    if (!editingWork) return;
    const current = editingWork.galleryImages || [];
    const updated = current.filter((_, idx) => idx !== indexToRemove);
    setEditingWork({
      ...editingWork,
      galleryImages: updated,
    });
    showToast('첨부 이미지가 삭제되었습니다.');
  };

  // Set any gallery image to a primary slot
  const handleSetGalleryImageAsSlot = (
    imageUrl: string,
    slot: 'coverImage' | 'detailImage' | 'spaceImage' | 'craftImage'
  ) => {
    if (!editingWork) return;
    setEditingWork({
      ...editingWork,
      [slot]: imageUrl,
    });
    const label =
      slot === 'coverImage'
        ? '01 대표 전체 컷'
        : slot === 'detailImage'
        ? '02 디테일 컷'
        : slot === 'spaceImage'
        ? '03 공간 컷'
        : '04 제작 과정 컷';
    showToast(`${label}으로 지정되었습니다.`);
  };

  // Process Step Single Image Upload
  const handleProcessStepImageUpload = async (
    stepIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      const updated = [...localSteps];
      updated[stepIdx].image = dataUrl;
      setLocalSteps(updated);
      showToast('공정 단계 이미지가 등록되었습니다.');
    } catch (err) {
      console.error(err);
      alert('이미지 업로드 실패');
    }
    if (e.target) e.target.value = '';
  };

  // Logo file upload handler using FileReader
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(PNG, JPG, SVG, WebP 등)만 업로드 가능합니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const updated = { ...localContent, logoImage: result };
        setLocalContent(updated);
        onSaveSiteContent(updated);
        showToast('로고 이미지가 성공적으로 업로드 및 적용되었습니다.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHeroLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(PNG, JPG, SVG, WebP 등)만 업로드 가능합니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const updated = { ...localContent, heroLogoImage: result };
        setLocalContent(updated);
        onSaveSiteContent(updated);
        showToast('히어로 전용 로고가 적용되었습니다.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    const updated = { ...localContent, logoImage: '', heroLogoImage: '' };
    setLocalContent(updated);
    onSaveSiteContent(updated);
    showToast('로고 이미지가 삭제되고 기본 텍스트로 복원되었습니다.');
  };

  // Main Hero image upload from computer
  const handleHeroMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('메인 사진 최적화 및 등록 중...');
      const dataUrl = await processImageFile(file, 2200, 0.88);
      const updated = { ...localContent, heroMainImage: dataUrl };
      setLocalContent(updated);
      onSaveSiteContent(updated);
      showToast('첫 메인 사진이 성공적으로 변경 및 저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('이미지 파일 처리에 실패했습니다.');
    }
    if (e.target) e.target.value = '';
  };

  // Section images upload handler (About, Material, Artist)
  const handleSectionImageUpload = async (
    field: 'aboutSectionImage' | 'materialSectionImage' | 'artistSectionImage',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('사진 최적화 및 등록 중...');
      const dataUrl = await processImageFile(file, 1800, 0.85);
      const updated = { ...localContent, [field]: dataUrl };
      setLocalContent(updated);
      onSaveSiteContent(updated);
      showToast('섹션 사진이 성공적으로 변경 및 저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('이미지 파일 처리에 실패했습니다.');
    }
    if (e.target) e.target.value = '';
  };

  const handleResetHeroImage = () => {
    const defaultHero = 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=2000&q=85';
    const updated = {
      ...localContent,
      heroMainImage: defaultHero,
      heroImagePositionX: 50,
      heroImagePositionY: 50,
      heroImageZoom: 100,
    };
    setLocalContent(updated);
    onSaveSiteContent(updated);
    showToast('첫 메인 사진이 기본 감성 사진으로 복원되었습니다.');
  };

  // Hero Image Interactive Drag & Position Handling
  const handleHeroMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!localContent.heroMainImage) return;
    setIsDraggingHero(true);
    setDragStart({
      clientX: e.clientX,
      clientY: e.clientY,
      posX: localContent.heroImagePositionX ?? 50,
      posY: localContent.heroImagePositionY ?? 50,
    });
  };

  const handleHeroTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!localContent.heroMainImage || e.touches.length === 0) return;
    const touch = e.touches[0];
    setIsDraggingHero(true);
    setDragStart({
      clientX: touch.clientX,
      clientY: touch.clientY,
      posX: localContent.heroImagePositionX ?? 50,
      posY: localContent.heroImagePositionY ?? 50,
    });
  };

  useEffect(() => {
    if (!isDraggingHero || !dragStart) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!heroPreviewContainerRef.current) return;
      const rect = heroPreviewContainerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStart.clientX;
      const deltaY = e.clientY - dragStart.clientY;

      // Sensitivity: drag moves image position intuitively
      const percentXDelta = -(deltaX / rect.width) * 100;
      const percentYDelta = -(deltaY / rect.height) * 100;

      const newPosX = Math.max(0, Math.min(100, Math.round(dragStart.posX + percentXDelta)));
      const newPosY = Math.max(0, Math.min(100, Math.round(dragStart.posY + percentYDelta)));

      setLocalContent((prev) => ({
        ...prev,
        heroImagePositionX: newPosX,
        heroImagePositionY: newPosY,
      }));
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!heroPreviewContainerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = heroPreviewContainerRef.current.getBoundingClientRect();
      const deltaX = touch.clientX - dragStart.clientX;
      const deltaY = touch.clientY - dragStart.clientY;

      const percentXDelta = -(deltaX / rect.width) * 100;
      const percentYDelta = -(deltaY / rect.height) * 100;

      const newPosX = Math.max(0, Math.min(100, Math.round(dragStart.posX + percentXDelta)));
      const newPosY = Math.max(0, Math.min(100, Math.round(dragStart.posY + percentYDelta)));

      setLocalContent((prev) => ({
        ...prev,
        heroImagePositionX: newPosX,
        heroImagePositionY: newPosY,
      }));
    };

    const onMouseUp = () => {
      setIsDraggingHero(false);
      setDragStart(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDraggingHero, dragStart]);

  const setHeroPresetPosition = (posX: number, posY: number) => {
    setLocalContent((prev) => ({
      ...prev,
      heroImagePositionX: posX,
      heroImagePositionY: posY,
    }));
  };

  const handleResetHeroPosition = () => {
    setLocalContent((prev) => ({
      ...prev,
      heroImagePositionX: 50,
      heroImagePositionY: 50,
      heroImageZoom: 100,
    }));
    showToast('사진 위치 및 확대 배율이 중앙(기본값)으로 초기화되었습니다.');
  };

  const handleSaveHeroVisualSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteContent(localContent);
    showToast('메인 및 사이트 사진 설정이 저장되었습니다.');
  };

  const handleSaveLogoSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteContent(localContent);
    showToast('로고 및 브랜드 설정이 저장되었습니다.');
  };

  const handleSaveSiteTexts = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteContent(localContent);
    showToast('사이트 문구가 저장되었습니다.');
  };

  const handleSaveProcessSteps = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProcessSteps(localSteps);
    showToast('공정 단계가 저장되었습니다.');
  };

  const handleClearInquiries = () => {
    if (window.confirm('모든 문의 내역을 지우시겠습니까?')) {
      localStorage.removeItem('legna_inquiries_v1');
      setInquiries([]);
      showToast('문의 내역이 정리되었습니다.');
    }
  };

  const handleResetAll = () => {
    if (
      window.confirm(
        '포트폴리오와 모든 문구를 초기 데이터로 복원하시겠습니까? (직접 추가한 데이터는 초기화됩니다)'
      )
    ) {
      onResetDefaults();
      setLocalWorks(works);
      setLocalContent(siteContent);
      setLocalSteps(processSteps);
      setEditingWork(null);
      showToast('초기 데이터로 복원되었습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="admin-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#171717]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#171717] text-[#F7F5F0] border border-[#DEDAD2] px-4 py-2.5 rounded shadow-lg text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. PASSWORD LOGIN SCREEN (If not logged in)
          ───────────────────────────────────────────────────────────── */}
      {!isAdminLoggedIn ? (
        <div
          id="admin-login-box"
          className="bg-[#F7F5F0] text-[#171717] border border-[#DEDAD2] w-full max-w-md p-8 sm:p-10 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[#77736B] hover:text-[#171717]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3 pb-6 border-b border-[#DEDAD2]">
            <div className="w-10 h-10 rounded-full bg-[#171717] text-[#F7F5F0] flex items-center justify-center mx-auto">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-2xl font-light tracking-wide">
              LEGNA ADMIN
            </h2>
            <p className="text-xs text-[#77736B]">
              포트폴리오 및 사이트 설정을 관리하려면 비밀번호를 입력하세요.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="pt-6 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="text-[11px] font-mono tracking-wider text-[#77736B] uppercase block"
              >
                PASSWORD (기본값: 1111)
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoFocus
                placeholder="비밀번호 1111 입력"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                className={`w-full bg-[#EAE6DC]/40 border ${
                  passwordError ? 'border-red-500' : 'border-[#DEDAD2]'
                } p-3 text-sm text-[#171717] outline-none focus:border-[#171717] transition-colors`}
              />
              {passwordError && (
                <p className="text-xs text-red-600 font-mono">
                  비밀번호가 올바르지 않습니다. (비밀번호: 1111)
                </p>
              )}
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              className="w-full py-3.5 bg-[#171717] text-[#F7F5F0] hover:bg-[#333333] transition-colors text-xs tracking-[0.2em] uppercase font-medium"
            >
              LOGIN TO ADMIN
            </button>
          </form>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           2. FULL ADMIN DASHBOARD (When authenticated)
           ───────────────────────────────────────────────────────────── */
        <div
          id="admin-dashboard-container"
          className="bg-[#F7F5F0] text-[#171717] border border-[#DEDAD2] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#DEDAD2] flex items-center justify-between bg-[#EAE6DC]/30">
            <div className="flex items-center gap-3">
              <span className="font-serif text-xl font-light tracking-wide text-[#171717]">
                LEGNA STUDIO MANAGEMENT
              </span>
              <span className="text-[10px] font-mono bg-[#171717] text-[#F7F5F0] px-2 py-0.5 rounded">
                ADMIN
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onLogout}
                className="text-xs text-[#77736B] hover:text-[#171717] flex items-center gap-1 font-mono"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOGOUT</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 text-[#77736B] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="px-6 border-b border-[#DEDAD2] flex items-center space-x-6 text-xs font-mono overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('WORKS');
                setEditingWork(null);
              }}
              className={`py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'WORKS'
                  ? 'border-[#171717] text-[#171717] font-semibold'
                  : 'border-transparent text-[#77736B] hover:text-[#171717]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>WORKS ({localWorks.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('HERO_PHOTO');
                setEditingWork(null);
              }}
              className={`py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'HERO_PHOTO'
                  ? 'border-[#171717] text-[#171717] font-semibold'
                  : 'border-transparent text-[#77736B] hover:text-[#171717]'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-800" />
              <span>메인 사진 변경 (HERO PHOTO)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('LOGO_BRAND');
                setEditingWork(null);
              }}
              className={`py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'LOGO_BRAND'
                  ? 'border-[#171717] text-[#171717] font-semibold'
                  : 'border-transparent text-[#77736B] hover:text-[#171717]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>LOGO & BRAND (로고 관리)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('SITE_TEXT');
                setEditingWork(null);
              }}
              className={`py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'SITE_TEXT'
                  ? 'border-[#171717] text-[#171717] font-semibold'
                  : 'border-transparent text-[#77736B] hover:text-[#171717]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>SITE TEXTS</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('PROCESS');
                setEditingWork(null);
              }}
              className={`py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'PROCESS'
                  ? 'border-[#171717] text-[#171717] font-semibold'
                  : 'border-transparent text-[#77736B] hover:text-[#171717]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>PROCESS STEPS</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('INQUIRIES');
                setEditingWork(null);
              }}
              className={`py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'INQUIRIES'
                  ? 'border-[#171717] text-[#171717] font-semibold'
                  : 'border-transparent text-[#77736B] hover:text-[#171717]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>INQUIRIES ({inquiries.length})</span>
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* ──────── TAB 1: WORKS MANAGEMENT ──────── */}
            {activeTab === 'WORKS' && (
              <>
                {editingWork ? (
                  /* Work Form Editor */
                  <form onSubmit={handleSaveCurrentWork} className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-[#DEDAD2]">
                      <h3 className="font-serif text-xl font-light">
                        {isCreatingNew ? '새 작품 등록' : `작품 수정: ${editingWork.title}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingWork(null)}
                        className="text-xs font-mono text-[#77736B] hover:text-[#171717]"
                      >
                        취소 (목록으로)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-[#77736B]">
                          PROJECT NO. (코드)
                        </label>
                        <input
                          type="text"
                          required
                          value={editingWork.numberCode}
                          onChange={(e) =>
                            setEditingWork({ ...editingWork, numberCode: e.target.value })
                          }
                          className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-[#77736B]">
                          CATEGORY (분류)
                        </label>
                        <select
                          value={editingWork.category}
                          onChange={(e) =>
                            setEditingWork({
                              ...editingWork,
                              category: e.target.value as WorkCategory,
                            })
                          }
                          className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                        >
                          <option value="LIGHT">LIGHT (조명)</option>
                          <option value="OBJECTS">OBJECTS (오브제)</option>
                          <option value="EXPERIMENTS">EXPERIMENTS (실험/물성)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-[#77736B]">
                          TITLE (작품명)
                        </label>
                        <input
                          type="text"
                          required
                          value={editingWork.title}
                          onChange={(e) =>
                            setEditingWork({ ...editingWork, title: e.target.value })
                          }
                          className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-[#77736B]">
                          SUBTITLE / ENG (부제)
                        </label>
                        <input
                          type="text"
                          value={editingWork.subtitle || ''}
                          onChange={(e) =>
                            setEditingWork({ ...editingWork, subtitle: e.target.value })
                          }
                          className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-[#77736B]">
                          MATERIALS (재료)
                        </label>
                        <input
                          type="text"
                          required
                          value={editingWork.materials}
                          onChange={(e) =>
                            setEditingWork({ ...editingWork, materials: e.target.value })
                          }
                          placeholder="예: Hanji / Bamboo"
                          className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-[#77736B]">
                          YEAR (제작연도)
                        </label>
                        <input
                          type="text"
                          required
                          value={editingWork.year}
                          onChange={(e) =>
                            setEditingWork({ ...editingWork, year: e.target.value })
                          }
                          className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-mono uppercase text-[#77736B]">
                          DIMENSIONS (규격)
                        </label>
                        <input
                          type="text"
                          value={editingWork.dimensions || ''}
                          onChange={(e) =>
                            setEditingWork({ ...editingWork, dimensions: e.target.value })
                          }
                          placeholder="예: 420 × 420 × 580 mm"
                          className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                        />
                      </div>
                    </div>

                    {/* ──────── WORK IMAGERY & MULTI-IMAGE UPLOAD ──────── */}
                    <div className="space-y-6 pt-6 border-t border-[#DEDAD2]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-mono uppercase text-[#171717] font-bold flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-amber-800" />
                            <span>포트폴리오 사진 등록 및 다중 이미지 관리</span>
                          </h4>
                          <p className="text-[11px] text-[#77736B] mt-0.5">
                            내 컴퓨터에서 여러 장의 사진을 한 번에 선택하여 올리거나 슬롯별로 직접 등록할 수 있습니다.
                          </p>
                        </div>
                      </div>

                      {/* 1. Multi-Image Computer File Upload Dropzone */}
                      <div className="space-y-3">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          ref={multiImageInputRef}
                          onChange={handleWorkMultiImageUpload}
                          className="hidden"
                        />

                        <div
                          onClick={() => multiImageInputRef.current?.click()}
                          className="border-2 border-dashed border-[#171717]/40 hover:border-[#171717] p-6 text-center cursor-pointer transition-all bg-[#EAE6DC]/30 hover:bg-[#EAE6DC]/60 group"
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Upload className="w-6 h-6 text-[#171717] group-hover:scale-110 transition-transform" />
                            <Layers className="w-5 h-5 text-amber-800" />
                          </div>
                          <p className="text-xs font-mono text-[#171717] font-bold">
                            내 컴퓨터에서 사진 여러 장 선택 (다중 파일 업로드)
                          </p>
                          <p className="text-[11px] text-[#77736B] font-mono mt-1">
                            클릭하여 여러 개의 이미지 파일(PNG, JPG, WebP)을 한 번에 선택하세요.
                          </p>
                        </div>
                      </div>

                      {/* 2. Attached Gallery Images Grid (다중 첨부된 사진 아카이브 목록) */}
                      {editingWork.galleryImages && editingWork.galleryImages.length > 0 && (
                        <div className="p-4 border border-[#DEDAD2] bg-[#EAE6DC]/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#171717] flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              첨부된 추가 사진 아카이브 ({editingWork.galleryImages.length}장)
                            </span>
                            <span className="text-[10px] font-mono text-[#77736B]">
                              클릭하여 대표컷 지정 또는 삭제
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {editingWork.galleryImages.map((imgUrl, idx) => (
                              <div
                                key={idx}
                                className="border border-[#DEDAD2] bg-[#F7F5F0] p-2 space-y-2 relative group"
                              >
                                <div className="aspect-[4/3] bg-[#EAE6DC] overflow-hidden relative">
                                  <img
                                    src={imgUrl}
                                    alt={`Uploaded ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute top-1 left-1 bg-[#171717]/80 text-[#F7F5F0] text-[9px] font-mono px-1 py-0.5">
                                    #{idx + 1}
                                  </span>
                                  {editingWork.coverImage === imgUrl && (
                                    <span className="absolute bottom-1 left-1 bg-amber-700 text-white text-[9px] font-mono px-1.5 py-0.5 font-bold">
                                      ★ 대표컷
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-1 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleSetGalleryImageAsSlot(imgUrl, 'coverImage')}
                                    className="w-full text-[10px] font-mono py-1 px-1 bg-[#171717] text-[#F7F5F0] hover:bg-[#333333] transition-colors text-center block"
                                  >
                                    ★ 대표컷 지정
                                  </button>
                                  <div className="grid grid-cols-3 gap-1">
                                    <button
                                      type="button"
                                      title="디테일 컷으로 지정"
                                      onClick={() => handleSetGalleryImageAsSlot(imgUrl, 'detailImage')}
                                      className="text-[9px] font-mono py-0.5 border border-[#DEDAD2] hover:border-[#171717] text-[#77736B] hover:text-[#171717]"
                                    >
                                      디테일
                                    </button>
                                    <button
                                      type="button"
                                      title="공간 컷으로 지정"
                                      onClick={() => handleSetGalleryImageAsSlot(imgUrl, 'spaceImage')}
                                      className="text-[9px] font-mono py-0.5 border border-[#DEDAD2] hover:border-[#171717] text-[#77736B] hover:text-[#171717]"
                                    >
                                      공간
                                    </button>
                                    <button
                                      type="button"
                                      title="제작 과정 컷으로 지정"
                                      onClick={() => handleSetGalleryImageAsSlot(imgUrl, 'craftImage')}
                                      className="text-[9px] font-mono py-0.5 border border-[#DEDAD2] hover:border-[#171717] text-[#77736B] hover:text-[#171717]"
                                    >
                                      제작
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(idx)}
                                    className="w-full text-[10px] font-mono text-red-600 hover:text-red-800 flex items-center justify-center gap-1 pt-0.5"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>삭제</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Core 4 Slots (01 전체 대표 / 02 디테일 / 03 공간 / 04 제작 과정) */}
                      <div className="space-y-4 pt-2">
                        <h5 className="text-[11px] font-mono uppercase text-[#171717] font-bold">
                          핵심 4대 뷰 슬롯 설정 (전체 형태 / 디테일 / 공간 / 제작 과정)
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Slot 01: Cover Image */}
                          <div className="border border-[#DEDAD2] bg-[#F7F5F0] p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-[#171717] uppercase">
                                01. 전체 대표 이미지 (COVER) *
                              </span>
                            </div>

                            <div className="flex gap-3 items-center">
                              <div className="w-16 h-14 bg-[#EAE6DC] border border-[#DEDAD2] overflow-hidden flex-shrink-0">
                                {editingWork.coverImage ? (
                                  <img
                                    src={editingWork.coverImage}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#77736B]">
                                    NO IMG
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={coverImageInputRef}
                                  onChange={(e) => handleWorkSingleImageUpload('coverImage', e)}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => coverImageInputRef.current?.click()}
                                  className="w-full py-1.5 px-2 border border-[#171717] text-xs font-mono bg-[#EAE6DC]/40 hover:bg-[#EAE6DC] flex items-center justify-center gap-1.5 text-[#171717]"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>내 컴퓨터에서 사진 선택</span>
                                </button>
                              </div>
                            </div>

                            <input
                              type="url"
                              required
                              value={editingWork.coverImage}
                              onChange={(e) =>
                                setEditingWork({ ...editingWork, coverImage: e.target.value })
                              }
                              placeholder="또는 이미지 URL 직접 입력"
                              className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-1.5 text-[11px] text-[#171717] font-mono"
                            />
                          </div>

                          {/* Slot 02: Detail Image */}
                          <div className="border border-[#DEDAD2] bg-[#F7F5F0] p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-[#171717] uppercase">
                                02. 디테일 & 질감 (DETAIL)
                              </span>
                              {editingWork.detailImage && (
                                <button
                                  type="button"
                                  onClick={() => setEditingWork({ ...editingWork, detailImage: '' })}
                                  className="text-[10px] font-mono text-red-600 hover:underline"
                                >
                                  비우기
                                </button>
                              )}
                            </div>

                            <div className="flex gap-3 items-center">
                              <div className="w-16 h-14 bg-[#EAE6DC] border border-[#DEDAD2] overflow-hidden flex-shrink-0">
                                {editingWork.detailImage ? (
                                  <img
                                    src={editingWork.detailImage}
                                    alt="Detail Preview"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#77736B]">
                                    NO IMG
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={detailImageInputRef}
                                  onChange={(e) => handleWorkSingleImageUpload('detailImage', e)}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => detailImageInputRef.current?.click()}
                                  className="w-full py-1.5 px-2 border border-[#DEDAD2] hover:border-[#171717] text-xs font-mono bg-[#EAE6DC]/40 hover:bg-[#EAE6DC] flex items-center justify-center gap-1.5 text-[#171717]"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>내 컴퓨터에서 사진 선택</span>
                                </button>
                              </div>
                            </div>

                            <input
                              type="url"
                              value={editingWork.detailImage || ''}
                              onChange={(e) =>
                                setEditingWork({ ...editingWork, detailImage: e.target.value })
                              }
                              placeholder="또는 이미지 URL 직접 입력"
                              className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-1.5 text-[11px] text-[#171717] font-mono"
                            />
                          </div>

                          {/* Slot 03: Space Image */}
                          <div className="border border-[#DEDAD2] bg-[#F7F5F0] p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-[#171717] uppercase">
                                03. 공간 설치 연출 (SPACE)
                              </span>
                              {editingWork.spaceImage && (
                                <button
                                  type="button"
                                  onClick={() => setEditingWork({ ...editingWork, spaceImage: '' })}
                                  className="text-[10px] font-mono text-red-600 hover:underline"
                                >
                                  비우기
                                </button>
                              )}
                            </div>

                            <div className="flex gap-3 items-center">
                              <div className="w-16 h-14 bg-[#EAE6DC] border border-[#DEDAD2] overflow-hidden flex-shrink-0">
                                {editingWork.spaceImage ? (
                                  <img
                                    src={editingWork.spaceImage}
                                    alt="Space Preview"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#77736B]">
                                    NO IMG
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={spaceImageInputRef}
                                  onChange={(e) => handleWorkSingleImageUpload('spaceImage', e)}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => spaceImageInputRef.current?.click()}
                                  className="w-full py-1.5 px-2 border border-[#DEDAD2] hover:border-[#171717] text-xs font-mono bg-[#EAE6DC]/40 hover:bg-[#EAE6DC] flex items-center justify-center gap-1.5 text-[#171717]"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>내 컴퓨터에서 사진 선택</span>
                                </button>
                              </div>
                            </div>

                            <input
                              type="url"
                              value={editingWork.spaceImage || ''}
                              onChange={(e) =>
                                setEditingWork({ ...editingWork, spaceImage: e.target.value })
                              }
                              placeholder="또는 이미지 URL 직접 입력"
                              className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-1.5 text-[11px] text-[#171717] font-mono"
                            />
                          </div>

                          {/* Slot 04: Craft Image */}
                          <div className="border border-[#DEDAD2] bg-[#F7F5F0] p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-[#171717] uppercase">
                                04. 제작 과정 컷 (CRAFT)
                              </span>
                              {editingWork.craftImage && (
                                <button
                                  type="button"
                                  onClick={() => setEditingWork({ ...editingWork, craftImage: '' })}
                                  className="text-[10px] font-mono text-red-600 hover:underline"
                                >
                                  비우기
                                </button>
                              )}
                            </div>

                            <div className="flex gap-3 items-center">
                              <div className="w-16 h-14 bg-[#EAE6DC] border border-[#DEDAD2] overflow-hidden flex-shrink-0">
                                {editingWork.craftImage ? (
                                  <img
                                    src={editingWork.craftImage}
                                    alt="Craft Preview"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#77736B]">
                                    NO IMG
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={craftImageInputRef}
                                  onChange={(e) => handleWorkSingleImageUpload('craftImage', e)}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => craftImageInputRef.current?.click()}
                                  className="w-full py-1.5 px-2 border border-[#DEDAD2] hover:border-[#171717] text-xs font-mono bg-[#EAE6DC]/40 hover:bg-[#EAE6DC] flex items-center justify-center gap-1.5 text-[#171717]"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>내 컴퓨터에서 사진 선택</span>
                                </button>
                              </div>
                            </div>

                            <input
                              type="url"
                              value={editingWork.craftImage || ''}
                              onChange={(e) =>
                                setEditingWork({ ...editingWork, craftImage: e.target.value })
                              }
                              placeholder="또는 이미지 URL 직접 입력"
                              className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-1.5 text-[11px] text-[#171717] font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-4 pt-4 border-t border-[#DEDAD2]">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-[#77736B]">
                          한 줄 요약 (SHORT CONCEPT)
                        </label>
                        <input
                          type="text"
                          required
                          value={editingWork.shortDescription}
                          onChange={(e) =>
                            setEditingWork({
                              ...editingWork,
                              shortDescription: e.target.value,
                            })
                          }
                          className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-[#77736B]">
                          상세 작품 설명 (FULL STORY)
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={editingWork.fullDescription}
                          onChange={(e) =>
                            setEditingWork({
                              ...editingWork,
                              fullDescription: e.target.value,
                            })
                          }
                          className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                        />
                      </div>

                      {/* Featured toggle */}
                      <label className="flex items-center gap-2 cursor-pointer pt-2">
                        <input
                          type="checkbox"
                          checked={editingWork.isFeatured || false}
                          onChange={(e) =>
                            setEditingWork({
                              ...editingWork,
                              isFeatured: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-[#171717]"
                        />
                        <span className="text-xs font-mono text-[#171717]">
                          홈페이지 대표 프로젝트(FEATURED PROJECT)로 지정
                        </span>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-[#DEDAD2] flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingWork(null)}
                        className="px-5 py-2.5 border border-[#DEDAD2] text-xs font-mono hover:bg-[#EAE6DC]"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#171717] text-[#F7F5F0] text-xs font-mono hover:bg-[#333333]"
                      >
                        저장하기
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Work Items Table */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-xl font-light">작품 목록 관리</h3>
                        <p className="text-xs text-[#77736B]">
                          작품을 추가, 수정, 순서 변경하거나 대표작을 지정할 수 있습니다.
                        </p>
                      </div>
                      <button
                        id="admin-add-work-btn"
                        onClick={handleStartCreate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#171717] text-[#F7F5F0] text-xs font-mono hover:bg-[#333333] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>새 작품 추가</span>
                      </button>
                    </div>

                    <div className="border border-[#DEDAD2] divide-y divide-[#DEDAD2]">
                      {localWorks.map((work, index) => (
                        <div
                          key={work.id}
                          className="p-4 flex items-center justify-between gap-4 bg-[#F7F5F0] hover:bg-[#EAE6DC]/30 transition-colors"
                        >
                          {/* Left: Thumbnail & Info */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-16 h-12 bg-[#EAE6DC] overflow-hidden flex-shrink-0 border border-[#DEDAD2]">
                              <img
                                src={work.coverImage}
                                alt={work.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-[#77736B]">
                                  {work.numberCode}
                                </span>
                                <h4 className="text-xs font-medium text-[#171717] truncate font-serif">
                                  {work.title}
                                </h4>
                                {work.isFeatured && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#77736B] font-mono truncate">
                                {work.category} • {work.materials} ({work.year})
                              </p>
                            </div>
                          </div>

                          {/* Right: Reorder & Action buttons */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleToggleFeatured(work.id)}
                              title="대표 프로젝트 토글"
                              className={`p-1.5 rounded transition-colors ${
                                work.isFeatured
                                  ? 'text-amber-600 bg-amber-50'
                                  : 'text-[#9E9A91] hover:text-[#171717]'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleMoveWork(index, 'UP')}
                              disabled={index === 0}
                              title="위로 이동"
                              className="p-1.5 text-[#77736B] hover:text-[#171717] disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveWork(index, 'DOWN')}
                              disabled={index === localWorks.length - 1}
                              title="아래로 이동"
                              className="p-1.5 text-[#77736B] hover:text-[#171717] disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleStartEdit(work)}
                              title="수정"
                              className="p-1.5 text-[#171717] hover:bg-[#EAE6DC] rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteWork(work.id)}
                              title="삭제"
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ──────── TAB: HERO & SITE VISUALS (첫 메인 사진 및 비주얼 관리) ──────── */}
            {activeTab === 'HERO_PHOTO' && (
              <form onSubmit={handleSaveHeroVisualSettings} className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DEDAD2]">
                  <div>
                    <h3 className="font-serif text-xl font-light text-[#171717] flex items-center gap-2">
                      <Camera className="w-5 h-5 text-amber-800" />
                      <span>첫 메인 사진 및 주요 비주얼 설정</span>
                    </h3>
                    <p className="text-xs text-[#77736B] mt-0.5">
                      홈 화면의 첫 메인 대형 감성 사진과 소개 페이지 사진을 내 컴퓨터에서 바로 업로드하여 교체할 수 있습니다.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#171717] text-[#F7F5F0] text-xs font-mono hover:bg-[#333333] transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    사진 설정 저장
                  </button>
                </div>

                {/* 1. Primary Focus: First Hero Main Image */}
                <div className="p-6 border-2 border-[#171717]/20 bg-[#F7F5F0] space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-amber-800 font-bold uppercase block">
                        ★ PRIMARY HERO VISUAL
                      </span>
                      <h4 className="font-mono text-sm font-bold text-[#171717] uppercase mt-0.5">
                        01. 홈 첫 메인 대형 사진 (HERO MAIN AMBIENT IMAGE)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetHeroImage}
                      className="text-[11px] font-mono text-[#77736B] hover:text-[#171717] flex items-center gap-1 self-start sm:self-auto"
                      title="LEGNA 초기 기본 사진으로 되돌리기"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>기본 감성 사진으로 복원</span>
                    </button>
                  </div>

                  {/* 1-A. FIT MODE SELECTION (작품 사진 전체 담기 / 맞춤 방식) */}
                  <div className="p-4 border-2 border-amber-900/20 bg-amber-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#171717] flex items-center gap-1.5 uppercase">
                        <Maximize2 className="w-4 h-4 text-amber-800" />
                        <span>작품 사진 표시 및 맞춤 방식 (Fit Mode)</span>
                      </span>
                      <span className="text-[10px] font-mono text-amber-800 font-semibold bg-amber-100 px-2 py-0.5">
                        작품이 잘릴 때 [전체 다 담기]를 선택하세요
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Option 1: CONTAIN (전체 다 담기) */}
                      <button
                        type="button"
                        onClick={() =>
                          setLocalContent({
                            ...localContent,
                            heroImageFitMode: 'contain',
                            heroImageZoom: 100,
                          })
                        }
                        className={`p-3 border text-left transition-all ${
                          (localContent.heroImageFitMode || 'cover') === 'contain'
                            ? 'border-[#171717] bg-[#171717] text-[#F7F5F0] shadow-sm'
                            : 'border-[#DEDAD2] bg-[#F7F5F0] text-[#171717] hover:border-[#171717]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold">★ 전체 다 담기 (CONTAIN)</span>
                          {(localContent.heroImageFitMode || 'cover') === 'contain' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </div>
                        <p className={`text-[10px] mt-1 leading-relaxed ${
                          (localContent.heroImageFitMode || 'cover') === 'contain' ? 'text-gray-300' : 'text-[#77736B]'
                        }`}>
                          작품의 상하좌우가 전혀 잘리지 않고 온전히 한눈에 다 보입니다.
                        </p>
                      </button>

                      {/* Option 2: COVER (화면 채우기) */}
                      <button
                        type="button"
                        onClick={() =>
                          setLocalContent({
                            ...localContent,
                            heroImageFitMode: 'cover',
                          })
                        }
                        className={`p-3 border text-left transition-all ${
                          (localContent.heroImageFitMode || 'cover') === 'cover'
                            ? 'border-[#171717] bg-[#171717] text-[#F7F5F0] shadow-sm'
                            : 'border-[#DEDAD2] bg-[#F7F5F0] text-[#171717] hover:border-[#171717]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold">화면 꽉 채우기 (COVER)</span>
                          {(localContent.heroImageFitMode || 'cover') === 'cover' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </div>
                        <p className={`text-[10px] mt-1 leading-relaxed ${
                          (localContent.heroImageFitMode || 'cover') === 'cover' ? 'text-gray-300' : 'text-[#77736B]'
                        }`}>
                          프레임에 빈틈없이 가득 채웁니다 (비율에 따라 일부 잘림 발생).
                        </p>
                      </button>

                      {/* Option 3: NATURAL (원본 비율 그대로) */}
                      <button
                        type="button"
                        onClick={() =>
                          setLocalContent({
                            ...localContent,
                            heroImageFitMode: 'natural',
                            heroImageAspectRatio: 'natural',
                          })
                        }
                        className={`p-3 border text-left transition-all ${
                          (localContent.heroImageFitMode || 'cover') === 'natural'
                            ? 'border-[#171717] bg-[#171717] text-[#F7F5F0] shadow-sm'
                            : 'border-[#DEDAD2] bg-[#F7F5F0] text-[#171717] hover:border-[#171717]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold">원본 비율 맞춤 (NATURAL)</span>
                          {(localContent.heroImageFitMode || 'cover') === 'natural' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </div>
                        <p className={`text-[10px] mt-1 leading-relaxed ${
                          (localContent.heroImageFitMode || 'cover') === 'natural' ? 'text-gray-300' : 'text-[#77736B]'
                        }`}>
                          사진 고유의 세로/가로 비율에 맞춰 프레임 높이가 자동 조절됩니다.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* 1-B. ASPECT RATIO & BACKGROUND SELECTION */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Frame Aspect Ratio */}
                    <div className="p-3.5 border border-[#DEDAD2] bg-[#EAE6DC]/30 space-y-2">
                      <span className="text-[11px] font-mono font-bold text-[#171717] flex items-center gap-1.5 uppercase">
                        <Layout className="w-3.5 h-3.5 text-amber-800" />
                        <span>프레임 화면 비율 (Aspect Ratio)</span>
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                        {[
                          { id: 'wide', label: '와이드 21:9' },
                          { id: 'standard', label: '표준 16:10' },
                          { id: 'square', label: '정사각 1:1' },
                          { id: 'portrait', label: '세로형 4:5' },
                          { id: 'natural', label: '원본비율' },
                        ].map((ratio) => (
                          <button
                            key={ratio.id}
                            type="button"
                            onClick={() =>
                              setLocalContent({
                                ...localContent,
                                heroImageAspectRatio: ratio.id as any,
                              })
                            }
                            className={`py-1.5 px-1 text-[10px] font-mono border transition-all text-center ${
                              (localContent.heroImageAspectRatio || 'wide') === ratio.id
                                ? 'border-[#171717] bg-[#171717] text-[#F7F5F0] font-bold'
                                : 'border-[#DEDAD2] bg-[#F7F5F0] text-[#171717] hover:border-[#171717]'
                            }`}
                          >
                            {ratio.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Background Tone (For Contain Mode) */}
                    <div className="p-3.5 border border-[#DEDAD2] bg-[#EAE6DC]/30 space-y-2">
                      <span className="text-[11px] font-mono font-bold text-[#171717] flex items-center gap-1.5 uppercase">
                        <Palette className="w-3.5 h-3.5 text-amber-800" />
                        <span>여백 배경 톤 (Background Canvas)</span>
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {[
                          { id: '#EAE6DC', label: '따뜻한 한지', color: '#EAE6DC' },
                          { id: '#F7F5F0', label: '라이트 크림', color: '#F7F5F0' },
                          { id: '#171717', label: '모던 다크', color: '#171717' },
                          { id: 'blur', label: '블러 효과' },
                        ].map((bg) => (
                          <button
                            key={bg.id}
                            type="button"
                            onClick={() =>
                              setLocalContent({
                                ...localContent,
                                heroImageBgColor: bg.id,
                              })
                            }
                            className={`py-1.5 px-2 text-[10px] font-mono border transition-all text-center flex items-center justify-center gap-1 ${
                              (localContent.heroImageBgColor || '#EAE6DC') === bg.id
                                ? 'border-[#171717] bg-[#171717] text-[#F7F5F0] font-bold'
                                : 'border-[#DEDAD2] bg-[#F7F5F0] text-[#171717] hover:border-[#171717]'
                            }`}
                          >
                            {bg.color && (
                              <span
                                className="w-2 h-2 rounded-full border border-black/20"
                                style={{ backgroundColor: bg.color }}
                              />
                            )}
                            <span>{bg.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Wide Preview & Interactive Drag Viewport */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-[#77736B] gap-1">
                      <span className="flex items-center gap-1.5 font-bold text-[#171717]">
                        <Move className="w-3.5 h-3.5 text-amber-800" />
                        <span>인터랙티브 뷰파인더 (마우스로 사진을 잡고 드래그하여 위치 이동)</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#171717] text-[#F7F5F0] px-2 py-0.5 font-mono">
                          X: {localContent.heroImagePositionX ?? 50}% | Y: {localContent.heroImagePositionY ?? 50}% | 줌: {localContent.heroImageZoom ?? 100}%
                        </span>
                      </div>
                    </div>

                    {/* Drag Viewport Canvas */}
                    <div
                      ref={heroPreviewContainerRef}
                      onMouseDown={handleHeroMouseDown}
                      onTouchStart={handleHeroTouchStart}
                      className={`aspect-[16/9] sm:aspect-[21/9] w-full bg-[#EAE6DC] border-2 ${
                        isDraggingHero ? 'border-amber-700 cursor-grabbing' : 'border-[#171717]/40 cursor-grab hover:border-[#171717]'
                      } overflow-hidden relative shadow-inner select-none transition-colors group`}
                      title="마우스로 사진을 끌어서 원하는 부분을 맞춰보세요"
                    >
                      {localContent.heroMainImage ? (
                        <img
                          src={localContent.heroMainImage}
                          alt="Hero Main Preview"
                          className="w-full h-full object-cover pointer-events-none transition-[object-position] duration-75"
                          style={{
                            objectPosition: `${localContent.heroImagePositionX ?? 50}% ${localContent.heroImagePositionY ?? 50}%`,
                            transform: localContent.heroImageZoom && localContent.heroImageZoom !== 100 ? `scale(${localContent.heroImageZoom / 100})` : undefined,
                            transformOrigin: `${localContent.heroImagePositionX ?? 50}% ${localContent.heroImagePositionY ?? 50}%`,
                          }}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-[#77736B]">
                          <Camera className="w-8 h-8 text-[#9E9A91] mb-2" />
                          <span>등록된 메인 사진이 없습니다.</span>
                        </div>
                      )}

                      {/* Rule of Thirds Grid Overlay (Always subtle, accentuated on hover/drag) */}
                      <div className={`absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 transition-opacity ${
                        isDraggingHero ? 'opacity-70' : 'opacity-20 group-hover:opacity-40'
                      }`}>
                        <div className="border-r border-b border-white/60"></div>
                        <div className="border-r border-b border-white/60"></div>
                        <div className="border-b border-white/60"></div>
                        <div className="border-r border-b border-white/60"></div>
                        <div className="border-r border-b border-white/60 flex items-center justify-center">
                          <Crosshair className="w-6 h-6 text-white drop-shadow" />
                        </div>
                        <div className="border-b border-white/60"></div>
                        <div className="border-r border-white/60"></div>
                        <div className="border-r border-white/60"></div>
                        <div></div>
                      </div>

                      {/* Drag Guide Badges */}
                      <div className="absolute top-3 left-3 bg-[#171717]/85 backdrop-blur-sm text-[#F7F5F0] px-2.5 py-1 text-[10px] font-mono flex items-center gap-1.5 pointer-events-none">
                        <Move className="w-3 h-3 text-amber-400" />
                        <span>{isDraggingHero ? '구도 이동 중...' : '마우스 드래그로 구도 조절 가능'}</span>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-[#171717]/85 backdrop-blur-sm text-[#F7F5F0] px-2.5 py-1 text-[10px] font-mono pointer-events-none">
                        실제 메인 화면 반영 비율
                      </div>
                    </div>

                    {/* Fine-Tuning Control Board */}
                    <div className="p-4 border border-[#DEDAD2] bg-[#EAE6DC]/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] font-mono font-bold text-[#171717] flex items-center gap-1.5 uppercase">
                          <Sliders className="w-3.5 h-3.5 text-amber-800" />
                          <span>미세 구도 및 확대/축소 조절기 (Fine-Tuning Controls)</span>
                        </h5>
                        <button
                          type="button"
                          onClick={handleResetHeroPosition}
                          className="text-[10px] font-mono text-[#77736B] hover:text-[#171717] flex items-center gap-1 underline"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>중앙 초기화 (Reset)</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                        {/* 1. Horizontal Position (X) */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-[#171717] font-semibold">좌 / 우 위치 (X축)</span>
                            <span className="text-amber-800 font-bold">{localContent.heroImagePositionX ?? 50}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={localContent.heroImagePositionX ?? 50}
                            onChange={(e) =>
                              setLocalContent({
                                ...localContent,
                                heroImagePositionX: parseInt(e.target.value, 10),
                              })
                            }
                            className="w-full accent-[#171717] cursor-pointer h-1.5 bg-[#DEDAD2] rounded-lg"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-[#77736B]">
                            <span>← 왼쪽 (0%)</span>
                            <span>중앙 (50%)</span>
                            <span>오른쪽 (100%) →</span>
                          </div>
                        </div>

                        {/* 2. Vertical Position (Y) */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-[#171717] font-semibold">상 / 하 위치 (Y축)</span>
                            <span className="text-amber-800 font-bold">{localContent.heroImagePositionY ?? 50}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={localContent.heroImagePositionY ?? 50}
                            onChange={(e) =>
                              setLocalContent({
                                ...localContent,
                                heroImagePositionY: parseInt(e.target.value, 10),
                              })
                            }
                            className="w-full accent-[#171717] cursor-pointer h-1.5 bg-[#DEDAD2] rounded-lg"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-[#77736B]">
                            <span>↑ 상단 (0%)</span>
                            <span>중앙 (50%)</span>
                            <span>하단 (100%) ↓</span>
                          </div>
                        </div>

                        {/* 3. Zoom / Scale */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-[#171717] font-semibold">확대 배율 (Zoom)</span>
                            <span className="text-amber-800 font-bold">{localContent.heroImageZoom ?? 100}%</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="200"
                            step="5"
                            value={localContent.heroImageZoom ?? 100}
                            onChange={(e) =>
                              setLocalContent({
                                ...localContent,
                                heroImageZoom: parseInt(e.target.value, 10),
                              })
                            }
                            className="w-full accent-[#171717] cursor-pointer h-1.5 bg-[#DEDAD2] rounded-lg"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-[#77736B]">
                            <span>100% (기본 원본)</span>
                            <span>150%</span>
                            <span>200% (최대 2배)</span>
                          </div>
                        </div>
                      </div>

                      {/* 9-Point Quick Focal Presets Matrix */}
                      <div className="pt-2 border-t border-[#DEDAD2]/80 space-y-2">
                        <span className="text-[10px] font-mono text-[#77736B] block">
                          원클릭 구도 프리셋 (9-Point Quick Presets)
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setHeroPresetPosition(0, 0)}
                            className="p-1.5 border border-[#DEDAD2] bg-[#F7F5F0] hover:bg-[#171717] hover:text-[#F7F5F0] text-[10px] font-mono text-center transition-colors"
                          >
                            좌측 상단
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroPresetPosition(50, 0)}
                            className="p-1.5 border border-[#DEDAD2] bg-[#F7F5F0] hover:bg-[#171717] hover:text-[#F7F5F0] text-[10px] font-mono text-center transition-colors"
                          >
                            상단 중앙
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroPresetPosition(100, 0)}
                            className="p-1.5 border border-[#DEDAD2] bg-[#F7F5F0] hover:bg-[#171717] hover:text-[#F7F5F0] text-[10px] font-mono text-center transition-colors"
                          >
                            우측 상단
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroPresetPosition(0, 50)}
                            className="p-1.5 border border-[#DEDAD2] bg-[#F7F5F0] hover:bg-[#171717] hover:text-[#F7F5F0] text-[10px] font-mono text-center transition-colors"
                          >
                            좌측 중앙
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroPresetPosition(50, 50)}
                            className="p-1.5 border border-[#171717] bg-[#171717] text-[#F7F5F0] text-[10px] font-mono text-center font-bold"
                          >
                            ★ 정중앙
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroPresetPosition(100, 50)}
                            className="p-1.5 border border-[#DEDAD2] bg-[#F7F5F0] hover:bg-[#171717] hover:text-[#F7F5F0] text-[10px] font-mono text-center transition-colors"
                          >
                            우측 중앙
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroPresetPosition(0, 100)}
                            className="p-1.5 border border-[#DEDAD2] bg-[#F7F5F0] hover:bg-[#171717] hover:text-[#F7F5F0] text-[10px] font-mono text-center transition-colors"
                          >
                            좌측 하단
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroPresetPosition(50, 100)}
                            className="p-1.5 border border-[#DEDAD2] bg-[#F7F5F0] hover:bg-[#171717] hover:text-[#F7F5F0] text-[10px] font-mono text-center transition-colors"
                          >
                            하단 중앙
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroPresetPosition(100, 100)}
                            className="p-1.5 border border-[#DEDAD2] bg-[#F7F5F0] hover:bg-[#171717] hover:text-[#F7F5F0] text-[10px] font-mono text-center transition-colors"
                          >
                            우측 하단
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Computer File Upload Dropzone */}
                  <div className="space-y-3 pt-2">
                    <input
                      type="file"
                      ref={heroMainImageInputRef}
                      onChange={handleHeroMainImageUpload}
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                    />

                    <div
                      onClick={() => heroMainImageInputRef.current?.click()}
                      className="border-2 border-dashed border-[#171717] hover:bg-[#EAE6DC]/60 p-8 text-center cursor-pointer transition-all bg-[#EAE6DC]/30 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#171717] text-[#F7F5F0] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-mono text-[#171717] font-bold">
                        내 컴퓨터에서 메인 사진 파일 선택 (클릭하여 업로드)
                      </p>
                      <p className="text-xs font-mono text-[#77736B] mt-1">
                        권장: 가로 2000px 이상의 고화질 와이드 사진 (PNG, JPG, WebP 자동 최적화)
                      </p>
                    </div>
                  </div>

                  {/* Direct URL Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-[#77736B] uppercase block">
                      또는 외부 이미지 웹 URL 직접 입력
                    </label>
                    <input
                      type="url"
                      value={localContent.heroMainImage || ''}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          heroMainImage: e.target.value,
                        })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717] font-mono"
                    />
                  </div>
                </div>

                {/* 2. Secondary Visuals: About, Material & Artist Photos */}
                <div className="p-6 border border-[#DEDAD2] bg-[#F7F5F0] space-y-6">
                  <div>
                    <h4 className="font-mono text-xs font-bold text-[#171717] uppercase">
                      02. 사이트 내 기타 주요 사진 변경 (ABOUT / MATERIAL / ARTIST)
                    </h4>
                    <p className="text-[11px] text-[#77736B] mt-0.5">
                      홈 화면의 소개 섹션, 한지 소재 섹션 및 작가 소개 사진을 개별적으로 교체할 수 있습니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card A: About Section Photo */}
                    <div className="border border-[#DEDAD2] bg-[#EAE6DC]/20 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-[#171717] uppercase">
                          ABOUT 소개 사진
                        </span>
                        <span className="text-[9px] font-mono text-[#77736B]">4:5 세로형</span>
                      </div>

                      <div className="aspect-[4/5] bg-[#EAE6DC] border border-[#DEDAD2] overflow-hidden relative">
                        {localContent.aboutSectionImage ? (
                          <img
                            src={localContent.aboutSectionImage}
                            alt="About Preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#77736B]">
                            NO IMAGE
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={aboutSectionImageInputRef}
                        onChange={(e) => handleSectionImageUpload('aboutSectionImage', e)}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => aboutSectionImageInputRef.current?.click()}
                        className="w-full py-2 bg-[#171717] text-[#F7F5F0] text-xs font-mono flex items-center justify-center gap-1.5 hover:bg-[#333]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>내 사진으로 교체</span>
                      </button>

                      <input
                        type="url"
                        value={localContent.aboutSectionImage || ''}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            aboutSectionImage: e.target.value,
                          })
                        }
                        placeholder="또는 이미지 URL"
                        className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-1.5 text-[11px] text-[#171717] font-mono"
                      />
                    </div>

                    {/* Card B: Material Hanji Texture Photo */}
                    <div className="border border-[#DEDAD2] bg-[#EAE6DC]/20 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-[#171717] uppercase">
                          MATERIAL 한지 텍스처
                        </span>
                        <span className="text-[9px] font-mono text-[#77736B]">와이드 매크로</span>
                      </div>

                      <div className="aspect-[4/5] bg-[#EAE6DC] border border-[#DEDAD2] overflow-hidden relative">
                        {localContent.materialSectionImage ? (
                          <img
                            src={localContent.materialSectionImage}
                            alt="Material Preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#77736B]">
                            NO IMAGE
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={materialSectionImageInputRef}
                        onChange={(e) => handleSectionImageUpload('materialSectionImage', e)}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => materialSectionImageInputRef.current?.click()}
                        className="w-full py-2 bg-[#171717] text-[#F7F5F0] text-xs font-mono flex items-center justify-center gap-1.5 hover:bg-[#333]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>내 사진으로 교체</span>
                      </button>

                      <input
                        type="url"
                        value={localContent.materialSectionImage || ''}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            materialSectionImage: e.target.value,
                          })
                        }
                        placeholder="또는 이미지 URL"
                        className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-1.5 text-[11px] text-[#171717] font-mono"
                      />
                    </div>

                    {/* Card C: Artist Studio Photo */}
                    <div className="border border-[#DEDAD2] bg-[#EAE6DC]/20 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-[#171717] uppercase">
                          ARTIST 작업실 사진
                        </span>
                        <span className="text-[9px] font-mono text-[#77736B]">4:5 세로형</span>
                      </div>

                      <div className="aspect-[4/5] bg-[#EAE6DC] border border-[#DEDAD2] overflow-hidden relative">
                        {localContent.artistSectionImage ? (
                          <img
                            src={localContent.artistSectionImage}
                            alt="Artist Preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#77736B]">
                            NO IMAGE
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={artistSectionImageInputRef}
                        onChange={(e) => handleSectionImageUpload('artistSectionImage', e)}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => artistSectionImageInputRef.current?.click()}
                        className="w-full py-2 bg-[#171717] text-[#F7F5F0] text-xs font-mono flex items-center justify-center gap-1.5 hover:bg-[#333]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>내 사진으로 교체</span>
                      </button>

                      <input
                        type="url"
                        value={localContent.artistSectionImage || ''}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            artistSectionImage: e.target.value,
                          })
                        }
                        placeholder="또는 이미지 URL"
                        className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-1.5 text-[11px] text-[#171717] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* ──────── TAB: LOGO & BRAND (로고 관리) ──────── */}
            {activeTab === 'LOGO_BRAND' && (
              <form onSubmit={handleSaveLogoSettings} className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-[#DEDAD2]">
                  <div>
                    <h3 className="font-serif text-xl font-light">로고 및 브랜드 비주얼 설정</h3>
                    <p className="text-xs text-[#77736B]">
                      헤더 및 메인 화면에 표시될 커스텀 로고 이미지를 업로드하거나 높이/문구를 설정합니다.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#171717] text-[#F7F5F0] text-xs font-mono hover:bg-[#333333] transition-colors"
                  >
                    로고 설정 저장
                  </button>
                </div>

                {/* Live Preview Card */}
                <div className="p-5 border border-[#DEDAD2] bg-[#EAE6DC]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#171717] uppercase flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      실시간 네비게이션 헤더 미리보기 (HEADER PREVIEW)
                    </span>
                    <span className="text-[10px] font-mono text-[#77736B]">
                      {localContent.logoImage ? '커스텀 이미지 로고 적용 중' : '기본 텍스트 워드마크 적용 중'}
                    </span>
                  </div>

                  {/* Simulated Nav Bar */}
                  <div className="bg-[#F7F5F0] border border-[#DEDAD2] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {localContent.logoImage ? (
                        <img
                          src={localContent.logoImage}
                          alt="Logo Preview"
                          style={{ height: `${localContent.logoHeight || 32}px` }}
                          className="max-h-14 w-auto object-contain transition-all"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div>
                          <span className="font-brand text-2xl tracking-[0.26em] text-[#171717] block leading-tight font-normal">
                            {localContent.brandName || 'LEGNA'}
                          </span>
                          <span className="text-[8.5px] tracking-[0.34em] uppercase text-[#77736B] font-sans font-normal block mt-0.5 opacity-80">
                            Hanji & Light
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-[10px] tracking-[0.2em] font-mono text-[#77736B]">
                      <span>WORKS</span>
                      <span>ABOUT</span>
                      <span>PROCESS</span>
                      <span>CONTACT</span>
                    </div>
                  </div>
                </div>

                {/* Section 1: Main Header Logo */}
                <div className="p-6 border border-[#DEDAD2] bg-[#F7F5F0] space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-xs font-bold text-[#171717] uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#77736B]" />
                      <span>메인 로고 이미지 등록 (HEADER & MAIN LOGO)</span>
                    </h4>
                    {localContent.logoImage && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1 font-mono"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>로고 삭제 (기본 텍스트 복원)</span>
                      </button>
                    )}
                  </div>

                  {/* File Upload Zone */}
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={logoFileInputRef}
                      onChange={handleLogoFileUpload}
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      className="hidden"
                    />

                    <div
                      onClick={() => logoFileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#DEDAD2] hover:border-[#171717] p-8 text-center cursor-pointer transition-colors bg-[#EAE6DC]/20 hover:bg-[#EAE6DC]/40"
                    >
                      <Upload className="w-8 h-8 mx-auto text-[#77736B] mb-2" />
                      <p className="text-xs font-mono text-[#171717] font-medium">
                        여기를 클릭하여 내 컴퓨터에서 로고 파일 직접 업로드
                      </p>
                      <p className="text-[10px] font-mono text-[#77736B] mt-1">
                        권장 포맷: 투명 배경 PNG, SVG, JPG, WebP (최대 5MB)
                      </p>
                    </div>
                  </div>

                  {/* Alternative URL Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#77736B] uppercase">
                      또는 외부 로고 이미지 URL 직접 입력
                    </label>
                    <input
                      type="url"
                      value={localContent.logoImage || ''}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          logoImage: e.target.value,
                        })
                      }
                      placeholder="https://example.com/my-custom-logo.png"
                      className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717] font-mono"
                    />
                  </div>

                  {/* Logo Size / Height Slider */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-[#171717] font-semibold">
                        헤더 로고 표시 크기 (높이): {localContent.logoHeight || 32}px
                      </span>
                      <span className="text-[#77736B]">기본 권장: 32px</span>
                    </div>

                    <input
                      type="range"
                      min={20}
                      max={80}
                      step={2}
                      value={localContent.logoHeight || 32}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          logoHeight: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#171717] cursor-pointer"
                    />

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-[#77736B]">빠른 크기 선택:</span>
                      {[24, 28, 32, 40, 48, 60].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            setLocalContent({
                              ...localContent,
                              logoHeight: size,
                            })
                          }
                          className={`px-2 py-0.5 border text-xs transition-colors ${
                            (localContent.logoHeight || 32) === size
                              ? 'bg-[#171717] text-[#F7F5F0] border-[#171717]'
                              : 'bg-transparent text-[#77736B] border-[#DEDAD2] hover:border-[#171717]'
                          }`}
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 2: Hero Section Custom Logo (Optional) */}
                <div className="p-6 border border-[#DEDAD2] bg-[#F7F5F0] space-y-4">
                  <div>
                    <h4 className="font-mono text-xs font-bold text-[#171717] uppercase">
                      메인 홈 히어로 전용 로고 이미지 (선택 사항)
                    </h4>
                    <p className="text-[11px] text-[#77736B] mt-0.5">
                      비워둘 경우 위에서 등록한 메인 로고가 홈 상단에도 적용됩니다.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={heroLogoFileInputRef}
                    onChange={handleHeroLogoFileUpload}
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                  />

                  <div className="flex gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => heroLogoFileInputRef.current?.click()}
                      className="px-4 py-2 border border-[#DEDAD2] hover:border-[#171717] text-xs font-mono bg-[#EAE6DC]/30 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>히어로 로고 파일 선택</span>
                    </button>
                    {localContent.heroLogoImage && (
                      <button
                        type="button"
                        onClick={() =>
                          setLocalContent({ ...localContent, heroLogoImage: '' })
                        }
                        className="text-xs text-red-600 hover:underline font-mono"
                      >
                        히어로 전용 로고 해제
                      </button>
                    )}
                  </div>

                  <input
                    type="url"
                    value={localContent.heroLogoImage || ''}
                    onChange={(e) =>
                      setLocalContent({
                        ...localContent,
                        heroLogoImage: e.target.value,
                      })
                    }
                    placeholder="또는 히어로 로고 이미지 URL 직접 입력"
                    className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2 text-xs text-[#171717] font-mono"
                  />
                </div>

                {/* Section 3: Brand Text Fallback */}
                <div className="p-6 border border-[#DEDAD2] bg-[#F7F5F0] space-y-4">
                  <h4 className="font-mono text-xs font-bold text-[#171717] uppercase">
                    기본 브랜드 텍스트 (텍스트 로고 및 ALT 텍스트용)
                  </h4>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#77736B] uppercase">
                      브랜드 영문명 (기본값: LEGNA)
                    </label>
                    <input
                      type="text"
                      value={localContent.brandName}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          brandName: e.target.value,
                        })
                      }
                      className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717] font-mono"
                    />
                  </div>
                </div>
              </form>
            )}

            {/* ──────── TAB 2: SITE TEXTS ──────── */}
            {activeTab === 'SITE_TEXT' && (
              <form onSubmit={handleSaveSiteTexts} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#DEDAD2]">
                  <div>
                    <h3 className="font-serif text-xl font-light">브랜드 문구 및 소개 설정</h3>
                    <p className="text-xs text-[#77736B]">
                      홈, 어바웃, 머티리얼 섹션의 주요 문구를 수정합니다.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#171717] text-[#F7F5F0] text-xs font-mono hover:bg-[#333333]"
                  >
                    문구 저장
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#77736B] uppercase">
                      HERO 소제목 (HOME HERO SUBTITLE)
                    </label>
                    <textarea
                      rows={2}
                      value={localContent.heroSubheadline}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          heroSubheadline: e.target.value,
                        })
                      }
                      className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#77736B] uppercase">
                      ABOUT LEGNA 소개 본문
                    </label>
                    <textarea
                      rows={3}
                      value={localContent.aboutLegnaBody}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          aboutLegnaBody: e.target.value,
                        })
                      }
                      className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[#77736B] uppercase">
                        MATERIAL 인용문 (ENG)
                      </label>
                      <input
                        type="text"
                        value={localContent.materialQuoteEn}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            materialQuoteEn: e.target.value,
                          })
                        }
                        className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[#77736B] uppercase">
                        MATERIAL 인용문 (KOR)
                      </label>
                      <input
                        type="text"
                        value={localContent.materialQuoteKo}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            materialQuoteKo: e.target.value,
                          })
                        }
                        className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#77736B] uppercase">
                      작가 소개 (ARTIST STATEMENT)
                    </label>
                    <textarea
                      rows={3}
                      value={localContent.artistIntro}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          artistIntro: e.target.value,
                        })
                      }
                      className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#77736B] uppercase">
                      작업 철학 (PHILOSOPHY)
                    </label>
                    <textarea
                      rows={3}
                      value={localContent.philosophyText}
                      onChange={(e) =>
                        setLocalContent({
                          ...localContent,
                          philosophyText: e.target.value,
                        })
                      }
                      className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[#77736B] uppercase">
                        대표 이메일
                      </label>
                      <input
                        type="email"
                        value={localContent.contactEmail}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            contactEmail: e.target.value,
                          })
                        }
                        className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[#77736B] uppercase">
                        인스타그램 계정
                      </label>
                      <input
                        type="text"
                        value={localContent.instagramHandle}
                        onChange={(e) =>
                          setLocalContent({
                            ...localContent,
                            instagramHandle: e.target.value,
                          })
                        }
                        className="w-full bg-[#EAE6DC]/30 border border-[#DEDAD2] p-2.5 text-xs text-[#171717]"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* ──────── TAB 3: PROCESS STEPS ──────── */}
            {activeTab === 'PROCESS' && (
              <form onSubmit={handleSaveProcessSteps} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#DEDAD2]">
                  <div>
                    <h3 className="font-serif text-xl font-light">공정 4단계(PROCESS) 설정</h3>
                    <p className="text-xs text-[#77736B]">
                      한지, 색, 구조, 완성의 사진과 설명을 수정합니다.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#171717] text-[#F7F5F0] text-xs font-mono hover:bg-[#333333]"
                  >
                    공정 단계 저장
                  </button>
                </div>

                <div className="space-y-6">
                  {localSteps.map((step, idx) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 border border-[#DEDAD2] bg-[#EAE6DC]/20 space-y-3"
                    >
                      <span className="text-[11px] font-mono font-bold text-[#171717]">
                        STEP {step.stepNumber} — {step.title}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={step.koreanTitle}
                          onChange={(e) => {
                            const updated = [...localSteps];
                            updated[idx].koreanTitle = e.target.value;
                            setLocalSteps(updated);
                          }}
                          placeholder="단계 한글 문구"
                          className="bg-[#F7F5F0] border border-[#DEDAD2] p-2 text-xs text-[#171717]"
                        />
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            id={`process-file-${idx}`}
                            onChange={(e) => handleProcessStepImageUpload(idx, e)}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById(`process-file-${idx}`)?.click()}
                            className="px-3 py-2 bg-[#171717] text-[#F7F5F0] text-[11px] font-mono whitespace-nowrap flex items-center gap-1 hover:bg-[#333]"
                          >
                            <Upload className="w-3 h-3" />
                            <span>사진 업로드</span>
                          </button>
                          <input
                            type="url"
                            value={step.image}
                            onChange={(e) => {
                              const updated = [...localSteps];
                              updated[idx].image = e.target.value;
                              setLocalSteps(updated);
                            }}
                            placeholder="또는 이미지 URL"
                            className="flex-1 bg-[#F7F5F0] border border-[#DEDAD2] p-2 text-xs text-[#171717] font-mono"
                          />
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={step.description}
                        onChange={(e) => {
                          const updated = [...localSteps];
                          updated[idx].description = e.target.value;
                          setLocalSteps(updated);
                        }}
                        placeholder="상세 설명"
                        className="w-full bg-[#F7F5F0] border border-[#DEDAD2] p-2 text-xs text-[#171717]"
                      />
                    </div>
                  ))}
                </div>
              </form>
            )}

            {/* ──────── TAB 4: INQUIRIES ──────── */}
            {activeTab === 'INQUIRIES' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#DEDAD2]">
                  <div>
                    <h3 className="font-serif text-xl font-light">접수된 문의 내역</h3>
                    <p className="text-xs text-[#77736B]">
                      CONTACT 페이지를 통해 전송된 최근 문의 내역입니다.
                    </p>
                  </div>
                  {inquiries.length > 0 && (
                    <button
                      onClick={handleClearInquiries}
                      className="text-xs font-mono text-red-600 hover:underline"
                    >
                      전체 삭제
                    </button>
                  )}
                </div>

                {inquiries.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#77736B] font-mono">
                    아직 접수된 문의가 없습니다.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inq: any) => (
                      <div
                        key={inq.id}
                        className="p-4 border border-[#DEDAD2] bg-[#EAE6DC]/30 space-y-2"
                      >
                        <div className="flex justify-between items-baseline text-xs font-mono">
                          <span className="font-semibold text-[#171717]">
                            {inq.name} ({inq.email})
                          </span>
                          <span className="text-[#77736B]">
                            {new Date(inq.date).toLocaleDateString()} [
                            {inq.inquiryType}]
                          </span>
                        </div>
                        <p className="text-xs text-[#171717] whitespace-pre-wrap font-sans bg-[#F7F5F0] p-3 border border-[#DEDAD2]">
                          {inq.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Controls Bar */}
          <div className="px-6 py-3 border-t border-[#DEDAD2] bg-[#EAE6DC]/50 flex items-center justify-between text-xs font-mono">
            <button
              onClick={handleResetAll}
              className="text-[#77736B] hover:text-red-600 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기 포트폴리오 데이터 복원</span>
            </button>
            <span className="text-[#9E9A91]">LEGNA Craft Portfolio Admin</span>
          </div>
        </div>
      )}
    </div>
  );
};

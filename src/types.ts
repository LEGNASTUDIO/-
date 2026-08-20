export type WorkCategory = 'LIGHT' | 'OBJECTS' | 'EXPERIMENTS';

export interface WorkItem {
  id: string;
  numberCode: string; // e.g. "01" or "PROJECT 01"
  title: string;
  subtitle?: string;
  category: WorkCategory;
  year: string;
  materials: string; // e.g. "Hanji / Bamboo"
  dimensions?: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string; // Large primary image
  detailImage: string; // Texture / hand touch close-up
  spaceImage: string; // Space / architectural context image
  craftImage?: string; // Process / making image
  galleryImages?: string[]; // Multiple additional project images
  isFeatured?: boolean;
  order: number;
}

export interface ProcessStep {
  stepNumber: string; // e.g. "01"
  title: string; // e.g. "HANJI"
  koreanTitle: string; // e.g. "한지를 고르고"
  description: string;
  image: string;
}

export interface SiteContent {
  brandName: string;
  logoImage?: string; // Custom uploaded logo data URL or image URL
  logoHeight?: number; // Logo height in pixels (default: 32)
  heroLogoImage?: string; // Optional custom larger logo image for Hero section
  heroMainImage?: string; // Main hero ambient visual image on the home page
  heroImageFitMode?: 'cover' | 'contain' | 'natural'; // 'cover' (fill/crop), 'contain' (full artwork without cropping), 'natural' (original ratio)
  heroImageAspectRatio?: 'wide' | 'standard' | 'portrait' | 'square' | 'natural'; // aspect ratio presets
  heroImagePositionX?: number; // 0 to 100 percentage (default 50)
  heroImagePositionY?: number; // 0 to 100 percentage (default 50)
  heroImageZoom?: number; // 50 to 200 percentage (default 100)
  heroImageBgColor?: string; // background color when in contain mode ('#EAE6DC' | '#F7F5F0' | '#171717' | 'blur')
  aboutSectionImage?: string; // Image for About section on home & about pages
  materialSectionImage?: string; // Image for Hanji material section
  artistSectionImage?: string; // Image for Artist introduction
  heroHeadline: string;
  heroSubheadline: string;
  aboutLegnaIntro: string;
  aboutLegnaBody: string;
  materialQuoteEn: string;
  materialQuoteKo: string;
  artistIntro: string;
  philosophyText: string;
  contactEmail: string;
  instagramHandle: string;
  instagramUrl: string;
}

export type PageView = 'HOME' | 'WORKS' | 'ABOUT' | 'PROCESS' | 'CONTACT';

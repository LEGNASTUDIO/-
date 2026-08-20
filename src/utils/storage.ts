import { WorkItem, SiteContent, ProcessStep } from '../types';
import { INITIAL_WORKS, INITIAL_SITE_CONTENT, PROCESS_STEPS } from '../data/initialData';

const STORAGE_KEYS = {
  WORKS: 'legna_portfolio_works_v1',
  SITE_CONTENT: 'legna_site_content_v2',
  PROCESS_STEPS: 'legna_process_steps_v1',
};

export function getStoredWorks(): WorkItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load stored works from localStorage', err);
  }
  return INITIAL_WORKS;
}

export function saveStoredWorks(works: WorkItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(works));
  } catch (err) {
    console.error('Failed to save works to localStorage', err);
  }
}

export function getStoredSiteContent(): SiteContent {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
    if (data) {
      return { ...INITIAL_SITE_CONTENT, ...JSON.parse(data) };
    }
  } catch (err) {
    console.warn('Failed to load site content from localStorage', err);
  }
  return INITIAL_SITE_CONTENT;
}

export function saveStoredSiteContent(content: SiteContent): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(content));
  } catch (err) {
    console.error('Failed to save site content to localStorage', err);
  }
}

export function getStoredProcessSteps(): ProcessStep[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROCESS_STEPS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load process steps from localStorage', err);
  }
  return PROCESS_STEPS;
}

export function saveStoredProcessSteps(steps: ProcessStep[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROCESS_STEPS, JSON.stringify(steps));
  } catch (err) {
    console.error('Failed to save process steps to localStorage', err);
  }
}

export function resetToDefaults(): { works: WorkItem[]; content: SiteContent; steps: ProcessStep[] } {
  localStorage.removeItem(STORAGE_KEYS.WORKS);
  localStorage.removeItem(STORAGE_KEYS.SITE_CONTENT);
  localStorage.removeItem(STORAGE_KEYS.PROCESS_STEPS);
  return {
    works: INITIAL_WORKS,
    content: INITIAL_SITE_CONTENT,
    steps: PROCESS_STEPS,
  };
}

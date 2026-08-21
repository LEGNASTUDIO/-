import { WorkItem, SiteContent, ProcessStep } from '../types';
import { INITIAL_WORKS, INITIAL_SITE_CONTENT, PROCESS_STEPS } from '../data/initialData';

const STORAGE_KEYS = {
  WORKS: 'legna_portfolio_works_v1',
  SITE_CONTENT: 'legna_site_content_v2',
  PROCESS_STEPS: 'legna_process_steps_v1',
};

export function getStoredWorks(): WorkItem[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(STORAGE_KEYS.WORKS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => ({
            ...(INITIAL_WORKS[idx % INITIAL_WORKS.length] || INITIAL_WORKS[0]),
            ...item,
          }));
        }
      }
    }
  } catch (err) {
    console.warn('Failed to load stored works from localStorage', err);
  }
  return INITIAL_WORKS;
}

export function saveStoredWorks(works: WorkItem[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(works));
    }
  } catch (err) {
    console.error('Failed to save works to localStorage', err);
  }
}

export function getStoredSiteContent(): SiteContent {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object') {
          return { ...INITIAL_SITE_CONTENT, ...parsed };
        }
      }
    }
  } catch (err) {
    console.warn('Failed to load site content from localStorage', err);
  }
  return INITIAL_SITE_CONTENT;
}

export function saveStoredSiteContent(content: SiteContent): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(content));
    }
  } catch (err) {
    console.error('Failed to save site content to localStorage', err);
  }
}

export function getStoredProcessSteps(): ProcessStep[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(STORAGE_KEYS.PROCESS_STEPS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => ({
            ...(PROCESS_STEPS[idx % PROCESS_STEPS.length] || PROCESS_STEPS[0]),
            ...item,
          }));
        }
      }
    }
  } catch (err) {
    console.warn('Failed to load process steps from localStorage', err);
  }
  return PROCESS_STEPS;
}

export function saveStoredProcessSteps(steps: ProcessStep[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEYS.PROCESS_STEPS, JSON.stringify(steps));
    }
  } catch (err) {
    console.error('Failed to save process steps to localStorage', err);
  }
}

export function resetToDefaults(): { works: WorkItem[]; content: SiteContent; steps: ProcessStep[] } {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEYS.WORKS);
      window.localStorage.removeItem(STORAGE_KEYS.SITE_CONTENT);
      window.localStorage.removeItem(STORAGE_KEYS.PROCESS_STEPS);
    }
  } catch (err) {
    console.warn('Failed to clear localStorage keys', err);
  }
  return {
    works: INITIAL_WORKS,
    content: INITIAL_SITE_CONTENT,
    steps: PROCESS_STEPS,
  };
}

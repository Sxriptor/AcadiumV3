// Guest Mode Utilities
// This module handles guest mode functionality where users can use the app
// with a preset guest account but all their data is stored locally in the browser

// Focus type definition
type Focus = 'ai-automation' | 'web-dev' | 'ai-video' | 'explore' | 'advanced';

const GUEST_STORAGE_PREFIX = 'acadium_guest_';
const GUEST_USER_KEY = `${GUEST_STORAGE_PREFIX}user`;
const GUEST_PROFILE_KEY = `${GUEST_STORAGE_PREFIX}profile`;
const GUEST_PROGRESS_KEY = `${GUEST_STORAGE_PREFIX}progress`;
const GUEST_CHECKLIST_KEY = `${GUEST_STORAGE_PREFIX}checklist`;
const GUEST_FAVORITES_KEY = `${GUEST_STORAGE_PREFIX}favorites`;
const GUEST_RECENT_KEY = `${GUEST_STORAGE_PREFIX}recent`;
const GUEST_MODE_FLAG = `${GUEST_STORAGE_PREFIX}mode`;

// Preset guest user data
const GUEST_USER_DATA = {
  id: 'guest-user-id',
  email: 'guest@acadium.ai',
  created_at: new Date().toISOString(),
  user_metadata: {},
  app_metadata: {}
};

const GUEST_SUBSCRIPTION_DATA = {
  id: 'guest-subscription-id',
  user_id: 'guest-user-id',
  plan_id: 'guest-plan-id',
  status: 'active',
  stripe_customer_id: null,
  stripe_subscription_id: null,
  current_period_end: null,
  cancel_at_period_end: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  plans: {
    name: 'Guest Access'
  }
};

export interface GuestProfile {
  id: string;
  user_id: string;
  full_name: string;
  mission: 'ai-automation' | 'web-dev' | 'ai-video' | 'explore' | 'advanced';
  skill_level: 'beginner' | 'intermediate' | 'pro';
  focus: 'ai-automation' | 'web-dev' | 'ai-video' | 'explore' | 'advanced';
  referral?: string;
  avatar_url?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface GuestProgress {
  [toolId: string]: {
    [stepId: string]: {
      completed: boolean;
      completed_at?: string;
      notes?: string;
    };
  };
}

export interface GuestChecklistItem {
  id: string;
  tool_id: string;
  checklist_item_id: string;
  completed: boolean;
  completed_at?: string;
}

export interface GuestFavorite {
  id: string;
  page_path: string;
  page_title: string;
  page_icon: string;
  created_at: string;
}

export interface GuestRecentPage {
  id: string;
  page_path: string;
  page_title: string;
  page_icon: string;
  last_visited: string;
  visit_count: number;
}

export const guestMode = {
  // Check if currently in guest mode
  isGuestMode: (): boolean => {
    return localStorage.getItem(GUEST_MODE_FLAG) === 'true';
  },

  // Enable guest mode
  enableGuestMode: (): void => {
    localStorage.setItem(GUEST_MODE_FLAG, 'true');
    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(GUEST_USER_DATA));
  },

  // Disable guest mode and clear all guest data
  disableGuestMode: (): void => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(GUEST_STORAGE_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
  },

  // Get guest user data
  getGuestUser: () => {
    if (!guestMode.isGuestMode()) return null;
    const userData = localStorage.getItem(GUEST_USER_KEY);
    return userData ? JSON.parse(userData) : GUEST_USER_DATA;
  },

  // Get guest subscription (always active for guest)
  getGuestSubscription: () => {
    if (!guestMode.isGuestMode()) return null;
    return GUEST_SUBSCRIPTION_DATA;
  },

  // Profile management
  getGuestProfile: (): GuestProfile | null => {
    if (!guestMode.isGuestMode()) return null;
    const profile = localStorage.getItem(GUEST_PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  },

  setGuestProfile: (profile: GuestProfile): void => {
    if (!guestMode.isGuestMode()) return;
    profile.updated_at = new Date().toISOString();
    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
  },

  createGuestProfile: (profileData: Partial<GuestProfile>): GuestProfile => {
    const profile: GuestProfile = {
      id: 'guest-profile-id',
      user_id: 'guest-user-id',
      full_name: profileData.full_name || 'Guest User',
      mission: profileData.mission || 'explore',
      skill_level: profileData.skill_level || 'beginner',
      focus: profileData.focus || 'explore',
      referral: profileData.referral,
      avatar_url: profileData.avatar_url,
      onboarding_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    guestMode.setGuestProfile(profile);
    return profile;
  },

  // Progress management
  getGuestProgress: (): GuestProgress => {
    if (!guestMode.isGuestMode()) return {};
    const progress = localStorage.getItem(GUEST_PROGRESS_KEY);
    return progress ? JSON.parse(progress) : {};
  },

  setGuestProgress: (progress: GuestProgress): void => {
    if (!guestMode.isGuestMode()) return;
    localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
  },

  markStepComplete: (toolId: string, stepId: string, notes?: string): void => {
    if (!guestMode.isGuestMode()) return;
    const progress = guestMode.getGuestProgress();
    
    if (!progress[toolId]) {
      progress[toolId] = {};
    }
    
    progress[toolId][stepId] = {
      completed: true,
      completed_at: new Date().toISOString(),
      notes
    };
    
    guestMode.setGuestProgress(progress);
  },

  markStepIncomplete: (toolId: string, stepId: string): void => {
    if (!guestMode.isGuestMode()) return;
    const progress = guestMode.getGuestProgress();
    
    if (progress[toolId] && progress[toolId][stepId]) {
      progress[toolId][stepId] = {
        completed: false
      };
      guestMode.setGuestProgress(progress);
    }
  },

  isStepCompleted: (toolId: string, stepId: string): boolean => {
    if (!guestMode.isGuestMode()) return false;
    const progress = guestMode.getGuestProgress();
    return progress[toolId]?.[stepId]?.completed || false;
  },

  // Checklist management
  getGuestChecklist: (): GuestChecklistItem[] => {
    if (!guestMode.isGuestMode()) return [];
    const checklist = localStorage.getItem(GUEST_CHECKLIST_KEY);
    return checklist ? JSON.parse(checklist) : [];
  },

  setGuestChecklist: (checklist: GuestChecklistItem[]): void => {
    if (!guestMode.isGuestMode()) return;
    localStorage.setItem(GUEST_CHECKLIST_KEY, JSON.stringify(checklist));
  },

  updateChecklistItem: (toolId: string, checklistItemId: string, completed: boolean): void => {
    if (!guestMode.isGuestMode()) return;
    const checklist = guestMode.getGuestChecklist();
    
    const existingIndex = checklist.findIndex(
      item => item.tool_id === toolId && item.checklist_item_id === checklistItemId
    );
    
    if (existingIndex >= 0) {
      checklist[existingIndex].completed = completed;
      checklist[existingIndex].completed_at = completed ? new Date().toISOString() : undefined;
    } else {
      checklist.push({
        id: `guest-checklist-${Date.now()}-${Math.random()}`,
        tool_id: toolId,
        checklist_item_id: checklistItemId,
        completed,
        completed_at: completed ? new Date().toISOString() : undefined
      });
    }
    
    guestMode.setGuestChecklist(checklist);
  },

  // Favorites management
  getGuestFavorites: (): GuestFavorite[] => {
    if (!guestMode.isGuestMode()) return [];
    const favorites = localStorage.getItem(GUEST_FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  },

  setGuestFavorites: (favorites: GuestFavorite[]): void => {
    if (!guestMode.isGuestMode()) return;
    localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(favorites));
  },

  addToFavorites: (pagePath: string, pageTitle: string, pageIcon: string): void => {
    if (!guestMode.isGuestMode()) return;
    const favorites = guestMode.getGuestFavorites();
    
    // Check if already exists
    if (favorites.some(fav => fav.page_path === pagePath)) return;
    
    favorites.push({
      id: `guest-favorite-${Date.now()}-${Math.random()}`,
      page_path: pagePath,
      page_title: pageTitle,
      page_icon: pageIcon,
      created_at: new Date().toISOString()
    });
    
    guestMode.setGuestFavorites(favorites);
  },

  removeFromFavorites: (pagePath: string): void => {
    if (!guestMode.isGuestMode()) return;
    const favorites = guestMode.getGuestFavorites();
    const filtered = favorites.filter(fav => fav.page_path !== pagePath);
    guestMode.setGuestFavorites(filtered);
  },

  isFavorite: (pagePath: string): boolean => {
    if (!guestMode.isGuestMode()) return false;
    const favorites = guestMode.getGuestFavorites();
    return favorites.some(fav => fav.page_path === pagePath);
  },

  clearAllFavorites: (): void => {
    if (!guestMode.isGuestMode()) return;
    guestMode.setGuestFavorites([]);
  },

  // Recent pages management
  getGuestRecentPages: (): GuestRecentPage[] => {
    if (!guestMode.isGuestMode()) return [];
    const recent = localStorage.getItem(GUEST_RECENT_KEY);
    const pages = recent ? JSON.parse(recent) : [];
    return pages.sort((a: GuestRecentPage, b: GuestRecentPage) => 
      new Date(b.last_visited).getTime() - new Date(a.last_visited).getTime()
    );
  },

  setGuestRecentPages: (pages: GuestRecentPage[]): void => {
    if (!guestMode.isGuestMode()) return;
    localStorage.setItem(GUEST_RECENT_KEY, JSON.stringify(pages));
  },

  addToRecentPages: (pagePath: string, pageTitle: string, pageIcon: string): void => {
    if (!guestMode.isGuestMode()) return;
    const recentPages = guestMode.getGuestRecentPages();
    
    const existingIndex = recentPages.findIndex(page => page.page_path === pagePath);
    
    if (existingIndex >= 0) {
      // Update existing page
      recentPages[existingIndex].last_visited = new Date().toISOString();
      recentPages[existingIndex].visit_count += 1;
    } else {
      // Add new page
      recentPages.unshift({
        id: `guest-recent-${Date.now()}-${Math.random()}`,
        page_path: pagePath,
        page_title: pageTitle,
        page_icon: pageIcon,
        last_visited: new Date().toISOString(),
        visit_count: 1
      });
    }
    
    // Keep only the most recent 10 pages
    const trimmed = recentPages.slice(0, 10);
    guestMode.setGuestRecentPages(trimmed);
  },

  clearAllRecentPages: (): void => {
    if (!guestMode.isGuestMode()) return;
    guestMode.setGuestRecentPages([]);
  },

  // Get completion stats for mini apps
  getCompletionStats: (toolId: string): { completed: number; total: number } => {
    if (!guestMode.isGuestMode()) return { completed: 0, total: 0 };
    
    const progress = guestMode.getGuestProgress();
    const toolProgress = progress[toolId];
    
    if (!toolProgress) return { completed: 0, total: 0 };
    
    const steps = Object.values(toolProgress);
    const completed = steps.filter(step => step.completed).length;
    const total = steps.length;
    
    return { completed, total };
  },

  // Focus management for guest mode
  updateGuestFocus: (newFocus: Focus): void => {
    if (!guestMode.isGuestMode()) return;
    
    const profile = guestMode.getGuestProfile();
    if (!profile) return;
    
    // Update both focus and mission to match the pattern from regular users
    const updatedProfile = {
      ...profile,
      focus: newFocus,
      mission: newFocus,
      updated_at: new Date().toISOString()
    };
    
    guestMode.setGuestProfile(updatedProfile);
    console.log(`Guest focus updated to: ${newFocus}`);
  },

  getGuestFocus: (): Focus => {
    if (!guestMode.isGuestMode()) return 'explore';
    
    const profile = guestMode.getGuestProfile();
    return profile?.focus || 'explore';
  }
}; 
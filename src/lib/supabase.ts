import { createClient } from '@supabase/supabase-js';
import { guestMode } from './guestMode';

const supabaseUrl = 'https://kpacxfxggoutavjfqvbh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYWN4ZnhnZ291dGF2amZxdmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMTUzODMsImV4cCI6MjA2NDU5MTM4M30.9_hhdIXGsszv9WA7CtW4p3zYuhNEOU5ItRSobt0dT-4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

export type UserProfile = {
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
};

// Enhanced auth cache utilities with longer duration and better storage
const AUTH_CACHE_KEY = 'acadium_auth_cache';
const PROFILE_CACHE_KEY = 'acadium_profile_cache';
const SUBSCRIPTION_CACHE_KEY = 'acadium_subscription_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes instead of 5

interface AuthCache {
  user: any;
  timestamp: number;
}

interface ProfileCache {
  profile: any;
  userId: string;
  timestamp: number;
}

interface SubscriptionCache {
  subscription: any;
  userId: string;
  timestamp: number;
}

// Enhanced cache utilities
export const authCache = {
  setUser: (user: any) => {
    try {
      const cacheData: AuthCache = {
        user,
        timestamp: Date.now()
      };
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting user cache:', error);
    }
  },

  getUser: (): any | null => {
    try {
      const cached = localStorage.getItem(AUTH_CACHE_KEY);
      if (!cached) return null;
      
      const data: AuthCache = JSON.parse(cached);
      const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(AUTH_CACHE_KEY);
        return null;
      }
      
      return data.user;
    } catch (error) {
      console.error('Error getting user cache:', error);
      return null;
    }
  },

  setProfile: (profile: any, userId: string) => {
    try {
      const cacheData: ProfileCache = {
        profile,
        userId,
        timestamp: Date.now()
      };
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting profile cache:', error);
    }
  },

  getProfile: (userId: string): any | null => {
    try {
      const cached = localStorage.getItem(PROFILE_CACHE_KEY);
      if (!cached) return null;
      
      const data: ProfileCache = JSON.parse(cached);
      const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
      const isWrongUser = data.userId !== userId;
      
      if (isExpired || isWrongUser) {
        localStorage.removeItem(PROFILE_CACHE_KEY);
        return null;
      }
      
      return data.profile;
    } catch (error) {
      console.error('Error getting profile cache:', error);
      return null;
    }
  },

  setSubscription: (subscription: any, userId: string) => {
    try {
      const cacheData: SubscriptionCache = {
        subscription,
        userId,
        timestamp: Date.now()
      };
      localStorage.setItem(SUBSCRIPTION_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting subscription cache:', error);
    }
  },

  getSubscription: (userId: string): any | null => {
    try {
      const cached = localStorage.getItem(SUBSCRIPTION_CACHE_KEY);
      if (!cached) return null;
      
      const data: SubscriptionCache = JSON.parse(cached);
      const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
      const isWrongUser = data.userId !== userId;
      
      if (isExpired || isWrongUser) {
        localStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
        return null;
      }
      
      return data.subscription;
    } catch (error) {
      console.error('Error getting subscription cache:', error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(AUTH_CACHE_KEY);
      localStorage.removeItem(PROFILE_CACHE_KEY);
      localStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
    } catch (error) {
      console.error('Error clearing auth cache:', error);
    }
  },

  // Method to check if we have valid cached data
  hasValidSession: (): boolean => {
    // Check guest mode first
    if (guestMode.isGuestMode()) {
      return true;
    }
    
    const user = authCache.getUser();
    return !!user;
  }
};

// Enhanced auth functions with guest mode support
export const getCachedUser = async () => {
  // Check guest mode first
  if (guestMode.isGuestMode()) {
    const guestUser = guestMode.getGuestUser();
    return { data: { user: guestUser }, error: null };
  }
  
  // First check cache
  const cachedUser = authCache.getUser();
  if (cachedUser) {
    return { data: { user: cachedUser }, error: null };
  }
  
  // If no cache, get from Supabase and cache the result
  const result = await supabase.auth.getUser();
  if (result.data.user && !result.error) {
    authCache.setUser(result.data.user);
  }
  
  return result;
};

export const getCachedProfile = async (userId: string) => {
  // Check guest mode first
  if (guestMode.isGuestMode()) {
    const guestProfile = guestMode.getGuestProfile();
    return { data: guestProfile, error: null };
  }
  
  // First check cache
  const cachedProfile = authCache.getProfile(userId);
  if (cachedProfile) {
    return { data: cachedProfile, error: null };
  }
  
  // If no cache, get from Supabase and cache the result
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (data && !error) {
    authCache.setProfile(data, userId);
  }
  
  return { data, error };
};

export const getCachedSubscription = async (userId: string) => {
  // Check guest mode first
  if (guestMode.isGuestMode()) {
    const guestSubscription = guestMode.getGuestSubscription();
    return { data: guestSubscription, error: null };
  }
  
  // First check cache
  const cachedSubscription = authCache.getSubscription(userId);
  if (cachedSubscription) {
    return { data: cachedSubscription, error: null };
  }
  
  // If no cache, get from Supabase and cache the result
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plans (
        name
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  
  if (data && !error) {
    authCache.setSubscription(data, userId);
  }
  
  return { data, error };
};

// Session management utilities with guest mode support
export const sessionManager = {
  // Initialize session from storage on app start
  initializeSession: async () => {
    try {
      // Check guest mode first
      if (guestMode.isGuestMode()) {
        const guestUser = guestMode.getGuestUser();
        return guestUser;
      }
      
      // Check if we have a valid cached session
      if (authCache.hasValidSession()) {
        const cachedUser = authCache.getUser();
        if (cachedUser) {
          console.log('Found cached user, redirecting...');
          return cachedUser;
        }
      }

      // If no cached session, try to initialize from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Cache the user data
        authCache.setUser(session.user);
        return session.user;
      }
      
      return null;
    } catch (error) {
      console.error('Error initializing session:', error);
      return null;
    }
  },

  // Clear all session data
  clearSession: () => {
    // Clear guest mode if active
    if (guestMode.isGuestMode()) {
      guestMode.disableGuestMode();
    }
    
    authCache.clear();
    // Supabase will handle clearing its own session storage
  },

  // Refresh session and update cache
  refreshSession: async () => {
    try {
      // Guest mode doesn't need refresh
      if (guestMode.isGuestMode()) {
        return guestMode.getGuestUser();
      }
      
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (session?.user && !error) {
        authCache.setUser(session.user);
        return session.user;
      }
      
      return null;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  }
};

// Auth state change listener setup
export const setupAuthListener = (callback: (user: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session?.user?.id);
    
    // Don't process auth changes if in guest mode
    if (guestMode.isGuestMode()) {
      return;
    }
    
    switch (event) {
      case 'SIGNED_IN':
        if (session?.user) {
          authCache.setUser(session.user);
          callback(session.user);
        }
        break;
        
      case 'SIGNED_OUT':
        authCache.clear();
        callback(null);
        break;
        
      case 'TOKEN_REFRESHED':
        if (session?.user) {
          authCache.setUser(session.user);
          callback(session.user);
        }
        break;
        
      case 'USER_UPDATED':
        if (session?.user) {
          authCache.setUser(session.user);
          // Clear profile cache to force refresh on next request
          localStorage.removeItem(PROFILE_CACHE_KEY);
          callback(session.user);
        }
        break;
    }
  });

  return subscription;
};
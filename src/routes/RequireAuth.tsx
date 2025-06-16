import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase, getCachedUser, getCachedProfile, getCachedSubscription, authCache, sessionManager, setupAuthListener } from '../lib/supabase';

export const RequireAuth: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [userFocus, setUserFocus] = useState<string | null>(null);
  const location = useLocation();

  // Function to get redirect path based on user focus
  const getRedirectPath = async (userId: string): Promise<string> => {
    try {
      const { data: profile } = await getCachedProfile(userId);
      
      if (profile?.focus) {
        switch (profile.focus) {
          case 'ai-automation':
            return '/n8n';
          case 'ai-video':
            return '/video';
          case 'web-dev':
            return '/webdev';
          case 'advanced':
            return '/advanced';
          case 'explore':
          default:
            return '/';
        }
      }
      
      return '/'; // default to index if no focus found
    } catch (error) {
      console.error('Error getting user focus for redirect:', error);
      return '/'; // default to index on error
    }
  };

  useEffect(() => {
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        // First, try to get user from cache or initialize session
        let currentUser = authCache.getUser();
        
        if (!currentUser) {
          // If no cached user, try to initialize from Supabase session
          currentUser = await sessionManager.initializeSession();
        }

        if (currentUser) {
          setUser(currentUser);
          await checkUserProfile(currentUser.id);
          await checkUserSubscription(currentUser.id);
        } else {
          setLoading(false);
        }

        // Set up auth state listener for future changes
        authSubscription = setupAuthListener(async (user) => {
          setUser(user);
          if (user) {
            await checkUserProfile(user.id);
            await checkUserSubscription(user.id);
          } else {
            setHasProfile(null);
            setHasSubscription(null);
            setUserFocus(null);
            setLoading(false);
          }
        });

      } catch (error) {
        console.error('RequireAuth: Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  async function checkUserProfile(userId: string) {
    try {
      const { data: profile, error } = await getCachedProfile(userId);

      if (error) {
        console.error('Error checking profile:', error);
        setHasProfile(false);
        setUserFocus(null);
      } else {
        setHasProfile(!!profile);
        setUserFocus(profile?.focus || null);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setHasProfile(false);
      setUserFocus(null);
    }
  }

  async function checkUserSubscription(userId: string) {
    try {
      const { data: subscription, error } = await getCachedSubscription(userId);

      if (error) {
        console.error('Error checking subscription:', error);
        setHasSubscription(false);
      } else {
        setHasSubscription(!!subscription);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasSubscription(false);
      setLoading(false);
    }
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect to auth if no user
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if user exists but no profile
  if (user && !hasProfile && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect to payment if user has profile but no subscription
  if (user && hasProfile && !hasSubscription && location.pathname !== '/payment') {
    return <Navigate to="/payment" replace />;
  }

  // If we're at the root path, redirect to focus-specific page only if focus is not 'explore'
  if (location.pathname === '/' && user && hasProfile && userFocus && userFocus !== 'explore') {
    switch (userFocus) {
      case 'ai-automation':
        return <Navigate to="/n8n" replace />;
      case 'ai-video':
        return <Navigate to="/video" replace />;
      case 'web-dev':
        return <Navigate to="/webdev" replace />;
      case 'advanced':
        return <Navigate to="/advanced" replace />;
      default:
        break;
    }
  }

  return <Outlet />;
};
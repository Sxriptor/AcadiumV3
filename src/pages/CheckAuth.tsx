import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getCachedProfile } from '../lib/supabase';

const CheckAuth: React.FC = () => {
  const navigate = useNavigate();

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
    const redirectUser = async () => {
      try {
        // Add timeout for the entire auth check process
        const authCheckPromise = (async () => {
          const { data: { user } } = await supabase.auth.getUser();

          // If no user, redirect to auth
          if (!user) {
            navigate('/auth');
            return;
          }

          // Check if user has a profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          // If no profile, redirect to onboarding
          if (!profile) {
            navigate('/onboarding');
            return;
          }

          // Check if user has an active subscription
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          // If no subscription, redirect to payment
          if (!subscription) {
            navigate('/payment');
            return;
          }

          // User has everything, redirect to their focus-specific homepage
          const redirectPath = await getRedirectPath(user.id);
          navigate(redirectPath);
        })();

        await authCheckPromise;
      } catch (error) {
        console.error('CheckAuth error:', error);
        // On error or timeout, redirect to auth as fallback
        navigate('/auth');
      }
    };

    redirectUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-gray-600 dark:text-gray-400 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        Redirecting...
      </div>
    </div>
  );
};

export default CheckAuth;
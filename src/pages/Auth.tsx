import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, authCache, sessionManager, getCachedProfile } from '../lib/supabase';
import { guestMode } from '../lib/guestMode';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Mail, Lock, Circle, X, UserCheck } from 'lucide-react';
import { FloatingThemeToggle } from '../components/ui/FloatingThemeToggle';
import { useTheme } from '../components/ui/ThemeProvider';

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

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

  // Handle guest mode login
  const handleGuestMode = async () => {
    setGuestLoading(true);
    setError(null);

    try {
      // Enable guest mode
      guestMode.enableGuestMode();
      
      // Navigate to onboarding to set up guest profile
      navigate('/onboarding?guest=true');
    } catch (error) {
      console.error('Error entering guest mode:', error);
      setError('Failed to enter guest mode. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // Check if we have a valid cached session
        if (authCache.hasValidSession()) {
          const cachedUser = authCache.getUser();
          if (cachedUser) {
            console.log('Found cached user, redirecting...');
            navigate('/check-auth');
            return;
          }
        }

        // If no cached session, try to initialize from Supabase
        const user = await sessionManager.initializeSession();
        if (user) {
          console.log('Found Supabase session, redirecting...');
          navigate('/check-auth');
          return;
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
      } finally {
        setInitializing(false);
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/verify-email`
          }
        });
        if (error) throw error;
        
        localStorage.setItem('pendingVerificationEmail', email);
        navigate('/verify-email');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Cache the user data immediately after successful sign in
        if (data.user) {
          authCache.setUser(data.user);
          
          // Redirect to check-auth which will handle the proper redirection
          navigate('/check-auth');
        }
        
        localStorage.removeItem('pendingVerificationEmail');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking for existing session
  if (initializing) {
    return (
      <div className={`relative min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-${theme === 'dark' ? 'white' : 'gray-900'}`}>
        {/* Background gradient */}
        <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${
            theme === 'dark' 
              ? 'from-blue-900/30 via-gray-900 to-red-900/20' 
              : 'from-blue-100/80 via-gray-50 to-red-100/60'
          }`}></div>
          <div className={`absolute top-0 right-0 w-1/2 h-1/2 ${
            theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-200/60'
          } rounded-full blur-[120px]`}></div>
          <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 ${
            theme === 'dark' ? 'bg-red-600/20' : 'bg-red-200/60'
          } rounded-full blur-[120px]`}></div>
        </div>

        {/* Loading content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <FloatingThemeToggle />
          <main className="flex-grow flex items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-gray-600 dark:text-gray-400">Checking authentication...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-${theme === 'dark' ? 'white' : 'gray-900'}`}>
      {/* Main background gradient - EXACT COPY FROM LANDING PAGE */}
      <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${
          theme === 'dark' 
            ? 'from-blue-900/30 via-gray-900 to-red-900/20' 
            : 'from-blue-100/80 via-gray-50 to-red-100/60'
        }`}></div>
        <div className={`absolute top-0 right-0 w-1/2 h-1/2 ${
          theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-200/60'
        } rounded-full blur-[120px]`}></div>
        <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 ${
          theme === 'dark' ? 'bg-red-600/20' : 'bg-red-200/60'
        } rounded-full blur-[120px]`}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyODI4MjgiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBBMzAgMzAgMCAxIDEgMCAzMGEzMCAzMCAwIDAgMSA2MCAweiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9Ii41Ci8+PHBhdGggZD0iTTYwIDI0YTYgNiAwIDAgMS0xMiAwIDYgNiAwIDAgMSAxMiAweiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9Ii41Ci8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <FloatingThemeToggle />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <div className="relative h-8 w-8 mr-2">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" stroke="url(#iconGradient)" strokeWidth="2" fill="none" />
                <path d="m15 9-6 6" stroke="url(#iconGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="m9 9 6 6" stroke="url(#iconGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Acadium - AI
            </h1>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            {isSignUp 
              ? 'Sign up to start your journey'
              : 'Sign in to access your account'}
          </p>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  I accept the{' '}
                  <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className={`w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 transition-all duration-200 ${
                (isSignUp && !acceptedTerms) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              disabled={loading || (isSignUp && !acceptedTerms)}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>

            {/* Guest Mode Button */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  or
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGuestMode}
              disabled={guestLoading}
              variant="ghost"
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 !text-gray-900 dark:!text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
            >
              <UserCheck className="h-5 w-5 mr-2" />
              {guestLoading ? 'Starting Guest Mode...' : 'Try as Guest'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setAcceptedTerms(false);
                }}
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>

          {/* Guest Mode Info */}
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800/20 rounded-lg border border-gray-300 dark:border-gray-800">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              👤 Guest Mode
            </h4>
            <p className="text-xs text-gray-700 dark:text-gray-200">
              Try the full platform without creating an account. Your progress will be saved locally in your browser.
            </p>
          </div>
        </div>
      </Card>
        </main>
      </div>
    </div>
  );
};

export default Auth;
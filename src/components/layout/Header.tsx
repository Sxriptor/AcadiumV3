import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Brain, Moon, Sun, Settings, Palette, LogOut, HelpCircle, ChevronDown, MessageSquare, Menu } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';
import { ProgressRing } from '../ui/ProgressRing';
import { Button } from '../ui/Button';
import { HintOverlay } from '../shared/HintOverlay';
import { DiscordInviteOverlay } from '../shared/DiscordInviteOverlay';
import { supabase, getCachedUser, getCachedProfile, getCachedSubscription, authCache, sessionManager } from '../../lib/supabase';
import { guestMode } from '../../lib/guestMode';
import { useOverallProgress } from '../../hooks/useOverallProgress';
import { 
  isFromOnboarding, 
  hasSeenHints, 
  markHintsAsShown, 
  clearOnboardingFlag,
  isFromPayment,
  hasSeenDiscordInvite,
  markDiscordInviteAsShown,
  clearPaymentFlag,
  openDiscordInvite
} from '../../utils/hintUtils';

interface HeaderProps {
  sidebarCollapsed?: boolean;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
  onExpandSidebar?: () => void;
}

interface UserData {
  name: string;
  avatar: string;
  progress: number;
  plan: string;
  focus: 'explore' | 'ai-automation' | 'web-dev' | 'ai-video' | 'advanced';
}

export const Header: React.FC<HeaderProps> = ({ 
  sidebarCollapsed = false,
  onMobileMenuToggle,
  isMobileMenuOpen = false,
  onExpandSidebar
}) => {
  const { theme, gradientType, setTheme, setGradientType } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isFocusDropdownOpen, setIsFocusDropdownOpen] = useState(false);
  const [showGradientOptions, setShowGradientOptions] = useState(false);
  const [isHintOverlayOpen, setIsHintOverlayOpen] = useState(false);
  const [shouldAutoShowHints, setShouldAutoShowHints] = useState(false);
  const [isDiscordInviteOpen, setIsDiscordInviteOpen] = useState(false);
  const [shouldAutoShowDiscord, setShouldAutoShowDiscord] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: 'Loading...',
    avatar: '',
    progress: 0,
    plan: 'Loading...',
    focus: 'explore'
  });
  
  // Get real progress based on user focus
  const { progress: overallProgress } = useOverallProgress(userData.focus);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const focusDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Focus areas mapping - using the same values as onboarding
  const focusAreas = {
    'explore': {
      title: 'Exploring',
      description: 'Discover new opportunities and trends',
      path: '/',
      color: 'from-green-500 to-emerald-600',
      icon: '🔍'
    },
    'ai-automation': {
      title: 'N8n Agents',
      description: 'Build automated workflows and AI agents',
      path: '/n8n',
      color: 'from-purple-500 to-indigo-600',
      icon: '🤖'
    },
    'web-dev': {
      title: 'Developers',
      description: 'Learn coding and development skills',
      path: '/webdev',
      color: 'from-blue-500 to-cyan-600',
      icon: '👨‍💻'
    },
    'ai-video': {
      title: 'Video Creation',
      description: 'Advance your career with AI skills',
      path: '/video',
      color: 'from-red-500 to-pink-600',
      icon: '🎬'
    },

    'advanced': {
      title: 'Advanced',
      description: 'Access all tools and features',
      path: '/advanced',
      color: 'from-gray-700 to-gray-900',
      icon: '⚡'
    }
  };

  // Theme options for dropdown
  const themeOptions = [
    {
      id: 'light',
      name: 'Light Theme',
      description: 'Clean and bright interface',
      icon: <Sun className="h-4 w-4" />,
      preview: (
        <div className="w-6 h-4 rounded bg-white border border-gray-200">
          <div className="h-1 w-3 bg-gray-100 rounded m-0.5"></div>
          <div className="h-0.5 w-2 bg-blue-500 rounded m-0.5"></div>
        </div>
      )
    },
    {
      id: 'dark',
      name: 'Dark Theme',
      description: 'Easy on the eyes in low light',
      icon: <Moon className="h-4 w-4" />,
      preview: (
        <div className="w-6 h-4 rounded bg-gray-900 border border-gray-700">
          <div className="h-1 w-3 bg-gray-800 rounded m-0.5"></div>
          <div className="h-0.5 w-2 bg-blue-500 rounded m-0.5"></div>
        </div>
      )
    },
    {
      id: 'gradient',
      name: 'Gradient Mode',
      description: 'Dynamic gradient backgrounds',
      icon: <Palette className="h-4 w-4" />,
      preview: (
        <div className="w-6 h-4 rounded bg-gradient-to-br from-blue-600 to-red-600 border border-gray-300">
          <div className="h-1 w-3 bg-white/20 rounded m-0.5"></div>
          <div className="h-0.5 w-2 bg-white/40 rounded m-0.5"></div>
        </div>
      )
    }
  ];

  // Gradient options for when gradient theme is selected
  const gradientOptions = [
    {
      id: 'blueRed',
      name: 'Blue Red',
      description: 'Classic blue to red',
      preview: 'bg-gradient-to-br from-blue-600 to-red-600'
    },
    {
      id: 'purpleBlue',
      name: 'Purple Blue',
      description: 'Deep purple to bright blue',
      preview: 'bg-gradient-to-br from-purple-600 to-blue-500'
    },
    {
      id: 'greenTeal',
      name: 'Green Teal',
      description: 'Fresh green to teal',
      preview: 'bg-gradient-to-br from-green-500 to-teal-500'
    },
    {
      id: 'orangePink',
      name: 'Orange Pink',
      description: 'Warm orange to pink',
      preview: 'bg-gradient-to-br from-orange-500 to-pink-500'
    },
    {
      id: 'darkTeal',
      name: 'Dark Teal',
      description: 'Dark slate to cyan',
      preview: 'bg-gradient-to-br from-slate-800 to-cyan-500'
    }
  ];

  // Hint steps for the guided tour
  const hintSteps = [
    {
      id: 'sidebar',
      title: 'Navigation Sidebar',
      description: 'Your main navigation hub! This sidebar contains all your learning paths, tools, and pages. You can collapse it by clicking the menu icon for more screen space.',
      targetSelector: '[data-hint="sidebar"]',
      position: 'right' as const,
      offset: { x: 20, y: 0 }
    },
    {
      id: 'sidebar-toggle',
      title: 'Sidebar Toggle',
      description: 'Click this button to expand or collapse the sidebar. When collapsed, you\'ll see only icons to maximize your workspace.',
      targetSelector: '[data-hint="sidebar-toggle"]',
      position: 'right' as const,
      offset: { x: 20, y: 0 }
    },
    {
      id: 'search',
      title: 'Search Bar',
      description: 'Use this search bar to quickly find content, tools, or pages across the platform. It supports fuzzy search to help you find what you need even with partial matches.',
      targetSelector: '[data-hint="search"]',
      position: 'bottom' as const,
      offset: { x: 0, y: 10 }
    },
    {
      id: 'focus',
      title: 'Focus Areas',
      description: 'Click the brain icon to switch between different learning paths. Your focus area determines what content and tools are prioritized in your dashboard and sidebar.',
      targetSelector: '[data-hint="focus"]',
      position: 'bottom' as const,
      offset: { x: 0, y: 10 }
    },
    {
      id: 'discord',
      title: 'Discord Community',
      description: 'Join our Discord community to connect with other learners, get help, share your progress, and participate in discussions with mentors and peers.',
      targetSelector: '[data-hint="discord"]',
      position: 'bottom' as const,
      offset: { x: 0, y: 10 }
    },
    {
      id: 'theme',
      title: 'Theme Selector',
      description: 'Customize your experience by choosing between light, dark, or gradient themes. Gradient themes offer multiple color combinations to match your style preferences.',
      targetSelector: '[data-hint="theme"]',
      position: 'bottom' as const,
      offset: { x: 0, y: 10 }
    },
    {
      id: 'progress',
      title: 'Progress Ring & Profile',
      description: 'This ring shows your overall progress in your current focus area. Click to view detailed progress breakdown, access profile settings, and manage your account.',
      targetSelector: '[data-hint="profile"]',
      position: 'bottom' as const,
      offset: { x: -50, y: 10 }
    },
    {
      id: 'favorites',
      title: 'Favorites Section',
      description: 'Your favorite pages are saved here for quick access. Click the heart icon on any page to add it to your favorites, or use the floating action button.',
      targetSelector: '[data-hint="favorites"]',
      position: 'right' as const,
      offset: { x: 20, y: 0 }
    },
    {
      id: 'recent',
      title: 'Recent Pages',
      description: 'Recently visited pages appear here automatically. This helps you quickly return to content you were working on or studying.',
      targetSelector: '[data-hint="recent"]',
      position: 'right' as const,
      offset: { x: 20, y: 0 }
    },
    {
      id: 'floating-action',
      title: 'Floating Action Button',
      description: 'This powerful button provides quick access to frequently used actions: add pages to favorites, get help & support, or report bugs. Hover over it to see all options!',
      targetSelector: '[data-hint="floating-action"]',
      position: 'left' as const,
      offset: { x: -20, y: 0 }
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Access your account settings, preferences, billing information, and app configuration. Customize your learning experience to match your needs.',
      targetSelector: '[data-hint="settings"]',
      position: 'right' as const,
      offset: { x: 20, y: 0 }
    }
  ];

  const handleHintToggle = () => {
    // If opening hints, ensure sidebar is expanded
    if (!isHintOverlayOpen && onExpandSidebar) {
      onExpandSidebar();
    }
    
    setIsHintOverlayOpen(!isHintOverlayOpen);
    // Close other dropdowns when opening hints
    setIsProfileDropdownOpen(false);
    setIsThemeDropdownOpen(false);
    setIsFocusDropdownOpen(false);
  };

  const checkShouldShowDiscordAndHints = async (profile: any) => {
    try {
      // First check if coming from onboarding
      if (isFromOnboarding() && !hasSeenHints()) {
        setShouldAutoShowHints(true);
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          setIsHintOverlayOpen(true);
          // Mark hints as shown so they don't auto-show again
          markHintsAsShown();
          // Clear the onboarding flag
          clearOnboardingFlag();
        }, 1500);
        return;
      }

      // Then check if user should see Discord invite (after payment)
      if (isFromPayment() && !hasSeenDiscordInvite()) {
        setShouldAutoShowDiscord(true);
        // Show Discord invite first, then hints
        setTimeout(() => {
          setIsDiscordInviteOpen(true);
          clearPaymentFlag();
        }, 1000);
        return; // Don't show hints yet, wait for Discord flow to complete
      }

      // Check if user has already seen the hints
      if (hasSeenHints()) {
        setShouldAutoShowHints(false);
        return;
      }

      let shouldShow = false;

      // Check if profile was created recently (within last 24 hours)
      if (profile?.created_at) {
        const profileCreatedAt = new Date(profile.created_at);
        const now = new Date();
        const hoursDifference = (now.getTime() - profileCreatedAt.getTime()) / (1000 * 60 * 60);
        
        // Show hints automatically if profile is less than 24 hours old
        if (hoursDifference < 24) {
          shouldShow = true;
        }
      }

      if (shouldShow) {
        setShouldAutoShowHints(true);
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          setIsHintOverlayOpen(true);
          // Mark hints as shown so they don't auto-show again
          markHintsAsShown();
        }, 1500);
      }
    } catch (error) {
      console.error('Error checking Discord and hints status:', error);
    }
  };

  const handleDiscordJoin = () => {
    openDiscordInvite();
    markDiscordInviteAsShown();
    setIsDiscordInviteOpen(false);
    // Show hints after Discord invite if user is new
    showHintsAfterDiscord();
  };

  const handleDiscordSkip = () => {
    markDiscordInviteAsShown();
    setIsDiscordInviteOpen(false);
    // Show hints after Discord invite if user is new
    showHintsAfterDiscord();
  };

  const showHintsAfterDiscord = () => {
    setIsHintOverlayOpen(true);
    setShouldAutoShowHints(true);
  };

  // Remove the separate useEffect for hints since it's now handled in checkShouldShowDiscordAndHints
  useEffect(() => {
    // Create an async function to handle the initial data fetch
    const initializeData = async () => {
      await fetchUserData();
      
      // After data is fetched, check if we should show hints immediately
      if (isFromOnboarding() && !hasSeenHints()) {
        setShouldAutoShowHints(true);
        setIsHintOverlayOpen(true);
        markHintsAsShown();
        clearOnboardingFlag();
      }
    };

    // Call the async function
    initializeData();
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      // Clear profile cache and refetch when profile is updated
      localStorage.removeItem('acadium_profile_cache');
      fetchUserData();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const fetchUserData = async () => {
    try {
      // Check if we're in guest mode first
      if (guestMode.isGuestMode()) {
        const guestProfile = guestMode.getGuestProfile();
        const guestSubscription = guestMode.getGuestSubscription();
        
        setUserData({
          name: guestProfile?.full_name || 'Guest User',
          avatar: guestProfile?.avatar_url || '',
          progress: 68, // This could be calculated from guest progress data
          plan: guestSubscription?.plans?.name || 'Guest Access',
          focus: guestProfile?.focus || 'explore'
        });

        // Check if guest user should see Discord invite or hints automatically
        await checkShouldShowDiscordAndHints(guestProfile);
        return;
      }

      // Use cached user data first for regular users
      const { data: { user } } = await getCachedUser();
      
      if (!user) return;

      // Fetch user profile with caching
      const { data: profile } = await getCachedProfile(user.id);

      // Fetch user subscription and plan with caching
      const { data: subscription } = await getCachedSubscription(user.id);

      setUserData({
        name: profile?.full_name || user.email?.split('@')[0] || 'User',
        avatar: profile?.avatar_url || '',
        progress: 68, // This could be calculated from user progress data
        plan: subscription?.plans?.name || 'Free',
        focus: profile?.focus || 'explore'
      });

      // Check if user should see Discord invite or hints automatically
      await checkShouldShowDiscordAndHints(profile);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Keep default values on error
    }
  };

  const handleLogout = async () => {
    try {
      // Clear all cached data
      sessionManager.clearSession();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Navigate to auth page
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, clear cache and navigate
      sessionManager.clearSession();
      navigate('/auth');
    }
  };

  const handleHelp = () => {
    setIsProfileDropdownOpen(false);
    // You can replace this with your help/support page
    window.open('mailto:support@acadium.ai', '_blank');
  };

  const handleDiscordClick = () => {
    window.open('https://discord.gg/sJqAbET8', '_blank');
  };

  const handleFocusChange = async (newFocus: 'ai-automation' | 'web-dev' | 'ai-video' | 'explore' | 'advanced') => {
    try {
      // Handle guest mode focus switching
      if (guestMode.isGuestMode()) {
        // Update guest profile focus
        guestMode.updateGuestFocus(newFocus);
        
        // Update local state
        setUserData(prev => ({ ...prev, focus: newFocus }));
        
        // Close dropdown
        setIsFocusDropdownOpen(false);
        
        // Navigate to the corresponding page
        navigate(focusAreas[newFocus].path);
        
        // Trigger profile update event
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        return;
      }

      // Handle regular user focus switching
      const { data: { user } } = await getCachedUser();
      if (!user) return;

      // Update both mission and focus in database to the same value
      const { error } = await supabase
        .from('profiles')
        .update({ 
          mission: newFocus,  // Update mission to match focus
          focus: newFocus     // Update focus
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setUserData(prev => ({ ...prev, focus: newFocus }));
      
      // Clear profile cache to force refresh
      localStorage.removeItem('acadium_profile_cache');
      
      // Close dropdown
      setIsFocusDropdownOpen(false);
      
      // Navigate to the corresponding page
      navigate(focusAreas[newFocus].path);
      
      // Trigger profile update event
      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (error) {
      console.error('Error updating focus:', error);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'gradient') => {
    setTheme(newTheme);
    setIsThemeDropdownOpen(false);
    setShowGradientOptions(false);
  };

  const handleGradientChange = (newGradient: typeof gradientOptions[0]['id']) => {
    setGradientType(newGradient as any);
  };

  const handleGradientHover = () => {
    // When hovering over gradient mode, automatically switch to gradient theme
    // and show gradient options
    if (theme !== 'gradient') {
      setTheme('gradient');
    }
    setShowGradientOptions(true);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4" />;
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'gradient': return <Palette className="h-4 w-4" />;
    }
  };

  const getProfileRingClass = () => {
    if (theme === 'gradient') {
      switch (gradientType) {
        case 'blueRed':
          return 'bg-gradient-to-r from-blue-600 to-red-600';
        case 'purpleBlue':
          return 'bg-gradient-to-r from-purple-600 to-blue-500';
        case 'greenTeal':
          return 'bg-gradient-to-r from-green-500 to-teal-500';
        case 'orangePink':
          return 'bg-gradient-to-r from-orange-500 to-pink-500';
        case 'darkTeal':
          return 'bg-gradient-to-r from-slate-700 to-cyan-500';
        default:
          return 'bg-gradient-to-r from-blue-600 to-red-600';
      }
    }
    return '';
  };

  const getAvatarDisplay = () => {
    if (userData.avatar) {
      return (
        <img 
          src={userData.avatar} 
          alt={userData.name} 
          className="h-full w-full object-cover rounded-full"
        />
      );
    }
    
    // Fallback to initials if no avatar
    const initials = userData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return (
      <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-xs font-medium rounded-full">
        {initials}
      </div>
    );
  };

  return (
    <>
      <header 
        className={`
          fixed top-0 right-0 z-20
          h-16 
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-64'}
          left-0
          ${theme === 'gradient'
            ? 'bg-gray-900/80 backdrop-blur-md border-b border-gray-700'
            : 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800'
          }
        `}
      >
        <div className="h-full px-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className={`
              lg:hidden p-2 rounded-lg transition-colors
              ${theme === 'gradient'
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search Bar - Hide on small screens */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full" data-hint="search">
              <input
                type="text"
                placeholder="Search content, tools, and pages..."
                className={`
                  w-full py-2 pl-10 pr-4 rounded-lg
                  transition-colors duration-200
                  ${theme === 'gradient'
                    ? 'bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-400'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
                  }
                  border focus:outline-none focus:ring-2
                  ${theme === 'gradient'
                    ? 'focus:ring-blue-500/50'
                    : 'focus:ring-blue-500 dark:focus:ring-blue-500/50'
                  }
                `}
              />
              <Search className={`
                absolute left-3 top-2.5 h-5 w-5
                ${theme === 'gradient'
                  ? 'text-gray-400'
                  : 'text-gray-400 dark:text-gray-500'
                }
              `} />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Hint Button */}
            <button
              onClick={handleHintToggle}
              className={`
                p-2 rounded-lg transition-colors relative
                ${theme === 'gradient' 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                  : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                } 
                ${isHintOverlayOpen ? 'bg-blue-100 dark:bg-blue-900/20' : ''}
              `}
              title={shouldAutoShowHints ? "Interface hints (new user guide)" : "Show interface hints"}
            >
              <HelpCircle className="h-5 w-5" />
              {shouldAutoShowHints && !hasSeenHints() && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse">
                  <div className="absolute inset-0 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              )}
            </button>

            {/* Focus Selector */}
            <div className="relative" ref={focusDropdownRef} data-hint="focus">
              <button
                onClick={() => setIsFocusDropdownOpen(!isFocusDropdownOpen)}
                className={`
                  hidden md:flex items-center space-x-2 p-2 rounded-lg
                  transition-colors duration-200
                  ${theme === 'gradient'
                    ? 'hover:bg-gray-700/50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Brain className="h-5 w-5" />
                <span className="hidden lg:inline">{focusAreas[userData.focus].title}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Mobile Focus Button */}
              <button
                onClick={() => setIsFocusDropdownOpen(!isFocusDropdownOpen)}
                className={`
                  md:hidden flex items-center p-2 rounded-lg
                  transition-colors duration-200
                  ${theme === 'gradient'
                    ? 'hover:bg-gray-700/50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Brain className="h-5 w-5" />
              </button>

              {/* Focus Dropdown Menu */}
              {isFocusDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-72 md:w-80 rounded-lg shadow-lg border py-2 z-50 ${
                  theme === 'gradient' || theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-3 py-2 border-b ${
                    theme === 'gradient' || theme === 'dark'
                      ? 'border-gray-700'
                      : 'border-gray-200'
                  }`}>
                    <div className={`text-sm font-medium ${
                      theme === 'gradient' || theme === 'dark'
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}>Focus Areas</div>
                    <div className={`text-xs ${
                      theme === 'gradient' || theme === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>Choose your learning path</div>
                  </div>
                  
                  <div className="py-1">
                    {Object.entries(focusAreas).map(([key, area]) => (
                      <button
                        key={key}
                        onClick={() => handleFocusChange(key as 'ai-automation' | 'web-dev' | 'ai-video' | 'explore' | 'advanced')}
                        className={`w-full px-3 py-2 text-left transition-colors ${
                          theme === 'gradient' || theme === 'dark'
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-100'
                        } ${
                          userData.focus === key 
                            ? theme === 'gradient' || theme === 'dark'
                              ? 'bg-blue-900/20'
                              : 'bg-blue-50'
                            : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-md bg-gradient-to-r ${area.color} flex items-center justify-center text-white text-sm`}>
                            {area.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm ${
                              userData.focus === key 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : theme === 'gradient' || theme === 'dark'
                                  ? 'text-white'
                                  : 'text-gray-900'
                            }`}>
                              {area.title}
                            </div>
                            <div className={`text-xs truncate ${
                              theme === 'gradient' || theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}>
                              {area.description}
                            </div>
                          </div>
                          {userData.focus === key && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Discord Button - Hide on small screens */}
            <button
              onClick={handleDiscordClick}
              className={`
                hidden md:flex items-center space-x-2 p-2 rounded-lg
                transition-colors duration-200
                ${theme === 'gradient'
                  ? 'hover:bg-gray-700/50'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
              data-hint="discord"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="hidden lg:inline">Community</span>
            </button>

            {/* Theme Selector */}
            <div className="relative" ref={themeDropdownRef} data-hint="theme">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className={`p-1.5 ${theme === 'gradient' ? 'text-gray-300 hover:bg-gray-700/50' : ''}`}
              >
                {getThemeIcon()}
              </Button>

              {/* Theme Dropdown */}
              {isThemeDropdownOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-72 md:w-80 rounded-lg shadow-lg border py-2 z-50 ${
                    theme === 'gradient' || theme === 'dark'
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                  onMouseLeave={() => {
                    // Only hide gradient options when leaving the entire dropdown
                    setShowGradientOptions(false);
                  }}
                >
                  <div className={`px-3 py-2 border-b ${
                    theme === 'gradient' || theme === 'dark'
                      ? 'border-gray-700'
                      : 'border-gray-200'
                  }`}>
                    <div className={`text-sm font-medium ${
                      theme === 'gradient' || theme === 'dark'
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}>Select Theme</div>
                    <div className={`text-xs ${
                      theme === 'gradient' || theme === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>Choose your preferred appearance</div>
                  </div>
                  
                  <div className="py-1">
                    {themeOptions.map((themeOption) => (
                      <button
                        key={themeOption.id}
                        onClick={() => handleThemeChange(themeOption.id as 'light' | 'dark' | 'gradient')}
                        onMouseEnter={() => {
                          if (themeOption.id === 'gradient') {
                            handleGradientHover();
                          }
                        }}
                        className={`w-full px-3 py-2 text-left transition-colors ${
                          theme === 'gradient' || theme === 'dark'
                            ? 'hover:bg-gray-700'
                            : 'hover:bg-gray-100'
                        } ${
                          theme === themeOption.id 
                            ? theme === 'gradient' || theme === 'dark'
                              ? 'bg-blue-900/20'
                              : 'bg-blue-50'
                            : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                            theme === themeOption.id 
                              ? 'bg-blue-500 text-white' 
                              : theme === 'gradient' || theme === 'dark'
                                ? 'bg-gray-700 text-gray-400'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {themeOption.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm ${
                              theme === themeOption.id 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : theme === 'gradient' || theme === 'dark'
                                  ? 'text-white'
                                  : 'text-gray-900'
                            }`}>
                              {themeOption.name}
                            </div>
                            <div className={`text-xs ${
                              theme === 'gradient' || theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}>
                              {themeOption.description}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {themeOption.preview}
                            {theme === themeOption.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-2"></div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}

                    {/* Gradient Options - Show when gradient theme is selected OR when hovering over gradient option */}
                    {(theme === 'gradient' || showGradientOptions) && (
                      <>
                        <div className={`px-3 py-2 border-t border-b mt-1 ${
                          theme === 'gradient' || theme === 'dark'
                            ? 'border-gray-700'
                            : 'border-gray-200'
                        }`}>
                          <div className={`text-sm font-medium ${
                            theme === 'gradient' || theme === 'dark'
                              ? 'text-white'
                              : 'text-gray-900'
                          }`}>Gradient Style</div>
                          <div className={`text-xs ${
                            theme === 'gradient' || theme === 'dark'
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }`}>Choose your gradient combination</div>
                        </div>
                        
                        <div className="py-1">
                          {gradientOptions.map((gradientOption) => (
                            <button
                              key={gradientOption.id}
                              onClick={() => handleGradientChange(gradientOption.id)}
                              className={`w-full px-3 py-2 text-left transition-colors ${
                                theme === 'gradient' || theme === 'dark'
                                  ? 'hover:bg-gray-700'
                                  : 'hover:bg-gray-100'
                              } ${
                                gradientType === gradientOption.id 
                                  ? theme === 'gradient' || theme === 'dark'
                                    ? 'bg-purple-900/20'
                                    : 'bg-purple-50'
                                  : ''
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <div className={`w-8 h-8 rounded-md ${gradientOption.preview} relative`}>
                                  {gradientType === gradientOption.id && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-lg"></div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`font-medium text-sm ${
                                    gradientType === gradientOption.id 
                                      ? 'text-purple-600 dark:text-purple-400' 
                                      : theme === 'gradient' || theme === 'dark'
                                        ? 'text-white'
                                        : 'text-gray-900'
                                  }`}>
                                    {gradientOption.name}
                                  </div>
                                  <div className={`text-xs ${
                                    theme === 'gradient' || theme === 'dark'
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }`}>
                                    {gradientOption.description}
                                  </div>
                                </div>
                                {gradientType === gradientOption.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile Menu */}
            <div className="relative" ref={dropdownRef} data-hint="profile">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center space-x-2 ml-1 p-1.5 rounded-lg transition-colors ${
                  theme === 'gradient'
                    ? 'hover:bg-gray-700/50 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <ProgressRing 
                  progress={overallProgress.percentage} 
                  size={28} 
                  strokeWidth={2}
                  className="hidden sm:flex" 
                  theme={theme}
                  gradientType={gradientType}
                />
                
                <div className="hidden lg:block text-right">
                  <div className={`text-xs font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>{userData.name}</div>
                  <div className={`text-xs ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                  }`}>{userData.plan}</div>
                </div>
                
                {theme === 'gradient' ? (
                  <div className={`h-7 w-7 p-0.5 rounded-full ${getProfileRingClass()}`}>
                    <div className="h-full w-full rounded-full overflow-hidden">
                      {getAvatarDisplay()}
                    </div>
                  </div>
                ) : (
                  <div className="h-7 w-7 rounded-full overflow-hidden ring-2 ring-blue-500">
                    {getAvatarDisplay()}
                  </div>
                )}
                
                <ChevronDown className={`h-3 w-3 transition-transform ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-500'
                } ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{userData.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{userData.plan}</div>
                  </div>
                  
                  <button
                    onClick={() => navigate('/settings')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </button>
                  
                  <button
                    onClick={handleHelp}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <HelpCircle className="h-3 w-3 mr-2" />
                    Help
                  </button>
                  
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <LogOut className="h-3 w-3 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Discord Invite Overlay */}
      <DiscordInviteOverlay 
        isOpen={isDiscordInviteOpen}
        onJoin={handleDiscordJoin}
        onSkip={handleDiscordSkip}
      />

      {/* Hint Overlay */}
      <HintOverlay 
        isOpen={isHintOverlayOpen} 
        onClose={() => setIsHintOverlayOpen(false)} 
        steps={hintSteps}
        isNewUser={shouldAutoShowHints}
      />
    </>
  );
};
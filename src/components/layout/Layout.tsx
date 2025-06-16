import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Plus, Heart, HelpCircle, Bug, HeartOff } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';
import { useFavorites } from '../../hooks/useFavorites';
import { useRecentPages } from '../../hooks/useRecentPages';
import { getPageInfo } from '../../utils/pageConfig';

export const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { theme, gradientType } = useTheme();
  const location = useLocation();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToRecent } = useRecentPages();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // Track page visits for recent pages
  useEffect(() => {
    const currentPath = location.pathname;
    const pageInfo = getPageInfo(currentPath);
    
    // Only track specific tool pages, not main category pages, dashboard, or focus homepages
    const excludedPaths = [
      '/',
      '/build',
      '/automate', 
      '/monetize',
      '/analyze',
      '/network',
      '/settings',
      '/n8n',        // N8n focus homepage
      '/video',      // Video focus homepage
      '/webdev'      // Web dev focus homepage
    ];

    if (!excludedPaths.includes(currentPath) && !currentPath.startsWith('/settings')) {
      addToRecent(currentPath, pageInfo.title, pageInfo.icon);
    }
  }, [location.pathname, addToRecent]);

  // Check if we should show the favorite option
  const shouldShowFavorite = () => {
    const currentPath = location.pathname;
    
    // Pages that should NOT show the favorite option
    const excludedPaths = [
      '/',              // Dashboard
      '/build',         // Build category page
      '/automate',      // Automate category page
      '/monetize',      // Monetize category page
      '/analyze',       // Analyze category page
      '/network',       // Network category page
      '/n8n',           // N8n focus homepage
      '/video',         // Video focus homepage
      '/webdev'         // Web dev focus homepage
    ];
    
    // Don't show on excluded paths or settings
    return !excludedPaths.includes(currentPath) && !currentPath.startsWith('/settings');
  };

  const getGradientButtonClass = () => {
    if (theme !== 'gradient') {
      return 'bg-gradient-to-r from-blue-600 to-indigo-600';
    }
    
    switch (gradientType) {
      case 'blueRed':
        return 'bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700';
      case 'purpleBlue':
        return 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600';
      case 'greenTeal':
        return 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600';
      case 'orangePink':
        return 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600';
      case 'darkTeal':
        return 'bg-gradient-to-r from-slate-700 to-cyan-500 hover:from-slate-800 hover:to-cyan-600';
      default:
        return 'bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700';
    }
  };

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay before closing to prevent quick mouse movements from closing the menu
    closeTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150); // 150ms delay
  };

  const handleFavorite = async () => {
    const currentPath = location.pathname;
    const pageInfo = getPageInfo(currentPath);
    const isCurrentlyFavorite = isFavorite(currentPath);

    if (isCurrentlyFavorite) {
      await removeFromFavorites(currentPath);
    } else {
      await addToFavorites(currentPath, pageInfo.title, pageInfo.icon);
    }
    
    setIsMenuOpen(false);
  };

  const handleHelp = () => {
    // Open help/support
    window.open('mailto:support@acadium.ai', '_blank');
    setIsMenuOpen(false);
  };

  const handleReportBug = () => {
    // Navigate to settings help page with bug report focus
    window.location.href = '/settings';
    setIsMenuOpen(false);
  };

  // Build menu items based on current page
  const getMenuItems = () => {
    const baseItems = [
      {
        icon: <HelpCircle className="h-5 w-5" />,
        label: 'Help & Support',
        onClick: handleHelp,
        color: 'text-blue-500'
      },
      {
        icon: <Bug className="h-5 w-5" />,
        label: 'Report Bug',
        onClick: handleReportBug,
        color: 'text-orange-500'
      }
    ];

    // Add favorite option if we're on a specific page
    if (shouldShowFavorite()) {
      const currentPath = location.pathname;
      const isCurrentlyFavorite = isFavorite(currentPath);
      
      return [
        {
          icon: isCurrentlyFavorite ? <HeartOff className="h-5 w-5" /> : <Heart className="h-5 w-5" />,
          label: isCurrentlyFavorite ? 'Remove from Favorites' : 'Add to Favorites',
          onClick: handleFavorite,
          color: 'text-red-500'
        },
        ...baseItems
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div 
      className={`min-h-screen ${
        theme === 'gradient' 
          ? 'text-gray-100' 
          : 'bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
      }`}
      style={theme === 'gradient' ? { background: 'var(--gradient-bg)' } : {}}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      
      <main 
        className={`
          fixed top-16 bottom-0 right-0 overflow-hidden
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'left-16' : 'left-64'}
          ${theme === 'gradient' ? 'bg-transparent' : 'bg-gray-50 dark:bg-black'}
        `}
      >
        <div className="h-full overflow-y-auto px-4 md:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      {/* Floating Action Menu */}
      <div className="fixed bottom-6 right-6 z-10">
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Menu Items */}
          <div className={`absolute bottom-16 right-0 transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}>
            <div className="flex flex-col items-end space-y-3">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-8'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <span className={`mr-3 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap ${
                    theme === 'gradient'
                      ? 'bg-gray-800/90 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg'
                  } border ${
                    theme === 'gradient'
                      ? 'border-gray-700'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    {item.label}
                  </span>
                  <button
                    onClick={item.onClick}
                    className={`
                      flex items-center justify-center
                      h-12 w-12 rounded-full flex-shrink-0
                      ${theme === 'gradient'
                        ? 'bg-gray-800/90 border-gray-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }
                      border shadow-lg
                      hover:shadow-xl hover:scale-105
                      transition-all duration-200
                      ${item.color}
                    `}
                  >
                    {item.icon}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main FAB */}
          <button 
            className={`
              flex items-center justify-center
              h-14 w-14 rounded-full
              ${getGradientButtonClass()}
              text-white shadow-lg
              hover:shadow-xl hover:scale-105
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isMenuOpen ? 'rotate-45' : 'rotate-0'}
            `}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
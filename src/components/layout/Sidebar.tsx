import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Code, 
  Bot, 
  DollarSign,
  BarChart2,
  Users,
  ChevronRight,
  Menu,
  X,
  Coffee,
  Factory,
  FileText,
  Ghost,
  Search,
  Package,
  Zap,
  AreaChart,
  Briefcase,
  Settings as SettingsIcon,
  Circle,
  Star,
  Heart,
  Clock,
  MessageSquare,
  Trash2,
  Plug,
  Rocket,
  Settings as SettingsGear,
  Globe,
  Video,
  Database,
  Monitor,
  Layers,
  Smartphone,
  ExternalLink,
  Shirt
} from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';
import { useFavorites } from '../../hooks/useFavorites';
import { useRecentPages } from '../../hooks/useRecentPages';
import { supabase, getCachedUser, getCachedProfile } from '../../lib/supabase';
import { guestMode } from '../../lib/guestMode';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  subItems?: Array<{
    to: string;
    label: string;
    icon: React.ReactNode;
  }>;
  external?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, collapsed, subItems, external }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();

  // Check if this item or any of its subitems is active
  const isActive = location.pathname === to || 
    (subItems && subItems.some(item => location.pathname === item.to));

  if (external) {
    return (
      <div className="relative">
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            flex items-center px-3 py-1.5 transition-all duration-200
            ${theme === 'gradient'
              ? 'text-gray-200 hover:bg-gray-700/50'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }
            ${collapsed ? 'justify-center' : 'justify-between'}
          `}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="flex items-center">
            <span className="text-lg">{icon}</span>
            {!collapsed && <span className="ml-3 whitespace-nowrap">{label}</span>}
          </div>
          {!collapsed && <ExternalLink className="h-4 w-4" />}
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      <NavLink
        to={to}
        className={({ isActive }) => `
          flex items-center px-3 py-1.5 transition-all duration-200
          ${isActive 
            ? 'text-blue-600 dark:text-blue-400 font-medium' 
            : theme === 'gradient'
              ? 'text-gray-200 hover:bg-gray-700/50'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
          }
          ${collapsed ? 'justify-center' : 'justify-between'}
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex items-center">
          <span className="text-lg">{icon}</span>
          {!collapsed && <span className="ml-3 whitespace-nowrap">{label}</span>}
        </div>
        {!collapsed && subItems && (
          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
        )}
      </NavLink>

      {/* Submenu */}
      {subItems && isExpanded && (
        <div 
          className={`
            absolute top-0 left-full
            ${theme === 'gradient' 
              ? 'bg-gray-800/90 border-gray-600' 
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
            }
            rounded-lg shadow-lg border
            py-2 min-w-[200px]
            ${collapsed ? 'ml-2' : 'ml-4'}
          `}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {subItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-4 py-2
                text-sm transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : theme === 'gradient'
                    ? 'text-gray-200 hover:bg-gray-700/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }
              `}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

// Icon mapping for dynamic rendering
const iconMap = {
  Code: <Code />,
  Bot: <Bot />,
  Factory: <Factory />,
  FileText: <FileText />,
  Search: <Search />,
  Package: <Package />,
  Zap: <Zap />,
  DollarSign: <DollarSign />,
  Ghost: <Ghost />,
  BarChart2: <BarChart2 />,
  AreaChart: <AreaChart />,
  Briefcase: <Briefcase />,
  MessageSquare: <MessageSquare />,
  Trophy: <Star />,
  Users: <Users />,
  Circle: <Circle />,
  Plug: <Plug />,
  Rocket: <Rocket />,
  SettingsGear: <SettingsGear />,
  Globe: <Globe />,
  Video: <Video />,
  Database: <Database />,
  Monitor: <Monitor />,
  Layers: <Layers />,
  Smartphone: <Smartphone />,
  Shirt: <Shirt />
};

// Function to get icons with different colors for favorites and recent sections
const getFavoritesRecentIcon = (iconName: string, pagePath: string): React.ReactNode => {
  const isN8nPage = pagePath.includes('n8n') || pagePath.includes('automate') || pagePath.includes('bot');
  const isWebDevPage = pagePath.includes('webdev') || pagePath.includes('vibe-coding') || pagePath.includes('coding');
  const isVideoPage = pagePath.includes('video') || pagePath.includes('ai-course-factory') || pagePath.includes('course-factory');
  
  // For n8n pages, use different shades of purple
  if (isN8nPage) {
    const n8nIconMap: { [key: string]: React.ReactNode } = {
      Code: <Code style={{ color: '#a855f7' }} />,
      Bot: <Bot style={{ color: '#9333ea' }} />,
      Factory: <Factory style={{ color: '#7c3aed' }} />,
      FileText: <FileText style={{ color: '#6d28d9' }} />,
      Search: <Search style={{ color: '#a855f7' }} />,
      Package: <Package style={{ color: '#9333ea' }} />,
      Zap: <Zap style={{ color: '#7c3aed' }} />,
      DollarSign: <DollarSign style={{ color: '#6d28d9' }} />,
      Ghost: <Ghost style={{ color: '#a855f7' }} />,
      BarChart2: <BarChart2 style={{ color: '#9333ea' }} />,
      AreaChart: <AreaChart style={{ color: '#7c3aed' }} />,
      Briefcase: <Briefcase style={{ color: '#6d28d9' }} />,
      MessageSquare: <MessageSquare style={{ color: '#a855f7' }} />,
      Trophy: <Star style={{ color: '#9333ea' }} />,
      Users: <Users style={{ color: '#7c3aed' }} />,
      Circle: <Circle style={{ color: '#a855f7' }} />,
      Plug: <Plug style={{ color: '#9333ea' }} />,
      Rocket: <Rocket style={{ color: '#7c3aed' }} />,
      SettingsGear: <SettingsGear style={{ color: '#6d28d9' }} />,
      Globe: <Globe style={{ color: '#a855f7' }} />,
      Video: <Video style={{ color: '#9333ea' }} />,
      Database: <Database style={{ color: '#7c3aed' }} />,
      Monitor: <Monitor style={{ color: '#6d28d9' }} />,
      Layers: <Layers style={{ color: '#a855f7' }} />,
      Smartphone: <Smartphone style={{ color: '#9333ea' }} />,
      Shirt: <Shirt style={{ color: '#9333ea' }} />
    };
    return n8nIconMap[iconName] || <Circle style={{ color: '#a855f7' }} />;
  }
  
  // For webdev pages, use different shades of blue
  if (isWebDevPage) {
    const webDevIconMap: { [key: string]: React.ReactNode } = {
      Code: <Code style={{ color: '#3b82f6' }} />,
      Bot: <Bot style={{ color: '#2563eb' }} />,
      Factory: <Factory style={{ color: '#1d4ed8' }} />,
      FileText: <FileText style={{ color: '#1e40af' }} />,
      Search: <Search style={{ color: '#3b82f6' }} />,
      Package: <Package style={{ color: '#2563eb' }} />,
      Zap: <Zap style={{ color: '#1d4ed8' }} />,
      DollarSign: <DollarSign style={{ color: '#1e40af' }} />,
      Ghost: <Ghost style={{ color: '#3b82f6' }} />,
      BarChart2: <BarChart2 style={{ color: '#2563eb' }} />,
      AreaChart: <AreaChart style={{ color: '#1d4ed8' }} />,
      Briefcase: <Briefcase style={{ color: '#1e40af' }} />,
      MessageSquare: <MessageSquare style={{ color: '#3b82f6' }} />,
      Trophy: <Star style={{ color: '#2563eb' }} />,
      Users: <Users style={{ color: '#1d4ed8' }} />,
      Circle: <Circle style={{ color: '#3b82f6' }} />,
      Plug: <Plug style={{ color: '#2563eb' }} />,
      Rocket: <Rocket style={{ color: '#1d4ed8' }} />,
      SettingsGear: <SettingsGear style={{ color: '#1e40af' }} />,
      Globe: <Globe style={{ color: '#3b82f6' }} />,
      Video: <Video style={{ color: '#2563eb' }} />,
      Database: <Database style={{ color: '#1d4ed8' }} />,
      Monitor: <Monitor style={{ color: '#1e40af' }} />,
      Layers: <Layers style={{ color: '#3b82f6' }} />,
      Smartphone: <Smartphone style={{ color: '#2563eb' }} />,
      Shirt: <Shirt style={{ color: '#2563eb' }} />
    };
    return webDevIconMap[iconName] || <Circle style={{ color: '#3b82f6' }} />;
  }
  
  // For video pages, use different shades of red
  if (isVideoPage) {
    const videoIconMap: { [key: string]: React.ReactNode } = {
      Code: <Code style={{ color: '#ef4444' }} />,
      Bot: <Bot style={{ color: '#dc2626' }} />,
      Factory: <Factory style={{ color: '#b91c1c' }} />,
      FileText: <FileText style={{ color: '#991b1b' }} />,
      Search: <Search style={{ color: '#ef4444' }} />,
      Package: <Package style={{ color: '#dc2626' }} />,
      Zap: <Zap style={{ color: '#b91c1c' }} />,
      DollarSign: <DollarSign style={{ color: '#991b1b' }} />,
      Ghost: <Ghost style={{ color: '#ef4444' }} />,
      BarChart2: <BarChart2 style={{ color: '#dc2626' }} />,
      AreaChart: <AreaChart style={{ color: '#b91c1c' }} />,
      Briefcase: <Briefcase style={{ color: '#991b1b' }} />,
      MessageSquare: <MessageSquare style={{ color: '#ef4444' }} />,
      Trophy: <Star style={{ color: '#dc2626' }} />,
      Users: <Users style={{ color: '#b91c1c' }} />,
      Circle: <Circle style={{ color: '#ef4444' }} />,
      Plug: <Plug style={{ color: '#dc2626' }} />,
      Rocket: <Rocket style={{ color: '#b91c1c' }} />,
      SettingsGear: <SettingsGear style={{ color: '#991b1b' }} />,
      Globe: <Globe style={{ color: '#ef4444' }} />,
      Video: <Video style={{ color: '#dc2626' }} />,
      Database: <Database style={{ color: '#b91c1c' }} />,
      Monitor: <Monitor style={{ color: '#991b1b' }} />,
      Layers: <Layers style={{ color: '#ef4444' }} />,
      Smartphone: <Smartphone style={{ color: '#dc2626' }} />,
      Shirt: <Shirt style={{ color: '#dc2626' }} />
    };
    return videoIconMap[iconName] || <Circle style={{ color: '#ef4444' }} />;
  }
  
  // For other pages, use mixed colors
  const alternateIconMap: { [key: string]: React.ReactNode } = {
    Code: <Code style={{ color: '#10b981' }} />,
    Bot: <Bot style={{ color: '#f59e0b' }} />,
    Factory: <Factory style={{ color: '#8b5cf6' }} />,
    FileText: <FileText style={{ color: '#06b6d4' }} />,
    Search: <Search style={{ color: '#6b7280' }} />,
    Package: <Package style={{ color: '#f97316' }} />,
    Zap: <Zap style={{ color: '#84cc16' }} />,
    DollarSign: <DollarSign style={{ color: '#10b981' }} />,
    Ghost: <Ghost style={{ color: '#ec4899' }} />,
    BarChart2: <BarChart2 style={{ color: '#f97316' }} />,
    AreaChart: <AreaChart style={{ color: '#f59e0b' }} />,
    Briefcase: <Briefcase style={{ color: '#8b5cf6' }} />,
    MessageSquare: <MessageSquare style={{ color: '#06b6d4' }} />,
    Trophy: <Star style={{ color: '#f59e0b' }} />,
    Users: <Users style={{ color: '#10b981' }} />,
    Circle: <Circle style={{ color: '#6b7280' }} />,
    Plug: <Plug style={{ color: '#10b981' }} />,
    Rocket: <Rocket style={{ color: '#84cc16' }} />,
    SettingsGear: <SettingsGear style={{ color: '#f59e0b' }} />,
    Globe: <Globe style={{ color: '#06b6d4' }} />,
    Video: <Video style={{ color: '#ec4899' }} />,
    Database: <Database style={{ color: '#10b981' }} />,
    Monitor: <Monitor style={{ color: '#f59e0b' }} />,
    Layers: <Layers style={{ color: '#6b7280' }} />,
    Smartphone: <Smartphone style={{ color: '#06b6d4' }} />,
    Shirt: <Shirt style={{ color: '#ec4899' }} />
  };
  
  return alternateIconMap[iconName] || <Circle style={{ color: '#6b7280' }} />;
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
  className?: string;
}

// Confirmation Modal Component
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`w-[400px] rounded-xl shadow-lg border p-6 ${
        theme === 'gradient' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
      }`}>
        <h3 className={`text-lg font-medium mb-4 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          {title}
        </h3>
        <p className={`text-sm mb-6 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
        }`}>
          {message}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              theme === 'gradient' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  onToggle, 
  onMobileClose,
  className = '' 
}) => {
  const { theme } = useTheme();
  const { favorites, loading: favoritesLoading, clearAllFavorites } = useFavorites();
  const { recentPages, loading: recentLoading, clearAllRecent } = useRecentPages();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [userFocus, setUserFocus] = useState<string>('explore');
  const location = useLocation();
  
  // Force re-render when data updates
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };

    const handleRecentUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('recentPagesUpdated', handleRecentUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('recentPagesUpdated', handleRecentUpdate);
    };
  }, []);

  // Fetch user focus on component mount
  useEffect(() => {
    const fetchUserFocus = async () => {
      try {
        // Check if we're in guest mode first
        if (guestMode.isGuestMode()) {
          const guestProfile = guestMode.getGuestProfile();
          if (guestProfile?.focus) {
            setUserFocus(guestProfile.focus);
          }
          return;
        }

        // Handle regular users
        const { data: { user } } = await getCachedUser();
        if (!user) return;

        const { data: profile } = await getCachedProfile(user.id);
        if (profile?.focus) {
          setUserFocus(profile.focus);
        }
      } catch (error) {
        console.error('Error fetching user focus:', error);
      }
    };

    fetchUserFocus();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchUserFocus();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleClearFavorites = async () => {
    await clearAllFavorites();
    setShowFavoritesModal(false);
  };

  const handleClearRecent = async () => {
    await clearAllRecent();
    setShowRecentModal(false);
  };

  // Dynamic navigation based on user focus
  const getNavItems = () => {
    switch (userFocus) {
      case 'advanced':
        return [
          {
            to: "/advanced/clothing-brand",
            icon: <Shirt />,
            label: "Clothing Brand",
            subItems: [],
            external: false
          },
          {
            to: "/advanced/webdev",
            icon: <Code />,
            label: "Web/Mobile Dev",
            subItems: [],
            external: false
          },
          {
            to: "/advanced/copywriting",
            icon: <FileText />,
            label: "AI Copywriting",
            subItems: [],
            external: false
          },
          {
            to: "/advanced/ai-influencer",
            icon: <Ghost />,
            label: "AI Influencer",
            subItems: [],
            external: false
          },
          {
            to: "/advanced/automationagency",
            icon: <Zap />,
            label: "Automation Agency",
            subItems: [],
            external: false
          },
          {
            to: "https://discord.gg/sJqAbET8",
            icon: <MessageSquare />,
            label: "Elite Network",
            external: true
          }
        ];
      case 'ai-automation':
        return [
          {
            to: "/n8n-ai-agents",
            icon: <Bot />,
            label: "Automate",
            subItems: [],
            external: false
          },
          {
            to: "/n8n/integrate",
            icon: <Plug />,
            label: "Integrate",
            subItems: [],
            external: false
          },
          {
            to: "/n8n/deploy",
            icon: <Rocket />,
            label: "Deploy",
            subItems: [],
            external: false
          },
          {
            to: "/n8n/optimize",
            icon: <SettingsGear />,
            label: "Optimize",
            subItems: [],
            external: false
          },
          {
            to: "https://discord.gg/RKRvQAzPCJ",
            icon: <MessageSquare />,
            label: "Community",
            subItems: [],
            external: true
          }
        ];

      case 'ai-video':
        return [
          {
            to: "/ai-course-factory",
            icon: <Video />,
            label: "Create",
            subItems: [],
            external: false
          },
          {
            to: "/video/integrate",
            icon: <Plug />,
            label: "Integrate",
            subItems: [],
            external: false
          },
          {
            to: "/video/deploy",
            icon: <Rocket />,
            label: "Deploy",
            subItems: [],
            external: false
          },
          {
            to: "/video/optimize",
            icon: <SettingsGear />,
            label: "Optimize",
            subItems: [],
            external: false
          },
          {
            to: "https://discord.gg/RKRvQAzPCJ",
            icon: <MessageSquare />,
            label: "Community",
            subItems: [],
            external: true
          }
        ];

      case 'web-dev':
        return [
          {
            to: "/vibe-coding-lab",
            icon: <Code />,
            label: "Develop",
            subItems: [],
            external: false
          },
          {
            to: "/webdev/integrate",
            icon: <Database />,
            label: "Integrate",
            subItems: [],
            external: false
          },
          {
            to: "/webdev/deploy",
            icon: <Rocket />,
            label: "Deploy",
            subItems: [],
            external: false
          },
          {
            to: "/webdev/optimize",
            icon: <Monitor />,
            label: "Optimize",
            subItems: [],
            external: false
          },
          {
            to: "https://discord.gg/RKRvQAzPCJ",
            icon: <MessageSquare />,
            label: "Community",
            subItems: [],
            external: true
          }
        ];

      default: // 'explore' or any other focus
        return [
          {
            to: "/build",
            icon: <Code />,
            label: "Build",
            subItems: [
              { to: "/vibe-coding-lab", label: "Vibe Coding Lab", icon: <Code /> },
              { to: "/ai-course-factory", label: "AI Course Factory", icon: <Factory /> },
              { to: "/prompt-engineering", label: "Prompt Engineering", icon: <FileText /> }
            ],
            external: false
          },
          {
            to: "/automate",
            icon: <Bot />,
            label: "Automate",
            subItems: [
              { to: "/n8n-ai-agents", label: "N8n AI Agents Room", icon: <Bot /> },
              { to: "/signal-intelligence", label: "Signal Intelligence", icon: <Search /> },
              { to: "/genesis-engine", label: "Genesis Engine", icon: <Package /> }
            ],
            external: false
          },
          {
            to: "/monetize",
            icon: <DollarSign />,
            label: "Monetize",
            subItems: [
              { to: "/speed-wealth", label: "Speed Wealth Systems", icon: <Zap /> },
              { to: "/cashflow-arena", label: "Cashflow Arena", icon: <DollarSign /> },
              { to: "/ghostwriting", label: "Digital Ghostwriting", icon: <Ghost /> }
            ],
            external: false
          },
          {
            to: "/analyze",
            icon: <BarChart2 />,
            label: "Analyze",
            subItems: [
              { to: "/market-recon", label: "Market Recon Room", icon: <BarChart2 /> },
              { to: "/analytics", label: "Analytics Dashboard", icon: <AreaChart /> },
              { to: "/portfolio", label: "Portfolio Showcase", icon: <Briefcase /> }
            ],
            external: false
          },
          {
            to: "/network",
            icon: <Users />,
            label: "Community",
            subItems: [
              { to: "/discord", label: "Discord Integration", icon: <MessageSquare /> },
              { to: "/challenges", label: "Challenges & Mentorship", icon: <Star /> }
            ],
            external: false
          }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <aside 
        key={refreshKey}
        data-hint="sidebar"
        className={`
          fixed left-0 top-0 bottom-0 z-40
          flex flex-col
          transition-all duration-300 ease-in-out
          ${theme === 'gradient'
            ? 'bg-gray-900/80 backdrop-blur-md border-r border-gray-700'
            : 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-800'
          }
          ${collapsed ? 'w-16' : 'w-64'}
          ${className}
        `}
      >
        <div className={`flex items-center h-16 px-4 ${
          theme === 'gradient' ? 'border-b border-gray-700' : 'border-b border-gray-200 dark:border-gray-800'
        }`}>
          {!collapsed && (
            <Link to={userFocus === 'ai-automation' ? '/n8n' : userFocus === 'web-dev' ? '/webdev' : userFocus === 'ai-video' ? '/video' : userFocus === 'advanced' ? '/advanced' : '/'} className="flex items-center flex-1">
              <img 
                src="/logonobg.png" 
                alt="Acadium AI Logo" 
                className="h-8 w-8 object-contain" 
              />
              <span className={`ml-3 font-bold ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>Acadium - AI</span>
            </Link>
          )}
          {collapsed && (
            <Link to={userFocus === 'ai-automation' ? '/n8n' : userFocus === 'web-dev' ? '/webdev' : userFocus === 'ai-video' ? '/video' : userFocus === 'advanced' ? '/advanced' : '/'} className="flex items-center justify-center w-full">
              <img 
                src="/logo2.png" 
                alt="Acadium AI Logo" 
                className="h-6 w-6 object-contain" 
              />
            </Link>
          )}
          <div className="flex items-center ml-auto">
            {/* Mobile Close Button */}
            <button
              onClick={onMobileClose}
              className={`lg:hidden p-1.5 rounded-lg mr-2 transition-colors ${
                theme === 'gradient'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
            {/* Desktop Toggle Button */}
            <button 
              onClick={onToggle}
              data-hint="sidebar-toggle"
              className={`hidden lg:block p-1.5 rounded-lg transition-colors ${
                theme === 'gradient'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                to={item.to}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                subItems={item.subItems}
                external={item.external}
              />
            ))}

            <div className={`my-4 ${
              theme === 'gradient' ? 'border-t border-gray-700' : 'border-t border-gray-200 dark:border-gray-700'
            }`} />

            {/* Favorites Section */}
            {!favoritesLoading && favorites.length > 0 && (
              <div data-hint="favorites">
                {!collapsed && (
                  <div className={`mb-2 px-3 flex items-center justify-between ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <span className="text-xs font-medium uppercase">Favorites</span>
                    <button
                      onClick={() => setShowFavoritesModal(true)}
                      className={`p-1 rounded hover:bg-gray-700/50 transition-colors ${
                        theme === 'gradient' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                      title="Clear all favorites"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {favorites.map((item, index) => (
                  <NavLink
                    key={`favorite-${index}-${item.id}`}
                    to={item.page_path}
                    className={({ isActive }) => `
                      flex items-center px-3 py-1.5 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                        : theme === 'gradient'
                          ? 'text-gray-200 hover:bg-gray-700/50'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                  >
                    <span className="text-lg">{getFavoritesRecentIcon(item.page_icon, item.page_path)}</span>
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full ml-3">
                        <span className="text-sm">{item.page_title}</span>
                        <Heart className="h-3 w-3 text-red-500 fill-current" />
                      </div>
                    )}
                  </NavLink>
                ))}
                
                <div className={`my-4 ${
                  theme === 'gradient' ? 'border-t border-gray-700' : 'border-t border-gray-200 dark:border-gray-700'
                }`} />
              </div>
            )}

            {/* Recent Opened Section */}
            {!recentLoading && recentPages.length > 0 && (
              <div data-hint="recent">
                {!collapsed && (
                  <div className={`mb-2 px-3 flex items-center justify-between ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <span className="text-xs font-medium uppercase">Recent Opened</span>
                    <button
                      onClick={() => setShowRecentModal(true)}
                      className={`p-1 rounded hover:bg-gray-700/50 transition-colors ${
                        theme === 'gradient' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                      title="Clear recent pages"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {recentPages.map((item, index) => (
                  <NavLink
                    key={`recent-${index}-${item.id}`}
                    to={item.page_path}
                    className={({ isActive }) => `
                      flex items-center px-3 py-1.5 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                        : theme === 'gradient'
                          ? 'text-gray-200 hover:bg-gray-700/50'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                  >
                    <span className="text-lg">{getFavoritesRecentIcon(item.page_icon, item.page_path)}</span>
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full ml-3">
                        <span className="text-sm">{item.page_title}</span>
                        <Clock className="h-3 w-3 text-gray-400" />
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings at the bottom */}
        <div className={`px-3 py-4 ${
          theme === 'gradient' ? 'border-t border-gray-700' : 'border-t border-gray-200 dark:border-gray-800'
        }`} data-hint="settings">
          <NavItem
            to="/settings"
            icon={<SettingsIcon />}
            label="Settings"
            collapsed={collapsed}
          />
        </div>
      </aside>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        onConfirm={handleClearFavorites}
        title="Clear All Favorites"
        message="Are you sure you want to remove all pages from your favorites? This action cannot be undone."
      />

      <ConfirmationModal
        isOpen={showRecentModal}
        onClose={() => setShowRecentModal(false)}
        onConfirm={handleClearRecent}
        title="Clear Recent Pages"
        message="Are you sure you want to clear your recent pages history? This action cannot be undone."
      />
    </>
  );
};
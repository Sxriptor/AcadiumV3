// Page configuration for titles and icons
export const pageConfig = {
  '/vibe-coding-lab': {
    title: 'Vibe Coding Lab',
    icon: 'Code'
  },
  '/n8n-ai-agents': {
    title: 'N8n AI Agents',
    icon: 'Bot'
  },
  '/ai-course-factory': {
    title: 'AI Course Factory',
    icon: 'Factory'
  },
  '/prompt-engineering': {
    title: 'Prompt Engineering',
    icon: 'FileText'
  },
  '/signal-intelligence': {
    title: 'Signal Intelligence',
    icon: 'Search'
  },
  '/genesis-engine': {
    title: 'Genesis Engine',
    icon: 'Package'
  },
  '/speed-wealth': {
    title: 'Speed Wealth',
    icon: 'Zap'
  },
  '/cashflow-arena': {
    title: 'Cashflow Arena',
    icon: 'DollarSign'
  },
  '/ghostwriting': {
    title: 'Digital Ghostwriting',
    icon: 'Ghost'
  },
  '/market-recon': {
    title: 'Market Recon',
    icon: 'BarChart2'
  },
  '/analytics': {
    title: 'Analytics Dashboard',
    icon: 'AreaChart'
  },
  '/portfolio': {
    title: 'Portfolio Showcase',
    icon: 'Briefcase'
  },
  '/discord': {
    title: 'Discord Integration',
    icon: 'MessageSquare'
  },
  '/challenges': {
    title: 'Challenges & Mentorship',
    icon: 'Trophy'
  },
  '/community': {
    title: 'Community Hub',
    icon: 'Users'
  },
  '/integrate': {
    title: 'Integrate',
    icon: 'Plug'
  },
  '/deploy': {
    title: 'Deploy',
    icon: 'Rocket'
  },
  '/optimize': {
    title: 'Optimize',
    icon: 'SettingsGear'
  },
  // N8n focus pages
  '/n8n': {
    title: 'N8n Dashboard',
    icon: 'Bot'
  },
  '/n8n/integrate': {
    title: 'N8n Integrate',
    icon: 'Plug'
  },
  '/n8n/deploy': {
    title: 'N8n Deploy',
    icon: 'Rocket'
  },
  '/n8n/optimize': {
    title: 'N8n Optimize',
    icon: 'Settings'
  },
  '/n8n/network': {
    title: 'N8n Network',
    icon: 'Users'
  },
  // Video focus pages
  '/video': {
    title: 'Video Dashboard',
    icon: 'Video'
  },
  '/video/integrate': {
    title: 'Video Integrate',
    icon: 'Plug'
  },
  '/video/deploy': {
    title: 'Video Deploy',
    icon: 'Rocket'
  },
  '/video/optimize': {
    title: 'Video Optimize',
    icon: 'Settings'
  },
  '/video/network': {
    title: 'Video Network',
    icon: 'Users'
  },
  // Web Dev focus pages
  '/webdev': {
    title: 'Web Dev Dashboard',
    icon: 'Code'
  },
  '/webdev/integrate': {
    title: 'Web Integrate',
    icon: 'Database'
  },
  '/webdev/deploy': {
    title: 'Web Deploy',
    icon: 'Rocket'
  },
  '/webdev/optimize': {
    title: 'Web Optimize',
    icon: 'Monitor'
  },
  '/webdev/network': {
    title: 'Web Network',
    icon: 'Users'
  },
  // Advanced focus pages
  '/advanced': {
    title: 'Advanced Dashboard',
    icon: 'Layers'
  },
  '/advanced/n8n': {
    title: 'Advanced N8n',
    icon: 'Bot'
  },
  '/advanced/video': {
    title: 'Advanced Video',
    icon: 'Video'
  },
  '/advanced/webdev': {
    title: 'Advanced Web Dev',
    icon: 'Code'
  },
  '/advanced/clothing-brand': {
    title: 'Clothing Brand',
    icon: 'Shirt'
  },
  '/advanced/ai-influencer': {
    title: 'AI Influencer',
    icon: 'Users'
  },
  '/advanced/copywriting': {
    title: 'AI Copywriting',
    icon: 'FileText'
  },
  '/advanced/automationagency': {
    title: 'Automation Agency',
    icon: 'Zap'
  }
};

export const getPageInfo = (path: string) => {
  return pageConfig[path as keyof typeof pageConfig] || {
    title: 'Unknown Page',
    icon: 'Circle'
  };
};
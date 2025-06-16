import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Ghost, 
  Image, 
  FileText, 
  DollarSign, 
  Globe, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Instagram,
  Youtube,
  Twitter,
  Zap,
  Target,
  Users,
  Camera,
  MessageSquare
} from 'lucide-react';

const AiInfluencer: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('character-creation');

  const tabs = [
    { id: 'character-creation', label: 'AI Character Creation', icon: <Ghost className="h-4 w-4" /> },
    { id: 'content-automation', label: 'Content Automation', icon: <FileText className="h-4 w-4" /> },
    { id: 'monetization', label: 'Monetization Strategies', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'multi-platform', label: 'Multi-Platform Growth', icon: <Globe className="h-4 w-4" /> },
    { id: 'empire-scaling', label: 'Empire Scaling', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'character-creation':
        return <CharacterCreationContent />;
      case 'content-automation':
        return <ContentAutomationContent />;
      case 'monetization':
        return <MonetizationContent />;
      case 'multi-platform':
        return <MultiPlatformContent />;
      case 'empire-scaling':
        return <EmpireScalingContent />;
      default:
        return <CharacterCreationContent />;
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-purple-200 mb-4">
            <Ghost className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">AI INFLUENCER</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Build Profitable AI Influencer Empires
          </h1>
          
          <p className="text-purple-100 text-lg md:text-xl max-w-2xl mb-8">
            Create, grow, and monetize AI influencer accounts across multiple platforms
            with automated content creation and engagement systems.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-purple-700 hover:bg-purple-50">
              <Ghost className="mr-2 h-4 w-4" />
              Start Building
            </Button>
            
            <Button variant="outline" className="border-purple-300 text-white hover:bg-white/10">
              View Success Stories
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Potential Revenue",
            value: "$5K-100K/mo",
            icon: <DollarSign className="h-5 w-5" />,
            color: "green"
          },
          {
            label: "Time to Monetization",
            value: "30-90 Days",
            icon: <Zap className="h-5 w-5" />,
            color: "yellow"
          },
          {
            label: "Profit Margins",
            value: "70-90%",
            icon: <TrendingUp className="h-5 w-5" />,
            color: "blue"
          },
          {
            label: "Startup Cost",
            value: "$100-500",
            icon: <Ghost className="h-5 w-5" />,
            color: "purple"
          }
        ].map((metric, index) => (
          <Card key={index}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/30 text-${metric.color}-600 dark:text-${metric.color}-400 mr-4`}>
                {metric.icon}
              </div>
              <div>
                <p className={`text-sm ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {metric.label}
                </p>
                <p className={`text-xl font-bold ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {metric.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs Navigation */}
      <Card className="p-0 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : theme === 'gradient'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Build Your AI Influencer Empire?
          </h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Start creating your AI influencers today and build a profitable digital empire.
          </p>
          <Button className="bg-white text-purple-700 hover:bg-purple-50">
            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Tab Content Components
const CharacterCreationContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        AI Character Creation
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Create compelling AI influencer personalities that connect with audiences and build loyal followings.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Niche & Audience Research",
            description: "Identify profitable niches and audience segments for your AI influencers",
            steps: [
              "Research trending niches with high engagement and monetization potential",
              "Analyze competitor AI and human influencers in your target niche",
              "Identify specific audience pain points and desires to address"
            ]
          },
          {
            title: "Character Development",
            description: "Create compelling AI personalities with depth and authenticity",
            steps: [
              "Develop detailed character backstories and personality traits",
              "Create consistent voice, opinions, and values for your AI persona",
              "Design character arcs and growth narratives for long-term engagement"
            ]
          },
          {
            title: "Visual Identity Creation",
            description: "Generate consistent, high-quality visual assets for your AI influencer",
            steps: [
              "Use Midjourney or Leonardo.AI to create consistent character images",
              "Develop a visual style guide for consistent appearance across posts",
              "Create diverse image sets for different content contexts and scenarios"
            ]
          },
          {
            title: "Platform-Specific Optimization",
            description: "Tailor your AI influencer for maximum impact on each platform",
            steps: [
              "Adapt character presentation for Instagram, TikTok, YouTube, and Twitter",
              "Develop platform-specific content strategies and posting schedules",
              "Create custom visual assets optimized for each platform's requirements"
            ]
          }
        ].map((section, index) => (
          <Card key={index} className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {section.title}
            </h3>
            <p className={`text-sm mb-4 ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
            }`}>
              {section.description}
            </p>
            <div className="space-y-2">
              {section.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => {}}>
          Download Character Creation Templates
        </Button>
      </div>
    </div>
  );
};

const ContentAutomationContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Content Automation
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Build systems to automate content creation, scheduling, and engagement for your AI influencers.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Content Generation System",
            description: "Create a systematic approach to generating engaging content at scale",
            steps: [
              "Set up AI tools for text content generation (GPT-4, Claude)",
              "Implement image generation workflow with Midjourney or Leonardo.AI",
              "Create video content automation with Runway or similar tools"
            ]
          },
          {
            title: "Content Calendar & Batching",
            description: "Develop efficient content planning and creation processes",
            steps: [
              "Create a strategic content calendar with theme days and content pillars",
              "Implement batch creation processes for efficiency (weekly/monthly)",
              "Set up content libraries and asset management systems"
            ]
          },
          {
            title: "Automated Scheduling",
            description: "Implement tools and systems for automated content publishing",
            steps: [
              "Set up scheduling tools for each platform (Later, Buffer, etc.)",
              "Create optimal posting schedules based on audience analytics",
              "Implement cross-platform coordination for cohesive messaging"
            ]
          },
          {
            title: "Engagement Automation",
            description: "Automate audience interaction while maintaining authenticity",
            steps: [
              "Set up AI-powered comment and message response systems",
              "Create templates for common interactions and questions",
              "Implement engagement monitoring and priority flagging for manual review"
            ]
          }
        ].map((section, index) => (
          <Card key={index} className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {section.title}
            </h3>
            <p className={`text-sm mb-4 ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
            }`}>
              {section.description}
            </p>
            <div className="space-y-2">
              {section.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => {}}>
          Download Content Automation Playbook
        </Button>
      </div>
    </div>
  );
};

const MonetizationContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Monetization Strategies
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Implement multiple revenue streams to maximize the profitability of your AI influencers.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Brand Sponsorships & Partnerships",
            description: "Secure lucrative brand deals for your AI influencers",
            steps: [
              "Create a professional media kit highlighting audience demographics and engagement",
              "Develop outreach systems for connecting with relevant brands",
              "Create pricing tiers and package offerings for different sponsorship levels"
            ]
          },
          {
            title: "Digital Product Creation",
            description: "Develop and sell digital products to your audience",
            steps: [
              "Identify high-demand digital products aligned with your niche",
              "Create digital products using AI tools (courses, templates, guides)",
              "Implement automated sales and delivery systems"
            ]
          },
          {
            title: "Affiliate Marketing Systems",
            description: "Generate passive income through strategic affiliate partnerships",
            steps: [
              "Research and join high-commission affiliate programs in your niche",
              "Create authentic product recommendation content",
              "Implement tracking and optimization systems for affiliate performance"
            ]
          },
          {
            title: "Premium Content & Memberships",
            description: "Create exclusive content and membership offerings",
            steps: [
              "Develop tiered membership offerings with exclusive content",
              "Set up platforms for premium content delivery (Patreon, OnlyFans, etc.)",
              "Create automated content delivery systems for members"
            ]
          }
        ].map((section, index) => (
          <Card key={index} className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {section.title}
            </h3>
            <p className={`text-sm mb-4 ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
            }`}>
              {section.description}
            </p>
            <div className="space-y-2">
              {section.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => {}}>
          Download Monetization Blueprint
        </Button>
      </div>
    </div>
  );
};

const MultiPlatformContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Multi-Platform Growth
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Expand your AI influencer presence across multiple platforms for maximum reach and impact.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Instagram Strategy",
            description: "Build a powerful Instagram presence for your AI influencer",
            steps: [
              "Implement the 'Content Pillar' strategy for consistent engagement",
              "Master Instagram-specific features (Stories, Reels, Guides)",
              "Develop growth tactics including hashtag strategies and collaboration systems"
            ]
          },
          {
            title: "TikTok Expansion",
            description: "Leverage TikTok's algorithm for rapid AI influencer growth",
            steps: [
              "Create TikTok-optimized content formats and styles",
              "Implement trend-jacking strategies for viral potential",
              "Develop cross-promotion tactics between platforms"
            ]
          },
          {
            title: "YouTube Channel Development",
            description: "Build a YouTube presence for deeper audience connection",
            steps: [
              "Set up AI-powered video creation workflow for YouTube",
              "Implement SEO strategies for YouTube discoverability",
              "Create content series and formats optimized for the platform"
            ]
          },
          {
            title: "Cross-Platform Synergy",
            description: "Create systems for efficient multi-platform management",
            steps: [
              "Develop content repurposing workflows for cross-platform efficiency",
              "Create unified branding and messaging across all platforms",
              "Implement cross-platform analytics and performance tracking"
            ]
          }
        ].map((section, index) => (
          <Card key={index} className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {section.title}
            </h3>
            <p className={`text-sm mb-4 ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
            }`}>
              {section.description}
            </p>
            <div className="space-y-2">
              {section.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => {}}>
          Download Platform Growth Strategies
        </Button>
      </div>
    </div>
  );
};

const EmpireScalingContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Empire Scaling
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Scale from a single AI influencer to a full portfolio of profitable AI personalities.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Multi-Character Management",
            description: "Efficiently manage multiple AI influencers simultaneously",
            steps: [
              "Implement centralized content creation and management systems",
              "Develop character differentiation strategies to avoid cannibalization",
              "Create cross-promotion strategies between your AI influencers"
            ]
          },
          {
            title: "Team Building & Outsourcing",
            description: "Scale your operation with strategic hiring and outsourcing",
            steps: [
              "Identify key roles for outsourcing (content creation, engagement management)",
              "Create detailed SOPs for all operational processes",
              "Implement training systems for team members"
            ]
          },
          {
            title: "Business Entity & Legal Structure",
            description: "Set up proper business foundations for your AI influencer empire",
            steps: [
              "Establish appropriate business entity structure (LLC recommended)",
              "Implement intellectual property protection strategies",
              "Set up proper accounting and tax management systems"
            ]
          },
          {
            title: "Exit Strategy & Valuation",
            description: "Position your AI influencer business for maximum valuation",
            steps: [
              "Develop systems that create business value beyond personal involvement",
              "Implement proper documentation and reporting for potential acquirers",
              "Create multiple exit strategy options (full sale, partial sale, licensing)"
            ]
          }
        ].map((section, index) => (
          <Card key={index} className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {section.title}
            </h3>
            <p className={`text-sm mb-4 ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
            }`}>
              {section.description}
            </p>
            <div className="space-y-2">
              {section.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button onClick={() => {}}>
          Download Empire Scaling Roadmap
        </Button>
      </div>
    </div>
  );
};

export default AiInfluencer;
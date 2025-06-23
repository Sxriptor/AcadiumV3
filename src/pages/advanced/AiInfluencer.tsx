import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GuideOverlay } from '../../components/shared/GuideOverlay';
import { ClickableCard } from '../../components/shared/ClickableCard';
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
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

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
        return <CharacterCreationContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'content-automation':
        return <ContentAutomationContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'monetization':
        return <MonetizationContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'multi-platform':
        return <MultiPlatformContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'empire-scaling':
        return <EmpireScalingContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      default:
        return <CharacterCreationContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
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
const CharacterCreationContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const characterSections = [
    {
      id: 'niche-research',
      title: 'Niche & Audience Research',
      description: 'Identify profitable niches and audience segments for your AI influencers',
      icon: <Target className="h-6 w-6" />,
      color: 'blue' as const,
      overlayContent: {
        title: 'Niche & Audience Research Guide',
        description: 'Master the art of identifying profitable niches and building targeted audiences',
        sections: [
          {
            title: 'Strategic Niche Selection',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Learn how to identify and evaluate profitable niches for your AI influencer empire.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Research Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Analyze trending topics with high engagement potential</li>
                  <li>Evaluate monetization opportunities within each niche</li>
                  <li>Study competitor performance and market saturation</li>
                  <li>Identify underserved audience segments and gaps</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Trend Analysis
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Identify rising trends
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Monetization Potential
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Evaluate profit opportunities
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Audience Analysis
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Study target demographics
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Niche Research Template', url: '#' },
              { title: 'Audience Analysis Worksheet', url: '#' }
            ],
            checklist: [
              'Research trending topics and hashtags',
              'Analyze competitor performance',
              'Identify monetization opportunities',
              'Define target audience personas'
            ]
          }
        ]
      }
    },
    {
      id: 'character-development',
      title: 'Character Development',
      description: 'Create compelling AI personalities with depth and authenticity',
      icon: <Ghost className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'AI Character Development Guide',
        description: 'Build authentic AI personalities that resonate with audiences',
        sections: [
          {
            title: 'Personality Architecture',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create multi-dimensional AI personalities with authentic traits and consistent behavior patterns.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Development Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Define core personality traits and characteristics</li>
                  <li>Create compelling backstory and life experiences</li>
                  <li>Establish values, beliefs, and worldview</li>
                  <li>Design speech patterns and communication style</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Ghost className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Core Identity
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Define fundamental traits
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <FileText className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Backstory Creation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Build compelling history
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <MessageSquare className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Voice & Style
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Develop unique voice
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Character Development Template', url: '#' },
              { title: 'Personality Framework Guide', url: '#' }
            ],
            checklist: [
              'Define core personality traits',
              'Create detailed backstory',
              'Establish voice and tone',
              'Design behavioral patterns'
            ]
          }
        ]
      }
    },
    {
      id: 'visual-identity',
      title: 'Visual Identity Creation',
      description: 'Generate consistent, high-quality visual assets for your AI influencer',
      icon: <Image className="h-6 w-6" />,
      color: 'green' as const,
      overlayContent: {
        title: 'Visual Identity Creation Guide',
        description: 'Master AI-powered visual content creation for consistent branding',
        sections: [
          {
            title: 'AI Image Generation Mastery',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create consistent, high-quality visual content using advanced AI image generation tools.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Visual Strategy:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Master Midjourney and Leonardo.AI for character consistency</li>
                  <li>Develop style guides for visual coherence</li>
                  <li>Create diverse content for different scenarios</li>
                  <li>Optimize images for each platform's requirements</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Camera className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        AI Photography
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Generate realistic photos
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Image className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Style Consistency
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Maintain visual identity
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Batch Creation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Scale content production
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'AI Prompt Library', url: '#' },
              { title: 'Style Guide Template', url: '#' }
            ],
            checklist: [
              'Set up AI image generation tools',
              'Create character consistency guide',
              'Generate diverse image library',
              'Optimize for platform specs'
            ]
          }
        ]
      }
    },
    {
      id: 'platform-optimization',
      title: 'Platform-Specific Optimization',
      description: 'Tailor your AI influencer for maximum impact on each platform',
      icon: <Globe className="h-6 w-6" />,
      color: 'orange' as const,
      overlayContent: {
        title: 'Multi-Platform Optimization Guide',
        description: 'Optimize your AI influencer presence across all major platforms',
        sections: [
          {
            title: 'Platform Strategy Framework',
            color: 'orange' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Adapt your AI influencer's presence for maximum impact on each platform's unique algorithm and audience.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Optimization Strategy:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Customize content format for each platform</li>
                  <li>Optimize posting schedules and frequency</li>
                  <li>Adapt voice and tone for platform culture</li>
                  <li>Leverage platform-specific features and trends</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Instagram className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-pink-400' : 'text-pink-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Instagram Strategy
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Visual storytelling focus
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Youtube className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        YouTube Content
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Long-form engagement
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Twitter className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Twitter/X Presence
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Real-time conversations
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Platform Specs Guide', url: '#' },
              { title: 'Content Calendar Template', url: '#' }
            ],
            checklist: [
              'Research platform algorithms',
              'Create platform-specific content',
              'Optimize posting schedules',
              'Adapt character for each audience'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        AI Character Creation
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Create compelling AI influencer personalities that connect with audiences and build loyal followings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characterSections.map((section) => (
          <ClickableCard 
            key={section.id}
            onClick={() => setActiveOverlay(section.id)}
            className={`p-6 border-l-4 border-${section.color}-500 transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-600 dark:text-${section.color}-400`}>
                {section.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {section.title}
            </h3>
                <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
              {section.description}
            </p>
                <div className="mt-3">
                  <ArrowRight className={`h-4 w-4 text-${section.color}-500`} />
                </div>
            </div>
            </div>
          </ClickableCard>
        ))}
      </div>

      {/* Guide Overlays */}
      {characterSections.map((section) => (
        <GuideOverlay
          key={`overlay-${section.id}`}
          isOpen={activeOverlay === section.id}
          onClose={() => setActiveOverlay(null)}
          title={section.overlayContent.title}
          description={section.overlayContent.description}
          sections={section.overlayContent.sections}
        />
      ))}
      
      <div className="flex justify-end">
        <Button onClick={() => setActiveOverlay('niche-research')}>
          Start Character Creation
        </Button>
      </div>
    </div>
  );
};

const ContentAutomationContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const automationSections = [
    {
      id: 'content-generation',
      title: 'Content Generation System',
      description: 'Create a systematic approach to generating engaging content at scale',
      icon: <FileText className="h-6 w-6" />,
      color: 'blue' as const,
      overlayContent: {
        title: 'AI Content Generation Mastery',
        description: 'Build automated systems for creating high-quality content at scale',
        sections: [
          {
            title: 'AI-Powered Content Creation',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Leverage cutting-edge AI tools to create authentic, engaging content that resonates with your audience.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Content Creation Stack:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>GPT-4 and Claude for text content generation</li>
                  <li>Midjourney and Leonardo.AI for visual content</li>
                  <li>Runway and Synthesia for video content</li>
                  <li>ElevenLabs for voice synthesis and audio</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <FileText className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Text Generation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        AI-powered writing
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Image className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Visual Content
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        AI image generation
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Camera className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Video Creation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Automated video production
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'AI Tools Setup Guide', url: '#' },
              { title: 'Content Generation Workflows', url: '#' }
            ],
            checklist: [
              'Set up AI content generation tools',
              'Create content templates and prompts',
              'Establish quality control processes',
              'Build content approval workflows'
            ]
          }
        ]
      }
    },
    {
      id: 'content-calendar',
      title: 'Content Calendar & Batching',
      description: 'Develop efficient content planning and creation processes',
      icon: <Target className="h-6 w-6" />,
      color: 'green' as const,
      overlayContent: {
        title: 'Strategic Content Planning',
        description: 'Master content planning and batch creation for maximum efficiency',
        sections: [
          {
            title: 'Content Strategy Framework',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build a systematic approach to content planning that ensures consistency and maximizes engagement.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Planning System:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Content pillars and theme development</li>
                  <li>Seasonal and trending topic integration</li>
                  <li>Batch creation workflows for efficiency</li>
                  <li>Cross-platform content optimization</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Content Strategy
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Strategic planning
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Batch Creation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Efficiency workflows
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Trend Integration
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Timely content
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Content Calendar Template', url: '#' },
              { title: 'Batch Creation Workflow', url: '#' }
            ],
            checklist: [
              'Create monthly content calendar',
              'Define content pillars and themes',
              'Set up batch creation schedule',
              'Establish content asset library'
            ]
          }
        ]
      }
    },
    {
      id: 'automated-scheduling',
      title: 'Automated Scheduling',
      description: 'Implement tools and systems for automated content publishing',
      icon: <Globe className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'Automated Publishing Systems',
        description: 'Build systems to automatically publish content across all platforms',
        sections: [
          {
            title: 'Multi-Platform Automation',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Implement sophisticated scheduling systems that maximize reach and engagement across all platforms.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Automation Tools:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Buffer and Hootsuite for social scheduling</li>
                  <li>Later for visual content optimization</li>
                  <li>Zapier for workflow automation</li>
                  <li>Custom APIs for advanced scheduling</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Globe className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Multi-Platform
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Cross-platform scheduling
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Smart Timing
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Optimal posting times
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Audience Targeting
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Platform optimization
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Scheduling Tools Comparison', url: '#' },
              { title: 'Automation Setup Guide', url: '#' }
            ],
            checklist: [
              'Choose scheduling platform',
              'Connect all social accounts',
              'Set optimal posting schedules',
              'Test automation workflows'
            ]
          }
        ]
      }
    },
    {
      id: 'engagement-automation',
      title: 'Engagement Automation',
      description: 'Automate audience interaction while maintaining authenticity',
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'orange' as const,
      overlayContent: {
        title: 'Intelligent Engagement Systems',
        description: 'Automate audience interactions while maintaining authentic connections',
        sections: [
          {
            title: 'AI-Powered Engagement',
            color: 'orange' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build intelligent systems that can engage with your audience authentically while scaling your reach.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Engagement Strategy:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>AI-powered comment and message responses</li>
                  <li>Engagement monitoring and priority flagging</li>
                  <li>Authentic interaction templates</li>
                  <li>Community management automation</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <MessageSquare className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Smart Responses
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        AI-powered replies
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Community Management
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Automated moderation
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Engagement Growth
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Scale interactions
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Engagement Automation Tools', url: '#' },
              { title: 'Response Template Library', url: '#' }
            ],
            checklist: [
              'Set up AI response systems',
              'Create interaction templates',
              'Configure engagement monitoring',
              'Test automation accuracy'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        Content Automation
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Build systems to automate content creation, scheduling, and engagement for your AI influencers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automationSections.map((section) => (
          <ClickableCard 
            key={section.id}
            onClick={() => setActiveOverlay(section.id)}
            className={`p-6 border-l-4 border-${section.color}-500 transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-600 dark:text-${section.color}-400`}>
                {section.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {section.title}
            </h3>
                <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
              {section.description}
            </p>
                <div className="mt-3">
                  <ArrowRight className={`h-4 w-4 text-${section.color}-500`} />
                </div>
            </div>
            </div>
          </ClickableCard>
        ))}
      </div>

      {/* Guide Overlays */}
      {automationSections.map((section) => (
        <GuideOverlay
          key={`overlay-${section.id}`}
          isOpen={activeOverlay === section.id}
          onClose={() => setActiveOverlay(null)}
          title={section.overlayContent.title}
          description={section.overlayContent.description}
          sections={section.overlayContent.sections}
        />
      ))}
      
      <div className="flex justify-end">
        <Button onClick={() => setActiveOverlay('content-generation')}>
          Start Content Automation
        </Button>
      </div>
    </div>
  );
};

const MonetizationContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const monetizationSections = [
    {
      id: 'brand-partnerships',
      title: 'Brand Sponsorships & Partnerships',
      description: 'Secure lucrative brand deals for your AI influencers',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'green' as const,
      overlayContent: {
        title: 'Brand Partnership Mastery',
        description: 'Master the art of securing high-value brand partnerships and sponsorships',
        sections: [
          {
            title: 'Strategic Partnership Development',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build relationships with brands and create compelling partnership proposals that generate substantial revenue.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Partnership Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Professional media kit development</li>
                  <li>Brand outreach and relationship building</li>
                  <li>Pricing strategies and rate negotiation</li>
                  <li>Contract creation and partnership management</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Media Kit Creation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Professional presentation
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Brand Outreach
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Strategic networking
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Rate Negotiation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Maximize earnings
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Media Kit Template', url: '#' },
              { title: 'Brand Outreach Scripts', url: '#' }
            ],
            checklist: [
              'Create professional media kit',
              'Research target brands',
              'Develop outreach strategy',
              'Set partnership rates'
            ]
          }
        ],
      }
    },
    {
      id: 'digital-products',
      title: 'Digital Product Creation',
      description: 'Develop and sell digital products to your audience',
      icon: <FileText className="h-6 w-6" />,
      color: 'blue' as const,
      overlayContent: {
        title: 'Digital Product Empire',
        description: 'Create and launch profitable digital products for your AI influencer audience',
        sections: [
          {
            title: 'Product Development Strategy',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create high-value digital products that serve your audience and generate passive income streams.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Product Portfolio:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Online courses and educational content</li>
                  <li>Templates, guides, and digital tools</li>
                  <li>Exclusive content and digital experiences</li>
                  <li>Software tools and AI-powered solutions</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <FileText className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Course Creation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Educational products
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Templates & Tools
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Practical resources
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        AI Solutions
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Software products
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Product Development Framework', url: '#' },
              { title: 'Launch Strategy Guide', url: '#' }
            ],
            checklist: [
              'Identify audience needs',
              'Create product roadmap',
              'Build minimum viable product',
              'Launch and iterate'
            ]
          }
        ]
      }
    },
    {
      id: 'affiliate-marketing',
      title: 'Affiliate Marketing Systems',
      description: 'Generate passive income through strategic affiliate partnerships',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'Affiliate Marketing Mastery',
        description: 'Build profitable affiliate marketing systems for sustainable passive income',
        sections: [
          {
            title: 'Strategic Affiliate Framework',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create authentic affiliate marketing strategies that provide value to your audience while generating substantial commissions.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Affiliate Strategy:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>High-commission affiliate program research</li>
                  <li>Authentic product recommendation systems</li>
                  <li>Performance tracking and optimization</li>
                  <li>Trust-building and transparency practices</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Program Selection
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        High-value partnerships
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Content Strategy
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Authentic recommendations
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Performance Tracking
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Optimize conversions
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Affiliate Program Database', url: '#' },
              { title: 'Conversion Optimization Guide', url: '#' }
            ],
            checklist: [
              'Research affiliate programs',
              'Apply to relevant programs',
              'Create content strategy',
              'Track and optimize performance'
            ]
          }
        ]
      }
    },
    {
      id: 'premium-content',
      title: 'Premium Content & Memberships',
      description: 'Create exclusive content and membership offerings',
      icon: <Users className="h-6 w-6" />,
      color: 'orange' as const,
      overlayContent: {
        title: 'Premium Content Strategy',
        description: 'Build exclusive membership offerings that create recurring revenue streams',
        sections: [
          {
            title: 'Membership Business Model',
            color: 'orange' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create exclusive content offerings that provide ongoing value and generate predictable recurring revenue.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Membership Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Tiered membership structure development</li>
                  <li>Exclusive content creation and delivery</li>
                  <li>Community building and engagement</li>
                  <li>Automated member onboarding and retention</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Membership Tiers
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Structured offerings
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <FileText className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Exclusive Content
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Premium experiences
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Automation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Scalable delivery
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Membership Platform Guide', url: '#' },
              { title: 'Content Calendar Template', url: '#' }
            ],
            checklist: [
              'Design membership tiers',
              'Choose platform (Patreon, etc.)',
              'Create exclusive content plan',
              'Set up automated delivery'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        Monetization Strategies
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Implement multiple revenue streams to maximize the profitability of your AI influencers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {monetizationSections.map((section) => (
          <ClickableCard 
            key={section.id}
            onClick={() => setActiveOverlay(section.id)}
            className={`p-6 border-l-4 border-${section.color}-500 transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-600 dark:text-${section.color}-400`}>
                {section.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {section.title}
            </h3>
                <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
              {section.description}
            </p>
                <div className="mt-3">
                  <ArrowRight className={`h-4 w-4 text-${section.color}-500`} />
                </div>
            </div>
            </div>
          </ClickableCard>
        ))}
      </div>

      {/* Guide Overlays */}
      {monetizationSections.map((section) => (
        <GuideOverlay
          key={`overlay-${section.id}`}
          isOpen={activeOverlay === section.id}
          onClose={() => setActiveOverlay(null)}
          title={section.overlayContent.title}
          description={section.overlayContent.description}
          sections={section.overlayContent.sections}
        />
      ))}
      
      <div className="flex justify-end">
        <Button onClick={() => setActiveOverlay('brand-partnerships')}>
          Start Monetization Strategy
        </Button>
      </div>
    </div>
  );
};

const MultiPlatformContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();

  const platformSections = [
    {
      id: 'platform-strategy',
      title: 'Platform Selection & Strategy',
      description: 'Choose and optimize your presence across different social platforms',
      icon: <Globe className="h-6 w-6" />,
      color: 'blue' as const,
      overlayContent: {
        title: 'Platform Strategy Guide',
        description: 'Master the art of multi-platform presence and strategic growth',
        sections: [
          {
            title: 'Platform Selection Framework',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Learn how to strategically select and prioritize social media platforms for your AI influencer.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Considerations:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Audience demographics and platform alignment</li>
                  <li>Content format compatibility with AI generation</li>
                  <li>Monetization opportunities per platform</li>
                  <li>Cross-platform synergy potential</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Instagram className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-pink-400' : 'text-pink-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Instagram Strategy
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Visual content focus
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Youtube className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        YouTube Strategy
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Long-form content
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Twitter className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Twitter Strategy
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Engagement focus
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              {
                title: 'Platform Analysis Tools',
                url: 'https://acadium.com/resources/platform-analysis'
              },
              {
                title: 'Cross-Platform Strategy Guide',
                url: 'https://acadium.com/resources/cross-platform-strategy'
              }
            ]
          }
        ]
      }
    },
    {
      id: 'content-adaptation',
      title: 'Content Adaptation',
      description: "Adapt and optimize content for each platform's unique requirements",
      icon: <FileText className="h-6 w-6" />,
      color: 'green' as const,
      overlayContent: {
        title: 'Content Adaptation Guide',
        description: 'Learn how to effectively adapt your content for different platforms',
        sections: [
          {
            title: 'Platform-Specific Content Strategy',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Master the art of adapting your AI-generated content for different platforms while maintaining brand consistency.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Adaptation Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Format optimization for each platform</li>
                  <li>Platform-specific content requirements</li>
                  <li>Timing and frequency adjustments</li>
                  <li>Cross-platform content repurposing</li>
                </ul>
              </div>
            ),
            resources: [
              {
                title: 'Content Adaptation Templates',
                url: 'https://acadium.com/resources/content-adaptation'
              },
              {
                title: 'Platform Best Practices',
                url: 'https://acadium.com/resources/platform-best-practices'
              }
            ]
          }
        ]
      }
    },
    {
      id: 'cross-promotion',
      title: 'Cross-Platform Promotion',
      description: 'Build synergy between platforms to maximize reach and engagement',
      icon: <Users className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'Cross-Platform Promotion Guide',
        description: 'Maximize your reach through effective cross-platform promotion',
        sections: [
          {
            title: 'Cross-Promotion Strategy',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Learn how to create effective cross-platform promotion strategies that drive traffic and engagement.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Strategies:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Platform-specific call-to-actions</li>
                  <li>Content teasers and previews</li>
                  <li>Cross-platform community building</li>
                  <li>Unified branding strategy</li>
                </ul>
              </div>
            ),
            resources: [
              {
                title: 'Cross-Promotion Templates',
                url: 'https://acadium.com/resources/cross-promotion'
              },
              {
                title: 'Traffic Analysis Guide',
                url: 'https://acadium.com/resources/traffic-analysis'
              }
            ]
          }
        ]
      }
    },
    {
      id: 'analytics-optimization',
      title: 'Analytics & Optimization',
      description: 'Track and optimize performance across all platforms',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'yellow' as const,
      overlayContent: {
        title: 'Analytics & Optimization Guide',
        description: 'Master the art of data-driven optimization across platforms',
        sections: [
          {
            title: 'Multi-Platform Analytics',
            color: 'yellow' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Learn how to track, analyze, and optimize your performance across multiple platforms.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Metrics:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Platform-specific performance metrics</li>
                  <li>Cross-platform engagement tracking</li>
                  <li>ROI analysis per platform</li>
                  <li>Growth rate comparison</li>
                </ul>
              </div>
            ),
            resources: [
              {
                title: 'Analytics Tools Guide',
                url: 'https://acadium.com/resources/analytics-tools'
              },
              {
                title: 'Optimization Playbook',
                url: 'https://acadium.com/resources/optimization-playbook'
              }
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platformSections.map((section) => (
          <ClickableCard
            key={section.id}
            onClick={() => setActiveOverlay(section.id)}
            className={`relative overflow-hidden ${
              theme === 'gradient' ? 'hover:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="p-6">
              <div className={`inline-flex p-3 rounded-lg bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-600 dark:text-${section.color}-400 mb-4`}>
                {section.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {section.title}
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {section.description}
              </p>
            </div>
          </ClickableCard>
        ))}
      </div>

      {platformSections.map((section) => (
        <GuideOverlay
          key={section.id}
          isOpen={activeOverlay === section.id}
          onClose={() => setActiveOverlay(null)}
          title={section.overlayContent.title}
          description={section.overlayContent.description}
          sections={section.overlayContent.sections}
        />
      ))}
    </div>
  );
};

const EmpireScalingContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();

  const scalingSections = [
    {
      id: 'team-building',
      title: 'Team Building & Management',
      description: 'Build and manage a team to scale your AI influencer empire',
      icon: <Users className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'Team Building Guide',
        description: 'Learn how to build and manage an effective team for your AI influencer empire',
        sections: [
          {
            title: 'Team Structure & Roles',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create an efficient team structure to manage multiple AI influencer accounts.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Roles:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Content Strategy Directors</li>
                  <li>AI Prompt Engineers</li>
                  <li>Platform Specialists</li>
                  <li>Analytics & Growth Managers</li>
                </ul>
              </div>
            ),
            resources: [
              {
                title: 'Team Structure Templates',
                url: 'https://acadium.com/resources/team-structure'
              },
              {
                title: 'Hiring Guide',
                url: 'https://acadium.com/resources/hiring-guide'
              }
            ]
          }
        ]
      }
    },
    {
      id: 'automation-systems',
      title: 'Advanced Automation Systems',
      description: 'Implement sophisticated automation for scalable operations',
      icon: <Zap className="h-6 w-6" />,
      color: 'yellow' as const,
      overlayContent: {
        title: 'Advanced Automation Guide',
        description: 'Master advanced automation techniques for scaling your AI influencer empire',
        sections: [
          {
            title: 'Automation Architecture',
            color: 'yellow' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build sophisticated automation systems to manage multiple AI influencers efficiently.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Components:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Content Generation Pipelines</li>
                  <li>Cross-Platform Publishing Systems</li>
                  <li>Engagement Automation</li>
                  <li>Performance Monitoring</li>
                </ul>
              </div>
            ),
            resources: [
              {
                title: 'Automation Playbook',
                url: 'https://acadium.com/resources/automation-playbook'
              },
              {
                title: 'Tool Integration Guide',
                url: 'https://acadium.com/resources/tool-integration'
              }
            ]
          }
        ]
      }
    },
    {
      id: 'brand-partnerships',
      title: 'Brand Partnerships & Monetization',
      description: 'Scale revenue through strategic partnerships and diverse income streams',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'green' as const,
      overlayContent: {
        title: 'Partnership & Monetization Guide',
        description: 'Learn how to build profitable brand partnerships and diversify revenue streams',
        sections: [
          {
            title: 'Partnership Strategy',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Develop strategic partnerships and multiple revenue streams for sustainable growth.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Channels:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Brand Collaborations</li>
                  <li>Affiliate Marketing</li>
                  <li>Digital Products</li>
                  <li>Consulting Services</li>
                </ul>
              </div>
            ),
            resources: [
              {
                title: 'Partnership Guide',
                url: 'https://acadium.com/resources/partnership-guide'
              },
              {
                title: 'Revenue Optimization',
                url: 'https://acadium.com/resources/revenue-optimization'
              }
            ]
          }
        ]
      }
    },
    {
      id: 'growth-strategy',
      title: 'Growth Strategy & Expansion',
      description: 'Plan and execute strategic growth initiatives',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'blue' as const,
      overlayContent: {
        title: 'Growth Strategy Guide',
        description: 'Master the art of strategic growth and market expansion',
        sections: [
          {
            title: 'Growth Framework',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Develop and implement strategic growth initiatives for your AI influencer empire.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Growth Areas:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Market Expansion</li>
                  <li>New Platform Integration</li>
                  <li>Product Line Development</li>
                  <li>Community Building</li>
                </ul>
              </div>
            ),
            resources: [
              {
                title: 'Growth Strategy Playbook',
                url: 'https://acadium.com/resources/growth-strategy'
              },
              {
                title: 'Market Analysis Guide',
                url: 'https://acadium.com/resources/market-analysis'
              }
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scalingSections.map((section) => (
          <ClickableCard
            key={section.id}
            onClick={() => setActiveOverlay(section.id)}
            className={`relative overflow-hidden ${
              theme === 'gradient' ? 'hover:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="p-6">
              <div className={`inline-flex p-3 rounded-lg bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-600 dark:text-${section.color}-400 mb-4`}>
                {section.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {section.title}
              </h3>
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}>
                {section.description}
              </p>
            </div>
          </ClickableCard>
        ))}
      </div>

      {scalingSections.map((section) => (
        <GuideOverlay
          key={section.id}
          isOpen={activeOverlay === section.id}
          onClose={() => setActiveOverlay(null)}
          title={section.overlayContent.title}
          description={section.overlayContent.description}
          sections={section.overlayContent.sections}
        />
      ))}
    </div>
  );
};

export default AiInfluencer;
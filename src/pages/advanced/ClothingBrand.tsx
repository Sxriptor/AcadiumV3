import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GuideOverlay } from '../../components/shared/GuideOverlay';
import { ClickableCard } from '../../components/shared/ClickableCard';
import BrandSetup from './tabs/BrandSetup';
import EmailSms from './tabs/EmailSms';
import AiVideoAds from './tabs/AiVideoAds';
import { 
  Shirt, 
  Mail, 
  MessageSquare, 
  Video, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Zap,
  Target,
  ShoppingBag,
  Instagram,
  Youtube,
  Palette,
  Truck,
  Package,
  Star
} from 'lucide-react';

const ClothingBrand: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('brand-setup');
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const tabs = [
    { id: 'brand-setup', label: 'Brand Setup & Identity', icon: <Palette className="h-4 w-4" /> },
    { id: 'email-sms', label: 'Email/SMS Automation', icon: <Mail className="h-4 w-4" /> },
    { id: 'ai-video-ads', label: 'AI Video Ads', icon: <Video className="h-4 w-4" /> },
    { id: 'ai-influencers', label: 'AI Influencer Marketing', icon: <Users className="h-4 w-4" /> },
    { id: 'scaling', label: 'Scaling & Monetization', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'brand-setup':
        return <BrandSetupContent />;
      case 'email-sms':
        return <EmailSmsContent />;
      case 'ai-video-ads':
        return <AiVideoAdsContent />;
      case 'ai-influencers':
        return <AiInfluencersContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'scaling':
        return <ScalingContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      default:
        return <BrandSetupContent />;
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 to-rose-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-pink-200 mb-4">
            <Shirt className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">CLOTHING BRAND</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Build & Scale an Automated Clothing Brand
          </h1>
          
          <p className="text-pink-100 text-lg md:text-xl max-w-2xl mb-8">
            Complete system to create, market, and scale a profitable clothing brand 
            using AI-powered marketing and automation.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-pink-700 hover:bg-pink-50">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start Building
            </Button>
            
            <Button variant="outline" className="border-pink-300 text-white hover:bg-white/10">
              View Case Studies
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Potential Revenue",
            value: "$10K-50K/mo",
            icon: <DollarSign className="h-5 w-5" />,
            color: "green"
          },
          {
            label: "Time to First Sale",
            value: "14-30 Days",
            icon: <Zap className="h-5 w-5" />,
            color: "yellow"
          },
          {
            label: "Profit Margins",
            value: "40-70%",
            icon: <TrendingUp className="h-5 w-5" />,
            color: "blue"
          },
          {
            label: "Startup Cost",
            value: "$500-2,000",
            icon: <ShoppingBag className="h-5 w-5" />,
            color: "pink"
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
                  ? 'border-b-2 border-pink-500 text-pink-600 dark:text-pink-400'
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
      <Card className="bg-gradient-to-br from-pink-600 to-rose-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Launch Your Clothing Brand?
          </h3>
          <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
            Start building your automated clothing brand today with our proven system.
          </p>
          <Button className="bg-white text-pink-700 hover:bg-pink-50">
            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Tab Content Components
const BrandSetupContent: React.FC = () => {
  return <BrandSetup />;
};

const EmailSmsContent: React.FC = () => {
  return <EmailSms />;
};

const AiVideoAdsContent: React.FC = () => {
  return <AiVideoAds />;
};

const AiInfluencersContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const influencerSections = [
    {
      id: 'ai-creation',
      title: 'AI Influencer Creation',
      description: 'Build your own AI influencers to promote your clothing brand',
      icon: <Users className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'AI Influencer Creation Guide',
        description: 'Learn how to create compelling AI influencers for your clothing brand',
        sections: [
          {
            title: 'AI Personality Development',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create authentic AI personalities that resonate with your target audience and align with your brand values.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Development Areas:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Define personality traits and characteristics</li>
                  <li>Create a compelling backstory and lifestyle</li>
                  <li>Develop unique voice and communication style</li>
                  <li>Establish visual consistency and style preferences</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Personality Design
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Create unique personality traits
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Palette className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-pink-400' : 'text-pink-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Visual Identity
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Design consistent appearance
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <MessageSquare className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Voice & Tone
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Develop communication style
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'AI Character Development Guide', url: '#' },
              { title: 'Personality Framework Template', url: '#' }
            ],
            checklist: [
              'Define core personality traits',
              'Create detailed backstory',
              'Establish visual style guide',
              'Develop voice and tone guidelines'
            ]
          }
        ]
      }
    },
    {
      id: 'content-strategy',
      title: 'Content Strategy & Calendar',
      description: 'Develop a comprehensive content strategy for your AI influencers',
      icon: <Instagram className="h-6 w-6" />,
      color: 'orange' as const,
      overlayContent: {
        title: 'Content Strategy Guide',
        description: 'Create a systematic approach to content creation and scheduling',
        sections: [
          {
            title: 'Content Planning System',
            color: 'orange' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build a systematic content creation and scheduling process that maintains consistency and engagement.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Content Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Platform-specific content optimization</li>
                  <li>Seasonal and trending topic integration</li>
                  <li>Product showcase and lifestyle content balance</li>
                  <li>Community engagement and interaction posts</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Youtube className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Video Content
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Reels and video strategy
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Instagram className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-pink-400' : 'text-pink-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Social Posts
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Feed and story content
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Trend Integration
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Leverage trending topics
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Content Calendar Template', url: '#' },
              { title: 'Platform Best Practices Guide', url: '#' }
            ],
            checklist: [
              'Create 30-day content calendar',
              'Plan platform-specific content',
              'Set up content creation workflow',
              'Establish posting schedule'
            ]
          }
        ]
      }
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        AI Influencer Marketing
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Leverage AI-powered influencer strategies to amplify your brand reach and credibility.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {influencerSections.map((section) => (
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
      {influencerSections.map((section) => (
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
        <Button onClick={() => setActiveOverlay('ai-creation')}>
          Start AI Influencer Setup
        </Button>
      </div>
    </div>
  );
};

const ScalingContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const scalingSections = [
    {
      id: 'paid-advertising',
      title: 'Paid Advertising Scaling System',
      description: 'Implement a systematic approach to scaling paid advertising',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'green' as const,
      overlayContent: {
        title: 'Paid Advertising Scaling Guide',
        description: 'Master the art of scaling your advertising campaigns profitably',
        sections: [
          {
            title: 'Advanced Scaling Strategies',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Learn proven strategies to scale your advertising campaigns while maintaining profitability and ROAS.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Scaling Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Vertical scaling with budget optimization</li>
                  <li>Horizontal scaling across platforms and audiences</li>
                  <li>Creative testing and rotation strategies</li>
                  <li>Advanced attribution and tracking setup</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Vertical Scaling
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Increase ad spend efficiently
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Audience Expansion
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Reach new customer segments
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Creative Testing
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Optimize ad performance
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Scaling Playbook Template', url: '#' },
              { title: 'ROAS Calculator Tool', url: '#' }
            ],
            checklist: [
              'Set up proper attribution tracking',
              'Implement vertical scaling strategy',
              'Create horizontal expansion plan',
              'Establish creative testing workflow'
            ]
          }
        ]
      }
    },
    {
      id: 'product-expansion',
      title: 'Product Line Expansion',
      description: 'Strategically expand your product offerings for increased revenue',
      icon: <Package className="h-6 w-6" />,
      color: 'blue' as const,
      overlayContent: {
        title: 'Product Expansion Strategy',
        description: 'Learn how to strategically expand your product line for maximum growth',
        sections: [
          {
            title: 'Strategic Product Development',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Develop a systematic approach to expanding your product line based on data-driven insights and market demand.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Expansion Strategy:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Market research and trend analysis</li>
                  <li>Customer feedback and demand validation</li>
                  <li>Complementary product identification</li>
                  <li>Seasonal and limited edition strategies</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Package className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Product Research
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Identify winning products
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Customer Validation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Validate demand early
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Star className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Premium Lines
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        High-margin offerings
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Product Research Framework', url: '#' },
              { title: 'Market Analysis Template', url: '#' }
            ],
            checklist: [
              'Analyze current product performance',
              'Research market trends and gaps',
              'Validate new product concepts',
              'Plan product launch timeline'
            ]
          }
        ]
      }
    },
    {
      id: 'operations-optimization',
      title: 'Operations & Fulfillment Optimization',
      description: 'Scale your operations to handle increased order volume efficiently',
      icon: <Truck className="h-6 w-6" />,
      color: 'orange' as const,
      overlayContent: {
        title: 'Operations Scaling Guide',
        description: 'Optimize your operations for seamless scaling and customer satisfaction',
        sections: [
          {
            title: 'Operational Excellence Framework',
            color: 'orange' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build robust operational systems that can handle rapid growth while maintaining quality and efficiency.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Optimization Areas:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Automated inventory management systems</li>
                  <li>Strategic fulfillment partnerships</li>
                  <li>Customer service automation</li>
                  <li>Quality control and returns management</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Truck className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Fulfillment
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Streamline shipping process
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Automation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Automate key processes
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <CheckCircle className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Quality Control
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Maintain high standards
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Operations Optimization Guide', url: '#' },
              { title: 'Fulfillment Partner Directory', url: '#' }
            ],
            checklist: [
              'Audit current operational processes',
              'Implement inventory management system',
              'Establish fulfillment partnerships',
              'Set up automated customer service'
            ]
          }
        ]
      }
    },
    {
      id: 'revenue-optimization',
      title: 'Advanced Revenue Optimization',
      description: 'Implement advanced strategies to maximize customer lifetime value',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'yellow' as const,
      overlayContent: {
        title: 'Revenue Optimization Strategy',
        description: 'Advanced techniques to maximize revenue and customer lifetime value',
        sections: [
          {
            title: 'Customer Lifetime Value Maximization',
            color: 'yellow' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Implement sophisticated strategies to increase customer lifetime value and create sustainable revenue growth.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Strategies:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Tiered loyalty and rewards programs</li>
                  <li>Subscription and recurring revenue models</li>
                  <li>Premium product line development</li>
                  <li>Cross-selling and upselling automation</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Revenue Streams
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Diversify income sources
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Loyalty Programs
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Retain and reward customers
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Star className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Premium Offerings
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        High-value products & services
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'CLV Optimization Guide', url: '#' },
              { title: 'Loyalty Program Templates', url: '#' }
            ],
            checklist: [
              'Calculate current customer lifetime value',
              'Design loyalty program structure',
              'Develop premium product offerings',
              'Implement subscription model options'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        Scaling & Monetization
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Systematically scale your clothing brand to six and seven figures with these proven strategies.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scalingSections.map((section) => (
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
      {scalingSections.map((section) => (
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
        <Button onClick={() => setActiveOverlay('paid-advertising')}>
          Start Scaling Blueprint
        </Button>
      </div>
    </div>
  );
};

export default ClothingBrand;
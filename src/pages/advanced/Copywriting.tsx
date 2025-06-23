import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GuideOverlay } from '../../components/shared/GuideOverlay';
import { ClickableCard } from '../../components/shared/ClickableCard';
import { 
  FileText, 
  Target, 
  Zap, 
  Users, 
  DollarSign, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Briefcase,
  MessageSquare,
  Mail,
  Globe,
  PenTool,
  Brain,
  Search,
  Star,
  Settings,
  BarChart3
} from 'lucide-react';

const Copywriting: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('high-paying-niches');
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const tabs = [
    { id: 'high-paying-niches', label: 'High-Paying Niches', icon: <Target className="h-4 w-4" /> },
    { id: 'ai-writing-arsenal', label: 'AI Writing Arsenal', icon: <Zap className="h-4 w-4" /> },
    { id: 'client-systems', label: 'Client Systems & Funnels', icon: <Users className="h-4 w-4" /> },
    { id: 'premium-pricing', label: 'Premium Pricing Models', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'scaling', label: 'Scaling to 6-Figures', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'high-paying-niches':
        return <HighPayingNichesContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'ai-writing-arsenal':
        return <AiWritingArsenalContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'client-systems':
        return <ClientSystemsContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'premium-pricing':
        return <PremiumPricingContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'scaling':
        return <ScalingContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      default:
        return <HighPayingNichesContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-amber-200 mb-4">
            <FileText className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">AI COPYWRITING</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Build a Premium AI Copywriting Business
          </h1>
          
          <p className="text-amber-100 text-lg md:text-xl max-w-2xl mb-8">
            Complete system to create, market, and scale a profitable AI copywriting business
            with automated client acquisition and delivery systems.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-amber-700 hover:bg-amber-50">
              <PenTool className="mr-2 h-4 w-4" />
              Start Building
            </Button>
            
            <Button variant="outline" className="border-amber-300 text-white hover:bg-white/10">
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
            value: "$8K-30K/mo",
            icon: <DollarSign className="h-5 w-5" />,
            color: "green"
          },
          {
            label: "Time to First Client",
            value: "2-4 Weeks",
            icon: <Zap className="h-5 w-5" />,
            color: "yellow"
          },
          {
            label: "Profit Margins",
            value: "70-85%",
            icon: <TrendingUp className="h-5 w-5" />,
            color: "blue"
          },
          {
            label: "Startup Cost",
            value: "$100-500",
            icon: <FileText className="h-5 w-5" />,
            color: "amber"
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
                  ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400'
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
      <Card className="bg-gradient-to-br from-amber-500 to-yellow-600 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Launch Your AI Copywriting Business?
          </h3>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Start building your premium AI copywriting business today with our proven system.
          </p>
          <Button className="bg-white text-amber-700 hover:bg-amber-50">
            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Tab Content Components
const HighPayingNichesContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const nichesSections = [
    {
      id: 'financial-services',
      title: 'Financial Services Copywriting',
      description: 'High-ticket copywriting for financial products and services',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'green' as const,
      avgRate: '$1,500-5,000',
      overlayContent: {
        title: 'Financial Services Copywriting Guide',
        description: 'Master the art of writing compliance-friendly, high-converting copy for financial products',
        sections: [
          {
            title: 'Financial Copy Mastery',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Learn to write compelling financial copy that converts while staying compliant with regulations.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Specializations:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Investment platform landing pages</li>
                  <li>Compliance-approved email sequences</li>
                  <li>Lead generation funnels for wealth management</li>
                  <li>Educational content for complex financial products</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Lead Generation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        High-converting lead magnets
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <CheckCircle className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Compliance
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Regulatory-approved copy
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Premium Rates
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        $1,500-5,000 per project
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Financial Copy Compliance Guide', url: '#' },
              { title: 'Investment Platform Templates', url: '#' }
            ],
            checklist: [
              'Research financial regulations and compliance requirements',
              'Build portfolio of financial copy samples',
              'Network with financial advisors and fintech companies',
              'Create specialized pricing packages for financial services'
            ]
          }
        ]
      }
    },
    {
      id: 'saas-tech',
      title: 'SaaS & Tech Copywriting',
      description: 'Premium copywriting for software and technology companies',
      icon: <Brain className="h-6 w-6" />,
      color: 'blue' as const,
      avgRate: '$2,000-7,500',
      overlayContent: {
        title: 'SaaS & Tech Copywriting Guide',
        description: 'Specialize in translating complex technical concepts into compelling copy',
        sections: [
          {
            title: 'Technical Copy Excellence',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Master the skill of making complex software simple and compelling for target audiences.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Core Competencies:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>B2B SaaS landing page optimization</li>
                  <li>Technical feature explanations made simple</li>
                  <li>Customer success story development</li>
                  <li>Email sequence automation for trials and conversions</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Brain className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Technical Translation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Complex to simple messaging
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        B2B Focus
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Enterprise-level messaging
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart3 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Case Studies
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Results-driven storytelling
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'SaaS Copy Framework', url: '#' },
              { title: 'Technical Writing Templates', url: '#' }
            ],
            checklist: [
              'Learn key SaaS industry terminology and trends',
              'Build portfolio with B2B technology samples',
              'Develop relationships with SaaS marketing teams',
              'Create specialized packages for different SaaS verticals'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        High-Paying Niches
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Identify and target the most profitable copywriting niches with high demand and premium pricing potential.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nichesSections.map((section) => (
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {section.title}
                </h3>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                    {section.avgRate}
                  </span>
                </div>
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
      {nichesSections.map((section) => (
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
        <Button onClick={() => setActiveOverlay('financial-services')}>
          Start Niche Research
        </Button>
      </div>
    </div>
  );
};

const AiWritingArsenalContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const arsenalSections = [
    {
      id: 'core-ai-tools',
      title: 'Core AI Writing Tools',
      description: 'Essential AI tools for professional copywriting services',
      icon: <Brain className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'AI Writing Tools Mastery',
        description: 'Build your professional AI writing toolkit for maximum efficiency and quality',
        sections: [
          {
            title: 'Essential AI Tool Setup',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Learn to leverage cutting-edge AI tools to create professional-quality copy at scale.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Core AI Stack:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>GPT-4 with custom instructions for copywriting tasks</li>
                  <li>Claude for long-form content and creative ideation</li>
                  <li>Specialized tools like Jasper or Copy.ai for specific formats</li>
                  <li>Integration workflows for seamless content creation</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Brain className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        AI Tool Setup
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Configure professional AI stack
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Workflow Integration
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Seamless AI integration
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Settings className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Custom Instructions
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Optimize AI performance
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'AI Tool Setup Guide', url: '#' },
              { title: 'Custom Instructions Library', url: '#' }
            ],
            checklist: [
              'Set up premium AI tool subscriptions',
              'Configure custom instructions for each tool',
              'Create workflow templates for common tasks',
              'Test and optimize AI tool performance'
            ]
          }
        ]
      }
    },
    {
      id: 'prompt-engineering',
      title: 'Custom Prompt Engineering',
      description: 'Develop proprietary prompts for superior AI-generated copy',
      icon: <Settings className="h-6 w-6" />,
      color: 'orange' as const,
      overlayContent: {
        title: 'Prompt Engineering Mastery',
        description: 'Create powerful prompts that generate professional-quality copy consistently',
        sections: [
          {
            title: 'Advanced Prompt Creation',
            color: 'orange' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Master the art of prompt engineering to create consistently high-quality copywriting outputs.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Prompt Engineering Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Specialized prompts for different copywriting formats</li>
                  <li>Multi-step prompting systems for complex projects</li>
                  <li>Industry-specific prompt libraries</li>
                  <li>A/B testing frameworks for prompt optimization</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <FileText className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Format Prompts
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Emails, ads, sales pages
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Industry Specific
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Niche-optimized prompts
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart3 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Testing & Optimization
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Continuous improvement
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Prompt Engineering Handbook', url: '#' },
              { title: 'Industry Prompt Templates', url: '#' }
            ],
            checklist: [
              'Build core prompt library for all major formats',
              'Create industry-specific prompt variations',
              'Implement prompt testing and optimization system',
              'Document and organize prompt library effectively'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        AI Writing Arsenal
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Build a comprehensive toolkit of AI writing tools and systems for efficient, high-quality content creation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {arsenalSections.map((section) => (
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
      {arsenalSections.map((section) => (
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
        <Button onClick={() => setActiveOverlay('core-ai-tools')}>
          Start AI Setup
        </Button>
      </div>
    </div>
  );
};

const ClientSystemsContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const clientSystemsSections = [
    {
      id: 'client-acquisition',
      title: 'Client Acquisition Funnel',
      description: 'Create a systematic approach to attracting ideal clients',
      icon: <Users className="h-6 w-6" />,
      color: 'blue' as const,
      overlayContent: {
        title: 'Client Acquisition System',
        description: 'Build automated systems to attract and convert high-paying copywriting clients',
        sections: [
          {
            title: 'Automated Client Acquisition',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Develop systems that consistently attract and qualify high-value copywriting clients on autopilot.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Client Funnel Components:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Niche-specific lead magnets and content marketing</li>
                  <li>Automated webinar or case study presentations</li>
                  <li>Client qualification and discovery systems</li>
                  <li>CRM integration and follow-up automation</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Lead Generation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Attract qualified prospects
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Client Qualification
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Filter for ideal clients
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
                        Hands-off client flow
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Client Acquisition Blueprint', url: '#' },
              { title: 'CRM Setup Guide', url: '#' }
            ],
            checklist: [
              'Create niche-specific lead magnets',
              'Set up automated webinar or presentation system',
              'Implement client qualification questionnaire',
              'Configure CRM and follow-up automation'
            ]
          }
        ]
      }
    },
    {
      id: 'sales-conversion',
      title: 'Sales & Conversion System',
      description: 'Convert prospects into high-paying clients consistently',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'green' as const,
      overlayContent: {
        title: 'Sales Conversion Mastery',
        description: 'Master the art of converting prospects into premium copywriting clients',
        sections: [
          {
            title: 'High-Converting Sales Process',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build a systematic sales process that consistently converts qualified prospects into high-value clients.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Sales Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Structured discovery and needs assessment calls</li>
                  <li>Value-based proposal creation and presentation</li>
                  <li>Objection handling and negotiation strategies</li>
                  <li>Contract templates and onboarding automation</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <MessageSquare className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Discovery Calls
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Structured sales conversations
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <FileText className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Proposal System
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Value-focused proposals
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <CheckCircle className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Close & Onboard
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Seamless client onboarding
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Sales Call Scripts', url: '#' },
              { title: 'Proposal Templates', url: '#' }
            ],
            checklist: [
              'Develop discovery call framework and scripts',
              'Create value-based proposal templates',
              'Build objection handling playbook',
              'Set up automated onboarding sequence'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        Client Systems & Funnels
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Build automated systems to attract, convert, and retain high-paying copywriting clients.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clientSystemsSections.map((section) => (
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
      {clientSystemsSections.map((section) => (
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
        <Button onClick={() => setActiveOverlay('client-acquisition')}>
          Start Client System Setup
        </Button>
      </div>
    </div>
  );
};

const PremiumPricingContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const pricingSections = [
    {
      id: 'value-based-pricing',
      title: 'Value-Based Pricing Strategy',
      description: 'Price based on the value delivered rather than time spent',
      icon: <Star className="h-6 w-6" />,
      color: 'yellow' as const,
      example: '$5,000-15,000',
      overlayContent: {
        title: 'Value-Based Pricing Mastery',
        description: 'Learn to price your copywriting services based on value delivered, not time spent',
        sections: [
          {
            title: 'Strategic Value Pricing',
            color: 'yellow' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Master the art of value-based pricing to command premium rates and increase profitability.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Value Pricing Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Value assessment frameworks for different client types</li>
                  <li>ROI calculators to demonstrate potential returns</li>
                  <li>Tiered pricing based on projected business impact</li>
                  <li>Case studies and proof of value documentation</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart3 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Value Assessment
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Calculate client value potential
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        ROI Calculation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Demonstrate return on investment
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Premium Positioning
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Command higher rates
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Value Assessment Framework', url: '#' },
              { title: 'ROI Calculator Templates', url: '#' }
            ],
            checklist: [
              'Develop value assessment methodology',
              'Create ROI calculation tools',
              'Build case study library',
              'Implement tiered pricing structure'
            ]
          }
        ]
      }
    },
    {
      id: 'retainer-models',
      title: 'Retainer Model Implementation',
      description: 'Create predictable income through monthly retainer arrangements',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'green' as const,
      example: '$3,000-10,000/mo',
      overlayContent: {
        title: 'Retainer Model Mastery',
        description: 'Build sustainable recurring revenue through strategic retainer arrangements',
        sections: [
          {
            title: 'Retainer Strategy & Implementation',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create predictable monthly income through well-structured retainer agreements that provide ongoing value to clients.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Retainer Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Tiered retainer packages with clear deliverables</li>
                  <li>Value-add components to justify premium pricing</li>
                  <li>ROI reporting systems to demonstrate ongoing value</li>
                  <li>Flexible scope management and boundary setting</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Package Design
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Structure compelling retainers
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart3 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        ROI Reporting
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Demonstrate ongoing value
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Settings className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Scope Management
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Maintain boundaries
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Retainer Package Templates', url: '#' },
              { title: 'ROI Reporting Dashboard', url: '#' }
            ],
            checklist: [
              'Design tiered retainer packages',
              'Create value-add components',
              'Set up ROI tracking systems',
              'Implement scope management processes'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        Premium Pricing Models
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Implement strategic pricing models to maximize revenue and position your services as premium.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pricingSections.map((section) => (
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {section.title}
                </h3>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                    {section.example}
                  </span>
                </div>
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
      {pricingSections.map((section) => (
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
        <Button onClick={() => setActiveOverlay('value-based-pricing')}>
          Start Pricing Strategy
        </Button>
      </div>
    </div>
  );
};

const ScalingContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const scalingSections = [
    {
      id: 'team-building',
      title: 'Team Building & Delegation',
      description: 'Scale beyond yourself with strategic hiring and team building',
      icon: <Users className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'Team Building & Scaling',
        description: 'Build and manage a team to scale your copywriting business beyond your personal capacity',
        sections: [
          {
            title: 'Strategic Team Development',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build a high-performing team that allows you to scale your copywriting business while maintaining quality and profitability.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Team Building Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Key roles identification and hiring strategies</li>
                  <li>Comprehensive SOPs and process documentation</li>
                  <li>Training systems and quality control processes</li>
                  <li>Performance management and team coordination</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Strategic Hiring
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Build your dream team
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Settings className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Process Systems
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Document and systematize
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Scale Operations
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Multiply your capacity
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Hiring Framework Guide', url: '#' },
              { title: 'SOP Templates Library', url: '#' }
            ],
            checklist: [
              'Identify key roles for delegation',
              'Create detailed hiring criteria and processes',
              'Document all operational procedures',
              'Implement training and quality control systems'
            ]
          }
        ]
      }
    },
    {
      id: 'revenue-optimization',
      title: 'Revenue Optimization & Growth',
      description: 'Maximize revenue through strategic business development',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'green' as const,
      overlayContent: {
        title: 'Revenue Optimization Strategy',
        description: 'Implement advanced strategies to optimize and scale your copywriting business revenue',
        sections: [
          {
            title: 'Advanced Revenue Scaling',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Master advanced strategies to optimize revenue streams and scale your business to six figures and beyond.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Optimization Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Multiple revenue streams development</li>
                  <li>Client lifetime value optimization</li>
                  <li>Passive income product creation</li>
                  <li>Strategic partnerships and referral systems</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
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
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Client Value
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Maximize lifetime value
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Passive Income
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Create scalable products
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Revenue Optimization Playbook', url: '#' },
              { title: 'Passive Income Product Templates', url: '#' }
            ],
            checklist: [
              'Analyze current revenue streams and identify gaps',
              'Develop additional income sources',
              'Create passive income products and courses',
              'Build strategic partnership network'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        Scaling to 6-Figures
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Implement strategic systems to scale your AI copywriting business to six figures and beyond.
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
        <Button onClick={() => setActiveOverlay('team-building')}>
          Start Scaling Strategy
        </Button>
      </div>
    </div>
  );
};

export default Copywriting;
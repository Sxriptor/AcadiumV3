import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GuideOverlay } from '../../components/shared/GuideOverlay';
import { ClickableCard } from '../../components/shared/ClickableCard';
import { 
  Zap, 
  Package, 
  Users, 
  Repeat, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  DollarSign,
  Target,
  Briefcase,
  BarChart2,
  Calendar,
  Settings,
  Search,
  Globe,
  Bot,
  Workflow,
  Database,
  FileText,
  ShoppingCart,
  MessageSquare,
  Bell,
  Shield
} from 'lucide-react';

const AutomationAgency: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('service-packages');
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const tabs = [
    { id: 'service-packages', label: 'High-Value Service Packages', icon: <Package className="h-4 w-4" /> },
    { id: 'client-acquisition', label: 'B2B Client Acquisition', icon: <Users className="h-4 w-4" /> },
    { id: 'service-delivery', label: 'Automated Service Delivery', icon: <Zap className="h-4 w-4" /> },
    { id: 'recurring-revenue', label: 'Recurring Revenue Models', icon: <Repeat className="h-4 w-4" /> },
    { id: 'team-scaling', label: 'Team & Systems Scaling', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'service-packages':
        return <ServicePackagesContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'client-acquisition':
        return <ClientAcquisitionContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'service-delivery':
        return <ServiceDeliveryContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'recurring-revenue':
        return <RecurringRevenueContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      case 'team-scaling':
        return <TeamScalingContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
      default:
        return <ServicePackagesContent activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />;
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-green-200 mb-4">
            <Zap className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">AUTOMATION AGENCY</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Build a Profitable Automation Agency
          </h1>
          
          <p className="text-green-100 text-lg md:text-xl max-w-2xl mb-8">
            Complete system to create, market, and scale a high-ticket automation agency
            with recurring revenue and automated service delivery.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-green-700 hover:bg-green-50">
              <Briefcase className="mr-2 h-4 w-4" />
              Start Building
            </Button>
            
            <Button variant="outline" className="border-green-300 text-white hover:bg-white/10">
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
            value: "$20K-100K/mo",
            icon: <DollarSign className="h-5 w-5" />,
            color: "green"
          },
          {
            label: "Time to First Client",
            value: "2-4 Weeks",
            icon: <Calendar className="h-5 w-5" />,
            color: "blue"
          },
          {
            label: "Profit Margins",
            value: "60-80%",
            icon: <BarChart2 className="h-5 w-5" />,
            color: "purple"
          },
          {
            label: "Startup Cost",
            value: "$500-2,000",
            icon: <Briefcase className="h-5 w-5" />,
            color: "emerald"
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
                  ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
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
      <Card className="bg-gradient-to-br from-green-600 to-emerald-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Launch Your Automation Agency?
          </h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Start building your high-ticket automation agency today with our proven system.
          </p>
          <Button className="bg-white text-green-700 hover:bg-green-50">
            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Tab Content Components
const ServicePackagesContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const servicePackagesSections = [
    {
      id: 'business-process-automation',
      title: 'Business Process Automation',
      description: 'Comprehensive automation of core business processes',
      icon: <Workflow className="h-6 w-6" />,
      color: 'blue' as const,
      pricing: '$5,000-25,000',
      overlayContent: {
        title: 'Business Process Automation Guide',
        description: 'Master the creation of comprehensive business process automation solutions',
        sections: [
          {
            title: 'Process Automation Framework',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Learn to identify, analyze, and automate core business processes that deliver maximum ROI for clients.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Automation Areas:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Lead qualification and CRM automation</li>
                  <li>Customer onboarding workflow automation</li>
                  <li>Inventory and order management systems</li>
                  <li>Financial reporting and invoicing automation</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Workflow className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Process Mapping
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Identify automation opportunities
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Settings className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Implementation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Build scalable automation
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart2 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        ROI Tracking
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Measure automation impact
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Process Automation Audit Template', url: '#' },
              { title: 'ROI Calculator Worksheet', url: '#' }
            ],
            checklist: [
              'Conduct comprehensive process audit for client',
              'Identify high-impact automation opportunities',
              'Create detailed automation implementation plan',
              'Set up ROI tracking and reporting systems'
            ]
          }
        ]
      }
    },
    {
      id: 'sales-marketing-automation',
      title: 'Sales & Marketing Automation',
      description: 'End-to-end sales and marketing automation systems',
      icon: <Target className="h-6 w-6" />,
      color: 'green' as const,
      pricing: '$8,000-40,000',
      overlayContent: {
        title: 'Sales & Marketing Automation Suite',
        description: 'Build comprehensive sales and marketing automation systems that drive revenue growth',
        sections: [
          {
            title: 'Revenue-Driving Automation',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create sophisticated sales and marketing automation systems that generate qualified leads and drive conversions.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Automation Components:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Lead scoring and qualification automation</li>
                  <li>Multi-channel marketing campaign automation</li>
                  <li>Sales pipeline and follow-up automation</li>
                  <li>Customer segmentation and personalization</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Lead Generation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Automated lead capture & qualification
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Sales Pipeline
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Automated follow-up sequences
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Revenue Growth
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Conversion optimization
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Sales Automation Blueprint', url: '#' },
              { title: 'Marketing Automation Templates', url: '#' }
            ],
            checklist: [
              'Map entire customer journey and touchpoints',
              'Design lead scoring and qualification system',
              'Build multi-channel marketing automation',
              'Implement sales pipeline automation and tracking'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        High-Value Service Packages
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Create premium automation service packages that command high fees and deliver exceptional value.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicePackagesSections.map((section) => (
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
                    {section.pricing}
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
      {servicePackagesSections.map((section) => (
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
        <Button onClick={() => setActiveOverlay('business-process-automation')}>
          Start Package Development
        </Button>
      </div>
    </div>
  );
};

const ClientAcquisitionContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const clientAcquisitionSections = [
    {
      id: 'targeted-outreach',
      title: 'Targeted Outreach System',
      description: 'Systematic approach to identifying and contacting ideal clients',
      icon: <Search className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'B2B Outreach Mastery',
        description: 'Build systematic outreach processes that consistently generate qualified leads',
        sections: [
          {
            title: 'Strategic B2B Outreach',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Develop systematic outreach processes that generate consistent, high-quality leads for your automation agency.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Outreach Framework:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Ideal client profile and targeting criteria development</li>
                  <li>LinkedIn automation for connection and engagement</li>
                  <li>Personalized outreach sequences with value-first approach</li>
                  <li>Meeting scheduling and qualification automation</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Search className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Prospect Research
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Identify ideal clients systematically
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Outreach Automation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Scale personalized outreach
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Calendar className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Meeting Booking
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Automated scheduling and qualification
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'B2B Outreach Templates', url: '#' },
              { title: 'LinkedIn Automation Guide', url: '#' }
            ],
            checklist: [
              'Define ideal client profile and targeting criteria',
              'Set up LinkedIn automation tools and sequences',
              'Create personalized outreach message templates',
              'Implement meeting scheduling and qualification system'
            ]
          }
        ]
      }
    },
    {
      id: 'authority-positioning',
      title: 'Authority Positioning Strategy',
      description: 'Position yourself as an automation expert in your target market',
      icon: <Globe className="h-6 w-6" />,
      color: 'orange' as const,
      overlayContent: {
        title: 'Authority Building Strategy',
        description: 'Establish yourself as the go-to automation expert in your target market',
        sections: [
          {
            title: 'Expert Authority Development',
            color: 'orange' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build credibility and authority that positions you as the preferred automation expert for high-value clients.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Authority Building Elements:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Industry-specific case studies and success stories</li>
                  <li>Thought leadership content for LinkedIn and publications</li>
                  <li>Systematic testimonial and social proof gathering</li>
                  <li>Professional website with clear service offerings and results</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Globe className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Content Strategy
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Thought leadership content
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart2 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Case Studies
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Showcase proven results
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <CheckCircle className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Social Proof
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Build credibility and trust
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Authority Building Playbook', url: '#' },
              { title: 'Case Study Template', url: '#' }
            ],
            checklist: [
              'Create industry-specific case studies',
              'Develop content calendar for thought leadership',
              'Build systematic testimonial collection process',
              'Launch professional website with clear positioning'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        B2B Client Acquisition
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Implement proven systems to attract and convert high-value B2B clients for your automation agency.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clientAcquisitionSections.map((section) => (
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
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  {section.description}
                </p>
              </div>
            </div>
          </ClickableCard>
        ))}
      </div>

      {/* Guide Overlays */}
      {clientAcquisitionSections.map((section) => (
        <GuideOverlay
          key={`overlay-${section.id}`}
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

const ServiceDeliveryContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const serviceDeliverySections = [
    {
      id: 'client-onboarding-automation',
      title: 'Client Onboarding Automation',
      description: 'Streamlined process for bringing on new clients efficiently with minimal manual intervention',
      icon: <Users className="h-6 w-6" />,
      color: 'blue' as const,
      overlayContent: {
        title: 'Automated Client Onboarding System',
        description: 'Create seamless onboarding experiences that impress clients and reduce operational overhead',
        sections: [
          {
            title: 'Complete Onboarding Automation',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build sophisticated onboarding automation that creates a professional first impression while gathering all necessary project information.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Onboarding Workflow Components:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Automated welcome sequences with branded resources and next steps</li>
                  <li>Digital contract signing with DocuSign or PandaDoc integration</li>
                  <li>Intelligent client intake questionnaires with conditional logic</li>
                  <li>Automated project setup in management tools (Asana, Monday.com)</li>
                  <li>Calendar scheduling for kickoff meetings with automated reminders</li>
                  <li>Slack or Teams workspace creation for client communication</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <FileText className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Contract Automation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Generate and send contracts automatically based on project scope
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Calendar className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Meeting Scheduling
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Automated kickoff meeting scheduling with preparation materials
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Client Onboarding Checklist Template', url: '#' },
              { title: 'Automated Welcome Email Sequences', url: '#' }
            ],
            checklist: [
              'Set up automated welcome email sequences',
              'Integrate digital contract signing tools',
              'Create intelligent intake questionnaires',
              'Configure project management automation',
              'Test complete onboarding workflow'
            ]
          }
        ]
      }
    },
    {
      id: 'workflow-templates',
      title: 'Standardized Workflow Templates',
      description: 'Reusable workflow templates for common automation projects across different industries',
      icon: <Workflow className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'Modular Workflow Template System',
        description: 'Build a library of reusable automation templates that accelerate project delivery',
        sections: [
          {
            title: 'Template-Based Delivery System',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Develop modular workflow templates that can be quickly customized and deployed for different client needs.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Template Categories:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Lead generation and nurturing automation templates</li>
                  <li>E-commerce order processing and fulfillment workflows</li>
                  <li>Customer support ticket routing and escalation</li>
                  <li>Content creation and social media automation</li>
                  <li>Data synchronization between business systems</li>
                  <li>Invoice generation and payment processing automation</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <ShoppingCart className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        E-commerce Templates
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Order processing, inventory, fulfillment
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Lead Generation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Capture, qualify, and nurture prospects
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <MessageSquare className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Customer Support
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Ticket routing, responses, escalation
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Workflow Template Library', url: '#' },
              { title: 'Customization Guide', url: '#' }
            ],
            checklist: [
              'Develop industry-specific workflow templates',
              'Create standardized testing procedures',
              'Implement version control for templates',
              'Build customization documentation',
              'Establish template approval process'
            ]
          }
        ]
      }
    },
    {
      id: 'communication-systems',
      title: 'Client Communication Systems',
      description: 'Efficient client communication with minimal manual intervention and maximum transparency',
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'green' as const,
      overlayContent: {
        title: 'Automated Communication Framework',
        description: 'Keep clients informed and engaged throughout the project lifecycle with minimal manual effort',
        sections: [
          {
            title: 'Communication Automation Strategy',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create systematic communication that keeps clients informed, builds trust, and reduces support overhead.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Communication Components:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Automated progress updates triggered by milestone completion</li>
                  <li>Client portal with real-time project status and documentation</li>
                  <li>Templated responses for common questions and scenarios</li>
                  <li>Escalation protocols for urgent issues and scope changes</li>
                  <li>Weekly/monthly summary reports with key metrics</li>
                  <li>Post-project success stories and optimization recommendations</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Globe className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Client Portal
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Self-service access to project information and resources
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Bell className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Smart Notifications
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Automated updates based on project milestones
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Client Communication Templates', url: '#' },
              { title: 'Portal Setup Guide', url: '#' }
            ],
            checklist: [
              'Set up automated progress notifications',
              'Create client portal with project dashboard',
              'Develop response templates for common inquiries',
              'Implement escalation protocols',
              'Test communication workflow end-to-end'
            ]
          }
        ]
      }
    },
    {
      id: 'quality-assurance',
      title: 'Quality Assurance Framework',
      description: 'Systematic approach to ensuring high-quality deliverables and client satisfaction',
      icon: <Shield className="h-6 w-6" />,
      color: 'orange' as const,
      overlayContent: {
        title: 'Comprehensive Quality System',
        description: 'Implement systematic quality assurance that catches issues before they reach clients',
        sections: [
          {
            title: 'Multi-Layer Quality Assurance',
            color: 'orange' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build robust quality assurance processes that ensure consistent, high-quality deliverables for every client project.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Quality Assurance Layers:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Automated testing for all workflow components and integrations</li>
                  <li>Peer review processes for complex implementations</li>
                  <li>Client acceptance testing and feedback incorporation</li>
                  <li>Performance monitoring and optimization recommendations</li>
                  <li>Documentation review and completeness verification</li>
                  <li>Post-deployment monitoring and issue resolution</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Shield className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Automated Testing
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Systematic workflow validation
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Peer Review
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Expert validation process
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart2 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Performance Monitoring
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Continuous optimization
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'QA Checklist Template', url: '#' },
              { title: 'Testing Procedures Guide', url: '#' }
            ],
            checklist: [
              'Create standardized testing procedures',
              'Implement automated monitoring systems',
              'Establish peer review protocols',
              'Develop client approval workflows',
              'Set up post-deployment monitoring'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        Automated Service Delivery
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Build scalable service delivery systems that minimize manual work while maximizing client value.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {serviceDeliverySections.map((section) => (
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
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  {section.description}
                </p>
              </div>
            </div>
          </ClickableCard>
        ))}
      </div>

      {/* Guide Overlays */}
      {serviceDeliverySections.map((section) => (
        <GuideOverlay
          key={`overlay-${section.id}`}
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

const RecurringRevenueContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const recurringRevenueSections = [
    {
      id: 'managed-automation-services',
      title: 'Managed Automation Services',
      description: 'Ongoing management and optimization of client automation systems for predictable monthly revenue',
      icon: <Settings className="h-6 w-6" />,
      color: 'blue' as const,
      pricing: '$1,000-5,000/month',
      overlayContent: {
        title: 'Managed Automation Services Framework',
        description: 'Build recurring revenue through ongoing automation management and optimization services',
        sections: [
          {
            title: 'Complete Managed Services Strategy',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create systematic managed services that provide ongoing value while generating predictable monthly recurring revenue.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Managed Service Components:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>24/7 automation monitoring and proactive maintenance</li>
                  <li>Monthly optimization reports with performance insights</li>
                  <li>Quarterly business reviews and strategic planning sessions</li>
                  <li>Priority support and issue resolution</li>
                  <li>Regular software updates and security patches</li>
                  <li>Capacity planning and scalability recommendations</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart2 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Performance Monitoring
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Real-time tracking and optimization
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Settings className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Proactive Maintenance
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Prevent issues before they occur
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Continuous Optimization
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Ongoing performance improvements
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Managed Services Contract Templates', url: '#' },
              { title: 'SLA Framework Guide', url: '#' }
            ],
            checklist: [
              'Define service level agreements and deliverables',
              'Set up monitoring and alerting systems',
              'Create monthly reporting templates',
              'Establish escalation and support procedures',
              'Develop pricing tiers for different service levels'
            ]
          }
        ]
      }
    },
    {
      id: 'automation-as-a-service',
      title: 'Automation-as-a-Service (AaaS)',
      description: 'Subscription-based access to industry-specific automation solutions with scalable pricing',
      icon: <Repeat className="h-6 w-6" />,
      color: 'purple' as const,
      pricing: '$500-3,000/month',
      overlayContent: {
        title: 'AaaS Business Model Framework',
        description: 'Create scalable subscription-based automation services for predictable growth',
        sections: [
          {
            title: 'Subscription Automation Platform',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build subscription-based automation services that can scale to serve multiple clients simultaneously.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AaaS Platform Features:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Multi-tenant automation platform with client isolation</li>
                  <li>Self-service configuration and customization options</li>
                  <li>Usage-based pricing tiers with automatic scaling</li>
                  <li>API integrations for easy client system connections</li>
                  <li>White-label options for partner and reseller programs</li>
                  <li>Comprehensive analytics and reporting dashboards</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Database className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Multi-Tenant Platform
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Scalable architecture for multiple clients
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Usage-Based Pricing
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Flexible pricing that scales with usage
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'AaaS Platform Architecture Guide', url: '#' },
              { title: 'Subscription Pricing Strategies', url: '#' }
            ],
            checklist: [
              'Design multi-tenant platform architecture',
              'Develop self-service configuration interface',
              'Implement usage tracking and billing systems',
              'Create API documentation and integration guides',
              'Set up customer onboarding automation'
            ]
          }
        ]
      }
    },
    {
      id: 'strategic-advisory-retainers',
      title: 'Strategic Advisory Retainers',
      description: 'High-value monthly retainers for ongoing automation strategy and digital transformation guidance',
      icon: <Target className="h-6 w-6" />,
      color: 'green' as const,
      pricing: '$2,500-10,000/month',
      overlayContent: {
        title: 'Strategic Advisory Services',
        description: 'Position yourself as a strategic automation advisor for enterprise clients',
        sections: [
          {
            title: 'Executive Advisory Framework',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Provide high-level strategic guidance that commands premium pricing and builds long-term client relationships.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advisory Service Components:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Monthly strategic planning and roadmapping sessions</li>
                  <li>Automation maturity assessments and gap analysis</li>
                  <li>Technology vendor evaluation and selection guidance</li>
                  <li>Change management and organizational transformation support</li>
                  <li>Executive briefings and board-level reporting</li>
                  <li>Industry benchmarking and competitive analysis</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Strategic Planning
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Long-term automation roadmaps
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart2 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Maturity Assessment
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Current state analysis and improvement areas
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Change Management
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Organizational transformation support
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Authority Building Playbook', url: '#' },
              { title: 'Case Study Template', url: '#' }
            ],
            checklist: [
              'Create industry-specific case studies',
              'Develop content calendar for thought leadership',
              'Build systematic testimonial collection process',
              'Launch professional website with clear positioning'
            ]
          }
        ]
      }
    },
    {
      id: 'success-based-revenue-share',
      title: 'Success-Based Revenue Share',
      description: 'Performance-based revenue models tied to measurable client outcomes and ROI',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'orange' as const,
      pricing: 'Base + 5-15% of savings',
      overlayContent: {
        title: 'Performance-Based Revenue Models',
        description: 'Create win-win arrangements that align your success with client outcomes',
        sections: [
          {
            title: 'Outcome-Based Pricing Strategy',
            color: 'orange' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build revenue models that tie your compensation directly to the measurable value you create for clients.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Share Components:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Baseline fees covering implementation and maintenance costs</li>
                  <li>Performance bonuses tied to specific KPI improvements</li>
                  <li>Revenue sharing based on incremental sales or cost savings</li>
                  <li>Long-term partnership agreements with equity components</li>
                  <li>Transparent tracking and attribution systems</li>
                  <li>Risk mitigation strategies and protection clauses</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Performance Tracking
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Measurable KPIs and attribution
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Shield className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Risk Management
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Protected baseline and caps
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Performance Contract Templates', url: '#' },
              { title: 'ROI Calculation Framework', url: '#' }
            ],
            checklist: [
              'Define measurable performance metrics',
              'Create transparent tracking systems',
              'Develop hybrid pricing models',
              'Establish attribution methodologies',
              'Build risk mitigation strategies'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        Recurring Revenue Models
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Build predictable monthly revenue with high-value automation services.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recurringRevenueSections.map((section) => (
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
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  {section.description}
                </p>
              </div>
            </div>
          </ClickableCard>
        ))}
      </div>

      {/* Guide Overlays */}
      {recurringRevenueSections.map((section) => (
        <GuideOverlay
          key={`overlay-${section.id}`}
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

const TeamScalingContent: React.FC<{ activeOverlay: string | null; setActiveOverlay: React.Dispatch<React.SetStateAction<string | null>> }> = ({ activeOverlay, setActiveOverlay }) => {
  const { theme } = useTheme();
  
  const teamScalingSections = [
    {
      id: 'team-structure-roles',
      title: 'Team Structure & Strategic Roles',
      description: 'Build an effective organizational structure with clearly defined roles and responsibilities',
      icon: <Users className="h-6 w-6" />,
      color: 'blue' as const,
      overlayContent: {
        title: 'Agency Team Structure Framework',
        description: 'Design a scalable team structure that supports growth from startup to enterprise',
        sections: [
          {
            title: 'Strategic Team Building',
            color: 'blue' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create a team structure that scales efficiently while maintaining quality and client satisfaction at every growth stage.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Team Roles:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Automation Engineers - Build and implement workflow solutions</li>
                  <li>Business Analysts - Analyze client processes and requirements</li>
                  <li>Project Managers - Coordinate delivery and client communication</li>
                  <li>Account Managers - Maintain relationships and identify growth opportunities</li>
                  <li>Sales Development Representatives - Generate and qualify leads</li>
                  <li>Quality Assurance Specialists - Ensure deliverable standards</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Bot className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Technical Team
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Engineers and analysts building solutions
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Briefcase className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Client Success
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Account and project management
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Growth Team
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Sales and business development
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Team Structure Templates', url: '#' },
              { title: 'Role Definition Framework', url: '#' }
            ],
            checklist: [
              'Define core team roles and responsibilities',
              'Create hiring profiles and job descriptions',
              'Establish compensation structures',
              'Implement team communication systems',
              'Design performance evaluation frameworks'
            ]
          }
        ]
      }
    },
    {
      id: 'standard-operating-procedures',
      title: 'Standard Operating Procedures',
      description: 'Document and systematize all aspects of your agency operations for consistent quality',
      icon: <FileText className="h-6 w-6" />,
      color: 'purple' as const,
      overlayContent: {
        title: 'Comprehensive SOP Development',
        description: 'Create detailed procedures that ensure consistent, high-quality service delivery',
        sections: [
          {
            title: 'Complete Operations Documentation',
            color: 'purple' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Build comprehensive standard operating procedures that enable consistent quality and efficient team onboarding.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SOP Categories:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Client acquisition and onboarding procedures</li>
                  <li>Project discovery and requirements gathering</li>
                  <li>Automation development and testing protocols</li>
                  <li>Quality assurance and review processes</li>
                  <li>Client communication and reporting standards</li>
                  <li>Team training and performance management</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <FileText className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Process Documentation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Step-by-step procedure documentation
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <CheckCircle className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Quality Standards
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Consistent quality across all deliverables
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'SOP Template Library', url: '#' },
              { title: 'Process Mapping Guide', url: '#' }
            ],
            checklist: [
              'Document all core business processes',
              'Create detailed workflow procedures',
              'Establish quality standards and checklists',
              'Build training materials and resources',
              'Implement process improvement systems'
            ]
          }
        ]
      }
    },
    {
      id: 'project-management-systems',
      title: 'Scalable Project Management',
      description: 'Implement robust project management systems for multiple concurrent client engagements',
      icon: <Calendar className="h-6 w-6" />,
      color: 'green' as const,
      overlayContent: {
        title: 'Project Management Excellence',
        description: 'Build systems that support multiple projects while maintaining quality and deadlines',
        sections: [
          {
            title: 'Multi-Project Management Framework',
            color: 'green' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create project management systems that scale efficiently while maintaining visibility and control across all client engagements.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Project Management Components:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Centralized project tracking and resource allocation</li>
                  <li>Standardized project templates and milestone tracking</li>
                  <li>Automated reporting and client communication</li>
                  <li>Capacity planning and workload management</li>
                  <li>Profitability tracking by project and client</li>
                  <li>Risk management and issue escalation protocols</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Calendar className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Project Tracking
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Real-time visibility into all projects
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Resource Management
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Optimal team allocation and capacity planning
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart2 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Performance Analytics
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Profitability and efficiency tracking
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Project Management Templates', url: '#' },
              { title: 'Resource Planning Tools', url: '#' }
            ],
            checklist: [
              'Set up centralized project management platform',
              'Create standardized project templates',
              'Implement resource allocation systems',
              'Build automated reporting and analytics',
              'Establish capacity planning processes'
            ]
          }
        ]
      }
    },
    {
      id: 'financial-management-scaling',
      title: 'Financial Management & Growth',
      description: 'Implement financial systems and KPIs for sustainable seven-figure agency growth',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'orange' as const,
      overlayContent: {
        title: 'Financial Growth Framework',
        description: 'Build financial systems that support sustainable growth and profitability',
        sections: [
          {
            title: 'Complete Financial Operations',
            color: 'orange' as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Establish comprehensive financial management systems that provide visibility, control, and strategic guidance for scaling your agency.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Financial Management Areas:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>Cash flow forecasting and management systems</li>
                  <li>Profitability analysis by client, service, and team member</li>
                  <li>Strategic reinvestment planning for growth</li>
                  <li>Key performance indicators and financial benchmarks</li>
                  <li>Pricing optimization and margin improvement strategies</li>
                  <li>Investment planning for technology and team expansion</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <DollarSign className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Cash Flow Management
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Predictable revenue and expense planning
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Growth Investment
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Strategic reinvestment for scaling
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              { title: 'Financial Planning Templates', url: '#' },
              { title: 'KPI Dashboard Setup Guide', url: '#' }
            ],
            checklist: [
              'Implement cash flow forecasting systems',
              'Set up profitability tracking by project',
              'Create financial KPI dashboards',
              'Develop strategic investment plans',
              'Establish financial review processes'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        Team & Systems Scaling
      </h2>
      
      <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Scale your automation agency with the right team structure and systems.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamScalingSections.map((section) => (
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
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  {section.description}
                </p>
              </div>
            </div>
          </ClickableCard>
        ))}
      </div>

      {/* Guide Overlays */}
      {teamScalingSections.map((section) => (
        <GuideOverlay
          key={`overlay-${section.id}`}
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

export default AutomationAgency;
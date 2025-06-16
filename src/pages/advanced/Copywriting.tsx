import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
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
  PenTool
} from 'lucide-react';

const Copywriting: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('high-paying-niches');

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
        return <HighPayingNichesContent />;
      case 'ai-writing-arsenal':
        return <AiWritingArsenalContent />;
      case 'client-systems':
        return <ClientSystemsContent />;
      case 'premium-pricing':
        return <PremiumPricingContent />;
      case 'scaling':
        return <ScalingContent />;
      default:
        return <HighPayingNichesContent />;
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
const HighPayingNichesContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        High-Paying Niches
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Identify and target the most profitable copywriting niches with high demand and premium pricing potential.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Financial Services Copywriting",
            description: "High-ticket copywriting for financial products and services",
            steps: [
              "Target wealth management firms, investment platforms, and fintech companies",
              "Specialize in compliance-friendly copy that converts",
              "Focus on lead generation and customer acquisition copy"
            ],
            avgRate: "$1,500-5,000 per project"
          },
          {
            title: "SaaS & Tech Copywriting",
            description: "Premium copywriting for software and technology companies",
            steps: [
              "Target B2B SaaS companies with complex products and high customer value",
              "Specialize in technical-to-simple translation for complex products",
              "Focus on website copy, email sequences, and case studies"
            ],
            avgRate: "$2,000-7,500 per project"
          },
          {
            title: "Health & Wellness Copywriting",
            description: "High-converting copy for health products and services",
            steps: [
              "Target supplement companies, fitness programs, and wellness services",
              "Specialize in compliance-friendly yet persuasive health copy",
              "Focus on long-form sales pages and email sequences"
            ],
            avgRate: "$1,000-4,000 per project"
          },
          {
            title: "Luxury Brand Copywriting",
            description: "Premium copywriting for luxury products and experiences",
            steps: [
              "Target high-end fashion, travel, real estate, and lifestyle brands",
              "Specialize in sophisticated, emotionally resonant storytelling",
              "Focus on brand narratives and premium product descriptions"
            ],
            avgRate: "$2,500-10,000 per project"
          }
        ].map((section, index) => (
          <Card key={index} className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
            <div className="flex justify-between items-start">
              <div>
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
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                {section.avgRate}
              </span>
            </div>
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
          Download Niche Research Templates
        </Button>
      </div>
    </div>
  );
};

const AiWritingArsenalContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        AI Writing Arsenal
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Build a comprehensive toolkit of AI writing tools and systems for efficient, high-quality content creation.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Core AI Writing Tools",
            description: "Essential AI tools for professional copywriting services",
            steps: [
              "Set up GPT-4 with custom instructions for copywriting tasks",
              "Configure Claude for long-form content and creative ideation",
              "Implement specialized tools like Jasper or Copy.ai for specific formats"
            ]
          },
          {
            title: "Custom Prompt Engineering",
            description: "Develop proprietary prompts for superior AI-generated copy",
            steps: [
              "Create specialized prompts for different copywriting formats (emails, ads, etc.)",
              "Develop multi-step prompting systems for complex projects",
              "Build a prompt library organized by client industry and content type"
            ]
          },
          {
            title: "Quality Control Systems",
            description: "Implement processes to ensure consistently excellent output",
            steps: [
              "Create AI-powered editing and proofreading workflows",
              "Implement brand voice consistency checks",
              "Develop compliance verification systems for regulated industries"
            ]
          },
          {
            title: "Efficiency & Automation",
            description: "Streamline workflows for maximum productivity and profitability",
            steps: [
              "Create templates for common project types and deliverables",
              "Implement batch processing for similar content needs",
              "Develop systems for content versioning and A/B testing"
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
          Download AI Prompt Library
        </Button>
      </div>
    </div>
  );
};

const ClientSystemsContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Client Systems & Funnels
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Build automated systems to attract, convert, and retain high-paying copywriting clients.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Client Acquisition Funnel",
            description: "Create a systematic approach to attracting ideal clients",
            steps: [
              "Develop a lead magnet strategy specific to your target niche",
              "Create an automated webinar or case study presentation",
              "Implement a qualification system to filter for ideal clients"
            ]
          },
          {
            title: "Sales Process Automation",
            description: "Streamline your sales process for higher conversion rates",
            steps: [
              "Create a standardized discovery call process and questionnaire",
              "Develop proposal templates for different service offerings",
              "Implement automated follow-up sequences for prospects"
            ]
          },
          {
            title: "Client Onboarding System",
            description: "Create a seamless onboarding experience for new clients",
            steps: [
              "Develop a comprehensive client intake process and questionnaire",
              "Create welcome materials and expectations documentation",
              "Implement project management and communication systems"
            ]
          },
          {
            title: "Retention & Referral Systems",
            description: "Maximize client lifetime value through retention and referrals",
            steps: [
              "Create systems for ongoing client communication and updates",
              "Implement a results reporting framework to demonstrate value",
              "Develop a structured referral program with incentives"
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
          Download Client Acquisition Templates
        </Button>
      </div>
    </div>
  );
};

const PremiumPricingContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Premium Pricing Models
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Implement strategic pricing models to maximize revenue and position your services as premium.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Value-Based Pricing Strategy",
            description: "Price based on the value delivered rather than time spent",
            steps: [
              "Develop a value assessment framework for different client types",
              "Create ROI calculators to demonstrate potential client returns",
              "Implement tiered pricing based on projected business impact"
            ],
            example: "Example: $5,000-15,000 for email sequences based on revenue potential"
          },
          {
            title: "Retainer Model Implementation",
            description: "Create predictable income through monthly retainer arrangements",
            steps: [
              "Design tiered retainer packages with clear deliverables",
              "Implement value-add components to justify premium pricing",
              "Create systems for demonstrating ongoing ROI to retain clients"
            ],
            example: "Example: $3,000-10,000 monthly retainers for ongoing copy needs"
          },
          {
            title: "Project-Based Packaging",
            description: "Structure project packages for maximum perceived value",
            steps: [
              "Create comprehensive project packages that solve complete problems",
              "Implement strategic upsells and cross-sells within packages",
              "Develop case studies demonstrating ROI from similar projects"
            ],
            example: "Example: $7,500-25,000 for complete launch copy packages"
          },
          {
            title: "Performance-Based Components",
            description: "Incorporate performance elements to increase overall compensation",
            steps: [
              "Design hybrid pricing models with base fees plus performance bonuses",
              "Create clear performance metrics and tracking systems",
              "Implement contracts that protect both parties in performance arrangements"
            ],
            example: "Example: Base fee plus 1-5% of revenue generated from copy"
          }
        ].map((section, index) => (
          <Card key={index} className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
            <div className="flex justify-between items-start">
              <div>
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
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                {section.example}
              </span>
            </div>
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
          Download Pricing Strategy Guide
        </Button>
      </div>
    </div>
  );
};

const ScalingContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Scaling to 6-Figures
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Implement strategic systems to scale your AI copywriting business to six figures and beyond.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Team Building & Delegation",
            description: "Scale beyond yourself with strategic hiring and team building",
            steps: [
              "Identify key roles for delegation (project management, editing, admin)",
              "Create detailed SOPs for all operational processes",
              "Implement training systems and quality control processes"
            ]
          },
          {
            title: "Service Expansion Strategy",
            description: "Strategically expand your service offerings for increased revenue",
            steps: [
              "Develop complementary services to increase client lifetime value",
              "Create productized service offerings for scalability",
              "Implement cross-selling and upselling systems"
            ]
          },
          {
            title: "Agency Model Transition",
            description: "Transform from freelancer to agency for exponential growth",
            steps: [
              "Develop agency positioning and branding",
              "Create systems for managing multiple client relationships",
              "Implement team management and project coordination processes"
            ]
          },
          {
            title: "Passive Income Streams",
            description: "Add passive revenue components to your business model",
            steps: [
              "Create digital products based on your copywriting expertise",
              "Develop training programs for aspiring copywriters",
              "Implement affiliate partnerships with complementary service providers"
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
          Download 6-Figure Scaling Blueprint
        </Button>
      </div>
    </div>
  );
};

export default Copywriting;
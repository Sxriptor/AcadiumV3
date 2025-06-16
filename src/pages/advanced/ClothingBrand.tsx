import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
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
  Truck
} from 'lucide-react';

const ClothingBrand: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('brand-setup');

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
        return <AiInfluencersContent />;
      case 'scaling':
        return <ScalingContent />;
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
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Brand Setup & Identity
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Create a compelling brand identity that resonates with your target audience and stands out in the market.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Market Research & Niche Selection",
            description: "Identify profitable clothing niches with high demand and low competition",
            steps: [
              "Use AI tools to analyze market trends and competition",
              "Identify underserved sub-niches with passionate audiences",
              "Validate demand through social media engagement analysis"
            ]
          },
          {
            title: "Brand Identity Development",
            description: "Create a distinctive brand identity that resonates with your target audience",
            steps: [
              "Generate brand name options using AI naming tools",
              "Create professional logo and visual identity with AI design tools",
              "Develop brand voice, mission, and unique selling proposition"
            ]
          },
          {
            title: "Product Selection & Sourcing",
            description: "Select and source high-quality products with optimal profit margins",
            steps: [
              "Identify print-on-demand vs. inventory-based product strategy",
              "Establish relationships with reliable suppliers and manufacturers",
              "Set up quality control processes and sample ordering system"
            ]
          },
          {
            title: "E-commerce Store Setup",
            description: "Build a high-converting online store optimized for sales",
            steps: [
              "Select and configure the optimal e-commerce platform (Shopify recommended)",
              "Implement high-converting product page templates",
              "Set up payment processing, shipping, and tax configurations"
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
          Download Brand Setup Checklist
        </Button>
      </div>
    </div>
  );
};

const EmailSmsContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Email/SMS Automation
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Build powerful automated marketing systems that drive sales on autopilot through email and SMS.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Email Marketing Infrastructure",
            description: "Set up a robust email marketing system for your clothing brand",
            steps: [
              "Select and configure an email service provider (Klaviyo recommended)",
              "Set up domain authentication and deliverability optimization",
              "Create segmented lists for targeted marketing"
            ]
          },
          {
            title: "Automated Email Sequences",
            description: "Create high-converting email sequences that drive sales automatically",
            steps: [
              "Welcome sequence for new subscribers (7-email series)",
              "Abandoned cart recovery sequence (3-5 emails)",
              "Post-purchase sequence for reviews and upsells"
            ]
          },
          {
            title: "SMS Marketing Integration",
            description: "Implement SMS marketing for higher open rates and conversions",
            steps: [
              "Set up compliant SMS opt-in processes",
              "Create automated SMS flows for cart abandonment and promotions",
              "Implement SMS for shipping and delivery notifications"
            ]
          },
          {
            title: "AI-Powered Content Creation",
            description: "Use AI to generate engaging email and SMS content at scale",
            steps: [
              "Set up AI tools for generating email subject lines and content",
              "Create templates for consistent brand messaging",
              "Implement A/B testing systems for continuous optimization"
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
          Download Email/SMS Templates
        </Button>
      </div>
    </div>
  );
};

const AiVideoAdsContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        AI Video Ads
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Create high-converting video advertisements for your clothing brand using AI tools.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "AI Video Creation Tools",
            description: "Master the essential AI tools for creating professional video ads",
            steps: [
              "Set up accounts on key AI video platforms (Runway, Pika, Midjourney)",
              "Learn prompt engineering specific to fashion and apparel",
              "Create templates for consistent brand video production"
            ]
          },
          {
            title: "High-Converting Ad Formats",
            description: "Implement proven video ad formats that drive clothing sales",
            steps: [
              "Product showcase videos with lifestyle context",
              "Before/after transformation videos",
              "User-generated content style videos for authenticity"
            ]
          },
          {
            title: "Platform-Specific Optimization",
            description: "Tailor your video ads for maximum performance on each platform",
            steps: [
              "Instagram/Facebook video ad specifications and best practices",
              "TikTok-optimized vertical video formats",
              "YouTube ad formats for different funnel stages"
            ]
          },
          {
            title: "Testing & Scaling Framework",
            description: "Implement a systematic approach to testing and scaling winning ads",
            steps: [
              "Create a structured testing framework for ad variations",
              "Set up performance tracking and analytics",
              "Develop a scaling protocol for winning ad creative"
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
          Download Video Ad Templates
        </Button>
      </div>
    </div>
  );
};

const AiInfluencersContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        AI Influencer Marketing
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Leverage AI-powered influencer strategies to amplify your brand reach and credibility.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "AI Influencer Creation",
            description: "Build your own AI influencers to promote your clothing brand",
            steps: [
              "Design compelling AI personalities aligned with your brand",
              "Create consistent visual identity using AI image generation",
              "Develop authentic voice and content style for each AI influencer"
            ]
          },
          {
            title: "Content Strategy & Calendar",
            description: "Develop a comprehensive content strategy for your AI influencers",
            steps: [
              "Create a content calendar with platform-specific posting schedules",
              "Develop content themes and storylines for authentic engagement",
              "Implement a content batch creation system for efficiency"
            ]
          },
          {
            title: "Engagement & Community Building",
            description: "Build authentic engagement and community around your AI influencers",
            steps: [
              "Set up automated engagement protocols for comments and messages",
              "Create community-building content that encourages interaction",
              "Implement follower growth strategies specific to each platform"
            ]
          },
          {
            title: "Monetization & Conversion",
            description: "Convert influencer audiences into customers and revenue",
            steps: [
              "Develop natural product integration strategies for AI influencer content",
              "Create exclusive offers and promotions for influencer audiences",
              "Implement tracking systems to measure conversion from each influencer"
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
          Download AI Influencer Playbook
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
        Scaling & Monetization
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Systematically scale your clothing brand to six and seven figures with these proven strategies.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Paid Advertising Scaling System",
            description: "Implement a systematic approach to scaling paid advertising",
            steps: [
              "Set up proper tracking and attribution for accurate ROAS measurement",
              "Implement the 'Vertical Scaling' method for Facebook/Instagram ads",
              "Develop cross-platform retargeting strategies for maximum conversion"
            ]
          },
          {
            title: "Product Line Expansion",
            description: "Strategically expand your product offerings for increased revenue",
            steps: [
              "Analyze sales data to identify high-performing product categories",
              "Implement the 'Horizontal Expansion' strategy for complementary products",
              "Develop limited edition and seasonal release strategies"
            ]
          },
          {
            title: "Operations & Fulfillment Optimization",
            description: "Scale your operations to handle increased order volume efficiently",
            steps: [
              "Set up automated inventory management systems",
              "Implement strategic shipping and fulfillment partnerships",
              "Develop customer service automation with AI support"
            ]
          },
          {
            title: "Advanced Revenue Optimization",
            description: "Implement advanced strategies to maximize customer lifetime value",
            steps: [
              "Develop tiered loyalty and rewards programs",
              "Implement subscription models for recurring revenue",
              "Create high-ticket premium product lines for increased margins"
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
          Download Scaling Blueprint
        </Button>
      </div>
    </div>
  );
};

export default ClothingBrand;
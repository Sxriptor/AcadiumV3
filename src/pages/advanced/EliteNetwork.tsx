import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  MessageSquare, 
  Lightbulb, 
  Handshake, 
  FileText, 
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Calendar,
  Video,
  Globe,
  Lock,
  Star
} from 'lucide-react';

const EliteNetwork: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('discord');

  const tabs = [
    { id: 'discord', label: 'Discord Community', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'mastermind', label: 'Advanced Mastermind', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'partnerships', label: 'Strategic Partnerships', icon: <Handshake className="h-4 w-4" /> },
    { id: 'case-studies', label: 'Success Case Studies', icon: <FileText className="h-4 w-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discord':
        return <DiscordContent />;
      case 'mastermind':
        return <MastermindContent />;
      case 'partnerships':
        return <PartnershipsContent />;
      case 'case-studies':
        return <CaseStudiesContent />;
      default:
        return <DiscordContent />;
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-gray-300 mb-4">
            <Users className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">ELITE NETWORK</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Connect with Advanced Practitioners
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
            Join our exclusive community of successful entrepreneurs, form strategic 
            partnerships, and accelerate your business growth.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-gray-900 hover:bg-gray-100">
              <MessageSquare className="mr-2 h-4 w-4" />
              Join Discord
            </Button>
            
            <Button variant="outline" className="border-gray-600 text-white hover:bg-white/10">
              Apply for Mastermind
            </Button>
          </div>
        </div>
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
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
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

      {/* Upcoming Events */}
      <Card>
        <h3 className={`text-xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Upcoming Elite Events
        </h3>
        
        <div className="space-y-4">
          {[
            {
              title: "AI Business Scaling Masterclass",
              date: "June 15, 2025",
              time: "1:00 PM - 3:00 PM EST",
              host: "Michael Rodriguez",
              type: "Virtual Workshop"
            },
            {
              title: "Strategic Partnership Roundtable",
              date: "June 22, 2025",
              time: "11:00 AM - 12:30 PM EST",
              host: "Sarah Chen",
              type: "Virtual Networking"
            },
            {
              title: "Advanced AI Tools Showcase",
              date: "July 5, 2025",
              time: "2:00 PM - 4:00 PM EST",
              host: "David Johnson",
              type: "Live Demo"
            }
          ].map((event, index) => (
            <div key={index} className={`p-4 rounded-lg ${
              theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {event.title}
                  </h4>
                  <div className="flex items-center mt-1">
                    <Calendar className={`h-4 w-4 mr-1 ${
                      theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {event.date} • {event.time}
                    </span>
                  </div>
                  <div className={`text-sm mt-1 ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Hosted by: {event.host}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mr-2">
                    {event.type}
                  </span>
                  <Button variant="outline" size="sm">
                    Register
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Join the Elite Network?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Connect with successful entrepreneurs, access exclusive resources, and accelerate your business growth.
          </p>
          <Button className="bg-white text-gray-900 hover:bg-gray-100">
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Tab Content Components
const DiscordContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Discord Community
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Join our exclusive Discord community of successful entrepreneurs and AI business builders.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Niche-Specific Channels",
            description: "Dedicated channels for each business niche and focus area",
            features: [
              "Clothing brand strategies and automation",
              "Web/mobile development agency building",
              "AI copywriting business tactics",
              "AI influencer creation and monetization",
              "Automation agency scaling methods"
            ]
          },
          {
            title: "Expert Office Hours",
            description: "Regular live sessions with successful entrepreneurs",
            features: [
              "Weekly Q&A sessions with 7-figure business owners",
              "Monthly deep-dive workshops on specific business models",
              "Tech implementation support from automation experts",
              "Marketing strategy sessions with industry specialists"
            ]
          },
          {
            title: "Resource Library",
            description: "Comprehensive collection of templates, guides, and tools",
            features: [
              "Contract and proposal templates for all business models",
              "Automation workflow templates and code snippets",
              "Marketing and sales scripts for high-ticket services",
              "SOPs and process documentation for scaling"
            ]
          },
          {
            title: "Accountability & Support",
            description: "Systems to keep you on track and accelerate progress",
            features: [
              "Weekly accountability check-ins and goal setting",
              "Peer matching for accountability partnerships",
              "Celebration of wins and milestone recognition",
              "Troubleshooting support for business challenges"
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
              {section.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button onClick={() => window.open('https://discord.gg/sJqAbET8', '_blank')}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Join Discord Community
        </Button>
      </div>
    </div>
  );
};

const MastermindContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Advanced Mastermind
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Join our exclusive mastermind group for high-level strategy, accountability, and growth.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Monthly Strategy Sessions",
            description: "Deep-dive strategic planning and problem-solving",
            features: [
              "Small group format (max 8 participants) for personalized attention",
              "Structured hot seat format for focused problem-solving",
              "Expert facilitation by successful entrepreneurs",
              "Actionable takeaways and implementation plans"
            ]
          },
          {
            title: "Quarterly Planning Intensives",
            description: "Comprehensive quarterly business planning and goal setting",
            features: [
              "Full-day virtual intensive for strategic planning",
              "Data-driven performance analysis and optimization",
              "90-day goal setting with accountability mechanisms",
              "Resource allocation and priority planning"
            ]
          },
          {
            title: "1-on-1 Expert Coaching",
            description: "Personalized guidance from successful entrepreneurs",
            features: [
              "Monthly 1-on-1 coaching calls with industry experts",
              "Customized advice for your specific business challenges",
              "Direct feedback on your strategies and execution",
              "Access to the expert's network and resources"
            ]
          },
          {
            title: "Exclusive Resources & Tools",
            description: "Premium resources only available to mastermind members",
            features: [
              "Advanced SOPs and business systems documentation",
              "High-converting sales and marketing templates",
              "Custom-built automation workflows and tools",
              "Proprietary research and market intelligence"
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
              {section.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className={`p-4 rounded-lg border-l-4 border-yellow-500 ${
        theme === 'gradient' ? 'bg-yellow-900/20 border-yellow-600' : 'bg-yellow-50 dark:bg-yellow-900/20'
      }`}>
        <div className="flex">
          <Lock className={`h-5 w-5 mr-2 flex-shrink-0 ${
            theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-500 dark:text-yellow-400'
          }`} />
          <div>
            <h4 className={`font-medium ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Application Required
            </h4>
            <p className={`text-sm mt-1 ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
            }`}>
              The Advanced Mastermind is application-only to ensure the right fit and high-quality group dynamics. 
              Members must be actively building or running a business and committed to growth.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={() => {}}>
          Apply for Mastermind
        </Button>
      </div>
    </div>
  );
};

const PartnershipsContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Strategic Partnerships
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Form valuable partnerships with other entrepreneurs to accelerate growth and expand opportunities.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Joint Venture Opportunities",
            description: "Collaborate on projects and ventures with complementary businesses",
            features: [
              "Access to pre-vetted JV partners in complementary niches",
              "Structured JV agreement templates and frameworks",
              "Facilitated introductions to potential partners",
              "Case studies and examples of successful JV structures"
            ]
          },
          {
            title: "Affiliate Partnership Network",
            description: "Promote others' products and services for commission revenue",
            features: [
              "Curated directory of high-converting affiliate programs",
              "Negotiated higher commission rates for network members",
              "Promotional resources and marketing materials",
              "Performance tracking and optimization guidance"
            ]
          },
          {
            title: "White Label Opportunities",
            description: "Expand your service offerings through white label partnerships",
            features: [
              "Vetted directory of white label service providers",
              "Pre-negotiated rates and terms for members",
              "Integration guidelines and client management frameworks",
              "Quality assurance standards and processes"
            ]
          },
          {
            title: "Co-Marketing Initiatives",
            description: "Collaborative marketing efforts to reach broader audiences",
            features: [
              "Joint webinar and event opportunities",
              "Co-created content and resource development",
              "Shared audience building and list growth",
              "Cross-promotion frameworks and best practices"
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
              {section.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button onClick={() => {}}>
          Explore Partnership Directory
        </Button>
      </div>
    </div>
  );
};

const CaseStudiesContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Success Case Studies
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Learn from detailed case studies of successful implementations across different business models.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "AI Influencer Empire",
            description: "How Sarah built a $43,000/month AI influencer business in 4 months",
            features: [
              "Created 5 AI personas across Instagram, TikTok, and YouTube",
              "Implemented content batching system producing 150+ pieces monthly",
              "Secured 12 brand partnerships averaging $3,500 each",
              "Built a team of 3 to manage operations and scaling"
            ],
            link: "#"
          },
          {
            title: "Automation Agency Success",
            description: "How Michael scaled to $87,000/month with 12 B2B clients",
            features: [
              "Developed 4 high-ticket service packages for specific industries",
              "Implemented LinkedIn outreach system generating 15 calls weekly",
              "Created standardized delivery processes for consistent results",
              "Built recurring revenue model with 85% client retention"
            ],
            link: "#"
          },
          {
            title: "Premium Clothing Brand",
            description: "How Jessica built a $32,000/month automated clothing brand",
            features: [
              "Identified underserved niche with high profit margins",
              "Implemented AI-generated video ad system with 3.8x ROAS",
              "Created email/SMS automation with 22% conversion rate",
              "Developed influencer partnership system with 15 creators"
            ],
            link: "#"
          },
          {
            title: "AI Copywriting Business",
            description: "How David built a $25,000/month copywriting business with 3 clients",
            features: [
              "Specialized in high-ticket financial services copywriting",
              "Developed proprietary AI prompt system for consistent quality",
              "Created value-based pricing model with performance components",
              "Implemented automated client acquisition funnel for qualified leads"
            ],
            link: "#"
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
            <div className="space-y-2 mb-4">
              {section.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => window.open(section.link, '_blank')}>
                Read Full Case Study <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button onClick={() => {}}>
          Access All Case Studies
        </Button>
      </div>
    </div>
  );
};

export default EliteNetwork;
import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
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
  Settings
} from 'lucide-react';

const AutomationAgency: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('service-packages');

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
        return <ServicePackagesContent />;
      case 'client-acquisition':
        return <ClientAcquisitionContent />;
      case 'service-delivery':
        return <ServiceDeliveryContent />;
      case 'recurring-revenue':
        return <RecurringRevenueContent />;
      case 'team-scaling':
        return <TeamScalingContent />;
      default:
        return <ServicePackagesContent />;
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
const ServicePackagesContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        High-Value Service Packages
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Create premium automation service packages that command high fees and deliver exceptional value.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Business Process Automation",
            description: "Comprehensive automation of core business processes",
            steps: [
              "Workflow analysis and optimization consulting",
              "Custom n8n or Make.com workflow development",
              "Integration with existing business systems",
              "Training and documentation for internal teams"
            ],
            pricing: "$5,000-15,000 setup + $1,000-3,000/mo maintenance"
          },
          {
            title: "Marketing Automation Suite",
            description: "End-to-end marketing automation systems",
            steps: [
              "Lead generation and qualification automation",
              "Multi-channel follow-up sequence development",
              "Customer journey mapping and implementation",
              "Analytics and reporting dashboard setup"
            ],
            pricing: "$3,500-10,000 setup + $750-2,500/mo maintenance"
          },
          {
            title: "AI Agent Development",
            description: "Custom AI agents for business process automation",
            steps: [
              "AI agent strategy and use case development",
              "Custom AI agent development and training",
              "Integration with existing business systems",
              "Ongoing optimization and performance monitoring"
            ],
            pricing: "$7,500-20,000 setup + $1,500-5,000/mo maintenance"
          },
          {
            title: "Data Integration & Analytics",
            description: "Unified data systems with automated reporting",
            steps: [
              "Data source identification and integration planning",
              "Custom data pipeline development",
              "Automated reporting and dashboard creation",
              "Anomaly detection and alert system implementation"
            ],
            pricing: "$4,000-12,000 setup + $1,000-3,000/mo maintenance"
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
                {section.pricing}
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
          Download Service Package Templates
        </Button>
      </div>
    </div>
  );
};

const ClientAcquisitionContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        B2B Client Acquisition
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Implement proven systems to attract and convert high-value B2B clients for your automation agency.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Targeted Outreach System",
            description: "Systematic approach to identifying and contacting ideal clients",
            steps: [
              "Develop ideal client profile and targeting criteria",
              "Implement LinkedIn automation for connection and engagement",
              "Create personalized outreach sequences with value-first approach",
              "Set up meeting scheduling and qualification automation"
            ]
          },
          {
            title: "Authority Positioning Strategy",
            description: "Position yourself as an automation expert in your target market",
            steps: [
              "Create industry-specific case studies and success stories",
              "Develop thought leadership content for LinkedIn and industry publications",
              "Implement a systematic approach to gathering and showcasing testimonials",
              "Create a professional website with clear service offerings and results"
            ]
          },
          {
            title: "Strategic Partnership Network",
            description: "Build referral relationships with complementary service providers",
            steps: [
              "Identify strategic partners who serve your ideal clients",
              "Create mutually beneficial referral arrangements",
              "Develop co-marketing initiatives and joint webinars",
              "Implement partner management and tracking systems"
            ]
          },
          {
            title: "Sales Conversion System",
            description: "Streamlined process to convert prospects into high-paying clients",
            steps: [
              "Create a value-focused discovery call process",
              "Develop custom proposal templates with clear ROI projections",
              "Implement objection handling frameworks for common concerns",
              "Create a seamless contract and onboarding process"
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
          Download Client Acquisition Playbook
        </Button>
      </div>
    </div>
  );
};

const ServiceDeliveryContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Automated Service Delivery
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Create systems to streamline and automate your service delivery for maximum efficiency and scalability.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Client Onboarding Automation",
            description: "Streamlined process for bringing on new clients efficiently",
            steps: [
              "Create automated welcome sequences and resource delivery",
              "Implement digital contract signing and payment processing",
              "Develop client intake questionnaires and information gathering",
              "Set up project management system with automated task creation"
            ]
          },
          {
            title: "Standardized Workflow Templates",
            description: "Reusable workflow templates for common automation projects",
            steps: [
              "Develop modular workflow templates for different industries",
              "Create standardized testing and quality assurance processes",
              "Implement version control and documentation systems",
              "Build a knowledge base of common solutions and troubleshooting"
            ]
          },
          {
            title: "Client Communication Systems",
            description: "Efficient client communication with minimal manual intervention",
            steps: [
              "Set up automated progress updates and milestone notifications",
              "Create templated responses for common client questions",
              "Implement a client portal for self-service information access",
              "Develop escalation protocols for urgent issues"
            ]
          },
          {
            title: "Quality Assurance Framework",
            description: "Systematic approach to ensuring high-quality deliverables",
            steps: [
              "Create standardized testing procedures for all automation workflows",
              "Implement automated monitoring and error detection",
              "Develop peer review processes for complex implementations",
              "Create client approval workflows and feedback incorporation"
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
          Download Service Delivery Templates
        </Button>
      </div>
    </div>
  );
};

const RecurringRevenueContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Recurring Revenue Models
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Implement predictable recurring revenue streams for long-term business stability and growth.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Managed Automation Services",
            description: "Ongoing management and optimization of client automation systems",
            steps: [
              "Create tiered managed service packages with clear deliverables",
              "Implement monitoring and proactive maintenance systems",
              "Develop quarterly business review and optimization processes",
              "Create upsell pathways for additional automation opportunities"
            ],
            pricing: "$1,000-5,000/month per client"
          },
          {
            title: "Automation-as-a-Service (AaaS)",
            description: "Subscription-based access to custom automation solutions",
            steps: [
              "Develop industry-specific automation solutions as subscription services",
              "Create multi-tenant architecture for scalable delivery",
              "Implement usage-based pricing tiers and upgrade paths",
              "Develop self-service configuration options for clients"
            ],
            pricing: "$500-3,000/month per client"
          },
          {
            title: "Strategic Advisory Retainers",
            description: "Ongoing strategic guidance for automation and digital transformation",
            steps: [
              "Create structured advisory frameworks and deliverables",
              "Implement regular strategy sessions and roadmapping",
              "Develop executive reporting and communication systems",
              "Create cross-functional collaboration processes"
            ],
            pricing: "$2,500-10,000/month per client"
          },
          {
            title: "Success-Based Revenue Share",
            description: "Performance-based revenue models tied to client outcomes",
            steps: [
              "Develop clear performance metrics and tracking systems",
              "Create hybrid pricing models with base fees plus performance components",
              "Implement transparent reporting and attribution",
              "Develop contracts that protect both parties in performance arrangements"
            ],
            pricing: "Base fee + 5-15% of attributable revenue/savings"
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
                {section.pricing}
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
          Download Recurring Revenue Playbook
        </Button>
      </div>
    </div>
  );
};

const TeamScalingContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${
        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        Team & Systems Scaling
      </h2>
      
      <p className={`${
        theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
      }`}>
        Build the team, systems, and processes needed to scale your automation agency to seven figures.
      </p>
      
      <div className="space-y-4">
        {[
          {
            title: "Team Structure & Roles",
            description: "Develop an effective organizational structure for your agency",
            steps: [
              "Define key roles and responsibilities for agency scaling",
              "Create hiring profiles and assessment processes for each role",
              "Develop compensation structures including performance incentives",
              "Implement team communication and collaboration systems"
            ]
          },
          {
            title: "Standard Operating Procedures",
            description: "Document and systematize all aspects of your agency operations",
            steps: [
              "Create comprehensive documentation for all service delivery processes",
              "Develop client management and communication protocols",
              "Implement quality assurance and review procedures",
              "Create training materials and onboarding processes for new team members"
            ]
          },
          {
            title: "Project Management Systems",
            description: "Implement scalable project management for multiple client engagements",
            steps: [
              "Set up centralized project management infrastructure",
              "Create standardized project templates and milestone tracking",
              "Implement resource allocation and capacity planning systems",
              "Develop reporting and analytics for project profitability"
            ]
          },
          {
            title: "Financial Management & Scaling",
            description: "Implement financial systems for sustainable growth",
            steps: [
              "Create cash flow management and forecasting systems",
              "Develop profitability tracking by client and service line",
              "Implement strategic reinvestment planning for growth",
              "Create financial benchmarks and KPIs for agency performance"
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
          Download Agency Scaling Blueprint
        </Button>
      </div>
    </div>
  );
};

export default AutomationAgency;
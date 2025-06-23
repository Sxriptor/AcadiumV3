import React, { useState } from 'react';
import { useTheme } from '../../../components/ui/ThemeProvider';
import { 
  Mail, 
  MessageSquare, 
  Settings, 
  Zap, 
  X, 
  CheckCircle, 
  TrendingUp,
  Users,
  Target,
  BarChart3,
  ArrowRight,
  Clock,
  DollarSign,
  Smartphone,
  Bot,
  Send
} from 'lucide-react';
import { GuideOverlay } from '../../../components/shared/GuideOverlay';
import { ClickableCard } from '../../../components/shared/ClickableCard';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, title, children }) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${
        theme === 'gradient' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
      } border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-inherit border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
              theme === 'gradient' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

type ColorType = 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'red';

interface Section {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: ColorType;
  overlayContent: {
    title: string;
    description: string;
    sections: {
      title: string;
      color: ColorType;
      content: React.ReactNode;
      resources?: {
        title: string;
        url: string;
      }[];
      checklist?: string[];
    }[];
  };
}

const EmailSms: React.FC = () => {
  const { theme } = useTheme();
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const emailSmsSections: Section[] = [
    {
      id: 'email-automation',
      title: 'Email Automation Setup',
      description: 'Build powerful email marketing automation workflows',
      icon: <Mail className="h-6 w-6" />,
      color: 'blue',
      overlayContent: {
        title: 'Email Automation Setup Guide',
        description: 'Learn how to create effective email marketing automation workflows',
        sections: [
          {
            title: 'Platform Selection & Setup',
            color: 'blue',
            content: (
              <div className="space-y-4">
                <p>Choose and configure the right email marketing platform for your needs.</p>
                <h4 className="font-semibold">Key Features to Consider:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Automation workflow builder</li>
                  <li>Segmentation capabilities</li>
                  <li>A/B testing tools</li>
                  <li>Analytics and reporting</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Targeting
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Advanced audience segmentation
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart3 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Analytics
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Performance tracking
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <ArrowRight className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Automation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Workflow automation
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              {
                title: 'Klaviyo for E-commerce',
                url: 'https://www.klaviyo.com'
              },
              {
                title: 'Mailchimp Automation',
                url: 'https://mailchimp.com/automation'
              }
            ],
            checklist: [
              'Select email marketing platform',
              'Set up sender authentication',
              'Import customer list',
              'Create segments',
              'Design email templates'
            ]
          }
        ]
      }
    },
    {
      id: 'sms-marketing',
      title: 'SMS Marketing Integration',
      description: 'Implement effective SMS marketing campaigns',
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'purple',
      overlayContent: {
        title: 'SMS Marketing Integration Guide',
        description: 'Step-by-step guide to implementing SMS marketing for your brand',
        sections: [
          {
            title: 'SMS Platform Setup',
            color: 'purple',
            content: (
              <div className="space-y-4">
                <p>Set up and configure your SMS marketing platform for optimal results.</p>
                <h4 className="font-semibold">Implementation Steps:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Choose SMS provider</li>
                  <li>Set up phone number</li>
                  <li>Configure compliance settings</li>
                  <li>Create message templates</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Settings className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Setup
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Platform configuration
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Send className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Delivery
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Message delivery
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <CheckCircle className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Compliance
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Legal compliance
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              {
                title: 'Twilio SMS',
                url: 'https://www.twilio.com/sms'
              },
              {
                title: 'SMS Compliance Guide',
                url: 'https://www.twilio.com/docs/sms/compliance'
              }
            ],
            checklist: [
              'Select SMS platform',
              'Set up dedicated number',
              'Create opt-in flow',
              'Design message templates',
              'Test delivery rates'
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-4 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Email/SMS Automation
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
        }`}>
          Build powerful automated marketing systems that drive sales on autopilot through email and SMS campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emailSmsSections.map((section) => (
          <ClickableCard 
            key={section.id}
            onClick={() => setActiveOverlay(section.id)}
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${
                  section.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                  section.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                  section.color === 'green' ? 'bg-green-500/10 text-green-500' :
                  section.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-orange-500/10 text-orange-500'
                }`}>
                  {section.icon}
                </div>
                <h3 className={`text-xl font-semibold ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {section.title}
                </h3>
              </div>
              <p className={`${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {section.description}
              </p>
            </div>
          </ClickableCard>
        ))}

        {emailSmsSections.map((section) => (
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
    </div>
  );
};

export default EmailSms;
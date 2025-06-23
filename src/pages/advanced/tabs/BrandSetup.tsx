import React, { useState } from 'react';
import { useTheme } from '../../../components/ui/ThemeProvider';
import { 
  Target, 
  Palette, 
  Package, 
  ShoppingCart, 
  CheckCircle, 
  TrendingUp,
  Users,
  Search,
  Lightbulb,
  DollarSign,
  Globe,
  ArrowRight,
  Star,
  BarChart3,
  Zap
} from 'lucide-react';
import { GuideOverlay } from '../../../components/shared/GuideOverlay';
import { ClickableCard } from '../../../components/shared/ClickableCard';

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

const BrandSetup: React.FC = () => {
  const { theme } = useTheme();
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const brandSetupSections: Section[] = [
    {
      id: 'market-research',
      title: 'Market Research',
      description: 'Research your target market and competitors',
      icon: <Target className="h-6 w-6" />,
      color: 'blue',
      overlayContent: {
        title: 'Market Research Guide',
        description: 'Learn how to conduct effective market research for your clothing brand',
        sections: [
          {
            title: 'Research Tools & Methods',
            color: 'blue',
            content: (
              <div className="space-y-4">
                <p>Essential tools and methods for conducting thorough market research.</p>
                <h4 className="font-semibold">Key Research Areas:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Target market demographics</li>
                  <li>Competitor analysis</li>
                  <li>Market trends</li>
                  <li>Customer preferences</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Search className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Market Analysis
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Analyze market trends
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Users className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Demographics
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Target audience research
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <BarChart3 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Competitors
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Competitor analysis
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              {
                title: 'Market Research Guide',
                url: 'https://www.shopify.com/research'
              },
              {
                title: 'Competitor Analysis Template',
                url: 'https://www.shopify.com/tools'
              }
            ],
            checklist: [
              'Define target market',
              'Analyze competitors',
              'Research market trends',
              'Create customer personas'
            ]
          }
        ]
      }
    },
    {
      id: 'brand-identity',
      title: 'Brand Identity',
      description: 'Create a strong brand identity and visual language',
      icon: <Palette className="h-6 w-6" />,
      color: 'purple',
      overlayContent: {
        title: 'Brand Identity Guide',
        description: 'Learn how to create a strong brand identity for your clothing brand',
        sections: [
          {
            title: 'Visual Identity Development',
            color: 'purple',
            content: (
              <div className="space-y-4">
                <p>Create a cohesive visual identity for your brand.</p>
                <h4 className="font-semibold">Key Elements:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Logo design</li>
                  <li>Color palette</li>
                  <li>Typography</li>
                  <li>Brand guidelines</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Palette className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Design
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Visual design elements
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Star className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Branding
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Brand strategy
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Globe className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Guidelines
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Brand guidelines
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              {
                title: 'Brand Identity Guide',
                url: 'https://www.shopify.com/branding'
              },
              {
                title: 'Brand Guidelines Template',
                url: 'https://www.shopify.com/tools'
              }
            ],
            checklist: [
              'Design logo',
              'Choose color palette',
              'Select typography',
              'Create brand guidelines'
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
          Brand Setup
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
        }`}>
          Set up your clothing brand with comprehensive market research, brand identity, and e-commerce infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {brandSetupSections.map((section) => (
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

        {brandSetupSections.map((section) => (
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

export default BrandSetup;
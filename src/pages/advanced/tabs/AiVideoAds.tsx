import React, { useState } from 'react';
import { useTheme } from '../../../components/ui/ThemeProvider';
import { 
  Video, 
  Camera, 
  Edit, 
  Target, 
  X, 
  CheckCircle, 
  TrendingUp,
  Users,
  Play,
  BarChart3,
  ArrowRight,
  Zap,
  DollarSign,
  Eye,
  Sparkles,
  Wand2
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

const AiVideoAds: React.FC = () => {
  const { theme } = useTheme();
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const aiVideoAdsSections: Section[] = [
    {
      id: 'video-creation',
      title: 'AI Video Creation',
      description: 'Create engaging video content using AI tools',
      icon: <Video className="h-6 w-6" />,
      color: 'blue',
      overlayContent: {
        title: 'AI Video Creation Guide',
        description: 'Learn how to create professional videos using AI tools',
        sections: [
          {
            title: 'Platform Selection & Setup',
            color: 'blue',
            content: (
              <div className="space-y-4">
                <p>Choose and configure the right AI video creation tools.</p>
                <h4 className="font-semibold">Key Features:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Text-to-video generation</li>
                  <li>Video editing capabilities</li>
                  <li>Asset library access</li>
                  <li>Export options</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Camera className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Generation
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        AI video generation
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Edit className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Editing
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Video editing tools
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Play className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Preview
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Real-time preview
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              {
                title: 'Runway ML',
                url: 'https://runwayml.com'
              },
              {
                title: 'Synthesia',
                url: 'https://www.synthesia.io'
              }
            ],
            checklist: [
              'Select AI video platform',
              'Set up account and workspace',
              'Import brand assets',
              'Create video templates'
            ]
          }
        ]
      }
    },
    {
      id: 'video-optimization',
      title: 'Video Optimization',
      description: 'Optimize videos for maximum impact',
      icon: <Edit className="h-6 w-6" />,
      color: 'purple',
      overlayContent: {
        title: 'Video Optimization Guide',
        description: 'Learn how to optimize your videos for different platforms',
        sections: [
          {
            title: 'Platform-Specific Optimization',
            color: 'purple',
            content: (
              <div className="space-y-4">
                <p>Optimize your videos for each social media platform.</p>
                <h4 className="font-semibold">Platform Requirements:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Instagram: Square (1:1), Portrait (4:5)</li>
                  <li>TikTok: Vertical (9:16)</li>
                  <li>YouTube: Landscape (16:9)</li>
                  <li>Facebook: Square (1:1), Landscape (16:9)</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Target className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Targeting
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Platform targeting
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Eye className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Visibility
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Maximize visibility
                      </p>
                    </div>
                  </ClickableCard>
                  <ClickableCard onClick={() => {}}>
                    <div className="p-4 text-center">
                      <Sparkles className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Enhancement
                      </h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Visual enhancement
                      </p>
                    </div>
                  </ClickableCard>
                </div>
              </div>
            ),
            resources: [
              {
                title: 'Social Media Video Specs',
                url: 'https://sproutsocial.com/insights/social-media-video-specs-guide'
              }
            ],
            checklist: [
              'Check platform requirements',
              'Adjust video dimensions',
              'Optimize video length',
              'Add captions and text overlays'
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
          AI Video Ads Creation
        </h1>
        <p className={`text-lg max-w-2xl mx-auto ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
        }`}>
          Create engaging video content using AI tools and optimize for maximum impact across platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiVideoAdsSections.map((section) => (
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

        {aiVideoAdsSections.map((section) => (
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

// Detailed overlay content components
const VideoCreationToolsContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-8">
      <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-6`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>
          AI Video Creation Platform Comparison
        </h3>
        <p className={`mb-4 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
          Choose the right AI video tools for your clothing brand's specific needs and budget.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
              Premium AI Video Tools:
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
              <li>• <strong>Runway Gen-3</strong> - Highest quality, $12-95/month</li>
              <li>• <strong>Pika Labs</strong> - Fashion-friendly, $10-70/month</li>
              <li>• <strong>Luma Dream Machine</strong> - Realistic motion, $30/month</li>
              <li>• <strong>Stable Video Diffusion</strong> - Open source option</li>
              <li>• <strong>Synthesia</strong> - AI avatars for brand videos</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
              Supporting Tools:
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
              <li>• <strong>CapCut</strong> - AI-powered editing, free tier</li>
              <li>• <strong>Descript</strong> - AI script writing & editing</li>
              <li>• <strong>Eleven Labs</strong> - AI voiceovers</li>
              <li>• <strong>Midjourney</strong> - AI product photography</li>
              <li>• <strong>Canva AI</strong> - Templates and graphics</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
          <div className="text-center">
            <Wand2 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
            <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Prompt Engineering
            </h4>
            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
              Master the art of writing effective prompts for fashion video generation
            </p>
          </div>
        </Card>
        
        <Card className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
          <div className="text-center">
            <Edit className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
            <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Post-Production
            </h4>
            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
              Enhance AI-generated videos with professional editing techniques
            </p>
          </div>
        </Card>
        
        <Card className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
          <div className="text-center">
            <Sparkles className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Style Consistency
            </h4>
            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
              Maintain brand consistency across all AI-generated video content
            </p>
          </div>
        </Card>
      </div>

      <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-6`}>
        <h3 className={`text-lg font-bold mb-4 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>
          Fashion Video Prompt Templates
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
              Product Showcase Prompts:
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <p className={`text-sm ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-800 dark:text-purple-100'}`}>
                  "Elegant model wearing [product] walking down a minimalist runway, soft lighting, cinematic camera movement, fashion week aesthetic"
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <p className={`text-sm ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-800 dark:text-purple-100'}`}>
                  "Close-up shots of [fabric texture] with gentle fabric movement, natural lighting, macro lens style, premium quality feel"
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
              Lifestyle Video Prompts:
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <p className={`text-sm ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-800 dark:text-purple-100'}`}>
                  "Young professional getting ready for work, wearing [brand] outfit, morning routine, natural lighting, lifestyle photography style"
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <p className={`text-sm ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-800 dark:text-purple-100'}`}>
                  "Friends hanging out in urban setting, casual [brand] clothing, candid moments, golden hour lighting, documentary style"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentStrategyContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-8">
      <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-6`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>
          Video Content Pillars for Fashion Brands
        </h3>
        <p className={`mb-4 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
          Build a comprehensive content strategy that showcases your brand's personality and drives engagement.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
              Core Content Types:
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
              <li>• <strong>Product Reveals</strong> - New collection launches</li>
              <li>• <strong>Styling Tips</strong> - How-to-wear videos</li>
              <li>• <strong>Behind-the-Scenes</strong> - Design process</li>
              <li>• <strong>Customer Stories</strong> - User-generated content</li>
              <li>• <strong>Trend Forecasting</strong> - Fashion insights</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
              Seasonal Campaigns:
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
              <li>• <strong>Spring/Summer</strong> - Light fabrics, vibrant colors</li>
              <li>• <strong>Fall/Winter</strong> - Layering, cozy aesthetics</li>
              <li>• <strong>Holiday Specials</strong> - Gift guides, party wear</li>
              <li>• <strong>Back-to-School</strong> - Professional, casual looks</li>
              <li>• <strong>Resort/Vacation</strong> - Travel-friendly pieces</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {[
          {
            title: "30-Day Content Calendar Template",
            description: "Strategic video content planning for maximum engagement",
            weeks: [
              { week: 1, theme: "Product Focus Week", content: "New arrivals, product details, fabric stories" },
              { week: 2, theme: "Styling & Inspiration", content: "Outfit combinations, styling tips, trend alerts" },
              { week: 3, theme: "Community & Stories", content: "Customer features, behind-the-scenes, brand values" },
              { week: 4, theme: "Seasonal & Promotional", content: "Sales content, seasonal transitions, special offers" }
            ],
            color: 'blue'
          },
          {
            title: "Video Series Ideas",
            description: "Recurring video formats that build audience loyalty",
            series: [
              { name: "Style Sunday", description: "Weekly styling challenges and outfit inspiration" },
              { name: "Fabric Friday", description: "Deep dives into materials, quality, and care" },
              { name: "Transformation Tuesday", description: "Before/after styling makeovers" },
              { name: "Wardrobe Wednesday", description: "Capsule wardrobe building and organization" }
            ],
            color: 'purple'
          }
        ].map((strategy, index) => (
          <Card key={index} className={`${theme === 'gradient' ? 'bg-gray-800/50' : ''} border-l-4 border-l-${strategy.color}-500`}>
            <h4 className={`text-lg font-bold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {strategy.title}
            </h4>
            <p className={`text-sm mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
              {strategy.description}
            </p>
            <div className="space-y-3">
              {(strategy.weeks || strategy.series)?.map((item: any, itemIndex: number) => (
                <div key={itemIndex} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-${strategy.color}-500 text-white`}>
                    {strategy.weeks ? `W${item.week}` : itemIndex + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className={`font-semibold text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {item.theme || item.name}
                    </h5>
                    <p className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {item.content || item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const PlatformOptimizationContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-8">
      <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-6`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>
          Platform-Specific Video Optimization
        </h3>
        <p className={`mb-4 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
          Maximize your video performance by tailoring content to each platform's unique algorithm and audience preferences.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
              Video Specifications:
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
              <li>• <strong>Instagram Reels</strong> - 9:16, 15-90 seconds</li>
              <li>• <strong>TikTok</strong> - 9:16, 15-180 seconds</li>
              <li>• <strong>YouTube Shorts</strong> - 9:16, up to 60 seconds</li>
              <li>• <strong>Facebook/Instagram Feed</strong> - 1:1 or 4:5</li>
              <li>• <strong>YouTube Long-form</strong> - 16:9, 3-15 minutes</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
              Platform Best Practices:
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
              <li>• <strong>Hook in First 3 Seconds</strong> - Grab attention immediately</li>
              <li>• <strong>Vertical Video Priority</strong> - Mobile-first approach</li>
              <li>• <strong>Captions & Text Overlay</strong> - Silent viewing optimization</li>
              <li>• <strong>Trending Audio</strong> - Leverage popular sounds</li>
              <li>• <strong>Clear Call-to-Action</strong> - Drive specific actions</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            platform: "Instagram",
            icon: "📸",
            color: "pink",
            specs: "1080x1920, 30fps",
            duration: "15-90 seconds",
            tips: ["Use trending audio", "Add captions", "Include hashtags", "Post during peak hours"]
          },
          {
            platform: "TikTok",
            icon: "🎵",
            color: "red",
            specs: "1080x1920, 30fps",
            duration: "15-180 seconds",
            tips: ["Jump on trends quickly", "Use TikTok sounds", "Engage with comments", "Post consistently"]
          },
          {
            platform: "YouTube",
            icon: "📺",
            color: "red",
            specs: "1920x1080 or 1080x1920",
            duration: "60s (Shorts) or 3-15min",
            tips: ["Optimize thumbnails", "Write compelling titles", "Use end screens", "Create playlists"]
          },
          {
            platform: "Facebook",
            icon: "👥",
            color: "blue",
            specs: "1080x1080 or 1080x1350",
            duration: "15-240 seconds",
            tips: ["Native video upload", "Add captions", "Use Facebook Creator Studio", "Cross-post to Instagram"]
          }
        ].map((platform, index) => (
          <Card key={index} className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">{platform.icon}</div>
              <h4 className={`font-bold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {platform.platform}
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className={`font-semibold ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  Specs:
                </span>
                <p className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {platform.specs}
                </p>
              </div>
              <div>
                <span className={`font-semibold ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  Duration:
                </span>
                <p className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {platform.duration}
                </p>
              </div>
              <div>
                <span className={`font-semibold ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  Key Tips:
                </span>
                <ul className={`mt-1 space-y-1 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {platform.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-xs">• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className={`${theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'} border rounded-lg p-6`}>
        <h3 className={`text-lg font-bold mb-4 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300'}`}>
          Cross-Platform Content Adaptation
        </h3>
        <div className="space-y-4">
          {[
            { step: 1, title: "Create Master Video", description: "Start with highest quality 16:9 or 9:16 format", time: "30-60 mins" },
            { step: 2, title: "Platform Sizing", description: "Resize and crop for each platform's requirements", time: "15-20 mins" },
            { step: 3, title: "Platform-Specific Edits", description: "Add platform-specific elements (captions, sounds)", time: "20-30 mins" },
            { step: 4, title: "Optimize Metadata", description: "Customize titles, descriptions, and hashtags", time: "10-15 mins" },
            { step: 5, title: "Schedule & Post", description: "Use scheduling tools for optimal posting times", time: "5-10 mins" }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                theme === 'gradient' ? 'bg-orange-600 text-white' : 'bg-orange-600 text-white'
              }`}>
                {item.step}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
                  {item.title}
                </h4>
                <p className={`text-sm ${theme === 'gradient' ? 'text-orange-100' : 'text-orange-600 dark:text-orange-100'}`}>
                  {item.description}
                </p>
                <span className={`text-xs ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-500 dark:text-orange-300'}`}>
                  Time: {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PerformanceAnalyticsContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-8">
      <div className={`${theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'} border rounded-lg p-6`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300'}`}>
          Video Performance Analytics Framework
        </h3>
        <p className={`mb-4 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
          Track, analyze, and optimize your AI-generated video content for maximum ROI and engagement.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
              Key Performance Metrics:
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-orange-100' : 'text-orange-600 dark:text-orange-100'}`}>
              <li>• <strong>View Rate</strong> - % of impressions that became views</li>
              <li>• <strong>Watch Time</strong> - Average duration watched</li>
              <li>• <strong>Engagement Rate</strong> - Likes, comments, shares</li>
              <li>• <strong>Click-Through Rate</strong> - Link clicks from video</li>
              <li>• <strong>Conversion Rate</strong> - Sales from video traffic</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
              Analytics Tools:
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-orange-100' : 'text-orange-600 dark:text-orange-100'}`}>
              <li>• <strong>Native Platform Analytics</strong> - Built-in insights</li>
              <li>• <strong>Google Analytics 4</strong> - Website traffic tracking</li>
              <li>• <strong>Hootsuite Insights</strong> - Cross-platform analytics</li>
              <li>• <strong>Sprout Social</strong> - Social media analytics</li>
              <li>• <strong>Triple Whale</strong> - E-commerce attribution</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
          <div className="text-center">
            <BarChart3 className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
            <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Performance Tracking
            </h4>
            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
              Monitor video performance across all platforms with comprehensive analytics
            </p>
          </div>
        </Card>
        
        <Card className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
          <div className="text-center">
            <TrendingUp className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
            <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              ROI Optimization
            </h4>
            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
              Calculate and improve return on investment for your video marketing campaigns
            </p>
          </div>
        </Card>
        
        <Card className={theme === 'gradient' ? 'bg-gray-800/50' : ''}>
          <div className="text-center">
            <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Scaling Automation
            </h4>
            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
              Automate successful video formats and scale winning campaigns
            </p>
          </div>
        </Card>
      </div>

      <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-6`}>
        <h3 className={`text-lg font-bold mb-4 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>
          Video Performance Benchmarks
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
              Engagement Benchmarks:
            </h4>
            <div className="space-y-2">
              {[
                { platform: "Instagram Reels", engagement: "3-5%", views: "10K-100K" },
                { platform: "TikTok", engagement: "5-9%", views: "50K-500K" },
                { platform: "YouTube Shorts", engagement: "2-4%", views: "5K-50K" },
                { platform: "Facebook Video", engagement: "1-3%", views: "2K-20K" }
              ].map((benchmark, index) => (
                <div key={index} className="flex justify-between p-2 bg-green-100 dark:bg-green-900/50 rounded">
                  <span className={`text-sm font-medium ${theme === 'gradient' ? 'text-green-200' : 'text-green-800 dark:text-green-200'}`}>
                    {benchmark.platform}
                  </span>
                  <span className={`text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                    {benchmark.engagement} | {benchmark.views}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
              Conversion Benchmarks:
            </h4>
            <div className="space-y-2">
              {[
                { metric: "Click-Through Rate", benchmark: "2-5%", description: "From video to website" },
                { metric: "Conversion Rate", benchmark: "1-3%", description: "From video to purchase" },
                { metric: "Cost Per Click", benchmark: "$0.50-2.00", description: "Paid video ads" },
                { metric: "Return on Ad Spend", benchmark: "3:1-5:1", description: "Revenue per dollar spent" }
              ].map((metric, index) => (
                <div key={index} className="p-2 bg-green-100 dark:bg-green-900/50 rounded">
                  <div className="flex justify-between">
                    <span className={`text-sm font-medium ${theme === 'gradient' ? 'text-green-200' : 'text-green-800 dark:text-green-200'}`}>
                      {metric.metric}
                    </span>
                    <span className={`text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                      {metric.benchmark}
                    </span>
                  </div>
                  <p className={`text-xs ${theme === 'gradient' ? 'text-green-300' : 'text-green-500 dark:text-green-300'}`}>
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiVideoAds;
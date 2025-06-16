import React from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Video, 
  Camera, 
  Mic, 
  Film, 
  Sparkles, 
  Volume2, 
  Wand2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdvancedVideoIndex: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "AI Video Generation",
      description: "Create videos with AI-powered tools",
      icon: <Video className="h-6 w-6" />,
      to: "/ai-course-factory",
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Image Generation",
      description: "Create stunning visuals with AI",
      icon: <Camera className="h-6 w-6" />,
      to: "/video/integrate",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Voice Synthesis",
      description: "Generate realistic voiceovers",
      icon: <Mic className="h-6 w-6" />,
      to: "/video/deploy",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Video Editing",
      description: "Edit and enhance your videos",
      icon: <Film className="h-6 w-6" />,
      to: "/video/optimize",
      color: "from-orange-500 to-red-600"
    }
  ];

  const tools = [
    {
      title: "Midjourney",
      description: "AI image generation for stunning visuals",
      url: "https://www.midjourney.com/",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
    },
    {
      title: "Runway",
      description: "Advanced video generation and editing",
      url: "https://runwayml.com/",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
    },
    {
      title: "ElevenLabs",
      description: "Realistic voice synthesis and cloning",
      url: "https://elevenlabs.io/",
      color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
    },
    {
      title: "Pika Labs",
      description: "Text-to-video generation",
      url: "https://www.pika.art/",
      color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
    },
    {
      title: "Veo",
      description: "Google's AI video generation",
      url: "https://veo.google/",
      color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
    },
    {
      title: "Topaz Video AI",
      description: "Video enhancement and upscaling",
      url: "https://www.topazlabs.com/",
      color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 to-pink-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-red-200 mb-4">
            <Video className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">ADVANCED VIDEO</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Create Stunning AI-Generated Videos
          </h1>
          
          <p className="text-red-100 text-lg md:text-xl max-w-2xl mb-8">
            Leverage cutting-edge AI tools to create professional-quality videos, 
            images, and audio for your projects and courses.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-red-700 hover:bg-red-50">
              <Video className="mr-2 h-4 w-4" />
              Start Creating
            </Button>
            
            <Button variant="outline" className="border-red-300 text-white hover:bg-white/10">
              View Tutorials
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Key Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.to} className="block group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg group-hover:translate-y-[-4px]">
                <div className="flex flex-col h-full">
                  <div className={`p-3 mb-4 rounded-lg bg-gradient-to-br ${feature.color} w-12 h-12 flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-sm flex-grow ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium mt-4">
                    <span>Explore</span>
                    <ArrowRight size={16} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Tools Grid */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Recommended AI Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {tool.title}
                </h3>
                
                <p className={`text-sm mb-4 flex-grow ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {tool.description}
                </p>
                
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tool.color}`}
                >
                  Visit Website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Section */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-red-600/20 border-red-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-900/20'
      }>
        <div className="space-y-6">
          <h2 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Video Creation Workflow
          </h2>
          
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Generate Images with Midjourney",
                description: "Create stunning visuals as a foundation for your video"
              },
              {
                step: 2,
                title: "Animate with Runway or Pika",
                description: "Transform static images into dynamic video content"
              },
              {
                step: 3,
                title: "Add Voiceover with ElevenLabs",
                description: "Generate realistic narration for your video"
              },
              {
                step: 4,
                title: "Enhance with Topaz Video AI",
                description: "Upscale and improve video quality"
              },
              {
                step: 5,
                title: "Add Sound Effects",
                description: "Complete your video with appropriate audio elements"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`flex items-start p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`h-8 w-8 rounded-full text-red-600 dark:text-red-400 flex items-center justify-center mr-4 flex-shrink-0 ${
                  theme === 'gradient' ? 'bg-red-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {step.step}
                </div>
                <div>
                  <h4 className={`font-medium mb-1 ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-red-600 to-pink-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Create Amazing Videos?
          </h3>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Start your journey into AI-powered video creation and transform your ideas 
            into stunning visual content.
          </p>
          <Link to="/ai-course-factory">
            <Button className="bg-white text-red-700 hover:bg-red-50">
              Start Creating <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedVideoIndex;
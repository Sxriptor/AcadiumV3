import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Ghost,
  Sparkles,
  FileText,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const DigitalGhostwriting: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "Content Automation Suite",
      description: "Generate high-quality content across multiple platforms automatically",
      icon: <Sparkles className="h-5 w-5" />,
      color: "blue"
    },
    {
      title: "Viral Post Generator",
      description: "Create engaging content optimized for virality and reach",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "purple"
    },
    {
      title: "Audience Growth Tools",
      description: "Build and engage your audience with AI-powered strategies",
      icon: <Users className="h-5 w-5" />,
      color: "green"
    }
  ];

  const testimonials = [
    {
      name: "David Chen",
      role: "Content Creator",
      content: "The AI ghostwriting tools have completely transformed my content creation process. I'm now producing 10x more content in half the time.",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    {
      name: "Emily Rodriguez",
      role: "Digital Marketer",
      content: "My social media engagement has skyrocketed since using these tools. The AI understands exactly what my audience wants.",
      image: "https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg"
    }
  ];

  const contentTypes = [
    {
      title: "Social Media Content",
      description: "Engaging posts for all major platforms",
      metrics: {
        engagement: "+156%",
        reach: "50K+",
        conversion: "4.2%"
      },
      image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg"
    },
    {
      title: "Blog Articles",
      description: "SEO-optimized long-form content",
      metrics: {
        traffic: "+230%",
        rankings: "Top 3",
        readTime: "8 min"
      },
      image: "https://images.pexels.com/photos/3182747/pexels-photo-3182747.jpeg"
    },
    {
      title: "Email Sequences",
      description: "Converting email marketing campaigns",
      metrics: {
        openRate: "35%",
        clickRate: "12%",
        conversion: "5.8%"
      },
      image: "https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-blue-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-teal-200 mb-4">
            <Ghost className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">DIGITAL GHOSTWRITING</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Create Viral Content with AI
          </h1>
          
          <p className="text-teal-100 text-lg md:text-xl max-w-2xl mb-8">
            Build profitable faceless brands and social media empires with our AI-powered 
            content creation tools and automation systems.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-teal-700 hover:bg-teal-50">
              <FileText className="mr-2 h-4 w-4" />
              Start Creating
            </Button>
            
            <Button variant="outline" className="border-teal-300 text-white hover:bg-white/10">
              View Examples
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col h-full">
              <div className={`p-3 mb-4 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30 w-12 h-12 flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400`}>
                {feature.icon}
              </div>
              
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {feature.title}
              </h3>
              
              <p className={`text-sm mb-4 flex-grow ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {feature.description}
              </p>
              
              <Button variant="outline" className="mt-auto">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Content Types */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Content Types
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contentTypes.map((type, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={type.image} 
                  alt={type.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-5">
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {type.title}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {type.description}
                </p>
                
                <div className="space-y-2">
                  {Object.entries(type.metrics).map(([key, value], i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium text-teal-600 dark:text-teal-400">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-teal-600/20 border-teal-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-teal-900/20'
      }>
        <div className="space-y-6">
          <h3 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            How It Works
          </h3>
          
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Content Strategy",
                description: "Define your niche and content pillars"
              },
              {
                step: 2,
                title: "AI Generation",
                description: "Generate engaging content with our AI tools"
              },
              {
                step: 3,
                title: "Optimization",
                description: "Enhance content for maximum engagement"
              },
              {
                step: 4,
                title: "Automation",
                description: "Schedule and automate content distribution"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`flex items-start p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`h-8 w-8 rounded-full text-teal-600 dark:text-teal-400 flex items-center justify-center mr-4 flex-shrink-0 ${
                  theme === 'gradient' ? 'bg-teal-900/30' : 'bg-teal-100 dark:bg-teal-900/30'
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

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="relative">
            <div className="absolute top-4 right-4 text-teal-500 dark:text-teal-400">
              <Star className="h-6 w-6 opacity-20" />
            </div>
            
            <div className="flex items-center mb-4">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="h-12 w-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className={`font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {testimonial.name}
                </h4>
                <p className={`text-sm ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {testimonial.role}
                </p>
              </div>
            </div>
            
            <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}>
              {testimonial.content}
            </p>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-teal-600 to-blue-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Build Your Content Empire?
          </h3>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Join thousands of creators who are building profitable faceless brands 
            with our AI-powered content creation tools.
          </p>
          <Button className="bg-white text-teal-700 hover:bg-teal-50">
            Start Creating Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DigitalGhostwriting;
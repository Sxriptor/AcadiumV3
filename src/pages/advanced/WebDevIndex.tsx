import React from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Code, 
  Database, 
  Rocket, 
  Monitor, 
  Smartphone,
  ArrowRight,
  ExternalLink,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdvancedWebDevIndex: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "Web Development",
      description: "Build modern web applications",
      icon: <Code className="h-6 w-6" />,
      to: "/vibe-coding-lab",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Database & Backend",
      description: "Set up robust backend systems",
      icon: <Database className="h-6 w-6" />,
      to: "/webdev/integrate",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Deployment",
      description: "Deploy applications to production",
      icon: <Rocket className="h-6 w-6" />,
      to: "/webdev/deploy",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Mobile Development",
      description: "Create cross-platform mobile apps",
      icon: <Smartphone className="h-6 w-6" />,
      to: "/webdev/optimize",
      color: "from-orange-500 to-red-600"
    }
  ];

  const technologies = [
    {
      title: "React",
      description: "Frontend library for building user interfaces",
      url: "https://react.dev/",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
    },
    {
      title: "Next.js",
      description: "React framework for production",
      url: "https://nextjs.org/",
      color: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
    },
    {
      title: "Supabase",
      description: "Open source Firebase alternative",
      url: "https://supabase.com/",
      color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
    },
    {
      title: "Tailwind CSS",
      description: "Utility-first CSS framework",
      url: "https://tailwindcss.com/",
      color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300"
    },
    {
      title: "TypeScript",
      description: "Typed JavaScript for better development",
      url: "https://www.typescriptlang.org/",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
    },
    {
      title: "React Native",
      description: "Build native mobile apps with React",
      url: "https://reactnative.dev/",
      color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-blue-200 mb-4">
            <Code className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">ADVANCED WEB DEVELOPMENT</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Build Modern Web & Mobile Applications
          </h1>
          
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-8">
            Master full-stack development with modern frameworks, databases, 
            and deployment strategies for web and mobile applications.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-blue-700 hover:bg-blue-50">
              <Code className="mr-2 h-4 w-4" />
              Start Coding
            </Button>
            
            <Button variant="outline" className="border-blue-300 text-white hover:bg-white/10">
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

      {/* Technologies Grid */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Technologies & Frameworks
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {tech.title}
                </h3>
                
                <p className={`text-sm mb-4 flex-grow ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {tech.description}
                </p>
                
                <a 
                  href={tech.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tech.color}`}
                >
                  Learn More
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Development Workflow */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-blue-600/20 border-blue-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20'
      }>
        <div className="space-y-6">
          <h2 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Development Workflow
          </h2>
          
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Set Up Development Environment",
                description: "Configure your IDE, tools, and version control"
              },
              {
                step: 2,
                title: "Build Frontend Components",
                description: "Create responsive UI components with React and Tailwind"
              },
              {
                step: 3,
                title: "Implement Backend Logic",
                description: "Set up API routes, database models, and business logic"
              },
              {
                step: 4,
                title: "Connect Frontend and Backend",
                description: "Integrate API calls and state management"
              },
              {
                step: 5,
                title: "Test and Debug",
                description: "Ensure your application works correctly across devices"
              },
              {
                step: 6,
                title: "Deploy to Production",
                description: "Launch your application on a hosting platform"
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`flex items-start p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`h-8 w-8 rounded-full text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4 flex-shrink-0 ${
                  theme === 'gradient' ? 'bg-blue-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
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
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Build Your Next Project?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Start your development journey with our comprehensive guides and tools 
            for web and mobile application development.
          </p>
          <Link to="/vibe-coding-lab">
            <Button className="bg-white text-blue-700 hover:bg-blue-50">
              Start Coding <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedWebDevIndex;
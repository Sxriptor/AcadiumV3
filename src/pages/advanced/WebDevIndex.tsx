import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GuideOverlay } from '../../components/shared/GuideOverlay';
import { 
  Code, 
  Database, 
  Rocket, 
  Monitor, 
  Smartphone,
  ArrowRight,
  ExternalLink,
  Globe,
  Server,
  Cloud,
  Layout,
  Terminal,
  GitBranch,
  Settings,
  Shield,
  Zap,
  Focus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface FocusConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  feature: {
    title: string;
    to: string;
  };
}

const FocusConfirmationOverlay: React.FC<FocusConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  feature
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`${
        theme === 'gradient' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
      } border rounded-xl max-w-lg w-full p-6 space-y-4`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Focus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Change Focus to Web Development?
          </h2>
        </div>

        <p className={`${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
        }`}>
          Would you like to change your main focus to Web Development? You'll find the {feature.title} section in the Web Development area.
        </p>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Not Now
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Change Focus
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdvancedWebDevIndex: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [focusConfirmation, setFocusConfirmation] = useState<{
    isOpen: boolean;
    feature: typeof features[0] | null;
  }>({
    isOpen: false,
    feature: null
  });

  const features = [
    {
      id: 'web-development',
      title: "Web Development",
      description: "Build modern web applications",
      icon: <Code className="h-6 w-6" />,
      to: "/vibe-coding-lab",
      color: "from-blue-500 to-indigo-600",
      overlayContent: {
        title: "Modern Web Development",
        description: "Master the art of building modern, responsive web applications",
        sections: [
          {
            title: "Frontend Development",
            color: "blue" as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Learn to build beautiful, responsive web applications using modern frontend technologies.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Technologies:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>React with TypeScript for robust applications</li>
                  <li>Next.js for server-side rendering and static generation</li>
                  <li>Tailwind CSS for modern, responsive styling</li>
                  <li>State management with Redux Toolkit or Zustand</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="p-4 text-center">
                    <Layout className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      UI/UX Design
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Create beautiful interfaces
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Code className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Clean Code
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Write maintainable code
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Zap className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Performance
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Optimize for speed
                    </p>
                  </Card>
                </div>
              </div>
            ),
            resources: [
              { title: 'React Best Practices Guide', url: '#' },
              { title: 'Frontend Architecture Template', url: '#' }
            ],
            checklist: [
              'Set up a modern React development environment',
              'Implement responsive layouts with Tailwind CSS',
              'Build reusable component libraries',
              'Add state management and routing',
              'Optimize performance and loading times'
            ]
          }
        ]
      }
    },
    {
      id: 'database-backend',
      title: "Database & Backend",
      description: "Set up robust backend systems",
      icon: <Database className="h-6 w-6" />,
      to: "/webdev/integrate",
      color: "from-green-500 to-emerald-600",
      overlayContent: {
        title: "Database & Backend Development",
        description: "Build scalable and secure backend systems with modern databases",
        sections: [
          {
            title: "Backend Architecture",
            color: "green" as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Design and implement robust backend systems that scale with your application.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Core Components:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>RESTful API design and implementation</li>
                  <li>Database design and optimization</li>
                  <li>Authentication and authorization</li>
                  <li>Caching and performance optimization</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="p-4 text-center">
                    <Database className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Data Modeling
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Design efficient schemas
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Server className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      API Design
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Build robust APIs
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Shield className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Security
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement best practices
                    </p>
                  </Card>
                </div>
              </div>
            ),
            resources: [
              { title: 'Database Schema Templates', url: '#' },
              { title: 'API Security Checklist', url: '#' }
            ],
            checklist: [
              'Design efficient database schemas',
              'Implement RESTful API endpoints',
              'Set up authentication and authorization',
              'Add caching and optimization',
              'Implement security best practices'
            ]
          }
        ]
      }
    },
    {
      id: 'deployment',
      title: "Deployment",
      description: "Deploy applications to production",
      icon: <Rocket className="h-6 w-6" />,
      to: "/webdev/deploy",
      color: "from-purple-500 to-pink-600",
      overlayContent: {
        title: "Application Deployment",
        description: "Master modern deployment strategies and DevOps practices",
        sections: [
          {
            title: "Deployment & DevOps",
            color: "purple" as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Learn to deploy and maintain applications in production environments.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Areas:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>CI/CD pipeline setup and automation</li>
                  <li>Container orchestration with Docker and Kubernetes</li>
                  <li>Cloud platform deployment (AWS, GCP, Azure)</li>
                  <li>Monitoring and logging solutions</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="p-4 text-center">
                    <Cloud className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Cloud Platforms
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Deploy to the cloud
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <GitBranch className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      CI/CD
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Automate deployment
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Terminal className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      DevOps
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Streamline operations
                    </p>
                  </Card>
                </div>
              </div>
            ),
            resources: [
              { title: 'Deployment Checklist', url: '#' },
              { title: 'CI/CD Pipeline Templates', url: '#' }
            ],
            checklist: [
              'Set up automated CI/CD pipelines',
              'Configure cloud platform services',
              'Implement container orchestration',
              'Set up monitoring and logging',
              'Establish deployment best practices'
            ]
          }
        ]
      }
    },
    {
      id: 'mobile-development',
      title: "Mobile Development",
      description: "Create cross-platform mobile apps",
      icon: <Smartphone className="h-6 w-6" />,
      to: "/webdev/optimize",
      color: "from-orange-500 to-red-600",
      overlayContent: {
        title: "Mobile App Development",
        description: "Build cross-platform mobile applications with modern frameworks",
        sections: [
          {
            title: "Mobile Development Strategy",
            color: "orange" as const,
            content: (
              <div className="space-y-4">
                <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  Create native-quality mobile applications using cross-platform technologies.
                </p>
                <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Focus Areas:</h4>
                <ul className={`list-disc pl-6 space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                  <li>React Native for cross-platform development</li>
                  <li>Native device features and APIs</li>
                  <li>Mobile UI/UX best practices</li>
                  <li>App store deployment and optimization</li>
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="p-4 text-center">
                    <Smartphone className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Cross-Platform
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Build once, run everywhere
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Layout className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Mobile UI
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Create native experiences
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Settings className={`h-8 w-8 mx-auto mb-3 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
                    <h4 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Native Features
                    </h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Leverage device capabilities
                    </p>
                  </Card>
                </div>
              </div>
            ),
            resources: [
              { title: 'React Native Starter Kit', url: '#' },
              { title: 'Mobile UI Components', url: '#' }
            ],
            checklist: [
              'Set up React Native development environment',
              'Implement responsive mobile layouts',
              'Integrate native device features',
              'Optimize app performance',
              'Prepare for app store submission'
            ]
          }
        ]
      }
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

  const handleCardClick = (feature: typeof features[0]) => {
    setActiveOverlay(feature.id);
  };

  const handleOverlayClose = () => {
    const feature = features.find(f => f.id === activeOverlay);
    setActiveOverlay(null);
    if (feature) {
      setFocusConfirmation({
        isOpen: true,
        feature
      });
    }
  };

  const handleFocusConfirmationClose = () => {
    setFocusConfirmation({
      isOpen: false,
      feature: null
    });
  };

  const handleFocusChange = () => {
    // Here you would typically update the user's focus to Web Development
    // For now, we'll just show a message and navigate
    if (focusConfirmation.feature) {
      alert('Your focus has been updated to Web Development. You can find specific sections in the Web Development area.');
      handleFocusConfirmationClose();
    }
  };

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
          {features.map((feature) => (
            <button 
              key={feature.id}
              onClick={() => handleCardClick(feature)}
              className="text-left w-full"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
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
            </button>
          ))}
        </div>
      </div>

      {/* Guide Overlays */}
      {features.map((feature) => (
        <GuideOverlay
          key={`overlay-${feature.id}`}
          isOpen={activeOverlay === feature.id}
          onClose={handleOverlayClose}
          title={feature.overlayContent.title}
          description={feature.overlayContent.description}
          sections={feature.overlayContent.sections}
        />
      ))}

      {/* Focus Confirmation Overlay */}
      <FocusConfirmationOverlay
        isOpen={focusConfirmation.isOpen}
        onClose={handleFocusConfirmationClose}
        onConfirm={handleFocusChange}
        feature={focusConfirmation.feature || { title: '', to: '' }}
      />

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
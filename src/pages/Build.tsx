import React from 'react';
import { Card } from '../components/ui/Card';
import { Code, Factory, FileText, BookOpen, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ui/ThemeProvider';

const Build: React.FC = () => {
  const { theme } = useTheme();
  
  const sections = [
    {
      title: "Vibe Coding Lab",
      description: "AI tools, micro-SaaS, and money-making scripts that generate passive income",
      icon: <Code className="h-6 w-6" />,
      to: "/vibe-coding-lab",
      gradient: "from-blue-500 to-indigo-600",
      features: [
        "AI-powered code generation templates",
        "Ready-to-deploy SaaS boilerplates",
        "Automated testing and deployment pipelines"
      ],
      experience: "Intermediate",
      timeCommitment: "10-15 hours/week",
      learningOutcomes: [
        "Master AI integration in applications",
        "Build scalable SaaS architectures",
        "Implement automated deployment systems"
      ],
      earnings: "$2,000 - $5,000/month"
    },
    {
      title: "AI Course Factory",
      description: "Generate and sell digital products with AI automation and content creation",
      icon: <Factory className="h-6 w-6" />,
      to: "/ai-course-factory",
      gradient: "from-purple-500 to-pink-600",
      features: [
        "Course content generation with GPT-4",
        "Automated video script creation",
        "Interactive lesson plan builders"
      ],
      experience: "Beginner-Friendly",
      timeCommitment: "8-12 hours/week",
      learningOutcomes: [
        "Content automation strategies",
        "Digital product creation",
        "Educational platform development"
      ],
      earnings: "$1,500 - $4,000/month"
    },
    {
      title: "Prompt Engineering",
      description: "Create high-value prompts and frameworks for business growth",
      icon: <FileText className="h-6 w-6" />,
      to: "/prompt-engineering",
      gradient: "from-indigo-500 to-blue-600",
      features: [
        "Advanced prompt optimization tools",
        "Context-aware response templates",
        "Semantic analysis frameworks"
      ],
      experience: "Advanced",
      timeCommitment: "12-20 hours/week",
      learningOutcomes: [
        "Advanced NLP techniques",
        "AI model optimization",
        "Framework development"
      ],
      earnings: "$3,000 - $7,000/month"
    }
  ];

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className={`text-2xl font-bold flex items-center ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          <Code className="mr-2 h-7 w-7 text-blue-600 dark:text-blue-400" />
          Build
        </h1>
        <p className={`mt-1 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
        }`}>
          Create powerful tools, courses, and frameworks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div key={index} className="space-y-4">
            <Link to={section.to} className="block group">
              <Card 
                className="transition-all duration-300 hover:shadow-lg group-hover:translate-y-[-4px]"
              >
                <div className="flex flex-col h-full">
                  <div className={`p-3 mb-4 rounded-lg bg-gradient-to-br ${section.gradient} w-12 h-12 flex items-center justify-center text-white`}>
                    {section.icon}
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {section.title}
                  </h3>
                  
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {section.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full bg-${section.gradient.split('-')[2]}-100 dark:bg-${section.gradient.split('-')[2]}-900 text-${section.gradient.split('-')[2]}-800 dark:text-${section.gradient.split('-')[2]}-300`}>
                      {section.experience}
                    </span>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      theme === 'gradient' 
                        ? 'bg-gray-700 text-gray-200' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                    }`}>
                      {section.timeCommitment}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>

            <Card className="backdrop-blur-lg border-opacity-20">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className={`font-medium flex items-center ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    <Target className="h-4 w-4 mr-2" />
                    Key Features
                  </h4>
                  {section.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className={`flex items-center text-sm ${
                        theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 bg-gradient-to-r ${section.gradient}`} />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className={`font-medium flex items-center ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Learning Outcomes
                  </h4>
                  {section.learningOutcomes.map((outcome, index) => (
                    <div 
                      key={index}
                      className={`flex items-center text-sm ${
                        theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 bg-gradient-to-r ${section.gradient}`} />
                      {outcome}
                    </div>
                  ))}
                </div>

                <div className={`pt-4 border-t ${
                  theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>Potential Earnings</span>
                    <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                      <Zap className="h-4 w-4 mr-1" />
                      {section.earnings}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Build;
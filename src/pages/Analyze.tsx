import React from 'react';
import { Card } from '../components/ui/Card';
import { BarChart2, AreaChart, Briefcase, BookOpen, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ui/ThemeProvider';

const Analyze: React.FC = () => {
  const { theme } = useTheme();
  
  const sections = [
    {
      title: "Market Recon Room",
      description: "Discover trends, resell tools, and capitalize on AI arbitrage opportunities",
      icon: <BarChart2 className="h-6 w-6" />,
      to: "/market-recon",
      gradient: "from-red-500 to-rose-600",
      features: [
        "Market trend analyzer",
        "Opportunity scanner",
        "Competitor research tools"
      ],
      experience: "Intermediate",
      timeCommitment: "8-12 hours/week",
      learningOutcomes: [
        "Market analysis skills",
        "Trend identification",
        "Competitive research"
      ],
      earnings: "$2,500 - $6,000/month"
    },
    {
      title: "Analytics Dashboard",
      description: "Track performance metrics and revenue insights across all projects",
      icon: <AreaChart className="h-6 w-6" />,
      to: "/analytics",
      gradient: "from-blue-500 to-indigo-600",
      features: [
        "Performance tracking",
        "Revenue analytics",
        "Growth metrics"
      ],
      experience: "Beginner-Friendly",
      timeCommitment: "5-8 hours/week",
      learningOutcomes: [
        "Data analysis",
        "Performance optimization",
        "Revenue tracking"
      ],
      earnings: "$1,000 - $3,000/month"
    },
    {
      title: "Portfolio Showcase",
      description: "Document and showcase your projects and income achievements",
      icon: <Briefcase className="h-6 w-6" />,
      to: "/portfolio",
      gradient: "from-purple-500 to-pink-600",
      features: [
        "Project showcase builder",
        "Income verification",
        "Achievement tracking"
      ],
      experience: "Advanced",
      timeCommitment: "10-15 hours/week",
      learningOutcomes: [
        "Portfolio management",
        "Project documentation",
        "Professional presentation"
      ],
      earnings: "$3,000 - $8,000/month"
    }
  ];

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className={`text-2xl font-bold flex items-center ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          <BarChart2 className="mr-2 h-7 w-7 text-red-600 dark:text-red-400" />
          Analyze
        </h1>
        <p className={`mt-1 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
        }`}>
          Track performance and discover opportunities
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

export default Analyze;
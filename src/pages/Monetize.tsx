import React from 'react';
import { Card } from '../components/ui/Card';
import { Zap, DollarSign, Ghost, BookOpen, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ui/ThemeProvider';

const Monetize: React.FC = () => {
  const { theme } = useTheme();
  
  const sections = [
    {
      title: "Speed Wealth Systems",
      description: "Weekly money missions, fast builds & profitable pivots",
      icon: <Zap className="h-6 w-6" />,
      to: "/speed-wealth",
      gradient: "from-yellow-500 to-amber-600",
      features: [
        "Weekly profit challenges",
        "Rapid MVP development",
        "Market opportunity scanner"
      ],
      experience: "Intermediate",
      timeCommitment: "10-15 hours/week",
      learningOutcomes: [
        "Rapid business validation",
        "Quick pivot strategies",
        "Market opportunity analysis"
      ],
      earnings: "$2,000 - $5,000/month"
    },
    {
      title: "Cashflow Arena",
      description: "Implement affiliate stacking, high-ticket closing, and DM funnels",
      icon: <DollarSign className="h-6 w-6" />,
      to: "/cashflow-arena",
      gradient: "from-green-500 to-emerald-600",
      features: [
        "Affiliate program builder",
        "Sales funnel templates",
        "Commission optimization tools"
      ],
      experience: "Beginner-Friendly",
      timeCommitment: "8-12 hours/week",
      learningOutcomes: [
        "Sales funnel mastery",
        "Affiliate marketing skills",
        "Revenue optimization"
      ],
      earnings: "$1,500 - $4,000/month"
    },
    {
      title: "Digital Ghostwriting",
      description: "Create faceless pages, viral content, and profitable social media empires",
      icon: <Ghost className="h-6 w-6" />,
      to: "/ghostwriting",
      gradient: "from-teal-500 to-blue-600",
      features: [
        "Content automation suite",
        "Viral post generator",
        "Audience growth tools"
      ],
      experience: "Advanced",
      timeCommitment: "12-20 hours/week",
      learningOutcomes: [
        "Content strategy mastery",
        "Audience building",
        "Monetization techniques"
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
          <DollarSign className="mr-2 h-7 w-7 text-green-600 dark:text-green-400" />
          Monetize
        </h1>
        <p className={`mt-1 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
        }`}>
          Transform your skills into profitable income streams
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

export default Monetize;
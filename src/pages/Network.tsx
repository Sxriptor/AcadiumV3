import React from 'react';
import { Card } from '../components/ui/Card';
import { Users, MessageSquare, Trophy, BookOpen, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ui/ThemeProvider';

const Network: React.FC = () => {
  const { theme } = useTheme();
  
  const sections = [
    {
      title: "Discord Integration",
      description: "Join live discussions, get real-time support, and participate in events",
      icon: <MessageSquare className="h-6 w-6" />,
      to: "/discord",
      gradient: "from-purple-500 to-indigo-600",
      features: [
        "Live chat support",
        "Voice channels",
        "Event coordination"
      ],
      experience: "Beginner-Friendly",
      timeCommitment: "3-6 hours/week",
      learningOutcomes: [
        "Real-time communication",
        "Community engagement",
        "Event management"
      ],
      earnings: "Community-based"
    },
    {
      title: "Challenges & Mentorship",
      description: "Participate in coding challenges and get guidance from experts",
      icon: <Trophy className="h-6 w-6" />,
      to: "/challenges",
      gradient: "from-yellow-500 to-orange-600",
      features: [
        "Weekly challenges",
        "Mentor matching",
        "Progress tracking"
      ],
      experience: "Intermediate",
      timeCommitment: "5-10 hours/week",
      learningOutcomes: [
        "Problem-solving skills",
        "Code optimization",
        "Professional growth"
      ],
      earnings: "$500 - $2,000/challenge"
    }
  ];

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className={`text-2xl font-bold flex items-center ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          <Users className="mr-2 h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          Network
        </h1>
        <p className={`mt-1 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
        }`}>
          Connect, collaborate, and grow together
        </p>
      </div>

      {/* Center the 2 sections with proper spacing */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl w-full">
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
                      }`}>Potential Value</span>
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
    </div>
  );
};

export default Network;
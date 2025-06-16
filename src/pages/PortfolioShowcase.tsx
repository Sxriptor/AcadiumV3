import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Briefcase, 
  Plus, 
  ExternalLink, 
  Star,
  Eye,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const PortfolioShowcase: React.FC = () => {
  const { theme } = useTheme();

  const portfolioItems = [
    {
      title: "AI Content Generator",
      description: "An AI-powered tool that generates high-quality content for blogs and social media.",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
      category: "AI Tools",
      views: 1234,
      likes: 89,
      rating: 4.8
    },
    {
      title: "Automated Trading System",
      description: "A sophisticated trading bot that uses machine learning for market analysis.",
      image: "https://images.pexels.com/photos/7567557/pexels-photo-7567557.jpeg",
      category: "FinTech",
      views: 987,
      likes: 76,
      rating: 4.6
    },
    {
      title: "Smart Home Dashboard",
      description: "A comprehensive dashboard for monitoring and controlling smart home devices.",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
      category: "IoT",
      views: 2341,
      likes: 156,
      rating: 4.9
    }
  ];

  const achievements = [
    {
      title: "Featured Project",
      description: "AI Content Generator selected as Project of the Month",
      date: "March 2025"
    },
    {
      title: "Innovation Award",
      description: "Received the Tech Innovation Award for Smart Home Dashboard",
      date: "February 2025"
    },
    {
      title: "Community Choice",
      description: "Automated Trading System voted as Community Favorite",
      date: "January 2025"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold flex items-center ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            <Briefcase className="mr-2 h-7 w-7 text-purple-600 dark:text-purple-400" />
            Portfolio Showcase
          </h1>
          <p className={`mt-1 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
          }`}>
            Showcase your projects and track their performance
          </p>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Project
        </Button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className={`text-lg font-semibold ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {item.title}
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
                  {item.category}
                </span>
              </div>
              
              <p className={`text-sm mb-4 ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {item.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-sm">{item.views}</span>
                  </div>
                  <div className={`flex items-center ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">{item.likes}</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 mr-1" />
                    <span className="text-sm">{item.rating}</span>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" className="w-full">
                View Project <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Achievements Section */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-purple-600/20 border-purple-500/30' 
          : 'bg-gradient-to-br from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20'
      }>
        <div className="space-y-6">
          <h2 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Recent Achievements
          </h2>
          
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`flex items-start p-4 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`h-8 w-8 rounded-full text-purple-600 dark:text-purple-400 flex items-center justify-center mr-4 ${
                  theme === 'gradient' ? 'bg-purple-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  <Star className="h-4 w-4" />
                </div>
                <div>
                  <h3 className={`font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {achievement.description}
                  </p>
                  <span className={`text-xs mt-2 block ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Projects",
            value: "12",
            change: "+3 this month",
            isPositive: true
          },
          {
            label: "Total Views",
            value: "45.2K",
            change: "+12% from last month",
            isPositive: true
          },
          {
            label: "Average Rating",
            value: "4.8",
            change: "+0.2 points",
            isPositive: true
          }
        ].map((stat, index) => (
          <Card key={index}>
            <div className="flex flex-col">
              <span className={`text-sm ${
                theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {stat.label}
              </span>
              <span className={`text-2xl font-bold mt-1 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {stat.value}
              </span>
              <span className={`text-sm mt-1 ${
                stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Showcase Your Work?
          </h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Add your projects to your portfolio and start getting noticed by potential clients and collaborators.
          </p>
          <Button className="bg-white text-purple-700 hover:bg-purple-50">
            Create Your First Project <Plus className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PortfolioShowcase;
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  BarChart2, 
  Search, 
  TrendingUp, 
  DollarSign,
  ArrowRight,
  RefreshCw,
  Globe,
  Target,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const MarketRecon: React.FC = () => {
  const { theme } = useTheme();

  const tools = [
    {
      title: "Trend Analyzer",
      description: "Track and analyze emerging market trends in real-time",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "blue"
    },
    {
      title: "Opportunity Scanner",
      description: "Identify lucrative opportunities across different markets",
      icon: <Search className="h-5 w-5" />,
      color: "purple"
    },
    {
      title: "Competition Research",
      description: "Deep dive into competitor strategies and market positioning",
      icon: <Target className="h-5 w-5" />,
      color: "red"
    }
  ];

  const trends = [
    {
      category: "AI Tools",
      trend: "Rising",
      change: "+45%",
      volume: "High",
      competition: "Medium"
    },
    {
      category: "No-Code Platforms",
      trend: "Stable",
      change: "+12%",
      volume: "Medium",
      competition: "High"
    },
    {
      category: "Web3 Development",
      trend: "Rising",
      change: "+28%",
      volume: "Medium",
      competition: "Low"
    }
  ];

  const alerts = [
    {
      type: "opportunity",
      message: "New market gap detected in AI automation tools",
      time: "5 minutes ago"
    },
    {
      type: "trend",
      message: "Significant increase in demand for no-code solutions",
      time: "1 hour ago"
    },
    {
      type: "competition",
      message: "New competitor entered the market in your segment",
      time: "2 hours ago"
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-red-200 mb-4">
            <BarChart2 className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">MARKET RECON ROOM</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Market Intelligence Dashboard
          </h1>
          
          <p className="text-red-100 text-lg md:text-xl max-w-2xl mb-8">
            Track market trends, discover opportunities, and stay ahead of the competition 
            with our real-time market intelligence tools.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-red-700 hover:bg-red-50">
              <Search className="mr-2 h-4 w-4" />
              Start Analysis
            </Button>
            
            <Button variant="outline" className="border-red-300 text-white hover:bg-white/10">
              View Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Live Market Data */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Live Market Trends
          </h2>
          <div className={`flex items-center ${
            theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
          }`}>
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="text-sm">Updated 2 min ago</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'
              }`}>
                <th className={`text-left py-3 px-4 text-sm font-medium ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                }`}>Category</th>
                <th className={`text-left py-3 px-4 text-sm font-medium ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                }`}>Trend</th>
                <th className={`text-left py-3 px-4 text-sm font-medium ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                }`}>Change</th>
                <th className={`text-left py-3 px-4 text-sm font-medium ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                }`}>Volume</th>
                <th className={`text-left py-3 px-4 text-sm font-medium ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                }`}>Competition</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend, index) => (
                <tr key={index} className={`border-b ${
                  theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {trend.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trend.trend === 'Rising' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {trend.trend}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 dark:text-green-400">
                      {trend.change}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                      {trend.volume}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                      {trend.competition}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col h-full">
              <div className={`p-3 mb-4 rounded-lg bg-${tool.color}-100 dark:bg-${tool.color}-900/30 w-12 h-12 flex items-center justify-center text-${tool.color}-600 dark:text-${tool.color}-400`}>
                {tool.icon}
              </div>
              
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
              
              <Button variant="outline" className="mt-auto">
                Access Tool <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Market Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Market Alerts
          </h3>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`flex items-start p-3 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-grow">
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>{alert.message}</p>
                  <span className={`text-xs ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Global Market Activity
          </h3>
          <div className={`relative h-[300px] rounded-lg flex items-center justify-center ${
            theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <Globe className={`h-8 w-8 ${
              theme === 'gradient' ? 'text-gray-400' : 'text-gray-400 dark:text-gray-500'
            }`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm ${
                theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                Interactive map visualization would go here
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-red-600 to-rose-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Dominate Your Market?
          </h3>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Get real-time insights and stay ahead of market trends with our 
            comprehensive market intelligence tools.
          </p>
          <Button className="bg-white text-red-700 hover:bg-red-50">
            Start Market Analysis <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MarketRecon;
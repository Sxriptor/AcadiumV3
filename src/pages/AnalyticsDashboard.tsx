import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowRight,
  RefreshCw,
  Target,
  Globe,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const AnalyticsDashboard: React.FC = () => {
  const { theme } = useTheme();

  const metrics = [
    {
      label: "Total Revenue",
      value: "$24,500",
      change: "+15%",
      isPositive: true
    },
    {
      label: "Active Users",
      value: "1,234",
      change: "+8%",
      isPositive: true
    },
    {
      label: "Conversion Rate",
      value: "3.8%",
      change: "+2.5%",
      isPositive: true
    },
    {
      label: "Avg. Session",
      value: "12m 30s",
      change: "+1.2%",
      isPositive: true
    }
  ];

  const alerts = [
    {
      type: "success",
      message: "Revenue target achieved for Q1 2025",
      time: "2 hours ago"
    },
    {
      type: "warning",
      message: "User engagement dropped by 5% in the last hour",
      time: "1 hour ago"
    },
    {
      type: "info",
      message: "New feature adoption rate exceeding expectations",
      time: "30 minutes ago"
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
            <BarChart2 className="mr-2 h-7 w-7 text-blue-600 dark:text-blue-400" />
            Analytics Dashboard
          </h1>
          <p className={`mt-1 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
          }`}>
            Track performance metrics and revenue insights across all projects
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <div className="flex flex-col">
              <span className={`text-sm ${
                theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {metric.label}
              </span>
              <div className="flex items-baseline mt-2">
                <span className={`text-2xl font-bold ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {metric.value}
                </span>
                <span className={`ml-2 text-sm font-medium ${
                  metric.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Revenue Overview
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Weekly
              </Button>
              <Button variant="outline" size="sm">
                Monthly
              </Button>
              <Button variant="outline" size="sm">
                Yearly
              </Button>
            </div>
          </div>
          
          <div className={`h-80 rounded-lg flex items-center justify-center ${
            theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <p className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}>
              Revenue chart visualization would go here
            </p>
          </div>
        </Card>

        {/* User Activity */}
        <Card>
          <h2 className={`text-lg font-semibold mb-6 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            User Activity
          </h2>
          
          <div className="space-y-6">
            {[
              {
                label: "Active Users",
                value: "1,234",
                change: "+12%",
                color: "blue"
              },
              {
                label: "New Signups",
                value: "256",
                change: "+8%",
                color: "green"
              },
              {
                label: "Session Duration",
                value: "12m 30s",
                change: "+5%",
                color: "purple"
              }
            ].map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {stat.label}
                  </span>
                  <span className={`text-sm font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {stat.value}
                  </span>
                </div>
                <div className={`h-2 rounded-full ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <div 
                    className={`h-full bg-${stat.color}-500 rounded-full`}
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <Card>
          <h2 className={`text-lg font-semibold mb-4 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Recent Alerts
          </h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`flex items-start p-3 rounded-lg ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <AlertCircle className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${
                  alert.type === 'success' ? 'text-green-500' :
                  alert.type === 'warning' ? 'text-yellow-500' :
                  'text-blue-500'
                }`} />
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

        {/* Geographic Distribution */}
        <Card>
          <h2 className={`text-lg font-semibold mb-4 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Geographic Distribution
          </h2>
          <div className={`relative h-[200px] rounded-lg flex items-center justify-center mb-4 ${
            theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <Globe className={`h-8 w-8 ${
              theme === 'gradient' ? 'text-gray-400' : 'text-gray-400 dark:text-gray-500'
            }`} />
          </div>
          <div className="space-y-2">
            {[
              { region: "North America", percentage: "45%" },
              { region: "Europe", percentage: "30%" },
              { region: "Asia", percentage: "15%" },
              { region: "Others", percentage: "10%" }
            ].map((region, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>{region.region}</span>
                <span className={`font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>{region.percentage}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Goals */}
        <Card>
          <h2 className={`text-lg font-semibold mb-4 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Goals Progress
          </h2>
          <div className="space-y-6">
            {[
              {
                goal: "Monthly Revenue",
                target: "$30,000",
                current: "$24,500",
                percentage: 82
              },
              {
                goal: "New Users",
                target: "2,000",
                current: "1,234",
                percentage: 62
              },
              {
                goal: "Customer Satisfaction",
                target: "95%",
                current: "92%",
                percentage: 97
              }
            ].map((goal, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className={`text-sm font-medium ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {goal.goal}
                    </h3>
                    <p className={`text-xs ${
                      theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {goal.current} of {goal.target}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {goal.percentage}%
                  </span>
                </div>
                <div className={`h-2 rounded-full ${
                  theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${goal.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
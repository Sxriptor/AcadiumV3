import React, { useEffect, useState } from 'react';
import { WelcomeCard } from '../components/dashboard/WelcomeCard';
import { StatCard } from '../components/dashboard/StatCard';
import { FeatureCard } from '../components/dashboard/FeatureCard';
import { CourseProgressCard } from '../components/dashboard/CourseProgressCard';
import { 
  Code, 
  Bot, 
  DollarSign, 
  BarChart2, 
  Users, 
  BookOpen, 
  Clock, 
  Trophy,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Handle success/canceled parameters and clean URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');

    if (success === 'true') {
      setShowSuccessMessage(true);
      // Clean the URL by removing the search parameters
      navigate('/', { replace: true });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } else if (canceled === 'true') {
      // Handle canceled payment if needed
      navigate('/', { replace: true });
    }
  }, [location.search, navigate]);

  const mockCourses = [
    {
      id: '1',
      title: 'AI Automation Fundamentals',
      progress: 75,
      lastActivity: '2 hours ago',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Advanced Prompt Engineering',
      progress: 45,
      lastActivity: '1 day ago',
      image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Building AI-Powered Apps',
      progress: 30,
      lastActivity: '3 days ago',
      image: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="py-6 space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className={`rounded-lg p-4 border-l-4 border-green-500 ${
          theme === 'gradient'
            ? 'bg-green-900/20 text-green-300'
            : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
        }`}>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <div>
              <h3 className="font-medium">Payment Successful!</h3>
              <p className="text-sm mt-1">Welcome to Acadium AI Premium. You now have access to all features.</p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <WelcomeCard />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Learning Streak"
          value="12 days"
          icon={<Clock className="h-6 w-6" />}
          trend={{ value: 8, isPositive: true }}
          description="Keep it up!"
        />
        
        <StatCard
          title="Courses Completed"
          value="8"
          icon={<BookOpen className="h-6 w-6" />}
          trend={{ value: 15, isPositive: true }}
          description="This month"
        />
        
        <StatCard
          title="AI Tools Mastered"
          value="24"
          icon={<Bot className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
          description="Total unlocked"
        />
        
        <StatCard
          title="Revenue Generated"
          value="$2,847"
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 23, isPositive: true }}
          description="From AI projects"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feature Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<Code className="h-6 w-6" />}
            title="Build AI Tools"
            description="Create powerful AI applications with our no-code and low-code solutions"
            to="/build"
            gradient="from-blue-500 to-indigo-600"
          />
          
          <FeatureCard
            icon={<Bot className="h-6 w-6" />}
            title="Automate Everything"
            description="Set up intelligent automation workflows that work 24/7"
            to="/automate"
            gradient="from-purple-500 to-pink-600"
          />
          
          <FeatureCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Monetize Skills"
            description="Turn your AI knowledge into profitable income streams"
            to="/monetize"
            gradient="from-green-500 to-emerald-600"
          />
          
          <FeatureCard
            icon={<BarChart2 className="h-6 w-6" />}
            title="Analyze Markets"
            description="Use AI to identify opportunities and optimize strategies"
            to="/analyze"
            gradient="from-red-500 to-orange-600"
          />
        </div>

        {/* Course Progress */}
        <div className="lg:col-span-1">
          <CourseProgressCard courses={mockCourses} />
        </div>
      </div>

      {/* Network Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          icon={<Users className="h-6 w-6" />}
          title="Join the Community"
          description="Connect with fellow AI entrepreneurs and share knowledge"
          to="/network"
          gradient="from-indigo-500 to-blue-600"
        />
        
        <FeatureCard
          icon={<Trophy className="h-6 w-6" />}
          title="Take on Challenges"
          description="Complete AI challenges and earn rewards while learning"
          to="/challenges"
          gradient="from-yellow-500 to-orange-600"
        />
      </div>
    </div>
  );
};

export default Dashboard;
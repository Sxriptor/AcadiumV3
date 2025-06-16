import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Trophy,
  Users,
  Calendar,
  ArrowRight,
  Star,
  Clock,
  Target,
  Award,
  BookOpen,
  Gift
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const ChallengesMentorship: React.FC = () => {
  const { theme } = useTheme();

  const activeChallenges = [
    {
      title: "AI Tool Development Sprint",
      description: "Build a profitable AI tool in 30 days",
      prize: "$5,000",
      participants: 234,
      daysLeft: 12,
      difficulty: "Advanced"
    },
    {
      title: "No-Code Automation Challenge",
      description: "Create automated workflows without coding",
      prize: "$3,000",
      participants: 156,
      daysLeft: 8,
      difficulty: "Intermediate"
    },
    {
      title: "Content Creation Marathon",
      description: "Generate viral content using AI tools",
      prize: "$2,500",
      participants: 312,
      daysLeft: 15,
      difficulty: "Beginner"
    }
  ];

  const mentors = [
    {
      name: "Alex Johnson",
      role: "AI Development Expert",
      expertise: ["Machine Learning", "Neural Networks", "GPT Integration"],
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
      rating: 4.9,
      students: 156
    },
    {
      name: "Sarah Chen",
      role: "Automation Specialist",
      expertise: ["Workflow Automation", "Process Optimization", "Systems Integration"],
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
      rating: 4.8,
      students: 234
    },
    {
      name: "Michael Rodriguez",
      role: "Business Strategy Coach",
      expertise: ["Market Analysis", "Growth Strategy", "Revenue Optimization"],
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
      rating: 4.9,
      students: 189
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-yellow-200 mb-4">
            <Trophy className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">CHALLENGES & MENTORSHIP</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Learn, Compete, and Grow
          </h1>
          
          <p className="text-yellow-100 text-lg md:text-xl max-w-2xl mb-8">
            Join exciting challenges and get mentored by industry experts to accelerate 
            your growth and win amazing prizes.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-yellow-700 hover:bg-yellow-50">
              <Trophy className="mr-2 h-4 w-4" />
              Join Challenge
            </Button>
            
            <Button variant="outline" className="border-yellow-300 text-white hover:bg-white/10">
              Find Mentor
            </Button>
          </div>
        </div>
      </div>

      {/* Active Challenges */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Active Challenges
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeChallenges.map((challenge, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg text-yellow-600 dark:text-yellow-400 ${
                    theme === 'gradient' ? 'bg-yellow-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    <Trophy className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                    {challenge.difficulty}
                  </span>
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {challenge.title}
                </h3>
                
                <p className={`text-sm mb-4 flex-grow ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {challenge.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>Prize Pool</span>
                    <span className={`font-medium ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>{challenge.prize}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>Participants</span>
                    <span className={`font-medium ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>{challenge.participants}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>Time Left</span>
                    <span className={`font-medium ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>{challenge.daysLeft} days</span>
                  </div>
                </div>
                
                <Button className="w-full">
                  Join Challenge <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Mentors */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Featured Mentors
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentors.map((mentor, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <img 
                    src={mentor.image} 
                    alt={mentor.name}
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className={`font-medium ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {mentor.name}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {mentor.role}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className={`text-sm font-medium mr-2 ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {mentor.rating}
                  </span>
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    ({mentor.students} students)
                  </span>
                </div>
                
                <div className="space-y-2 mb-4 flex-grow">
                  <h4 className={`text-sm font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          theme === 'gradient' 
                            ? 'bg-gray-700 text-gray-200' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Book Session <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Program Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className={`text-lg font-semibold mb-6 flex items-center ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Challenge Benefits
          </h3>
          
          <div className="space-y-4">
            {[
              {
                title: "Cash Prizes",
                description: "Win substantial cash rewards for top performances",
                icon: <Gift className="h-5 w-5" />
              },
              {
                title: "Recognition",
                description: "Get featured in our community and gain visibility",
                icon: <Award className="h-5 w-5" />
              },
              {
                title: "Skill Development",
                description: "Learn and improve through practical challenges",
                icon: <Target className="h-5 w-5" />
              },
              {
                title: "Networking",
                description: "Connect with other participants and industry experts",
                icon: <Users className="h-5 w-5" />
              }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className={`p-2 rounded-lg text-yellow-600 dark:text-yellow-400 mr-3 ${
                  theme === 'gradient' ? 'bg-yellow-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                }`}>
                  {benefit.icon}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {benefit.title}
                  </h4>
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className={`text-lg font-semibold mb-6 flex items-center ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
            Mentorship Benefits
          </h3>
          
          <div className="space-y-4">
            {[
              {
                title: "1-on-1 Guidance",
                description: "Personal attention from industry experts",
                icon: <Users className="h-5 w-5" />
              },
              {
                title: "Flexible Schedule",
                description: "Book sessions at your convenience",
                icon: <Calendar className="h-5 w-5" />
              },
              {
                title: "Custom Learning Path",
                description: "Tailored guidance for your goals",
                icon: <Target className="h-5 w-5" />
              },
              {
                title: "Regular Feedback",
                description: "Continuous improvement through expert feedback",
                icon: <Clock className="h-5 w-5" />
              }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className={`p-2 rounded-lg text-blue-600 dark:text-blue-400 mr-3 ${
                  theme === 'gradient' ? 'bg-blue-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {benefit.icon}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {benefit.title}
                  </h4>
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Take the Challenge?
          </h3>
          <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
            Join our community of learners and achievers. Start your journey towards 
            success with expert guidance and exciting challenges.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-yellow-700 hover:bg-yellow-50">
              Join Challenge <Trophy className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="border-yellow-300 text-white hover:bg-white/10">
              Find Mentor <Users className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChallengesMentorship;
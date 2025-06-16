import React from 'react';
import { Card } from '../ui/Card';
import { ProgressRing } from '../ui/ProgressRing';
import { Button } from '../ui/Button';
import { PlayCircle } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';

interface Course {
  id: string;
  title: string;
  progress: number;
  lastActivity: string;
  image: string;
}

interface CourseProgressCardProps {
  courses: Course[];
}

export const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ courses }) => {
  const { theme } = useTheme();
  
  return (
    <Card title="Your Learning Progress" className="h-full">
      <div className="space-y-4">
        {courses.map(course => (
          <div 
            key={course.id}
            className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
              theme === 'gradient'
                ? 'hover:bg-gray-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden mr-4">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow min-w-0">
              <h4 className={`text-sm font-medium truncate ${
                theme === 'gradient' 
                  ? 'text-white' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {course.title}
              </h4>
              <p className={`text-xs ${
                theme === 'gradient' 
                  ? 'text-gray-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                Last activity: {course.lastActivity}
              </p>
            </div>
            
            <div className="flex items-center ml-4 space-x-3">
              <ProgressRing progress={course.progress} size={36} />
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-blue-600 dark:text-blue-400 p-1"
              >
                <PlayCircle size={20} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`mt-4 pt-4 border-t ${
        theme === 'gradient' 
          ? 'border-gray-700' 
          : 'border-gray-200 dark:border-gray-700'
      }`}>
        <Button 
          variant="outline" 
          className="w-full"
        >
          View All Courses
        </Button>
      </div>
    </Card>
  );
};
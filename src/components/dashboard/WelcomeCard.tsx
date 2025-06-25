import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';

export const WelcomeCard: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Card className={`text-white border-none overflow-hidden relative ${
      theme === 'gradient'
        ? 'bg-[var(--gradient-bg)]'
        : 'bg-gradient-to-r from-blue-600 to-indigo-700'
    }`}>
      <div className="absolute top-0 right-0 w-40 sm:w-56 h-40 sm:h-56 rounded-full bg-white/10 -mt-16 sm:-mt-20 -mr-16 sm:-mr-20 blur-2xl"></div>
      <div className="absolute bottom-0 left-1/4 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-indigo-500/20 -mb-8 sm:-mb-10 blur-xl"></div>
      
      <div className="relative z-10 p-4 sm:p-6">
        <h2 className="text-lg sm:text-2xl font-bold mb-1.5 sm:mb-2">Welcome to Vibe Coding Academy</h2>
        <p className="text-xs sm:text-base text-blue-100 mb-3 sm:mb-6 max-w-2xl">
          Your journey to building profitable AI tools, automated income systems, and 
          rapid wealth-building through code starts here. Explore our cutting-edge 
          platform designed to turn your coding skills into revenue streams.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            className="bg-white text-black/100 hover:bg-white/10 hover:text-white text-xs sm:text-base py-1.5 sm:py-2 w-full sm:w-auto" 
          >
            Continue Learning
          </Button>
          
          <Button 
            variant="outline" 
            className="border-white/30 text-white hover:bg-white/10 text-xs sm:text-base py-1.5 sm:py-2 w-full sm:w-auto"
          >
            Watch Introduction <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
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
      <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/10 -mt-20 -mr-20 blur-2xl"></div>
      <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full bg-indigo-500/20 -mb-10 blur-xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">Welcome to Vibe Coding Academy</h2>
        <p className="text-blue-100 mb-6 max-w-2xl">
          Your journey to building profitable AI tools, automated income systems, and 
          rapid wealth-building through code starts here. Explore our cutting-edge 
          platform designed to turn your coding skills into revenue streams.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-white text-black/100 hover:bg-white/10 hover:text-white" 
          >
            Continue Learning
          </Button>
          
          <Button 
            variant="outline" 
            className="border-white/30 text-white hover:bg-white/10"
          >
            Watch Introduction <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
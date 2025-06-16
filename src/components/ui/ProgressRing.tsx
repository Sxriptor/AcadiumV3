import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  theme?: string;
  gradientType?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 60,
  strokeWidth = 4,
  className = '',
  theme = 'light',
  gradientType = 'blueRed',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = () => {
    if (theme === 'gradient') {
      switch (gradientType) {
        case 'blueRed':
          return 'url(#blueRedGradient)';
        case 'purpleBlue':
          return 'url(#purpleBlueGradient)';
        case 'greenTeal':
          return 'url(#greenTealGradient)';
        case 'orangePink':
          return 'url(#orangePinkGradient)';
        case 'darkTeal':
          return 'url(#darkTealGradient)';
        default:
          return 'url(#blueRedGradient)';
      }
    }
    return '#3B82F6'; // Blue for light/dark themes
  };

  const gradientId = `${gradientType}Gradient`;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg 
        height={size} 
        width={size} 
        className="transform -rotate-90"
      >
        {theme === 'gradient' && (
          <defs>
            <linearGradient id="blueRedGradient\" x1="0%\" y1="0%\" x2="100%\" y2="100%">
              <stop offset="0%\" stopColor="#2563EB" />
              <stop offset="100%\" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="purpleBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="greenTealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
            <linearGradient id="orangePinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="darkTealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        )}
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-1000 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={getProgressColor()}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-sm font-medium">{Math.round(progress)}%</span>
    </div>
  );
};
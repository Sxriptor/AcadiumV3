import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';

interface HintStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  offset?: { x: number; y: number };
}

interface HintOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  steps: HintStep[];
  isNewUser?: boolean;
}

export const HintOverlay: React.FC<HintOverlayProps> = ({ isOpen, onClose, steps, isNewUser = false }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [wasSidebarCollapsed, setWasSidebarCollapsed] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle element highlighting and positioning
  useEffect(() => {
    if (!isOpen || steps.length === 0) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.targetSelector);
    
    if (element) {
      // Ensure element is visible by scrolling it into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedElement(element);
      
      if (!isMobile) {
        // Desktop tooltip positioning
        const rect = element.getBoundingClientRect();
        const tooltipWidth = 320;
        const tooltipHeight = 120;
        const offset = step.offset || { x: 0, y: 0 };
        
        let x = 0;
        let y = 0;
        
        switch (step.position) {
          case 'top':
            x = rect.left + (rect.width / 2) - (tooltipWidth / 2) + offset.x;
            y = rect.top - tooltipHeight - 16 + offset.y;
            break;
          case 'bottom':
            x = rect.left + (rect.width / 2) - (tooltipWidth / 2) + offset.x;
            y = rect.bottom + 16 + offset.y;
            break;
          case 'left':
            x = rect.left - tooltipWidth - 16 + offset.x;
            y = rect.top + (rect.height / 2) - (tooltipHeight / 2) + offset.y;
            break;
          case 'right':
            x = rect.right + 16 + offset.x;
            y = rect.top + (rect.height / 2) - (tooltipHeight / 2) + offset.y;
            break;
        }
        
        // Keep tooltip within viewport for desktop
        x = Math.max(16, Math.min(x, window.innerWidth - tooltipWidth - 16));
        y = Math.max(16, Math.min(y, window.innerHeight - tooltipHeight - 16));
        
        setTooltipPosition({ x, y });
      }
    }
  }, [isOpen, currentStep, steps, isMobile]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setHighlightedElement(null);
      setCurrentStep(0);
    }
  }, [isOpen]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  if (!isOpen || steps.length === 0) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      {/* Highlight border for target element */}
      {highlightedElement && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: highlightedElement.getBoundingClientRect().left - 4,
            top: highlightedElement.getBoundingClientRect().top - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
            border: '3px solid #3b82f6',
            borderRadius: '8px',
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.3)',
            animation: 'pulse 2s infinite',
          }}
        />
      )}
      
      {isMobile ? (
        // Mobile bottom sheet
        <div 
          className={`
            fixed bottom-0 left-0 right-0
            pointer-events-auto
            transition-transform duration-300 ease-out
            transform translate-y-0
            ${theme === 'gradient' || theme === 'dark'
              ? 'bg-gray-800 border-t border-gray-700'
              : 'bg-white border-t border-gray-200'
            }
            rounded-t-xl
            shadow-2xl
            max-h-[80vh]
            overflow-y-auto
            pb-safe
          `}
        >
          {/* Pull indicator */}
          <div className="sticky top-0 w-full flex justify-center pt-2 pb-1 bg-inherit">
            <div className={`w-12 h-1 rounded-full ${
              theme === 'gradient' || theme === 'dark'
                ? 'bg-gray-600'
                : 'bg-gray-300'
            }`} />
          </div>

          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${
            theme === 'gradient' || theme === 'dark'
              ? 'border-gray-700'
              : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {currentStep + 1}
              </div>
              <div>
                <h3 className={`font-semibold ${
                  theme === 'gradient' || theme === 'dark'
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  {currentStepData.title}
                </h3>
                {isNewUser && currentStep === 0 && (
                  <p className={`text-sm ${
                    theme === 'gradient' || theme === 'dark'
                      ? 'text-blue-300'
                      : 'text-blue-600'
                  }`}>
                    Welcome! Let's explore your new workspace
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                theme === 'gradient' || theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <p className={`text-base leading-relaxed ${
              theme === 'gradient' || theme === 'dark'
                ? 'text-gray-300'
                : 'text-gray-600'
            }`}>
              {currentStepData.description}
            </p>
          </div>
          
          {/* Footer */}
          <div className={`sticky bottom-0 flex items-center justify-between p-4 border-t bg-inherit ${
            theme === 'gradient' || theme === 'dark'
              ? 'border-gray-700'
              : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : theme === 'gradient' || theme === 'dark'
                        ? 'bg-gray-600'
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={skipTour}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  theme === 'gradient' || theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Skip
              </button>
              
              <div className="flex items-center space-x-2">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      theme === 'gradient' || theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                )}
                
                <button
                  onClick={nextStep}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    bg-blue-600 text-white hover:bg-blue-700
                  `}
                >
                  {currentStep === steps.length - 1 ? (
                    'Finish'
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Desktop tooltip
        <div
          className={`
            absolute pointer-events-auto rounded-lg shadow-2xl border
            max-w-sm min-w-80
            ${theme === 'gradient' || theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
            }
          `}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {/* Arrow */}
          <div
            className={`absolute w-4 h-4 transform rotate-45 ${
              theme === 'gradient' || theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
            style={{
              left: currentStepData.position === 'left' ? '100%' : 
                    currentStepData.position === 'right' ? '-8px' : '50%',
              top: currentStepData.position === 'top' ? '100%' : 
                   currentStepData.position === 'bottom' ? '-8px' : '50%',
              marginLeft: currentStepData.position === 'top' || currentStepData.position === 'bottom' ? '-8px' : '0',
              marginTop: currentStepData.position === 'left' || currentStepData.position === 'right' ? '-8px' : '0',
              borderLeftWidth: currentStepData.position === 'right' ? '1px' : '0',
              borderTopWidth: currentStepData.position === 'bottom' ? '1px' : '0',
              borderRightWidth: currentStepData.position === 'left' ? '1px' : '0',
              borderBottomWidth: currentStepData.position === 'top' ? '1px' : '0',
            }}
          />
          
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            theme === 'gradient' || theme === 'dark'
              ? 'border-gray-700'
              : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {currentStep + 1}
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${
                  theme === 'gradient' || theme === 'dark'
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  {currentStepData.title}
                </h3>
                {isNewUser && currentStep === 0 && (
                  <p className={`text-xs ${
                    theme === 'gradient' || theme === 'dark'
                      ? 'text-blue-300'
                      : 'text-blue-600'
                  }`}>
                    Welcome! Let's explore your new workspace
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-full transition-colors ${
                theme === 'gradient' || theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <p className={`text-sm leading-relaxed ${
              theme === 'gradient' || theme === 'dark'
                ? 'text-gray-300'
                : 'text-gray-600'
            }`}>
              {currentStepData.description}
            </p>
          </div>
          
          {/* Footer */}
          <div className={`flex items-center justify-between p-4 border-t ${
            theme === 'gradient' || theme === 'dark'
              ? 'border-gray-700'
              : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : theme === 'gradient' || theme === 'dark'
                        ? 'bg-gray-600'
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={skipTour}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  theme === 'gradient' || theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Skip Tour
              </button>
              
              <div className="flex items-center space-x-2">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      theme === 'gradient' || theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                    }`}
                  >
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Back
                  </button>
                )}
                
                <button
                  onClick={nextStep}
                  className="flex items-center px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {currentStep === steps.length - 1 ? (
                    'Finish'
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1), 0 0 25px rgba(59, 130, 246, 0.4);
          }
        }
      `}</style>
    </div>
  );
}; 
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../components/shared/MainContentTabs';
import { 
  Video, 
  Image, 
  Mic, 
  Film, 
  Sparkles, 
  Volume2, 
  Wand2,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Settings,
  Minus,
  Plus,
  Palette,
  Camera,
  Loader2
} from 'lucide-react';
import { useUserProgress } from '../hooks/useUserProgress';

interface Step {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  estimated_time?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface StepSection {
  id: string;
  title: string;
  description: string;
  steps: Step[];
}

interface AIToolPath {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: StepSection[];
}

const AICourseFactory: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('veo3');
  const [openTabs, setOpenTabs] = useState<Array<{id: string, title: string, content: React.ReactNode}>>([]);
  const [activeTab, setActiveTab] = useState('');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [checklistCollapsed, setChecklistCollapsed] = useState(false);
  
  // Use the custom hook for user progress
  const { 
    completedSteps, 
    loading: progressLoading, 
    markStepComplete, 
    markStepIncomplete, 
    isStepCompleted 
  } = useUserProgress(activeApp);

  const miniApps = [
    { id: 'veo3', name: 'Veo 3', icon: '🎬' },
    { id: 'midjourney', name: 'Midjourney', icon: '🎨' },
    { id: 'elevenlabs', name: 'ElevenLabs', icon: '🎤' },
    { id: 'runway', name: 'Runway', icon: '🛫' },
    { id: 'pika', name: 'Pika', icon: '⚡' },
    { id: 'topaz', name: 'Topaz', icon: '💎' },
    { id: 'sfx', name: 'SFX Generator', icon: '🔊' }
  ];

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    veo3: [
      {
        id: 'setup-veo3-access',
        title: 'Set up Veo 3 access',
        description: 'Get access to Google\'s Veo 3 video generation platform',
        completed: false
      },
      {
        id: 'write-video-prompts',
        title: 'Write effective video prompts',
        description: 'Craft detailed prompts for high-quality video generation',
        completed: false
      },
      {
        id: 'generate-test-videos',
        title: 'Generate test videos',
        description: 'Create sample videos to understand Veo 3 capabilities',
        completed: false
      },
      {
        id: 'refine-video-output',
        title: 'Refine video output',
        description: 'Iterate on prompts to improve video quality and style',
        completed: false
      },
      {
        id: 'export-final-videos',
        title: 'Export final videos',
        description: 'Download and prepare videos for post-processing',
        completed: false
      },
      {
        id: 'optimize-workflow',
        title: 'Optimize Veo 3 workflow',
        description: 'Develop efficient processes for consistent video creation',
        completed: false
      }
    ],
    midjourney: [
      {
        id: 'setup-midjourney-discord',
        title: 'Set up Midjourney Discord',
        description: 'Join Midjourney Discord server and configure access',
        completed: false
      },
      {
        id: 'learn-basic-prompting',
        title: 'Learn basic prompting',
        description: 'Master fundamental Midjourney prompt structure and syntax',
        completed: false
      },
      {
        id: 'experiment-with-styles',
        title: 'Experiment with art styles',
        description: 'Explore different artistic styles and aesthetic approaches',
        completed: false
      },
      {
        id: 'use-advanced-parameters',
        title: 'Use advanced parameters',
        description: 'Implement aspect ratios, quality settings, and style weights',
        completed: false
      },
      {
        id: 'create-consistent-characters',
        title: 'Create consistent characters',
        description: 'Develop techniques for character consistency across images',
        completed: false
      },
      {
        id: 'build-image-library',
        title: 'Build image library',
        description: 'Organize and curate generated images for projects',
        completed: false
      }
    ],
    elevenlabs: [
      {
        id: 'setup-elevenlabs-account',
        title: 'Set up ElevenLabs account',
        description: 'Create account and explore voice generation features',
        completed: false
      },
      {
        id: 'clone-or-select-voice',
        title: 'Clone or select voice',
        description: 'Choose from library voices or clone custom voice',
        completed: false
      },
      {
        id: 'optimize-voice-settings',
        title: 'Optimize voice settings',
        description: 'Adjust stability, clarity, and style settings',
        completed: false
      },
      {
        id: 'generate-test-audio',
        title: 'Generate test audio',
        description: 'Create sample audio to test voice quality and settings',
        completed: false
      },
      {
        id: 'batch-process-scripts',
        title: 'Batch process scripts',
        description: 'Generate multiple audio files efficiently',
        completed: false
      },
      {
        id: 'export-audio-files',
        title: 'Export audio files',
        description: 'Download high-quality audio in preferred formats',
        completed: false
      }
    ],
    runway: [
      {
        id: 'explore-runway-tools',
        title: 'Explore Runway tools',
        description: 'Familiarize with Runway\'s AI creation suite',
        completed: false
      },
      {
        id: 'create-text-to-video',
        title: 'Create text-to-video',
        description: 'Generate videos from text descriptions',
        completed: false
      },
      {
        id: 'use-image-to-video',
        title: 'Use image-to-video',
        description: 'Animate static images into dynamic videos',
        completed: false
      },
      {
        id: 'apply-video-effects',
        title: 'Apply video effects',
        description: 'Use AI effects to enhance and stylize videos',
        completed: false
      },
      {
        id: 'edit-and-composite',
        title: 'Edit and composite',
        description: 'Combine multiple AI-generated elements',
        completed: false
      },
      {
        id: 'render-final-output',
        title: 'Render final output',
        description: 'Export high-quality final videos',
        completed: false
      }
    ],
    pika: [
      {
        id: 'setup-pika-account',
        title: 'Set up Pika account',
        description: 'Access Pika Labs video generation platform',
        completed: false
      },
      {
        id: 'understand-pika-prompts',
        title: 'Understand Pika prompts',
        description: 'Learn Pika-specific prompting techniques',
        completed: false
      },
      {
        id: 'generate-short-videos',
        title: 'Generate short videos',
        description: 'Create dynamic short-form video content',
        completed: false
      },
      {
        id: 'animate-characters',
        title: 'Animate characters',
        description: 'Bring characters and objects to life with motion',
        completed: false
      },
      {
        id: 'adjust-motion-settings',
        title: 'Adjust motion settings',
        description: 'Control speed, direction, and animation intensity',
        completed: false
      },
      {
        id: 'create-video-sequences',
        title: 'Create video sequences',
        description: 'Build longer narratives from multiple clips',
        completed: false
      }
    ],
    topaz: [
      {
        id: 'install-topaz-software',
        title: 'Install Topaz software',
        description: 'Download and install Topaz AI enhancement tools',
        completed: false
      },
      {
        id: 'upscale-video-resolution',
        title: 'Upscale video resolution',
        description: 'Enhance video quality using Video Enhance AI',
        completed: false
      },
      {
        id: 'enhance-image-quality',
        title: 'Enhance image quality',
        description: 'Improve image resolution with Gigapixel AI',
        completed: false
      },
      {
        id: 'remove-video-noise',
        title: 'Remove video noise',
        description: 'Clean up grainy or noisy video footage',
        completed: false
      },
      {
        id: 'stabilize-shaky-footage',
        title: 'Stabilize shaky footage',
        description: 'Use AI to smooth out camera shake and movement',
        completed: false
      },
      {
        id: 'batch-process-media',
        title: 'Batch process media',
        description: 'Efficiently enhance multiple files simultaneously',
        completed: false
      }
    ],
    sfx: [
      {
        id: 'choose-sfx-generator',
        title: 'Choose SFX generator',
        description: 'Select AI tool for sound effect generation',
        completed: false
      },
      {
        id: 'describe-sound-effects',
        title: 'Describe sound effects',
        description: 'Write detailed descriptions for desired audio',
        completed: false
      },
      {
        id: 'generate-custom-sfx',
        title: 'Generate custom SFX',
        description: 'Create unique sound effects using AI generation',
        completed: false
      },
      {
        id: 'edit-and-layer-audio',
        title: 'Edit and layer audio',
        description: 'Combine and process generated sound effects',
        completed: false
      },
      {
        id: 'sync-audio-to-video',
        title: 'Sync audio to video',
        description: 'Precisely align sound effects with visual content',
        completed: false
      },
      {
        id: 'export-audio-library',
        title: 'Export audio library',
        description: 'Organize and save custom sound effect collection',
        completed: false
      }
    ]
  };

  const aiToolPaths: { [key: string]: AIToolPath } = {
    veo3: {
      id: 'veo3',
      title: 'Step-by-Step Veo 3 Video Creation',
      icon: <Video className="h-5 w-5" />,
      description: 'Create high-quality AI videos using Google\'s Veo 3 technology',
      sections: [
        {
          id: 'veo3-setup',
          title: '🎬 Veo 3 Setup',
          description: 'Get started with Veo 3 video generation',
          steps: [
            {
              id: 'veo3-step-1',
              title: 'Veo 3 Account Access',
              description: 'Set up access to Google\'s Veo 3 platform',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Getting Started with Veo 3</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Veo 3 is Google's latest AI video generation model that creates high-quality, realistic videos from text prompts.
                  </p>
                </div>
              )
            },
            {
              id: 'veo3-step-2',
              title: 'Prompt Engineering for Video',
              description: 'Learn to write effective prompts for video generation',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Prompt Engineering</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master the art of writing prompts that generate compelling video content.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'veo3-production',
          title: '🎥 Video Production',
          description: 'Generate and refine your videos',
          steps: [
            {
              id: 'veo3-step-3',
              title: 'Video Generation Process',
              description: 'Generate your first AI video with Veo 3',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Generation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn the complete process of generating high-quality videos with Veo 3.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    midjourney: {
      id: 'midjourney',
      title: 'Step-by-Step Midjourney Image Creation',
      icon: <Palette className="h-5 w-5" />,
      description: 'Create stunning AI images and artwork using Midjourney',
      sections: [
        {
          id: 'midjourney-setup',
          title: '🎨 Midjourney Setup',
          description: 'Get started with Midjourney image generation',
          steps: [
            {
              id: 'midjourney-step-1',
              title: 'Discord Setup',
              description: 'Set up Midjourney through Discord',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Midjourney Discord Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn how to access and use Midjourney through Discord for AI image generation.
                  </p>
                </div>
              )
            },
            {
              id: 'midjourney-step-2',
              title: 'Basic Prompting',
              description: 'Learn fundamental Midjourney prompting techniques',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Basic Prompting</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master the basics of writing effective prompts for Midjourney image generation.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'midjourney-advanced',
          title: '🎯 Advanced Techniques',
          description: 'Advanced Midjourney features and techniques',
          steps: [
            {
              id: 'midjourney-step-3',
              title: 'Advanced Parameters',
              description: 'Use advanced parameters for precise control',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Parameters</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn advanced Midjourney parameters for fine-tuned image generation.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    elevenlabs: {
      id: 'elevenlabs',
      title: 'Step-by-Step ElevenLabs Voice Creation',
      icon: <Mic className="h-5 w-5" />,
      description: 'Create realistic AI voices and speech synthesis',
      sections: [
        {
          id: 'elevenlabs-setup',
          title: '🎤 ElevenLabs Setup',
          description: 'Get started with AI voice generation',
          steps: [
            {
              id: 'elevenlabs-step-1',
              title: 'Account Setup',
              description: 'Create your ElevenLabs account and explore features',
              estimated_time: '10 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>ElevenLabs Account Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up your ElevenLabs account for realistic AI voice generation and speech synthesis.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    runway: {
      id: 'runway',
      title: 'Step-by-Step Runway AI Creation',
      icon: <Sparkles className="h-5 w-5" />,
      description: 'Create AI videos, images, and effects with Runway',
      sections: [
        {
          id: 'runway-setup',
          title: '🛫 Runway Setup',
          description: 'Get started with Runway AI tools',
          steps: [
            {
              id: 'runway-step-1',
              title: 'Platform Overview',
              description: 'Explore Runway\'s AI creation tools',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Runway Platform</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Discover Runway's comprehensive AI creation suite for videos, images, and effects.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    pika: {
      id: 'pika',
      title: 'Step-by-Step Pika Labs Video',
      icon: <Film className="h-5 w-5" />,
      description: 'Create dynamic video content with Pika Labs',
      sections: [
        {
          id: 'pika-setup',
          title: '⚡ Pika Setup',
          description: 'Get started with Pika video generation',
          steps: [
            {
              id: 'pika-step-1',
              title: 'Pika Account Setup',
              description: 'Set up your Pika Labs account',
              estimated_time: '10 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Pika Labs Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Get started with Pika Labs for AI video generation and animation.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    topaz: {
      id: 'topaz',
      title: 'Step-by-Step Topaz Enhancement',
      icon: <Wand2 className="h-5 w-5" />,
      description: 'Enhance video and image quality with Topaz AI',
      sections: [
        {
          id: 'topaz-setup',
          title: '💎 Topaz Setup',
          description: 'Set up Topaz AI enhancement tools',
          steps: [
            {
              id: 'topaz-step-1',
              title: 'Software Installation',
              description: 'Install and configure Topaz software',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Topaz Installation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Install and set up Topaz AI tools for video and image enhancement.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    sfx: {
      id: 'sfx',
      title: 'Step-by-Step SFX Generation',
      icon: <Volume2 className="h-5 w-5" />,
      description: 'Generate custom sound effects and audio',
      sections: [
        {
          id: 'sfx-setup',
          title: '🔊 SFX Setup',
          description: 'Set up AI sound effect generation',
          steps: [
            {
              id: 'sfx-step-1',
              title: 'SFX Tools Overview',
              description: 'Explore AI sound effect generation tools',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SFX Generation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to generate custom sound effects using AI tools.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    }
  };

  // Update active app when switching tools
  useEffect(() => {
    // Reset expanded step when changing tools
    setExpandedStep(null);
  }, [activeApp]);

  const currentAIToolPath = aiToolPaths[activeApp] || aiToolPaths.veo3;
  const totalSteps = currentAIToolPath.sections.reduce((acc, section) => acc + section.steps.length, 0);

  const toggleStep = (stepId: string) => {
    if (expandedStep === stepId) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepId);
    }
  };

  const handleMarkStepComplete = async (stepId: string) => {
    await markStepComplete(stepId);
  };

  const handleMarkStepIncomplete = async (stepId: string) => {
    await markStepIncomplete(stepId);
  };

  // State to store completion data for ALL apps
  const [allAppsCompletionData, setAllAppsCompletionData] = useState<{ [key: string]: { completed: number; total: number } }>({});

  // Function to fetch completion data for all apps
  const fetchAllAppsCompletionData = useCallback(async () => {
    try {
      const { data: { user } } = await (await import('../lib/supabase')).supabase.auth.getUser();
      if (!user) return;

      // Fetch all completed steps for this user across all tools
      const { data, error } = await (await import('../lib/supabase')).supabase
        .from('user_learning_progress')
        .select('tool_id, step_id')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw error;

      // Group completed steps by tool_id
      const completedStepsByTool: { [key: string]: Set<string> } = {};
      (data || []).forEach(item => {
        if (!completedStepsByTool[item.tool_id]) {
          completedStepsByTool[item.tool_id] = new Set();
        }
        completedStepsByTool[item.tool_id].add(item.step_id);
      });

      // Calculate completion data for all apps
      const completionData: { [key: string]: { completed: number; total: number } } = {};
      
      Object.keys(aiToolPaths).forEach(appId => {
        const path = aiToolPaths[appId];
        const totalStepsForApp = path.sections.reduce((total, section) => total + section.steps.length, 0);
        const completedStepsForApp = completedStepsByTool[appId]?.size || 0;
        
        completionData[appId] = {
          completed: completedStepsForApp,
          total: totalStepsForApp
        };
      });

      setAllAppsCompletionData(completionData);
    } catch (err) {
      console.error('Error fetching all apps completion data:', err);
    }
  }, []);

  // Load completion data for all apps on mount
  useEffect(() => {
    fetchAllAppsCompletionData();
    
    // Listen for progress updates and refresh data
    const handleProgressUpdate = () => {
      fetchAllAppsCompletionData();
    };
    
    window.addEventListener('userProgressUpdated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('userProgressUpdated', handleProgressUpdate);
    };
  }, [fetchAllAppsCompletionData]);

  const handleTabClose = (tabId: string) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : '');
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            AI Course Factory
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Create stunning AI-powered video content and educational courses
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {checklistCollapsed && (
            <button
              onClick={() => setChecklistCollapsed(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                theme === 'gradient' 
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 hover:bg-blue-600/30' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${theme === 'gradient' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                <span className="font-medium">Checklist</span>
              </div>
            </button>
          )}
          <Film className={`h-8 w-8 ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`} />
        </div>
      </div>

      {/* Mini App Switcher */}
      <MiniAppSwitcher 
        apps={miniApps}
        activeApp={activeApp}
        onAppChange={setActiveApp}
        completionData={allAppsCompletionData}
      />

      <div className={`grid gap-6 ${checklistCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Left Column - Collapsible Checklist */}
        {!checklistCollapsed && (
        <div className="lg:col-span-1">
            <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'} border rounded-lg overflow-hidden`}>
              <button
                onClick={() => setChecklistCollapsed(!checklistCollapsed)}
                className={`w-full px-4 py-3 flex items-center justify-between ${theme === 'gradient' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
              >
                <h3 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Video Production Checklist
                </h3>
                <Minus className={`h-5 w-5 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-300'}`} />
              </button>
              <div className="p-4">
                <EnhancedChecklist
                  title=""
                  items={checklistItems[activeApp] || []}
                  toolId={activeApp}
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Column - FAQ-Style AI Tool Guide and Tabs */}
        <div className={checklistCollapsed ? 'col-span-1' : 'lg:col-span-2'}>
          <div className="space-y-6">
            {/* FAQ-Style AI Tool Guide Section */}
            <div className={`${theme === 'gradient' ? 'bg-gray-800/30 border-gray-700' : 'bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'} border rounded-lg p-6`}>
              <div className="flex items-center mb-4">
                {currentAIToolPath.icon}
                <h2 className={`text-xl font-bold ml-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{currentAIToolPath.title}</h2>
              </div>
              <p className={`mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{currentAIToolPath.description}</p>
              
              {progressLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className={`h-8 w-8 animate-spin ${
                    theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
              ) : (
                /* FAQ-Style Steps */
                <div className="space-y-6">
                  {currentAIToolPath.sections.map((section, sectionIndex) => {
                    let stepCounter = 0;
                    // Calculate step number offset for this section
                    for (let i = 0; i < sectionIndex; i++) {
                      stepCounter += currentAIToolPath.sections[i].steps.length;
                    }
                    
                    return (
                      <div key={section.id} className="space-y-3">
                        {/* Section Header */}
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600'} border rounded-lg p-4`}>
                          <div className="flex items-center space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white`}>
                              {sectionIndex + 1}
                            </div>
                            <div>
                              <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{section.title}</h3>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{section.description}</p>
                            </div>
                            <div className="ml-auto">
                              <span className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'} px-3 py-1 rounded-full`}>
                                {section.steps.length} steps
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section Steps */}
                        <div className="space-y-2 ml-4">
                          {section.steps.map((step, stepIndex) => {
                            const isCompleted = isStepCompleted(step.id);
                            const isExpanded = expandedStep === step.id;
                            const globalStepNumber = stepCounter + stepIndex + 1;
                            
                            return (
                              <div key={step.id} className={`${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} border rounded-lg overflow-hidden`}>
                                <button
                                  onClick={() => toggleStep(step.id)}
                                  className={`w-full p-4 text-left ${theme === 'gradient' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'} transition-colors`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        isCompleted ? 'bg-green-500 text-white' : `${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white`
                                      }`}>
                                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : globalStepNumber}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{step.title}</h4>
                                        <p className={`text-sm mt-1 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>{step.description}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="flex items-center space-x-2 text-xs">
                                        <span className={`${theme === 'gradient' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                                          {step.estimated_time}
                                        </span>
                                        <span className={`px-2 py-1 rounded ${
                                          step.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                          step.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        }`}>
                                          {step.difficulty}
                                        </span>
                                      </div>
                                      {isExpanded ? (
                                        <ChevronDown className={`h-5 w-5 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
                                      ) : (
                                        <ChevronRight className={`h-5 w-5 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
                                      )}
                                    </div>
                                  </div>
                                </button>
                                
                                {isExpanded && (
                                  <div className={`px-6 pb-6 ${theme === 'gradient' ? 'bg-gray-800/20' : 'bg-gray-50 dark:bg-gray-800/20'}`}>
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                      {step.content}
                                    </div>
                                    <div className="flex justify-end mt-6">
                                      {isCompleted ? (
                                        <button
                                          onClick={() => handleMarkStepIncomplete(step.id)}
                                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex items-center"
                                        >
                                          <Minus className="h-4 w-4 mr-2" />
                                          Mark Incomplete
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleMarkStepComplete(step.id)}
                                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm flex items-center"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Mark Complete
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          {/* Progress Bar */}
          <div className={`mt-6 pt-4 ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} border-t`}>
            <div className={`flex items-center justify-between text-sm mb-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
              <span>Progress</span>
              <span>{completedSteps.size}/{totalSteps} steps completed</span>
            </div>
            <div className={`w-full ${theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'} rounded-full h-2`}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.size / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <MainContentTabs
            tabs={openTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTabClose={handleTabClose}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICourseFactory;
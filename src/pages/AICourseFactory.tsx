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
                    Veo 3 is Google's latest AI video generation model that creates high-quality, realistic videos from text prompts. It represents a significant advancement in AI video technology.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>What You'll Learn:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                      <li>How to access Google's Veo 3 platform</li>
                      <li>Understanding Veo 3's capabilities and limitations</li>
                      <li>Setting up your workspace for video generation</li>
                      <li>Preparing for your first video creation project</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Step 1: Understanding Veo 3</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Veo 3 is Google's most advanced video generation AI model. It can create videos up to 2 minutes long with 1080p resolution at 30fps.
                    </p>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Features:</h4>
                      <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>High-resolution video output (1080p)</li>
                        <li>Extended duration capability (up to 2 minutes)</li>
                        <li>Advanced understanding of physics and motion</li>
                        <li>Cinematic quality with realistic lighting</li>
                        <li>Support for various video styles and genres</li>
                      </ul>
                    </div>

                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Step 2: Accessing Veo 3</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Currently, Veo 3 access is limited and requires enrollment in Google's experimental program.
                    </p>

                    <div className={`${theme === 'gradient' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-800 dark:text-yellow-300'}`}>Access Requirements:</h4>
                      <ol className={`list-decimal list-inside space-y-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>
                        <li>Valid Google account</li>
                        <li>Application to Google's AI experimental programs</li>
                        <li>Acceptance into the Veo 3 preview program</li>
                        <li>Compliance with Google's usage policies</li>
                      </ol>
                    </div>

                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Step 3: Alternative Access Methods</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      While waiting for direct access, you can prepare by exploring similar tools and learning video generation principles.
                    </p>

                    <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Preparation Steps:</h4>
                      <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                        <li>Practice with available AI video tools</li>
                        <li>Study cinematography and video composition</li>
                        <li>Develop your prompt writing skills</li>
                        <li>Build a collection of reference materials</li>
                        <li>Join AI video generation communities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'veo3-step-2',
              title: 'Video Prompt Engineering',
              description: 'Learn to write effective prompts for video generation',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Prompt Engineering</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master the art of writing prompts that generate compelling video content. Effective prompting is crucial for getting high-quality results from Veo 3.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>What You'll Master:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
                      <li>Core principles of video prompt structure</li>
                      <li>Advanced prompting techniques for cinematic quality</li>
                      <li>Scene composition and visual storytelling</li>
                      <li>Technical parameters and quality controls</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Prompt Structure Framework</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      A well-structured prompt includes multiple components that guide the AI in creating your desired video.
                    </p>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential Prompt Components:</h4>
                      <div className="space-y-3">
                        <div>
                          <span className={`font-semibold ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'}`}>1. Subject &amp; Action:</span>
                          <span className={`ml-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>What is happening in the scene</span>
                        </div>
                        <div>
                          <span className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600 dark:text-green-400'}`}>2. Setting &amp; Environment:</span>
                          <span className={`ml-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Where the action takes place</span>
                        </div>
                        <div>
                          <span className={`font-semibold ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600 dark:text-yellow-400'}`}>3. Visual Style:</span>
                          <span className={`ml-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Cinematography, lighting, and aesthetic</span>
                        </div>
                        <div>
                          <span className={`font-semibold ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600 dark:text-purple-400'}`}>4. Technical Details:</span>
                          <span className={`ml-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Camera movement, duration, quality settings</span>
                        </div>
                      </div>
                    </div>

                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Prompt Examples &amp; Templates</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Basic Prompt:</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'} p-3 rounded text-sm font-mono`}>
                          "A golden retriever running through a meadow at sunset, cinematic lighting, 4K quality"
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Advanced Prompt:</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'} p-3 rounded text-sm font-mono`}>
                          "Tracking shot of a golden retriever bounding through tall grass in a sunlit meadow, golden hour lighting, shallow depth of field, cinematic composition, slow motion effect, professional wildlife photography style"
                        </div>
                      </div>
                    </div>

                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Prompting Techniques</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Camera Movement Keywords:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>tracking shot</span>
                          <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>dolly zoom</span>
                          <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>aerial view</span>
                          <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>close-up</span>
                          <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>pan left</span>
                          <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>tilt up</span>
                          <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>steadicam</span>
                          <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>handheld</span>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Lighting &amp; Mood:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <span className={`${theme === 'gradient' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'} px-2 py-1 rounded`}>golden hour</span>
                          <span className={`${theme === 'gradient' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'} px-2 py-1 rounded`}>soft lighting</span>
                          <span className={`${theme === 'gradient' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'} px-2 py-1 rounded`}>dramatic shadows</span>
                          <span className={`${theme === 'gradient' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'} px-2 py-1 rounded`}>backlit</span>
                          <span className={`${theme === 'gradient' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'} px-2 py-1 rounded`}>neon glow</span>
                          <span className={`${theme === 'gradient' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'} px-2 py-1 rounded`}>moody lighting</span>
                          <span className={`${theme === 'gradient' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'} px-2 py-1 rounded`}>rim lighting</span>
                          <span className={`${theme === 'gradient' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'} px-2 py-1 rounded`}>volumetric</span>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-800 dark:text-red-300'}`}>Common Mistakes to Avoid:</h4>
                      <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>
                        <li>Using too many conflicting style descriptions</li>
                        <li>Overcomplicating prompts with unnecessary details</li>
                        <li>Forgetting to specify video duration or quality</li>
                        <li>Not considering the AI's current limitations</li>
                        <li>Neglecting to test variations of successful prompts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'veo3-step-3',
              title: 'Video Style & Aesthetics',
              description: 'Master different video styles and visual aesthetics',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Style &amp; Aesthetics</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to create videos with specific visual styles, from cinematic to documentary, artistic to commercial. Master the art of crafting unique visual identities for your AI-generated videos.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300'}`}>Style Categories You'll Master:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
                      <li>Cinematic and film-style video generation</li>
                      <li>Documentary and realistic footage creation</li>
                      <li>Artistic and stylized video aesthetics</li>
                      <li>Commercial and promotional video styles</li>
                      <li>Music video and experimental formats</li>
                      <li>Social media optimized content</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Popular Video Styles</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'}`}>Cinematic Style:</h4>
                        <p className={`text-sm mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Professional film-quality with dramatic lighting and composition.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50 text-gray-300' : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'} p-2 rounded text-xs font-mono`}>
                          "cinematic, dramatic lighting, film grain, anamorphic lens, depth of field, 24fps"
                        </div>
                    </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600 dark:text-green-400'}`}>Documentary Style:</h4>
                        <p className={`text-sm mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Natural, realistic footage with authentic feel.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50 text-gray-300' : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'} p-2 rounded text-xs font-mono`}>
                          "documentary style, natural lighting, handheld camera, realistic, authentic, 30fps"
                        </div>
                      </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600 dark:text-purple-400'}`}>Artistic Style:</h4>
                        <p className={`text-sm mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Creative and experimental visual aesthetics.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50 text-gray-300' : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'} p-2 rounded text-xs font-mono`}>
                          "artistic, experimental, surreal, vibrant colors, abstract movements, stylized"
                        </div>
                    </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600 dark:text-yellow-400'}`}>Commercial Style:</h4>
                        <p className={`text-sm mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Professional marketing and advertising visuals.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50 text-gray-300' : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'} p-2 rounded text-xs font-mono`}>
                          "commercial quality, high production value, clean aesthetic, product focus, dynamic"
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-indigo-900/30 border-indigo-700' : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'} border rounded-lg p-4 mt-6`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-indigo-300' : 'text-indigo-800 dark:text-indigo-300'}`}>Style Enhancement Tips:</h4>
                      <ul className={`list-disc list-inside space-y-2 ${theme === 'gradient' ? 'text-indigo-200' : 'text-indigo-700 dark:text-indigo-200'}`}>
                        <li>Use consistent visual language throughout your video</li>
                        <li>Consider your target platform and audience</li>
                        <li>Combine multiple style elements thoughtfully</li>
                        <li>Test different variations to find your unique style</li>
                        <li>Document successful style combinations</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4 mt-4`}>
                      <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Technical Considerations:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'}`}>Frame Rates:</h5>
                      <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>24fps - Cinematic feel</li>
                            <li>30fps - Standard video</li>
                            <li>60fps - Smooth motion</li>
                      </ul>
                        </div>
                        <div>
                          <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600 dark:text-green-400'}`}>Aspect Ratios:</h5>
                          <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>16:9 - Standard widescreen</li>
                            <li>9:16 - Mobile/vertical</li>
                            <li>2.35:1 - Cinematic</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'veo3-step-4',
              title: 'Reference Images & Storyboarding',
              description: 'Use reference materials to guide video generation',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Reference Images &amp; Storyboarding</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to use reference images and create storyboards to guide your video generation for more precise results.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Advanced Techniques:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
                      <li>Using reference images to guide visual style</li>
                      <li>Creating effective storyboards for video sequences</li>
                      <li>Combining multiple reference sources</li>
                      <li>Planning complex video narratives</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Storyboard Planning Process</h3>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential Planning Steps:</h4>
                      <ol className={`list-decimal list-inside space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>Define the overall narrative or message</li>
                        <li>Break down the story into key scenes</li>
                        <li>Sketch or describe each scene visually</li>
                        <li>Plan transitions between scenes</li>
                        <li>Consider pacing and timing</li>
                        <li>Prepare reference materials for each scene</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'veo3-step-5',
              title: 'Video Generation Process',
              description: 'Generate your first AI video with Veo 3',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Generation Process</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn the complete process of generating high-quality videos with Veo 3. From initial prompt to final output, master every step of the workflow.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>What You'll Learn:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                      <li>Complete video generation workflow</li>
                      <li>Quality control and iteration techniques</li>
                      <li>Troubleshooting common generation issues</li>
                      <li>Optimizing generation settings for best results</li>
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Step-by-Step Generation Workflow</h3>

                  <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>1</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Prompt Preparation</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Start with a well-structured prompt that clearly describes your desired video content.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                          <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Preparation Checklist:</h5>
                          <ul className={`list-disc list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>Define the main subject and action</li>
                            <li>Specify the setting and environment</li>
                            <li>Choose your visual style and mood</li>
                            <li>Add technical specifications (duration, quality)</li>
                            <li>Review for clarity and coherence</li>
                          </ul>
                        </div>
                      </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-green-500' : 'bg-green-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>2</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Generation Settings</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Configure the optimal settings for your video generation task.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Quality Settings:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Resolution: 1080p (recommended)</li>
                              <li>• Frame rate: 30fps standard</li>
                              <li>• Duration: 5-120 seconds</li>
                              <li>• Style strength: Medium to High</li>
                      </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Advanced Options:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Motion intensity: Adjustable</li>
                              <li>• Seed value: For reproducibility</li>
                              <li>• Guidance scale: 7-15 range</li>
                              <li>• Negative prompts: Optional</li>
                            </ul>
                          </div>
                        </div>
                    </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-yellow-500' : 'bg-yellow-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>3</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Generation &amp; Monitoring</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Submit your prompt and monitor the generation process for optimal results.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                          <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Generation Timeline:</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Initial processing:</span>
                              <span className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>30-60 seconds</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Video generation:</span>
                              <span className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>2-5 minutes</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Post-processing:</span>
                              <span className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>30-60 seconds</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-purple-500' : 'bg-purple-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>4</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Quality Review &amp; Iteration</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Evaluate the generated video and iterate for improvements.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Quality Checklist:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Motion appears natural</li>
                              <li>• Objects maintain consistency</li>
                              <li>• Lighting is coherent</li>
                              <li>• No obvious artifacts</li>
                      </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>Iteration Options:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Adjust prompt details</li>
                              <li>• Modify generation settings</li>
                              <li>• Try different seed values</li>
                              <li>• Refine style parameters</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Troubleshooting Common Issues</h3>
                    
                    <div className="space-y-3">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-800 dark:text-red-300'}`}>Common Problems &amp; Solutions:</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className={`font-medium ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Blurry or low-quality output:</span>
                            <span className={`ml-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'}`}>Increase quality settings, refine prompt clarity</span>
                          </div>
                          <div>
                            <span className={`font-medium ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Unnatural motion:</span>
                            <span className={`ml-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'}`}>Reduce motion intensity, add physics keywords</span>
                          </div>
                          <div>
                            <span className={`font-medium ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Inconsistent objects:</span>
                            <span className={`ml-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'}`}>Simplify scene complexity, focus on fewer elements</span>
                          </div>
                          <div>
                            <span className={`font-medium ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Generation fails:</span>
                            <span className={`ml-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'}`}>Check prompt for prohibited content, try alternative wording</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Pro Tips for Better Results:</h4>
                      <ul className={`list-disc list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                        <li>Generate multiple variations using different seeds</li>
                        <li>Start with shorter durations for complex scenes</li>
                        <li>Use reference images when available to guide style</li>
                        <li>Keep detailed notes of successful prompt formulas</li>
                        <li>Experiment with different guidance scale values</li>
                        <li>Consider the computational cost of high-quality settings</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'veo3-step-6',
              title: 'Advanced Post-Processing',
              description: 'Enhance and refine your generated videos',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Post-Processing</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn professional post-processing techniques to enhance your AI-generated videos and achieve broadcast-quality results.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-indigo-900/30 border-indigo-700' : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-indigo-300' : 'text-indigo-800 dark:text-indigo-300'}`}>Post-Processing Skills:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-indigo-200' : 'text-indigo-700 dark:text-indigo-200'}`}>
                      <li>Video stabilization and motion correction</li>
                      <li>Color grading and cinematic look development</li>
                      <li>Audio synchronization and enhancement</li>
                      <li>Visual effects and compositing techniques</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential Post-Processing Tools</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'}`}>Professional Tools:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Adobe Premiere Pro</li>
                          <li>• DaVinci Resolve</li>
                          <li>• Final Cut Pro</li>
                          <li>• After Effects</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600 dark:text-green-400'}`}>Free Alternatives:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• OpenShot</li>
                          <li>• Shotcut</li>
                          <li>• Blender (VSE)</li>
                          <li>• Kdenlive</li>
                      </ul>
                    </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600 dark:text-purple-400'}`}>AI Enhancement:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Topaz Video AI</li>
                          <li>• Runway ML</li>
                          <li>• Warp Studio</li>
                          <li>• Descript</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'veo3-step-7',
              title: 'Export & Distribution',
              description: 'Optimize and distribute your final videos',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Export &amp; Distribution</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master the final steps of video production: optimizing exports for different platforms and distributing your content effectively.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-cyan-900/30 border-cyan-700' : 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-800 dark:text-cyan-300'}`}>Distribution Mastery:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-cyan-200' : 'text-cyan-700 dark:text-cyan-200'}`}>
                      <li>Platform-specific optimization strategies</li>
                      <li>Compression settings for quality vs. file size</li>
                      <li>Metadata and SEO optimization</li>
                      <li>Multi-platform publishing workflows</li>
                      </ul>
                    </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Platform-Specific Export Settings</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-red-300' : 'text-red-800 dark:text-red-300'}`}>YouTube Optimization:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>
                          <div><strong>Resolution:</strong> 1080p or 4K</div>
                          <div><strong>Frame Rate:</strong> 24, 25, 30, or 60fps</div>
                          <div><strong>Bitrate:</strong> 8-12 Mbps (1080p)</div>
                          <div><strong>Format:</strong> MP4 (H.264)</div>
                          <div><strong>Audio:</strong> AAC, 128-320 kbps</div>
                        </div>
                      </div>

                    <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Social Media (Instagram/TikTok):</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                          <div><strong>Aspect Ratio:</strong> 9:16 (vertical)</div>
                          <div><strong>Resolution:</strong> 1080x1920</div>
                          <div><strong>Duration:</strong> 15-60 seconds</div>
                          <div><strong>Format:</strong> MP4 (H.264)</div>
                          <div><strong>File Size:</strong> &lt;100MB</div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Generation Process</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn the complete process of generating high-quality videos with Veo 3. From initial prompt to final output, master every step of the workflow.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>What You'll Learn:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                      <li>Complete video generation workflow</li>
                      <li>Quality control and iteration techniques</li>
                      <li>Troubleshooting common generation issues</li>
                      <li>Optimizing generation settings for best results</li>
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Step-by-Step Generation Workflow</h3>

                  <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>1</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Prompt Preparation</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Start with a well-structured prompt that clearly describes your desired video content.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                          <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Preparation Checklist:</h5>
                          <ul className={`list-disc list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>Define the main subject and action</li>
                            <li>Specify the setting and environment</li>
                            <li>Choose your visual style and mood</li>
                            <li>Add technical specifications (duration, quality)</li>
                            <li>Review for clarity and coherence</li>
                          </ul>
                        </div>
                      </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-green-500' : 'bg-green-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>2</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Generation Settings</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Configure the optimal settings for your video generation task.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Quality Settings:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Resolution: 1080p (recommended)</li>
                              <li>• Frame rate: 30fps standard</li>
                              <li>• Duration: 5-120 seconds</li>
                              <li>• Style strength: Medium to High</li>
                      </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Advanced Options:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Motion intensity: Adjustable</li>
                              <li>• Seed value: For reproducibility</li>
                              <li>• Guidance scale: 7-15 range</li>
                              <li>• Negative prompts: Optional</li>
                            </ul>
                          </div>
                        </div>
                    </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-yellow-500' : 'bg-yellow-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>3</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Generation &amp; Monitoring</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Submit your prompt and monitor the generation process for optimal results.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                          <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Generation Timeline:</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Initial processing:</span>
                              <span className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>30-60 seconds</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Video generation:</span>
                              <span className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>2-5 minutes</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Post-processing:</span>
                              <span className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>30-60 seconds</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-purple-500' : 'bg-purple-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>4</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Quality Review &amp; Iteration</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Evaluate the generated video and iterate for improvements.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Quality Checklist:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Motion appears natural</li>
                              <li>• Objects maintain consistency</li>
                              <li>• Lighting is coherent</li>
                              <li>• No obvious artifacts</li>
                      </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>Iteration Options:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Adjust prompt details</li>
                              <li>• Modify generation settings</li>
                              <li>• Try different seed values</li>
                              <li>• Refine style parameters</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Troubleshooting Common Issues</h3>
                    
                    <div className="space-y-3">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-800 dark:text-red-300'}`}>Common Problems &amp; Solutions:</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className={`font-medium ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Blurry or low-quality output:</span>
                            <span className={`ml-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'}`}>Increase quality settings, refine prompt clarity</span>
                          </div>
                          <div>
                            <span className={`font-medium ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Unnatural motion:</span>
                            <span className={`ml-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'}`}>Reduce motion intensity, add physics keywords</span>
                          </div>
                          <div>
                            <span className={`font-medium ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Inconsistent objects:</span>
                            <span className={`ml-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'}`}>Simplify scene complexity, focus on fewer elements</span>
                          </div>
                          <div>
                            <span className={`font-medium ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Generation fails:</span>
                            <span className={`ml-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'}`}>Check prompt for prohibited content, try alternative wording</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Pro Tips for Better Results:</h4>
                      <ul className={`list-disc list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                        <li>Generate multiple variations using different seeds</li>
                        <li>Start with shorter durations for complex scenes</li>
                        <li>Use reference images when available to guide style</li>
                        <li>Keep detailed notes of successful prompt formulas</li>
                        <li>Experiment with different guidance scale values</li>
                        <li>Consider the computational cost of high-quality settings</li>
                      </ul>
                    </div>
                  </div>
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
                    Learn how to access and use Midjourney through Discord, the primary platform for interacting with the Midjourney AI image generation bot.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Setup Steps:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                      <li>Create a Discord account</li>
                      <li>Join the official Midjourney server</li>
                      <li>Subscribe to Midjourney service</li>
                      <li>Access the bot commands</li>
                      <li>Set up your workspace</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Step-by-Step Guide</h3>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>1. Discord Account Setup</h4>
                      <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>Visit discord.com and create an account</li>
                        <li>Verify your email address</li>
                        <li>Install Discord desktop app (recommended)</li>
                        <li>Set up two-factor authentication (optional but recommended)</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>2. Join Midjourney Server</h4>
                      <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>Visit midjourney.com</li>
                        <li>Click "Join the Beta"</li>
                        <li>Accept Discord server invitation</li>
                        <li>Read server rules and guidelines</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>3. Subscribe to Midjourney</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'}`}>Basic Plan:</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 200 GPU minutes</li>
                            <li>• Standard image generation</li>
                            <li>• Public visibility</li>
                            <li>• Community support</li>
                      </ul>
                        </div>
                        <div>
                          <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600 dark:text-purple-400'}`}>Standard Plan:</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Unlimited GPU minutes</li>
                            <li>• Fast image generation</li>
                            <li>• Private visibility option</li>
                            <li>• Priority support</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4 mt-6`}>
                    <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Getting Started Tips:</h4>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                      <li>Start in the #newbies channel</li>
                      <li>Watch the tutorial videos</li>
                      <li>Read the quick start guide</li>
                      <li>Join the community forums</li>
                      <li>Follow Midjourney on social media</li>
                    </ul>
                  </div>
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
                    Master the basics of writing effective prompts for Midjourney image generation. Learn the fundamental structure and components that make up a successful prompt.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Prompt Components:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
                      <li>Subject description</li>
                      <li>Art style and medium</li>
                      <li>Lighting and atmosphere</li>
                      <li>Color palette</li>
                      <li>Composition and framing</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Basic Prompt Structure</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Simple Prompt:</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'} p-3 rounded text-sm font-mono`}>
                          "/imagine a serene mountain lake at sunset, digital art"
                    </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Detailed Prompt:</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'} p-3 rounded text-sm font-mono`}>
                          "/imagine serene mountain lake, golden hour lighting, reflective water, snow-capped peaks, digital art, 4k, detailed, cinematic"
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Art Style Keywords:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>digital art</span>
                        <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>oil painting</span>
                        <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>watercolor</span>
                        <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>pencil sketch</span>
                        <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>3D render</span>
                        <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>pixel art</span>
                        <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>anime</span>
                        <span className={`${theme === 'gradient' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'} px-2 py-1 rounded`}>photorealistic</span>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'} border rounded-lg p-4`}>
                    <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-800 dark:text-red-300'}`}>Common Mistakes to Avoid:</h4>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>
                      <li>Using too many conflicting styles</li>
                      <li>Overcomplicating the description</li>
                      <li>Forgetting to specify art style</li>
                      <li>Using unclear or vague descriptions</li>
                      <li>Ignoring composition guidelines</li>
                    </ul>
                  </div>
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
                    Master advanced Midjourney parameters for precise control over your image generation. Learn to use aspect ratios, style weights, and other advanced features.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-indigo-900/30 border-indigo-700' : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-indigo-300' : 'text-indigo-800 dark:text-indigo-300'}`}>Advanced Controls:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-indigo-200' : 'text-indigo-700 dark:text-indigo-200'}`}>
                      <li>Aspect ratio control (--ar)</li>
                      <li>Style weights (--s, --stylize)</li>
                      <li>Chaos parameter (--c)</li>
                      <li>Quality parameter (--q)</li>
                      <li>Seed values (--seed)</li>
                      <li>Version selection (--v)</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Parameter Examples</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'}`}>Aspect Ratio:</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50 text-gray-300' : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'} p-2 rounded text-xs font-mono`}>
                          "/imagine mountain landscape --ar 16:9"
                        </div>
                        <p className={`mt-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Creates widescreen format images
                        </p>
                      </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600 dark:text-green-400'}`}>Style Weight:</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50 text-gray-300' : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'} p-2 rounded text-xs font-mono`}>
                          "/imagine portrait --s 750"
                        </div>
                        <p className={`mt-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Increases artistic stylization
                        </p>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Parameter Combinations:</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50 text-gray-300' : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'} p-3 rounded text-sm font-mono`}>
                        "/imagine futuristic city, cyberpunk style --ar 2:1 --s 750 --q 2 --v 5"
                      </div>
                      <ul className={`mt-3 space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• --ar 2:1: Wide panoramic aspect ratio</li>
                        <li>• --s 750: High stylization</li>
                        <li>• --q 2: High quality</li>
                        <li>• --v 5: Using version 5</li>
                      </ul>
                    </div>
                    </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'} border rounded-lg p-4`}>
                    <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-800 dark:text-yellow-300'}`}>Pro Tips:</h4>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>
                      <li>Save successful parameter combinations</li>
                      <li>Use seed values to iterate on good results</li>
                      <li>Experiment with different versions</li>
                      <li>Balance stylization with realism</li>
                      <li>Test different quality settings</li>
                    </ul>
                  </div>
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
                    Set up your ElevenLabs account for realistic AI voice generation and speech synthesis. ElevenLabs offers industry-leading AI voice cloning and text-to-speech capabilities.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>What You'll Learn:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                      <li>Creating and configuring your ElevenLabs account</li>
                      <li>Understanding subscription plans and limitations</li>
                      <li>Exploring the platform interface and features</li>
                      <li>Setting up your first voice generation project</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Step-by-Step Account Setup</h3>
                    
                    <div className="space-y-3">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-green-500' : 'bg-green-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>1</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Visit ElevenLabs.io</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Navigate to the official ElevenLabs website and click on "Sign Up" to create your account.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Pro Tip:</strong> Use your primary email address as you'll receive important updates and usage notifications.
                          </p>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>2</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Choose Your Plan</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Select the subscription plan that best fits your needs. Start with the free tier to test the platform.
                        </p>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Free Tier:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• 10,000 characters/month</li>
                              <li>• 3 custom voices</li>
                              <li>• Basic voice library</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Starter ($5/mo):</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• 30,000 characters/month</li>
                              <li>• 10 custom voices</li>
                              <li>• Full voice library</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Creator ($22/mo):</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• 100,000 characters/month</li>
                              <li>• 30 custom voices</li>
                              <li>• Commercial license</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'} border rounded-lg p-4`}>
                    <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-800 dark:text-yellow-300'}`}>Getting Started Checklist:</h4>
                    <ul className={`list-disc list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>
                      <li>Create account with verified email</li>
                      <li>Explore the voice library and sample different voices</li>
                      <li>Test basic text-to-speech functionality</li>
                      <li>Familiarize yourself with the dashboard layout</li>
                      <li>Review pricing and usage limits</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'elevenlabs-step-2',
              title: 'Voice Library Exploration',
              description: 'Navigate and select from ElevenLabs voice library',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Voice Library Exploration</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master the art of selecting the perfect voice for your content. Learn to navigate ElevenLabs' extensive voice library and understand voice characteristics.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Voice Selection Skills:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
                      <li>Understanding voice characteristics and qualities</li>
                      <li>Matching voices to content types and audiences</li>
                      <li>Testing voice samples for different use cases</li>
                      <li>Comparing accents, ages, and speaking styles</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Voice Categories &amp; Selection</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Professional Voices:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                          <div><strong>Narrator:</strong> Clear, authoritative, documentary-style</div>
                          <div><strong>Presenter:</strong> Engaging, conversational, educational</div>
                          <div><strong>Business:</strong> Professional, confident, corporate</div>
                          <div><strong>Audiobook:</strong> Expressive, character-driven, storytelling</div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Character Voices:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                          <div><strong>Animated:</strong> Playful, energetic, cartoon-like</div>
                          <div><strong>Gaming:</strong> Dramatic, character-specific, immersive</div>
                          <div><strong>Fantasy:</strong> Mystical, ethereal, otherworldly</div>
                          <div><strong>Historical:</strong> Period-appropriate, authentic accents</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-indigo-500' : 'bg-indigo-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>1</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Browse Voice Categories</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Explore different voice categories: Narration, Conversational, Characters, and more.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>Voice Filters:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Gender (Male/Female/Non-binary)</li>
                              <li>• Age (Young/Middle-aged/Mature)</li>
                              <li>• Accent (American/British/Australian)</li>
                              <li>• Use Case (Narration/Conversation)</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-600 dark:text-cyan-300'}`}>Testing Tips:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Use your actual script for testing</li>
                              <li>• Test with different emotions</li>
                              <li>• Check pronunciation of key terms</li>
                              <li>• Listen at different playback speeds</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'elevenlabs-voice-generation',
          title: '🎵 Voice Generation & Settings',
          description: 'Generate high-quality audio with custom settings',
          steps: [
            {
              id: 'elevenlabs-step-3',
              title: 'Text-to-Speech Generation',
              description: 'Create your first AI-generated speech',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Text-to-Speech Generation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to generate high-quality speech from text using ElevenLabs' advanced AI models. Master the settings and techniques for optimal results.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Generation Mastery:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                      <li>Understanding voice stability and clarity settings</li>
                      <li>Optimizing text formatting for natural speech</li>
                      <li>Using SSML tags for advanced control</li>
                      <li>Managing generation costs and credits</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Voice Settings Explained</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Stability Setting:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                          <div><strong>Low (0-30):</strong> More expressive, variable</div>
                          <div><strong>Medium (30-70):</strong> Balanced consistency</div>
                          <div><strong>High (70-100):</strong> Very consistent, monotone</div>
                          <div className="pt-2 text-xs">
                            <em>Higher stability = more predictable output</em>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Clarity + Similarity:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
                          <div><strong>Low:</strong> More creative interpretation</div>
                          <div><strong>Medium:</strong> Balanced approach</div>
                          <div><strong>High:</strong> Closer to original voice</div>
                          <div className="pt-2 text-xs">
                            <em>Higher similarity = closer to training data</em>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-orange-500' : 'bg-orange-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>1</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Prepare Your Text</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Format your text properly for natural-sounding speech generation.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Good Practices:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Use proper punctuation</li>
                              <li>• Write numbers as words</li>
                              <li>• Include natural pauses</li>
                              <li>• Use conversational language</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'}`}>Avoid:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• ALL CAPS text</li>
                              <li>• Complex abbreviations</li>
                              <li>• Excessive punctuation!!!</li>
                              <li>• Very long sentences</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>2</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Generate &amp; Preview</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Generate your audio and use the preview to check quality before finalizing.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-cyan-900/30 border-cyan-700' : 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700'} border rounded-lg p-3`}>
                          <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-800 dark:text-cyan-300'}`}>Quality Check:</h6>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-cyan-200' : 'text-cyan-700 dark:text-cyan-200'}`}>
                            <li>• Listen to pronunciation accuracy</li>
                            <li>• Check emotional tone consistency</li>
                            <li>• Verify natural speech rhythm</li>
                            <li>• Test at different playback speeds</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'elevenlabs-step-4',
              title: 'Advanced Voice Settings',
              description: 'Master advanced settings and SSML for precise control',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Voice Settings</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Unlock the full potential of ElevenLabs with advanced settings, SSML tags, and fine-tuning techniques for professional-grade voice generation.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-indigo-900/30 border-indigo-700' : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-indigo-300' : 'text-indigo-800 dark:text-indigo-300'}`}>Advanced Techniques:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-indigo-200' : 'text-indigo-700 dark:text-indigo-200'}`}>
                      <li>SSML markup for precise speech control</li>
                      <li>Voice style and emotion adjustments</li>
                      <li>Speed and pitch modifications</li>
                      <li>Pronunciation customization</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SSML Tags Reference</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300'}`}>Timing Control:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'} font-mono`}>
                          <div>&lt;break time="2s"/&gt; - 2 second pause</div>
                          <div>&lt;prosody rate="slow"&gt; - Slower speech</div>
                          <div>&lt;prosody rate="fast"&gt; - Faster speech</div>
                          <div>&lt;emphasis level="strong"&gt; - Emphasis</div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-teal-900/30 border-teal-700' : 'bg-teal-50 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-teal-300' : 'text-teal-800 dark:text-teal-300'}`}>Voice Quality:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-teal-200' : 'text-teal-700 dark:text-teal-200'} font-mono`}>
                          <div>&lt;say-as interpret-as="spell-out"&gt; - Spell letters</div>
                          <div>&lt;phoneme alphabet="ipa" ph="həˈloʊ"&gt; - Pronunciation</div>
                          <div>&lt;voice name="Rachel"&gt; - Switch voice</div>
                          <div>&lt;lang xml:lang="es-ES"&gt; - Language switch</div>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>SSML Example:</h4>
                      <div className={`bg-gray-900 p-3 rounded text-sm text-green-400 font-mono overflow-x-auto`}>
{`<speak>
  <prosody rate="medium" pitch="medium">
    Welcome to our presentation.
    <break time="1s"/>
    <emphasis level="strong">This is important!</emphasis>
    <break time="0.5s"/>
    Let's continue with <prosody rate="slow">careful attention</prosody> to detail.
  </prosody>
</speak>`}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'elevenlabs-production',
          title: '🚀 Production & Export',
          description: 'Export and optimize your audio for different uses',
          steps: [
            {
              id: 'elevenlabs-step-5',
              title: 'Audio Export &amp; Formats',
              description: 'Export your generated audio in the right format',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Audio Export &amp; Formats</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to export your generated audio in the optimal format for your intended use case, from podcasts to commercial applications.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-cyan-900/30 border-cyan-700' : 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-800 dark:text-cyan-300'}`}>Export Mastery:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-cyan-200' : 'text-cyan-700 dark:text-cyan-200'}`}>
                      <li>Choosing the right audio format and quality</li>
                      <li>Understanding file sizes and compression</li>
                      <li>Post-processing for different applications</li>
                      <li>Batch export for multiple files</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Audio Format Guide</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>MP3 Format:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                          <div><strong>Best for:</strong> Podcasts, streaming, web</div>
                          <div><strong>Quality:</strong> Good compression ratio</div>
                          <div><strong>File Size:</strong> Small to medium</div>
                          <div><strong>Compatibility:</strong> Universal support</div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>WAV Format:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                          <div><strong>Best for:</strong> Professional audio, editing</div>
                          <div><strong>Quality:</strong> Lossless, highest quality</div>
                          <div><strong>File Size:</strong> Large</div>
                          <div><strong>Compatibility:</strong> Professional software</div>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-800 dark:text-yellow-300'}`}>Quality Recommendations:</h4>
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <strong className={`${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>Podcasts:</strong>
                          <div className={`${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>MP3, 128 kbps</div>
                        </div>
                        <div>
                          <strong className={`${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>Commercial:</strong>
                          <div className={`${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>WAV, 48kHz/24-bit</div>
                        </div>
                        <div>
                          <strong className={`${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>YouTube:</strong>
                          <div className={`${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>MP3, 192 kbps</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'elevenlabs-step-6',
              title: 'Workflow Optimization',
              description: 'Build efficient workflows for content creation',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Workflow Optimization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Develop efficient workflows for consistent, high-quality voice generation. Learn to manage projects, organize files, and streamline your production process.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-emerald-900/30 border-emerald-700' : 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-emerald-300' : 'text-emerald-800 dark:text-emerald-300'}`}>Workflow Excellence:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-emerald-200' : 'text-emerald-700 dark:text-emerald-200'}`}>
                      <li>Project organization and file management</li>
                      <li>Voice consistency across multiple recordings</li>
                      <li>Batch processing for efficiency</li>
                      <li>Quality control and review processes</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Production Workflow</h3>
                    
                    <div className="space-y-3">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>1</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Script Preparation</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Prepare and format all your scripts with consistent styling and SSML markup.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Organization:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Create project folders</li>
                              <li>• Use consistent naming</li>
                              <li>• Version control scripts</li>
                              <li>• Tag voice requirements</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Formatting:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Standardize punctuation</li>
                              <li>• Add SSML markup</li>
                              <li>• Mark pronunciation notes</li>
                              <li>• Include timing cues</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-purple-500' : 'bg-purple-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>2</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Batch Generation</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Generate multiple audio files efficiently using consistent settings.
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-indigo-900/30 border-indigo-700' : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'} border rounded-lg p-3`}>
                          <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-indigo-300' : 'text-indigo-800 dark:text-indigo-300'}`}>Batch Tips:</h6>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-indigo-200' : 'text-indigo-700 dark:text-indigo-200'}`}>
                            <li>• Use same voice settings for consistency</li>
                            <li>• Generate similar content together</li>
                            <li>• Save settings as presets</li>
                            <li>• Monitor credit usage</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-rose-900/30 border-rose-700' : 'bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-rose-300' : 'text-rose-800 dark:text-rose-300'}`}>Quality Control Checklist:</h4>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <h6 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-rose-200' : 'text-rose-700 dark:text-rose-200'}`}>Audio Quality:</h6>
                          <ul className={`space-y-1 ${theme === 'gradient' ? 'text-rose-200' : 'text-rose-700 dark:text-rose-200'}`}>
                            <li>✓ Clear pronunciation</li>
                            <li>✓ Consistent volume</li>
                            <li>✓ Natural pacing</li>
                            <li>✓ No artifacts or glitches</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-rose-200' : 'text-rose-700 dark:text-rose-200'}`}>Content Check:</h6>
                          <ul className={`space-y-1 ${theme === 'gradient' ? 'text-rose-200' : 'text-rose-700 dark:text-rose-200'}`}>
                            <li>✓ Accurate text rendering</li>
                            <li>✓ Proper emotion/tone</li>
                            <li>✓ Consistent character voice</li>
                            <li>✓ Appropriate timing</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Runway Platform Overview</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Discover Runway's comprehensive AI creation suite for videos, images, and effects. Runway ML is a powerful platform that democratizes AI-powered creative tools for content creators, filmmakers, and digital artists.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>What You'll Master:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                      <li>Understanding Runway's AI creation ecosystem</li>
                      <li>Navigating the platform interface and tools</li>
                      <li>Exploring video generation and editing capabilities</li>
                      <li>Learning pricing models and credit system</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Runway AI Tools Overview</h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Gen-3 Alpha Turbo:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
                          <div><strong>Purpose:</strong> Advanced text-to-video generation</div>
                          <div><strong>Capability:</strong> 10-second HD video clips</div>
                          <div><strong>Best for:</strong> Creative video content, concepts</div>
                          <div><strong>Quality:</strong> High-resolution, coherent motion</div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Image-to-Video:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                          <div><strong>Purpose:</strong> Animate static images</div>
                          <div><strong>Capability:</strong> Camera movements, motion paths</div>
                          <div><strong>Best for:</strong> Product demos, storytelling</div>
                          <div><strong>Quality:</strong> Smooth animation from photos</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300'}`}>Motion Brush:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
                          <div><strong>Purpose:</strong> Selective animation control</div>
                          <div><strong>Capability:</strong> Paint motion onto specific areas</div>
                          <div><strong>Best for:</strong> Precise animation control</div>
                          <div><strong>Quality:</strong> Professional-level motion design</div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-cyan-900/30 border-cyan-700' : 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700'} border rounded-lg p-4`}>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-800 dark:text-cyan-300'}`}>Video Editor:</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-cyan-200' : 'text-cyan-700 dark:text-cyan-200'}`}>
                          <div><strong>Purpose:</strong> AI-powered video editing</div>
                          <div><strong>Capability:</strong> Cut, trim, enhance footage</div>
                          <div><strong>Best for:</strong> Post-production workflows</div>
                          <div><strong>Quality:</strong> Professional editing tools</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>1</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Account Setup</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Create your Runway account and explore the free tier to understand the platform capabilities.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Free Tier:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• 125 credits per month</li>
                              <li>• Gen-3 Alpha access</li>
                              <li>• Basic video tools</li>
                              <li>• Community support</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Standard ($15/mo):</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• 625 credits per month</li>
                              <li>• All AI tools access</li>
                              <li>• Priority generation</li>
                              <li>• Email support</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-indigo-900/30 border-indigo-700' : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'} border rounded-lg p-4`}>
                    <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-indigo-300' : 'text-indigo-800 dark:text-indigo-300'}`}>Platform Navigation Tips:</h4>
                    <ul className={`list-disc list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-indigo-200' : 'text-indigo-700 dark:text-indigo-200'}`}>
                      <li>Start with the Dashboard to see all available tools</li>
                      <li>Use the Asset Library to manage your creations</li>
                      <li>Check Credits balance before starting projects</li>
                      <li>Explore Templates for inspiration and quick starts</li>
                      <li>Join the Community for tips and inspiration</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'runway-step-2',
              title: 'Gen-3 Alpha Setup',
              description: 'Master text-to-video generation with Gen-3 Alpha',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Gen-3 Alpha Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master Runway's Gen-3 Alpha Turbo for creating stunning AI-generated videos from text prompts. This powerful model can generate up to 10 seconds of high-quality video content.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Gen-3 Alpha Mastery:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
                      <li>Crafting effective video generation prompts</li>
                      <li>Understanding generation settings and parameters</li>
                      <li>Managing credits and generation costs</li>
                      <li>Optimizing for different video styles and genres</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Generation Process</h3>
                    
                    <div className="space-y-3">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-green-500' : 'bg-green-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>1</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Prompt Engineering</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Create detailed, specific prompts that describe the video you want to generate.
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Effective Prompts:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Be specific about actions</li>
                              <li>• Include camera movements</li>
                              <li>• Describe lighting and mood</li>
                              <li>• Specify duration needs</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>Example Prompt:</h6>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              "A serene mountain lake at sunset, camera slowly panning right, golden light reflecting on water, misty atmosphere, cinematic 4K"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700'} border rounded-lg p-4`}>
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center text-sm font-bold mr-3`}>2</div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Generation Settings</h4>
                        </div>
                        <p className={`mb-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Configure duration, aspect ratio, and quality settings for optimal results.
                        </p>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Duration:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• 5 seconds: 10 credits</li>
                              <li>• 10 seconds: 20 credits</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Aspect Ratio:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• 16:9 (Landscape)</li>
                              <li>• 9:16 (Portrait)</li>
                              <li>• 1:1 (Square)</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                            <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-600 dark:text-cyan-300'}`}>Resolution:</h6>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• 1280x768 (HD)</li>
                              <li>• High quality output</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'} border rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-amber-300' : 'text-amber-800 dark:text-amber-300'}`}>Pro Generation Tips:</h4>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <h6 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-amber-200' : 'text-amber-700 dark:text-amber-200'}`}>For Better Results:</h6>
                          <ul className={`space-y-1 ${theme === 'gradient' ? 'text-amber-200' : 'text-amber-700 dark:text-amber-200'}`}>
                            <li>• Use cinematic language</li>
                            <li>• Specify camera angles</li>
                            <li>• Include lighting details</li>
                            <li>• Describe motion clearly</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-amber-200' : 'text-amber-700 dark:text-amber-200'}`}>Credit Management:</h6>
                          <ul className={`space-y-1 ${theme === 'gradient' ? 'text-amber-200' : 'text-amber-700 dark:text-amber-200'}`}>
                            <li>• Start with 5-second tests</li>
                            <li>• Iterate prompts efficiently</li>
                            <li>• Use preview features</li>
                            <li>• Plan generation batches</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'runway-step-3',
              title: 'Motion Brush Mastery',
              description: 'Learn advanced motion brush techniques',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Motion Brush Techniques</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master Runway's Motion Brush tool for precise control over video animation and movement.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300'}`}>Motion Brush Controls:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
                      <li>Brush size and hardness settings</li>
                      <li>Motion direction and intensity</li>
                      <li>Layer masking and isolation</li>
                      <li>Motion path customization</li>
                    </ul>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Basic Techniques:</h6>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Simple object animation</li>
                        <li>• Background motion effects</li>
                        <li>• Character movement</li>
                        <li>• Particle systems</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Advanced Applications:</h6>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Multi-layer animations</li>
                        <li>• Complex motion paths</li>
                        <li>• Speed variations</li>
                        <li>• Motion tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'runway-step-4',
              title: 'Video Editor Pro',
              description: 'Master Runway\'s professional video editing tools',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Professional Video Editing</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to use Runway's professional video editing suite for post-production and enhancement.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-cyan-900/30 border-cyan-700' : 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-800 dark:text-cyan-300'}`}>Editor Features:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-cyan-200' : 'text-cyan-700 dark:text-cyan-200'}`}>
                      <li>Timeline editing and trimming</li>
                      <li>Transition effects and animations</li>
                      <li>Color grading and correction</li>
                      <li>Audio synchronization</li>
                    </ul>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Basic Editing:</h6>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Cut and trim clips</li>
                        <li>• Add transitions</li>
                        <li>• Adjust speed</li>
                        <li>• Basic effects</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Advanced Editing:</h6>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Multi-track composition</li>
                        <li>• Advanced color grading</li>
                        <li>• Motion tracking</li>
                        <li>• Custom effects</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'runway-step-5',
              title: 'Advanced AI Effects',
              description: 'Apply and customize AI-powered video effects',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AI Effects Suite</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master Runway's AI-powered effects for enhancing and transforming your videos.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Available Effects:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                      <li>Style transfer and artistic filters</li>
                      <li>Background removal and replacement</li>
                      <li>Object tracking and masking</li>
                      <li>Scene enhancement and stabilization</li>
                    </ul>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Effect Parameters:</h6>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Intensity control</li>
                        <li>• Blend modes</li>
                        <li>• Mask refinement</li>
                        <li>• Temporal consistency</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Workflow Tips:</h6>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Effect stacking</li>
                        <li>• Performance optimization</li>
                        <li>• Render settings</li>
                        <li>• Export formats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'runway-step-6',
              title: 'Project Management',
              description: 'Organize and manage complex Runway projects',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Project Organization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to efficiently manage and organize your Runway projects for optimal workflow.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-indigo-900/30 border-indigo-700' : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-indigo-300' : 'text-indigo-800 dark:text-indigo-300'}`}>Project Structure:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-indigo-200' : 'text-indigo-700 dark:text-indigo-200'}`}>
                      <li>Asset organization and management</li>
                      <li>Version control and backups</li>
                      <li>Collaboration features</li>
                      <li>Resource optimization</li>
                    </ul>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Organization Tips:</h6>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Folder structure</li>
                        <li>• Naming conventions</li>
                        <li>• Asset libraries</li>
                        <li>• Project templates</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Workflow Management:</h6>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Task tracking</li>
                        <li>• Resource planning</li>
                        <li>• Team collaboration</li>
                        <li>• Quality control</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
                  id: 'runway-step-7',
                  title: 'Advanced Gen-3 Integration',
                  description: 'Combine Gen-3 with other Runway tools',
                  estimated_time: '35 min',
                  difficulty: 'Advanced',
                  content: (
                    <div className="space-y-6">
                      <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Gen-3 Integration</h2>
                      <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Learn to combine Gen-3 Alpha with other Runway tools for sophisticated video production workflows.
                      </p>

                      <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                        <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Integration Techniques:</h3>
                        <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
                          <li>Combining Gen-3 with Motion Brush</li>
                          <li>Enhancing Gen-3 output with AI effects</li>
                          <li>Multi-stage video generation</li>
                          <li>Advanced prompt chaining</li>
                        </ul>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                          <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Workflow Steps:</h6>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Initial video generation</li>
                            <li>• Motion enhancement</li>
                            <li>• Effect application</li>
                            <li>• Final refinement</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                          <h6 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Best Practices:</h6>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Quality preservation</li>
                            <li>• Style consistency</li>
                            <li>• Performance optimization</li>
                            <li>• Version control</li>
                          </ul>
                        </div>
                      </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Advanced Techniques:</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>Multi-Tool Workflow:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                          Create a seamless pipeline combining Gen-3 Alpha with Motion Brush, Green Screen, and AI effects for professional-grade video production.
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>Prompt Chaining:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                          Master advanced prompt engineering techniques to create complex, multi-stage video narratives with consistent style and quality.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300'}`}>Practical Exercise:</h3>
                    <p className={`text-sm mb-3 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
                      Create a 30-second promotional video using the complete Runway workflow:
                    </p>
                    <ol className={`list-decimal list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-orange-100' : 'text-orange-600 dark:text-orange-100'}`}>
                      <li>Generate base video with Gen-3 Alpha</li>
                      <li>Add motion effects with Motion Brush</li>
                      <li>Apply background replacement with Green Screen</li>
                      <li>Enhance with AI effects and filters</li>
                      <li>Export in professional quality</li>
                    </ol>
                  </div>
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
          title: '⚡ Pika Setup & Fundamentals',
          description: 'Master Pika Labs basics and platform navigation',
          steps: [
            {
              id: 'pika-step-1',
              title: 'Pika Labs Account Setup',
              description: 'Set up your Pika Labs account and understand the platform',
              estimated_time: '15 min',
              difficulty: 'Beginner',
                  content: (
                    <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Pika Labs Setup & Platform Overview</h2>
                      <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Get started with Pika Labs, the revolutionary AI video generation platform that's changing how content creators approach video production.
                      </p>

                      <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>What is Pika Labs?</h3>
                        <ul className={`list-disc list-inside space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                      <li>AI-powered video generation platform</li>
                      <li>Text-to-video and image-to-video capabilities</li>
                      <li>Advanced motion control and effects</li>
                      <li>Professional-quality output in minutes</li>
                        </ul>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Getting Started:</h4>
                      <ol className={`text-sm space-y-1 list-decimal list-inside ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>Visit pika.art</li>
                        <li>Sign up with Discord or email</li>
                        <li>Join the Discord community</li>
                        <li>Familiarize with the interface</li>
                        <li>Review pricing plans</li>
                      </ol>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Key Features:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Text-to-video generation</li>
                        <li>• Image animation</li>
                        <li>• Style control</li>
                        <li>• Motion parameters</li>
                        <li>• Aspect ratio options</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'pika-step-2',
              title: 'Platform Navigation & Interface',
              description: 'Master the Pika Labs interface and core features',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Platform Navigation & Interface</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to navigate Pika Labs efficiently and understand all the tools at your disposal for creating stunning AI videos.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Interface Components:</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>Main Dashboard:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
                          <li>• Recent generations</li>
                          <li>• Community feed</li>
                          <li>• Quick actions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>Creation Tools:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
                          <li>• Prompt input</li>
                          <li>• Parameter controls</li>
                          <li>• Style presets</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Generation Types:</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Text to Video</li>
                        <li>• Image to Video</li>
                        <li>• Video to Video</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Controls:</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Motion strength</li>
                        <li>• Camera movement</li>
                        <li>• Style guidance</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>Output Options:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Resolution settings</li>
                        <li>• Aspect ratios</li>
                        <li>• Duration control</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
            }
          ]
        },
        {
          id: 'pika-creation',
          title: '🎬 Video Creation Mastery',
          description: 'Learn advanced techniques for creating stunning videos',
          steps: [
            {
              id: 'pika-step-3',
              title: 'Text-to-Video Generation',
              description: 'Master the art of creating videos from text prompts',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
                  content: (
                    <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Text-to-Video Generation</h2>
                      <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to craft compelling prompts that generate professional-quality videos from text descriptions.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Prompt Engineering Best Practices:</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>Structure:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                          [Subject] + [Action] + [Setting] + [Style] + [Camera Movement]
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>Example:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                          "A golden retriever running through a sunlit meadow, cinematic style, slow motion, camera tracking"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Effective Keywords:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• "Cinematic lighting"</li>
                        <li>• "Slow motion"</li>
                        <li>• "Dynamic camera"</li>
                        <li>• "Professional quality"</li>
                        <li>• "Smooth movement"</li>
                        </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Camera Movements:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• "Zoom in/out"</li>
                        <li>• "Pan left/right"</li>
                        <li>• "Tilt up/down"</li>
                        <li>• "Tracking shot"</li>
                        <li>• "Dolly movement"</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300'}`}>Practice Exercise:</h3>
                    <p className={`text-sm mb-3 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
                      Create 3 different videos using these prompts:
                    </p>
                    <ol className={`list-decimal list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-orange-100' : 'text-orange-600 dark:text-orange-100'}`}>
                      <li>"A bustling city street at night, neon lights reflecting on wet pavement, cinematic"</li>
                      <li>"Ocean waves crashing on rocky shore, dramatic sunset, slow motion"</li>
                      <li>"Coffee steam rising from a cup, cozy cafe atmosphere, macro lens"</li>
                    </ol>
                  </div>
                </div>
              )
            },
            {
              id: 'pika-step-4',
              title: 'Image-to-Video Animation',
              description: 'Bring static images to life with AI animation',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Image-to-Video Animation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Transform static images into dynamic videos with realistic motion and effects using Pika's advanced animation capabilities.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Animation Workflow:</h3>
                    <ol className={`list-decimal list-inside space-y-2 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                      <li>Upload your source image (PNG, JPG, WebP)</li>
                      <li>Add motion description prompt</li>
                      <li>Adjust motion strength (1-4 scale)</li>
                      <li>Set camera movement parameters</li>
                      <li>Generate and refine</li>
                    </ol>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Motion Types:</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Natural movement (hair, clothes)</li>
                        <li>• Environmental effects (wind, water)</li>
                        <li>• Character animation</li>
                        <li>• Object transformation</li>
                        <li>• Particle effects</li>
                          </ul>
                        </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Best Image Types:</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• High-resolution portraits</li>
                        <li>• Landscape photography</li>
                        <li>• Product shots</li>
                        <li>• Architectural images</li>
                        <li>• Digital artwork</li>
                          </ul>
                        </div>
                      </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-800 dark:text-yellow-300'}`}>Pro Tips for Better Results:</h3>
                    <ul className={`list-disc list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>
                      <li>Use high-quality, well-lit source images</li>
                      <li>Start with subtle motion (strength 1-2) for realistic results</li>
                      <li>Describe specific elements you want to animate</li>
                      <li>Consider the natural physics of your subject</li>
                      <li>Experiment with different camera angles</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'pika-disruption',
          title: '💼 Market Disruption Strategies',
          description: 'Leverage Pika Labs to disrupt markets and create opportunities',
          steps: [
            {
              id: 'pika-step-5',
              title: 'Content Creation Revolution',
              description: 'Disrupt traditional content creation with AI-powered workflows',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Content Creation Revolution</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn how to use Pika Labs to revolutionize content creation, reduce costs by 90%, and deliver results 10x faster than traditional methods.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-800 dark:text-red-300'}`}>Market Disruption Opportunities:</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Traditional vs AI-Powered:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-red-100' : 'text-red-600 dark:text-red-100'}`}>
                          <li>• $10k video → $50 AI video</li>
                          <li>• 2-week production → 2-hour creation</li>
                          <li>• 10-person crew → 1-person operation</li>
                          <li>• Studio rental → Home office</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>New Business Models:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-red-100' : 'text-red-600 dark:text-red-100'}`}>
                          <li>• Rapid prototype videos</li>
                          <li>• Personalized content at scale</li>
                          <li>• Real-time campaign creation</li>
                          <li>• Micro-budget productions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Social Media:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Daily content creation</li>
                        <li>• Trending topic videos</li>
                        <li>• Multi-platform adaptation</li>
                        <li>• Viral content testing</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Marketing:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Product demonstrations</li>
                        <li>• Brand storytelling</li>
                        <li>• A/B testing campaigns</li>
                        <li>• Localized content</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Education:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Course content creation</li>
                        <li>• Interactive tutorials</li>
                        <li>• Concept visualization</li>
                        <li>• Skill demonstrations</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Action Plan - Start Your AI Content Agency:</h3>
                    <ol className={`list-decimal list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                      <li>Master Pika Labs (1 week intensive practice)</li>
                      <li>Create a portfolio of 20 diverse videos</li>
                      <li>Identify 3 target markets (local businesses, influencers, educators)</li>
                      <li>Develop pricing strategy (undercut traditional by 80%)</li>
                      <li>Launch with introductory offers</li>
                    </ol>
                  </div>
                </div>
              )
            },
            {
              id: 'pika-step-6',
              title: 'Scaling Your AI Video Business',
              description: 'Build systems to scale your Pika-powered business',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Scaling Your AI Video Business</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Transform your Pika Labs expertise into a scalable business that generates consistent revenue while disrupting traditional video production.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Business Scaling Framework:</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>Automation Systems:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
                          <li>• Template-based workflows</li>
                          <li>• Batch processing systems</li>
                          <li>• Client onboarding automation</li>
                          <li>• Quality control checklists</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>Revenue Streams:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
                          <li>• Custom video creation</li>
                          <li>• Subscription-based content</li>
                          <li>• White-label services</li>
                          <li>• Training &amp; consultation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Pricing Strategy:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Basic video: $50-200</li>
                        <li>• Commercial use: $200-500</li>
                        <li>• Series/campaigns: $500-2000</li>
                        <li>• Premium/rush: $1000+</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>Client Acquisition:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Social media showcases</li>
                        <li>• Local business outreach</li>
                        <li>• Freelance platforms</li>
                        <li>• Referral programs</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-800 dark:text-yellow-300'}`}>90-Day Business Launch Plan:</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>Month 1 - Foundation:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-yellow-100' : 'text-yellow-600 dark:text-yellow-100'}`}>
                          Master Pika Labs, create portfolio, establish brand, set up systems
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>Month 2 - Launch:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-yellow-100' : 'text-yellow-600 dark:text-yellow-100'}`}>
                          Acquire first 10 clients, refine processes, gather testimonials
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>Month 3 - Scale:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-yellow-100' : 'text-yellow-600 dark:text-yellow-100'}`}>
                          Expand services, increase pricing, build recurring revenue
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'pika-step-7',
              title: 'Advanced Market Disruption',
              description: 'Implement cutting-edge strategies to dominate your market',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Market Disruption</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master advanced strategies to completely disrupt traditional markets and establish yourself as the go-to AI video expert in your niche.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-800 dark:text-red-300'}`}>Disruption Strategies:</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>1. Speed Advantage:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-red-100' : 'text-red-600 dark:text-red-100'}`}>
                          Deliver same-day video content while competitors need weeks. Offer 24-hour turnaround as standard.
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>2. Cost Revolution:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-red-100' : 'text-red-600 dark:text-red-100'}`}>
                          Price at 10-20% of traditional costs while maintaining 80%+ profit margins.
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>3. Personalization at Scale:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-red-100' : 'text-red-600 dark:text-red-100'}`}>
                          Create hundreds of personalized variations impossible with traditional methods.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Market Penetration:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Target underserved niches</li>
                        <li>• Offer free trials/demos</li>
                        <li>• Partner with agencies</li>
                        <li>• Create viral showcases</li>
                        <li>• Build case studies</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Competitive Moats:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Proprietary workflows</li>
                        <li>• Exclusive partnerships</li>
                        <li>• Brand recognition</li>
                        <li>• Client relationships</li>
                        <li>• Technical expertise</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Industry-Specific Disruption Opportunities:</h3>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <h5 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Real Estate:</h5>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          Virtual property tours, lifestyle videos, market updates
                        </p>
                      </div>
                      <div>
                        <h5 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>E-commerce:</h5>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          Product demos, unboxing videos, customer testimonials
                        </p>
                      </div>
                      <div>
                        <h5 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Healthcare:</h5>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          Patient education, procedure explanations, wellness content
                        </p>
                      </div>
                    </div>
                  </div>
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
          title: '💎 Topaz Setup & Fundamentals',
          description: 'Set up Topaz AI enhancement tools and master the basics',
          steps: [
            {
              id: 'topaz-step-1',
              title: 'Software Installation & Setup',
              description: 'Install and configure Topaz software suite',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Topaz AI Suite Installation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Install and set up the complete Topaz AI toolkit for professional photo and video enhancement.
                  </p>

                  <div className={`${'theme' === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${'theme' === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Topaz AI Product Suite:</h3>
                    <ul className={`list-disc list-inside space-y-1 ${'theme' === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                      <li><strong>Topaz Photo AI</strong> - Complete photo enhancement solution</li>
                      <li><strong>Topaz Video AI</strong> - AI-powered video upscaling and enhancement</li>
                      <li><strong>Topaz Gigapixel AI</strong> - Image upscaling up to 600%</li>
                      <li><strong>Topaz DeNoise AI</strong> - Advanced noise reduction</li>
                      <li><strong>Topaz Sharpen AI</strong> - Intelligent sharpening</li>
                    </ul>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${'theme' === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${'theme' === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Installation Steps:</h4>
                      <ol className={`text-sm space-y-1 list-decimal list-inside ${'theme' === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>Download from topazlabs.com</li>
                        <li>Choose subscription or one-time purchase</li>
                        <li>Install Photo AI (primary tool)</li>
                        <li>Configure GPU acceleration</li>
                        <li>Set up workspace preferences</li>
                      </ol>
                    </div>
                    <div className={`${'theme' === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${'theme' === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>System Requirements:</h4>
                      <ul className={`text-sm space-y-1 ${'theme' === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Windows 10+ or macOS 10.15+</li>
                        <li>• 8GB RAM minimum (16GB+ recommended)</li>
                        <li>• NVIDIA/AMD GPU (recommended)</li>
                        <li>• 4GB free disk space</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'topaz-step-2',
              title: 'Interface & Basic Enhancement',
              description: 'Master the Topaz interface and basic enhancement techniques',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Interface & Basic Enhancement</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to navigate Topaz Photo AI and perform basic enhancements that will dramatically improve your photos.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Core Enhancement Features:</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>Automatic Enhancement:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
                          <li>• Auto-detect and fix issues</li>
                          <li>• One-click enhancement</li>
                          <li>• Smart subject detection</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>Manual Controls:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
                          <li>• Sharpen adjustment</li>
                          <li>• Noise reduction levels</li>
                          <li>• Upscale parameters</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Workflow:</h5>
                      <ol className={`text-sm space-y-1 list-decimal list-inside ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>Import image</li>
                        <li>Auto-analyze</li>
                        <li>Adjust settings</li>
                        <li>Preview results</li>
                        <li>Export enhanced</li>
                      </ol>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Best Results:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• RAW files preferred</li>
                        <li>• High resolution input</li>
                        <li>• Proper exposure</li>
                        <li>• Stable shots</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-3 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>Export Options:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• JPEG (social media)</li>
                        <li>• PNG (transparency)</li>
                        <li>• TIFF (professional)</li>
                        <li>• Custom presets</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'topaz-social',
          title: '📱 Social Media Optimization',
          description: 'Create AI-optimized photos specifically for social platforms',
          steps: [
            {
              id: 'topaz-step-3',
              title: 'Social Media Enhancement Workflow',
              description: 'Optimize photos for maximum social media impact',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Social Media Enhancement Workflow</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master the art of creating scroll-stopping, engagement-driving photos optimized specifically for social media platforms.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-800 dark:text-red-300'}`}>Platform-Specific Optimization:</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Instagram:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-red-100' : 'text-red-600 dark:text-red-100'}`}>
                          <li>• 1080x1080 (square posts)</li>
                          <li>• 1080x1350 (portrait posts)</li>
                          <li>• High contrast &amp; vibrant colors</li>
                          <li>• Sharp details for mobile viewing</li>
                          <li>• Consistent aesthetic</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>TikTok/Stories:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-red-100' : 'text-red-600 dark:text-red-100'}`}>
                          <li>• 1080x1920 (9:16 ratio)</li>
                          <li>• Eye-catching thumbnails</li>
                          <li>• Bold, readable text overlays</li>
                          <li>• Dynamic compositions</li>
                          <li>• Trend-aware styling</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Enhancement Strategy:</h4>
                      <ol className={`text-sm space-y-1 list-decimal list-inside ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>Upscale to maximum resolution</li>
                        <li>Apply aggressive sharpening</li>
                        <li>Enhance colors &amp; contrast</li>
                        <li>Remove noise completely</li>
                        <li>Optimize for compression</li>
                      </ol>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Mobile Optimization:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Test on mobile screens</li>
                        <li>• Ensure readability at small sizes</li>
                        <li>• Optimize file size (&lt;1MB)</li>
                        <li>• Maintain quality after compression</li>
                        <li>• Consider dark mode compatibility</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-800 dark:text-yellow-300'}`}>Social Media Enhancement Checklist:</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <h5 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>Technical:</h5>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-yellow-100' : 'text-yellow-600 dark:text-yellow-100'}`}>
                          <li>✓ Correct aspect ratio</li>
                          <li>✓ Maximum sharpness</li>
                          <li>✓ Zero noise/grain</li>
                          <li>✓ Optimized file size</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>Visual:</h5>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-yellow-100' : 'text-yellow-600 dark:text-yellow-100'}`}>
                          <li>✓ Eye-catching composition</li>
                          <li>✓ Vibrant, punchy colors</li>
                          <li>✓ Clear subject focus</li>
                          <li>✓ Platform-appropriate style</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'topaz-step-4',
              title: 'AI-Powered Photo Expansion',
              description: 'Use AI to expand and extend photos for different formats',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AI-Powered Photo Expansion</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to intelligently expand photos using AI to fit different aspect ratios and create more versatile content for various social platforms.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Photo Expansion Techniques:</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>1. Intelligent Outpainting:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                          Use AI tools like Photoshop's Generative Fill or DALL-E outpainting to extend backgrounds naturally
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>2. Content-Aware Scaling:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                          Stretch backgrounds while preserving important subjects using Topaz's smart scaling features
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>3. Multi-Format Creation:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                          Create multiple versions from one photo: square, portrait, landscape, and story formats
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Expansion Workflow:</h4>
                      <ol className={`text-sm space-y-1 list-decimal list-inside ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>Analyze original composition</li>
                        <li>Determine target aspect ratios</li>
                        <li>Use AI outpainting tools</li>
                        <li>Enhance expanded areas with Topaz</li>
                        <li>Blend and refine seamlessly</li>
                      </ol>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Best Use Cases:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Portrait to landscape conversion</li>
                        <li>• Adding space for text overlays</li>
                        <li>• Creating story-format versions</li>
                        <li>• Expanding product photography</li>
                        <li>• Adapting old photos to new ratios</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300'}`}>Practical Exercise - Multi-Format Creation:</h3>
                    <p className={`text-sm mb-3 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
                      Take one portrait photo and create optimized versions for:
                    </p>
                    <ol className={`list-decimal list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-orange-100' : 'text-orange-600 dark:text-orange-100'}`}>
                      <li>Instagram square post (1:1)</li>
                      <li>Instagram story (9:16)</li>
                      <li>Facebook cover photo (16:9)</li>
                      <li>LinkedIn banner (4:1)</li>
                      <li>YouTube thumbnail (16:9)</li>
                    </ol>
                  </div>
                </div>
              )
            },
            {
              id: 'topaz-step-5',
              title: 'Advanced Social Media Effects',
              description: 'Create viral-worthy photos with advanced AI effects',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Social Media Effects</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master advanced AI-powered effects and techniques to create viral-worthy, scroll-stopping content that dominates social media feeds.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>Viral-Worthy Effects:</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>AI Enhancement Stack:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
                          <li>• HDR-style dramatic enhancement</li>
                          <li>• AI-powered color grading</li>
                          <li>• Selective sharpening &amp; blur</li>
                          <li>• Dynamic range expansion</li>
                          <li>• Cinematic color palettes</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>Trend-Driven Styles:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
                          <li>• Film grain &amp; vintage looks</li>
                          <li>• Neon glow effects</li>
                          <li>• Cyberpunk aesthetics</li>
                          <li>• Minimalist clean looks</li>
                          <li>• Hyper-realistic enhancements</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Instagram Trends:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Golden hour simulation</li>
                        <li>• Dreamy soft focus</li>
                        <li>• High contrast B&amp;W</li>
                        <li>• Pastel color palettes</li>
                        <li>• Mirror/symmetry effects</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>TikTok Styles:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Bold, punchy colors</li>
                        <li>• High saturation looks</li>
                        <li>• Glitch/digital effects</li>
                        <li>• Retro film aesthetics</li>
                        <li>• Dramatic lighting</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>LinkedIn Professional:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Clean, professional looks</li>
                        <li>• Subtle enhancements</li>
                        <li>• Corporate color schemes</li>
                        <li>• Sharp, detailed images</li>
                        <li>• Consistent branding</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Advanced Workflow - Viral Content Creation:</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Step 1 - Trend Analysis:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          Research current visual trends on your target platform, analyze top-performing content
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Step 2 - AI Enhancement:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          Apply aggressive Topaz enhancements: maximum sharpness, vibrant colors, zero noise
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Step 3 - Style Application:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          Apply trending effects, color grading, and platform-specific optimizations
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Step 4 - A/B Testing:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          Create multiple versions with different effects, test performance, optimize based on results
                        </p>
                      </div>
                    </div>
                  </div>
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
          id: 'sfx-fundamentals',
          title: '🔊 SFX Fundamentals',
          description: 'Master AI sound effect generation tools and techniques',
          steps: [
            {
              id: 'sfx-step-1',
              title: 'AI Audio Tools Overview',
              description: 'Explore the best AI sound effect generation platforms',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AI Audio Generation Tools</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Discover the revolutionary AI tools that are transforming sound design and audio production for content creators.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Top AI Audio Platforms:</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Professional Tools:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          <li>• <strong>ElevenLabs</strong> - Voice synthesis &amp; SFX</li>
                          <li>• <strong>Mubert</strong> - AI music &amp; soundscapes</li>
                          <li>• <strong>AIVA</strong> - AI composition</li>
                          <li>• <strong>Soundraw</strong> - Custom music generation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Emerging Platforms:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          <li>• <strong>AudioCraft</strong> - Meta's AI audio</li>
                          <li>• <strong>Stable Audio</strong> - Stability AI's solution</li>
                          <li>• <strong>Riffusion</strong> - Diffusion-based audio</li>
                          <li>• <strong>Beatoven.ai</strong> - Adaptive music</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Sound Effects:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Ambient sounds</li>
                        <li>• Action effects</li>
                        <li>• Nature sounds</li>
                        <li>• Mechanical noises</li>
                        <li>• Fantasy elements</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Music Generation:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Background music</li>
                        <li>• Intro/outro themes</li>
                        <li>• Emotional scoring</li>
                        <li>• Loop creation</li>
                        <li>• Genre-specific</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>Voice Synthesis:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Narration voices</li>
                        <li>• Character voices</li>
                        <li>• Language options</li>
                        <li>• Emotion control</li>
                        <li>• Custom cloning</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'sfx-step-2',
              title: 'Platform Setup & Account Creation',
              description: 'Set up accounts and understand pricing models',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Platform Setup & Account Creation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Get started with the most powerful AI audio platforms and understand their pricing structures to maximize your budget.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Setup Priority Order:</h3>
                    <ol className={`list-decimal list-inside space-y-2 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                      <li><strong>ElevenLabs</strong> - Start with free tier (10k characters/month)</li>
                      <li><strong>Mubert</strong> - Free plan for basic music generation</li>
                      <li><strong>Soundraw</strong> - 7-day free trial for premium features</li>
                      <li><strong>AudioCraft</strong> - Open source, free to use</li>
                      <li><strong>AIVA</strong> - Free tier with 3 downloads/month</li>
                    </ol>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Free Tier Strategy:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Start with free accounts on all platforms</li>
                        <li>• Test quality and workflow fit</li>
                        <li>• Identify your primary use cases</li>
                        <li>• Compare output quality</li>
                        <li>• Upgrade strategically based on needs</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Pricing Optimization:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• ElevenLabs: $5/month for 30k characters</li>
                        <li>• Mubert: $14/month for commercial use</li>
                        <li>• Soundraw: $20/month unlimited downloads</li>
                        <li>• Mix free &amp; paid for optimal ROI</li>
                        <li>• Cancel unused subscriptions monthly</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-800 dark:text-yellow-300'}`}>Quick Start Checklist:</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <h5 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>Account Setup:</h5>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-yellow-100' : 'text-yellow-600 dark:text-yellow-100'}`}>
                          <li>□ Create ElevenLabs account</li>
                          <li>□ Sign up for Mubert</li>
                          <li>□ Test Soundraw free trial</li>
                          <li>□ Install AudioCraft locally</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200'}`}>Initial Testing:</h5>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-yellow-100' : 'text-yellow-600 dark:text-yellow-100'}`}>
                          <li>□ Generate test sound effects</li>
                          <li>□ Create sample background music</li>
                          <li>□ Test voice synthesis quality</li>
                          <li>□ Compare platform outputs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'sfx-creation',
          title: '🎵 Sound Creation Mastery',
          description: 'Master advanced sound creation and customization techniques',
          steps: [
            {
              id: 'sfx-step-3',
              title: 'Sound Effect Generation',
              description: 'Create custom sound effects for any project',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Sound Effect Generation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master the art of creating professional-quality sound effects using AI tools that rival expensive studio productions.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300'}`}>SFX Categories &amp; Prompting:</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>Action &amp; Impact:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
                          <li>• "Heavy metal door slamming shut"</li>
                          <li>• "Glass breaking on concrete floor"</li>
                          <li>• "Thunder crack with rain ambience"</li>
                          <li>• "Sword clashing in medieval battle"</li>
                          <li>• "Car engine revving and speeding away"</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>Ambient &amp; Atmosphere:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'}`}>
                          <li>• "Peaceful forest with birds chirping"</li>
                          <li>• "Busy city street with traffic"</li>
                          <li>• "Crackling fireplace in cozy room"</li>
                          <li>• "Ocean waves on rocky shore"</li>
                          <li>• "Spaceship humming in deep space"</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Prompt Engineering:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Be specific about materials</li>
                        <li>• Include environment context</li>
                        <li>• Specify duration &amp; intensity</li>
                        <li>• Add emotional descriptors</li>
                        <li>• Reference familiar sounds</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Quality Control:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Generate multiple variations</li>
                        <li>• Test at different volumes</li>
                        <li>• Check for unwanted artifacts</li>
                        <li>• Ensure proper fade in/out</li>
                        <li>• Verify loop compatibility</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>Post-Processing:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Normalize audio levels</li>
                        <li>• Apply EQ adjustments</li>
                        <li>• Add reverb if needed</li>
                        <li>• Trim to exact length</li>
                        <li>• Export in multiple formats</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300'}`}>Practical Exercise - Video Game SFX Pack:</h3>
                    <p className={`text-sm mb-3 ${theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200'}`}>
                      Create a complete sound pack for a mobile game:
                    </p>
                    <ol className={`list-decimal list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-orange-100' : 'text-orange-600 dark:text-orange-100'}`}>
                      <li>UI sounds: button clicks, menu transitions, notifications</li>
                      <li>Game actions: jumping, collecting items, power-ups</li>
                      <li>Ambient loops: background music, environment sounds</li>
                      <li>Victory/defeat: success fanfare, game over sound</li>
                      <li>Special effects: explosions, magic spells, transformations</li>
                    </ol>
                  </div>
                </div>
              )
            },
            {
              id: 'sfx-step-4',
              title: 'Music & Background Audio',
              description: 'Generate custom music and ambient soundscapes',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Music & Background Audio Generation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Create professional-quality background music and soundscapes that enhance your content without copyright concerns.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Music Generation Strategies:</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Genre-Based Prompting:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          "Upbeat electronic music for YouTube intro, 120 BPM, energetic and modern"
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Mood-Based Creation:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          "Peaceful ambient background music, contemplative and calm for meditation content"
                        </p>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Instrument-Specific:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          "Solo piano melody, emotional and cinematic, perfect for dramatic scenes"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Content-Specific Music:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• <strong>YouTube Videos:</strong> Upbeat, engaging, loop-friendly</li>
                        <li>• <strong>Podcasts:</strong> Subtle, non-distracting, consistent</li>
                        <li>• <strong>Social Media:</strong> Trendy, catchy, platform-optimized</li>
                        <li>• <strong>Presentations:</strong> Professional, motivational, clean</li>
                        <li>• <strong>Games:</strong> Immersive, adaptive, genre-appropriate</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Technical Specifications:</h4>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• <strong>Duration:</strong> 30s, 1min, 2min, 5min options</li>
                        <li>• <strong>BPM:</strong> Match to content pace (60-140)</li>
                        <li>• <strong>Key:</strong> Major for upbeat, minor for emotional</li>
                        <li>• <strong>Format:</strong> WAV for quality, MP3 for size</li>
                        <li>• <strong>Loop Points:</strong> Seamless for background use</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300'}`}>Advanced Techniques:</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <h5 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>Layering & Mixing:</h5>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                          <li>• Generate multiple instrumental layers</li>
                          <li>• Combine different AI-generated tracks</li>
                          <li>• Add custom percussion elements</li>
                          <li>• Balance frequency ranges</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>Adaptive Music:</h5>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'}`}>
                          <li>• Create intro/main/outro versions</li>
                          <li>• Generate intensity variations</li>
                          <li>• Build tension and release patterns</li>
                          <li>• Design smooth transitions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'sfx-step-5',
              title: 'Voice Synthesis & Audio Branding',
              description: 'Create custom voices and establish audio brand identity',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Voice Synthesis & Audio Branding</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master advanced voice synthesis and create a distinctive audio brand that sets your content apart from the competition.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'} border rounded-lg p-4 mb-6`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-red-300' : 'text-red-800 dark:text-red-300'}`}>Voice Synthesis Mastery:</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Voice Characteristics:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-red-100' : 'text-red-600 dark:text-red-100'}`}>
                          <li>• <strong>Age:</strong> Young, mature, elderly tones</li>
                          <li>• <strong>Gender:</strong> Male, female, neutral options</li>
                          <li>• <strong>Accent:</strong> Regional, international varieties</li>
                          <li>• <strong>Emotion:</strong> Excited, calm, authoritative</li>
                          <li>• <strong>Pace:</strong> Slow, moderate, fast delivery</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>Use Cases:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-red-100' : 'text-red-600 dark:text-red-100'}`}>
                          <li>• <strong>Narration:</strong> Educational content, tutorials</li>
                          <li>• <strong>Characters:</strong> Game NPCs, animation voices</li>
                          <li>• <strong>Announcements:</strong> Intros, transitions, outros</li>
                          <li>• <strong>Commercials:</strong> Product demos, advertisements</li>
                          <li>• <strong>Audiobooks:</strong> Long-form content reading</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'}`}>Voice Cloning:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Record 10-30 minutes of clean audio</li>
                        <li>• Upload to ElevenLabs or similar</li>
                        <li>• Train custom voice model</li>
                        <li>• Test with various content types</li>
                        <li>• Refine based on results</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'}`}>Audio Branding:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Signature intro music (5-10 seconds)</li>
                        <li>• Consistent voice personality</li>
                        <li>• Branded sound effects library</li>
                        <li>• Recognizable audio logo</li>
                        <li>• Platform-specific adaptations</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} p-4 rounded border`}>
                      <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>Quality Control:</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• A/B test different voice options</li>
                        <li>• Gather audience feedback</li>
                        <li>• Monitor pronunciation accuracy</li>
                        <li>• Ensure emotional consistency</li>
                        <li>• Regular voice model updates</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'} border rounded-lg p-4`}>
                    <h3 className={`font-semibold mb-2 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300'}`}>Complete Audio Brand Package:</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className={`font-medium mb-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>Brand Elements to Create:</h4>
                        <ol className={`list-decimal list-inside space-y-1 text-sm ${theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'}`}>
                          <li>Signature intro music (10 seconds)</li>
                          <li>Primary brand voice (narrator/host)</li>
                          <li>Secondary voices (characters/guests)</li>
                          <li>Transition sound effects (5-10 unique)</li>
                          <li>Outro music with call-to-action space</li>
                          <li>Platform-specific variations (YouTube, TikTok, Podcast)</li>
                          <li>Emergency backup voices for consistency</li>
                        </ol>
                      </div>
                    </div>
                  </div>
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
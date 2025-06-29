import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { guestMode } from '../lib/guestMode';
import { Rocket, Brain, Briefcase, Globe, ArrowRight, Circle, X, Bot, Code, Video, Search, User, Camera, Upload, Zap } from 'lucide-react';
import { FloatingThemeToggle } from '../components/ui/FloatingThemeToggle';
import { FloatingBackButton } from '../components/ui/FloatingBackButton';
import { useTheme } from '../components/ui/ThemeProvider';
import { markFromOnboarding } from '../utils/hintUtils';

type Mission = 'ai-automation' | 'web-dev' | 'ai-video' | 'explore' | 'advanced';
type SkillLevel = 'beginner' | 'intermediate' | 'pro';
type Focus = 'ai-automation' | 'web-dev' | 'ai-video' | 'explore' | 'advanced';

interface OnboardingData {
  mission?: Mission;
  skillLevel?: SkillLevel;
  focus?: Focus;
  fullName?: string;
  referral?: string;
  avatarUrl?: string;
}

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  
  // Check if we're in guest mode
  const isGuestMode = searchParams.get('guest') === 'true' || guestMode.isGuestMode();

  const handleFocusSelect = (focus: Focus) => {
    setData({ ...data, focus, mission: focus }); // Set both focus and mission to the same value
    setStep(1);
  };

  const handleSkillSelect = (skillLevel: SkillLevel) => {
    setData({ ...data, skillLevel });
    setStep(2);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // In guest mode, convert to base64 and store locally
      if (isGuestMode) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setData(prev => ({ ...prev, avatarUrl: result }));
        };
        reader.readAsDataURL(file);
        return;
      }

      // For regular users, upload to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if it exists
      if (data.avatarUrl) {
        const existingPath = data.avatarUrl.split('/').pop();
        if (existingPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${existingPath}`]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update local state
      setData(prev => ({ ...prev, avatarUrl: publicUrl }));

    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setData({
      ...data,
      fullName: formData.get('fullName') as string,
      referral: formData.get('referral') as string
    });
    setStep(3);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isGuestMode) {
        // Handle guest mode completion
        const guestProfile = guestMode.createGuestProfile({
          full_name: data.fullName,
          mission: data.focus,
          skill_level: data.skillLevel,
          focus: data.focus,
          referral: data.referral,
          avatar_url: data.avatarUrl
        });

        // Set flag for onboarding completion
        localStorage.setItem('acadium_guest_onboarding_complete', 'true');
        
        // Set onboarding flag to trigger hints
        markFromOnboarding();
    
        // Navigate directly to dashboard with onboarding flag
        const redirectPath = getGuestRedirectPath(data.focus || 'explore');
        navigate(`${redirectPath}?from_onboarding=true`);
      } else {
        // Handle regular user completion
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: data.fullName,
            mission: data.focus, // Use focus value for mission
            skill_level: data.skillLevel,
            focus: data.focus,
            referral: data.referral,
            avatar_url: data.avatarUrl,
            onboarding_completed: true
          });

        if (profileError) throw profileError;

        // Set onboarding flag to trigger hints after payment
        markFromOnboarding();

        // Navigate to payment page with both onboarding and payment flags
        navigate('/payment?from=onboarding&from_onboarding=true');
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      setError('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get redirect path for guest users
  const getGuestRedirectPath = (focus: Focus): string => {
    switch (focus) {
      case 'ai-automation':
        return '/n8n';
      case 'ai-video':
        return '/video';
      case 'web-dev':
        return '/webdev';
      case 'advanced':
        return '/advanced';
      case 'explore':
      default:
        return '/';
    }
  };

  return (
    <div className={`relative min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-${theme === 'dark' ? 'white' : 'gray-900'}`}>
      {/* Main background gradient - EXACT COPY FROM LANDING PAGE */}
      <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${
          theme === 'dark' 
            ? 'from-blue-900/30 via-gray-900 to-red-900/20' 
            : 'from-blue-100/80 via-gray-50 to-red-100/60'
        }`}></div>
        <div className={`absolute top-0 right-0 w-1/2 h-1/2 ${
          theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-200/60'
        } rounded-full blur-[120px]`}></div>
        <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 ${
          theme === 'dark' ? 'bg-red-600/20' : 'bg-red-200/60'
        } rounded-full blur-[120px]`}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyODI4MjgiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBBMzAgMzAgMCAxIDEgMCAzMGEzMCAzMCAwIDAgMSA2MCAweiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9Ii41Ci8+PHBhdGggZD0iTTYwIDI0YTYgNiAwIDAgMS0xMiAwIDYgNiAwIDAgMSAxMiAweiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9Ii41Ci8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <FloatingThemeToggle />
        <FloatingBackButton />
        
        {/* Bolt badge - Top right for desktop */}
        <div className="absolute top-4 right-4 hidden md:block">
          <a id="bolt-button" href="https://bolt.new" target="_blank" title="Powered By Bolt" className="opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1">
              <img 
                src={theme === 'dark' ? '/white_circle_360x360.svg' : '/black_circle_360x360.svg'} 
                alt="Bolt" 
                className="h-10 w-10" 
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Built with Bolt
              </span>
            </div>
          </a>
        </div>
        
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <div className="p-6">
              {renderStep()}
            </div>
          </Card>
        </main>
        
        {/* Bolt badge - Bottom for mobile */}
        <div className="flex justify-center pb-4 md:hidden">
          <a id="bolt-button" href="https://bolt.new" target="_blank" title="Powered By Bolt" className="opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1">
              <img 
                src={theme === 'dark' ? '/white_circle_360x360.svg' : '/black_circle_360x360.svg'} 
                alt="Bolt" 
                className="h-8 w-8" 
              />
              <span className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Built with Bolt
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {isGuestMode ? 'Welcome, Guest!' : 'Welcome to Acadium - AI'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {isGuestMode 
                  ? 'Choose your focus area to get started'
                  : 'This is where misfits become moguls.'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className="h-32 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 rounded-lg font-medium"
                onClick={() => handleFocusSelect('web-dev')}
              >
                <Code className="h-8 w-8 text-gray-900 dark:text-gray-300" />
                <span>Web/Software Developer</span>
              </button>

              <button
                className="h-32 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 rounded-lg font-medium"
                onClick={() => handleFocusSelect('ai-automation')}
              >
                <Bot className="h-8 w-8 text-gray-900 dark:text-gray-300" />
                <span>N8N Agents & Automation</span>
              </button>

              <button
                className="h-32 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 rounded-lg font-medium"
                onClick={() => handleFocusSelect('ai-video')}
              >
                <Video className="h-8 w-8 text-gray-900 dark:text-gray-300" />
                <span>AI Video Creation</span>
              </button>

              <button
                className="h-32 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 rounded-lg font-medium"
                onClick={() => handleFocusSelect('advanced')}
              >
                <Zap className="h-8 w-8 text-gray-900 dark:text-gray-300" />
                <span>Advanced (All Tools)</span>
              </button>

              <button
                className="h-32 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 rounded-lg font-medium md:col-span-2"
                onClick={() => handleFocusSelect('explore')}
              >
                <Globe className="h-8 w-8 text-gray-900 dark:text-gray-300" />
                <span>Just Exploring</span>
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                You're not here to watch. You're here to build.
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Select your current skill level to personalize your experience.
              </p>
            </div>

            <div className="space-y-4">
              <button
                className="w-full py-6 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 rounded-lg font-medium"
                onClick={() => handleSkillSelect('beginner')}
              >
                Beginner
              </button>
              <button
                className="w-full py-6 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 rounded-lg font-medium"
                onClick={() => handleSkillSelect('intermediate')}
              >
                Intermediate
              </button>
              <button
                className="w-full py-6 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 rounded-lg font-medium"
                onClick={() => handleSkillSelect('pro')}
              >
                Pro
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Almost there! Tell us about yourself.
              </h2>
            </div>

            <form onSubmit={handleUserInfoSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {data.avatarUrl ? (
                      <img 
                        src={data.avatarUrl} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Profile Picture (Optional)
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Upload a profile picture to personalize your account
                  </p>
                  <button 
                    type="button"
                    className="mt-2 inline-flex items-center px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200"
                    disabled={uploading}
                    onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                  >
                    {uploading ? (
                      <>
                        <Upload className="h-3 w-3 mr-1.5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3 w-3 mr-1.5" />
                        Choose Photo
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  defaultValue={isGuestMode ? 'Guest User' : ''}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  name="referral"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 rounded-lg font-medium py-3"
              >
                Final Step <ArrowRight className="ml-2 h-4 w-4 text-gray-900 dark:text-gray-300" />
              </button>
            </form>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {isGuestMode ? "You're ready to explore!" : "You're about to enter a different internet."}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {isGuestMode 
                  ? 'Your guest account is ready with full access to:'
                  : 'Create your account to unlock:'
                }
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Full access to dashboard',
                'Live workshops',
                'Private channels',
                'Starter tools unlocked'
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <Circle className="h-2 w-2 text-blue-500 mr-3" />
                  <span className="text-gray-900 dark:text-white">{benefit}</span>
                </div>
              ))}
            </div>

            {isGuestMode && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  📝 Guest Mode Note
                </h4>
                <p className="text-xs text-yellow-700 dark:text-yellow-200">
                  Your progress will be saved locally in your browser. Sign up anytime to sync your data across devices.
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <button
              className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium py-3"
              onClick={handleComplete}
              disabled={loading}
            >
              {loading 
                ? (isGuestMode ? 'Setting up...' : 'Creating Account...') 
                : (isGuestMode ? 'Start Exploring →' : 'Create My Account →')
              }
            </button>
          </div>
        );
    }
  }
};

export default Onboarding;
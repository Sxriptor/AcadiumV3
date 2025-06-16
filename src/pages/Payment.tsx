import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { X, Check, ArrowLeft } from 'lucide-react';
import { supabase, sessionManager, getCachedProfile } from '../lib/supabase';
import { FloatingThemeToggle } from '../components/ui/FloatingThemeToggle';
import { useTheme } from '../components/ui/ThemeProvider';

const Payment: React.FC = () => {
  const [developerCode, setDeveloperCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [monthlyPriceId, setMonthlyPriceId] = useState<string | null>(null);
  const [yearlyPriceId, setYearlyPriceId] = useState<string | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, gradientType } = useTheme();

  const fromOnboarding = searchParams.get('from') === 'onboarding';

  // Function to get redirect path based on user focus
  const getRedirectPath = async (userId: string): Promise<string> => {
    try {
      const { data: profile } = await getCachedProfile(userId);
      
      if (profile?.focus) {
        switch (profile.focus) {
          case 'ai-automation':
            return '/n8n';
          case 'ai-video':
            return '/video';
          case 'web-dev':
            return '/webdev';
          case 'explore':
          default:
            return '/';
        }
      }
      
      return '/'; // default to index if no focus found
    } catch (error) {
      console.error('Error getting user focus for redirect:', error);
      return '/'; // default to index on error
    }
  };

  // Fetch both monthly and yearly price IDs from the plans table
  useEffect(() => {
    const fetchPriceIds = async () => {
      try {
        setPriceLoading(true);
        
        // Fetch monthly plan
        const { data: monthlyPlan, error: monthlyError } = await supabase
          .from('plans')
          .select('stripe_price_id')
          .eq('active', true)
          .eq('interval', 'month')
          .eq('name', 'Pro Plan')
          .single();

        // Fetch yearly plan
        const { data: yearlyPlan, error: yearlyError } = await supabase
          .from('plans')
          .select('stripe_price_id')
          .eq('active', true)
          .eq('interval', 'year')
          .eq('name', 'Pro Plan')
          .single();

        if (monthlyError && yearlyError) {
          console.error('Error fetching plans:', { monthlyError, yearlyError });
          setError('Failed to load subscription plans. Please try again.');
          return;
        }

        if (monthlyPlan?.stripe_price_id) {
          setMonthlyPriceId(monthlyPlan.stripe_price_id);
        }
        
        if (yearlyPlan?.stripe_price_id) {
          setYearlyPriceId(yearlyPlan.stripe_price_id);
        }

        // If no plans found, show error
        if (!monthlyPlan?.stripe_price_id && !yearlyPlan?.stripe_price_id) {
          setError('No active subscription plans found.');
        }
      } catch (error) {
        console.error('Error fetching price IDs:', error);
        setError('Failed to load subscription plans. Please try again.');
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPriceIds();
  }, []);

  const handleCodeSubmit = async () => {
    if (developerCode.trim() === '') {
      setError('Please enter a developer code');
      return;
    }
    
    if (developerCode === 'Acadium2025') {
      setError('');
      await handleDeveloperCode(developerCode);
    } else {
      setError('Invalid developer code');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCodeSubmit();
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear all cached data
      sessionManager.clearSession();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Navigate to auth page
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, clear cache and navigate
      sessionManager.clearSession();
      navigate('/auth');
    }
  };

  const handleStripeCheckout = async () => {
    const selectedPriceId = isYearly ? yearlyPriceId : monthlyPriceId;
    
    if (!selectedPriceId) {
      setError('Selected subscription plan not available. Please try again.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Get user's focus for success URL redirect
      const redirectPath = await getRedirectPath(user.id);
      const successUrl = `${window.location.origin}${redirectPath}?success=true`;

      // Call our edge function to create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: selectedPriceId,
          successUrl,
          cancelUrl: `${window.location.origin}/payment`,
        },
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeveloperCode = async (code: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Validate developer code (you can add actual validation logic here)
      if (!code || code.trim().length === 0) {
        throw new Error('Please enter a valid developer code');
      }

      const { data: devPlan } = await supabase
        .from('plans')
        .select('id')
        .eq('name', 'Developer Plan')
        .single();

      if (!devPlan) throw new Error('Developer plan not found');

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_id: devPlan.id,
          status: 'active'
        });

      if (error) throw error;
      
      setError('');
      
      // Navigate to user's focus-specific homepage
      const redirectPath = await getRedirectPath(user.id);
      navigate(redirectPath);
    } catch (error) {
      console.error('Error applying developer code:', error);
      setError('Failed to apply developer code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'All AI tools and templates',
    'Unlimited projects',
    'Priority support',
    'Advanced analytics'
  ];

  const getHeaderBackground = () => {
    if (theme === 'gradient') {
      switch (gradientType) {
        case 'blueRed':
          return 'bg-gradient-to-br from-blue-600 to-red-600';
        case 'purpleBlue':
          return 'bg-gradient-to-br from-purple-600 to-blue-500';
        case 'greenTeal':
          return 'bg-gradient-to-br from-green-500 to-teal-500';
        case 'orangePink':
          return 'bg-gradient-to-br from-orange-500 to-pink-500';
        case 'darkTeal':
          return 'bg-gradient-to-br from-slate-700 to-cyan-500';
        default:
          return 'bg-gradient-to-br from-blue-600 to-red-600';
      }
    } else if (theme === 'dark') {
      return 'bg-gray-800';
    } else {
      return 'bg-gradient-to-br from-blue-600 to-indigo-700';
    }
  };

  const monthlyPrice = 12.99;
  const yearlyPrice = 119.99;
  const yearlyMonthlyEquivalent = yearlyPrice / 12;
  const savings = ((monthlyPrice * 12) - yearlyPrice).toFixed(2);

  const isSubscribeDisabled = loading || priceLoading || (!monthlyPriceId && !yearlyPriceId);

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
        
        {/* Back Button - Now logs out */}
        <div className="fixed top-4 left-4">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="text-white hover:bg-white/10 border-blue-500"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>

        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-0 overflow-hidden mx-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <div className={`relative ${getHeaderBackground()} p-6 text-white`}>
              <h2 className="text-2xl font-bold mb-2">
                Unlock the Full Power of AI
              </h2>
              <p className={theme === 'light' ? 'text-blue-100' : 'text-white/80'}>
                Get access to all features and start building your AI empire today.
              </p>
            </div>

            <div className="p-6">
              {/* Billing Toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-medium ${
                    !isYearly 
                      ? theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                      : theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Monthly
                  </span>
                  
                  <button
                    onClick={() => setIsYearly(!isYearly)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isYearly ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isYearly ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      isYearly 
                        ? theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                        : theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Yearly
                    </span>
                    {yearlyPriceId && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                        Save ${savings}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline mb-4">
                  <span className={`text-3xl font-bold ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    ${isYearly ? yearlyPrice.toFixed(2) : monthlyPrice.toFixed(2)}
                  </span>
                  <span className={`ml-1 ${
                    theme === 'gradient' ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    /{isYearly ? 'year' : 'month'}
                  </span>
                  {isYearly && (
                    <span className={`ml-2 text-sm ${
                      theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      (${yearlyMonthlyEquivalent.toFixed(2)}/month)
                    </span>
                  )}
                </div>

                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className={theme === 'gradient' ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <Button 
                  className={`w-full ${
                    theme === 'gradient' 
                      ? 'bg-white/20 hover:bg-white/30 text-white border-white/30' 
                      : ''
                  }`} 
                  onClick={handleStripeCheckout}
                  disabled={isSubscribeDisabled}
                >
                  {priceLoading ? 'Loading...' : loading ? 'Processing...' : `Subscribe ${isYearly ? 'Yearly' : 'Monthly'}`}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${
                      theme === 'gradient' ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'
                    }`}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${
                      theme === 'gradient' 
                        ? 'text-white/70' 
                        : theme === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>
                      Or
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={developerCode}
                    onChange={(e) => {
                      setDeveloperCode(e.target.value);
                      setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Developer Code"
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'gradient'
                        ? 'border-white/20 bg-white/10 text-white placeholder-white/60'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  />
                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  )}
                  <Button 
                    variant="outline" 
                    className={`w-full ${
                      theme === 'gradient' 
                        ? 'border-white/30 text-white hover:bg-white/10' 
                        : ''
                    }`}
                    onClick={handleCodeSubmit}
                  >
                    Apply Code
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Payment;
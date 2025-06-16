import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Button } from './Button';
import { X, Check } from 'lucide-react';
import { supabase, getCachedProfile } from '../../lib/supabase';
import { useTheme } from './ThemeProvider';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  onDeveloperCode: (code: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
  onDeveloperCode
}) => {
  const [developerCode, setDeveloperCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [monthlyPriceId, setMonthlyPriceId] = useState<string | null>(null);
  const [yearlyPriceId, setYearlyPriceId] = useState<string | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, gradientType } = useTheme();

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

    if (isOpen) {
      fetchPriceIds();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCodeSubmit = () => {
    if (developerCode.trim() === '') {
      setError('Please enter a developer code');
      return;
    }
    
    if (developerCode === 'Acadium2025') {
      setError('');
      onDeveloperCode(developerCode);
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
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback to direct navigation
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
          cancelUrl: `${window.location.origin}/?canceled=true`,
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
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex items-center justify-center">
      <Card className={`w-full max-w-2xl p-0 overflow-hidden mx-4 ${
        theme === 'dark' ? 'bg-gray-900' : theme === 'gradient' ? 'bg-gray-900/95' : 'bg-white'
      }`}>
        <div className={`relative ${getHeaderBackground()} p-6 text-white`}>
          <button
            onClick={handleSignOut}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Sign out and return to login"
          >
            <X className="h-5 w-5" />
          </button>
          
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
    </div>
  );
};
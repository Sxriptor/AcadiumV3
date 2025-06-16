import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { Circle, Mail, ArrowLeft } from 'lucide-react';
import { FloatingThemeToggle } from '../ui/FloatingThemeToggle';
import { useTheme } from '../ui/ThemeProvider';

export const EmailVerification: React.FC = () => {
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const email = localStorage.getItem('pendingVerificationEmail');
    if (!email) {
      navigate('/auth');
      return;
    }
    
    setPendingEmail(email);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          localStorage.removeItem('pendingVerificationEmail');
          navigate('/auth');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [navigate]);

  const handleResendEmail = async () => {
    setResending(true);
    setResendMessage('');
    
    if (!pendingEmail) {
      setResendMessage('No pending verification email found.');
      setResending(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) throw error;
      setResendMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error resending email:', error);
      setResendMessage('Failed to resend email. Please try again.');
    } finally {
      setResending(false);
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyODI4MjgiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBBMzAgMzAgMCAxIDEgMCAzMGEzMCAzMCAwIDAgMSA2MCAweiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9Ii41Ci8+PHBhdGggZD0iTTYwIDI0YTYgNiAwIDAgMS0xMiAwIDYgNiAwIDAgMSAxMiAweiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Rtd2lkdGg9Ii41Ci8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <FloatingThemeToggle />
        
        <div className="fixed top-4 left-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="text-white hover:bg-white/10 border-blue-500"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Sign In
          </Button>
        </div>

        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Circle className="h-16 w-16 text-blue-500 animate-pulse" />
            <Mail className="h-8 w-8 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Check Your Email
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We've sent a verification link to your email. Click the link to verify your account, then return here to sign in.
        </p>

        {pendingEmail && (
          <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verification email sent to: <span className="font-medium text-gray-900 dark:text-white">{pendingEmail}</span>
            </p>
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Redirecting to sign in page in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>

        <div className="mt-8">
          <div className="flex justify-center items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full border-blue-500 text-blue-500 hover:bg-blue-500/10"
          >
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          
          {resendMessage && (
            <p className={`text-sm mt-3 ${
              resendMessage.includes('Failed') || resendMessage.includes('Error')
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`}>
              {resendMessage}
            </p>
          )}
        </div>
      </Card>
        </main>
      </div>
    </div>
  );
};
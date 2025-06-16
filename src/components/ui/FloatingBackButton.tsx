import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const FloatingBackButton: React.FC = () => {
  const navigate = useNavigate();
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      // Still navigate to auth even if signout fails
      navigate('/auth');
    }
  };

  return (
    <button
      onClick={signOut}
      className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
      aria-label="Sign out"
    >
      <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
    </button>
  );
}; 
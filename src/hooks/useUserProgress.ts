import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface UserProgress {
  id: string;
  tool_id: string;
  step_id: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
}

export const useUserProgress = (toolId: string) => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user progress for the specified tool
  const fetchUserProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_learning_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .eq('completed', true);

      if (error) throw error;

      // Create a Set of completed step IDs
      const completedStepIds = new Set((data || []).map(item => item.step_id));
      setCompletedSteps(completedStepIds);
    } catch (err) {
      console.error('Error fetching user progress:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  // Mark a step as complete
  const markStepComplete = useCallback(async (stepId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('user_learning_progress')
        .upsert({
          user_id: user.id,
          tool_id: toolId,
          step_id: stepId,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,tool_id,step_id'
        });

      if (error) throw error;

      // Update local state
      setCompletedSteps(prev => new Set([...prev, stepId]));
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('userProgressUpdated', { detail: { toolId, stepId, completed: true } }));
      
      return true;
    } catch (err) {
      console.error('Error marking step as complete:', err);
      return false;
    }
  }, [toolId]);

  // Mark a step as incomplete
  const markStepIncomplete = useCallback(async (stepId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Delete the record instead of setting completed to false
      const { error } = await supabase
        .from('user_learning_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .eq('step_id', stepId);

      if (error) throw error;

      // Update local state
      setCompletedSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(stepId);
        return newSet;
      });
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('userProgressUpdated', { detail: { toolId, stepId, completed: false } }));
      
      return true;
    } catch (err) {
      console.error('Error marking step as incomplete:', err);
      return false;
    }
  }, [toolId]);

  // Add notes to a step
  const addStepNotes = useCallback(async (stepId: string, notes: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('user_learning_progress')
        .upsert({
          user_id: user.id,
          tool_id: toolId,
          step_id: stepId,
          notes
        }, {
          onConflict: 'user_id,tool_id,step_id'
        });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error adding step notes:', err);
      return false;
    }
  }, [toolId]);

  // Check if a step is completed
  const isStepCompleted = useCallback((stepId: string) => {
    return completedSteps.has(stepId);
  }, [completedSteps]);

  // Get completion percentage
  const getCompletionPercentage = useCallback((totalSteps: number) => {
    return totalSteps > 0 ? (completedSteps.size / totalSteps) * 100 : 0;
  }, [completedSteps]);

  // Load user progress on component mount
  useEffect(() => {
    fetchUserProgress();
    
    // Listen for updates from other components
    const handleProgressUpdate = (event: CustomEvent) => {
      if (event.detail?.toolId === toolId) {
        fetchUserProgress();
      }
    };
    
    window.addEventListener('userProgressUpdated', handleProgressUpdate as EventListener);
    
    return () => {
      window.removeEventListener('userProgressUpdated', handleProgressUpdate as EventListener);
    };
  }, [fetchUserProgress, toolId]);

  return {
    completedSteps,
    loading,
    error,
    markStepComplete,
    markStepIncomplete,
    addStepNotes,
    isStepCompleted,
    getCompletionPercentage,
    refetch: fetchUserProgress
  };
};
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface OverallProgress {
  totalSteps: number;
  completedSteps: number;
  percentage: number;
}

// Define the step IDs for each focus area
const FOCUS_STEP_MAPPING: Record<string, string[]> = {
  'ai-automation': [
    // N8n AI Agents page
    'n8n-step-1', 'n8n-step-2', 'n8n-step-3', 'n8n-step-4', 'n8n-step-5', 'n8n-step-6', 'n8n-step-7',
    
    // N8n Integrate page - all tools with 7 steps each
    'supabase-step-1', 'supabase-step-2', 'supabase-step-3', 'supabase-step-4', 'supabase-step-5', 'supabase-step-6', 'supabase-step-7',
    'stripe-step-1', 'stripe-step-2', 'stripe-step-3', 'stripe-step-4', 'stripe-step-5', 'stripe-step-6', 'stripe-step-7',
    'discord-step-1', 'discord-step-2', 'discord-step-3', 'discord-step-4', 'discord-step-5', 'discord-step-6', 'discord-step-7',
    'openai-step-1', 'openai-step-2', 'openai-step-3', 'openai-step-4', 'openai-step-5', 'openai-step-6', 'openai-step-7',
    'zapier-step-1', 'zapier-step-2', 'zapier-step-3', 'zapier-step-4', 'zapier-step-5', 'zapier-step-6', 'zapier-step-7',
    'make-step-1', 'make-step-2', 'make-step-3', 'make-step-4', 'make-step-5', 'make-step-6', 'make-step-7',
    'webhook-step-1', 'webhook-step-2', 'webhook-step-3', 'webhook-step-4', 'webhook-step-5', 'webhook-step-6', 'webhook-step-7',
    
    // N8n Deploy page - ACTUAL step counts from the code
    'cloud-step-1', 'cloud-step-2', 'cloud-step-3', 'cloud-step-4', 'cloud-step-5', 'cloud-step-6', 'cloud-step-7',
    'docker-step-1', 'docker-step-2',
    'k8s-step-1',
    'aws-step-1', 'aws-step-2', 'aws-step-3', 'aws-step-4', 'aws-step-5', 'aws-step-6', 'aws-step-7', 'aws-step-8', 'aws-step-9', 'aws-step-10', 'aws-step-11', 'aws-step-12',
    'gcp-step-1', 'gcp-step-2', 'gcp-step-3', 'gcp-step-4', 'gcp-step-5', 'gcp-step-6', 'gcp-step-7', 'gcp-step-8', 'gcp-step-9', 'gcp-step-10', 'gcp-step-11', 'gcp-step-12',
    'azure-step-1', 'azure-step-2', 'azure-step-3', 'azure-step-4', 'azure-step-5', 'azure-step-6', 'azure-step-7', 'azure-step-8', 'azure-step-9', 'azure-step-10', 'azure-step-11', 'azure-step-12',
    'selfhosted-step-1', 'selfhosted-step-2', 'selfhosted-step-3', 'selfhosted-step-4', 'selfhosted-step-5', 'selfhosted-step-6', 'selfhosted-step-7', 'selfhosted-step-8', 'selfhosted-step-9', 'selfhosted-step-10', 'selfhosted-step-11', 'selfhosted-step-12',
    
    // N8n Optimize page - ACTUAL step counts and IDs from the code
    'performance-step-1', 'performance-step-2', 'performance-step-3', 'performance-step-4', 'performance-step-5', 'performance-step-6', 'performance-step-7', 'performance-step-8', 'performance-step-9', 'performance-step-10', 'performance-step-11', 'performance-step-12',
    'error-step-1', 'error-step-2', 'error-step-3', 'error-step-4', 'error-step-5', 'error-step-6', 'error-step-7', 'error-step-8', 'error-step-9',
    'resource-step-1', 'resource-step-2', 'resource-step-3', 'resource-step-4', 'resource-step-5', 'resource-step-6', 'resource-step-7',
    'logic-step-1', 'logic-step-2', 'logic-step-3', 'logic-step-4', 'logic-step-5', 'logic-step-6', 'logic-step-7', 'logic-step-8', 'logic-step-9',
    'cache-step-1', 'cache-step-2', 'cache-step-3', 'cache-step-4', 'cache-step-5', 'cache-step-6', 'cache-step-7', 'cache-step-8', 'cache-step-9',
    'schedule-step-1', 'schedule-step-2', 'schedule-step-3', 'schedule-step-4', 'schedule-step-5', 'schedule-step-6', 'schedule-step-7', 'schedule-step-8', 'schedule-step-9', 'schedule-step-10',
    'analytics-step-1', 'analytics-step-2', 'analytics-step-3', 'analytics-step-4', 'analytics-step-5', 'analytics-step-6', 'analytics-step-7', 'analytics-step-8', 'analytics-step-9', 'analytics-step-10', 'analytics-step-11', 'analytics-step-12'
  ],
  'web-dev': [
    // VibeCodingLab page - ACTUAL step IDs from the code
    'cursor-step-1', 'cursor-step-2', 'cursor-step-3', 'cursor-step-4',
    'github-step-1', 'github-step-2', 'github-step-3', 'github-step-4',
    'vscode-step-1', 'vscode-step-2', 'vscode-step-3', 'vscode-step-4',
    'supabase-step-1', 'supabase-step-2', 'supabase-step-3', 'supabase-step-4',
    
    // WebDev Integrate page - all tools with 7 steps each
    'webdev-integrate-db-step-1', 'webdev-integrate-db-step-2', 'webdev-integrate-db-step-3', 'webdev-integrate-db-step-4', 'webdev-integrate-db-step-5', 'webdev-integrate-db-step-6', 'webdev-integrate-db-step-7',
    'webdev-integrate-auth-step-1', 'webdev-integrate-auth-step-2', 'webdev-integrate-auth-step-3', 'webdev-integrate-auth-step-4', 'webdev-integrate-auth-step-5', 'webdev-integrate-auth-step-6', 'webdev-integrate-auth-step-7',
    'webdev-integrate-api-step-1', 'webdev-integrate-api-step-2', 'webdev-integrate-api-step-3', 'webdev-integrate-api-step-4', 'webdev-integrate-api-step-5', 'webdev-integrate-api-step-6', 'webdev-integrate-api-step-7',
    'webdev-integrate-storage-step-1', 'webdev-integrate-storage-step-2', 'webdev-integrate-storage-step-3', 'webdev-integrate-storage-step-4', 'webdev-integrate-storage-step-5', 'webdev-integrate-storage-step-6', 'webdev-integrate-storage-step-7',
    'webdev-integrate-payment-step-1', 'webdev-integrate-payment-step-2', 'webdev-integrate-payment-step-3', 'webdev-integrate-payment-step-4', 'webdev-integrate-payment-step-5', 'webdev-integrate-payment-step-6', 'webdev-integrate-payment-step-7',
    'webdev-integrate-analytics-step-1', 'webdev-integrate-analytics-step-2', 'webdev-integrate-analytics-step-3', 'webdev-integrate-analytics-step-4', 'webdev-integrate-analytics-step-5', 'webdev-integrate-analytics-step-6', 'webdev-integrate-analytics-step-7',
    'webdev-integrate-ai-step-1', 'webdev-integrate-ai-step-2', 'webdev-integrate-ai-step-3', 'webdev-integrate-ai-step-4', 'webdev-integrate-ai-step-5', 'webdev-integrate-ai-step-6', 'webdev-integrate-ai-step-7',
    
    // WebDev Deploy page - ACTUAL step IDs from the code (inconsistent patterns!)
    'webdev-deploy-netlify-step-1', 'webdev-deploy-netlify-step-2', 'deploy-step-3', 'deploy-step-4', 'deploy-step-5', 'deploy-step-6', 'deploy-step-7',
    'vercel-step-1', 'vercel-step-2',
    'aws-step-1', 'aws-step-2', 'aws-step-3', 'aws-step-4',
    'gcp-step-1', 'gcp-step-2', 'gcp-step-3',
    'azure-step-1', 'azure-step-2', 'azure-step-3',
    'docker-step-1', 'docker-step-2', 'docker-step-3', 'docker-step-4',
    'cicd-step-1', 'cicd-step-2', 'cicd-step-3', 'cicd-step-4',
    
    // WebDev Optimize page - ACTUAL step IDs from the code (inconsistent patterns!)
    'webdev-optimize-perf-step-1', 'webdev-optimize-perf-step-2', 'perf-step-3', 'perf-step-4', 'perf-step-5', 'perf-step-6', 'perf-step-7',
    'seo-step-1', 'seo-step-2', 'seo-step-3', 'seo-step-4', 'seo-step-5', 'seo-step-6', 'seo-step-7',
    'a11y-step-1', 'a11y-step-2', 'a11y-step-3', 'a11y-step-4', 'a11y-step-5', 'a11y-step-6', 'a11y-step-7',
    'sec-step-1', 'sec-step-2', 'sec-step-3', 'sec-step-4', 'sec-step-5', 'sec-step-6', 'sec-step-7',
    'webdev-optimize-analytics-step-1', 'webdev-optimize-analytics-step-2', 'webdev-optimize-analytics-step-3', 'webdev-optimize-analytics-step-4', 'webdev-optimize-analytics-step-5', 'webdev-optimize-analytics-step-6', 'webdev-optimize-analytics-step-7',
    'test-step-1', 'test-step-2', 'test-step-3', 'test-step-4', 'test-step-5', 'test-step-6', 'test-step-7',
    'monitor-step-1', 'monitor-step-2', 'monitor-step-3', 'monitor-step-4', 'monitor-step-5', 'monitor-step-6', 'monitor-step-7'
  ],
  'ai-video': [
    // AI Course Factory page - simple tools with fewer steps  
    'veo3-step-1', 'veo3-step-2', 'veo3-step-3',
    'midjourney-step-1', 'midjourney-step-2',
    'elevenlabs-step-1',
    'runway-step-1',
    'pika-step-1',
    'topaz-step-1',
    'sfx-step-1',
    
    // Video Integrate page - varying step counts based on actual implementation
    'video-integrate-youtube-step-1', 'video-integrate-youtube-step-2', 'video-integrate-youtube-step-3', 'video-integrate-youtube-step-4', 'video-integrate-youtube-step-5',
    'video-integrate-social-step-1', 'video-integrate-social-step-2', 'video-integrate-social-step-3',
    'video-integrate-analytics-step-1', 'video-integrate-analytics-step-2', 'video-integrate-analytics-step-3',
    
    // Video Deploy page - based on actual step counts found
    'video-deploy-youtube-step-1', 'video-deploy-youtube-step-2', 'video-deploy-youtube-step-3', 'video-deploy-youtube-step-4',
    'video-deploy-social-step-1', 'video-deploy-social-step-2', 'video-deploy-social-step-3',
    'video-deploy-analytics-step-1', 'video-deploy-analytics-step-2', 'video-deploy-analytics-step-3',
    'video-deploy-monetization-step-1', 'video-deploy-monetization-step-2', 'video-deploy-monetization-step-3',
    
    // Video Optimize page - based on actual step counts found
    'video-optimize-analytics-step-1', 'video-optimize-analytics-step-2',
    'video-optimize-seo-step-1', 'video-optimize-seo-step-2', 'video-optimize-seo-step-3',
    'video-optimize-monetization-step-1', 'video-optimize-monetization-step-2', 'video-optimize-monetization-step-3'
  ],
  'advanced': [
    // Include all steps from all other focus areas
    // N8n steps
    'n8n-step-1', 'n8n-step-2', 'n8n-step-3', 'n8n-step-4', 'n8n-step-5', 'n8n-step-6', 'n8n-step-7',
    // Web dev steps
    'cursor-step-1', 'cursor-step-2', 'cursor-step-3', 'cursor-step-4',
    'github-step-1', 'github-step-2', 'github-step-3', 'github-step-4',
    // Video steps
    'veo3-step-1', 'veo3-step-2', 'veo3-step-3',
    'midjourney-step-1', 'midjourney-step-2',
    // And many more - this is just a subset for the advanced focus
  ],
  'explore': [] // Explore users don't have specific learning paths
};

export const useOverallProgress = (userFocus: 'ai-automation' | 'web-dev' | 'ai-video' | 'explore' | 'advanced') => {
  const [progress, setProgress] = useState<OverallProgress>({
    totalSteps: 0,
    completedSteps: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // For explore users, return 0 progress
      if (userFocus === 'explore') {
        setProgress({ totalSteps: 0, completedSteps: 0, percentage: 0 });
        setLoading(false);
        return;
      }

      const stepIds = FOCUS_STEP_MAPPING[userFocus];

      if (!stepIds || stepIds.length === 0) {
        setProgress({ totalSteps: 0, completedSteps: 0, percentage: 0 });
        setLoading(false);
        return;
      }

      // Calculate total steps from our predefined step list
      const totalSteps = stepIds.length;

      // Fetch only completed steps for this focus area
      const { data: completedStepsData, error } = await supabase
        .from('user_learning_progress')
        .select('step_id')
        .eq('user_id', user.id)
        .eq('completed', true)
        .in('step_id', stepIds);

      if (error) throw error;

      // Count completed steps
      const completedSteps = completedStepsData?.length || 0;
      
      const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

      console.log(`Progress calculation for ${userFocus}:`, {
        totalSteps,
        completedSteps,
        percentage,
        stepIds: stepIds.length,
        completedStepsData: completedStepsData?.length
      });

      setProgress({
        totalSteps,
        completedSteps,
        percentage
      });

    } catch (err) {
      console.error('Error calculating overall progress:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setProgress({ totalSteps: 0, completedSteps: 0, percentage: 0 });
    } finally {
      setLoading(false);
    }
  }, [userFocus]);

  // Listen for progress updates from individual tools
  useEffect(() => {
    const handleProgressUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const stepIds = FOCUS_STEP_MAPPING[userFocus];
      
      if (stepIds && stepIds.includes(customEvent.detail?.stepId)) {
        // Recalculate progress when any relevant step is updated
        calculateProgress();
      }
    };

    window.addEventListener('userProgressUpdated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('userProgressUpdated', handleProgressUpdate);
    };
  }, [calculateProgress, userFocus]);

  // Calculate progress on mount and when focus changes
  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  return {
    progress,
    loading,
    error,
    refetch: calculateProgress
  };
};
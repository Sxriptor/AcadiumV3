import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { guestMode } from '../lib/guestMode';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const useUserChecklist = (toolId: string) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user checklist items for the specified tool
  const fetchUserChecklist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if in guest mode
      if (guestMode.isGuestMode()) {
        const checklistItems = guestMode.getGuestChecklist();
        const completedItemIds = new Set(
          checklistItems
            .filter(item => item.tool_id === toolId && item.completed)
            .map(item => item.checklist_item_id)
        );
        setCompletedItems(completedItemIds);
        return;
      }

      // Regular Supabase flow
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_checklist_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .eq('completed', true);

      if (error) throw error;

      // Create a Set of completed checklist item IDs
      const completedItemIds = new Set((data || []).map(item => item.checklist_item_id));
      setCompletedItems(completedItemIds);
    } catch (err) {
      console.error('Error fetching user checklist:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [toolId]);

  // Update checklist item status
  const updateChecklistItem = useCallback(async (itemId: string, completed: boolean) => {
    try {
      // Check if in guest mode
      if (guestMode.isGuestMode()) {
        guestMode.updateChecklistItem(toolId, itemId, completed);
        setCompletedItems(prev => {
          const newSet = new Set(prev);
          if (completed) {
            newSet.add(itemId);
          } else {
            newSet.delete(itemId);
          }
          return newSet;
        });
        window.dispatchEvent(new CustomEvent('userChecklistUpdated', { 
          detail: { toolId, itemId, completed } 
        }));
        return true;
      }

      // Regular Supabase flow
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('user_checklist_items')
        .upsert({
          user_id: user.id,
          tool_id: toolId,
          checklist_item_id: itemId,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,tool_id,checklist_item_id'
        });

      if (error) throw error;

      // Update local state
      setCompletedItems(prev => {
        const newSet = new Set(prev);
        if (completed) {
          newSet.add(itemId);
        } else {
          newSet.delete(itemId);
        }
        return newSet;
      });
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('userChecklistUpdated', { 
        detail: { toolId, itemId, completed } 
      }));
      
      return true;
    } catch (err) {
      console.error('Error updating checklist item:', err);
      return false;
    }
  }, [toolId]);

  // Check if an item is completed
  const isItemCompleted = useCallback((itemId: string) => {
    return completedItems.has(itemId);
  }, [completedItems]);

  // Get completion percentage
  const getCompletionPercentage = useCallback((totalItems: number) => {
    return totalItems > 0 ? (completedItems.size / totalItems) * 100 : 0;
  }, [completedItems]);

  // Load user checklist on component mount
  useEffect(() => {
    fetchUserChecklist();
    
    // Listen for updates from other components
    const handleChecklistUpdate = (event: CustomEvent) => {
      if (event.detail?.toolId === toolId) {
        fetchUserChecklist();
      }
    };
    
    window.addEventListener('userChecklistUpdated', handleChecklistUpdate as EventListener);
    
    return () => {
      window.removeEventListener('userChecklistUpdated', handleChecklistUpdate as EventListener);
    };
  }, [fetchUserChecklist, toolId]);

  return {
    completedItems,
    loading,
    error,
    updateChecklistItem,
    isItemCompleted,
    getCompletionPercentage,
    refetch: fetchUserChecklist
  };
};
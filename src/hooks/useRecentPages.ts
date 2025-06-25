import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { guestMode } from '../lib/guestMode';

export interface RecentPage {
  id: string;
  page_path: string;
  page_title: string;
  page_icon: string;
  last_visited: string;
  visit_count: number;
}

export const useRecentPages = () => {
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentPages = useCallback(async () => {
    try {
      // Handle guest mode
      if (guestMode.isGuestMode()) {
        const guestRecentPages = guestMode.getGuestRecentPages();
        // Convert guest recent pages to match the interface and limit to 5
        const formattedRecentPages: RecentPage[] = guestRecentPages
          .slice(0, 5)
          .map(page => ({
            id: page.id,
            page_path: page.page_path,
            page_title: page.page_title,
            page_icon: page.page_icon,
            last_visited: page.last_visited,
            visit_count: page.visit_count
          }));
        setRecentPages(formattedRecentPages);
        setLoading(false);
        return;
      }

      // Handle regular users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_recent_pages')
        .select('*')
        .eq('user_id', user.id)
        .order('last_visited', { ascending: false })
        .limit(5); // Only show last 5 recent pages

      if (error) throw error;
      setRecentPages(data || []);
    } catch (error) {
      console.error('Error fetching recent pages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToRecent = useCallback(async (path: string, title: string, icon: string) => {
    try {
      // Handle guest mode
      if (guestMode.isGuestMode()) {
        guestMode.addToRecentPages(path, title, icon);
        
        // Immediately refresh the data to update the sidebar
        await fetchRecentPages();
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('recentPagesUpdated'));
        return;
      }

      // Handle regular users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use upsert to handle both insert and update cases
      const { error } = await supabase
        .from('user_recent_pages')
        .upsert(
          {
            user_id: user.id,
            page_path: path,
            page_title: title,
            page_icon: icon,
            last_visited: new Date().toISOString(),
            visit_count: 1
          },
          {
            onConflict: 'user_id,page_path',
            ignoreDuplicates: false
          }
        );

      if (error) throw error;

      // After upserting, check if we need to clean up old entries
      const { data: allRecent } = await supabase
        .from('user_recent_pages')
        .select('id')
        .eq('user_id', user.id)
        .order('last_visited', { ascending: false });

      // If we have more than 5 items, remove the oldest ones
      if (allRecent && allRecent.length > 5) {
        const itemsToRemove = allRecent.slice(5); // Keep only the 5 most recent
        const idsToRemove = itemsToRemove.map(item => item.id);
        
        await supabase
          .from('user_recent_pages')
          .delete()
          .in('id', idsToRemove);
      }

      // Immediately refresh the data to update the sidebar
      await fetchRecentPages();
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('recentPagesUpdated'));
    } catch (error) {
      console.error('Error adding to recent pages:', error);
    }
  }, [fetchRecentPages]);

  const clearAllRecent = useCallback(async () => {
    try {
      // Handle guest mode
      if (guestMode.isGuestMode()) {
        guestMode.clearAllRecentPages();
        
        // Immediately refresh the data to update the sidebar
        await fetchRecentPages();
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('recentPagesUpdated'));
        return true;
      }

      // Handle regular users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_recent_pages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Immediately refresh the data to update the sidebar
      await fetchRecentPages();
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('recentPagesUpdated'));
      return true;
    } catch (error) {
      console.error('Error clearing all recent pages:', error);
      return false;
    }
  }, [fetchRecentPages]);

  useEffect(() => {
    fetchRecentPages();

    // Listen for updates from other components
    const handleUpdate = () => {
      fetchRecentPages();
    };

    window.addEventListener('recentPagesUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('recentPagesUpdated', handleUpdate);
    };
  }, [fetchRecentPages]);

  return {
    recentPages,
    loading,
    addToRecent,
    clearAllRecent,
    refetch: fetchRecentPages
  };
};
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { guestMode } from '../lib/guestMode';

export interface FavoritePage {
  id: string;
  page_path: string;
  page_title: string;
  page_icon: string;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoritePage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      // Handle guest mode
      if (guestMode.isGuestMode()) {
        const guestFavorites = guestMode.getGuestFavorites();
        // Convert guest favorites to match the interface and limit to 5
        const formattedFavorites: FavoritePage[] = guestFavorites
          .slice(0, 5)
          .map(fav => ({
            id: fav.id,
            page_path: fav.page_path,
            page_title: fav.page_title,
            page_icon: fav.page_icon,
            created_at: fav.created_at
          }));
        setFavorites(formattedFavorites);
        setLoading(false);
        return;
      }

      // Handle regular users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5); // Only show last 5 favorites

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToFavorites = useCallback(async (path: string, title: string, icon: string) => {
    try {
      // Handle guest mode
      if (guestMode.isGuestMode()) {
        const currentFavorites = guestMode.getGuestFavorites();
        
        // Check if already exists
        if (currentFavorites.some(fav => fav.page_path === path)) {
          return true; // Already favorited
        }
        
        // If we have 5 or more favorites, remove the oldest one
        if (currentFavorites.length >= 5) {
          const sortedFavorites = currentFavorites.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          guestMode.removeFromFavorites(sortedFavorites[0].page_path);
        }
        
        guestMode.addToFavorites(path, title, icon);
        
        // Immediately refresh the data to update the sidebar
        await fetchFavorites();
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        return true;
      }

      // Handle regular users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if we already have 5 favorites
      const { data: allFavorites } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true }); // Oldest first

      // If we have 5 or more favorites, remove the oldest one
      if (allFavorites && allFavorites.length >= 5) {
        const oldestId = allFavorites[0].id;
        await supabase
          .from('user_favorites')
          .delete()
          .eq('id', oldestId);
      }

      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          page_path: path,
          page_title: title,
          page_icon: icon
        });

      if (error) throw error;
      
      // Immediately refresh the data to update the sidebar
      await fetchFavorites();
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }, [fetchFavorites]);

  const removeFromFavorites = useCallback(async (path: string) => {
    try {
      // Handle guest mode
      if (guestMode.isGuestMode()) {
        guestMode.removeFromFavorites(path);
        
        // Immediately refresh the data to update the sidebar
        await fetchFavorites();
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        return true;
      }

      // Handle regular users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('page_path', path);

      if (error) throw error;
      
      // Immediately refresh the data to update the sidebar
      await fetchFavorites();
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }, [fetchFavorites]);

  const clearAllFavorites = useCallback(async () => {
    try {
      // Handle guest mode
      if (guestMode.isGuestMode()) {
        guestMode.clearAllFavorites();
        
        // Immediately refresh the data to update the sidebar
        await fetchFavorites();
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        return true;
      }

      // Handle regular users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Immediately refresh the data to update the sidebar
      await fetchFavorites();
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
      return true;
    } catch (error) {
      console.error('Error clearing all favorites:', error);
      return false;
    }
  }, [fetchFavorites]);

  const isFavorite = useCallback((path: string) => {
    // Handle guest mode
    if (guestMode.isGuestMode()) {
      return guestMode.isFavorite(path);
    }
    
    // Handle regular users
    return favorites.some(fav => fav.page_path === path);
  }, [favorites]);

  useEffect(() => {
    fetchFavorites();

    // Listen for updates from other components
    const handleUpdate = () => {
      fetchFavorites();
    };

    window.addEventListener('favoritesUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleUpdate);
    };
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    isFavorite,
    refetch: fetchFavorites
  };
};
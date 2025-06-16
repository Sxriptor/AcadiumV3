import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Link as LinkIcon, Camera, Upload } from 'lucide-react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { supabase } from '../../lib/supabase';

const ProfileSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    avatar_url: '',
    email: ''
  });
  const { theme } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          avatar_url: profileData.avatar_url || '',
          email: user.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if it exists
      if (profile.avatar_url) {
        const existingPath = profile.avatar_url.split('/').pop();
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

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      
      // Trigger a custom event to update header
      window.dispatchEvent(new CustomEvent('profileUpdated'));

    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: profile.full_name
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Trigger a custom event to update header
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>Profile Settings</h2>
        <p className={`text-sm mt-1 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
        }`}>
          Manage your personal information and public profile.
        </p>
      </div>

      <Card>
        <div className="space-y-8">
          {/* Profile Picture */}
          <div className="flex items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
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
            <div className="ml-6">
              <h3 className={`text-sm font-medium ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>Profile Picture</h3>
              <p className={`text-sm mt-1 ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Upload a new profile picture or avatar. Max size: 5MB
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                disabled={uploading}
                onClick={() => document.querySelector('input[type="file"]')?.click()}
              >
                {uploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Picture
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Display Name
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'gradient'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
                placeholder="Your display name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Username
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'gradient'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
                placeholder="@username"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className={`w-full px-4 py-2 rounded-lg border opacity-50 cursor-not-allowed ${
                  theme === 'gradient'
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
                placeholder="your@email.com"
              />
              <p className={`text-xs mt-1 ${
                theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                Email cannot be changed from this page
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Bio
              </label>
              <textarea
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  theme === 'gradient'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className={`text-sm font-medium mb-4 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>Social Links</h3>
            <div className="space-y-4">
              {['Twitter', 'GitHub', 'Discord'].map((platform) => (
                <div key={platform} className="flex items-center">
                  <LinkIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                  <input
                    type="text"
                    className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'gradient'
                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                    placeholder={`${platform} profile URL`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
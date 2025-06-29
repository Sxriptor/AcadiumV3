# Discord Integration Page - Bolt Instructions

## Overview
Add a new Discord integration page to the Acadium AI platform that allows users to join the Discord community and access exclusive channels based on their subscription tier and learning path.

## Page Requirements

### 1. Route & Navigation
- **Route**: `/discord`
- **Navigation**: Add "Discord Community" link to main navigation and dashboard
- **Icon**: Discord icon from Lucide React
- **Access**: Available to all users (verified and unverified)

### 2. Page Structure

#### Hero Section
```jsx
- Large Discord logo/icon
- Headline: "Join the Acadium AI Discord Community"
- Subheadline: "Connect with fellow moguls, get instant help, and access exclusive channels"
- Primary CTA: "Join Discord Server" button
- Secondary info: "X,XXX members • Active 24/7"
```

#### Benefits Section
```jsx
- Grid layout with 4-6 benefit cards:
  • "Real-time Support" - Get instant help from instructors and community
  • "Exclusive Channels" - Access based on your subscription tier
  • "Weekly Challenges" - Participate in cash missions and competitions
  • "Direct Mentorship" - 1-on-1 guidance from AI experts
  • "Collaboration Hub" - Find partners for projects
  • "Resource Library" - Exclusive tools, templates, and guides
```

#### Learning Path Channels Preview
```jsx
- 4 cards showing channel categories:
  • 🛠️ Build Zone - "Vibe Coding Lab, AI Course Factory, Prompt Engineering"
  • ⚙️ Automate Zone - "N8n AI Agents, Signal Intelligence, Genesis Engine"
  • 💰 Monetize Zone - "Speed Wealth Systems, Cashflow Arena, Digital Ghostwriting"
  • 📊 Analyze Zone - "Market Recon, Analytics Dashboard, Portfolio Showcase"
```

#### Subscription Tier Benefits
```jsx
- 3 tiers with different Discord access levels:
  
  FREE TIER:
  • General community channels
  • Welcome and rules access
  • Basic learning path channels
  • Weekly challenges participation
  
  PREMIUM TIER:
  • All free tier benefits
  • Premium-only channels
  • Priority support
  • Advanced strategy discussions
  • Exclusive workshops
  
  VIP TIER:
  • All premium benefits
  • VIP lounge access
  • 1-on-1 mentorship channels
  • Direct access to founders
  • Advanced monetization strategies
  • Early access to new features
```

#### How to Join Section
```jsx
- Step-by-step process:
  1. "Click Join Discord Server"
  2. "Complete Discord verification"
  3. "Link your Acadium account"
  4. "Get assigned appropriate roles"
  5. "Start networking and learning!"
```

#### Community Guidelines Preview
```jsx
- Brief overview of rules:
  • Be respectful and professional
  • No spam or self-promotion without permission
  • Share knowledge and help others
  • Follow channel-specific guidelines
  • Report issues to moderators
```

### 3. Technical Implementation

#### Discord Integration Logic
```jsx
// Check user's subscription status
const getUserDiscordAccess = (user) => {
  const tier = user.subscription_tier;
  const learningPaths = user.selected_learning_paths;
  
  return {
    tier: tier || 'free',
    channels: getAccessibleChannels(tier, learningPaths),
    roles: getAssignableRoles(tier, learningPaths)
  };
};

// Generate Discord invite with user context
const generateDiscordInvite = async (user) => {
  const accessLevel = getUserDiscordAccess(user);
  
  // Use different invite links based on tier for role assignment
  const inviteLinks = {
    free: 'https://discord.gg/acadium-free',
    premium: 'https://discord.gg/acadium-premium', 
    vip: 'https://discord.gg/acadium-vip'
  };
  
  return inviteLinks[accessLevel.tier];
};
```

#### State Management
```jsx
const [userDiscordStatus, setUserDiscordStatus] = useState({
  isConnected: false,
  discordUsername: null,
  serverMember: false,
  roles: []
});

const [discordInvite, setDiscordInvite] = useState(null);
```

#### API Calls
```jsx
// Check if user is already in Discord server
const checkDiscordStatus = async () => {
  try {
    const response = await supabase
      .from('user_discord_connections')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setUserDiscordStatus(response.data || {});
  } catch (error) {
    console.error('Error checking Discord status:', error);
  }
};

// Generate personalized invite
const getDiscordInvite = async () => {
  const invite = await generateDiscordInvite(user);
  setDiscordInvite(invite);
};
```

### 4. UI Components

#### Main CTA Button
```jsx
<button className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 transition-all transform hover:scale-105">
  <MessageCircle className="w-6 h-6" />
  Join Discord Server
</button>
```

#### Status Badge (if already connected)
```jsx
{userDiscordStatus.isConnected && (
  <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
    <CheckCircle className="w-5 h-5" />
    Connected as {userDiscordStatus.discordUsername}
  </div>
)}
```

#### Tier Comparison Cards
```jsx
<div className="grid md:grid-cols-3 gap-6">
  {['Free', 'Premium', 'VIP'].map(tier => (
    <div key={tier} className={`border rounded-lg p-6 ${
      tier === 'VIP' ? 'border-yellow-400 bg-yellow-50' : 
      tier === 'Premium' ? 'border-blue-400 bg-blue-50' : 
      'border-gray-200'
    }`}>
      <h3 className="text-xl font-bold mb-4">{tier} Access</h3>
      {/* Benefits list */}
    </div>
  ))}
</div>
```

### 5. Database Schema Updates

#### Add Discord Connection Table
```sql
CREATE TABLE user_discord_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  discord_user_id TEXT UNIQUE,
  discord_username TEXT,
  is_server_member BOOLEAN DEFAULT FALSE,
  assigned_roles TEXT[],
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Update User Profiles
```sql
ALTER TABLE profiles ADD COLUMN discord_connected BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN discord_roles TEXT[];
```

### 6. SEO & Metadata
```jsx
<Helmet>
  <title>Join Discord Community - Acadium AI</title>
  <meta name="description" content="Connect with fellow AI entrepreneurs, get instant support, and access exclusive Discord channels based on your learning path." />
  <meta property="og:title" content="Acadium AI Discord Community" />
  <meta property="og:description" content="Join thousands of AI moguls building profitable tools and automating income systems." />
</Helmet>
```

### 7. Responsive Design
- Mobile-first approach
- Stack tier cards vertically on mobile
- Adjust button sizes for touch interfaces
- Ensure Discord branding is visible on all screen sizes

### 8. Analytics Tracking
```jsx
// Track Discord page visits
useEffect(() => {
  analytics.track('Discord Page Viewed', {
    user_id: user.id,
    subscription_tier: user.subscription_tier,
    timestamp: new Date().toISOString()
  });
}, []);

// Track Discord joins
const handleDiscordJoin = () => {
  analytics.track('Discord Join Clicked', {
    user_id: user.id,
    subscription_tier: user.subscription_tier,
    invite_type: discordInvite
  });
  
  window.open(discordInvite, '_blank');
};
```

### 9. Error Handling
```jsx
const [error, setError] = useState(null);

const handleDiscordError = (error) => {
  setError('Unable to connect to Discord. Please try again or contact support.');
  console.error('Discord integration error:', error);
};
```

### 10. Loading States
```jsx
const [isLoading, setIsLoading] = useState(true);

// Show loading spinner while checking Discord status
{isLoading ? (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
) : (
  // Main content
)}
```

## Implementation Notes

1. **Use existing design system** - Follow Acadium AI's current color scheme and typography
2. **Integrate with authentication** - Respect user verification status and subscription tiers
3. **Add to navigation** - Include Discord link in main nav and dashboard
4. **Mobile optimization** - Ensure great experience on all devices
5. **Analytics integration** - Track user engagement with Discord features
6. **Error boundaries** - Handle Discord API failures gracefully
7. **Accessibility** - Include proper ARIA labels and keyboard navigation

## Success Metrics
- Discord page views
- Discord server joins from platform
- User engagement in Discord channels
- Retention correlation between Discord activity and platform usage
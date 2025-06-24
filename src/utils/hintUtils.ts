// Utility functions for managing hint overlay behavior

/**
 * Mark that the user is coming from onboarding
 * This should be called when redirecting from onboarding to dashboard
 */
export const markFromOnboarding = () => {
  sessionStorage.setItem('from_onboarding', 'true');
};

/**
 * Check if user is coming from onboarding
 */
export const isFromOnboarding = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('from_onboarding') === 'true' || 
         sessionStorage.getItem('from_onboarding') === 'true';
};

/**
 * Clear the onboarding flag
 */
export const clearOnboardingFlag = () => {
  sessionStorage.removeItem('from_onboarding');
  // Also clear URL parameter if present
  const url = new URL(window.location.href);
  url.searchParams.delete('from_onboarding');
  window.history.replaceState({}, '', url.toString());
};

/**
 * Check if user has already seen hints
 */
export const hasSeenHints = (): boolean => {
  return localStorage.getItem('acadium_hints_shown') === 'true';
};

/**
 * Mark hints as shown
 */
export const markHintsAsShown = () => {
  localStorage.setItem('acadium_hints_shown', 'true');
};

/**
 * Reset hints status (for testing or if user wants to see them again)
 */
export const resetHintsStatus = () => {
  localStorage.removeItem('acadium_hints_shown');
};

/**
 * Navigate to dashboard with onboarding flag
 * This function can be used from onboarding pages
 */
export const navigateToDashboardFromOnboarding = () => {
  markFromOnboarding();
  // Redirect to dashboard
  window.location.href = '/dashboard';
};

/**
 * Mark that the user just completed payment
 * This should be called after successful payment
 */
export const markFromPayment = () => {
  sessionStorage.setItem('from_payment', 'true');
};

/**
 * Check if user is coming from payment
 */
export const isFromPayment = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('from_payment') === 'true' || 
         sessionStorage.getItem('from_payment') === 'true';
};

/**
 * Clear the payment flag
 */
export const clearPaymentFlag = () => {
  sessionStorage.removeItem('from_payment');
  // Also clear URL parameter if present
  const url = new URL(window.location.href);
  url.searchParams.delete('from_payment');
  window.history.replaceState({}, '', url.toString());
};

/**
 * Check if user has already been shown Discord invite
 */
export const hasSeenDiscordInvite = (): boolean => {
  return localStorage.getItem('acadium_discord_invite_shown') === 'true';
};

/**
 * Mark Discord invite as shown
 */
export const markDiscordInviteAsShown = () => {
  localStorage.setItem('acadium_discord_invite_shown', 'true');
};

/**
 * Reset Discord invite status (for testing)
 */
export const resetDiscordInviteStatus = () => {
  localStorage.removeItem('acadium_discord_invite_shown');
};

/**
 * Open Discord invite link
 */
export const openDiscordInvite = () => {
  window.open('https://discord.gg/RKRvQAzPCJ', '_blank');
}; 
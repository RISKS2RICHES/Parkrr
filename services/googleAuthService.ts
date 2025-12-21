
/**
 * GOOGLE AUTH SERVICE (DISABLED)
 * 
 * This application is currently operating as a website/landing page only.
 * All authentication connections have been removed.
 */

export const googleAuthService = {
  signIn: async (): Promise<{ name: string; email: string; avatar: string; googleId: string }> => {
    throw new Error("Google Sign-In is disabled on this website.");
  }
};
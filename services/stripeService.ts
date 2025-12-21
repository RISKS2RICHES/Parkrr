
/**
 * STRIPE SERVICE (DISABLED)
 * 
 * This application is currently operating as a website/landing page only.
 * All payment processing connections have been removed.
 */

export const STRIPE_PK = '';

export const stripeService = {
  createSession: async (userId: string, email?: string) => {
    console.log("Stripe service is disabled.");
    return { success: false, client_secret: '', id: '' };
  },

  checkStatus: async (sessionId: string) => {
    console.log("Stripe service is disabled.");
    return {
      status: 'canceled',
      verified: false,
      verifiedOutputs: null,
      lastError: null
    };
  }
};
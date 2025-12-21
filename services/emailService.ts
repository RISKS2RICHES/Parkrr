
import { EMAIL_CONFIG } from './config.ts';

interface EmailParams {
  to_email: string;
  to_name: string;
  verification_code: string;
  subject: string;
  message: string;
}

export const sendRealEmail = async (params: EmailParams): Promise<{ success: boolean; error?: string }> => {
  if (!EMAIL_CONFIG.ENABLED || EMAIL_CONFIG.PUBLIC_KEY === 'user_placeholder_key') {
    console.warn("Real Email Sending is disabled or keys are missing. Falling back to internal inbox.");
    return { success: false, error: 'KEYS_NOT_CONFIGURED' };
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAIL_CONFIG.SERVICE_ID,
        template_id: EMAIL_CONFIG.TEMPLATE_ID,
        user_id: EMAIL_CONFIG.PUBLIC_KEY,
        template_params: params,
      }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown network error' };
  }
};

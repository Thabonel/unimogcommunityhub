
import { supabase } from '@/lib/supabase-client';
import { SendEmailOptions, EmailType } from './types';

/**
 * Core function to send an email through the Supabase edge function
 * Uses Mailgun to deliver emails
 */
export const sendEmail = async ({ to, subject, message, html, type = 'noreply' }: SendEmailOptions) => {
  try {
    // Determine the from address based on the type
    // NOTE: These email addresses are not currently configured
    // All emails will use a fallback or system email
    const fromMap: Record<EmailType, string> = {
      noreply: 'noreply@unimogcommunityhub.com', // Not configured - system will use default
      info: 'info@unimogcommunityhub.com',       // Not configured - system will use default
      help: 'help@unimogcommunityhub.com'        // Not configured - system will use default
    };
    
    const from = fromMap[type];
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        from,
        subject,
        text: message,
        html: html || message
      }
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { data: null, error };
  }
};

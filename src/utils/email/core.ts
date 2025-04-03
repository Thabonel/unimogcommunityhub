
import { supabase } from '@/lib/supabase';
import { SendEmailOptions, EmailType } from './types';

/**
 * Core function to send an email through the Supabase edge function
 * Uses Mailgun to deliver emails
 */
export const sendEmail = async ({ to, subject, message, html, type = 'noreply' }: SendEmailOptions) => {
  try {
    // Determine the from address based on the type
    const fromMap: Record<EmailType, string> = {
      noreply: 'noreply@unimogcommunityhub.com',
      info: 'info@unimogcommunityhub.com',
      help: 'help@unimogcommunityhub.com'
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

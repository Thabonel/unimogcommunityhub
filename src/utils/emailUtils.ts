
import { supabase } from '@/lib/supabase';

export type EmailType = 'noreply' | 'info' | 'help';

interface SendEmailOptions {
  to: string;
  subject: string;
  message: string;
  html?: string;
  type?: EmailType;
}

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

// Admin notification for user bans
export const sendUserBanNotification = async (
  adminEmail: string, 
  userEmail: string, 
  duration: number,
  reason?: string
) => {
  const subject = `User Banned: ${userEmail}`;
  
  const banEndDate = new Date();
  banEndDate.setDate(banEndDate.getDate() + duration);
  
  const html = `
    <h2>User Ban Notification</h2>
    <p>A user has been banned from the Unimog Community Hub platform.</p>
    <hr>
    <p><strong>User Email:</strong> ${userEmail}</p>
    <p><strong>Ban Duration:</strong> ${duration} days (until ${banEndDate.toLocaleDateString()})</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <hr>
    <p>This is an automated notification. Please do not reply to this email.</p>
  `;
  
  return sendEmail({
    to: adminEmail,
    subject,
    message: `User Ban Notification: ${userEmail} has been banned for ${duration} days.`,
    html,
    type: 'info'
  });
};

// Admin notification for article deletions
export const sendArticleDeletedNotification = async (
  adminEmail: string, 
  articleTitle: string,
  articleCategory: string,
  deletedBy?: string
) => {
  const subject = `Article Deleted: ${articleTitle}`;
  
  const html = `
    <h2>Article Deletion Notification</h2>
    <p>An article has been permanently deleted from the Unimog Community Hub platform.</p>
    <hr>
    <p><strong>Article Title:</strong> ${articleTitle}</p>
    <p><strong>Category:</strong> ${articleCategory}</p>
    ${deletedBy ? `<p><strong>Deleted By:</strong> ${deletedBy}</p>` : ''}
    <p><strong>Deletion Time:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    <p>This is an automated notification. Please do not reply to this email.</p>
  `;
  
  return sendEmail({
    to: adminEmail,
    subject,
    message: `Article Deletion Notification: "${articleTitle}" in category ${articleCategory} has been permanently deleted.`,
    html,
    type: 'info'
  });
};

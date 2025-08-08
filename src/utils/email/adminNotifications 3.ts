
import { sendEmail } from './core';
import { UserBanEmailParams, ArticleDeletedEmailParams } from './types';

// Admin notification for user bans
export const sendUserBanNotification = async ({
  adminEmail, 
  userEmail, 
  duration,
  reason
}: UserBanEmailParams) => {
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
export const sendArticleDeletedNotification = async ({
  adminEmail, 
  articleTitle,
  articleCategory,
  deletedBy
}: ArticleDeletedEmailParams) => {
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

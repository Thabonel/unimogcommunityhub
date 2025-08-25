import { supabase } from '@/lib/supabase-client';

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

// New marketplace notifications

// Listing created notification
export const sendListingCreatedNotification = async (
  userEmail: string,
  listingTitle: string,
  listingId: string
) => {
  const subject = `Your Listing Published: ${listingTitle}`;
  
  const html = `
    <h2>Your Listing is Now Live!</h2>
    <p>Congratulations! Your listing has been successfully published on the Unimog Community Hub Marketplace.</p>
    <hr>
    <p><strong>Listing Title:</strong> ${listingTitle}</p>
    <p><strong>Listing ID:</strong> ${listingId}</p>
    <p><strong>Publication Time:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    <p>Your listing is now visible to the Unimog community. You'll receive a notification when someone is interested in your item.</p>
    <p>Best regards,<br>The Unimog Community Hub Team</p>
  `;
  
  return sendEmail({
    to: userEmail,
    subject,
    message: `Your listing "${listingTitle}" has been successfully published on the Unimog Community Hub Marketplace.`,
    html,
    type: 'noreply'
  });
};

// Item sold notification
export const sendItemSoldNotification = async (
  sellerEmail: string,
  buyerEmail: string,
  listingTitle: string,
  amount: number
) => {
  const subject = `Item Sold: ${listingTitle}`;
  
  const sellerHtml = `
    <h2>Congratulations! Your Item Has Sold</h2>
    <p>Great news! Your item has been purchased by a member of the Unimog Community Hub.</p>
    <hr>
    <p><strong>Item:</strong> ${listingTitle}</p>
    <p><strong>Sale Amount:</strong> $${amount.toFixed(2)}</p>
    <p><strong>Sale Time:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    <p>The buyer's payment has been processed successfully. Please prepare the item for shipping or local pickup as agreed with the buyer.</p>
    <p>The buyer's email is: ${buyerEmail}</p>
    <p>Remember to communicate with the buyer regarding delivery details.</p>
    <p>Best regards,<br>The Unimog Community Hub Team</p>
  `;
  
  return sendEmail({
    to: sellerEmail,
    subject,
    message: `Your item "${listingTitle}" has been sold for $${amount.toFixed(2)}.`,
    html: sellerHtml,
    type: 'info'
  });
};

// Payment processed notification
export const sendPaymentProcessedNotification = async (
  userEmail: string,
  amount: number,
  listingTitle: string,
  transactionId: string
) => {
  const subject = `Payment Processed: $${amount.toFixed(2)}`;
  
  const html = `
    <h2>Payment Confirmation</h2>
    <p>Your payment has been successfully processed.</p>
    <hr>
    <p><strong>Item:</strong> ${listingTitle}</p>
    <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
    <p><strong>Transaction ID:</strong> ${transactionId}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    <p>Thank you for your purchase. The seller has been notified and will be in touch regarding shipping or pickup details.</p>
    <p>If you have any questions about your purchase, please contact us at help@unimogcommunityhub.com.</p>
    <p>Best regards,<br>The Unimog Community Hub Team</p>
  `;
  
  return sendEmail({
    to: userEmail,
    subject,
    message: `Your payment of $${amount.toFixed(2)} for "${listingTitle}" has been successfully processed.`,
    html,
    type: 'info'
  });
};

// Commission fee notification
export const sendCommissionFeeNotification = async (
  sellerEmail: string,
  listingTitle: string,
  amount: number,
  commission: number,
  finalAmount: number
) => {
  const subject = `Commission Fee: Sale of ${listingTitle}`;
  
  const html = `
    <h2>Sale Commission Details</h2>
    <p>A commission fee has been applied to your recent sale on the Unimog Community Hub Marketplace.</p>
    <hr>
    <p><strong>Item Sold:</strong> ${listingTitle}</p>
    <p><strong>Sale Amount:</strong> $${amount.toFixed(2)}</p>
    <p><strong>Commission Fee:</strong> $${commission.toFixed(2)}</p>
    <p><strong>Final Amount:</strong> $${finalAmount.toFixed(2)}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    <p>The final amount has been credited to your account. Thank you for using the Unimog Community Hub Marketplace!</p>
    <p>Best regards,<br>The Unimog Community Hub Team</p>
  `;
  
  return sendEmail({
    to: sellerEmail,
    subject,
    message: `A commission fee of $${commission.toFixed(2)} has been applied to your sale of "${listingTitle}". Your final payment is $${finalAmount.toFixed(2)}.`,
    html,
    type: 'info'
  });
};

// Order confirmation email
export const sendOrderConfirmationEmail = async (
  buyerEmail: string,
  sellerEmail: string,
  listingTitle: string,
  amount: number,
  orderId: string
) => {
  const subject = `Order Confirmation #${orderId}`;
  
  const html = `
    <h2>Order Confirmation</h2>
    <p>Thank you for your purchase on the Unimog Community Hub Marketplace!</p>
    <hr>
    <p><strong>Order ID:</strong> #${orderId}</p>
    <p><strong>Item:</strong> ${listingTitle}</p>
    <p><strong>Total Paid:</strong> $${amount.toFixed(2)}</p>
    <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    <p>The seller (${sellerEmail}) has been notified of your purchase and will contact you regarding shipping or pickup details.</p>
    <p>If you have any questions about your order, please contact us at help@unimogcommunityhub.com.</p>
    <p>Best regards,<br>The Unimog Community Hub Team</p>
  `;
  
  return sendEmail({
    to: buyerEmail,
    subject,
    message: `Thank you for your order of "${listingTitle}" ($${amount.toFixed(2)}). Order ID: #${orderId}`,
    html,
    type: 'info'
  });
};

// Shipment notification
export const sendShipmentNotificationEmail = async (
  buyerEmail: string,
  listingTitle: string,
  orderId: string,
  trackingNumber?: string,
  carrier?: string
) => {
  const subject = `Your Order #${orderId} Has Been Shipped`;
  
  const trackingInfo = trackingNumber && carrier
    ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>
       <p><strong>Carrier:</strong> ${carrier}</p>`
    : '<p>Please contact the seller for tracking information.</p>';
  
  const html = `
    <h2>Your Order Has Been Shipped</h2>
    <p>Good news! Your recent order from the Unimog Community Hub Marketplace has been shipped.</p>
    <hr>
    <p><strong>Order ID:</strong> #${orderId}</p>
    <p><strong>Item:</strong> ${listingTitle}</p>
    <p><strong>Shipping Date:</strong> ${new Date().toLocaleString()}</p>
    ${trackingInfo}
    <hr>
    <p>If you have any questions about your shipment, please contact us at help@unimogcommunityhub.com.</p>
    <p>Best regards,<br>The Unimog Community Hub Team</p>
  `;
  
  return sendEmail({
    to: buyerEmail,
    subject,
    message: `Your order #${orderId} for "${listingTitle}" has been shipped.`,
    html,
    type: 'info'
  });
};

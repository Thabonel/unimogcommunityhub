
import { sendEmail } from './core';
import { 
  ListingCreatedEmailParams,
  ItemSoldEmailParams, 
  PaymentProcessedEmailParams, 
  CommissionFeeEmailParams 
} from './types';

// Listing created notification
export const sendListingCreatedNotification = async ({
  userEmail,
  listingTitle,
  listingId
}: ListingCreatedEmailParams) => {
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
export const sendItemSoldNotification = async ({
  sellerEmail,
  buyerEmail,
  listingTitle,
  amount
}: ItemSoldEmailParams) => {
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
export const sendPaymentProcessedNotification = async ({
  userEmail,
  amount,
  listingTitle,
  transactionId
}: PaymentProcessedEmailParams) => {
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
export const sendCommissionFeeNotification = async ({
  sellerEmail,
  listingTitle,
  amount,
  commission,
  finalAmount
}: CommissionFeeEmailParams) => {
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

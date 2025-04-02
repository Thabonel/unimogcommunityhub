
import { sendEmail } from './core';
import { OrderConfirmationEmailParams, ShipmentNotificationEmailParams } from './types';

// Order confirmation email
export const sendOrderConfirmationEmail = async ({
  buyerEmail,
  sellerEmail,
  listingTitle,
  amount,
  orderId
}: OrderConfirmationEmailParams) => {
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
export const sendShipmentNotificationEmail = async ({
  buyerEmail,
  listingTitle,
  orderId,
  trackingNumber,
  carrier
}: ShipmentNotificationEmailParams) => {
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

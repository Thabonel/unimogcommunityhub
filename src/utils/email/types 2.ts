
export type EmailType = 'noreply' | 'info' | 'help';

export interface SendEmailOptions {
  to: string;
  subject: string;
  message: string;
  html?: string;
  type?: EmailType;
}

export interface UserBanEmailParams {
  adminEmail: string;
  userEmail: string;
  duration: number;
  reason?: string;
}

export interface ArticleDeletedEmailParams {
  adminEmail: string;
  articleTitle: string;
  articleCategory: string;
  deletedBy?: string;
}

export interface ListingCreatedEmailParams {
  userEmail: string;
  listingTitle: string;
  listingId: string;
}

export interface ItemSoldEmailParams {
  sellerEmail: string;
  buyerEmail: string;
  listingTitle: string;
  amount: number;
}

export interface PaymentProcessedEmailParams {
  userEmail: string;
  amount: number;
  listingTitle: string;
  transactionId: string;
}

export interface CommissionFeeEmailParams {
  sellerEmail: string;
  listingTitle: string;
  amount: number;
  commission: number;
  finalAmount: number;
}

export interface OrderConfirmationEmailParams {
  buyerEmail: string;
  sellerEmail: string;
  listingTitle: string;
  amount: number;
  orderId: string;
}

export interface ShipmentNotificationEmailParams {
  buyerEmail: string;
  listingTitle: string;
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
}


import { sendEmail } from './core';

// Send welcome email to new user
export const sendWelcomeEmail = async (email: string, name?: string) => {
  const displayName = name || email;
  
  return sendEmail({
    to: email,
    subject: "Welcome to Unimog Community Hub",
    message: `Hello ${displayName},\n\nThank you for joining Unimog Community Hub! We're excited to have you as part of our community.\n\nBest regards,\nThe Unimog Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Unimog Community Hub!</h1>
        <p>Hello ${displayName},</p>
        <p>Thank you for joining Unimog Community Hub! We're excited to have you as part of our community.</p>
        <p>Please verify your email to activate your account.</p>
        <p>Best regards,<br>The Unimog Team</p>
      </div>
    `,
    type: 'noreply'
  });
};

// Send password reset confirmation
export const sendPasswordResetConfirmation = async (email: string) => {
  return sendEmail({
    to: email,
    subject: "Password Reset Requested",
    message: "We received your password reset request. Please check your email for instructions on how to reset your password.",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Requested</h2>
        <p>We received your password reset request for Unimog Community Hub.</p>
        <p>You should receive another email with instructions on how to reset your password.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Best regards,<br>The Unimog Team</p>
      </div>
    `,
    type: 'help'
  });
};

// Send contact form submission
export const sendContactFormEmail = async (
  name: string,
  email: string, 
  subject: string, 
  message: string
) => {
  return sendEmail({
    to: 'info@unimogcommunityhub.com',
    subject: `Contact Form: ${subject}`,
    message: `
Name: ${name}
Email: ${email}

${message}
    `,
    html: `
<h2>New Contact Form Submission</h2>
<p><strong>From:</strong> ${name} (${email})</p>
<p><strong>Subject:</strong> ${subject}</p>
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
    `,
    type: 'info'
  });
};

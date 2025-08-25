/**
 * Centralized authentication validation schemas and constants
 * Ensures consistent validation across all authentication forms
 */

import { z } from 'zod';

// Password requirements - consistent across the application
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REQUIREMENTS = {
  minLength: PASSWORD_MIN_LENGTH,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: false, // Optional for better UX
};

// Password validation message
export const PASSWORD_VALIDATION_MESSAGE = `Password must be at least ${PASSWORD_MIN_LENGTH} characters long and contain at least one uppercase letter, one lowercase letter, and one number`;

// Password regex for validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Reusable password schema
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, { message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` })
  .regex(passwordRegex, { message: PASSWORD_VALIDATION_MESSAGE });

// Email schema
export const emailSchema = z
  .string()
  .email({ message: "Please enter a valid email address" })
  .toLowerCase() // Normalize emails to lowercase
  .trim(); // Remove whitespace

// Common form schemas
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }), // Login doesn't validate password strength
});

export const signupFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }).trim(),
  country: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: passwordSchema,
  confirmNewPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

// Helper function to check password strength
export const checkPasswordStrength = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  feedback: string[];
} => {
  const feedback: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    feedback.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push('Add at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    feedback.push('Add at least one number');
  }
  
  // Calculate strength
  let strengthScore = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) strengthScore++;
  if (password.length >= 12) strengthScore++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strengthScore++;
  if (/\d/.test(password)) strengthScore++;
  if (/[^A-Za-z0-9]/.test(password)) strengthScore++;
  
  if (strengthScore >= 4) strength = 'strong';
  else if (strengthScore >= 3) strength = 'medium';
  
  return {
    isValid: feedback.length === 0,
    strength,
    feedback,
  };
};
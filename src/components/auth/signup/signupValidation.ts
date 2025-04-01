
interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export const validateSignupForm = (formData: SignupFormData): string | null => {
  const { email, password, confirmPassword, fullName } = formData;
  
  if (!email || !password || !confirmPassword || !fullName) {
    return "Please fill out all fields";
  }
  
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  
  return null; // No validation errors
};

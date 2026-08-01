export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const re = /\S+@\S+\.\S+/;
  if (!re.test(email)) return 'Invalid email format';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  // simple check: must contain at least 10 digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return 'Phone number must have at least 10 digits';
  return null;
};

export const validateRequired = (value: string, fieldName: string = 'This field'): string | null => {
  if (!value || value.trim() === '') return `${fieldName} is required`;
  return null;
};

export const validateMinLength = (value: string, min: number, fieldName: string = 'Field'): string | null => {
  if (!value || value.trim().length < min) return `${fieldName} must be at least ${min} characters`;
  return null;
};

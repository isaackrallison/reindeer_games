/**
 * Validation utilities for form inputs and data
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates event name
 */
export function validateEventName(name: string): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed || trimmed.length === 0) {
    return { valid: false, error: "Event name is required" };
  }

  if (trimmed.length > 255) {
    return { valid: false, error: "Event name must be 255 characters or less" };
  }

  return { valid: true };
}

/**
 * Validates event description
 */
export function validateEventDescription(description: string): ValidationResult {
  const trimmed = description.trim();

  if (!trimmed || trimmed.length === 0) {
    return { valid: false, error: "Event description is required" };
  }

  if (trimmed.length > 5000) {
    return {
      valid: false,
      error: "Event description must be 5000 characters or less",
    };
  }

  return { valid: true };
}

/**
 * Validates password
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return {
      valid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (password.length > 72) {
    return {
      valid: false,
      error: "Password must be 72 characters or less",
    };
  }

  // Optional: Add complexity requirements
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumber = /[0-9]/.test(password);
  // if (!hasUpperCase || !hasLowerCase || !hasNumber) {
  //   return {
  //     valid: false,
  //     error: "Password must contain uppercase, lowercase, and numeric characters",
  //   };
  // }

  return { valid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.length === 0) {
    return { valid: false, error: "Email is required" };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
}

/**
 * Sanitizes string input by trimming and removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}


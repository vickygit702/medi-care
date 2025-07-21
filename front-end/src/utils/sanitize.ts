export const sanitizeInput = (input: string): string => {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>?/gm, "");

  // Escape special characters that could be used in SQL injection
  sanitized = sanitized.replace(/'/g, "''");
  sanitized = sanitized.replace(/"/g, '\\"');
  sanitized = sanitized.replace(/\\/g, "\\\\");

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
};

export const sanitizeEmail = (email: string): string => {
  //email validation
  const sanitized = email.toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
    throw new Error("Invalid email format");
  }
  return sanitized;
};

export const validatePassword = (password: string): void => {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
};

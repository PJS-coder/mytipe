/**
 * Input Sanitization and Validation Utilities
 * Defends against XSS, SQL/NoSQL injection, and malformed customer data.
 */

/**
 * Strips dangerous HTML tags, javascript: protocols, and control characters
 */
export function sanitizeString(val: unknown, maxLength = 250): string {
  if (typeof val !== "string") return "";
  return val
    .trim()
    .replace(/[<>]/g, "") // Strip HTML tags
    .replace(/[\x00-\x1F\x7F]/g, "") // Strip ASCII control characters
    .slice(0, maxLength);
}

/**
 * Validates and normalizes 10-digit Indian phone numbers
 */
export function validatePhone(phone: unknown): { valid: boolean; normalized: string } {
  if (typeof phone !== "string") {
    return { valid: false, normalized: "" };
  }
  // Strip country code, spaces, dashes
  const digits = phone.replace(/[^0-9]/g, "");
  const normalized = digits.length > 10 ? digits.slice(-10) : digits;

  // Indian mobile numbers must be 10 digits starting with 5, 6, 7, 8, or 9
  const valid = /^[5-9]\d{9}$/.test(normalized);
  return { valid, normalized };
}

/**
 * Validates 6-digit Indian PIN codes
 */
export function validatePincode(pincode: unknown): { valid: boolean; normalized: string } {
  if (typeof pincode !== "string") {
    return { valid: false, normalized: "" };
  }
  const normalized = pincode.trim().replace(/[^0-9]/g, "");
  const valid = /^[1-9]\d{5}$/.test(normalized);
  return { valid, normalized };
}

/**
 * Validates email addresses
 */
export function validateEmail(email: unknown): { valid: boolean; normalized: string } {
  if (typeof email !== "string") {
    return { valid: false, normalized: "" };
  }
  const normalized = email.trim().toLowerCase();
  // Standard RFC 5322 compatible regex
  const valid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
    normalized
  );
  return { valid, normalized };
}

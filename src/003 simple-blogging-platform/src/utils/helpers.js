/**
 * Utility functions for the blogging platform
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes string input by removing potentially harmful characters and HTML tags
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== "string") return "";
  
  return input
    .trim()
    // Remove script tags and their content first
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove all HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove javascript: protocol
    .replace(/javascript:/gi, "")
    // Remove on* event handlers (like onclick, onload, etc.)
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, "")
    // Remove any remaining < or > characters
    .replace(/[<>]/g, "");
}

/**
 * Formats date to ISO string
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  return new Date(date).toISOString();
}

module.exports = {
  isValidEmail,
  sanitizeString,
  formatDate,
};

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
 * Sanitizes string input by removing potentially harmful characters
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "");
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

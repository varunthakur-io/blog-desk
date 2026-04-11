import DOMPurify from 'dompurify';

/**
 * Utility functions for consistent data formatting across the application.
 */

/**
 * Formats a date string into a user-friendly format.
 * Default: "Mar 19, 2026"
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '—';

  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', defaultOptions);
  } catch {
    return '—';
  }
};

/**
 * Formats a date specifically for the "Joined" date in profiles.
 * Result: "March 2026"
 */
export const formatJoinedDate = (dateString) => {
  return formatDate(dateString, { month: 'long', day: undefined });
};

/**
 * Returns a 1-2 letter fallback for avatars based on the user's name.
 */
export const getAvatarFallback = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Prepends '@' to a username if it's missing.
 */
export const formatUserHandle = (username) => {
  if (!username) return '';
  return username.startsWith('@') ? username : `@${username}`;
};

/**
 * Calculates the estimated read time for a given content string.
 */
export const calculateReadTime = (content) => {
  if (!content || typeof content !== 'string') return 1;
  const plainText = content.replace(/<[^>]*>?/gm, '');
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

/**
 * Generates a clean plain-text excerpt from HTML content.
 * Uses DOMPurify for security and strips title repetition.
 */
export const generateExcerpt = (content, title = '', maxLength = 160) => {
  if (!content) return '';

  // 1. Sanitize and strip all HTML tags using DOMPurify
  const cleanHtml = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
  
  // 2. Remove title repetition if it exists at the start
  let plainText = cleanHtml.replace(/\s+/g, ' ').trim();
  if (title && plainText.toLowerCase().startsWith(title.toLowerCase())) {
    plainText = plainText.substring(title.length).trim();
  }

  // 3. Truncate
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
};

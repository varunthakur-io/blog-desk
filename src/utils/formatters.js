/**
 * Utility functions for consistent data formatting across the application.
 */

/**
 * Formats a date string into a user-friendly format.
 * Default: "March 19, 2026"
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '—';
  
  const defaultOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...options
  };

  try {
    return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
  } catch (error) {
    console.error('formatDate error:', error);
    return 'Invalid Date';
  }
};

/**
 * Formats a date specifically for the "Joined" date in profiles.
 * Result: "March 2026"
 */
export const formatJoinedDate = (dateString) => {
  return formatDate(dateString, { day: undefined });
};

/**
 * Calculates the estimated read time for a given content string.
 * Based on an average reading speed of 200 words per minute.
 */
export const calculateReadTime = (content) => {
  if (!content || typeof content !== 'string') return 1;
  
  // Strip HTML tags if any (Tiptap content)
  const plainText = content.replace(/<[^>]*>?/gm, '');
  const words = plainText.trim().split(/\s+/).length;
  
  return Math.max(1, Math.ceil(words / 200));
};

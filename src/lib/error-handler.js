/**
 * Parses API errors into user-friendly messages.
 * Specifically handles Appwrite error codes.
 */
export const parseApiError = (
  error,
  fallback = 'An unexpected error occurred. Please try again.',
) => {
  if (!error) return fallback;

  // Appwrite specific response-codes
  // https://appwrite.io/docs/advanced/platform/response-codes
  const code = error.code;

  switch (code) {
    case 400:
      return error.message || 'Invalid request. Please check your input.';
    case 401:
      if (error.type === 'user_invalid_credentials') {
        return 'Invalid email or password. Please try again.';
      }
      return 'Session expired or unauthorized. Please log in.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      if (error.type === 'user_already_exists') {
        return 'An account with this email already exists.';
      }
      return 'This resource already exists or there is a conflict.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Our team has been notified.';
    default:
      return error.message || fallback;
  }
};

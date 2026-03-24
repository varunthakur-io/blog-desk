/**
 * Centralized environment configuration (Appwrite setup, collections, storage, and functions)
 * Ensures required environment variables are present and fails fast if missing.
 */

const getEnvVar = (key, fallback = undefined) => {
  const value = import.meta.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`Environment variable ${key} is missing from your .env file.`);
  }
  return value || fallback;
};

export const config = {
  appwrite: {
    // Core Appwrite Setup
    endpoint: getEnvVar('VITE_APPWRITE_ENDPOINT'),
    projectId: getEnvVar('VITE_APPWRITE_PROJECT_ID'),
    databaseId: getEnvVar('VITE_APPWRITE_DATABASE_ID'),

    // Collections (Database Tables)
    collections: {
      profiles: getEnvVar('VITE_APPWRITE_PROFILE_COLLECTION_ID'),
      posts: getEnvVar('VITE_APPWRITE_POSTS_COLLECTION_ID'),
      likes: getEnvVar('VITE_APPWRITE_LIKES_COLLECTION_ID'),
      comments: getEnvVar('VITE_APPWRITE_COMMENTS_COLLECTION_ID'),
      follows: getEnvVar('VITE_APPWRITE_FOLLOWS_COLLECTION_ID'),
    },

    // Storage (Buckets)
    buckets: {
      main: getEnvVar('VITE_APPWRITE_BUCKET_ID'),
    },

    // Functions (Serverless)
    functions: {
      deleteAccount: getEnvVar('VITE_APPWRITE_DELETE_ACCOUNT_FUNCTION_ID', null), // null fallback — gracefully disabled if not deployed
    },
  },
};

export default config;

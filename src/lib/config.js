/**
 * Centralized and validated environment configuration.
 * This ensures the app 'fails fast' if the .env file is misconfigured.
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
    endpoint: getEnvVar('VITE_APPWRITE_ENDPOINT'),
    projectId: getEnvVar('VITE_APPWRITE_PROJECT_ID'),
    databaseId: getEnvVar('VITE_APPWRITE_DATABASE_ID'),
    collections: {
      posts: getEnvVar('VITE_APPWRITE_POSTS_COLLECTION_ID'),
      likes: getEnvVar('VITE_APPWRITE_LIKES_COLLECTION_ID'),
      comments: getEnvVar('VITE_APPWRITE_COMMENTS_COLLECTION_ID'),
      profiles: 'profiles', // This one is hardcoded in your services currently
    },
    buckets: {
      main: getEnvVar('VITE_APPWRITE_BUCKET_ID'),
    },
    functions: {
      deleteAccount: getEnvVar('VITE_APPWRITE_DELETE_ACCOUNT_FUNCTION_ID'),
    }
  }
};

export default config;

export const getRequiredEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const loadConfig = () => {
  return {
    endpoint: getRequiredEnv('APPWRITE_FUNCTION_API_ENDPOINT'),
    projectId: getRequiredEnv('APPWRITE_FUNCTION_PROJECT_ID'),
    apiKey: getRequiredEnv('APPWRITE_FUNCTION_API_KEY'),
    databaseId: getRequiredEnv('APPWRITE_DATABASE_ID'),
    postsCollectionId: getRequiredEnv('APPWRITE_POSTS_COLLECTION_ID'),
    likesCollectionId: getRequiredEnv('APPWRITE_LIKES_COLLECTION_ID'),
    commentsCollectionId: getRequiredEnv('APPWRITE_COMMENTS_COLLECTION_ID'),
    profilesCollectionId: getRequiredEnv('APPWRITE_PROFILES_COLLECTION_ID'),
    followsCollectionId: getRequiredEnv('APPWRITE_FOLLOWS_COLLECTION_ID'),
    bucketId: getRequiredEnv('APPWRITE_BUCKET_ID'),
    notificationsCollectionId: getRequiredEnv('APPWRITE_NOTIFICATIONS_COLLECTION_ID'),
  };
};

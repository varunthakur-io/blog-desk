import { Client, Databases, Account, Storage } from 'appwrite';

/**
 * Appwrite configuration object.
 */
export const appwriteConfig = {
  url: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
  projectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  databaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  postsCollectionId: String(import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID),
  likesCollectionId: String(import.meta.env.VITE_APPWRITE_LIKES_COLLECTION_ID),
  commentsCollectionId: String(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID),
  bucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

/**
 * Global Appwrite Client instance.
 */
const client = new Client()
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectId);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

export default client;

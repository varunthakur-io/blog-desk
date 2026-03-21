import { Client, Databases, Account, Storage, Functions } from 'appwrite';
import config from './config';

/**
 * Appwrite configuration object.
 */
export const appwriteConfig = {
  // Core Appwrite Setup
  url: config.appwrite.endpoint,
  projectId: config.appwrite.projectId,
  databaseId: config.appwrite.databaseId,

  // Collections (Database Tables)
  profilesCollectionId: config.appwrite.collections.profiles,
  postsCollectionId: config.appwrite.collections.posts,
  likesCollectionId: config.appwrite.collections.likes,
  commentsCollectionId: config.appwrite.collections.comments,
  followCollectionId: config.appwrite.collections.followCollectionId,

  // Functions (Serverless)
  deleteAccountFunctionId: config.appwrite.functions.deleteAccount,

  // Storage (Buckets)
  bucketId: config.appwrite.buckets.main,
};

/**
 * Global Appwrite Client instance.
 */
const client = new Client().setEndpoint(appwriteConfig.url).setProject(appwriteConfig.projectId);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export default client;

import { Client, Databases, Account, Storage } from 'appwrite';
import { appwriteConfig } from '@/config/appwrite';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectId);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// Export client by default
export default client;

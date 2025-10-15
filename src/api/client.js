import { Client, Databases, Account, Storage } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// Export client by default
export default client;

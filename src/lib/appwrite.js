import { Client, Account, ID } from 'appwrite';
import { appwriteConfig } from '../conf/appwriteConfig';

class AuthService {
  constructor() {
    this.client = new Client()
      .setEndpoint(appwriteConfig.url)
      .setProject(appwriteConfig.projectId);

    this.account = new Account(this.client);
  }

  // Register a new user
  async createUser({ email, password, name }) {
    try {
      return await this.account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Login user with email & password
  async loginUser(email, password) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }

  // Get current user's account details
  async getAccount() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error('Error getting account:', error);
      throw error;
    }
  }

  // Logout current session (logout)
  async logout() {
    try {
      return await this.account.deleteSession('current');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // ✅ Delete specific session (optional, e.g. admin use)
  async deleteSession(sessionId) {
    try {
      return await this.account.deleteSession(sessionId);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }
}

// Export a single shared instance
export const authService = new AuthService();

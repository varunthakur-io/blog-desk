import { Client, Account, ID } from 'appwrite';
import { appwriteConfig as appwrite } from '../config/appwrite';

class AuthService {
  constructor() {
    this.client = new Client()
      .setEndpoint(appwrite.url)
      .setProject(appwrite.projectId);

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
  async loginUser({ email, password }) {
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

  // Delete specific session (optional, e.g. admin use)
  async deleteSession(sessionId) {
    try {
      return await this.account.deleteSession(sessionId);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  //  Update user account details
  async updateName(name) {
    try {
      return await this.account.updateName(name);
    } catch (error) {
      console.error('Error updating name:', error);
      throw error;
    }
  }

  // Update user email
  async updateEmail(email, password) {
    try {
      return await this.account.updateEmail(email, password);
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  }

  // Delete all sessions for the user
  async deleteAllSessions() {
    try {
      console.log('Deleting all sessions');
      return await this.account.deleteSessions();
    } catch (error) {
      console.error('Error deleting all sessions:', error);
      throw error;
    }
  }

  // Delete user account
  async deleteAccount(userId) {
    try {
      console.log('Deleting account...');
      return await this.account.updateStatus(userId);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

// Export a single shared instance
export const authService = new AuthService();

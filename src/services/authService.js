import { Client, Account, ID } from 'appwrite';
import { appwriteConfig as appwrite } from '../config/appwrite';

class AuthService {
  constructor() {
    this.client = new Client()
      .setEndpoint(appwrite.url)
      .setProject(appwrite.projectId);
    this.account = new Account(this.client);
  }

  // =========================
  // Local Storage Management
  // =========================

  // Cache user in localStorage
  cacheUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Retrieve cached user
  getCachedUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Clear cached user
  clearCachedUser() {
    localStorage.removeItem('user');
  }

  // =========================
  // Authentication
  // =========================

  // Register a new user
  async createUser({ email, password, name }) {
    try {
      const user = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      this.cacheUser(user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(error.message || 'Failed to create user.');
    }
  }

  // Login user with email & password
  async loginUser({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      const user = await this.account.get();
      this.cacheUser(user);
      return session;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw new Error(error.message || 'Login failed.');
    }
  }

  // Logout current session
  async logout() {
    try {
      await this.account.deleteSession('current');
      this.clearCachedUser();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Delete all sessions for the user
  async deleteAllSessions() {
    try {
      console.log('Deleting all sessions');
      await this.account.deleteSessions();
      this.clearCachedUser();
    } catch (error) {
      console.error('Error deleting all sessions:', error);
      throw error;
    }
  }

  // =========================
  // Account Management
  // =========================

  // Get current user's account details
  async getAccount() {
    try {
      const cachedUser = this.getCachedUser();
      if (cachedUser) {
        return cachedUser; // Return cached user if available
      }
      const user = await this.account.get();
      this.cacheUser(user);
      return user;
    } catch (error) {
      this.clearCachedUser();
      console.error('Error getting account:', error);
      throw error;
    }
  }

  // Update user account details
  async updateName(name) {
    try {
      const user = await this.account.updateName(name);
      this.cacheUser(user);
      return user;
    } catch (error) {
      console.error('Error updating name:', error);
      throw error;
    }
  }

  // Update user email
  async updateEmail(email, password) {
    try {
      const user = await this.account.updateEmail(email, password);
      this.cacheUser(user);
      return user;
    } catch (error) {
      console.error('Error updating email:', error);
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

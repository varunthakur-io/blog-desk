import { account, storage } from '@/api/client';
import { toast } from 'react-hot-toast';
import { ID } from 'appwrite';
import { appwriteConfig as appwrite } from '../config/appwrite';

class AuthService {
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
      await account.create(ID.unique(), email, password, name);
      // login the user immediately after registration
      const loggedInUser = await this.loginUser({ email, password });
      toast.success('Account created successfully!');
      return loggedInUser;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user.');
      throw new Error(error.message || 'Failed to create user.');
    }
  }

  // Login user with email & password
  async loginUser({ email, password }) {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      this.cacheUser(user);
      toast.success('Logged in successfully!');
      return user;
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(
        error.message || 'Login failed. Please check your credentials.',
      );
      throw new Error(error.message);
    }
  }

  // Logout current session
  async logout() {
    try {
      await account.deleteSession('current');
      this.clearCachedUser();
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(error.message || 'Logout failed.');
      throw new Error(error.message);
    }
  }

  // Delete all sessions for the user
  async deleteAllSessions() {
    try {
      await account.deleteSessions();
      this.clearCachedUser();
    } catch (error) {
      console.error('Error deleting all sessions:', error);
      throw new Error(error.message);
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
      const user = await account.get();
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
      const user = await account.updateName(name);
      this.cacheUser(user);
      toast.success('Name updated successfully!');
      return user;
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error(error.message || 'Failed to update name.');
      throw error;
    }
  }

  // Update user email
  async updateEmail(email, password) {
    try {
      const user = await account.updateEmail(email, password);
      this.cacheUser(user);
      toast.success('Email updated successfully!');
      return user;
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error(error.message || 'Failed to update email.');
      throw error;
    }
  }

  // Delete user account
  async deleteAccount() {
    try {
      // Temporarily delete the account (blocked)
      await account.updateStatus();

      // Delete all sessions
      // not working as updateStatus() deletes the curret session
      // await deleteAllSessions();

      this.clearCachedUser();
      toast.success('Account deleted successfully!');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account.');
      throw new Error(error.message || 'Failed to delete account.');
    }
  }

  // =========================
  // Avatar Upload (Public URL)
  // =========================
  async updateAvatar(file) {
    try {
      // Get current user to check for existing avatar
      const currentUser = await account.get();
      const currentAvatarFileId = currentUser.prefs?.avatarFileId;
      console.log('Current Avatar File ID:', currentAvatarFileId);

      // If an old avatar exists, delete it first
      if (currentAvatarFileId) {
        try {
          await storage.deleteFile(appwrite.bucketId, currentAvatarFileId);
        } catch (deleteError) {
          console.warn('Failed to delete old avatar file:', deleteError);
          // Continue even if old avatar deletion fails
        }
      }

      // Upload new avatar
      const uploaded = await storage.createFile(
        appwrite.bucketId,
        ID.unique(),
        file,
      );

      // Generate public view URL (no transformations)
      const avatarUrl = `${appwrite.url}/storage/buckets/${appwrite.bucketId}/files/${uploaded.$id}/view?project=${appwrite.projectId}`;

      // Update user prefs
      const updatedUser = await account.updatePrefs({
        ...(await account.get()).prefs,
        avatar: avatarUrl,
        avatarFileId: uploaded.$id,
      });

      // Cache and return
      this.cacheUser(updatedUser);
      toast.success('Profile photo updated!');
      return updatedUser;
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error(error.message || 'Failed to update avatar.');
      throw error;
    }
  }
  
}

// Export a single shared instance
export const authService = new AuthService();

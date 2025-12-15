import { account, storage, databases } from '@/api/client';
import { ID } from 'appwrite';
import { appwriteConfig as appwrite } from '../config/appwrite';

class AuthService {
  // ==========================================
  //           LOCAL STORAGE MANAGEMENT
  // ==========================================

  /**
   * Cache user object in localStorage
   * @param {Object} user
   */
  cacheUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Retrieve cached user from localStorage
   * @returns {Object|null} User object or null
   */
  getCachedUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Clear cached user from localStorage
   */
  clearCachedUser() {
    localStorage.removeItem('user');
  }

  // ==========================================
  //             AUTHENTICATION
  // ==========================================

  /**
   * Register a new user and create their profile
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @param {string} params.name
   * @returns {Promise<Object>} Logged in user object
   */
  async createUser({ email, password, name }) {
    try {
      // 1) Create account in Appwrite Auth
      const createdUser = await account.create(
        ID.unique(),
        email,
        password,
        name,
      );

      // 2) Try to create profile BEFORE login. Retry on transient failures.
      const maxRetries = 2;
      let profileCreated = false;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          await this.createProfile(createdUser);
          profileCreated = true;
          break;
        } catch (err) {
          console.warn(
            `AuthService :: createUser() profile attempt ${attempt + 1} failed:`,
            err,
          );
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, 300));
          }
        }
      }

      if (!profileCreated) {
        const message =
          'Signup failed: could not create profile. Please try again.';
        console.error('AuthService :: createUser()', message);
        throw new Error(message);
      }

      // 3) Profile created successfully -> create session (login)
      return await this.loginUser({ email, password });
    } catch (error) {
      console.error('AuthService :: createUser()', error);
      throw error;
    }
  }

  /**
   * Login user with email & password
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<Object>} Object containing user and profile
   */
  async loginUser({ email, password }) {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();

      let profile = null;
      try {
        profile = await this.getProfile(user.$id);
      } catch (err) {
        console.warn('AuthService :: loginUser() Could not load profile:', err);
      }

      this.cacheUser(user);
      return { user, profile };
    } catch (error) {
      console.error('AuthService :: loginUser()', error);
      throw error;
    }
  }

  /**
   * Logout current session
   */
  async logout() {
    try {
      await account.deleteSession('current');
      this.clearCachedUser();
    } catch (error) {
      console.error('AuthService :: logout()', error);
      throw new Error(error.message);
    }
  }

  /**
   * Delete all sessions for the user
   */
  async deleteAllSessions() {
    try {
      await account.deleteSessions();
      this.clearCachedUser();
    } catch (error) {
      console.error('AuthService :: deleteAllSessions()', error);
      throw new Error(error.message);
    }
  }

  // ==========================================
  //           ACCOUNT MANAGEMENT
  // ==========================================

  /**
   * Get current user's account details
   * @returns {Promise<Object|null>} User object or null
   */
  async getAccount() {
    try {
      const user = await account.get();
      this.cacheUser(user);
      return user;
    } catch {
      this.clearCachedUser();
      return null;
    }
  }

  /**
   * Update user name
   * @param {string} name
   * @returns {Promise<Object>} Updated user object
   */
  async updateName(name) {
    try {
      const user = await account.updateName(name);
      await this.updateProfile(user.$id, { name });
      this.cacheUser(user);
      return user;
    } catch (error) {
      console.error('AuthService :: updateName()', error);
      throw error;
    }
  }

  /**
   * Update user email
   * @param {string} email
   * @param {string} password
   * @returns {Promise<string>} New email
   */
  async updateEmail(email, password) {
    try {
      const user = await account.updateEmail(email, password);
      this.cacheUser(user);
      return user.email;
    } catch (error) {
      console.error('AuthService :: updateEmail()', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   * @param {Object} prefs
   * @returns {Promise<Object>} Updated user object
   */
  async updatePrefs(prefs) {
    try {
      const updatedUser = await account.updatePrefs(prefs);
      this.cacheUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('AuthService :: updatePrefs()', error);
      throw error;
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount() {
    try {
      // Temporarily delete the account (status update)
      await account.updateStatus();

      // Try to delete profile document
      try {
        const currentUser = await account.get();
        await databases.deleteDocument(
          appwrite.databaseId,
          'profiles',
          currentUser.$id,
        );
      } catch (error) {
        console.warn(
          'AuthService :: deleteAccount() Error deleting profile:',
          error,
        );
      }

      this.clearCachedUser();
    } catch (error) {
      console.error('AuthService :: deleteAccount()', error);
      throw new Error(error.message || 'Failed to delete account.');
    }
  }

  // ==========================================
  //           PROFILE MANAGEMENT
  // ==========================================

  /**
   * Get user profile document
   * @param {string} userId
   * @returns {Promise<Object>} Profile document
   */
  async getProfile(userId) {
    try {
      return await databases.getDocument(
        appwrite.databaseId,
        'profiles',
        userId,
      );
    } catch (error) {
      console.error('AuthService :: getProfile()', error);
      throw error;
    }
  }

  /**
   * Create the public profile document
   * @param {Object} user
   * @returns {Promise<void>}
   */
  async createProfile(user) {
    if (!user || !user.$id) {
      throw new Error('AuthService :: createProfile() Invalid user');
    }

    try {
      await databases.createDocument(
        appwrite.databaseId,
        'profiles',
        user.$id,
        {
          name: user.name || null,
          email: user.email || null,
        },
      );
    } catch (error) {
      console.error('AuthService :: createProfile()', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId
   * @param {Object} profileData
   * @returns {Promise<Object>} Updated profile document
   */
  async updateProfile(userId, profileData) {
    try {
      return await databases.updateDocument(
        appwrite.databaseId,
        'profiles',
        userId,
        profileData,
      );
    } catch (error) {
      console.error('AuthService :: updateProfile()', error);
      throw error;
    }
  }

  /**
   * Update user bio
   * @param {string} userId
   * @param {string} bio
   * @returns {Promise<boolean>} True on success
   */
  async updateBio(userId, bio) {
    try {
      await databases.updateDocument(appwrite.databaseId, 'profiles', userId, {
        bio,
      });
      return true;
    } catch (error) {
      console.error('AuthService :: updateBio()', error);
      throw error;
    }
  }

  /**
   * Upload new avatar and update profile
   * @param {File} file
   * @returns {Promise<Object>} Updated profile document
   */
  async updateAvatar(file) {
    try {
      const currentUser = await account.get();
      const profile = await this.getProfile(currentUser.$id);
      const currentAvatarFileId = profile?.avatarId;

      // Delete old avatar file if exists
      if (currentAvatarFileId) {
        try {
          await storage.deleteFile(appwrite.bucketId, currentAvatarFileId);
        } catch (deleteError) {
          console.warn(
            'AuthService :: updateAvatar() Failed to delete old avatar:',
            deleteError,
          );
        }
      }

      // Upload new avatar
      const uploaded = await storage.createFile(
        appwrite.bucketId,
        ID.unique(),
        file,
      );
      const fileId = uploaded.$id;

      // Generate public view URL
      const avatarUrl = `${appwrite.url}/storage/buckets/${appwrite.bucketId}/files/${fileId}/view?project=${appwrite.projectId}`;

      // Sync both file id and url to profile doc
      const updatedProfile = await this.updateProfile(profile.$id, {
        avatarId: fileId,
        avatarUrl,
      });

      // Update cached user if applicable
      const cached = this.getCachedUser();
      if (cached && cached.profile && cached.profile.$id === profile.$id) {
        const merged = { ...cached, profile: updatedProfile };
        this.cacheUser(merged);
      }

      return updatedProfile;
    } catch (error) {
      console.error('AuthService :: updateAvatar()', error);
      throw error;
    }
  }
}

export const authService = new AuthService();

import { account, storage, databases } from '@/api/client';
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

  // Register a new user — only log in if profile creation succeeds
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
          // create a profile for the created user
          await this.createProfile(createdUser);
          profileCreated = true;
          break;
        } catch (err) {
          console.warn(`createProfile attempt ${attempt + 1} failed:`, err);
          if (attempt < maxRetries) {
            // small backoff
            await new Promise((r) => setTimeout(r, 300));
          }
        }
      }

      if (!profileCreated) {
        // We do NOT log the user in if profile creation failed.
        // Note: at this point an account exists but no profile
        // Implemet account deletion
        const message =
          'Signup failed: could not create profile. Please try again.';
        console.error(message);
        throw new Error(message);
      }

      // 3) Profile created successfully -> create session (login)
      const loggedInUser = await this.loginUser({ email, password });

      return loggedInUser;
    } catch (error) {
      console.error('Error creating user & profile:', error);
      // preserve original error
      throw error;
    }
  }

  // Create or update the public profile document
  async createProfile(user) {
    if (!user || !user.$id)
      throw new Error('Invalid user for profile creation');

    const profileData = {
      name: user.name || '',
    };

    try {
      // Create the profile doc with id = user.$id
      await databases.createDocument(
        appwrite.databaseId,
        'profiles', // collection id
        user.$id, // document id
        profileData,
      );
    } catch (err) {
      console.log('Error creating profile:', err);
      throw err;
    }
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const updatedProfile = await databases.updateDocument(
        appwrite.databaseId,
        'profiles',
        userId,
        profileData,
      );

      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Login user with email & password
  async loginUser({ email, password }) {
    try {
      // create session
      await account.createEmailPasswordSession(email, password);
      const user = await account.get(); // auth user

      // attempt to load profile document (returns null/throws if missing)
      let profile = null;
      try {
        // if getProfile returns a document object, keep it; otherwise null
        profile = await this.getProfile(user.$id);
      } catch (err) {
        console.warn('Could not load profile for merge:', err);
      }

      // merge safely (no shadowing). Keep profile nested to avoid key collisions.
      const mergedUser = { ...user, profile };

      // cache and return enriched user
      this.cacheUser(mergedUser);

      return mergedUser;
    } catch (error) {
      console.error('Error logging in:', error);
      // rethrow original error for callers to handle
      throw error;
    }
  }

  // Logout current session
  async logout() {
    try {
      // delete the current session
      await account.deleteSession('current');

      // clear the user from cache
      this.clearCachedUser();
    } catch (error) {
      console.error('Error logging out:', error);
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
    // 1. Try cached user first — if exists, trust it
    const cachedUser = this.getCachedUser();
    if (cachedUser) {
      return cachedUser; // ← Fast, no network call, no flicker
    }

    // 2. No cache → ask Appwrite
    try {
      const user = await account.get();
      const profile = await this.getProfile(user.$id).catch(() => null);
      const merged = { ...user, profile };
      this.cacheUser(merged);
      return merged;
    } catch {
      // 401 = no session, any other = network → both mean "guest"
      this.clearCachedUser();
      return null;
    }
  }

  async getProfile(userId) {
    try {
      const profile = await databases.getDocument(
        appwrite.databaseId,
        'profiles',
        userId,
      );
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Update user account details
  async updateName(name) {
    try {
      const user = await account.updateName(name);

      // Update the profile document as well
      await this.updateProfile(user.$id, { name });

      // update cached user
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
      const user = await account.updateEmail(email, password);
      this.cacheUser(user);
      return user.email;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  }

  // Update user preferences
  async updatePrefs(prefs) {
    try {
      const updatedUser = await account.updatePrefs(prefs);
      this.cacheUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating prefs:', error);
      throw error;
    }
  }

  // Update user bio in profile document
  async updateBio(userId, bio) {
    try {
      await databases.updateDocument(
        appwrite.databaseId,
        'profiles',
        userId,
        { bio }, // only updates the bio field
      );
      return true;
    } catch (error) {
      console.error('Error updating bio:', error);
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

      // Delete profile document (if exists)
      try {
        await databases.deleteDocument(
          appwrite.databaseId,
          'profiles',
          (await account.get()).$id,
        );
      } catch (error) {
        console.log('Error deleting profile:', error);
      }

      this.clearCachedUser();
    } catch (error) {
      console.error('Error deleting account:', error);
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
      const profile = await this.getProfile(currentUser.$id);

      const currentAvatarFileId = profile?.avatarId;

      // Delete old avatar file if exists
      if (currentAvatarFileId) {
        try {
          await storage.deleteFile(appwrite.bucketId, currentAvatarFileId);
        } catch (deleteError) {
          console.warn('Failed to delete old avatar file:', deleteError);
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

      // sync both file id and url to profile doc
      const updatedProfile = await this.updateProfile(profile.$id, {
        avatarId: fileId,
        avatarUrl,
      });

      // Optionally update cached user
      const cached = this.getCachedUser();
      if (cached && cached.profile && cached.profile.$id === profile.$id) {
        const merged = { ...cached, profile: updatedProfile };
        this.cacheUser(merged);
      }

      return updatedProfile;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }
}

// Export a single shared instance
export const authService = new AuthService();

import { account, storage, databases } from '@/api/client';
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
        toast.error(message);
        throw new Error(message);
      }

      // 3) Profile created successfully -> create session (login)
      const loggedInUser = await this.loginUser({ email, password });

      toast.success('Account created and logged in!');
      return loggedInUser;
    } catch (error) {
      console.error('Error creating user & profile:', error);
      // preserve original error
      throw error;
    }
  }

  // Create or update the public profile document
  async createProfile(user) {
    if (!user || user.$id) throw new Error('Invalid user for profile creation');

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

      toast.success('Logged in successfully!');
      return mergedUser;
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(
        error?.message || 'Login failed. Please check your credentials.',
      );
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

      // If no cached user → user is guest → DO NOT call account.get()
      if (!cachedUser) {
        return null;
      }

      // If cached user exists → optionally verify on server
      const user = await account.get();
      const profile = await this.getProfile(user.$id);

      if (profile?.avatar) {
        user.avatar = profile.avatar;
      }
      if (profile?.bio) {
        user.bio = profile.bio;
      }

      this.cacheUser(user);
      return user;
    } catch {
      // If Appwrite says session is invalid → user is logged out
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
      const profile = await this.getProfile(currentUser.$id);

      const currentAvatarFileId = profile.avatar;

      // Delete old avatar file if exists
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
      const avatar = `${appwrite.url}/storage/buckets/${appwrite.bucketId}/files/${uploaded.$id}/view?project=${appwrite.projectId}`;

      // sync avatar to profile doc
      try {
        await this.updateProfile(profile.$id, { avatar: avatar });
      } catch (profileErr) {
        console.warn(
          'Failed to sync avatar URL to profile document:',
          profileErr,
        );
      }

      // Update cache and return
      // this.cacheUser(updatedUser);
      toast.success('Profile photo updated!');
      return;
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error(error.message || 'Failed to update avatar.');
      throw error;
    }
  }
}

// Export a single shared instance
export const authService = new AuthService();

import { authApi } from './auth.api';
import { profileService } from '../profile';

class AuthService {
  cacheUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCachedUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  clearCachedUser() {
    localStorage.removeItem('user');
  }

  async createUser({ email, password, name, username }) {
    try {
      const createdUser = await authApi.createAccount(email, password, name);

      const maxRetries = 2;
      let profileCreated = false;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          await profileService.createProfile(createdUser, username);
          profileCreated = true;
          break;
        } catch (err) {
          console.warn(`AuthService :: createUser() profile attempt ${attempt + 1} failed:`, err);
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, 300));
          }
        }
      }

      if (!profileCreated) {
        throw new Error('Signup failed: could not create profile. Please try again.');
      }

      return await this.loginUser({ email, password });
    } catch (error) {
      console.error('AuthService :: createUser()', error);
      throw error;
    }
  }

  async loginUser({ email, password }) {
    try {
      await authApi.createEmailPasswordSession(email, password);
      const user = await authApi.getAccount();
      
      let profile = null;
      try {
        profile = await profileService.getProfile(user.$id);
      } catch (err) {
        console.warn('AuthService :: loginUser() Could not load profile:', err);
      }

      this.cacheUser({ ...user, profile });
      return { user, profile };
    } catch (error) {
      console.error('AuthService :: loginUser()', error);
      throw error;
    }
  }

  async logout() {
    try {
      await authApi.deleteSession('current');
      this.clearCachedUser();
    } catch (error) {
      console.error('AuthService :: logout()', error);
      throw new Error(error.message);
    }
  }

  async deleteAllSessions() {
    try {
      await authApi.deleteSessions();
      this.clearCachedUser();
    } catch (error) {
      console.error('AuthService :: deleteAllSessions()', error);
      throw new Error(error.message);
    }
  }

  async getAccount() {
    try {
      const user = await authApi.getAccount();
      
      let profile = null;
      try {
        profile = await profileService.getProfile(user.$id);
      } catch (err) {
        // ignore
      }
      
      const cached = this.getCachedUser() || {};
      const updatedUser = { ...cached, ...user, profile };
      this.cacheUser(updatedUser);
      return user;
    } catch {
      this.clearCachedUser();
      return null;
    }
  }

  async updateName(name) {
    try {
      const user = await authApi.updateName(name);
      await profileService.updateProfile(user.$id, { name });
      const cached = this.getCachedUser() || {};
      this.cacheUser({ ...cached, ...user, name });
      return user;
    } catch (error) {
      console.error('AuthService :: updateName()', error);
      throw error;
    }
  }

  async updateEmail(email, password) {
    try {
      const user = await authApi.updateEmail(email, password);
      const cached = this.getCachedUser() || {};
      this.cacheUser({ ...cached, ...user });
      return user.email;
    } catch (error) {
      console.error('AuthService :: updateEmail()', error);
      throw error;
    }
  }

  async updatePrefs(prefs) {
    try {
      const updatedUser = await authApi.updatePrefs(prefs);
      const cached = this.getCachedUser() || {};
      this.cacheUser({ ...cached, ...updatedUser });
      return updatedUser;
    } catch (error) {
      console.error('AuthService :: updatePrefs()', error);
      throw error;
    }
  }

  async deleteAccount() {
    try {
      await authApi.updateStatus();
      try {
        const currentUser = await authApi.getAccount();
        await profileService.deleteProfile(currentUser.$id);
      } catch (error) {
        console.warn('AuthService :: deleteAccount() Error deleting profile:', error);
      }
      this.clearCachedUser();
    } catch (error) {
      console.error('AuthService :: deleteAccount()', error);
      throw new Error(error.message || 'Failed to delete account.');
    }
  }
}

export const authService = new AuthService();

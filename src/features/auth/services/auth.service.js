import { authApi } from './auth.api';
import { profileService } from '@/features/profile';
import { config } from '@/lib/config';
import { parseApiError } from '@/lib/error-handler';

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
        } catch {
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, 300));
          }
        }
      }

      if (!profileCreated) {
        throw new Error('Signup failed: could not create profile. Please try again.');
      }

      const user = await this.loginUser({ email, password });

      // Send verification email AFTER signup
      try {
        await this.createVerification();
      } catch (error) {
        console.warn('Initial verification email failed:', error);
      }

      return user;
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async loginUser({ email, password }) {
    try {
      await authApi.createEmailPasswordSession(email, password);
      const user = await authApi.getAccount();

      let profile = null;
      try {
        profile = await profileService.getProfile(user.$id);
      } catch {
        // Silently fail — session is still valid
      }

      this.cacheUser({ ...user, profile });
      return { user, profile };
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async logout() {
    try {
      await authApi.deleteSession('current');
      this.clearCachedUser();
    } catch (error) {
      this.clearCachedUser(); // Always clear local state
      throw new Error(parseApiError(error));
    }
  }

  async deleteAllSessions() {
    try {
      await authApi.deleteSessions();
      this.clearCachedUser();
    } catch (error) {
      this.clearCachedUser();
      throw new Error(parseApiError(error));
    }
  }

  async getAccount() {
    try {
      const user = await authApi.getAccount();

      let profile = null;
      try {
        profile = await profileService.getProfile(user.$id);
      } catch {
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
      throw new Error(parseApiError(error));
    }
  }

  async updateEmail(email, password) {
    try {
      const user = await authApi.updateEmail(email, password);
      const cached = this.getCachedUser() || {};
      this.cacheUser({ ...cached, ...user });
      return user.email;
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async updatePassword(newPassword, oldPassword) {
    try {
      return await authApi.updatePassword(newPassword, oldPassword);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async updatePrefs(prefs) {
    try {
      const updatedUser = await authApi.updatePrefs(prefs);
      const cached = this.getCachedUser() || {};
      this.cacheUser({ ...cached, ...updatedUser });
      return updatedUser;
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async deleteAccount() {
    try {
      const execution = await authApi.executeDeleteAccount();
      if (execution.responseStatusCode >= 400) {
        let message = 'Failed to delete account.';
        try {
          const parsed = JSON.parse(execution.responseBody || '{}');
          message = parsed?.message || message;
        } catch {
          // ignore parse errors
        }
        throw new Error(message);
      }
      this.clearCachedUser();
      return true;
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async createVerification() {
    try {
      const url = `${config.app.url}/verify`;
      return await authApi.createVerification(url);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async verifyUser(userId, secret) {
    try {
      await authApi.updateVerification(userId, secret);
      const updatedUser = await authApi.getAccount();

      const cached = this.getCachedUser() || {};
      this.cacheUser({ ...cached, ...updatedUser });

      return updatedUser;
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async createRecovery(email) {
    try {
      const url = `${config.app.url}/reset-password`;
      return await authApi.createRecovery(email, url);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async resetPassword(userId, secret, password) {
    try {
      return await authApi.updateRecovery(userId, secret, password);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }
}

export const authService = new AuthService();

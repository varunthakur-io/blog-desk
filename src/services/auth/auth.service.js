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

    return await this.loginUser({ email, password });
  }

  async loginUser({ email, password }) {
    await authApi.createEmailPasswordSession(email, password);
    const user = await authApi.getAccount();

    let profile = null;
    try {
      profile = await profileService.getProfile(user.$id);
    } catch {
      // Silently fail if profile can't be loaded, user session is still valid.
    }

    this.cacheUser({ ...user, profile });
    return { user, profile };
  }

  async logout() {
    await authApi.deleteSession('current');
    this.clearCachedUser();
  }

  async deleteAllSessions() {
    await authApi.deleteSessions();
    this.clearCachedUser();
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
    const user = await authApi.updateName(name);
    await profileService.updateProfile(user.$id, { name });
    const cached = this.getCachedUser() || {};
    this.cacheUser({ ...cached, ...user, name });
    return user;
  }

  async updateEmail(email, password) {
    const user = await authApi.updateEmail(email, password);
    const cached = this.getCachedUser() || {};
    this.cacheUser({ ...cached, ...user });
    return user.email;
  }

  async updatePrefs(prefs) {
    const updatedUser = await authApi.updatePrefs(prefs);
    const cached = this.getCachedUser() || {};
    this.cacheUser({ ...cached, ...updatedUser });
    return updatedUser;
  }

  async deleteAccount() {
    await authApi.updateStatus();
    try {
      const currentUser = await authApi.getAccount();
      await profileService.clearProfileById(currentUser.$id);
    } catch {
      // Continue even if profile deletion fails
    }
    this.clearCachedUser();
  }
}

export const authService = new AuthService();

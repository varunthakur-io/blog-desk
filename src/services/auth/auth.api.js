import { account } from '@/api/client';
import { ID } from 'appwrite';

class AuthApi {
  async createAccount(email, password, name) {
    return await account.create(ID.unique(), email, password, name);
  }

  async createEmailPasswordSession(email, password) {
    return await account.createEmailPasswordSession(email, password);
  }

  async getAccount() {
    return await account.get();
  }

  async deleteSession(sessionId) {
    return await account.deleteSession(sessionId);
  }

  async deleteSessions() {
    return await account.deleteSessions();
  }

  async updateName(name) {
    return await account.updateName(name);
  }

  async updateEmail(email, password) {
    return await account.updateEmail(email, password);
  }

  async updatePrefs(prefs) {
    return await account.updatePrefs(prefs);
  }

  async updateStatus() {
    return await account.updateStatus();
  }
}

export const authApi = new AuthApi();

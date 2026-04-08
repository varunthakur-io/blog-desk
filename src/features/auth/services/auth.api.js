import { account, functions, appwriteConfig as appwrite } from '@/lib/appwrite';
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

  async updatePassword(newPassword, oldPassword) {
    return await account.updatePassword(newPassword, oldPassword);
  }

  async updatePrefs(prefs) {
    return await account.updatePrefs(prefs);
  }

  async updateStatus() {
    return await account.updateStatus();
  }

  async executeDeleteAccount() {
    if (!appwrite.deleteAccountFunctionId) {
      throw new Error('Delete account function is not configured.');
    }
    return await functions.createExecution(
      appwrite.deleteAccountFunctionId,
      JSON.stringify({}),
      false,
      '/',
      'POST',
      { 'content-type': 'application/json' },
    );
  }

  async createVerification(url) {
    return await account.createVerification(url);
  }

  async updateVerification(userId, secret) {
    return await account.updateVerification(userId, secret);
  }

  async createRecovery(email, url) {
    return await account.createRecovery(email, url);
  }

  async updateRecovery(userId, secret, password) {
    return await account.updateRecovery(userId, secret, password);
  }
}

export const authApi = new AuthApi();

import { storageApi } from './storage.api';
import { parseApiError } from '@/lib/error-handler';

class StorageService {
  async uploadFile(file) {
    try {
      const uploaded = await storageApi.createFile(file);
      const fileId = uploaded.$id;
      const fileUrl = storageApi.getFileViewUrl(fileId);
      return { fileId, fileUrl };
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }

  async deleteFile(fileId) {
    try {
      await storageApi.deleteFile(fileId);
      return true;
    } catch (error) {
      console.warn('StorageService :: deleteFile() Failed to delete file:', error);
      return false;
    }
  }

  async uploadFileWithReplacement(file, oldFileId) {
    try {
      if (oldFileId) {
        await this.deleteFile(oldFileId);
      }
      return await this.uploadFile(file);
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }
}

export const storageService = new StorageService();

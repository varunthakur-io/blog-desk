import { storageApi } from './storage.api';

class StorageService {
  async uploadFile(file) {
    try {
      const uploaded = await storageApi.createFile(file);
      const fileId = uploaded.$id;
      const fileUrl = storageApi.getFileViewUrl(fileId);
      return { fileId, fileUrl };
    } catch (error) {
      console.error('StorageService :: uploadFile()', error);
      throw error;
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

  // Delete the previous asset first so profile/post image fields keep a single active file id.
  async uploadFileWithReplacement(file, oldFileId) {
    if (oldFileId) {
      // Best-effort replacement keeps a single active asset id for profile/post images.
      await this.deleteFile(oldFileId);
    }
    return await this.uploadFile(file);
  }
}

export const storageService = new StorageService();

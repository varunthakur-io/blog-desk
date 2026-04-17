import { storage, appwriteConfig as appwrite } from '@/lib/appwrite';
import { ID } from 'appwrite';

class StorageApi {
  async createFile(file) {
    return await storage.createFile(appwrite.bucketId, ID.unique(), file);
  }

  async deleteFile(fileId) {
    return await storage.deleteFile(appwrite.bucketId, fileId);
  }

  getFileViewUrl(fileId) {
    return `${appwrite.url}/storage/buckets/${appwrite.bucketId}/files/${fileId}/view?project=${appwrite.projectId}`;
  }
}

export const storageApi = new StorageApi();

import { Query } from 'node-appwrite';
import { listAllDocuments } from '../helpers/pagination.js';

export const cleanupNotifications = async ({ databases, config, userId, logger }) => {
  if (config.notificationsCollectionId) {
    logger.log('Cleaning up user notifications...');
    try {
      const receivedNotifications = await listAllDocuments(databases, config.databaseId, config.notificationsCollectionId, [
        Query.equal('recipientId', userId),
      ]);
      for (const notification of receivedNotifications) {
        await databases.deleteDocument(config.databaseId, config.notificationsCollectionId, notification.$id);
      }

      const sentNotifications = await listAllDocuments(databases, config.databaseId, config.notificationsCollectionId, [
        Query.equal('senderId', userId),
      ]);
      for (const notification of sentNotifications) {
        await databases.deleteDocument(config.databaseId, config.notificationsCollectionId, notification.$id);
      }
    } catch (notifErr) {
      logger.log(`Failed to clean up notifications: ${notifErr.message}`);
    }
  } else {
    logger.log('Skipped notifications cleanup: APPWRITE_NOTIFICATIONS_COLLECTION_ID variable is missing.');
  }
};

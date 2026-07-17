import { Query } from 'node-appwrite';
import { listAllDocuments } from '../helpers/pagination.js';
import { getDocumentSafe } from '../helpers/database.js';

export const cleanupFollows = async ({ databases, config, userId, logger }) => {
  // A. Where the user was the follower
  const following = await listAllDocuments(databases, config.databaseId, config.followsCollectionId, [
    Query.equal('followerId', userId),
  ]);
  for (const relationship of following) {
    try {
      if (relationship.followingId) {
        const profile = await getDocumentSafe(databases, config.databaseId, config.profilesCollectionId, relationship.followingId);
        if (profile) {
          const currentFollowersCount = profile.followersCount || 0;
          await databases.updateDocument(config.databaseId, config.profilesCollectionId, relationship.followingId, {
            followersCount: Math.max(0, currentFollowersCount - 1),
          });
        }
      }
    } catch (err) {
      logger.log(`Failed to decrement followersCount for user ${relationship.followingId}: ${err.message}`);
    }

    try {
      await databases.deleteDocument(config.databaseId, config.followsCollectionId, relationship.$id);
    } catch (err) {
      logger.log(`Failed to delete following relationship ${relationship.$id}: ${err.message}`);
    }
  }

  // B. Where the user was being followed
  const followers = await listAllDocuments(databases, config.databaseId, config.followsCollectionId, [
    Query.equal('followingId', userId),
  ]);
  for (const relationship of followers) {
    try {
      if (relationship.followerId) {
        const profile = await getDocumentSafe(databases, config.databaseId, config.profilesCollectionId, relationship.followerId);
        if (profile) {
          const currentFollowingCount = profile.followingCount || 0;
          await databases.updateDocument(config.databaseId, config.profilesCollectionId, relationship.followerId, {
            followingCount: Math.max(0, currentFollowingCount - 1),
          });
        }
      }
    } catch (err) {
      logger.log(`Failed to decrement followingCount for user ${relationship.followerId}: ${err.message}`);
    }

    try {
      await databases.deleteDocument(config.databaseId, config.followsCollectionId, relationship.$id);
    } catch (err) {
      logger.log(`Failed to delete follower relationship ${relationship.$id}: ${err.message}`);
    }
  }
};

import { Query } from 'node-appwrite';
import { listAllDocuments } from '../helpers/pagination.js';
import { getDocumentSafe } from '../helpers/database.js';

export const cleanupLikesAndComments = async ({ databases, config, userId, logger }) => {
  // 1. Comments cleanup
  const userComments = await listAllDocuments(databases, config.databaseId, config.commentsCollectionId, [
    Query.equal('userId', userId),
  ]);

  for (const comment of userComments) {
    try {
      if (comment.postId) {
        const post = await getDocumentSafe(databases, config.databaseId, config.postsCollectionId, comment.postId);
        if (post) {
          const currentCommentsCount = post.commentsCount || 0;
          await databases.updateDocument(config.databaseId, config.postsCollectionId, comment.postId, {
            commentsCount: Math.max(0, currentCommentsCount - 1),
          });
        }
      }
    } catch (err) {
      logger.log(`Failed to decrement commentsCount for post ${comment.postId}: ${err.message}`);
    }
    await databases.deleteDocument(config.databaseId, config.commentsCollectionId, comment.$id);
  }

  // 2. Likes cleanup
  const userLikes = await listAllDocuments(databases, config.databaseId, config.likesCollectionId, [
    Query.equal('userId', userId),
  ]);

  for (const like of userLikes) {
    try {
      if (like.postId) {
        const post = await getDocumentSafe(databases, config.databaseId, config.postsCollectionId, like.postId);
        if (post) {
          const currentLikesCount = post.likesCount || 0;
          await databases.updateDocument(config.databaseId, config.postsCollectionId, like.postId, {
            likesCount: Math.max(0, currentLikesCount - 1),
          });
        }
      }
    } catch (err) {
      logger.log(`Failed to decrement likesCount for post ${like.postId}: ${err.message}`);
    }
    await databases.deleteDocument(config.databaseId, config.likesCollectionId, like.$id);
  }
};

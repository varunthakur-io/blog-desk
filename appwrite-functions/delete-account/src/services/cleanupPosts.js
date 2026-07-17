import { Query } from 'node-appwrite';
import { listAllDocuments } from '../helpers/pagination.js';

export const cleanupPosts = async ({ databases, storage, config, userId, logger }) => {
  const userPosts = await listAllDocuments(databases, config.databaseId, config.postsCollectionId, [
    Query.equal('authorId', userId),
  ]);

  for (const post of userPosts) {
    if (post.coverImageId) {
      try {
        await storage.deleteFile(config.bucketId, post.coverImageId);
      } catch (fileError) {
        logger.log(`Failed to delete cover image ${post.coverImageId}: ${fileError.message}`);
      }
    }

    const postComments = await listAllDocuments(databases, config.databaseId, config.commentsCollectionId, [
      Query.equal('postId', post.$id),
    ]);

    for (const comment of postComments) {
      await databases.deleteDocument(config.databaseId, config.commentsCollectionId, comment.$id);
    }

    const postLikes = await listAllDocuments(databases, config.databaseId, config.likesCollectionId, [
      Query.equal('postId', post.$id),
    ]);

    for (const like of postLikes) {
      await databases.deleteDocument(config.databaseId, config.likesCollectionId, like.$id);
    }

    await databases.deleteDocument(config.databaseId, config.postsCollectionId, post.$id);
  }
};

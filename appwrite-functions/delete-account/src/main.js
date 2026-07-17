import { Client, Databases, Query, Storage, Users } from 'node-appwrite';

const json = (res, statusCode, payload) => {
  return res.json(payload, statusCode);
};

const getRequiredEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const listAllDocuments = async (databases, databaseId, collectionId, queries = []) => {
  const documents = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await databases.listDocuments(databaseId, collectionId, [
      ...queries,
      Query.limit(limit),
      Query.offset(offset),
    ]);

    documents.push(...response.documents);

    if (response.documents.length < limit) {
      break;
    }

    offset += limit;
  }

  return documents;
};

export default async ({ req, res, log, error }) => {
  try {
    const endpoint = getRequiredEnv('APPWRITE_FUNCTION_API_ENDPOINT');
    const projectId = getRequiredEnv('APPWRITE_FUNCTION_PROJECT_ID');
    const apiKey = getRequiredEnv('APPWRITE_FUNCTION_API_KEY');

    const databaseId = getRequiredEnv('APPWRITE_DATABASE_ID');
    const postsCollectionId = getRequiredEnv('APPWRITE_POSTS_COLLECTION_ID');
    const likesCollectionId = getRequiredEnv('APPWRITE_LIKES_COLLECTION_ID');
    const commentsCollectionId = getRequiredEnv('APPWRITE_COMMENTS_COLLECTION_ID');
    const profilesCollectionId = getRequiredEnv('APPWRITE_PROFILES_COLLECTION_ID');
    const followsCollectionId = getRequiredEnv('APPWRITE_FOLLOWS_COLLECTION_ID');
    const bucketId = getRequiredEnv('APPWRITE_BUCKET_ID');
    const notificationsCollectionId = process.env.APPWRITE_NOTIFICATIONS_COLLECTION_ID || null;


    const userId = req.headers['x-appwrite-user-id'];

    if (!userId) {
      return json(res, 401, { message: 'Authentication required.' });
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

    const databases = new Databases(client);
    const storage = new Storage(client);
    const users = new Users(client);

    // 1. Clean up user's own posts
    const userPosts = await listAllDocuments(databases, databaseId, postsCollectionId, [
      Query.equal('authorId', userId),
    ]);

    for (const post of userPosts) {
      if (post.coverImageId) {
        try {
          await storage.deleteFile(bucketId, post.coverImageId);
        } catch (fileError) {
          log(`Failed to delete cover image ${post.coverImageId}: ${fileError.message}`);
        }
      }

      const postComments = await listAllDocuments(databases, databaseId, commentsCollectionId, [
        Query.equal('postId', post.$id),
      ]);

      for (const comment of postComments) {
        await databases.deleteDocument(databaseId, commentsCollectionId, comment.$id);
      }

      const postLikes = await listAllDocuments(databases, databaseId, likesCollectionId, [
        Query.equal('postId', post.$id),
      ]);

      for (const like of postLikes) {
        await databases.deleteDocument(databaseId, likesCollectionId, like.$id);
      }

      await databases.deleteDocument(databaseId, postsCollectionId, post.$id);
    }

    // 2. Clean up comments and likes made by this user on other posts
    const userComments = await listAllDocuments(databases, databaseId, commentsCollectionId, [
      Query.equal('userId', userId),
    ]);

    for (const comment of userComments) {
      try {
        if (comment.postId) {
          const post = await databases.getDocument(databaseId, postsCollectionId, comment.postId);
          const currentCommentsCount = post.commentsCount || 0;
          await databases.updateDocument(databaseId, postsCollectionId, comment.postId, {
            commentsCount: Math.max(0, currentCommentsCount - 1),
          });
        }
      } catch (err) {
        log(`Failed to decrement commentsCount for post ${comment.postId}: ${err.message}`);
      }
      await databases.deleteDocument(databaseId, commentsCollectionId, comment.$id);
    }

    const userLikes = await listAllDocuments(databases, databaseId, likesCollectionId, [
      Query.equal('userId', userId),
    ]);

    for (const like of userLikes) {
      try {
        if (like.postId) {
          const post = await databases.getDocument(databaseId, postsCollectionId, like.postId);
          const currentLikesCount = post.likesCount || 0;
          await databases.updateDocument(databaseId, postsCollectionId, like.postId, {
            likesCount: Math.max(0, currentLikesCount - 1),
          });
        }
      } catch (err) {
        log(`Failed to decrement likesCount for post ${like.postId}: ${err.message}`);
      }
      await databases.deleteDocument(databaseId, likesCollectionId, like.$id);
    }

    // 3. Clean up Follow relationships
    // A. Where the user was the follower
    const following = await listAllDocuments(databases, databaseId, followsCollectionId, [
      Query.equal('followerId', userId),
    ]);
    for (const relationship of following) {
      try {
        // Decrement followersCount of the target user
        if (relationship.followingId) {
          const profile = await databases.getDocument(databaseId, profilesCollectionId, relationship.followingId);
          const currentFollowersCount = profile.followersCount || 0;
          await databases.updateDocument(databaseId, profilesCollectionId, relationship.followingId, {
            followersCount: Math.max(0, currentFollowersCount - 1),
          });
        }
      } catch (err) {
        log(`Failed to decrement followersCount for user ${relationship.followingId}: ${err.message}`);
      }

      try {
        await databases.deleteDocument(databaseId, followsCollectionId, relationship.$id);
      } catch (err) {
        log(`Failed to delete following relationship ${relationship.$id}: ${err.message}`);
      }
    }

    // B. Where the user was being followed
    const followers = await listAllDocuments(databases, databaseId, followsCollectionId, [
      Query.equal('followingId', userId),
    ]);
    for (const relationship of followers) {
      try {
        // Decrement followingCount of the follower
        if (relationship.followerId) {
          const profile = await databases.getDocument(databaseId, profilesCollectionId, relationship.followerId);
          const currentFollowingCount = profile.followingCount || 0;
          await databases.updateDocument(databaseId, profilesCollectionId, relationship.followerId, {
            followingCount: Math.max(0, currentFollowingCount - 1),
          });
        }
      } catch (err) {
        log(`Failed to decrement followingCount for user ${relationship.followerId}: ${err.message}`);
      }

      try {
        await databases.deleteDocument(databaseId, followsCollectionId, relationship.$id);
      } catch (err) {
        log(`Failed to delete follower relationship ${relationship.$id}: ${err.message}`);
      }
    }

    // 3.5 Clean up Notifications
    if (notificationsCollectionId) {
      log('Cleaning up user notifications...');
      try {
        const receivedNotifications = await listAllDocuments(databases, databaseId, notificationsCollectionId, [
          Query.equal('recipientId', userId),
        ]);
        for (const notification of receivedNotifications) {
          await databases.deleteDocument(databaseId, notificationsCollectionId, notification.$id);
        }

        const sentNotifications = await listAllDocuments(databases, databaseId, notificationsCollectionId, [
          Query.equal('senderId', userId),
        ]);
        for (const notification of sentNotifications) {
          await databases.deleteDocument(databaseId, notificationsCollectionId, notification.$id);
        }
      } catch (notifErr) {
        log(`Failed to clean up notifications: ${notifErr.message}`);
      }
    } else {
      log('Skipped notifications cleanup: APPWRITE_NOTIFICATIONS_COLLECTION_ID variable is missing.');
    }

    // 4. Delete Profile and Avatar

    try {
      const profile = await databases.getDocument(databaseId, profilesCollectionId, userId);
      if (profile.avatarId) {
        try {
          await storage.deleteFile(bucketId, profile.avatarId);
        } catch (fileError) {
          log(`Failed to delete avatar ${profile.avatarId}: ${fileError.message}`);
        }
      }

      await databases.deleteDocument(databaseId, profilesCollectionId, userId);
    } catch (profileError) {
      log(`Profile cleanup skipped for ${userId}: ${profileError.message}`);
    }

    // 5. Finally, delete the Auth Account
    await users.delete(userId);

    return json(res, 200, {
      success: true,
      message: 'Account deleted successfully.',
    });
  } catch (err) {
    error(err.message);
    return json(res, 500, {
      success: false,
      message: err.message || 'Failed to delete account.',
    });
  }
};

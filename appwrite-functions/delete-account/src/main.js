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
      await databases.deleteDocument(databaseId, commentsCollectionId, comment.$id);
    }

    const userLikes = await listAllDocuments(databases, databaseId, likesCollectionId, [
      Query.equal('userId', userId),
    ]);

    for (const like of userLikes) {
      await databases.deleteDocument(databaseId, likesCollectionId, like.$id);
    }

    // 3. Clean up Follow relationships
    // A. Where the user was the follower
    const following = await listAllDocuments(databases, databaseId, followsCollectionId, [
      Query.equal('followerId', userId),
    ]);
    for (const relationship of following) {
      try {
        // Ideally we should decrement followersCount of the target user here,
        // but for safety in deletion we focus on the relationship cleanup.
        await databases.deleteDocument(databaseId, followsCollectionId, relationship.$id);
      } catch (err) {
        log(`Failed to delete following relationship ${relationship.$id}`);
      }
    }

    // B. Where the user was being followed
    const followers = await listAllDocuments(databases, databaseId, followsCollectionId, [
      Query.equal('followingId', userId),
    ]);
    for (const relationship of followers) {
      try {
        await databases.deleteDocument(databaseId, followsCollectionId, relationship.$id);
      } catch (err) {
        log(`Failed to delete follower relationship ${relationship.$id}`);
      }
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

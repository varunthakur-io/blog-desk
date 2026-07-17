import { loadConfig } from './config/env.js';
import { initAppwrite } from './helpers/appwrite.js';
import { json } from './helpers/response.js';
import { createLogger } from './helpers/logger.js';
import { cleanupPosts } from './services/cleanupPosts.js';
import { cleanupLikesAndComments } from './services/cleanupLikesAndComments.js';
import { cleanupFollows } from './services/cleanupFollows.js';
import { cleanupNotifications } from './services/cleanupNotifications.js';
import { cleanupProfile } from './services/cleanupProfile.js';
import { deleteAuthUser } from './services/deleteAuthUser.js';

export default async ({ req, res, log, error }) => {
  try {
    const config = loadConfig();
    const userId = req.headers['x-appwrite-user-id'];

    if (!userId) {
      return json(res, 401, { message: 'Authentication required.' });
    }

    const { databases, storage, users } = initAppwrite(config);
    const logger = createLogger(log, error);

    // 1. Clean up user's own posts (comments/likes on them, and cover images)
    await cleanupPosts({ databases, storage, config, userId, logger });

    // 2. Clean up comments and likes made by this user on other posts, and decrement counters
    await cleanupLikesAndComments({ databases, config, userId, logger });

    // 3. Clean up Follow relationships, and decrement target counters
    await cleanupFollows({ databases, config, userId, logger });

    // 3.5 Clean up Notifications (sent by or received by this user)
    await cleanupNotifications({ databases, config, userId, logger });

    // 4. Delete Profile and Avatar
    await cleanupProfile({ databases, storage, config, userId, logger });

    // 5. Finally, delete the Auth Account
    await deleteAuthUser({ users, userId });

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

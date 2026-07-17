export const cleanupProfile = async ({ databases, storage, config, userId, logger }) => {
  try {
    const profile = await databases.getDocument(config.databaseId, config.profilesCollectionId, userId);
    if (profile.avatarId) {
      try {
        await storage.deleteFile(config.bucketId, profile.avatarId);
      } catch (fileError) {
        logger.log(`Failed to delete avatar ${profile.avatarId}: ${fileError.message}`);
      }
    }

    await databases.deleteDocument(config.databaseId, config.profilesCollectionId, userId);
  } catch (profileError) {
    logger.log(`Profile cleanup skipped for ${userId}: ${profileError.message}`);
  }
};

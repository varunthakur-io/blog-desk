export const getDocumentSafe = async (databases, databaseId, collectionId, documentId) => {
  try {
    return await databases.getDocument(databaseId, collectionId, documentId);
  } catch (error) {
    return null;
  }
};

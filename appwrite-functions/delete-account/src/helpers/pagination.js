import { Query } from 'node-appwrite';

export const listAllDocuments = async (databases, databaseId, collectionId, queries = []) => {
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

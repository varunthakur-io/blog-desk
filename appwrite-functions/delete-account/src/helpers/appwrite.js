import { Client, Databases, Storage, Users } from 'node-appwrite';

export const initAppwrite = (config) => {
  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

  return {
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  };
};

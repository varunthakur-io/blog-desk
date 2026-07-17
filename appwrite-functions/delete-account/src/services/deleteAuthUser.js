export const deleteAuthUser = async ({ users, userId }) => {
  await users.delete(userId);
};

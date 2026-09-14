export const excludePassword = <T extends { password?: any }>(
  user: T,
): Omit<T, "password"> => {
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

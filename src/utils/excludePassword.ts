export const excludePassword = <T extends Record<string, any>>(user: T) => {
  const { password, passwordResetToken, passwordResetExpires, ...rest } = user;
  return rest;
};

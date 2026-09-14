const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "RESEND_API_KEY",
  "FRONTEND_URL",
] as const;

export const validateEnv = (): void => {
  const missing = requiredEnvVars.filter(
    (key) => !process.env[key] || process.env[key]?.trim() === "",
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

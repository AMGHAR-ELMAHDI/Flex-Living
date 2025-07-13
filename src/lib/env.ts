const requiredEnvVars = {
  HOSTAWAY_ACCOUNT_ID: process.env.HOSTAWAY_ACCOUNT_ID,
  HOSTAWAY_API_KEY: process.env.HOSTAWAY_API_KEY,
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
} as const;

function validateEnv() {
  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`);
  }

  return requiredEnvVars;
}

export const env = validateEnv();

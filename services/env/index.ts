// Environment configuration utilities
export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "development",
  DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE === "true",
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CANVAS_API_URL: process.env.NEXT_PUBLIC_CANVAS_API_URL,
  CANVAS_API_KEY: process.env.NEXT_PUBLIC_CANVAS_API_KEY,
} as const;

// Type-safe environment configuration
export type Environment = typeof ENV;

// Environment validation
export const validateEnvironment = (): void => {
  const requiredVars = ["NEXT_PUBLIC_API_URL"] as const;

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(
        ", "
      )}. Using defaults.`
    );
  }
};

// Initialize environment validation
if (typeof window === "undefined") {
  validateEnvironment();
}

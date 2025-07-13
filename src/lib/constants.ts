export const APP_CONFIG = {
  NAME: "Flex Living Reviews",
  VERSION: "1.0.0",
  SUPPORT_EMAIL: "support@flexliving.com",
} as const;

export const API_ENDPOINTS = {
  REVIEWS: {
    MANAGE: "/api/reviews/manage",
    HOSTAWAY: "/api/reviews/hostaway",
    GOOGLE: "/api/reviews/google",
  },
  PLACES: {
    SEARCH: "/api/places/search",
    DETAILS: "/api/places/details",
    PHOTO: "/api/places/photo",
  },
} as const;

export const UI_CONSTANTS = {
  TOAST_DURATION: 4000,
  DEBOUNCE_DELAY: 300,
  IMAGE_CACHE_TIME: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const VALIDATION_RULES = {
  MIN_REVIEW_LENGTH: 10,
  MAX_REVIEW_LENGTH: 1000,
  MIN_RATING: 1,
  MAX_RATING: 5,
} as const;

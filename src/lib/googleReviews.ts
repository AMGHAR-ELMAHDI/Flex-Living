import {
  GooglePlaceDetails,
  GoogleReview,
  NormalizedReview,
} from "@/types/reviews";

// Google Places API configuration
// Note: You'll need to set up a Google Cloud project and enable Places API
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";
const GOOGLE_PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place";

// In-memory cache for API responses (use Redis in production)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class GoogleReviewsService {
  private static async makeRequest(url: string): Promise<any> {
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error("Google Places API key not configured");
    }

    // Check cache first
    const cacheKey = url;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Returning cached Google Places API response");
      return cached.data;
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Google Places API quota exceeded. Please try again later."
          );
        }
        if (response.status === 403) {
          throw new Error(
            "Google Places API access forbidden. Check your API key and permissions."
          );
        }
        throw new Error(
          `Google Places API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Handle API-level errors
      if (data.status === "OVER_QUERY_LIMIT") {
        throw new Error(
          "Google Places API quota exceeded. Please try again later."
        );
      }
      if (data.status === "REQUEST_DENIED") {
        throw new Error(
          "Google Places API access denied. Check your API key configuration."
        );
      }
      if (data.status === "INVALID_REQUEST") {
        throw new Error(
          "Invalid request to Google Places API. Please check your parameters."
        );
      }

      // Cache successful responses
      cache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error("Google Places API request failed:", error);
      throw error;
    }
  }

  // Enhanced property matching with multiple search strategies
  static async findPlace(
    query: string,
    location?: string
  ): Promise<{ placeId: string; name: string; address?: string } | null> {
    const searchStrategies = [
      // Strategy 1: Exact query with location
      location ? `${query} ${location}` : null,
      // Strategy 2: Query only
      query,
      // Strategy 3: If query looks like a property code, try common property types
      query.includes("B ") ? `${query} apartment London` : null,
      query.includes("B ") ? `${query} hotel London` : null,
    ].filter(Boolean);

    for (const searchQuery of searchStrategies) {
      if (!searchQuery) continue;

      try {
        const url = `${GOOGLE_PLACES_BASE_URL}/findplacefromtext/json?input=${encodeURIComponent(
          searchQuery
        )}&inputtype=textquery&fields=place_id,name,formatted_address&key=${GOOGLE_PLACES_API_KEY}`;

        const response = await this.makeRequest(url);

        if (response.status === "OK" && response.candidates.length > 0) {
          const candidate = response.candidates[0];
          return {
            placeId: candidate.place_id,
            name: candidate.name || query,
            address: candidate.formatted_address,
          };
        }
      } catch (error) {
        console.warn(`Search strategy failed for "${searchQuery}":`, error);
        continue;
      }
    }

    return null;
  }

  // Get place details including reviews
  static async getPlaceDetails(
    placeId: string
  ): Promise<GooglePlaceDetails | null> {
    const url = `${GOOGLE_PLACES_BASE_URL}/details/json?place_id=${placeId}&fields=place_id,name,rating,reviews,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const response = await this.makeRequest(url);

      if (response.status === "OK" && response.result) {
        return response.result;
      }

      return null;
    } catch (error) {
      console.error("Failed to get place details:", error);
      return null;
    }
  }

  // Get reviews for a property by name/address
  static async getReviewsForProperty(
    propertyName: string,
    propertyAddress?: string
  ): Promise<NormalizedReview[]> {
    try {
      const placeResult = await this.findPlace(propertyName, propertyAddress);

      if (!placeResult) {
        console.log(`No Google Place found for: ${propertyName}`);
        return [];
      }

      const placeDetails = await this.getPlaceDetails(placeResult.placeId);

      if (!placeDetails || !placeDetails.reviews) {
        console.log(`No reviews found for place: ${propertyName}`);
        return [];
      }

      return this.normalizeGoogleReviews(
        placeDetails.reviews,
        placeResult.name || propertyName,
        placeResult.placeId
      );
    } catch (error) {
      console.error(`Failed to get Google reviews for ${propertyName}:`, error);
      return [];
    }
  }

  // Normalize Google reviews to our internal format
  private static normalizeGoogleReviews(
    reviews: GoogleReview[],
    propertyName: string,
    propertyId: string
  ): NormalizedReview[] {
    return reviews.map((review, index) => ({
      id: `google_${propertyId}_${index}`,
      source: "google" as const,
      propertyId: propertyId,
      propertyName: propertyName,
      guestName: review.author_name,
      rating: review.rating,
      comment: review.text,
      submittedAt: new Date(review.time * 1000), // Convert Unix timestamp
      categories: [], // Google doesn't provide category breakdowns
      channel: "Google Reviews",
      isApproved: true, // Google reviews are already public
      isPublic: false, // Default to not public for manager approval
      type: "guest-review" as const,
    }));
  }
}

// Exploration findings for Google Reviews integration
export const googleReviewsFindings = {
  feasibility: "FEASIBLE",
  requirements: [
    "Google Cloud Project with Places API enabled",
    "Places API key with sufficient quota",
    "Property addresses or exact names for place lookup",
  ],
  limitations: [
    "Limited to 5 most recent reviews per place",
    "No category breakdowns like Hostaway provides",
    "Rate limiting applies (requests per day/minute)",
    "Requires exact property names or addresses for accurate matching",
  ],
  implementation: {
    apiUsed: "Google Places API",
    endpoints: [
      "Find Place from Text API - to locate properties",
      "Place Details API - to fetch reviews and ratings",
    ],
    costs: "Pay-per-request pricing model",
    alternatives: [
      "Google My Business API (for business owners)",
      "Web scraping (not recommended, against ToS)",
      "Third-party review aggregation services",
    ],
  },
  recommendations: [
    "Implement caching to reduce API calls",
    "Use batch processing for multiple properties",
    "Set up monitoring for API quota usage",
    "Consider fallback strategies for quota exceeded scenarios",
  ],
};

export async function fetchGoogleReviews(
  propertyName: string,
  propertyAddress?: string
): Promise<NormalizedReview[]> {
  return await GoogleReviewsService.getReviewsForProperty(
    propertyName,
    propertyAddress
  );
}

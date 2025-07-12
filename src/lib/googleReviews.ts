import {
  GooglePlaceDetails,
  GoogleReview,
  NormalizedReview,
} from "@/types/reviews";

// Google Places API configuration
// Note: You'll need to set up a Google Cloud project and enable Places API
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";
const GOOGLE_PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place";

export class GoogleReviewsService {
  private static async makeRequest(url: string): Promise<any> {
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error("Google Places API key not configured");
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Google Places API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Google Places API request failed:", error);
      throw error;
    }
  }

  // Find place by name and location
  static async findPlace(
    query: string,
    location?: string
  ): Promise<string | null> {
    const searchQuery = location ? `${query} ${location}` : query;
    const url = `${GOOGLE_PLACES_BASE_URL}/findplacefromtext/json?input=${encodeURIComponent(
      searchQuery
    )}&inputtype=textquery&fields=place_id&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const response = await this.makeRequest(url);

      if (response.status === "OK" && response.candidates.length > 0) {
        return response.candidates[0].place_id;
      }

      return null;
    } catch (error) {
      console.error("Failed to find place:", error);
      return null;
    }
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
      const placeId = await this.findPlace(propertyName, propertyAddress);

      if (!placeId) {
        console.log(`No Google Place found for: ${propertyName}`);
        return [];
      }

      const placeDetails = await this.getPlaceDetails(placeId);

      if (!placeDetails || !placeDetails.reviews) {
        console.log(`No reviews found for place: ${propertyName}`);
        return [];
      }

      return this.normalizeGoogleReviews(
        placeDetails.reviews,
        propertyName,
        placeId
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

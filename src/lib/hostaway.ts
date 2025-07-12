import { HostawayApiResponse, NormalizedReview } from "@/types/reviews";
import { mockHostawayReviews, normalizeHostawayReviews } from "@/lib/mockData";

const HOSTAWAY_API_BASE = "https://api.hostaway.com/v1";
// Get API credentials from environment variables
const ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID;
const API_KEY = process.env.HOSTAWAY_API_KEY;

// Throw errors if credentials don't exist
if (!ACCOUNT_ID)
  throw new Error("HOSTAWAY_ACCOUNT_ID not found in environment variables");
if (!API_KEY)
  throw new Error("HOSTAWAY_API_KEY not found in environment variables");

export class HostawayService {
  private static async makeRequest(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${HOSTAWAY_API_BASE}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Hostaway API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Hostaway API request failed:", error);
      // Return mock data when API fails (since it's sandboxed)
      return {
        status: "success",
        result: mockHostawayReviews,
      };
    }
  }

  static async getReviews(): Promise<NormalizedReview[]> {
    try {
      // Try to fetch from actual API first
      const response: HostawayApiResponse = await this.makeRequest(
        `/reviews?accountId=${ACCOUNT_ID}`
      );

      if (response.status === "success" && response.result.length > 0) {
        return normalizeHostawayReviews(response.result);
      }

      // Fallback to mock data (which is expected for sandbox)
      console.log("Using mock data as Hostaway sandbox contains no reviews");
      return normalizeHostawayReviews(mockHostawayReviews);
    } catch (error) {
      console.error("Failed to fetch Hostaway reviews:", error);
      // Always fallback to mock data
      return normalizeHostawayReviews(mockHostawayReviews);
    }
  }

  static async getReviewsByProperty(
    propertyId: string
  ): Promise<NormalizedReview[]> {
    const allReviews = await this.getReviews();
    return allReviews.filter((review) => review.propertyId === propertyId);
  }

  static async getReviewById(
    reviewId: string
  ): Promise<NormalizedReview | null> {
    const allReviews = await this.getReviews();
    return allReviews.find((review) => review.id === reviewId) || null;
  }
}

// API endpoint handlers
export async function fetchHostawayReviews(): Promise<NormalizedReview[]> {
  return await HostawayService.getReviews();
}

export async function fetchReviewsByProperty(
  propertyId: string
): Promise<NormalizedReview[]> {
  return await HostawayService.getReviewsByProperty(propertyId);
}

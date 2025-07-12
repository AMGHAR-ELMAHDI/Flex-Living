// Review types and interfaces

export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: "host-to-guest" | "guest-to-host";
  status: "published" | "pending" | "draft";
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface HostawayApiResponse {
  status: "success" | "error";
  result: HostawayReview[];
}

// Normalized review interface for internal use
export interface NormalizedReview {
  id: string;
  source: "hostaway" | "google" | "airbnb";
  propertyId: string;
  propertyName: string;
  guestName: string;
  rating: number;
  comment: string;
  submittedAt: Date;
  categories: ReviewCategory[];
  channel: string;
  isApproved: boolean;
  isPublic: boolean;
  type: "guest-review" | "host-review";
}

// Dashboard filter types
export interface ReviewFilters {
  rating?: number[];
  categories?: string[];
  channels?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  properties?: string[];
  status?: ("approved" | "pending" | "rejected")[];
}

// Analytics data
export interface ReviewAnalytics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  categoryAverages: Record<string, number>;
  trendsOverTime: {
    date: string;
    rating: number;
    count: number;
  }[];
  topIssues: string[];
  bestPerformingProperties: string[];
}

// Google Places API types
export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  original_language?: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated?: boolean;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating: number;
  reviews: GoogleReview[];
  user_ratings_total: number;
}

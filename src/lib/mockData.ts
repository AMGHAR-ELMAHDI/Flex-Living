import {
  HostawayReview,
  NormalizedReview,
  ReviewAnalytics,
} from "@/types/reviews";

// Mock Hostaway review data based on the API example
export const mockHostawayReviews: HostawayReview[] = [
  {
    id: 7453,
    type: "host-to-guest",
    status: "published",
    rating: null,
    publicReview:
      "Shane and family are wonderful! Would definitely host again :)",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "respect_house_rules", rating: 10 },
    ],
    submittedAt: "2020-08-21 22:45:14",
    guestName: "Shane Finkelstein",
    listingName: "2B N1 A - 29 Shoreditch Heights",
  },
  {
    id: 7454,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview:
      "Amazing stay at this beautiful property. The location was perfect and the apartment was spotlessly clean. Sarah was an excellent host and very responsive to all our needs.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "value", rating: 8 },
    ],
    submittedAt: "2024-01-15 14:30:22",
    guestName: "Maria Rodriguez",
    listingName: "1B S2 B - 15 Canary Wharf Luxury",
  },
  {
    id: 7455,
    type: "guest-to-host",
    status: "published",
    rating: 4,
    publicReview:
      "Great location and comfortable stay. The check-in process was smooth and the property had all necessary amenities. Only minor issue was the Wi-Fi speed.",
    reviewCategory: [
      { category: "cleanliness", rating: 8 },
      { category: "communication", rating: 9 },
      { category: "location", rating: 10 },
      { category: "amenities", rating: 7 },
    ],
    submittedAt: "2024-02-03 09:15:33",
    guestName: "James Mitchell",
    listingName: "2B N1 A - 29 Shoreditch Heights",
  },
  {
    id: 7456,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview:
      "Exceptional property with stunning views. The interior design is modern and stylish. Host was incredibly helpful and provided great local recommendations.",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 9 },
      { category: "design", rating: 10 },
    ],
    submittedAt: "2024-01-28 16:45:12",
    guestName: "Emma Thompson",
    listingName: "3B W1 C - 42 Notting Hill Garden",
  },
  {
    id: 7457,
    type: "guest-to-host",
    status: "published",
    rating: 3,
    publicReview:
      "Decent property but had some maintenance issues. The heating wasn't working properly during our stay. Location is convenient though.",
    reviewCategory: [
      { category: "cleanliness", rating: 7 },
      { category: "communication", rating: 8 },
      { category: "location", rating: 9 },
      { category: "maintenance", rating: 4 },
    ],
    submittedAt: "2024-01-10 11:20:45",
    guestName: "David Chen",
    listingName: "1B S2 B - 15 Canary Wharf Luxury",
  },
  {
    id: 7458,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview:
      "Perfect for our business trip. The workspace was excellent and the location made it easy to get around London. Will definitely stay again!",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "business_amenities", rating: 10 },
    ],
    submittedAt: "2024-02-12 13:55:18",
    guestName: "Sophie Laurent",
    listingName: "2B EC1 D - 8 City Financial District",
  },
  {
    id: 7459,
    type: "guest-to-host",
    status: "published",
    rating: 4,
    publicReview:
      "Beautiful apartment in a great neighborhood. The kitchen was well-equipped and the bed was very comfortable. Check-in was seamless.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 9 },
      { category: "comfort", rating: 9 },
      { category: "amenities", rating: 8 },
    ],
    submittedAt: "2024-01-22 19:30:56",
    guestName: "Michael Johnson",
    listingName: "3B W1 C - 42 Notting Hill Garden",
  },
  {
    id: 7460,
    type: "guest-to-host",
    status: "published",
    rating: 2,
    publicReview:
      "Had some issues during our stay. The property wasn't as clean as expected and there were noise issues from construction nearby. Host was responsive but couldn't resolve all issues.",
    reviewCategory: [
      { category: "cleanliness", rating: 4 },
      { category: "communication", rating: 8 },
      { category: "location", rating: 6 },
      { category: "noise", rating: 2 },
    ],
    submittedAt: "2024-01-05 08:42:33",
    guestName: "Anna Williams",
    listingName: "1B E2 E - 23 Brick Lane Modern",
  },
];

// Function to normalize Hostaway reviews to our internal format
export function normalizeHostawayReviews(
  reviews: HostawayReview[]
): NormalizedReview[] {
  return reviews.map((review) => {
    // Calculate average rating from categories if overall rating is null
    const averageRating =
      review.rating ||
      (review.reviewCategory.length > 0
        ? review.reviewCategory.reduce((sum, cat) => sum + cat.rating, 0) /
          review.reviewCategory.length /
          2 // Convert from 10-scale to 5-scale
        : 5);

    return {
      id: review.id.toString(),
      source: "hostaway",
      propertyId: extractPropertyId(review.listingName),
      propertyName: review.listingName,
      guestName: review.guestName,
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      comment: review.publicReview,
      submittedAt: new Date(review.submittedAt),
      categories: review.reviewCategory,
      channel: "Hostaway",
      isApproved: review.status === "published",
      isPublic: false, // Default to not public for manager approval
      type: review.type === "guest-to-host" ? "guest-review" : "host-review",
    };
  });
}

// Extract property ID from listing name (simple implementation)
function extractPropertyId(listingName: string): string {
  // Extract the property code (e.g., "2B N1 A" from "2B N1 A - 29 Shoreditch Heights")
  const match = listingName.match(/^([^-]+)/);
  return match ? match[1].trim().replace(/\s+/g, "_").toLowerCase() : "unknown";
}

// Mock analytics data generation
export function generateMockAnalytics(
  reviews: NormalizedReview[]
): ReviewAnalytics {
  const ratings = reviews.map((r) => r.rating);
  const categories = reviews.flatMap((r) => r.categories);

  const ratingDistribution = ratings.reduce((acc, rating) => {
    const rounded = Math.floor(rating);
    acc[rounded] = (acc[rounded] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const categoryAverages = categories.reduce((acc, cat) => {
    if (!acc[cat.category]) {
      acc[cat.category] = { total: 0, count: 0 };
    }
    acc[cat.category].total += cat.rating;
    acc[cat.category].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const categoryAvgs = Object.entries(categoryAverages).reduce(
    (acc, [category, data]) => {
      acc[category] = Number((data.total / data.count / 2).toFixed(1)); // Convert to 5-scale
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalReviews: reviews.length,
    averageRating: Number(
      (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
    ),
    ratingDistribution,
    categoryAverages: categoryAvgs,
    trendsOverTime: generateTrendData(reviews),
    topIssues: ["maintenance", "noise", "cleanliness"],
    bestPerformingProperties: [
      "3B W1 C - 42 Notting Hill Garden",
      "2B EC1 D - 8 City Financial District",
    ],
  };
}

function generateTrendData(reviews: NormalizedReview[]) {
  const grouped = reviews.reduce((acc, review) => {
    const date = review.submittedAt.toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = { ratings: [], count: 0 };
    }
    acc[date].ratings.push(review.rating);
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { ratings: number[]; count: number }>);

  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      rating: Number(
        (
          data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length
        ).toFixed(1)
      ),
      count: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

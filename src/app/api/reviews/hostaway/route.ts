import { NextRequest, NextResponse } from "next/server";
import { fetchHostawayReviews } from "@/lib/hostaway";
import { generateMockAnalytics } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    // Fetch and normalize reviews from Hostaway
    const reviews = await fetchHostawayReviews();

    // Generate analytics
    const analytics = generateMockAnalytics(reviews);

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const propertyFilter = searchParams.get("property");
    const ratingFilter = searchParams.get("rating");
    const statusFilter = searchParams.get("status");

    let filteredReviews = reviews;

    // Apply filters
    if (propertyFilter) {
      filteredReviews = filteredReviews.filter(
        (review) =>
          review.propertyId === propertyFilter ||
          review.propertyName
            .toLowerCase()
            .includes(propertyFilter.toLowerCase())
      );
    }

    if (ratingFilter) {
      const minRating = parseFloat(ratingFilter);
      filteredReviews = filteredReviews.filter(
        (review) => review.rating >= minRating
      );
    }

    if (statusFilter) {
      filteredReviews = filteredReviews.filter((review) => {
        if (statusFilter === "approved") return review.isApproved;
        if (statusFilter === "pending") return !review.isApproved;
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews: filteredReviews,
        analytics,
        total: filteredReviews.length,
        filters: {
          property: propertyFilter,
          rating: ratingFilter,
          status: statusFilter,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching Hostaway reviews:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

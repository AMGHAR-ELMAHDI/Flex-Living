import { NextRequest, NextResponse } from "next/server";
import { fetchHostawayReviews } from "@/lib/hostaway";

// In a real application, you would store this in a database
const reviewApprovals: Record<
  string,
  { isApproved: boolean; isPublic: boolean }
> = {};

export async function GET() {
  try {
    const reviews = await fetchHostawayReviews();

    // Apply stored approvals
    const reviewsWithApprovals = reviews.map((review) => ({
      ...review,
      ...reviewApprovals[review.id],
    }));

    return NextResponse.json({
      success: true,
      data: reviewsWithApprovals,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, isApproved, isPublic } = body;

    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          error: "Review ID is required",
        },
        { status: 400 }
      );
    }

    // Store the approval status
    reviewApprovals[reviewId] = {
      isApproved: isApproved ?? true,
      isPublic: isPublic ?? false,
    };

    return NextResponse.json({
      success: true,
      data: {
        reviewId,
        isApproved: reviewApprovals[reviewId].isApproved,
        isPublic: reviewApprovals[reviewId].isPublic,
      },
    });
  } catch (error) {
    console.error("Error updating review approval:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update review approval",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body; // Array of { reviewId, isApproved, isPublic }

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        {
          success: false,
          error: "Updates must be an array",
        },
        { status: 400 }
      );
    }

    // Bulk update approvals
    updates.forEach(({ reviewId, isApproved, isPublic }) => {
      if (reviewId) {
        reviewApprovals[reviewId] = {
          isApproved:
            isApproved ?? reviewApprovals[reviewId]?.isApproved ?? true,
          isPublic: isPublic ?? reviewApprovals[reviewId]?.isPublic ?? false,
        };
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        updated: updates.length,
        approvals: reviewApprovals,
      },
    });
  } catch (error) {
    console.error("Error bulk updating review approvals:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to bulk update review approvals",
      },
      { status: 500 }
    );
  }
}

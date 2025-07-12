import { NextRequest, NextResponse } from "next/server";
import { fetchGoogleReviews, googleReviewsFindings } from "@/lib/googleReviews";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyName = searchParams.get("property");
  const propertyAddress = searchParams.get("address");
  const exploratory = searchParams.get("exploratory") === "true";

  // If this is an exploratory request, return findings
  if (exploratory) {
    return NextResponse.json({
      success: true,
      data: {
        findings: googleReviewsFindings,
        implementation_status: "READY_FOR_IMPLEMENTATION",
        test_available: !!process.env.GOOGLE_PLACES_API_KEY,
      },
    });
  }

  // Check if Google Places API key is configured
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        error: "Google Places API not configured",
        message: "GOOGLE_PLACES_API_KEY environment variable is required",
        findings: googleReviewsFindings,
      },
      { status: 501 }
    );
  }

  if (!propertyName) {
    return NextResponse.json(
      {
        success: false,
        error: "Property name is required",
        message: "Please provide a property name to search for Google reviews",
      },
      { status: 400 }
    );
  }

  try {
    const reviews = await fetchGoogleReviews(
      propertyName,
      propertyAddress || undefined
    );

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        total: reviews.length,
        property: propertyName,
        address: propertyAddress,
        source: "google_places_api",
      },
    });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Google reviews",
        message: error instanceof Error ? error.message : "Unknown error",
        findings: googleReviewsFindings,
      },
      { status: 500 }
    );
  }
}

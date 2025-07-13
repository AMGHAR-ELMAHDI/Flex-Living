import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const photoReference = searchParams.get("reference");
    const maxWidth = searchParams.get("maxwidth") || "400";
    const maxHeight = searchParams.get("maxheight");

    if (!photoReference) {
      return NextResponse.json(
        { success: false, error: "Photo reference is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Google Places API key not configured" },
        { status: 500 }
      );
    }

    // Build the photo URL
    const params = new URLSearchParams({
      photoreference: photoReference,
      maxwidth: maxWidth,
      key: apiKey,
    });

    if (maxHeight) {
      params.append("maxheight", maxHeight);
    }

    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?${params.toString()}`;

    // Fetch the photo and return it
    const response = await fetch(photoUrl);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch photo" },
        { status: response.status }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the image
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error("Photo fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch photo",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

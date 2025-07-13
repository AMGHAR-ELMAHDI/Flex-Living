import { NextRequest, NextResponse } from "next/server";

interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
}

interface PlacesSearchResponse {
  results: GooglePlace[];
  status: string;
  error_message?: string;
  next_page_token?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const type = searchParams.get("type") || "lodging"; // Default to lodging for rental properties
    const location = searchParams.get("location");
    const radius = searchParams.get("radius") || "1000"; // Default 1km radius

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query parameter is required" },
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

    // Build the search URL
    const baseUrl =
      "https://maps.googleapis.com/maps/api/place/textsearch/json";
    const params = new URLSearchParams({
      query,
      key: apiKey,
      type,
    });

    if (location) {
      params.append("location", location);
      params.append("radius", radius);
    }

    const url = `${baseUrl}?${params.toString()}`;

    console.log("Places API Search URL:", url.replace(apiKey, "***"));

    const response = await fetch(url);
    const data: PlacesSearchResponse = await response.json();

    console.log("Places API Response Status:", data.status);
    console.log("Places API Results Count:", data.results?.length || 0);

    if (data.status === "REQUEST_DENIED") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Google Places API access denied. Please check your API key and ensure Places API is enabled.",
          details: data.error_message,
        },
        { status: 403 }
      );
    }

    if (data.status === "OVER_QUERY_LIMIT") {
      return NextResponse.json(
        {
          success: false,
          error: "Google Places API quota exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return NextResponse.json(
        {
          success: false,
          error: `Google Places API error: ${data.status}`,
          details: data.error_message,
        },
        { status: 500 }
      );
    }

    // Transform the results for our frontend
    const places = data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: place.geometry.location,
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      types: place.types,
      photos: place.photos?.map((photo) => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
      })),
      priceLevel: place.price_level,
      isOpen: place.opening_hours?.open_now,
    }));

    return NextResponse.json({
      success: true,
      data: {
        places,
        total: places.length,
        nextPageToken: data.next_page_token,
        query,
        searchType: type,
      },
    });
  } catch (error) {
    console.error("Places search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search for places",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

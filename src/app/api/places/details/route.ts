import { NextRequest, NextResponse } from "next/server";

interface PlaceDetailsResponse {
  result: {
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
    reviews?: Array<{
      author_name: string;
      author_url?: string;
      language: string;
      profile_photo_url?: string;
      rating: number;
      relative_time_description: string;
      text: string;
      time: number;
    }>;
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
    }>;
    opening_hours?: {
      open_now: boolean;
      periods: Array<{
        close: { day: number; time: string };
        open: { day: number; time: string };
      }>;
      weekday_text: string[];
    };
    formatted_phone_number?: string;
    international_phone_number?: string;
    website?: string;
    url?: string;
    price_level?: number;
    types: string[];
  };
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("place_id");

    if (!placeId) {
      return NextResponse.json(
        { success: false, error: "Place ID is required" },
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

    // Define the fields we want to retrieve
    const fields = [
      "place_id",
      "name",
      "formatted_address",
      "geometry",
      "rating",
      "user_ratings_total",
      "reviews",
      "photos",
      "opening_hours",
      "formatted_phone_number",
      "international_phone_number",
      "website",
      "url",
      "price_level",
      "types",
    ].join(",");

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

    console.log("Place Details API URL:", url.replace(apiKey, "***"));

    const response = await fetch(url);
    const data: PlaceDetailsResponse = await response.json();

    console.log("Place Details API Response Status:", data.status);

    if (data.status === "REQUEST_DENIED") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Google Places API access denied. Please check your API key and ensure Places API is enabled.",
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

    if (data.status !== "OK") {
      return NextResponse.json(
        {
          success: false,
          error: `Google Places API error: ${data.status}`,
        },
        { status: 500 }
      );
    }

    // Transform the response for our frontend
    const place = data.result;
    const transformedPlace = {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: place.geometry.location,
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      reviews: place.reviews?.map((review) => ({
        id: `${place.place_id}-${review.time}`,
        author: review.author_name,
        authorUrl: review.author_url,
        language: review.language,
        profilePhotoUrl: review.profile_photo_url,
        rating: review.rating,
        timeDescription: review.relative_time_description,
        text: review.text,
        timestamp: review.time,
        date: new Date(review.time * 1000).toISOString(),
      })),
      photos: place.photos?.map((photo) => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
      })),
      openingHours: place.opening_hours
        ? {
            openNow: place.opening_hours.open_now,
            periods: place.opening_hours.periods,
            weekdayText: place.opening_hours.weekday_text,
          }
        : undefined,
      contact: {
        phone: place.formatted_phone_number,
        internationalPhone: place.international_phone_number,
        website: place.website,
        googleUrl: place.url,
      },
      priceLevel: place.price_level,
      types: place.types,
    };

    return NextResponse.json({
      success: true,
      data: transformedPlace,
    });
  } catch (error) {
    console.error("Place details error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch place details",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  DollarSign,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Calendar,
  User,
  Languages,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

interface PlaceReview {
  id: string;
  author: string;
  authorUrl?: string;
  language: string;
  profilePhotoUrl?: string;
  rating: number;
  timeDescription: string;
  text: string;
  timestamp: number;
  date: string;
}

interface PlaceDetails {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  reviewCount?: number;
  reviews?: PlaceReview[];
  photos?: Array<{
    reference: string;
    width: number;
    height: number;
  }>;
  openingHours?: {
    openNow: boolean;
    periods: Array<{
      close: { day: number; time: string };
      open: { day: number; time: string };
    }>;
    weekdayText: string[];
  };
  contact: {
    phone?: string;
    internationalPhone?: string;
    website?: string;
    googleUrl?: string;
  };
  priceLevel?: number;
  types: string[];
}

export default function PlaceDetailsPage() {
  const searchParams = useSearchParams();
  const placeId = searchParams.get("place_id");

  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) {
      setError("No place ID provided");
      setLoading(false);
      return;
    }

    fetchPlaceDetails();
  }, [placeId]);

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/places/details?place_id=${placeId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch place details");
      }

      setPlace(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = (photoReference: string, maxWidth = 400) => {
    return `/api/places/photo?reference=${photoReference}&maxwidth=${maxWidth}`;
  };

  const getPriceLevelText = (level?: number) => {
    if (!level) return "Unknown";
    const levels = [
      "Free",
      "Inexpensive",
      "Moderate",
      "Expensive",
      "Very Expensive",
    ];
    return levels[level] || "Unknown";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading place details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Place
            </h2>
            <p className="text-red-700">{error}</p>
            <Link
              href="/places"
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Places Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Place not found</p>
          <Link
            href="/places"
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Places Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Places Search
          </Link>
        </div>

        {/* Place Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Photo */}
            {place.photos && place.photos.length > 0 && (
              <div className="lg:col-span-1">
                <img
                  src={getPhotoUrl(place.photos[0].reference, 600)}
                  alt={place.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Place Info */}
            <div className={place.photos ? "lg:col-span-2" : "lg:col-span-3"}>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {place.name}
              </h1>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5" />
                <span>{place.address}</span>
              </div>

              {/* Rating */}
              {place.rating && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {renderStars(place.rating)}
                    <span className="font-semibold text-lg">
                      {place.rating.toFixed(1)}
                    </span>
                  </div>
                  {place.reviewCount && (
                    <span className="text-gray-600">
                      {place.reviewCount.toLocaleString()} reviews
                    </span>
                  )}
                </div>
              )}

              {/* Status and Price */}
              <div className="flex items-center gap-4 mb-4">
                {place.openingHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span
                      className={
                        place.openingHours.openNow
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {place.openingHours.openNow ? "Open now" : "Closed"}
                    </span>
                  </div>
                )}
                {place.priceLevel && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{getPriceLevelText(place.priceLevel)}</span>
                  </div>
                )}
              </div>

              {/* Types */}
              <div className="flex flex-wrap gap-2 mb-4">
                {place.types.slice(0, 5).map((type) => (
                  <Badge key={type} variant="secondary">
                    {type.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {place.contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${place.contact.phone}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {place.contact.phone}
                    </a>
                  </div>
                )}
                {place.contact.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a
                      href={place.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {place.contact.googleUrl && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <a
                      href={place.contact.googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      View on Google Maps
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        {place.openingHours && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Opening Hours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {place.openingHours.weekdayText.map((text, index) => (
                <div key={index} className="text-gray-600">
                  {text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {place.reviews && place.reviews.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Reviews ({place.reviews.length})
            </h2>

            <div className="space-y-6">
              {place.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    {review.profilePhotoUrl ? (
                      <img
                        src={review.profilePhotoUrl}
                        alt={review.author}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {review.author}
                        </h3>
                        {review.language !== "en" && (
                          <Badge variant="secondary" className="text-xs">
                            <Languages className="h-3 w-3 mr-1" />
                            {review.language}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        {renderStars(review.rating)}
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {review.timeDescription}
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

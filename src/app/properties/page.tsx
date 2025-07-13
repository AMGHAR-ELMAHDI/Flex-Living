"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NormalizedReview } from "@/types/reviews";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { getAllProperties, Property } from "@/lib/propertiesData";
import {
  MapPin,
  Star,
  Eye,
  BarChart3,
  ExternalLink,
  Search,
  Loader2,
} from "lucide-react";

interface GooglePlaceInfo {
  placeId?: string;
  name?: string;
  rating?: number;
  reviewCount?: number;
  photos?: string[];
  types?: string[];
  priceLevel?: number;
  openNow?: boolean;
}

interface ExtendedProperty extends Property {
  googlePlace?: GooglePlaceInfo;
  isSearchingPlace?: boolean;
}

export default function PropertiesPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [properties, setProperties] = useState<ExtendedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load properties from centralized data
    const propertiesData = getAllProperties();
    setProperties(propertiesData);

    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reviews/hostaway");
      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchGooglePlace = async (property: ExtendedProperty) => {
    try {
      // Update state to show loading
      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, isSearchingPlace: true } : p
        )
      );

      const response = await fetch(
        `/api/places/search?query=${encodeURIComponent(
          property.searchQuery
        )}&type=lodging`
      );
      const data = await response.json();

      if (data.success && data.data.places.length > 0) {
        const place = data.data.places[0]; // Take the first result
        const googlePlace: GooglePlaceInfo = {
          placeId: place.id,
          name: place.name,
          rating: place.rating,
          reviewCount: place.reviewCount,
          photos:
            place.photos?.map(
              (photo: any) =>
                `/api/places/photo?reference=${photo.reference}&maxwidth=300`
            ) || [],
          types: place.types,
          priceLevel: place.priceLevel,
          openNow: place.isOpen,
        };

        // Update the property with Google Place data
        setProperties((prev) =>
          prev.map((p) =>
            p.id === property.id
              ? { ...p, googlePlace, isSearchingPlace: false }
              : p
          )
        );
      } else {
        // No place found
        setProperties((prev) =>
          prev.map((p) =>
            p.id === property.id ? { ...p, isSearchingPlace: false } : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to search Google Place:", error);
      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, isSearchingPlace: false } : p
        )
      );
    }
  };

  const getPropertyStats = (propertyId: string) => {
    const propertyReviews = reviews.filter((r) => r.propertyId === propertyId);
    const publicReviews = propertyReviews.filter(
      (r) => r.isPublic && r.isApproved
    );
    const averageRating =
      propertyReviews.length > 0
        ? propertyReviews.reduce((sum, r) => sum + r.rating, 0) /
          propertyReviews.length
        : 0;

    return {
      totalReviews: propertyReviews.length,
      publicReviews: publicReviews.length,
      averageRating: Number(averageRating.toFixed(1)),
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                <p className="text-gray-600 mt-1">
                  View and manage all Flex Living properties with Google Places
                  integration
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <MapPin className="w-4 h-4" />
                    <span>Google Places Available</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Click the search icon to find location data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length}
                </p>
              </div>
              <Star className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Public Reviews</p>
                <p className="text-2xl font-bold text-green-600">
                  {reviews.filter((r) => r.isPublic && r.isApproved).length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reviews.length > 0
                    ? (
                        reviews.reduce((sum, r) => sum + r.rating, 0) /
                        reviews.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <Star className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => {
            const stats = getPropertyStats(property.id);

            return (
              <div
                key={property.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Property Image */}
                <div className="aspect-w-16 aspect-h-10 relative">
                  <img
                    src={
                      property.googlePlace?.photos?.[0] || property.images[0]
                    }
                    alt={property.name}
                    className="w-full h-48 object-cover"
                  />
                  {/* Google Places indicator */}
                  {property.googlePlace && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Google
                    </div>
                  )}
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {property.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{property.address}</span>
                        </div>
                      </div>
                      {!property.googlePlace && !property.isSearchingPlace && (
                        <button
                          onClick={() => searchGooglePlace(property)}
                          className="ml-2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Find on Google Places"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      )}
                      {property.isSearchingPlace && (
                        <div className="ml-2 p-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        </div>
                      )}
                    </div>

                    {/* Google Places info */}
                    {property.googlePlace && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800">
                            Google Places Match
                          </span>
                          {property.googlePlace.placeId && (
                            <Link
                              href={`/places/${property.googlePlace.placeId}`}
                              className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
                            >
                              View Details
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                        <div className="text-sm text-green-700">
                          {property.googlePlace.name && (
                            <p className="font-medium">
                              {property.googlePlace.name}
                            </p>
                          )}
                          {property.googlePlace.rating && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>
                                  {property.googlePlace.rating.toFixed(1)}
                                </span>
                              </div>
                              {property.googlePlace.reviewCount && (
                                <span className="text-xs">
                                  ({property.googlePlace.reviewCount} Google
                                  reviews)
                                </span>
                              )}
                            </div>
                          )}
                          {property.googlePlace.types &&
                            property.googlePlace.types.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {property.googlePlace.types
                                  .slice(0, 2)
                                  .map((type) => (
                                    <Badge
                                      key={type}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {type.replace(/_/g, " ")}
                                    </Badge>
                                  ))}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Guests</span>
                      <p className="font-semibold">{property.maxGuests}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Bedrooms</span>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Price/night</span>
                      <p className="font-semibold">£{property.pricePerNight}</p>
                    </div>
                  </div>

                  {/* Review Stats - Hostaway Only */}
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Hostaway Reviews
                    </h4>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {stats.averageRating > 0 ? (
                          <StarRating rating={stats.averageRating} size="sm" />
                        ) : (
                          <span className="text-sm text-gray-500">
                            No reviews yet
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {stats.totalReviews}{" "}
                        {stats.totalReviews === 1 ? "review" : "reviews"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {stats.publicReviews} Public
                      </Badge>
                      {stats.totalReviews - stats.publicReviews > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {stats.totalReviews - stats.publicReviews} Private
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/property/${property.id}`}
                      className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Property
                    </Link>
                    <Link
                      href={`/dashboard?property=${property.name}`}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}

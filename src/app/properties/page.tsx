"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NormalizedReview } from "@/types/reviews";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Users, Star, Eye, Calendar, BarChart3 } from "lucide-react";

// Mock properties data
const mockProperties = [
  {
    id: "2b_n1_a",
    name: "2B N1 A - 29 Shoreditch Heights",
    address: "29 Shoreditch High Street, London E1 6PN",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    maxGuests: 4,
    bedrooms: 2,
    pricePerNight: 180,
  },
  {
    id: "1b_s2_b",
    name: "1B S2 B - 15 Canary Wharf Luxury",
    address: "15 South Quay, London E14 9SH",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    maxGuests: 2,
    bedrooms: 1,
    pricePerNight: 220,
  },
  {
    id: "3b_w1_c",
    name: "3B W1 C - 42 Notting Hill Garden",
    address: "42 Ladbroke Grove, London W11 2PB",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
    maxGuests: 6,
    bedrooms: 3,
    pricePerNight: 320,
  },
  {
    id: "2b_ec1_d",
    name: "2B EC1 D - 8 City Financial District",
    address: "8 Moorgate, London EC2R 6EA",
    image:
      "https://images.unsplash.com/photo-1515263487990-61b07816b924?w=400&h=300&fit=crop",
    maxGuests: 4,
    bedrooms: 2,
    pricePerNight: 280,
  },
  {
    id: "1b_e2_e",
    name: "1B E2 E - 23 Brick Lane Modern",
    address: "23 Brick Lane, London E1 6QL",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
    maxGuests: 2,
    bedrooms: 1,
    pricePerNight: 150,
  },
];

export default function PropertiesPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 mt-1">
              View and manage all Flex Living properties
            </p>
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
                  {mockProperties.length}
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
          {mockProperties.map((property) => {
            const stats = getPropertyStats(property.id);

            return (
              <div
                key={property.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Property Image */}
                <div className="aspect-w-16 aspect-h-10">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{property.address}</span>
                    </div>
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

                  {/* Review Stats */}
                  <div className="border-t border-gray-100 pt-4 mb-4">
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

"use client";

import { useState, useEffect } from "react";
import { NormalizedReview } from "@/types/reviews";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import {
  MapPin,
  Wifi,
  Car,
  Coffee,
  Users,
  Star,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// Mock property data (in a real app, this would come from an API)
const mockProperty = {
  id: "2b_n1_a",
  name: "2B N1 A - 29 Shoreditch Heights",
  description:
    "A stunning 2-bedroom apartment in the heart of Shoreditch. This modern flat features contemporary design, high-end amenities, and is perfectly located for exploring London's vibrant East End.",
  images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
  ],
  address: "29 Shoreditch High Street, London E1 6PN",
  pricePerNight: 180,
  maxGuests: 4,
  bedrooms: 2,
  bathrooms: 1,
  amenities: [
    { icon: Wifi, name: "Free WiFi" },
    { icon: Coffee, name: "Kitchen" },
    { icon: Car, name: "Parking" },
    { icon: Users, name: "Workspace" },
  ],
  highlights: [
    "Prime Shoreditch location",
    "Modern furnishings",
    "High-speed internet",
    "Fully equipped kitchen",
    "Close to transport links",
  ],
};

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchPublicReviews();
  }, [params.id]);

  const fetchPublicReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reviews/manage");
      const data = await response.json();

      if (data.success) {
        // Filter for this property and only public reviews
        const propertyReviews = data.data.filter(
          (review: NormalizedReview) =>
            review.propertyId === params.id &&
            review.isPublic &&
            review.isApproved
        );
        setReviews(propertyReviews);
      }
    } catch (error) {
      console.error("Failed to fetch public reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">
              Property Details
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-10 rounded-lg overflow-hidden">
              <img
                src={mockProperty.images[selectedImage]}
                alt={mockProperty.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {mockProperty.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-16 aspect-h-10 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${mockProperty.name} ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Property Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mockProperty.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{mockProperty.address}</span>
              </div>

              {/* Rating Summary */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <StarRating rating={averageRating} size="lg" />
                  <span className="text-gray-600">
                    ({reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-gray-600">Guests</span>
                  <p className="font-semibold">{mockProperty.maxGuests}</p>
                </div>
                <div>
                  <span className="text-gray-600">Bedrooms</span>
                  <p className="font-semibold">{mockProperty.bedrooms}</p>
                </div>
                <div>
                  <span className="text-gray-600">Bathrooms</span>
                  <p className="font-semibold">{mockProperty.bathrooms}</p>
                </div>
                <div>
                  <span className="text-gray-600">Price/night</span>
                  <p className="font-semibold">£{mockProperty.pricePerNight}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {mockProperty.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <amenity.icon className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About this property
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {mockProperty.description}
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Property highlights
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mockProperty.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 pt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Guest Reviews
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={averageRating} size="md" />
                  <span className="text-gray-600">
                    Based on {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600">
                Be the first to leave a review for this property.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showActions={false}
                  className="border-0 shadow-sm"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

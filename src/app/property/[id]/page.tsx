"use client";

import { useState, useEffect } from "react";
import { NormalizedReview } from "@/types/reviews";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { getPropertyById, Property } from "@/lib/propertiesData";
import {
  Users,
  Clock,
  Shield,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkInDate, setCheckInDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    // Get property data from centralized source
    const propertyData = getPropertyById(params.id);
    setProperty(propertyData || null);

    fetchPublicReviews();
  }, [params.id]);

  const fetchPublicReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reviews/manage");
      const data = await response.json();

      if (data.success) {
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

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-600">
            The requested property could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full h-full text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery - Full Width with Increased Height */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full lg:h-[60vh]">
            {/* Main Image */}
            <div className="col-span-1">
              <div className="h-80 lg:h-full rounded-lg overflow-hidden">
                <img
                  src={property.images[selectedImage]}
                  alt={property.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 h-32 lg:h-full">
              {property.images.slice(1, 5).map((image, index) => (
                <button
                  key={index + 1}
                  onClick={() => setSelectedImage(index + 1)}
                  className={`rounded-lg overflow-hidden border-2 h-full ${
                    selectedImage === index + 1
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.name} ${index + 2}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
              {property.images.length > 5 && (
                <div className="rounded-lg bg-gray-900 bg-opacity-80 flex items-center justify-center cursor-pointer relative h-full">
                  <img
                    src={property.images[4]}
                    alt="More images"
                    className="w-full h-full object-cover rounded-lg absolute inset-0 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium text-xs lg:text-sm">
                      View all
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {property.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {property.guests} guests
                </span>
                <span className="flex items-center gap-1">
                  {property.bedrooms} bedroom
                  {property.bedrooms !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  {property.beds} bed
                  {property.beds !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  {property.bathrooms} bathroom
                  {property.bathrooms !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* About this property */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About this property
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {property.description}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {property.secondaryDescription}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Amenities
                </h2>
                <button className="text-blue-600 text-sm hover:underline">
                  View all amenities →
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {property.amenities.slice(0, 9).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <amenity.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stay Policies */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Stay Policies
              </h2>

              {/* Check-in & Check-out */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">
                    Check-in & Check-out
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Check-in after</span>
                    <p className="font-medium">3:00 PM</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-out before</span>
                    <p className="font-medium">10:00 AM</p>
                  </div>
                </div>
              </div>

              {/* House Rules */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">House Rules</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>No smoking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>No pets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>No parties or events</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Security deposit required</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">
                    Cancellation Policy
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>
                    <strong>For stays less than 28 days</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Full refund up to 5 days before check-in</li>
                      <li>
                        • No refund for bookings less than 5 days before
                        check-in
                      </li>
                    </ul>
                  </div>
                  <div>
                    <strong>For stays of 28 days or more</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Full refund up to 30 days before check-in</li>
                      <li>
                        • No refund for bookings less than 30 days before
                        check-in
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    Book your stay
                  </div>
                  <div className="text-sm text-gray-600">
                    Select dates to see the total price
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gray-300 rounded-lg p-3">
                      <label className="text-xs text-gray-600 block mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full text-sm focus:outline-none"
                      />
                    </div>
                    <div className="border border-gray-300 rounded-lg p-3">
                      <label className="text-xs text-gray-600 block mb-1">
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="border border-gray-300 rounded-lg p-3">
                    <label className="text-xs text-gray-600 block mb-1">
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full text-sm focus:outline-none"
                    >
                      {Array.from(
                        { length: property.maxGuests },
                        (_, i) => i + 1
                      ).map((num) => (
                        <option key={num} value={num}>
                          {num} guest{num !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Booking Actions */}
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Book your stay
                  </button>
                  <button className="w-full bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    Check availability
                  </button>
                  <button className="w-full text-blue-600 font-medium py-2 hover:underline">
                    Send inquiry
                  </button>
                </div>

                <div className="mt-4 text-center text-xs text-gray-500">
                  Instant confirmation
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Guest Reviews
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { NormalizedReview, ReviewAnalytics } from "@/types/reviews";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { StarRating } from "@/components/ui/StarRating";
import toast from "react-hot-toast";
import {
  Filter,
  Search,
  Download,
  Eye,
  CheckCircle,
  Users,
  Star,
} from "lucide-react";

export default function ManagerDashboard() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showGoogleImport, setShowGoogleImport] = useState(false);
  const [googleImportLoading, setGoogleImportLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedProperty) params.append("property", selectedProperty);
      if (selectedRating) params.append("rating", selectedRating);
      if (selectedStatus) params.append("status", selectedStatus);

      // Fetch from manage endpoint to get persisted states
      const response = await fetch(`/api/reviews/manage?${params}`);
      const data = await response.json();

      if (data.success) {
        // Handle different response structures
        let reviewsList = [];
        if (data.reviews) {
          reviewsList = data.reviews;
        } else if (data.data && Array.isArray(data.data)) {
          reviewsList = data.data;
        } else if (data.data && data.data.reviews) {
          reviewsList = data.data.reviews;
        }

        // Apply client-side filtering since API might not support all filters
        let filteredReviews = reviewsList;

        // Filter by property
        if (selectedProperty) {
          filteredReviews = filteredReviews.filter(
            (review: NormalizedReview) =>
              review.propertyName === selectedProperty
          );
        }

        // Filter by rating
        if (selectedRating) {
          const minRating = parseInt(selectedRating);
          filteredReviews = filteredReviews.filter(
            (review: NormalizedReview) => review.rating >= minRating
          );
        }

        // Filter by status
        if (selectedStatus) {
          if (selectedStatus === "approved") {
            filteredReviews = filteredReviews.filter(
              (review: NormalizedReview) => review.isApproved === true
            );
          } else if (selectedStatus === "pending") {
            filteredReviews = filteredReviews.filter(
              (review: NormalizedReview) =>
                review.isApproved === false || review.isApproved === undefined
            );
          }
        }

        setReviews(filteredReviews);

        // Generate analytics from filtered reviews
        if (data.analytics) {
          setAnalytics(data.analytics);
        } else {
          const totalReviews = filteredReviews.length;
          const averageRating =
            totalReviews > 0
              ? filteredReviews.reduce(
                  (sum: number, r: NormalizedReview) => sum + r.rating,
                  0
                ) / totalReviews
              : 0;

          setAnalytics({
            totalReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingDistribution: {},
            categoryAverages: {},
            trendsOverTime: [],
            topIssues: [],
            bestPerformingProperties: [],
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedProperty, selectedRating, selectedStatus]);

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch("/api/reviews/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, isApproved: true }),
      });

      const data = await response.json();

      if (data.success) {
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId ? { ...review, isApproved: true } : review
          )
        );
        toast.success("Review approved successfully!");
      } else {
        console.error("Failed to approve review:", data.error);
        toast.error("Failed to approve review. Please try again.");
      }
    } catch (error) {
      console.error("Failed to approve review:", error);
      toast.error("Failed to approve review. Please try again.");
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      const response = await fetch("/api/reviews/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, isApproved: false }),
      });

      const data = await response.json();

      if (data.success) {
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId ? { ...review, isApproved: false } : review
          )
        );
        toast.success("Review rejected successfully!");
      } else {
        console.error("Failed to reject review:", data.error);
        toast.error("Failed to reject review. Please try again.");
      }
    } catch (error) {
      console.error("Failed to reject review:", error);
      toast.error("Failed to reject review. Please try again.");
    }
  };

  const handleTogglePublic = async (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;

    try {
      const response = await fetch("/api/reviews/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId,
          isPublic: !review.isPublic,
          isApproved: review.isApproved,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, isPublic: !r.isPublic } : r
          )
        );
        toast.success(
          `Review ${
            !review.isPublic ? "made public" : "made private"
          } successfully!`
        );
      } else {
        console.error("Failed to toggle public status:", data.error);
        toast.error("Failed to update review status. Please try again.");
      }
    } catch (error) {
      console.error("Failed to toggle public status:", error);
      toast.error("Failed to update review status. Please try again.");
    }
  };

  const handleImportGoogleReviews = async () => {
    setGoogleImportLoading(true);
    const importPromise = new Promise(async (resolve, reject) => {
      try {
        // Get all unique properties from current reviews
        const properties = Array.from(
          new Set(
            reviews.map((r) => ({
              name: r.propertyName,
              id: r.propertyId,
            }))
          )
        );

        let importedCount = 0;

        for (const property of properties) {
          try {
            const response = await fetch(
              `/api/reviews/google?property=${encodeURIComponent(
                property.name
              )}&address=London, UK`
            );
            const data = await response.json();

            if (data.success && data.data.reviews.length > 0) {
              importedCount += data.data.reviews.length;
            }
          } catch (error) {
            console.warn(
              `Failed to import Google reviews for ${property.name}:`,
              error
            );
          }
        }

        if (importedCount > 0) {
          resolve(`Successfully imported ${importedCount} Google reviews!`);
        } else {
          reject(new Error("No Google reviews found for your properties."));
        }
      } catch (error) {
        reject(error);
      } finally {
        setGoogleImportLoading(false);
      }
    });

    toast.promise(importPromise, {
      loading: "Importing Google reviews...",
      success: (message) => message as string,
      error: (err) =>
        err.message || "Failed to import Google reviews. Please try again.",
    });
  };

  const filteredReviews = reviews.filter((review) => {
    // Search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        review.guestName?.toLowerCase().includes(query) ||
        review.propertyName?.toLowerCase().includes(query) ||
        review.comment?.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    return true;
  });

  // Generate unique properties from all reviews (not just filtered ones)
  const [allReviews, setAllReviews] = useState<NormalizedReview[]>([]);

  const fetchAllReviews = useCallback(async () => {
    // Fetch all reviews for dropdown options
    const response = await fetch("/api/reviews/manage");
    const data = await response.json();

    if (data.success) {
      let reviewsList = [];
      if (data.reviews) {
        reviewsList = data.reviews;
      } else if (data.data && Array.isArray(data.data)) {
        reviewsList = data.data;
      } else if (data.data && data.data.reviews) {
        reviewsList = data.data.reviews;
      }
      setAllReviews(reviewsList);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  const uniqueProperties = Array.from(
    new Set(allReviews.map((r) => r.propertyName).filter(Boolean))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Reviews Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor guest reviews across all properties
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allReviews.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {allReviews.length > 0
                        ? (
                            allReviews.reduce((sum, r) => sum + r.rating, 0) /
                            allReviews.length
                          ).toFixed(1)
                        : "0.0"}
                    </p>
                    <StarRating
                      rating={
                        allReviews.length > 0
                          ? allReviews.reduce((sum, r) => sum + r.rating, 0) /
                            allReviews.length
                          : 0
                      }
                      size="sm"
                      showNumber={false}
                    />
                  </div>
                </div>
                <Star className="w-8 h-8 text-amber-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved Reviews</p>
                  <p className="text-2xl font-bold text-green-600">
                    {allReviews.filter((r) => r.isApproved).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Public Reviews</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      allReviews.filter((r) => r.isPublic && r.isApproved)
                        .length
                    }
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews, guests, or properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Google Reviews Import */}
            <button
              onClick={handleImportGoogleReviews}
              disabled={googleImportLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleImportLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  Import Google Reviews
                </>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Properties</option>
                  {uniqueProperties.map((property) => (
                    <option key={property} value={property}>
                      {property}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Rating
                </label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Google Reviews Import */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Google Reviews Import
            </h2>
            <button
              onClick={() => setShowGoogleImport(!showGoogleImport)}
              className="text-blue-600 hover:underline"
            >
              {showGoogleImport ? "Hide" : "Show"} Instructions
            </button>
          </div>

          {showGoogleImport && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Import reviews from Google for your properties. Ensure the
                property names match exactly.
              </p>
              <button
                onClick={handleImportGoogleReviews}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={googleImportLoading}
              >
                {googleImportLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Import Google Reviews
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">
                No reviews found matching your criteria.
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                showActions={true}
                onApprove={handleApprove}
                onReject={handleReject}
                onTogglePublic={handleTogglePublic}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

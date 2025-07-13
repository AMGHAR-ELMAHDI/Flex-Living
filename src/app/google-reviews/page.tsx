"use client";

import { useEffect, useState } from "react";
import { NormalizedReview } from "@/types/reviews";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { Badge } from "@/components/ui/Badge";
import { googleReviewsFindings } from "@/lib/googleReviews";
import toast from "react-hot-toast";
import {
  Search,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
} from "lucide-react";

export default function GoogleReviewsPage() {
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<
    "checking" | "available" | "unavailable"
  >("checking");

  // Check API availability on component mount
  useEffect(() => {
    checkApiAvailability();
  }, []);

  const checkApiAvailability = async () => {
    try {
      const response = await fetch("/api/reviews/google?exploratory=true");
      const data = await response.json();

      if (data.success && data.data.test_available) {
        setApiStatus("available");
      } else {
        setApiStatus("unavailable");
        setError("Google Places API key not configured or invalid");
      }
    } catch (error) {
      setApiStatus("unavailable");
      setError("Failed to check API availability");
      console.error("API availability check failed:", error);
    }
  };

  const handleSearch = async () => {
    if (!propertyName.trim()) {
      toast.error("Please enter a property name");
      return;
    }

    setLoading(true);
    setError(null);
    setReviews([]);

    const searchPromise = new Promise(async (resolve, reject) => {
      try {
        const params = new URLSearchParams({
          property: propertyName,
          ...(propertyAddress && { address: propertyAddress }),
        });

        const response = await fetch(`/api/reviews/google?${params}`);
        const data = await response.json();

        if (data.success) {
          setReviews(data.data.reviews);
          if (data.data.reviews.length === 0) {
            reject(
              new Error(
                "No reviews found for this property. Try adjusting the property name or address."
              )
            );
          } else {
            resolve(`Found ${data.data.reviews.length} reviews!`);
          }
        } else {
          reject(new Error(data.message || "Failed to fetch Google reviews"));
        }
      } catch (error) {
        reject(
          new Error(
            "Failed to fetch Google reviews. Please check your internet connection."
          )
        );
      } finally {
        setLoading(false);
      }
    });

    toast.promise(searchPromise, {
      loading: "Searching for reviews...",
      success: (message) => message as string,
      error: (err) => err.message,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className=" bg-gray-50 text-black  w-full min-h-screen h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Google Reviews Integration
            </h1>
            <p className="text-gray-600 mt-1">
              Test and explore Google Places API integration
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Status */}
        <div className="mb-8">
          <div
            className={`p-4 rounded-lg border ${
              apiStatus === "available"
                ? "bg-green-50 border-green-200"
                : apiStatus === "unavailable"
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {apiStatus === "checking" && (
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              )}
              {apiStatus === "available" && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {apiStatus === "unavailable" && (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}

              <span className="font-medium">
                {apiStatus === "checking" && "Checking API availability..."}
                {apiStatus === "available" &&
                  "Google Places API is configured and ready"}
                {apiStatus === "unavailable" &&
                  "Google Places API not available"}
              </span>
            </div>

            {error && apiStatus === "unavailable" && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
        </div>

        {/* Integration Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Google Reviews Integration
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  This integration uses the Google Places API to fetch reviews
                  for your properties. You can search by property name and
                  optionally include the address for better matching.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Returns up to 5 most recent reviews per property</li>
                  <li>Includes reviewer name, rating, comment, and date</li>
                  <li>Works best with exact property names or addresses</li>
                  <li>
                    Reviews are automatically marked as approved (since
                    they&apos;re already public)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Search Google Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Shoreditch Heights, Canary Wharf Luxury"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={apiStatus !== "available"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Address (Optional)
              </label>
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., London, UK or specific address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={apiStatus !== "available"}
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={
              loading || apiStatus !== "available" || !propertyName.trim()
            }
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Reviews
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && apiStatus === "available" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Results */}
        {reviews.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Google Reviews Results
              </h2>
              <Badge variant="secondary">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""} found
              </Badge>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showActions={false}
                  className="border shadow-sm"
                />
              ))}
            </div>

            {/* Integration Instructions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  To integrate these Google Reviews into your main dashboard:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>
                    Reviews can be imported into the main review management
                    system
                  </li>
                  <li>Apply the same approval workflow as Hostaway reviews</li>
                  <li>Set up automatic syncing for regular updates</li>
                  <li>Configure caching to reduce API calls and costs</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Integration Findings */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Integration Analysis & Recommendations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Feasibility</h3>
              <Badge variant="default" className="mb-3">
                {googleReviewsFindings.feasibility}
              </Badge>

              <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {googleReviewsFindings.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Limitations</h4>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                {googleReviewsFindings.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    {limitation}
                  </li>
                ))}
              </ul>

              <h4 className="font-medium text-gray-900 mb-2">
                Recommendations
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {googleReviewsFindings.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">
              API Implementation Details
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>API Used:</strong>{" "}
                {googleReviewsFindings.implementation.apiUsed}
              </p>
              <p>
                <strong>Endpoints:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                {googleReviewsFindings.implementation.endpoints.map(
                  (endpoint, index) => (
                    <li key={index}>{endpoint}</li>
                  )
                )}
              </ul>
              <p>
                <strong>Cost Model:</strong>{" "}
                {googleReviewsFindings.implementation.costs}
              </p>
            </div>
          </div>
        </div>

        {/* Sample Properties for Testing */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Sample Properties for Testing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "The Shard", address: "London, UK" },
              { name: "Tower Bridge", address: "London, UK" },
              { name: "British Museum", address: "London, UK" },
              { name: "Covent Garden", address: "London, UK" },
            ].map((property, index) => (
              <button
                key={index}
                onClick={() => {
                  setPropertyName(property.name);
                  setPropertyAddress(property.address);
                }}
                className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={apiStatus !== "available"}
              >
                <div className="font-medium text-gray-900">{property.name}</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {property.address}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Click on any sample property to populate the search form and test
            the integration.
          </p>
        </div>
      </div>
    </div>
  );
}

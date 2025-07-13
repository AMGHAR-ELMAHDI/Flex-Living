"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Star,
  ExternalLink,
  Loader2,
  Building,
  Clock,
  DollarSign,
  Users,
  Plus,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface GooglePlace {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  reviewCount?: number;
  types: string[];
  photos?: Array<{
    reference: string;
    width: number;
    height: number;
  }>;
  priceLevel?: number;
  isOpen?: boolean;
}

interface SearchResult {
  places: GooglePlace[];
  total: number;
  nextPageToken?: string;
  query: string;
  searchType: string;
}

export default function PlacesSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("lodging");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("1000");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());

  const searchTypes = [
    { value: "lodging", label: "Hotels & Accommodation", icon: Building },
    { value: "restaurant", label: "Restaurants", icon: Users },
    { value: "tourist_attraction", label: "Tourist Attractions", icon: MapPin },
    { value: "establishment", label: "All Businesses", icon: Building },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        type: searchType,
        radius,
      });

      if (location.trim()) {
        params.append("location", location);
      }

      const response = await fetch(`/api/places/search?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to search places");
      }

      setResults(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const togglePlaceSelection = (placeId: string) => {
    const newSelection = new Set(selectedPlaces);
    if (newSelection.has(placeId)) {
      newSelection.delete(placeId);
    } else {
      newSelection.add(placeId);
    }
    setSelectedPlaces(newSelection);
  };

  const getPhotoUrl = (photoReference: string, maxWidth = 300) => {
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

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      lodging: "bg-blue-100 text-blue-800",
      restaurant: "bg-green-100 text-green-800",
      tourist_attraction: "bg-purple-100 text-purple-800",
      establishment: "bg-gray-100 text-gray-800",
    };
    return colorMap[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className=" text-black bg-white w-full min-h-screen h-full">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Places Search
          </h1>
          <p className="text-gray-600 mb-8">
            Find and explore actual places using Google Places API. Perfect for
            discovering properties, restaurants, and attractions.
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Query
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., 'London hotels', 'restaurants near me'"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {searchTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius (m)
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="500">500m</option>
                  <option value="1000">1km</option>
                  <option value="5000">5km</option>
                  <option value="10000">10km</option>
                  <option value="50000">50km</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., 'London, UK' or '51.5074,-0.1278'"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? "Searching..." : "Search Places"}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium">Search Error</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Found {results.total} places for &ldquo;{results.query}
                    &rdquo;
                  </span>
                  {selectedPlaces.size > 0 && (
                    <Badge variant="default">
                      {selectedPlaces.size} selected
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.places.map((place) => (
                  <div
                    key={place.id}
                    className={`bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                      selectedPlaces.has(place.id)
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Place Image */}
                    {place.photos && place.photos.length > 0 && (
                      <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                        <Image
                          src={getPhotoUrl(place.photos[0].reference, 400)}
                          alt={place.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => togglePlaceSelection(place.id)}
                            className={`p-2 rounded-full transition-colors ${
                              selectedPlaces.has(place.id)
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {selectedPlaces.has(place.id) ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                          {place.name}
                        </h3>
                        {!place.photos && (
                          <button
                            onClick={() => togglePlaceSelection(place.id)}
                            className={`p-1 rounded transition-colors ${
                              selectedPlaces.has(place.id)
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            {selectedPlaces.has(place.id) ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-2">
                          {place.address}
                        </span>
                      </div>

                      {/* Rating and Reviews */}
                      {place.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                              {place.rating.toFixed(1)}
                            </span>
                          </div>
                          {place.reviewCount && (
                            <span className="text-sm text-gray-600">
                              ({place.reviewCount.toLocaleString()} reviews)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Place Types */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {place.types.slice(0, 3).map((type) => (
                          <Badge
                            key={type}
                            variant="secondary"
                            className={`text-xs ${getTypeColor(type)}`}
                          >
                            {type.replace(/_/g, " ")}
                          </Badge>
                        ))}
                        {place.types.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{place.types.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        {place.priceLevel && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{getPriceLevelText(place.priceLevel)}</span>
                          </div>
                        )}
                        {place.isOpen !== undefined && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span
                              className={
                                place.isOpen ? "text-green-600" : "text-red-600"
                              }
                            >
                              {place.isOpen ? "Open" : "Closed"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                        <Link
                          href={`/places/${place.id}`}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <Star className="h-3 w-3" />
                          View Details
                        </Link>
                        <a
                          href={`https://www.google.com/maps/place/?q=place_id:${place.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {results.places.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No places found for your search. Try adjusting your query or
                  search criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

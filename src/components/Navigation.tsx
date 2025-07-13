import Link from "next/link";
import {
  Building2,
  BarChart3,
  Settings,
  User,
  Star,
  MapPin,
} from "lucide-react";

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Flex Living</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Link>

            <Link
              href="/properties"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Properties
            </Link>

            <Link
              href="/google-reviews"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Star className="w-4 h-4" />
              Google Reviews
            </Link>

            <Link
              href="/places"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Places Search
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

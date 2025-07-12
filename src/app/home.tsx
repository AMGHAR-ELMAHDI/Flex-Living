import Link from "next/link";
import {
  BarChart3,
  Building2,
  Star,
  Users,
  Eye,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Reviews Dashboard
              <span className="block text-blue-600">for Flex Living</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Manage and monitor guest reviews across all properties. Make
              data-driven decisions to improve guest satisfaction and showcase
              your best reviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                Open Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/property/2b_n1_a"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors"
              >
                <Building2 className="w-5 h-5" />
                View Sample Property
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage reviews
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive dashboard helps you stay on top of guest
              feedback and showcase your properties at their best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analytics & Insights
              </h3>
              <p className="text-gray-600">
                Track performance with detailed analytics, rating trends, and
                guest satisfaction metrics across all properties.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Review Management
              </h3>
              <p className="text-gray-600">
                Approve, reject, and manage which reviews appear on your public
                property pages with a simple interface.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Multi-Channel Integration
              </h3>
              <p className="text-gray-600">
                Aggregate reviews from Hostaway, Google Reviews, and other
                platforms in one unified dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
              <div className="text-gray-600">Total Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">4.4</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-gray-600">Properties</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                100%
              </div>
              <div className="text-gray-600">Response Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to optimize your guest reviews?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start managing your reviews more effectively with our comprehensive
            dashboard.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

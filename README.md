# Flex Living - Reviews Dashboard

A comprehensive reviews management dashboard for Flex Living properties, integrating with Hostaway API and providing tools for managers to assess property performance, manage guest reviews, and control which reviews appear on public property pages.

## 🚀 Features

### 1. Manager Dashboard

- **Analytics Overview**: Track total reviews, average ratings, approval status, and public visibility
- **Review Management**: Approve, reject, and toggle public visibility of reviews
- **Filtering & Search**: Filter by property, rating, status, and search across review content
- **Real-time Updates**: Live updates when review statuses change

### 2. Property Display Pages

- **Public Review Display**: Show only approved and public reviews on property pages
- **Property Information**: Complete property details with images, amenities, and pricing
- **Review Integration**: Seamlessly integrated review section matching Flex Living design aesthetic

### 3. Multi-Channel Integration

- **Hostaway Integration**: Full integration with Hostaway Reviews API
- **Google Places API**: Complete integration with Google Places for finding properties and importing reviews
- **Places Search**: Advanced search functionality for finding hotels, restaurants, and attractions
- **Real Photos & Reviews**: Access to actual Google Photos and customer reviews
- **Normalized Data Structure**: Consistent review format across all sources

### 4. Google Places Features

- **Places Search**: Find any business or property using Google's comprehensive database
- **Detailed Information**: Access photos, contact details, opening hours, and pricing information
- **Live Reviews**: Import and display actual Google reviews with full metadata
- **Location Intelligence**: Search by location, radius, and business type
- **Visual Interface**: Modern UI for browsing and selecting places

### 5. Review Analytics

- **Performance Metrics**: Average ratings, review distribution, and trends over time
- **Category Analysis**: Breakdown by review categories (cleanliness, communication, etc.)
- **Property Comparison**: Compare performance across different properties

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API Routes
- **Data**: Mock data with real Hostaway API structure
- **Icons**: Lucide React
- **Utilities**: date-fns, clsx, tailwind-merge

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone and Install

```bash
git clone <repository-url>
cd Flex-Living
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Hostaway API Configuration
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
HOSTAWAY_ACCOUNT_ID=61148

# Google Places API Configuration (Required for Places features)
GOOGLE_PLACES_API_KEY=AIzaSyDg8vivvEluPVSnoBO8OyC51H9BIcEYnD0
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🏗 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── reviews/
│   │   │   ├── hostaway/route.ts    # Hostaway API integration
│   │   │   ├── manage/route.ts      # Review management API
│   │   │   └── google/route.ts      # Google Reviews API
│   │   └── places/
│   │       ├── search/route.ts      # Places search API
│   │       ├── details/route.ts     # Place details API
│   │       └── photo/route.ts       # Place photos API
│   ├── dashboard/page.tsx           # Manager dashboard
│   ├── properties/page.tsx          # Properties listing
│   ├── property/[id]/page.tsx       # Individual property pages
│   ├── places/
│   │   ├── page.tsx                 # Places search interface
│   │   └── [place_id]/page.tsx      # Place details page
│   ├── google-reviews/page.tsx      # Google Reviews integration
```

│ └── page.tsx # Home page
├── components/
│ ├── ui/
│ │ ├── StarRating.tsx # Star rating component
│ │ ├── ReviewCard.tsx # Review display component
│ │ └── Badge.tsx # Status badges
│ └── Navigation.tsx # Site navigation
├── lib/
│ ├── hostaway.ts # Hostaway service
│ ├── googleReviews.ts # Google Reviews service (with caching)
│ ├── mockData.ts # Mock review data
│ └── utils.ts # Utility functions
└── types/
└── reviews.ts # TypeScript interfaces

````

## 📱 Application Pages

### Main Navigation

The application includes a comprehensive navigation system with the following pages:

#### 🏠 Dashboard (`/dashboard`)
- **Review Management**: Approve/reject reviews and control public visibility
- **Analytics Overview**: Total reviews, average ratings, and performance metrics
- **Google Reviews Import**: Import reviews from Google Places API
- **Filtering & Search**: Advanced filtering by property, rating, and status

#### 🏢 Properties (`/properties`)
- **Properties Listing**: View all your Hostaway properties
- **Property Cards**: Quick overview with images, ratings, and review counts
- **Direct Navigation**: Click through to individual property pages

#### 🏨 Property Details (`/property/[id]`)
- **Public Property Display**: Customer-facing property pages
- **Property Information**: Complete details with images, amenities, and pricing
- **Public Reviews**: Display only approved and public reviews
- **Star Ratings**: Visual rating display with category breakdowns

#### 🔍 Places Search (`/places`)
- **Google Places Search**: Find any business using Google's database
- **Advanced Filters**: Search by type, location, and radius
- **Visual Results**: Photos, ratings, and business information
- **Place Selection**: Select multiple places for analysis

#### 📍 Place Details (`/places/[place_id]`)
- **Comprehensive Information**: Photos, reviews, contact details, hours
- **Live Google Reviews**: Real customer reviews with full metadata
- **Business Analytics**: Ratings, review counts, and performance data
- **Direct Links**: Google Maps, website, and contact information

#### ⭐ Google Reviews (`/google-reviews`)
- **API Testing Interface**: Test Google Places API integration
- **Property Search**: Find your properties in Google's database
- **Review Import**: Import Google reviews into your system
- **Live Status Checking**: Real-time API availability monitoring

### Mobile Responsiveness

All pages are fully responsive and optimized for:
- **Desktop**: Full-featured interface with advanced filtering
- **Tablet**: Optimized layouts with touch-friendly controls
- **Mobile**: Streamlined interface with priority information

## 🔗 API Endpoints

### GET /api/reviews/hostaway

Fetches and normalizes reviews from Hostaway API with filtering support.

**Query Parameters:**

- `property`: Filter by property name/ID
- `rating`: Minimum rating filter
- `status`: Filter by approval status

**Response:**

```json
{
  "success": true,
  "data": {
    "reviews": [...],
    "analytics": {...},
    "total": 8
  }
}
````

### POST /api/reviews/manage

Manages review approval and public visibility status.

**Request Body:**

```json
{
  "reviewId": "7453",
  "isApproved": true,
  "isPublic": false
}
```

### GET /api/reviews/google

Explores Google Reviews integration capabilities.

**Query Parameters:**

- `property`: Property name to search
- `address`: Property address (optional)
- `exploratory=true`: Returns integration findings

## 🎯 Key Design Decisions

### 1. Data Normalization

- Created unified `NormalizedReview` interface for all review sources
- Converts Hostaway's 10-point category ratings to 5-point scale
- Maintains source attribution while providing consistent experience

### 2. Review Management Workflow

- **Two-tier approval**: Separate `isApproved` and `isPublic` flags
- **Manager control**: Reviews must be explicitly made public
- **Real-time updates**: Immediate UI feedback on status changes

### 3. Mock Data Strategy

- Used realistic mock data based on actual Hostaway API response format
- Provides multiple property types and review scenarios
- Ensures dashboard demonstrates full functionality even with sandbox API

### 4. Component Architecture

- **Reusable components**: StarRating, ReviewCard, Badge components
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🌐 Google Places API Integration

### Current Status: **FULLY IMPLEMENTED** ✅

The application now includes comprehensive Google Places API integration with real-time search and review capabilities.

### 🔥 New Features:

#### 1. Places Search (`/places`)

- **Advanced Search**: Find hotels, restaurants, attractions, and any business
- **Location Filtering**: Search by city, coordinates, or specific areas
- **Type Filtering**: Filter by business category (lodging, restaurant, etc.)
- **Visual Results**: High-quality photos and comprehensive business information
- **Interactive Interface**: Modern, responsive design with easy navigation

#### 2. Place Details (`/places/[place_id]`)

- **Complete Information**: Photos, reviews, contact details, and opening hours
- **Live Google Reviews**: Access actual customer reviews with ratings and timestamps
- **Direct Integration**: Links to Google Maps and business websites
- **Review Analysis**: Full review text with author information and ratings

#### 3. Enhanced Google Reviews (`/google-reviews`)

- **Property Search**: Find your properties in Google's database
- **Review Import**: Import Google reviews into your dashboard
- **Real-time Testing**: Live API status checking and property matching

### API Endpoints:

#### Places Search

```
GET /api/places/search?query=hotels&type=lodging&location=London,UK&radius=5000
```

#### Place Details

```
GET /api/places/details?place_id=ChIJ2WY2cIoFdkgRuKyWxaO5Eys
```

#### Place Photos

```
GET /api/places/photo?reference=photo_ref&maxwidth=400
```

### Setup Requirements:

1. **Google Cloud Project** with Places API enabled ✅
2. **Valid API Key** configured in environment ✅
3. **Billing account** set up for API usage
4. **Appropriate quotas** for your usage needs

### Cost Optimization:

- **24-hour caching** implemented for all API responses
- **Efficient photo serving** with appropriate sizing
- **Error handling** to prevent unnecessary API calls
- **Usage monitoring** recommendations included

### Production Ready:

- ✅ Complete error handling and user feedback
- ✅ Responsive design for all screen sizes
- ✅ Caching implementation for performance
- ✅ Comprehensive documentation and guides
- ✅ Real-time testing interface

## 🚀 Production Deployment

### Environment Setup

1. Set up production environment variables
2. Configure database for persistent review approvals
3. Set up Google Places API if required
4. Configure caching strategy

### Database Schema (Recommended)

```sql
CREATE TABLE review_approvals (
  id SERIAL PRIMARY KEY,
  review_id VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(50) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255)
);
```

### Caching Strategy

- Implement Redis for API response caching
- Cache Hostaway reviews for 1 hour
- Cache Google Places data for 24 hours
- Invalidate cache on review status updates

## 🧪 Testing

### Manual Testing Checklist

- [ ] Dashboard loads with mock data
- [ ] Filtering works correctly
- [ ] Review approval/rejection functions
- [ ] Public/private toggle works
- [ ] Property pages show only approved public reviews
- [ ] Responsive design on mobile devices

### API Testing

```bash
# Test Hostaway integration
curl http://localhost:3000/api/reviews/hostaway

# Test review management
curl -X POST http://localhost:3000/api/reviews/manage \
  -H "Content-Type: application/json" \
  -d '{"reviewId":"7453","isApproved":true,"isPublic":true}'

# Test Google Reviews exploration
curl http://localhost:3000/api/reviews/google?exploratory=true
```

## 📊 Analytics & Insights

The dashboard provides several key metrics:

1. **Total Reviews**: Count across all properties and sources
2. **Average Rating**: Weighted average across all approved reviews
3. **Approval Rate**: Percentage of reviews approved by managers
4. **Public Visibility Rate**: Percentage of approved reviews made public
5. **Category Performance**: Breakdown by review categories
6. **Trend Analysis**: Review quality and quantity over time

## 🔒 Security Considerations

1. **API Key Protection**: Environment variables for sensitive keys
2. **Input Validation**: Sanitize all user inputs
3. **Rate Limiting**: Implement on API endpoints
4. **CORS Configuration**: Restrict origins in production
5. **Error Handling**: Don't expose sensitive information in error messages

## 🤝 Contributing

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive commit messages

### Pull Request Process

1. Create feature branch from main
2. Implement changes with tests
3. Update documentation if needed
4. Submit PR with clear description

## 📄 License

This project is proprietary to Flex Living. All rights reserved.

---

**Built with ❤️ for Flex Living**

For questions or support, please contact the development team.

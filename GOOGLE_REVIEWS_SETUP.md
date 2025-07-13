# Google Reviews Integration Guide

This guide will help you set up and configure Google Reviews integration for the Flex Living Reviews Dashboard.

## 🔧 Setup Requirements

### 1. Google Cloud Project Setup

1. **Create a Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Note your Project ID

2. **Enable Google Places API**

   - In the Google Cloud Console, navigate to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click on "Places API" and click "Enable"

3. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
   - (Optional) Restrict the API key to specific APIs and IP addresses for security

### 2. Environment Configuration

1. **Update Environment Variables**

   - Open your `.env.local` file
   - Add your Google Places API key:

   ```env
   GOOGLE_PLACES_API_KEY=your_actual_api_key_here
   ```

2. **Restart Development Server**
   ```bash
   npm run dev
   ```

## 🧪 Testing the Integration

### 1. Access Google Reviews Page

- Navigate to `http://localhost:3000/google-reviews`
- You should see a green status indicator if the API key is configured correctly

### 2. Test Property Search

Try searching for these sample properties:

- **Property Name**: "The Shard", **Address**: "London, UK"
- **Property Name**: "Tower Bridge", **Address**: "London, UK"
- **Property Name**: "British Museum", **Address**: "London, UK"

### 3. Test Real Properties

Use your actual property names:

- Try exact property names from your listings
- Include "London, UK" in the address field for better matching
- Experiment with different search terms

## 📊 Integration Features

### Current Capabilities

- ✅ **Property Search**: Find Google Places by name and address
- ✅ **Review Fetching**: Get up to 5 most recent reviews per property
- ✅ **Data Normalization**: Convert Google reviews to unified format
- ✅ **Caching**: 24-hour cache to reduce API calls
- ✅ **Error Handling**: Comprehensive error messages and fallbacks
- ✅ **Quota Management**: Rate limiting and quota tracking

### Review Data Structure

Google Reviews provide:

- Reviewer name and profile photo
- 1-5 star rating
- Review text/comment
- Review date and time
- Language and translation info

### Limitations

- **Review Limit**: Maximum 5 reviews per property
- **No Categories**: Unlike Hostaway, no category breakdowns
- **Public Only**: Only public Google reviews are accessible
- **Rate Limits**: API quotas apply (monitor usage in Google Cloud Console)

## 🔄 Integration Workflow

### 1. Manual Import Process

1. **Search Properties**: Use the Google Reviews page to find reviews
2. **Review Results**: Verify the reviews match your property
3. **Import Decision**: Manually decide which reviews to import
4. **Approval Workflow**: Apply same approval process as Hostaway reviews

### 2. Automated Import (Future Enhancement)

```typescript
// Planned functionality
const importAllPropertyReviews = async () => {
  const properties = await getProperties();

  for (const property of properties) {
    const googleReviews = await fetchGoogleReviews(
      property.name,
      property.address
    );

    await saveReviewsToDatabase(googleReviews);
  }
};
```

## 💰 Cost Management

### API Pricing (as of 2024)

- **Find Place from Text**: $17 per 1,000 requests
- **Place Details**: $17 per 1,000 requests
- **Free Tier**: $200 monthly credit (≈11,000 requests)

### Cost Optimization Strategies

1. **Implement Caching**

   ```typescript
   // Current: In-memory cache (24 hours)
   // Production: Use Redis for persistent caching
   ```

2. **Batch Processing**

   - Process multiple properties in scheduled batches
   - Avoid real-time API calls for each user request

3. **Smart Matching**

   - Use exact property names and addresses
   - Implement fuzzy matching to reduce failed searches

4. **Quota Monitoring**
   ```typescript
   // Monitor API usage in Google Cloud Console
   // Set up alerts for quota thresholds
   ```

## 🔐 Security Best Practices

### 1. API Key Security

- ✅ Store API key in environment variables
- ✅ Never commit API keys to version control
- 🔄 Consider IP restrictions for production
- 🔄 Implement API key rotation

### 2. Rate Limiting

```typescript
// Implement rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

### 3. Input Validation

- ✅ Sanitize search queries
- ✅ Validate API responses
- ✅ Handle malformed data gracefully

## 🚀 Production Deployment

### 1. Environment Setup

```env
# Production .env
GOOGLE_PLACES_API_KEY=your_production_api_key
REDIS_URL=your_redis_cache_url
DATABASE_URL=your_database_url
```

### 2. Caching Strategy

```typescript
// Redis implementation for production
import redis from "redis";

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

const getCachedData = async (key: string) => {
  return await client.get(key);
};
```

### 3. Database Integration

```sql
-- Extend reviews table for Google Reviews
ALTER TABLE reviews ADD COLUMN google_place_id VARCHAR(255);
ALTER TABLE reviews ADD COLUMN google_author_url VARCHAR(500);
ALTER TABLE reviews ADD COLUMN google_photo_url VARCHAR(500);
```

## 📈 Monitoring & Analytics

### 1. API Usage Tracking

- Monitor quota usage in Google Cloud Console
- Set up billing alerts
- Track API response times and success rates

### 2. Review Analytics

```typescript
// Track Google Reviews metrics
const analytics = {
  totalGoogleReviews: count,
  averageGoogleRating: average,
  googleVsHostawayComparison: comparison,
  importSuccessRate: percentage,
};
```

### 3. Error Monitoring

- Log API failures and quota exceeded errors
- Monitor property matching success rates
- Track user search patterns

## 🛠 Troubleshooting

### Common Issues

1. **API Key Not Working**

   ```
   Error: Google Places API access forbidden
   ```

   - Verify API key is correct
   - Check if Places API is enabled
   - Ensure billing is set up

2. **No Reviews Found**

   ```
   No reviews found for this property
   ```

   - Try different property name variations
   - Include full address with city
   - Check if property exists on Google Maps

3. **Quota Exceeded**

   ```
   Google Places API quota exceeded
   ```

   - Check usage in Google Cloud Console
   - Implement caching to reduce calls
   - Consider upgrading your quota

4. **Property Not Found**
   ```
   No Google Place found for: Property Name
   ```
   - Verify property name spelling
   - Try including address/location
   - Check if property is listed on Google Maps

### Debug Steps

1. **Check API Key Configuration**

   ```bash
   # Verify environment variable is set
   echo $GOOGLE_PLACES_API_KEY
   ```

2. **Test API Directly**

   ```bash
   curl "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Tower%20Bridge%20London&inputtype=textquery&fields=place_id&key=YOUR_API_KEY"
   ```

3. **Check Console Logs**
   - Open browser dev tools
   - Check for API error messages
   - Look for network request failures

## 📞 Support

### Google Cloud Support

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Key Management](https://console.cloud.google.com/apis/credentials)

### Implementation Support

- Check the `/google-reviews` page for real-time status
- Review console logs for detailed error messages
- Use the sample properties for testing

---

**Ready to get started?** Update your `.env.local` file with your Google Places API key and visit `/google-reviews` to test the integration!

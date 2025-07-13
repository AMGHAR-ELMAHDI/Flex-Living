# Google Places API Integration Guide

## Overview

This guide covers the comprehensive Google Places API integration in your Flex Living Reviews Dashboard. You now have access to powerful place search and review capabilities using real Google Places data.

## Features

### 1. Places Search (`/places`)

- **Text-based search**: Find any place by name, type, or description
- **Location filtering**: Search within specific locations and radii
- **Type filtering**: Filter by lodging, restaurants, attractions, or all businesses
- **Visual results**: See photos, ratings, and key information for each place
- **Place selection**: Select multiple places for bulk operations

### 2. Place Details (`/places/[place_id]`)

- **Comprehensive information**: Full place details including photos, reviews, and contact info
- **Live reviews**: Access actual Google reviews with ratings and text
- **Opening hours**: See current status and weekly schedule
- **Contact details**: Phone numbers, website, and Google Maps links
- **High-quality photos**: Multiple place photos from Google

### 3. Google Reviews Integration (`/google-reviews`)

- **Property search**: Find reviews for your specific properties
- **Review import**: Import Google reviews into your system
- **Real-time data**: Access live review data from Google Places

## API Endpoints

### Places Search

```
GET /api/places/search
```

**Parameters:**

- `query` (required): Search term
- `type`: Place type (lodging, restaurant, tourist_attraction, establishment)
- `location`: Location to search around (optional)
- `radius`: Search radius in meters (500-50000)

**Example:**

```
/api/places/search?query=London hotels&type=lodging&location=London,UK&radius=5000
```

### Place Details

```
GET /api/places/details
```

**Parameters:**

- `place_id` (required): Google Place ID

**Example:**

```
/api/places/details?place_id=ChIJ2WY2cIoFdkgRuKyWxaO5Eys
```

### Place Photos

```
GET /api/places/photo
```

**Parameters:**

- `reference` (required): Photo reference from place data
- `maxwidth`: Maximum width (default: 400)
- `maxheight`: Maximum height (optional)

## Usage Examples

### 1. Finding Your Properties

1. Go to `/places`
2. Search for your property name or location
3. Use type filter "lodging" for accommodation properties
4. Click "View Details" to see comprehensive information
5. Access reviews and contact details

### 2. Competitor Research

1. Search for competitors in your area
2. Review their ratings and customer feedback
3. Analyze their photos and presentation
4. Study their opening hours and pricing level

### 3. Location Analysis

1. Search for attractions near your properties
2. Find restaurants and amenities in the area
3. Assess the local business ecosystem
4. Identify partnership opportunities

## Search Tips

### Effective Queries

- **Specific names**: "Marriott London" or "Tower Bridge Hotel"
- **Location + type**: "restaurants near Covent Garden"
- **Address searches**: "hotels on Oxford Street London"

### Search Types

- **lodging**: Hotels, B&Bs, vacation rentals, hostels
- **restaurant**: All dining establishments
- **tourist_attraction**: Museums, landmarks, entertainment
- **establishment**: All business types

### Location Formats

- **City, Country**: "London, UK"
- **Coordinates**: "51.5074,-0.1278"
- **Specific areas**: "Covent Garden, London"

## Data Structure

### Place Object

```typescript
interface GooglePlace {
  id: string; // Google Place ID
  name: string; // Business name
  address: string; // Formatted address
  location: {
    // GPS coordinates
    lat: number;
    lng: number;
  };
  rating?: number; // Average rating (1-5)
  reviewCount?: number; // Total review count
  types: string[]; // Place categories
  photos?: Array<{
    // Place photos
    reference: string;
    width: number;
    height: number;
  }>;
  priceLevel?: number; // Price level (0-4)
  isOpen?: boolean; // Current open status
}
```

### Review Object

```typescript
interface PlaceReview {
  id: string; // Unique review ID
  author: string; // Reviewer name
  rating: number; // Review rating (1-5)
  text: string; // Review text
  timeDescription: string; // "2 weeks ago"
  date: string; // ISO date string
  language: string; // Review language
  profilePhotoUrl?: string; // Reviewer photo
}
```

## Integration with Your Dashboard

### Import Reviews

1. Find your property using Places Search
2. View the detailed place information
3. Use the "Import Reviews" feature in the dashboard
4. Reviews will be merged with your Hostaway data

### Property Matching

The system attempts to match your Hostaway properties with Google Places using:

- Property name similarity
- Address matching
- Location proximity

### Review Synchronization

- **Manual import**: Use the dashboard import feature
- **Scheduled sync**: Set up regular review imports
- **Conflict resolution**: Handle duplicate reviews intelligently

## Error Handling

### Common Issues

1. **API Key Errors**

   - Ensure Google Places API is enabled
   - Check API key permissions
   - Verify billing is set up

2. **Quota Limits**

   - Monitor API usage in Google Cloud Console
   - Implement caching to reduce requests
   - Consider upgrading quota if needed

3. **No Results**
   - Try broader search terms
   - Increase search radius
   - Check spelling and location format

### Status Codes

- **200**: Success
- **400**: Invalid request parameters
- **403**: API access denied
- **429**: Quota exceeded
- **500**: Server error

## Best Practices

### Performance

- Use appropriate search radius
- Cache frequently accessed place data
- Limit photo size requests
- Implement pagination for large result sets

### Accuracy

- Use specific search terms
- Verify place information manually
- Cross-reference with other data sources
- Handle multiple locations for chain businesses

### Cost Management

- Monitor API usage regularly
- Use caching to minimize requests
- Only request needed data fields
- Implement usage alerts

## Next Steps

1. **Test the integration** with your actual properties
2. **Set up monitoring** for API usage and costs
3. **Train your team** on using the new features
4. **Implement automation** for regular review imports
5. **Monitor performance** and optimize as needed

## Support

For additional help:

- Check the Google Places API documentation
- Review the API usage in Google Cloud Console
- Test with the `/places` search interface
- Use the browser developer tools to debug issues

Your Google Places integration is now fully functional and ready for production use!

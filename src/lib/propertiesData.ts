import {
  Tv,
  Wifi,
  WashingMachine,
  Utensils,
  Wind,
  Thermometer,
  Coffee,
  ShowerHead,
  Cigarette,
} from "lucide-react";

// Property type definitions
export interface PropertyAmenity {
  icon: any;
  name: string;
  category: string;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  secondaryDescription: string;
  images: string[];
  address: string;
  searchQuery: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  pricePerNight: number;
  amenities: PropertyAmenity[];
  maxGuests: number; // Alias for guests for backward compatibility
}

// Centralized properties data
export const PROPERTIES_DATA: Property[] = [
  {
    id: "2b_n1_a",
    name: "2B N1 A - 29 Shoreditch Heights",
    description:
      "This charming studio flat in Paddington offers great amenities for a cozy stay. The bedroom features a comfortable double bed, while the property also includes a bathroom and a fully equipped kitchen.",
    secondaryDescription:
      "This cozy studio property in Paddington offers great amenities for a comfortable stay. The bedroom is furnished to... Read more",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    address: "29 Shoreditch High Street, London E1 6PN",
    searchQuery: "accommodation 29 Shoreditch High Street London",
    guests: 4,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    beds: 2,
    pricePerNight: 180,
    amenities: [
      { icon: Tv, name: "Cable TV", category: "entertainment" },
      { icon: Wifi, name: "Internet", category: "internet" },
      { icon: WashingMachine, name: "Washing Machine", category: "laundry" },
      { icon: Utensils, name: "Kitchen", category: "kitchen" },
      { icon: Wind, name: "Hair Dryer", category: "bathroom" },
      { icon: Thermometer, name: "Heating", category: "climate" },
      { icon: Coffee, name: "Coffee", category: "kitchen" },
      { icon: ShowerHead, name: "Shampoo", category: "bathroom" },
      { icon: Cigarette, name: "Smoke Detector", category: "safety" },
    ],
  },
  {
    id: "1b_s2_b",
    name: "1B S2 B - 15 Canary Wharf Luxury",
    description:
      "Modern 1-bedroom apartment in the heart of Canary Wharf with stunning views of the Thames. Perfect for business travelers and tourists alike.",
    secondaryDescription:
      "This contemporary apartment offers luxury amenities and is perfectly located for exploring London's financial district. Features modern furnishings and high-end facilities.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    address: "15 South Quay, London E14 9SH",
    searchQuery: "apartment 15 South Quay Canary Wharf London",
    guests: 2,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    pricePerNight: 220,
    amenities: [
      { icon: Tv, name: "Cable TV", category: "entertainment" },
      { icon: Wifi, name: "Internet", category: "internet" },
      { icon: Utensils, name: "Kitchen", category: "kitchen" },
      { icon: Wind, name: "Hair Dryer", category: "bathroom" },
      { icon: Thermometer, name: "Heating", category: "climate" },
      { icon: Coffee, name: "Coffee", category: "kitchen" },
    ],
  },
  {
    id: "3b_w1_c",
    name: "3B W1 C - 42 Notting Hill Garden",
    description:
      "Beautiful Victorian house in trendy Notting Hill, walking distance to Portobello Market. This spacious property offers character and modern amenities.",
    secondaryDescription:
      "A stunning period property that combines Victorian charm with contemporary comfort. Perfect for families or groups visiting London.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
    ],
    address: "42 Ladbroke Grove, London W11 2PB",
    searchQuery: "accommodation 42 Ladbroke Grove Notting Hill London",
    guests: 6,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    beds: 3,
    pricePerNight: 320,
    amenities: [
      { icon: Tv, name: "Cable TV", category: "entertainment" },
      { icon: Wifi, name: "Internet", category: "internet" },
      { icon: WashingMachine, name: "Washing Machine", category: "laundry" },
      { icon: Utensils, name: "Kitchen", category: "kitchen" },
      { icon: Thermometer, name: "Heating", category: "climate" },
      { icon: Coffee, name: "Garden", category: "outdoor" },
    ],
  },
  {
    id: "2b_ec1_d",
    name: "2B EC1 D - 8 City Financial District",
    description:
      "Contemporary 2-bedroom apartment in London's financial district. Ideal for business travelers with excellent transport links and modern amenities.",
    secondaryDescription:
      "Perfect for corporate stays with dedicated workspace and premium business amenities. Located in the heart of the City with easy access to major business centers.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    ],
    address: "8 Moorgate, London EC2R 6EA",
    searchQuery: "accommodation 8 Moorgate City London",
    guests: 4,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    beds: 2,
    pricePerNight: 280,
    amenities: [
      { icon: Tv, name: "Cable TV", category: "entertainment" },
      { icon: Wifi, name: "Internet", category: "internet" },
      { icon: Utensils, name: "Kitchen", category: "kitchen" },
      { icon: Wind, name: "Hair Dryer", category: "bathroom" },
      { icon: Thermometer, name: "Heating", category: "climate" },
      { icon: Coffee, name: "Business Amenities", category: "business" },
    ],
  },
  {
    id: "1b_e2_e",
    name: "1B E2 E - 23 Brick Lane Modern",
    description:
      "Trendy 1-bedroom apartment in the vibrant Brick Lane area. Perfect for experiencing London's creative scene with easy access to galleries, markets, and nightlife.",
    secondaryDescription:
      "A stylish modern apartment in one of London's most exciting neighborhoods. Ideal for creative professionals and culture enthusiasts.",
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
    ],
    address: "23 Brick Lane, London E1 6QL",
    searchQuery: "apartment 23 Brick Lane Shoreditch London",
    guests: 2,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    pricePerNight: 150,
    amenities: [
      { icon: Tv, name: "Cable TV", category: "entertainment" },
      { icon: Wifi, name: "Internet", category: "internet" },
      { icon: Utensils, name: "Kitchen", category: "kitchen" },
      { icon: Wind, name: "Hair Dryer", category: "bathroom" },
      { icon: Coffee, name: "Coffee", category: "kitchen" },
    ],
  },
];

// Helper functions
export function getPropertyById(id: string): Property | undefined {
  return PROPERTIES_DATA.find((property) => property.id === id);
}

export function getAllProperties(): Property[] {
  return PROPERTIES_DATA;
}

export function getPropertiesByBedrooms(bedrooms: number): Property[] {
  return PROPERTIES_DATA.filter((property) => property.bedrooms === bedrooms);
}

export function getPropertiesByGuests(guests: number): Property[] {
  return PROPERTIES_DATA.filter((property) => property.maxGuests >= guests);
}

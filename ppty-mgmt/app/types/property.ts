export interface Property {
  id: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  propertyType: 'SINGLE_FAMILY' | 'MULTI_FAMILY' | 'APARTMENT' | 'CONDO';
  price: number;
  rentFrequency: 'MONTHLY' | 'YEARLY';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  features: string[];
  amenities: string[];
  images: string[];
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'UPCOMING';
  availableFrom: Date;
  lastUpdated: Date;
  financials: {
    monthlyRent: number;
    depositAmount: number;
    maintenanceFees: number;
    utilities: boolean;
  };
  units?: number;
  parkingSpots?: number;
  policies: {
    petsAllowed: boolean;
    smokingAllowed: boolean;
    applicationFee?: number;
  };
}

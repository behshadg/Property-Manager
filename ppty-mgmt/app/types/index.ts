export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  type: PropertyType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  status: PropertyStatus;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export type PropertyType = 'HOUSE' | 'APARTMENT' | 'CONDO' | 'TOWNHOUSE';
export type PropertyStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'OFFLINE';

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  leaseStart: Date;
  leaseEnd: Date;
  rentAmount: number;
  status: TenantStatus;
  documents: Document[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  propertyId: string;
  property?: {
    name: string;
  };
  tenantId?: string;
  tenant?: {
    firstName: string;
    lastName: string;
  };
}

export type TenantStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE';
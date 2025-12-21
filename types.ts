
export enum UserType {
  PARKER = 'PARKER',
  PARKEE = 'PARKEE',
  ADMIN = 'ADMIN',
  TEAM = 'TEAM'
}

export enum BookingStatus {
  PENDING = 'Pending',
  ESCROW_AUTHORIZED = 'Escrow_Authorized',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  REFUNDED = 'Refunded',
  DISPUTED = 'Disputed'
}

export enum Language {
  EN_GB = 'EN_GB',
  FR = 'FR',
  ES = 'ES',
  DE = 'DE'
}

export type PropertyCategory = 
  | 'Residential Driveway' 
  | 'Private Gated Estate' 
  | 'Commercial Multi-Storey' 
  | 'Shared Residential Courtyard' 
  | 'Allocated On-Street'
  | 'Underground Garage';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  type: UserType;
  verified: boolean;
  strikes: number;
  isSuspended: boolean;
  isDeleted: boolean; 
  avatar?: string;
  language: Language;
  createdAt: string;
  mfaEnabled: boolean;
  lastActive?: string;
  // Corporate Fields
  isCorporate?: boolean;
  companyName?: string;
  companyId?: string;
  companyRole?: string;
}

export interface PendingAccount {
  code: string;
  email: string;
  name: string;
  type: UserType;
  createdBy: string;
}

export interface ParkingSpace {
  id: string;
  ownerId: string;
  address: string;
  city: string;
  category: PropertyCategory;
  hourlyRate: number;
  capacity: number;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  features: string[];
  photos: string[];
  isVerified: boolean;
  isLive: boolean;
  accessInstructions: string;
  instantBook: boolean;
}

export interface Booking {
  id: string;
  spaceId: string;
  parkerId: string;
  startTime: string;
  endTime: string;
  totalCost: number;
  platformFee: number;
  hostEarnings: number;
  status: BookingStatus;
  stripePaymentIntentId?: string;
  createdAt: string;
  accessCode: string;
  fullAddress: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isFlagged: boolean;
}

export interface FlaggedMessage extends Message {
  reason: string;
  censoredText: string;
  recipientId: string;
}

export interface SystemMessage {
  id: string;
  to: string;
  subject: string;
  body: string;
  code?: string;
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  userId: string;
  targetId?: string;
  reason?: string;
}
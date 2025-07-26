// Admin Dashboard Types and Interfaces

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalAgents: number;
  verifiedAgents: number;
  totalProperties: number;
  activeListings: number;
  totalEvents: number;
  upcomingEvents: number;
  monthlyRevenue: number;
  conversionRate: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;
  status: string;
  joinDate: string;
  lastActive: string;
  savedProperties: number;
  inquiries: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  license: string;
  joinDate: string;
  properties: number;
  sales: number;
  rating: number;
  commission: number;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  status: string;
  agent: string;
  agent_id: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  created_at: string;
  views: number;
  inquiries: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
  attendees: number;
  maxCapacity: number;
  imageUrl?: string;
  price?: number;
  description?: string;
}

export interface Content {
  id: string;
  title: string;
  type: string;
  status: string;
  author: string;
  publishDate: string | null;
  views: number;
  category: string;
}

export interface Role {
  id: string;
  name: string;
}

export type AdminTab = 'overview' | 'users' | 'agents' | 'properties' | 'events' | 'content' | 'settings'; 
// Breakpoints (matching Tailwind config)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Common spacing values
export const SPACING = {
  xs: '0.5rem', // 8px
  sm: '1rem', // 16px
  md: '1.5rem', // 24px
  lg: '2rem', // 32px
  xl: '3rem', // 48px
  '2xl': '4rem', // 64px
  '3xl': '6rem', // 96px
  section: '4rem', // 64px - standard section spacing
} as const;

// Container max widths
export const CONTAINER_WIDTHS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  narrow: '1024px',
  wide: '1536px',
} as const;

// Z-index layers
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
  chat: 1000,
} as const;

// Animation durations
export const ANIMATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '750ms',
} as const;

// Common property types for real estate
export const PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Condo',
  'Townhouse',
  'Duplex',
  'Studio',
  'Loft',
  'Villa',
  'Commercial',
  'Land',
] as const;

// Property status options
export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  SOLD: 'sold',
  RENTED: 'rented',
  OFF_MARKET: 'off_market',
} as const;

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: 'Under $300K', min: 0, max: 300000 },
  { label: '$300K - $500K', min: 300000, max: 500000 },
  { label: '$500K - $750K', min: 500000, max: 750000 },
  { label: '$750K - $1M', min: 750000, max: 1000000 },
  { label: '$1M - $2M', min: 1000000, max: 2000000 },
  { label: 'Over $2M', min: 2000000, max: Infinity },
] as const;

// Bedroom/bathroom options
export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6] as const;
export const BATHROOM_OPTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5] as const;

// Common amenities
export const AMENITIES = [
  'Parking',
  'Swimming Pool',
  'Gym',
  'Garden',
  'Balcony',
  'Fireplace',
  'Air Conditioning',
  'Heating',
  'Laundry',
  'Dishwasher',
  'Walk-in Closet',
  'Hardwood Floors',
  'Updated Kitchen',
  'Pet Friendly',
  'Security System',
] as const;

// Form validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  ZIP_CODE_REGEX: /^\d{5}(-\d{4})?$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_MESSAGE_LENGTH: 500,
  MAX_NAME_LENGTH: 50,
} as const;

// API endpoints (when backend is implemented)
export const API_ENDPOINTS = {
  PROPERTIES: '/api/properties',
  AGENTS: '/api/agents',
  USERS: '/api/users',
  AUTH: '/api/auth',
  SEARCH: '/api/search',
  FAVORITES: '/api/favorites',
  MESSAGES: '/api/messages',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  SEARCH_HISTORY: 'searchHistory',
  RECENT_SEARCHES: 'recentSearches',
  FAVORITES: 'favorites',
  CHAT_HISTORY: 'chatHistory',
  THEME: 'theme',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  NOT_FOUND: 'The requested item was not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROPERTY_SAVED: 'Property saved to favorites',
  MESSAGE_SENT: 'Message sent successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  SEARCH_SAVED: 'Search saved successfully',
} as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type PropertyStatus =
  (typeof PROPERTY_STATUS)[keyof typeof PROPERTY_STATUS];
export type Amenity = (typeof AMENITIES)[number];

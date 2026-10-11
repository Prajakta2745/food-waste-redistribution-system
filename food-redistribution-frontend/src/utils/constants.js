export const ROLES = {
  FOOD_PROVIDER: 'FOOD_PROVIDER',
  NGO: 'NGO',
  VOLUNTEER: 'VOLUNTEER',
  ADMIN: 'ADMIN',
};

export const DONATION_STATUS = {
  AVAILABLE: 'AVAILABLE',
  REQUESTED: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
  PICKUP_ASSIGNED: 'PICKUP_ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
};

export const PICKUP_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  PICKED_UP: 'PICKED_UP',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const FOOD_CATEGORIES = [
  { value: 'COOKED_MEALS', label: 'Cooked Meals' },
  { value: 'RAW_INGREDIENTS', label: 'Raw Ingredients / Groceries' },
  { value: 'PACKAGED_FOOD', label: 'Packaged Food' },
  { value: 'BAKERY', label: 'Bakery & Bread' },
  { value: 'BEVERAGES', label: 'Beverages' },
  { value: 'OTHER', label: 'Other' },
];

export const QUANTITY_UNITS = [
  { value: 'SERVINGS', label: 'Servings / Meals' },
  { value: 'KG', label: 'Kilograms (kg)' },
  { value: 'LITERS', label: 'Liters (L)' },
  { value: 'PACKETS', label: 'Packets' },
  { value: 'TRAYS', label: 'Trays / Boxes' },
];

export const FOOD_TYPES = [
  { value: 'VEGETARIAN', label: 'Vegetarian' },
  { value: 'NON_VEGETARIAN', label: 'Non-Vegetarian' },
  { value: 'VEGAN', label: 'Vegan' },
];

export const ORGANIZATION_TYPES = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'HOTEL', label: 'Hotel & Banquets' },
  { value: 'CANTEEN', label: 'Canteen / Cafeteria' },
  { value: 'EVENT_ORGANIZER', label: 'Event Organizer' },
  { value: 'BAKERY', label: 'Bakery' },
  { value: 'OTHER', label: 'Other Food Business' },
];

export const VEHICLE_TYPES = [
  { value: 'BIKE', label: 'Motorbike / Scooter' },
  { value: 'CAR', label: 'Car / Hatchback' },
  { value: 'VAN', label: 'Delivery Van' },
  { value: 'TRUCK', label: 'Cargo Truck' },
  { value: 'NONE', label: 'On Foot / Public Transit' },
];

export const CIVIC_CATEGORIES = [
  { id: 'pothole', label: 'Pothole & Road Hazard', icon: 'AlertTriangle', tagColor: 'text-stone-700 bg-stone-100' },
  { id: 'streetlight', label: 'Lighting & Streetlight', icon: 'Lightbulb', tagColor: 'text-amber-800 bg-pastel-butter-bg border-pastel-butter-border' },
  { id: 'water_leak', label: 'Water Leak & Drainage', icon: 'Droplets', tagColor: 'text-sky-800 bg-pastel-sky-bg border-pastel-sky-border' },
  { id: 'garbage', label: 'Waste & Sanitation', icon: 'Trash2', tagColor: 'text-rose-800 bg-pastel-rose-bg border-pastel-rose-border' },
  { id: 'broken_infra', label: 'Broken Infrastructure', icon: 'Wrench', tagColor: 'text-purple-800 bg-pastel-lavender-bg border-pastel-lavender-border' },
  { id: 'wifi_deadzone', label: 'WiFi & Connectivity', icon: 'WifiOff', tagColor: 'text-stone-700 bg-stone-100' },
  { id: 'electrical', label: 'Electrical & Safety', icon: 'Zap', tagColor: 'text-amber-800 bg-pastel-butter-bg border-pastel-butter-border' },
  { id: 'hvac', label: 'HVAC & Climate', icon: 'Wind', tagColor: 'text-emerald-800 bg-pastel-sage-bg border-pastel-sage-border' },
];

export const CIVIC_STATUSES = [
  {
    id: 'reported',
    label: 'Reported',
    dotColor: 'bg-purple-500',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
    description: 'Awaiting review'
  },
  {
    id: 'acknowledged',
    label: 'Acknowledged',
    dotColor: 'bg-blue-500',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
    description: 'Assigned to team'
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    dotColor: 'bg-amber-500',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
    description: 'Work underway'
  },
  {
    id: 'resolved',
    label: 'Resolved',
    dotColor: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    description: 'Fixed & verified'
  },
];

export const LOST_FOUND_CATEGORIES = [
  { id: 'electronics', label: 'Electronics', icon: 'Laptop' },
  { id: 'keys_cards', label: 'Keys, IDs & Cards', icon: 'CreditCard' },
  { id: 'bottles_mugs', label: 'Bottles & Tumblers', icon: 'Coffee' },
  { id: 'clothing', label: 'Clothing & Bags', icon: 'Shirt' },
  { id: 'stationery', label: 'Books & Accessories', icon: 'BookOpen' },
  { id: 'other', label: 'Other Items', icon: 'Package' },
];

// IIEST Shibpur Campus Landmarks & Exact Coordinates (from maps.iiest.wiki)
export const CAMPUS_LANDMARKS = [
  { name: 'Main Academic Building & Clock Tower', lat: 22.5558, lng: 88.3075, area: 'Administrative Core' },
  { name: '8-Storied Building (Science & Tech)', lat: 22.5545, lng: 88.3082, area: 'Academic Block' },
  { name: 'Ramanujan Central Library', lat: 22.5550, lng: 88.3070, area: 'Academic Core' },
  { name: 'Netaji Bhavan', lat: 22.5562, lng: 88.3060, area: 'North Academic Wing' },
  { name: 'Oval Ground', lat: 22.5540, lng: 88.3055, area: 'Sports & Recreation' },
  { name: 'Lords Ground', lat: 22.5570, lng: 88.3085, area: 'Athletics Ground' },
  { name: 'Student Activity Centre (SAC) & Gym', lat: 22.5535, lng: 88.3068, area: 'Student Center' },
  { name: 'Wolfenden Hall / Macdonald Hall', lat: 22.5565, lng: 88.3048, area: 'Hostel Zone' },
  { name: 'First Gate (Main Entrance)', lat: 22.5578, lng: 88.3090, area: 'Campus Gate' },
  { name: 'Health Centre & Hospital', lat: 22.5548, lng: 88.3040, area: 'Medical Unit' },
  { name: 'Institute Canteen & Nescafe', lat: 22.5555, lng: 88.3062, area: 'Dining & Plaza' },
];

export const IIEST_MAP_CENTER = [22.5552, 88.3065];
export const IIEST_MAP_ZOOM = 17;
export const IIEST_WIKI_MAP_URL = 'https://maps.iiest.wiki';

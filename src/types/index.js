export const CIVIC_CATEGORIES = [
  { id: 'pothole', label: 'Pothole & Road Hazard', icon: 'AlertTriangle', color: 'peach', description: 'Cracks, deep potholes, or uneven pathways' },
  { id: 'streetlight', label: 'Streetlight / Lighting', icon: 'Lightbulb', color: 'butter', description: 'Non-functional lamps or hazardous dark spots' },
  { id: 'water_leak', label: 'Water Leakage & Drainage', icon: 'Droplets', color: 'sky', description: 'Burst pipes, clogged storm drains, or standing water' },
  { id: 'garbage', label: 'Waste & Sanitation', icon: 'Trash2', color: 'rose', description: 'Overflowing bins, uncollected waste, litter' },
  { id: 'broken_infra', label: 'Broken Infrastructure', icon: 'Wrench', color: 'lavender', description: 'Damaged benches, railings, broken door handles' },
  { id: 'wifi_deadzone', label: 'WiFi & Network Deadzone', icon: 'WifiOff', color: 'sand', description: 'No campus signal, dropped connections, router faults' },
  { id: 'electrical', label: 'Electrical & Safety', icon: 'Zap', color: 'butter', description: 'Exposed wiring, spark risks, malfunctioning sockets' },
  { id: 'hvac', label: 'HVAC & Climate', icon: 'Wind', color: 'mint', description: 'Broken AC units, heating issues, air circulation' },
];

export const CIVIC_STATUSES = [
  {
    id: 'reported',
    label: 'Reported',
    badgeClass: 'bg-pastel-peach-light text-pastel-peach-dark border-pastel-peach-border',
    color: '#FED7AA',
    description: 'Submitted by community, awaiting staff review'
  },
  {
    id: 'acknowledged',
    label: 'Acknowledged',
    badgeClass: 'bg-pastel-lavender-light text-pastel-lavender-dark border-pastel-lavender-border',
    color: '#DDD6FE',
    description: 'Verified by facility team, scheduled for crew'
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    badgeClass: 'bg-pastel-sky-light text-pastel-sky-dark border-pastel-sky-border',
    color: '#BAE6FD',
    description: 'Maintenance team on site fixing the issue'
  },
  {
    id: 'resolved',
    label: 'Resolved',
    badgeClass: 'bg-pastel-mint-light text-pastel-mint-dark border-pastel-mint-border',
    color: '#A7F3D0',
    description: 'Repaired and verified with photo proof'
  },
];

export const LOST_FOUND_CATEGORIES = [
  { id: 'electronics', label: 'Electronics & Gadgets', icon: 'Laptop', color: 'lavender' },
  { id: 'keys_cards', label: 'Keys, IDs & Wallets', icon: 'CreditCard', color: 'peach' },
  { id: 'bottles_mugs', label: 'Bottles & Tumblers', icon: 'Coffee', color: 'sky' },
  { id: 'clothing', label: 'Clothing & Accessories', icon: 'Shirt', color: 'butter' },
  { id: 'bags', label: 'Backpacks & Bags', icon: 'Briefcase', color: 'mint' },
  { id: 'stationery', label: 'Books, Specs & Notes', icon: 'BookOpen', color: 'sand' },
  { id: 'other', label: 'Other Items', icon: 'Package', color: 'rose' },
];

export const LOST_FOUND_STATUSES = [
  {
    id: 'open',
    label: 'Active Search',
    badgeClass: 'bg-pastel-peach-light text-pastel-peach-dark border-pastel-peach-border',
  },
  {
    id: 'in_claim',
    label: 'Claim in Progress',
    badgeClass: 'bg-pastel-lavender-light text-pastel-lavender-dark border-pastel-lavender-border',
  },
  {
    id: 'reunited',
    label: 'Reunited 🎉',
    badgeClass: 'bg-pastel-mint-light text-pastel-mint-dark border-pastel-mint-border',
  },
];

export const CAMPUS_LANDMARKS = [
  { name: 'Central Library & Plaza', lat: 28.5455, lng: 77.1920, area: 'Academic Core' },
  { name: 'Science & Tech Complex', lat: 28.5468, lng: 77.1932, area: 'North Wing' },
  { name: 'Student Quad & Cafeteria', lat: 28.5442, lng: 77.1915, area: 'Student Center' },
  { name: 'North Gate & Shuttle Stop', lat: 28.5480, lng: 77.1908, area: 'Main Entrance' },
  { name: 'Engineering Workshop Block', lat: 28.5435, lng: 77.1945, area: 'South Wing' },
  { name: 'Sports Arena & Grounds', lat: 28.5420, lng: 77.1900, area: 'Athletics' },
  { name: 'Central Plaza & Fountain', lat: 28.5450, lng: 77.1925, area: 'Center' },
  { name: 'Innovation Hub & Labs', lat: 28.5460, lng: 77.1950, area: 'East Wing' },
];

export const DEFAULT_MAP_CENTER = [28.5450, 77.1925];
export const DEFAULT_MAP_ZOOM = 16;

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

export const CIVIC_CATEGORIES = [
  { 
    id: 'pothole', 
    label: 'Pothole & Road Hazard', 
    icon: 'AlertTriangle', 
    tagClass: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200/80 dark:border-orange-800/60',
    accentColor: '#F97316',
    emoji: '🕳️'
  },
  { 
    id: 'streetlight', 
    label: 'Lighting & Streetlight', 
    icon: 'Lightbulb', 
    tagClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
    accentColor: '#F59E0B',
    emoji: '💡'
  },
  { 
    id: 'water_leak', 
    label: 'Water Leak & Drainage', 
    icon: 'Droplets', 
    tagClass: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60',
    accentColor: '#0EA5E9',
    emoji: '💧'
  },
  { 
    id: 'garbage', 
    label: 'Waste & Sanitation', 
    icon: 'Trash2', 
    tagClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
    accentColor: '#F43F5E',
    emoji: '🗑️'
  },
  { 
    id: 'broken_infra', 
    label: 'Broken Infrastructure', 
    icon: 'Wrench', 
    tagClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60',
    accentColor: '#A855F7',
    emoji: '🔧'
  },
  { 
    id: 'wifi_deadzone', 
    label: 'WiFi & Connectivity', 
    icon: 'WifiOff', 
    tagClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/60',
    accentColor: '#6366F1',
    emoji: '📶'
  },
  { 
    id: 'electrical', 
    label: 'Electrical & Safety', 
    icon: 'Zap', 
    tagClass: 'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-300 border-yellow-200/80 dark:border-yellow-800/60',
    accentColor: '#EAB308',
    emoji: '⚡'
  },
  { 
    id: 'hvac', 
    label: 'HVAC & Climate', 
    icon: 'Wind', 
    tagClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
    accentColor: '#10B981',
    emoji: '🍃'
  },
];

export const CIVIC_STATUSES = [
  {
    id: 'reported',
    label: 'Reported',
    dotColor: 'bg-purple-500',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    description: 'Awaiting review'
  },
  {
    id: 'acknowledged',
    label: 'Acknowledged',
    dotColor: 'bg-blue-500',
    badgeClass: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    description: 'Assigned to team'
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    dotColor: 'bg-amber-500',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    description: 'Work underway'
  },
  {
    id: 'resolved',
    label: 'Resolved',
    dotColor: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    description: 'Fixed & verified'
  },
];

export const LOST_FOUND_CATEGORIES = [
  { id: 'electronics', label: 'Electronics', icon: 'Laptop', color: 'indigo' },
  { id: 'keys_cards', label: 'Keys, IDs & Cards', icon: 'CreditCard', color: 'amber' },
  { id: 'bottles_mugs', label: 'Bottles & Tumblers', icon: 'Coffee', color: 'sky' },
  { id: 'clothing', label: 'Clothing & Bags', icon: 'Shirt', color: 'rose' },
  { id: 'stationery', label: 'Books & Notes', icon: 'BookOpen', color: 'emerald' },
  { id: 'other', label: 'Other Items', icon: 'Package', color: 'purple' },
];

// IIEST Shibpur Campus Buildings, Polygons, and Overlays (like maps.iiest.wiki)
export const IIEST_CAMPUS_BUILDINGS = [
  {
    id: 'main_building',
    name: 'Main Academic Building & Clock Tower',
    shortName: 'Clock Tower & Admin',
    code: 'MB',
    color: '#818CF8', // Indigo
    strokeColor: '#4F46E5',
    center: [22.5558, 88.3075],
    polygon: [
      [22.5562, 22.5562 > 0 ? 88.3071 : 0],
      [22.5562, 88.3079],
      [22.5554, 88.3079],
      [22.5554, 88.3071],
    ],
    polygonExact: [
      [22.55625, 88.30712],
      [22.55625, 88.30792],
      [22.55535, 88.30792],
      [22.55535, 88.30712],
    ],
    category: 'Academic & Administration',
    description: 'Main Administrative Wing, Director Office, Registrar, Clock Tower & Deans Office'
  },
  {
    id: 'eight_storied',
    name: '8-Storied Building (Science & Tech)',
    shortName: '8-Storied Science Wing',
    code: '8SB',
    color: '#38BDF8', // Sky
    strokeColor: '#0284C7',
    center: [22.5545, 88.3082],
    polygonExact: [
      [22.55485, 88.30785],
      [22.55485, 88.30855],
      [22.55415, 88.30855],
      [22.55415, 88.30785],
    ],
    category: 'Departmental Labs',
    description: 'Computer Science, Information Tech, Electronics & Telecommunication Labs'
  },
  {
    id: 'library',
    name: 'Ramanujan Central Library',
    shortName: 'Central Library',
    code: 'LIB',
    color: '#FBBF24', // Amber
    strokeColor: '#D97706',
    center: [22.5550, 88.3070],
    polygonExact: [
      [22.55530, 88.30670],
      [22.55530, 88.30730],
      [22.55470, 88.30730],
      [22.55470, 88.30670],
    ],
    category: 'Academic Core',
    description: 'Central Library, Digital Reading Wing & Research Archives'
  },
  {
    id: 'netaji_bhavan',
    name: 'Netaji Bhavan',
    shortName: 'Netaji Bhavan',
    code: 'NB',
    color: '#34D399', // Emerald
    strokeColor: '#059669',
    center: [22.5562, 88.3060],
    polygonExact: [
      [22.55655, 88.30565],
      [22.55655, 88.30635],
      [22.55585, 88.30635],
      [22.55585, 88.30565],
    ],
    category: 'Departments',
    description: 'Civil Engineering, Metallurgy & Materials Engineering'
  },
  {
    id: 'oval_ground',
    name: 'Oval Ground',
    shortName: 'Oval Ground',
    code: 'OG',
    color: '#10B981', // Green
    strokeColor: '#047857',
    center: [22.5540, 88.3055],
    polygonExact: [
      [22.55460, 88.30495],
      [22.55460, 88.30605],
      [22.55340, 88.30605],
      [22.55340, 88.30495],
    ],
    category: 'Sports & Green',
    description: 'Cricket, Open Air Fest Grounds & Campus Green'
  },
  {
    id: 'lords_ground',
    name: 'Lords Ground',
    shortName: 'Lords Ground',
    code: 'LG',
    color: '#84CC16', // Lime
    strokeColor: '#4D7C0F',
    center: [22.5570, 88.3085],
    polygonExact: [
      [22.55760, 88.30800],
      [22.55760, 88.30900],
      [22.55640, 88.30900],
      [22.55640, 88.30800],
    ],
    category: 'Athletics',
    description: 'Football & Track Athletics Stadium'
  },
  {
    id: 'sac_gym',
    name: 'Student Activity Centre (SAC) & Gym',
    shortName: 'SAC & Gymnasium',
    code: 'SAC',
    color: '#F43F5E', // Rose
    strokeColor: '#BE123C',
    center: [22.5535, 88.3068],
    polygonExact: [
      [22.55380, 88.30645],
      [22.55380, 88.30715],
      [22.55320, 88.30715],
      [22.55320, 88.30645],
    ],
    category: 'Student Hub',
    description: 'Indoor Badminton, Gym, Clubs & Student Societies'
  },
  {
    id: 'wolfenden_macdonald',
    name: 'Wolfenden Hall & Macdonald Hall',
    shortName: 'Hostel Zone',
    code: 'WH',
    color: '#A855F7', // Purple
    strokeColor: '#7E22CE',
    center: [22.5565, 88.3048],
    polygonExact: [
      [22.55690, 88.30440],
      [22.55690, 88.30520],
      [22.55610, 88.30520],
      [22.55610, 88.30440],
    ],
    category: 'Hostel',
    description: 'Undergraduate & Postgraduate Student Residences'
  },
  {
    id: 'first_gate',
    name: 'First Gate (Main Entrance)',
    shortName: 'First Gate Security',
    code: 'GATE-1',
    color: '#FB923C', // Orange
    strokeColor: '#C2410C',
    center: [22.5578, 88.3090],
    polygonExact: [
      [22.55800, 88.30875],
      [22.55800, 88.30925],
      [22.55760, 88.30925],
      [22.55760, 88.30875],
    ],
    category: 'Campus Entry',
    description: 'Main Campus Security, Visitor Check & Bus Stop'
  },
  {
    id: 'health_centre',
    name: 'Hospital & Health Centre',
    shortName: 'Health Centre',
    code: 'HC',
    color: '#F43F5E', // Red
    strokeColor: '#9F1239',
    center: [22.5548, 88.3040],
    polygonExact: [
      [22.55510, 88.30370],
      [22.55510, 88.30430],
      [22.55450, 88.30430],
      [22.55450, 88.30370],
    ],
    category: 'Medical',
    description: '24/7 Campus Medical Dispensary & Ambulance Unit'
  },
  {
    id: 'canteen_nescafe',
    name: 'Institute Canteen & Nescafe',
    shortName: 'Canteen & Food Court',
    code: 'IC',
    color: '#FBBF24', // Amber
    strokeColor: '#B45309',
    center: [22.5555, 88.3062],
    polygonExact: [
      [22.55575, 88.30595],
      [22.55575, 88.30645],
      [22.55525, 88.30645],
      [22.55525, 88.30595],
    ],
    category: 'Food & Dining',
    description: 'Central Cafeteria, Nescafe Kiosk & Evening Plaza'
  },
];

// Campus Landmarks List for quick selection
export const CAMPUS_LANDMARKS = IIEST_CAMPUS_BUILDINGS.map(b => ({
  name: b.name,
  lat: b.center[0],
  lng: b.center[1],
  area: b.category,
  shortName: b.shortName,
}));

export const IIEST_MAP_CENTER = [22.5552, 88.3065];
export const IIEST_MAP_ZOOM = 17;
export const IIEST_WIKI_MAP_URL = 'https://maps.iiest.wiki';

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

// Official IIEST Shibpur Campus Pins, Locations & Polygons (from maps.iiest.wiki survey)
export const IIEST_CAMPUS_BUILDINGS = [
  {
    id: 'main_academic_building',
    name: 'Main Academic Building & Clock Tower',
    shortName: 'Main Building (Clock Tower)',
    code: 'MB',
    color: '#818CF8',
    strokeColor: '#4F46E5',
    center: [22.5558, 88.3075],
    polygonExact: [
      [22.55625, 88.30712],
      [22.55625, 88.30792],
      [22.55535, 88.30792],
      [22.55535, 88.30712],
    ],
    category: 'Academic Core',
    emoji: '🏛️',
    description: 'Administrative Directorate, Clock Tower, Deans Office, Examination Wing'
  },
  {
    id: 'eight_storied_building',
    name: '8-Storied Science & Technology Building',
    shortName: '8-Storied Building',
    code: '8SB',
    color: '#38BDF8',
    strokeColor: '#0284C7',
    center: [22.5545, 88.3082],
    polygonExact: [
      [22.55485, 88.30785],
      [22.55485, 88.30855],
      [22.55415, 88.30855],
      [22.55415, 88.30785],
    ],
    category: 'Departments & Labs',
    emoji: '🔬',
    description: 'Computer Science & Technology (CST), Information Tech (IT), Electronics & Telecom (ETC)'
  },
  {
    id: 'ramanujan_library',
    name: 'Ramanujan Central Library',
    shortName: 'Central Library',
    code: 'LIB',
    color: '#FBBF24',
    strokeColor: '#D97706',
    center: [22.5550, 88.3070],
    polygonExact: [
      [22.55530, 88.30670],
      [22.55530, 88.30730],
      [22.55470, 88.30730],
      [22.55470, 88.30670],
    ],
    category: 'Academic Core',
    emoji: '📚',
    description: 'Central Institute Library, Reading Halls & Digital Reference Section'
  },
  {
    id: 'netaji_bhavan',
    name: 'Netaji Bhavan',
    shortName: 'Netaji Bhavan',
    code: 'NB',
    color: '#34D399',
    strokeColor: '#059669',
    center: [22.5562, 88.3060],
    polygonExact: [
      [22.55655, 88.30565],
      [22.55655, 88.30635],
      [22.55585, 88.30635],
      [22.55585, 88.30565],
    ],
    category: 'Departments',
    emoji: '🏛️',
    description: 'Civil Engineering, Metallurgy & Materials Engineering'
  },
  {
    id: 'mechanical_dept',
    name: 'Department of Mechanical Engineering',
    shortName: 'Mechanical Dept',
    code: 'ME',
    color: '#FB923C',
    strokeColor: '#EA580C',
    center: [22.5552, 88.3080],
    polygonExact: [
      [22.55550, 88.30775],
      [22.55550, 88.30825],
      [22.55490, 88.30825],
      [22.55490, 88.30775],
    ],
    category: 'Departments',
    emoji: '⚙️',
    description: 'Mechanical Engineering Workshop, Fluid Mechanics Lab, Heat Engine Lab'
  },
  {
    id: 'electrical_dept',
    name: 'Department of Electrical Engineering',
    shortName: 'Electrical Dept',
    code: 'EE',
    color: '#FACC15',
    strokeColor: '#CA8A04',
    center: [22.5556, 88.3083],
    polygonExact: [
      [22.55590, 88.30805],
      [22.55590, 88.30855],
      [22.55530, 88.30855],
      [22.55530, 88.30805],
    ],
    category: 'Departments',
    emoji: '⚡',
    description: 'Electrical Engineering Complex, High Voltage Lab & Control Systems'
  },
  {
    id: 'oval_ground',
    name: 'Oval Ground',
    shortName: 'Oval Ground',
    code: 'OG',
    color: '#10B981',
    strokeColor: '#047857',
    center: [22.5540, 88.3055],
    polygonExact: [
      [22.55460, 88.30495],
      [22.55460, 88.30605],
      [22.55340, 88.30605],
      [22.55340, 88.30495],
    ],
    category: 'Sports & Recreation',
    emoji: '🏏',
    description: 'Central Cricket Ground & Cultural Gathering Plaza'
  },
  {
    id: 'lords_ground',
    name: 'Lords Ground',
    shortName: 'Lords Ground',
    code: 'LG',
    color: '#84CC16',
    strokeColor: '#4D7C0F',
    center: [22.5570, 88.3085],
    polygonExact: [
      [22.55760, 88.30800],
      [22.55760, 88.30900],
      [22.55640, 88.30900],
      [22.55640, 88.30800],
    ],
    category: 'Sports & Recreation',
    emoji: '⚽',
    description: 'Athletics, REBECA Fest Arena & Football Stadium'
  },
  {
    id: 'sac_gym',
    name: 'Student Activity Centre (SAC) & Gym',
    shortName: 'SAC & Gym',
    code: 'SAC',
    color: '#F43F5E',
    strokeColor: '#BE123C',
    center: [22.5535, 88.3068],
    polygonExact: [
      [22.55380, 88.30645],
      [22.55380, 88.30715],
      [22.55320, 88.30715],
      [22.55320, 88.30645],
    ],
    category: 'Student Hub',
    emoji: '🏸',
    description: 'Badminton Courts, Gymnasium, Music Room & Society Rooms'
  },
  {
    id: 'wolfenden_hall',
    name: 'Wolfenden Hall',
    shortName: 'Wolfenden Hall',
    code: 'WH',
    color: '#A855F7',
    strokeColor: '#7E22CE',
    center: [22.5568, 88.3046],
    polygonExact: [
      [22.55710, 88.30425],
      [22.55710, 88.30495],
      [22.55650, 88.30495],
      [22.55650, 88.30425],
    ],
    category: 'Student Hostels',
    emoji: '🛏️',
    description: 'Senior Undergraduate Student Residence'
  },
  {
    id: 'macdonald_hall',
    name: 'Macdonald Hall',
    shortName: 'Macdonald Hall',
    code: 'MH',
    color: '#C084FC',
    strokeColor: '#9333EA',
    center: [22.5562, 88.3048],
    polygonExact: [
      [22.55650, 88.30445],
      [22.55650, 88.30515],
      [22.55590, 88.30515],
      [22.55590, 88.30445],
    ],
    category: 'Student Hostels',
    emoji: '🛏️',
    description: 'Student Residence Hall'
  },
  {
    id: 'sen_hall',
    name: 'Sen Hall & Richardson Hall',
    shortName: 'Sen & Richardson Hall',
    code: 'SRH',
    color: '#E879F9',
    strokeColor: '#C026D3',
    center: [22.5558, 88.3042],
    polygonExact: [
      [22.55610, 88.30385],
      [22.55610, 88.30455],
      [22.55550, 88.30455],
      [22.55550, 88.30385],
    ],
    category: 'Student Hostels',
    emoji: '🛏️',
    description: 'Historic Student Residence Halls'
  },
  {
    id: 'health_centre',
    name: 'Institute Health Centre & Hospital',
    shortName: 'Health Centre',
    code: 'HC',
    color: '#EF4444',
    strokeColor: '#B91C1C',
    center: [22.5548, 88.3040],
    polygonExact: [
      [22.55510, 88.30370],
      [22.55510, 88.30430],
      [22.55450, 88.30430],
      [22.55450, 88.30370],
    ],
    category: 'Healthcare',
    emoji: '🏥',
    description: '24/7 Campus Medical Dispensary, Doctor Chambers & Ambulance Service'
  },
  {
    id: 'institute_canteen',
    name: 'Institute Canteen & Nescafe Kiosk',
    shortName: 'Institute Canteen',
    code: 'IC',
    color: '#F59E0B',
    strokeColor: '#B45309',
    center: [22.5555, 88.3062],
    polygonExact: [
      [22.55575, 88.30595],
      [22.55575, 88.30645],
      [22.55525, 88.30645],
      [22.55525, 88.30595],
    ],
    category: 'Dining',
    emoji: '☕',
    description: 'Main Campus Cafeteria, Nescafe Outpost & Student Lounge'
  },
  {
    id: 'first_gate',
    name: 'First Gate (Main Campus Entrance)',
    shortName: 'First Gate (Main Gate)',
    code: 'GATE-1',
    color: '#FB923C',
    strokeColor: '#C2410C',
    center: [22.5578, 88.3090],
    polygonExact: [
      [22.55800, 88.30875],
      [22.55800, 88.30925],
      [22.55760, 88.30925],
      [22.55760, 88.30875],
    ],
    category: 'Gates',
    emoji: '🚪',
    description: 'Primary Entrance from Botanical Garden Road with Security Booth'
  },
  {
    id: 'second_gate',
    name: 'Second Gate (Hostel Gate)',
    shortName: 'Second Gate',
    code: 'GATE-2',
    color: '#F97316',
    strokeColor: '#C2410C',
    center: [22.5560, 88.3035],
    polygonExact: [
      [22.55620, 88.30330],
      [22.55620, 88.30370],
      [22.55580, 88.30370],
      [22.55580, 88.30330],
    ],
    category: 'Gates',
    emoji: '🚪',
    description: 'West Campus Entry near Hostel Zone & Staff Quarters'
  },
  {
    id: 'third_gate',
    name: 'Third Gate (Hospital / South Gate)',
    shortName: 'Third Gate',
    code: 'GATE-3',
    color: '#F97316',
    strokeColor: '#C2410C',
    center: [22.5530, 88.3050],
    polygonExact: [
      [22.55320, 88.30480],
      [22.55320, 88.30520],
      [22.55280, 88.30520],
      [22.55280, 88.30480],
    ],
    category: 'Gates',
    emoji: '🚪',
    description: 'South Entrance facing Hospital and Botanical Garden Perimeter'
  },
];

// Campus Landmarks List for quick selection
export const CAMPUS_LANDMARKS = IIEST_CAMPUS_BUILDINGS.map(b => ({
  name: b.name,
  lat: b.center[0],
  lng: b.center[1],
  area: b.category,
  shortName: b.shortName,
  code: b.code,
  emoji: b.emoji,
}));

export const IIEST_MAP_CENTER = [22.5552, 88.3065];
export const IIEST_MAP_ZOOM = 17;
export const IIEST_WIKI_MAP_URL = 'https://maps.iiest.wiki';

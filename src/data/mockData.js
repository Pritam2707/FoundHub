/**
 * Initial Seed Data for IIEST Shibpur Civic Watch and Lost & Found
 */

export const INITIAL_CIVIC_ISSUES = [
  {
    id: 'civic-101',
    title: 'Deep pothole on pathway between Main Building and Ramanujan Library',
    description: 'A 6-inch deep pothole near the Clock Tower curve where students cycle and walk. Prone to water accumulation and hazardous after sunset.',
    category: 'pothole',
    status: 'in_progress',
    urgencyUpvotes: 42,
    userUpvoted: false,
    severity: 4,
    location: {
      lat: 22.5555,
      lng: 88.3072,
      name: 'Path between Clock Tower & Ramanujan Library',
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Sourav Mondal',
    reporterRole: 'IIEST Student',
    reportedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    verifiedCount: 28,
    statusHistory: [
      { status: 'reported', timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), note: 'Issue submitted with photo and GPS location' },
      { status: 'acknowledged', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), note: 'Inspected by Campus Facility Maintenance Team' },
      { status: 'in_progress', timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), note: 'Asphalt repair crew scheduled' },
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Pritam Das',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        text: 'Nearly slipped on cycle here during evening lab commute. Glad it is being addressed.',
        timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      },
      {
        id: 'c-2',
        author: 'IIEST Estate Office',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        text: 'Road repair batch will complete patchwork this afternoon.',
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        isOfficial: true,
      }
    ]
  },
  {
    id: 'civic-102',
    title: 'Non-functional streetlamp behind 8-Storied Building',
    description: 'The perimeter lamp near the entrance ramp of the 8-Storied Science Building is out, making the corner pitch dark after 7:00 PM.',
    category: 'streetlight',
    status: 'acknowledged',
    urgencyUpvotes: 29,
    userUpvoted: false,
    severity: 5,
    location: {
      lat: 22.5546,
      lng: 88.3084,
      name: '8-Storied Building East Pathway',
    },
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Ananya Sen',
    reporterRole: 'Research Scholar',
    reportedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    verifiedCount: 19,
    statusHistory: [
      { status: 'reported', timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), note: 'Submitted via CivicBloom' },
      { status: 'acknowledged', timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), note: 'Assigned to Electrical Unit' },
    ],
    comments: []
  },
  {
    id: 'civic-103',
    title: 'Water pipe leak near Oval Ground canteen garden',
    description: 'Overground drainage tap leaking continuously on the pavement near the Oval Ground gate.',
    category: 'water_leak',
    status: 'resolved',
    urgencyUpvotes: 56,
    userUpvoted: false,
    severity: 4,
    location: {
      lat: 22.5541,
      lng: 88.3056,
      name: 'Oval Ground Canteen Corner',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Rahul Roy',
    reporterRole: 'Hostel Resident',
    reportedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    verifiedCount: 44,
    statusHistory: [
      { status: 'reported', timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), note: 'Leak reported' },
      { status: 'resolved', timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), note: 'Valve replaced by plumbing staff' },
    ],
    comments: []
  },
  {
    id: 'civic-104',
    title: 'WiFi dead zone inside Netaji Bhavan 2nd floor classrooms',
    description: 'No campus eduroam signal in rooms NB-204 and NB-206 during lecture sessions.',
    category: 'wifi_deadzone',
    status: 'reported',
    urgencyUpvotes: 18,
    userUpvoted: false,
    severity: 3,
    location: {
      lat: 22.5562,
      lng: 88.3061,
      name: 'Netaji Bhavan 2nd Floor',
    },
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Debjit Bose',
    reporterRole: 'B.Tech Student',
    reportedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    verifiedCount: 12,
    statusHistory: [
      { status: 'reported', timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), note: 'Reported by Debjit Bose' },
    ],
    comments: []
  }
];

export const INITIAL_LOST_FOUND = [
  {
    id: 'lf-201',
    type: 'lost',
    title: 'Navy Blue HydroFlask (with Cat & Code Stickers)',
    description: 'Lost my 32oz dark navy insulated water bottle with stickers on the reading desk on Ramanujan Library 2nd floor.',
    category: 'bottles_mugs',
    color: 'Navy Blue',
    brand: 'HydroFlask',
    status: 'open',
    locationName: 'Ramanujan Central Library 2nd Floor',
    location: {
      lat: 22.5551,
      lng: 88.3071,
    },
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    posterName: 'Maya Krishnan',
    posterContact: 'maya.k@iiest.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    reward: 'Free Canteen Coffee ☕',
    comments: []
  },
  {
    id: 'lf-202',
    type: 'found',
    title: 'Dark Blue Metal Flask Bottle with Stickers',
    description: 'Found a navy metal flask bottle on table #14 in Ramanujan Central Library. Kept safely at the front helpdesk.',
    category: 'bottles_mugs',
    color: 'Navy Blue',
    brand: 'HydroFlask',
    status: 'open',
    locationName: 'Ramanujan Central Library Front Desk',
    location: {
      lat: 22.5550,
      lng: 88.3070,
    },
    timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    posterName: 'Library Staff',
    posterContact: 'library@iiest.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1544003484-3cd181d17917?auto=format&fit=crop&w=800&q=80',
    secretQuestion: 'What specific cat sticker is on the back?',
    comments: []
  },
  {
    id: 'lf-203',
    type: 'lost',
    title: 'Space Gray MacBook Air M2 in Felt Sleeve',
    description: 'Left laptop on the benches near Student Activity Centre (SAC) beside the gym.',
    category: 'electronics',
    color: 'Space Gray',
    brand: 'Apple',
    status: 'open',
    locationName: 'Student Activity Centre (SAC) & Gym',
    location: {
      lat: 22.5536,
      lng: 88.3069,
    },
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    posterName: 'Rohan Gupta',
    posterContact: 'rohan.g@iiest.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    comments: []
  },
  {
    id: 'lf-204',
    type: 'found',
    title: 'IIEST Student ID Card & Key Fob',
    description: 'Found student ID card near First Gate (Main Entrance) security booth on blue lanyard.',
    category: 'keys_cards',
    color: 'Blue Lanyard',
    brand: 'IIEST ID',
    status: 'reunited',
    locationName: 'First Gate (Main Entrance)',
    location: {
      lat: 22.5577,
      lng: 88.3089,
    },
    timestamp: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    posterName: 'Security Gate Staff',
    posterContact: 'security@iiest.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    reunitedDate: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    comments: []
  }
];

/**
 * Initial Seed Data for Civic Watch and Lost & Found
 */

export const INITIAL_CIVIC_ISSUES = [
  {
    id: 'civic-101',
    title: 'Deep pothole on main pathway near Central Library curve',
    description: 'A 6-inch deep pothole has opened up right where cyclists and students walk between Central Library and the Student Quad. Dangerous after sunset.',
    category: 'pothole',
    status: 'in_progress', // reported, acknowledged, in_progress, resolved
    urgencyUpvotes: 42,
    userUpvoted: false,
    severity: 4, // 1 to 5
    location: {
      lat: 28.5453,
      lng: 77.1921,
      name: 'Path between Central Library & Quad',
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Aarav Mehta',
    reporterRole: 'Student Resident',
    reportedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 1.5 days ago
    verifiedCount: 28,
    statusHistory: [
      { status: 'reported', timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), note: 'Issue submitted with photo and GPS location' },
      { status: 'acknowledged', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), note: 'Inspected by Campus Facility Officer Verma' },
      { status: 'in_progress', timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), note: 'Road repair asphalt team dispatched' },
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Riya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        text: 'Nearly tripped over this while carrying my laptop bag yesterday! Glad maintenance acknowledged it.',
        timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
        upvotes: 8,
      },
      {
        id: 'c-2',
        author: 'Campus Facility (Staff)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        text: 'Cold asphalt patch crew is scheduled for 4:00 PM today. Pathway traffic will be partially diverted.',
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        isOfficial: true,
        upvotes: 14,
      }
    ]
  },
  {
    id: 'civic-102',
    title: 'Flickering & dead lamp post behind Science Block',
    description: 'The two perimeter lights along the walkway behind Science & Tech Complex are completely dead. Total blackout walkway after 7 PM.',
    category: 'streetlight',
    status: 'acknowledged',
    urgencyUpvotes: 29,
    userUpvoted: false,
    severity: 5,
    location: {
      lat: 28.5469,
      lng: 77.1934,
      name: 'Science & Tech Complex Rear Pathway',
    },
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Ananya Sen',
    reporterRole: 'Lab Assistant',
    reportedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    verifiedCount: 19,
    statusHistory: [
      { status: 'reported', timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), note: 'Submitted via CivicWatch' },
      { status: 'acknowledged', timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), note: 'Assigned to Electrical Maintenance Team' },
    ],
    comments: [
      {
        id: 'c-3',
        author: 'Kunal Roy',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        text: 'Female students have to use flashlight on phones every evening. Needs urgent attention!',
        timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        upvotes: 11,
      }
    ]
  },
  {
    id: 'civic-103',
    title: 'Burst pipe causing puddle flood near Student Cafeteria',
    description: 'Underground sprinkler pipe cracked, spraying water across the entrance of the Student Quad cafeteria. Water is accumulating near electric junction box.',
    category: 'water_leak',
    status: 'resolved',
    urgencyUpvotes: 56,
    userUpvoted: false,
    severity: 4,
    location: {
      lat: 28.5441,
      lng: 77.1916,
      name: 'Student Cafeteria Garden Side',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Tanya Verma',
    reporterRole: 'Undergraduate',
    reportedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    verifiedCount: 44,
    statusHistory: [
      { status: 'reported', timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), note: 'Urgent leak reported' },
      { status: 'acknowledged', timestamp: new Date(Date.now() - 70 * 3600 * 1000).toISOString(), note: 'Plumbing unit notified' },
      { status: 'in_progress', timestamp: new Date(Date.now() - 60 * 3600 * 1000).toISOString(), note: 'Main valve shut off and PVC section replaced' },
      { status: 'resolved', timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), note: 'Pipe sealed and pressure tested. Pavement dried.' },
    ],
    comments: [
      {
        id: 'c-4',
        author: 'Facility Desk',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        text: 'Resolved by Facilities Team A. New high-durability shutoff valve installed.',
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        isOfficial: true,
        upvotes: 21,
      }
    ]
  },
  {
    id: 'civic-104',
    title: 'Severe WiFi Deadzone on 2nd Floor Innovation Hub',
    description: 'No campus eduroam / WiFi connectivity in meeting rooms 201-206. Signal cuts out completely whenever 10+ students connect.',
    category: 'wifi_deadzone',
    status: 'reported',
    urgencyUpvotes: 18,
    userUpvoted: false,
    severity: 3,
    location: {
      lat: 28.5461,
      lng: 77.1952,
      name: 'Innovation Hub 2nd Floor',
    },
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Dev Patel',
    reporterRole: 'Postgrad Researcher',
    reportedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    verifiedCount: 12,
    statusHistory: [
      { status: 'reported', timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), note: 'Report logged by Dev Patel' },
    ],
    comments: [
      {
        id: 'c-5',
        author: 'Sara Ali',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        text: 'Yes! Group study sessions get disconnected every 15 minutes here.',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        upvotes: 5,
      }
    ]
  }
];

export const INITIAL_LOST_FOUND = [
  {
    id: 'lf-201',
    type: 'lost', // 'lost' or 'found'
    title: 'Navy Blue HydroFlask 32oz (with Space & Cat Stickers)',
    description: 'Lost my dark navy 32oz insulated water bottle. Has distinctive astronaut and holographic cat stickers, slight dent at the bottom base.',
    category: 'bottles_mugs',
    color: 'Navy Blue',
    brand: 'HydroFlask',
    status: 'open', // open, in_claim, reunited
    locationName: 'Central Library 2nd Floor Quiet Zone',
    location: {
      lat: 28.5456,
      lng: 77.1922,
    },
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    posterName: 'Maya Krishnan',
    posterContact: 'maya.k@campus.edu',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    reward: 'Free Coffee ☕',
    comments: [
      {
        id: 'lfc-1',
        author: 'Arjun Das',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
        text: 'I think I saw a librarian move a blue bottle to the front lost & found desk around 4pm yesterday!',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      }
    ]
  },
  {
    id: 'lf-202',
    type: 'found',
    title: 'Dark Blue Metal Water Bottle with Stickers',
    description: 'Found a navy blue metal vacuum flask bottle left on desk #14 in Central Library reading wing. Has cute space stickers on the side.',
    category: 'bottles_mugs',
    color: 'Navy Blue',
    brand: 'HydroFlask',
    status: 'open',
    locationName: 'Central Library Front Helpdesk',
    location: {
      lat: 28.5455,
      lng: 77.1920,
    },
    timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    posterName: 'Librarian Desk',
    posterContact: 'library-lostfound@campus.edu',
    imageUrl: 'https://images.unsplash.com/photo-1544003484-3cd181d17917?auto=format&fit=crop&w=800&q=80',
    secretQuestion: 'What specific cat sticker is on the back?',
    comments: []
  },
  {
    id: 'lf-203',
    type: 'lost',
    title: 'Space Gray MacBook Air M2 & Black Felt Sleeve',
    description: 'Accidentally left my laptop inside a charcoal felt sleeve on the wooden study tables outside Student Quad. Contains urgent research code!',
    category: 'electronics',
    color: 'Space Gray',
    brand: 'Apple',
    status: 'open',
    locationName: 'Student Quad & Cafeteria Courtyard',
    location: {
      lat: 28.5443,
      lng: 77.1914,
    },
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    posterName: 'Rohan Gupta',
    posterContact: 'rohan.g@campus.edu',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    reward: '$50 Reward',
    comments: []
  },
  {
    id: 'lf-204',
    type: 'found',
    title: 'Campus Student ID Card & Gym Key fob',
    description: 'Found student access card with key fob hanging on a blue lanyard near the Engineering Workshop main staircase.',
    category: 'keys_cards',
    color: 'Blue Lanyard',
    brand: 'University ID',
    status: 'reunited',
    locationName: 'Engineering Workshop Block',
    location: {
      lat: 28.5436,
      lng: 77.1944,
    },
    timestamp: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    posterName: 'Security Guard Ram',
    posterContact: 'security@campus.edu',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    reunitedDate: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    comments: [
      {
        id: 'lfc-2',
        author: 'Kavita Nair',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        text: 'Owner picked it up from the security booth! Thanks everyone.',
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      }
    ]
  }
];

import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { getStoredCivicIssues, saveCivicIssues, getStoredLostFound, saveLostFound } from './storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  !firebaseConfig.apiKey.includes('YOUR_')
);

let app = null;
let db = null;
let auth = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Enable offline persistence in supported browser environments
    if (typeof window !== 'undefined') {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore persistence is not supported by this browser');
        }
      });
    }
    console.log('✅ Connected to Firebase Firestore & Auth with offline cache');
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }
} else {
  console.log('ℹ️ Firebase credentials not provided in .env. Running in synchronized offline-first mode.');
}

export { isFirebaseConfigured, db, auth };

/**
 * Google Authentication Helpers
 */
export async function signInWithGoogle() {
  if (!auth) {
    // If running in offline test mode without Firebase env keys, return mock user
    console.warn('Firebase Auth not configured, signing in with demo Google profile');
    const demoUser = {
      uid: `google-user-${Date.now()}`,
      displayName: 'IIEST Shibpur Scholar',
      email: 'student@iiest.ac.in',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    };
    localStorage.setItem('civicbloom_user', JSON.stringify(demoUser));
    return demoUser;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = {
      uid: result.user.uid,
      displayName: result.user.displayName || 'IIEST Member',
      email: result.user.email,
      photoURL: result.user.photoURL,
    };
    localStorage.setItem('civicbloom_user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function signOutUser() {
  if (auth) {
    await signOut(auth);
  }
  localStorage.removeItem('civicbloom_user');
}

export function subscribeToAuth(callback) {
  if (auth) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'IIEST Member',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        localStorage.setItem('civicbloom_user', JSON.stringify(user));
        callback(user);
      } else {
        localStorage.removeItem('civicbloom_user');
        callback(null);
      }
    });
  } else {
    // Check localStorage fallback
    const saved = localStorage.getItem('civicbloom_user');
    callback(saved ? JSON.parse(saved) : null);
    return () => {};
  }
}

/**
 * Subscribe to Civic Issues in Real-Time
 */
export function subscribeToCivicIssues(onUpdate) {
  if (db && isFirebaseConfigured) {
    const q = query(collection(db, 'civic_issues'), orderBy('reportedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const issues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      saveCivicIssues(issues);
      onUpdate(issues);
    }, (error) => {
      console.warn('Firestore subscription fallback to local storage:', error);
      onUpdate(getStoredCivicIssues());
    });
  } else {
    const local = getStoredCivicIssues();
    onUpdate(local);
    return () => {};
  }
}

/**
 * Subscribe to Lost & Found in Real-Time
 */
export function subscribeToLostFound(onUpdate) {
  if (db && isFirebaseConfigured) {
    const q = query(collection(db, 'lost_found_items'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      saveLostFound(items);
      onUpdate(items);
    }, (error) => {
      console.warn('Firestore subscription fallback to local storage:', error);
      onUpdate(getStoredLostFound());
    });
  } else {
    const local = getStoredLostFound();
    onUpdate(local);
    return () => {};
  }
}

/**
 * Firestore Mutations with LocalStorage Sync
 */
export async function syncCivicIssue(issue) {
  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'civic_issues', issue.id), issue, { merge: true });
    } catch (e) {
      console.error('Error syncing civic issue to Firestore:', e);
    }
  }
}

export async function syncLostFoundItem(item) {
  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'lost_found_items', item.id), item, { merge: true });
    } catch (e) {
      console.error('Error syncing lost & found item to Firestore:', e);
    }
  }
}

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

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    
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
    console.log('✅ Connected to Firebase Firestore with offline cache');
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }
} else {
  console.log('ℹ️ Firebase credentials not provided in .env. Running in synchronized offline-first mode.');
}

export { isFirebaseConfigured, db };

/**
 * Subscribe to Civic Issues in Real-Time
 */
export function subscribeToCivicIssues(onUpdate) {
  if (db && isFirebaseConfigured) {
    const q = query(collection(db, 'civic_issues'), orderBy('reportedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const issues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        saveCivicIssues(issues);
        onUpdate(issues);
      } else {
        // If firestore is empty, seed initial data
        const initial = getStoredCivicIssues();
        initial.forEach(issue => {
          setDoc(doc(db, 'civic_issues', issue.id), issue);
        });
        onUpdate(initial);
      }
    }, (error) => {
      console.warn('Firestore subscription fallback to local storage:', error);
      onUpdate(getStoredCivicIssues());
    });
  } else {
    // LocalStorage fallback
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
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        saveLostFound(items);
        onUpdate(items);
      } else {
        // If firestore is empty, seed initial data
        const initial = getStoredLostFound();
        initial.forEach(item => {
          setDoc(doc(db, 'lost_found_items', item.id), item);
        });
        onUpdate(initial);
      }
    }, (error) => {
      console.warn('Firestore subscription fallback to local storage:', error);
      onUpdate(getStoredLostFound());
    });
  } else {
    // LocalStorage fallback
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

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './firebase/config';

let firebaseApp: FirebaseApp | undefined;
let db: Firestore | null = null;
let auth: Auth | undefined;
let persistenceEnabled = false;

// Initialize Firebase for SSR
const initializeFirebase = (): { firebaseApp: FirebaseApp; db: Firestore; auth: Auth } => {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  }

  if (!firebaseApp) {
    throw new Error('Firebase app initialization failed');
  }

  db = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);

  // Enable offline persistence
  if (typeof window !== 'undefined' && !persistenceEnabled) {
    persistenceEnabled = true;
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      } else {
        console.error('Firebase persistence error:', err);
      }
    });
  }

  return { firebaseApp, db, auth };
};

// Get or initialize Firebase app
export const getFirebaseApp = (): FirebaseApp => {
  if (!firebaseApp) {
    const { firebaseApp: app } = initializeFirebase();
    firebaseApp = app;
  }
  
  if (!firebaseApp) {
    throw new Error('Failed to initialize Firebase app');
  }

  return firebaseApp;
};

export function getFirestoreInstance(): Firestore {
  if (!db) {
    const app = getApps().length === 0 
      ? initializeApp(firebaseConfig) 
      : getApps()[0];
    
    if (!app) {
      throw new Error('Failed to initialize Firebase app');
    }

    db = getFirestore(app);

    // Enable persistence only once and only in browser environment
    if (typeof window !== 'undefined' && !persistenceEnabled) {
      persistenceEnabled = true;
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support persistence.');
        } else {
          console.error('Firebase persistence error:', err);
        }
      });
    }
  }

  return db;
};

export const getAuthInstance = (): Auth => {
  if (!auth) {
    const { auth: newAuth } = initializeFirebase();
    auth = newAuth;
  }
  
  if (!auth) {
    throw new Error('Failed to initialize Firebase Auth');
  }

  return auth;
};

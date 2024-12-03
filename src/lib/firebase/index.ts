import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

// Initialize Firebase for SSR
const initializeFirebase = () => {
  if (typeof window === 'undefined') return;

  if (!firebaseApp && getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
  } else {
    firebaseApp = getApps()[0];
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
  }

  return { firebaseApp, db, auth };
};

// Get Firebase instances
export const getFirebaseApp = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return firebaseApp;
};

export const getFirestoreInstance = () => {
  if (!db) {
    initializeFirebase();
  }
  return db;
};

export const getAuthInstance = () => {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
};

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { en } from '../src/translations/en';
import { hi } from '../src/translations/hi';

const configuredAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
// Fallback to .web.app instead of .firebaseapp.com to fix 404 init.json issue on redirect
const authDomain = configuredAuthDomain?.includes('.firebaseapp.com')
  ? configuredAuthDomain.replace('.firebaseapp.com', '.web.app')
  : configuredAuthDomain;

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: authDomain,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, 'ai-studio-d09d3a80-a4dd-45a4-9b71-c99cde47c87b');
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export async function signIn() {
  await signInWithRedirect(auth, googleProvider);
}

export async function checkUserDocExists(user: any): Promise<boolean> {
  if (!user) return false;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists();
}

export async function createUserDocWithRole(user: any, role: string) {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    const baseData = {
      name: user.displayName || '',
      email: user.email || '',
      role: role,
      createdAt: serverTimestamp(),
    };

    // Add role-specific default data
    if (role === 'student') {
      Object.assign(baseData, {
        gpa: 0,
        attendance: 0,
        courses: [],
        enrolledCourseIds: [],
        schedule: [],
        tasks: [],
      });
    }

    await setDoc(userRef, baseData);
  }
}

let redirectResultPromise: Promise<any> | null = null;

export async function handleRedirectResult() {
  try {
    console.log('Checking redirect result...');
    if (!redirectResultPromise) {
      redirectResultPromise = getRedirectResult(auth);
    }
    const result = await redirectResultPromise;
    console.log('Redirect result:', result);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error('Redirect error:', error);
    toast.error('Failed to sign in. Please try again.');
    throw error;
  }
}

export async function logOut() {
  return signOut(auth);
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: object[];
  }
}

export function handleFirestoreError(error: unknown, operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write', path: string | null) {
  if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType: operationType,
      path: path,
      authInfo: {
        userId: auth.currentUser?.uid || 'unauthenticated',
        email: auth.currentUser?.email || null,
        emailVerified: auth.currentUser?.emailVerified || false,
        isAnonymous: auth.currentUser?.isAnonymous || true,
        providerInfo: auth.currentUser?.providerData || []
      }
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
}

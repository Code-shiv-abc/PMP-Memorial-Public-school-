import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/src/types/user';

interface UseUserProfileReturn {
  data: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useUserProfile(): UseUserProfileReturn {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We need an unsubscribe function to clean up the snapshot listener
    let unsubscribe: (() => void) | undefined;

    // Listen to the auth state to get the current user reliably
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = undefined;
      }

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);

        unsubscribe = onSnapshot(userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const docData = docSnap.data();
              // Cast to UserProfile type, handling potential missing arrays gracefully
              const profile: UserProfile = {
                name: docData.name,
                gpa: docData.gpa ?? 0,
                attendance: docData.attendance ?? 0,
                assignmentsDue: docData.assignmentsDue ?? 0,
                courses: docData.courses ?? [],
                schedule: docData.schedule ?? [],
                tasks: docData.tasks ?? []
              };
              setData(profile);
              setError(null);
            } else {
              setError("Profile not found. Please contact your administrator.");
              setData(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error("Error fetching user profile:", err);
            setError("An error occurred while fetching your profile.");
            setLoading(false);
          }
        );
      } else {
        // No user is logged in
        setData(null);
        setError(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { data, loading, error };
}

import { useState, useEffect } from 'react';
import { sanityClient } from '@/src/lib/sanity';
import { Course } from '@/src/types/course';

interface UseCoursesReturn {
  data: Course[];
  loading: boolean;
  error: string | null;
}

export function useCourses(): UseCoursesReturn {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
           console.warn('Sanity project ID not configured in .env.local');
           setData([]);
           setLoading(false);
           return;
        }

        const courses = await sanityClient.fetch<Course[]>('*[_type == "course"]');
        setData(courses || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch courses from Sanity:", err);
        setError("Failed to load courses. Please try again later.");
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return { data, loading, error };
}

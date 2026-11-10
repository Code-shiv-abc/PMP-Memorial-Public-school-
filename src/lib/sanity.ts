import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";

// Safe client that won't crash the build if env variables are missing during CI
export const sanityClient = createClient({
  projectId: projectId || "placeholder", 
  dataset: dataset,
  useCdn: false, // false = instant live updates when you hit 'Publish' in Sanity
  apiVersion: "2024-01-01",
});

// A universal data fetcher
export async function fetchFromSanity<T>(query: string): Promise<T | null> {
  if (!projectId || projectId === "placeholder") return null;
  try {
    const data = await sanityClient.fetch(query);
    return data as T;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}

export default sanityClient;

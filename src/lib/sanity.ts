import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";

export const isSanityConfigured = Boolean(
  projectId &&
    projectId !== "your_project_id" &&
    projectId !== "placeholder" &&
    projectId !== "undefined" &&
    /^[a-z0-9-]+$/.test(projectId)
);

export const sanityClient = createClient({
  projectId: isSanityConfigured ? projectId : "placeholder0",
  dataset,
  useCdn: false,
  apiVersion: "2024-01-01",
});

export async function fetchFromSanity<T = unknown>(query: string): Promise<T | null> {
  if (!isSanityConfigured || !projectId) return null;
  try {
    const data = await sanityClient.fetch<T>(query);
    return data ?? null;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}

export const fetchSanityData = fetchFromSanity;

export default sanityClient;

// lib/api.ts
export async function fetchEvents(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/events?${query}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

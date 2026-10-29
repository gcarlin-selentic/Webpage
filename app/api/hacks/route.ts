import { getFeed } from "@/lib/feed";

/**
 * Normalised incident feed. The page renders from getFeed() directly; this
 * endpoint serves the client-side "Try again" button and anyone who wants the
 * JSON. Set HACKS_API_URL=mock to serve data/mock-hacks.json instead.
 */
export async function GET() {
  const result = await getFeed();
  if (!result.ok) {
    return Response.json(result, { status: 502, headers: { "cache-control": "no-store" } });
  }
  return Response.json(result.feed, {
    headers: { "cache-control": "public, s-maxage=600, stale-while-revalidate=3600" },
  });
}

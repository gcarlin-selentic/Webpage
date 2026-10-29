import { getFeed, searchHacks } from "@/lib/feed";

const CACHE = { "cache-control": "public, s-maxage=600, stale-while-revalidate=3600" };

/**
 * GET /api/hacks        the normalised feed, as the page receives it. Serves the
 *                       client-side "Try again" button and anyone who wants the JSON.
 * GET /api/hacks?q=...  search across every incident in the upstream feed, which is
 *                       much longer than the list the page shows.
 * Set HACKS_API_URL=mock to serve data/mock-hacks.json instead.
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.slice(0, 100);
  if (q !== undefined) {
    const result = await searchHacks(q);
    if (!result.ok) return Response.json(result, { status: 502, headers: { "cache-control": "no-store" } });
    return Response.json(result, { headers: CACHE });
  }
  const result = await getFeed();
  if (!result.ok) {
    return Response.json(result, { status: 502, headers: { "cache-control": "no-store" } });
  }
  return Response.json(result.feed, { headers: CACHE });
}

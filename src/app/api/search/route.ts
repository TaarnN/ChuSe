import { NextRequest, NextResponse } from "next/server";
import { getWTextData, fetchGoogleSearchResults } from "@/app/utils/search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const num = searchParams.get("num");

  // Validate the query parameter
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  // Fetch Google search results based on the query
  const urls = await fetchGoogleSearchResults(query, num ?? "");

  // Fetch additional data for each URL in parallel
  const results = await Promise.all(
    urls.map(async (url: string) => {
      const data = await getWTextData(url);
      return { ...data, url };
    })
  );

  // Return the results as a JSON response
  return NextResponse.json(results);
}

import { NextRequest, NextResponse } from "next/server";
import { getWTextData, fetchGoogleSearchResults } from "@/app/utils/search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const num = searchParams.get("num");
  const lang = searchParams.get("lang");

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const urls = await fetchGoogleSearchResults(query, num ?? "", lang ?? "en");

  const results = await Promise.all(
    urls.map(async (url: string) => {
      const data = await getWTextData(url);
      return { ...data, url };
    })
  );

  return NextResponse.json(results);
}

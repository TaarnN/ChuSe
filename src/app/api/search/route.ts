import { NextRequest, NextResponse } from "next/server";
import { fetchGoogleSearchResults } from "@/app/utils/search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const num = searchParams.get("num");
  const lang = searchParams.get("lang");
  const isFastMode = searchParams.get("isFastMode");
  const specificweb = searchParams.get("specificweb");

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const isFastModeBool = isFastMode === "true" ? true : false;

  const fetchedResults = await fetchGoogleSearchResults(
    isFastModeBool,
    query,
    num || "",
    lang || "en",
    specificweb || "",
  );

  return NextResponse.json(fetchedResults);
}

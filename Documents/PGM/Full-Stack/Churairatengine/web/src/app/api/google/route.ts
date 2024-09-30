import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  // Validate the query parameter
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const response = await axios.get(`https://www.google.com/search?q=${query}`);
  return NextResponse.json({ gHtmlDat: response.data });
}

import { NextRequest, NextResponse } from "next/server";
import { getWTextData, fetchGoogleSearchResults } from "@/app/utils/search";
import chalk from "chalk";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const num = searchParams.get("num");
  const lang = searchParams.get("lang");
  const isFastMode = searchParams.get("isFastMode");

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const urls = await fetchGoogleSearchResults(
    isFastMode === "true" ? true : false,
    query,
    num ?? "",
    lang ?? "en"
  );
  const isUrlFastMode = urls[0] === "true" ? true : false;
  const urlsResults = urls.slice(1);

  if (!isUrlFastMode) {
    return NextResponse.json(
      await Promise.all(
        urls.slice(1).map(async (url: string) => {
          const data = await getWTextData(url);
          return { ...data, url };
        })
      )
    );
  } else {
    const stringToObject = (str: string) => {
      const object: { [key: string]: string } = {};

      const regex = /(\w+):\s*"([^"]*)"/g;
      let match;

      while ((match = regex.exec(str)) !== null) {
        const key = match[1];
        const value = match[2];
        object[key] = value;
      }

      return object;
    };

    return NextResponse.json(urlsResults.map((str) => stringToObject(str)));
  }
}

// Import necessary server-side modules
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

interface wTextData {
  title: string;
  description: string;
}

// Fetch Google search results
async function fetchGoogleSearchResults(
  isFastMode: boolean = false,
  query: string,
  num: string = "20",
  lang: string = "en"
): Promise<string[]> {
  try {
    const response = await axios.get(
      `https://churairatse.vercel.app/api/google?query=${encodeURIComponent(
        query
      )}&lang=${lang}&num=${num}`
    );

    const $ = cheerio.load(response.data.gHtmlDat);

    if (!isFastMode) {
      const urls: string[] = [];

      $("a[href^='/url']:not(span > a)").each((_, element) => {
        const href = $(element).attr("href");
        if (href && href.includes("/url?q=")) {
          const cleanUrl = href.split("/url?q=")[1]?.split("&")[0];
          if (
            cleanUrl &&
            (cleanUrl.startsWith("https://") ||
              cleanUrl.startsWith("http://")) &&
            !cleanUrl.includes(
              "ANd9GcQjzC2JyZDZ_RaWf0qp11K0lcvB6b6kYNMoqtZAQ9hiPZ4cTIOB"
            )
          ) {
            urls.push(decodeURIComponent(cleanUrl));
          }
        }
      });

      return ["false", ...urls.slice(1, urls.length - 2)];
    } else {
      const descriptions: string[] = [];
      const titles: string[] = [];
      let URLs: string[] = [];

      // Description-G code
      $(
        "div:not([class]) > div:not([class]) > div.BNeawe.s3v9rd.AP7Wnd, div:not([class]) > div.v9i61e > div.BNeawe.s3v9rd.AP7Wnd:not(:has(span))"
      ).each((index, element) => {
        const inner = $(element).html() ?? "";
        if (!(inner?.includes("<span") && inner?.includes("</span"))) {
          descriptions.push(inner);
        } else if (
          inner?.includes("<span") &&
          inner?.includes("</span") &&
          inner.includes("<br")
        ) {
          descriptions.push(inner);
        }
      });

      // Titles-G code
      $("div.BNeawe.vvjwJb.AP7Wnd").each((index, element) => {
        titles.push($(element).html() ?? "");
      });

      // URLs-G code
      $(
        "div > div > a[href^='/url']:not(span > a):not(:has(span)):not(:has(img))"
      ).each((_, element) => {
        const href = $(element).attr("href");
        if (href && href.includes("/url?q=")) {
          const cleanUrl = href.split("/url?q=")[1]?.split("&")[0];
          if (
            cleanUrl &&
            (cleanUrl.startsWith("https://") ||
              cleanUrl.startsWith("http://")) &&
            !cleanUrl.includes(
              "ANd9GcQjzC2JyZDZ_RaWf0qp11K0lcvB6b6kYNMoqtZAQ9hiPZ4cTIOB"
            )
          ) {
            URLs.push(decodeURIComponent(cleanUrl));
          }
        }
      });
      URLs = URLs.slice(1, URLs.length - 2);

      return [
        "true",
        ...URLs.map((url, index) => {
          return `{url: "${url}", title: "${titles[index]}", description: "${descriptions[index]}"}`;
        }),
      ];
    }
  } catch (error) {
    console.error(`Error fetching search results (by search.ts): ${error}`);
    return [];
  }
}

async function getWTextData(url: string): Promise<wTextData> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content") || "";

    return { title, description };
  } catch (error) {
    console.error(`Error fetching site data (wTextData) at "${url}": ${error}`);
    return { title: "", description: "" };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;
  if (typeof query !== "string") {
    return res.status(400).json({ error: "Invalid query" });
  }

  const urls = await fetchGoogleSearchResults(false, query);

  const results = urls.map(async (url) => {
    const wdat = await getWTextData(url);
    console.log({ ...wdat, url });
    return { ...wdat, url };
  });
  res.status(200).json(results);
}

export { getWTextData, fetchGoogleSearchResults };

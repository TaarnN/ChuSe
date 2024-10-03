// Import necessary server-side modules
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

interface wTextData {
  title: string;
  description: string;
}

// Fetch Google search results
async function fetchGoogleSearchResults(query: string): Promise<string[]> {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/google?query=${encodeURIComponent(query)}`
    );

    const $ = cheerio.load(response.data.gHtmlDat);
    const urls: string[] = [];

    // Adjusted selector to target links correctly
    $("a[href^='/url']:not(span > a)").each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        const cleanUrl = href.split("/url?q=")[1]?.split("&")[0];
        if (
          cleanUrl &&
          (cleanUrl.startsWith("https://") || cleanUrl.startsWith("http://"))
        ) {
          urls.push(decodeURIComponent(cleanUrl));
        }
      }
    });

    return urls.slice(1); // Return clean URLs
  } catch (error) {
    console.log(query)
    console.error(`Error fetching search results: ${error}`);
    return [];
  }
}

// Get title and description of a website
async function getWTextData(url: string): Promise<wTextData> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content") || "";

    return { title, description };
  } catch (error) {
    console.error(`Error fetching site data: ${error}`);
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

  const urls = await fetchGoogleSearchResults(query);

  const results = await Promise.all(
    urls.map(async (url) => {
      const data = await getWTextData(url);
      return { ...data, url };
    })
  );

  res.status(200).json(results);
}

export { getWTextData, fetchGoogleSearchResults };

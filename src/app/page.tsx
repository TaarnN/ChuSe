"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface wTextData {
  title: string;
  description: string;
  url: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<wTextData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isShowUrls, setIsShowUrls] = useState<boolean>(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/search`, {
        params: { query },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="my-10 text-5xl font-semibold tracking-wide text-center">
        Churairat Search Engine | beta 0.0.1
      </h1>
      <div className="flex my-4">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search with Churairat"
          className="w-[80vw] ml-[5vw] border-blue-500 active:border-blue-600"
        />
        <Button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-400 active:bg-blue-600 ml-4"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <Button variant={"link"} onClick={() => setIsShowUrls(!isShowUrls)}>
        {!isShowUrls ? "show urls" : "hide urls"}
      </Button>

      {isShowUrls ? (
        <>
          <div className="ml-8 flex">
            <p className="font-semibold mr-4">Churairat SE google api url (html): </p>
            <a
              href={"https://churairatse.vercel.app/api/google?query=" + query}
              target="_blank"
              className="text-emerald-500"
            >
              {"https://churairatse.vercel.app/api/google?query=" + query}
            </a>
          </div>
          <div className="ml-8 flex">
            <p className="font-semibold mr-4">Churairat SE search api url (links): </p>
            <a
              href={"https://churairatse.vercel.app/api/search?query=" + query}
              target="_blank"
              className="text-emerald-500"
            >
              {"https://churairatse.vercel.app/api/search?query=" + query}
            </a>
          </div>
          <div className="ml-8 flex">
            <p className="font-semibold mr-4">google url: </p>
            <a
              href={"https://www.google.com/search?q=" + query}
              target="_blank"
              className="text-emerald-500"
            >
              {"https://www.google.com/search?q=" + query}
            </a>
          </div>
        </>
      ) : (
        <></>
      )}

      <Separator className="my-10 mx-[10vw] w-[80vw]" />

      <div>
        {results.map((result, index) => (
          <div key={index} className="mt-4 ml-8">
            <h2 className="font-medium text-xl sm:text-2xl md:text-3xl max-w-[60vw] md:max-w-[50vw] line-clamp-2">
              {result.title}
            </h2>
            <p className="mb-4 max-w-[70vw] md:max-w-[60vw] text-muted-foreground mt-4 truncate text-base sm:text-md md:text-lg">
              {result.description}
            </p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit"
            >
              <p className="text-blue-400 truncate">
                {decodeURIComponent(result.url)}
              </p>
            </a>
            <Separator className="ml-8 w-[40vw] mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

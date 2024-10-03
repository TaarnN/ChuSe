"use client";

import { useState, useRef, useEffect, SetStateAction } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";

interface wTextData {
  title: string;
  description: string;
  url: string;
}

export default function Home() {
  const pathname = usePathname();
  const qrParams = useSearchParams();
  const qr = qrParams.get("qr");

  const [query, setQuery] = useState(qr);
  const [results, setResults] = useState<wTextData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isShowUrls, setIsShowUrls] = useState<boolean>(false);

  const resultSectionRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    window.history.replaceState(null, "", pathname);
    setQuery("");
  };

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

  useEffect(() => {
    if (results.length > 0) {
      resultSectionRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [results]);

  return (
    <div>
      <div className="h-screen flex flex-col justify-center items-center">
        <Image
          src={"/favicon.ico"}
          alt="logo"
          width={200}
          height={200}
          onClick={handleRefresh}
        />
        <h1
          className="my-10 text-5xl font-semibold tracking-wide text-center border border-black py-3 px-9 rounded-full"
          onClick={handleRefresh}
        >
          Churairat SE
        </h1>
        <div className="flex my-4 flex-col md:flex-row">
          <Input
            type="text"
            value={query ?? ""}
            onChange={(e: {
              target: { value: SetStateAction<string | null> };
            }) => setQuery(e.target.value)}
            placeholder="Search with Churairat"
            className="w-[80vw] border-black active:border-black max-w-[30rem] ml-0"
            onKeyDown={(e: { key: string }) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-black hover:bg-black active:bg-black ml-4 md:mt-0 mt-4"
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
              <p className="font-semibold mr-4">
                Churairat SE google api url (html):{" "}
              </p>
              <a
                href={"http://localhost:3000/api/google?query=" + query}
                target="_blank"
                className="text-emerald-500"
              >
                {"http://localhost:3000/api/google?query=" + query}
              </a>
            </div>
            <div className="ml-8 flex">
              <p className="font-semibold mr-4">
                Churairat SE search api url (links):{" "}
              </p>
              <a
                href={"http://localhost:3000/api/search?query=" + query}
                target="_blank"
                className="text-emerald-500"
              >
                {"http://localhost:3000/api/search?query=" + query}
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
      </div>

      <div
        ref={resultSectionRef}
        className={results.length < 1 ? "" : "pt-[8vh]"}
      >
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

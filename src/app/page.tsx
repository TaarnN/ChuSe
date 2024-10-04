/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect, SetStateAction } from "react";
import axios from "axios";
import run from "./utils/db";
import { useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import { SettingOutlined } from "@ant-design/icons";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const [numMuch, setNumMuch] = useState<string>("20");

  const resultSectionRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    window.history.replaceState(null, "", pathname);
    setQuery("");
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/search`, {
        params: { query, num: numMuch },
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
      {/* Search Settings */}
      <div className="w-fit h-fit fixed top-4 right-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"} className="rounded-xl size-14">
              <SettingOutlined />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Search Settings</DialogTitle>
            </DialogHeader>
            <Separator />
            <div>
              <h1 className="font-medium mb-4">
                Search Results Number{" "}
                <p className="text-red-800">
                  **lots of results may make slow loading
                </p>
              </h1>
              <Select onValueChange={setNumMuch} value={numMuch}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 10, 20, 30, 40, 50, 100].map((value, index) => (
                    <SelectItem key={index} value={`${value}`}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button className="max-w-[10rem] px-12">Ok</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Input */}
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
            placeholder="Search Churairat"
            className="w-[80vw] border-black active:border-black max-w-[30rem] ml-0"
            onKeyDown={(e) => {
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
      </div>

      {/* Search Result */}
      <div
        ref={resultSectionRef}
        className={results.length < 1 ? "" : "pt-[8vh]"}
      >
        {results.map((result, index) => {
          console.log(JSON.stringify(results));

          return (
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
          );
        })}
      </div>
    </div>
  );
}

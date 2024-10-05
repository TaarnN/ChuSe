/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect, SetStateAction } from "react";
import axios from "axios";
import { languages } from "./utils/googleLangs";
import { useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import {
  SettingOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [isLangSelectOpen, setIsLangSelectOpen] = useState(false);

  const [numMuch, setNumMuch] = useState<string>("20");
  const [lang, setLang] = useState<string>("English (US)");
  const [isFastMode, setIsFastMode] = useState("false");

  const resultSectionRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    window.history.replaceState(null, "", pathname);
    setQuery("");
    setResults([]);
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://churairatse.vercel.app/api/search`, {
        params: {
          isFastMode,
          query,
          num: numMuch,
          lang: languages.find((each) => each.label === lang)?.value,
        },
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (loading) {
        const timer = setTimeout(() => {
          setIsLongEnough(true);
        }, 7500);
        return () => clearTimeout(timer);
      } else {
        setIsLongEnough(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div>
      {/* Back to top & Go down Buttons */}
      <div className="fixed w-fit h-fit top-6 left-6 flex">
        <Button
          variant={"outline"}
          className="rounded-xl size-14 mr-4"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <UpCircleOutlined className="text-xl" />
        </Button>
        <Button
          variant={"outline"}
          className="rounded-xl size-14"
          onClick={() =>
            resultSectionRef.current?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <DownCircleOutlined className="text-xl" />
        </Button>
      </div>

      {/* Search Settings */}
      <div className="w-fit h-fit fixed top-6 right-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"} className="rounded-xl size-14">
              <SettingOutlined className="text-xl" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Search Settings</DialogTitle>
            </DialogHeader>
            <Separator />
            <div>
              <h1 className="font-medium mb-4">
                How Much
                <p className="text-red-800 text-sm">
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
            <Separator />
            <div>
              <h1 className="font-medium mb-4">Language</h1>
              <Popover
                open={isLangSelectOpen}
                onOpenChange={setIsLangSelectOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    role="button" // Change "combobox" to "button"
                    aria-expanded={isLangSelectOpen} // Change to boolean value
                    className="w-[200px] justify-between"
                    onClick={() => setIsLangSelectOpen(!isLangSelectOpen)} // Add onClick handler
                  >
                    {lang
                      ? languages.find((language) => language.label === lang)
                          ?.label
                      : "Select language..."}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    >
                      <path
                        d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search language..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            key={language.label}
                            value={language.label}
                            onSelect={(currentValue) => {
                              setLang(
                                currentValue === lang ? "" : currentValue
                              );
                              setIsLangSelectOpen(false);
                            }}
                          >
                            {language.label}
                            <svg
                              className={cn(
                                "ml-auto h-4 w-4",
                                lang === language.label
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                                fill="currentColor"
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Separator />
            <div>
              <h1 className="font-medium mb-4">
                Fast Mode | beta
                <p className="text-red-800 text-sm">
                  **too much results&apos; count may make results incorrect
                </p>
              </h1>
              <Select onValueChange={setIsFastMode} value={isFastMode}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">off</SelectItem>
                  <SelectItem value="true">on</SelectItem>
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

      {/* Search Home */}
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
            className="bg-black hover:bg-black active:bg-black ml-4 md:mr-0 mr-4 md:mt-0 mt-4"
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
        <p
          className={`mt-4 text-orange-300 ${
            !isLongEnough ? "opacity-0" : "opacity-100"
          }`}
        >
          **If loading is very long, recommend changing the language or
          adjusting the results&apos; count less
        </p>
      </div>

      {/* Search Result */}
      <div
        ref={resultSectionRef}
        className={results.length < 1 ? "" : "pt-[8vh]"}
      >
        {results.map((result, index) => {
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

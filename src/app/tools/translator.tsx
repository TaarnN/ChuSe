/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { translateText } from "../utils/translate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { supportedLanguages } from "../utils/langs";
import { cn } from "@/lib/utils";

const Translator = () => {
  const [currTranslateText, setCurrTranslateText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translateTarget, setTranslateTarget] = useState("en");
  const [isTranslateTargetSelectOpen, setIsTranslateTargetSelectOpen] =
    useState(false);

  const handleTranslate = async () => {
    const translatedText = await translateText(
      currTranslateText,
      translateTarget
    );
    setTranslatedText(translatedText);
  };

  return (
    <Card className="mr-[10vw] sm:mr-[30vw] md:mr-[40vw] ml-8">
      <CardHeader>
        <CardTitle className="mb-4 truncate">
          Translator (powered by{" "}
          <a
            href="https://translate.googleapis.com/translate_a/"
            className="text-blue-400"
          >
            https://translate.googleapis.com/translate_a/
          </a>
          )
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <div className="flex items-start flex-col">
          <Input
            type="text"
            value={currTranslateText ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCurrTranslateText(e.target.value)
            }
            placeholder="Translate Text"
            className="w-full border-black active:border-black max-w-[30rem] ml-0"
          />
          <p className="my-4">to</p>
          <Popover
            open={isTranslateTargetSelectOpen}
            onOpenChange={setIsTranslateTargetSelectOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                role="button"
                aria-expanded={isTranslateTargetSelectOpen}
                className="w-[200px] justify-between mb-4"
                onClick={() =>
                  setIsTranslateTargetSelectOpen(!isTranslateTargetSelectOpen)
                }
              >
                {translateTarget
                  ? supportedLanguages.find(
                      (language) => language.value === translateTarget
                    )?.label
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
                  placeholder="Translate Target language..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {supportedLanguages.map((language) => (
                      <CommandItem
                        key={language.value}
                        value={language.label}
                        onSelect={() => {
                          setTranslateTarget(language.value);
                          setIsTranslateTargetSelectOpen(false);
                        }}
                      >
                        {language.label}
                        <svg
                          className={cn(
                            "ml-auto h-4 w-4",
                            translateTarget === language.label
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
          <Button onClick={handleTranslate} className="ml-4">
            Translate
          </Button>
        </div>
        <Input
          className="mt-4"
          value={translatedText ?? "Translation in progress..."}
          readOnly
        />
        <Button
          variant={"outline"}
          size={"icon"}
          className="mt-2"
          onClick={async () => {
            await navigator.clipboard.writeText(translatedText);
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </Button>
      </CardContent>
    </Card>
  );
};

export default Translator;

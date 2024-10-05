import axios from "axios";
import * as cheerio from "cheerio";
import chalk from "chalk";

export const url = "https://google.com/search?q=Hello%20world&lr=lang_en&num=100";

(async () => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

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
        (cleanUrl.startsWith("https://") || cleanUrl.startsWith("http://")) &&
        !cleanUrl.includes(
          "ANd9GcQjzC2JyZDZ_RaWf0qp11K0lcvB6b6kYNMoqtZAQ9hiPZ4cTIOB"
        )
      ) {
        URLs.push(decodeURIComponent(cleanUrl));
      }
    }
  });
  URLs = URLs.slice(1, URLs.length - 2);

  let isBlue = true;

  for (let i = 0; i < URLs.length; i++) {
    if (isBlue) {
      console.log(
        chalk.blue(`
url: ${URLs[i]}
title: ${titles[i]}
description: ${descriptions[i]}`)
      );
    } else {
      console.log(
        chalk.green(`
url: ${URLs[i]}
title: ${titles[i]}
description: ${descriptions[i]}`)
      );
    }

    isBlue = !isBlue;
  }
})();

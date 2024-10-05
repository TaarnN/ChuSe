# Churairat SE

![Favicon](/src/app/faviconsmall.png)

A search engine made for Churairat Purichpapop, because she dropped out of my school. I only want to make for fun and change some UI. Go to the website [click here](https://churairatse.vercel.app/).

## Crawling Steps
Fetch HTML data of google by pattern [https://google.com/search?q=<query><another_queries>...](https://google.com/search?q=query)

```javascript
const response = await axios.get(
  `https://churairatse.vercel.app/api/google?query=${encodeURIComponent(
    query
  )}/* ... another queries */`
);
```

Then use cheerio to get all results URLs

```javascript
const $ = cheerio.load(response.data.gHtmlDat);
$("a[href^='/url']:not(span > a)").each((_, element) => {/* ... */})
```

Next, fetch HTML data of each URLs to get title and description

```javascript
const response = await axios.get(url);
const $ = cheerio.load(response.data);
const title = $("title").text();
const description = $('meta[name="description"]').attr("content") || "";
```

Finally, render the results

```javascript
<div>
  {results.map((result, index) => {/* ... */})}
</div>
```


## Used By

This SE is used by:

- me (only me)

##
By [Somchai Jaidee, Alias, Thailand](https://github.com/TaarnN)
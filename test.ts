import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import chalk from "chalk";
import { url } from "./test2";

console.log("====");

const app = express();

app.get("/", async (req, res) => {
  const response = await axios.get(url);
  res.send(response.data);
});

app.listen(5555);

import express from "express";
const router = express.Router();
import { runCrawler } from "./index.js";

router.get("/api/data", async (req, res, next) => {
  try {
    const { url } = req.query; // Extract the URL from the request body

    if (!url) {
      return res.status(400).json({ error: "URL parameter is missing." });
    }

    // Add any additional checks or validations you need for the URL here
    if (!url.includes("amazon")) {
      return res.status(400).json({ error: `Invalid URL. --- ${url} ` });
    }

    const extractedData = await runCrawler([url]);

    res.json(extractedData);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the data." });
  }
});

export default router;

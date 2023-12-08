import express from "express";
import pkg from "body-parser";
const { json } = pkg;
import { runCrawler } from "./index.js";
import cors from "cors";

const app = express();
const port = 3000 || process.env.PORT;

console.log(process.env.NODE_ENV);

// Middleware to parse JSON data in the request body
app.use(json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV == "dev"
        ? "http://localhost:5173"
        : "https://scamless-frontend.netlify.app",
  })
);

// Create an API endpoint to fetch the extracted data
app.get("/api/data", async (req, res) => {
  try {
    const url = req.query.url; // Extract the URL from the request body

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
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

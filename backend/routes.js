import express from "express";
import axios from "axios";
import dotenv from "dotenv";

const router = express.Router();
import { runCrawler } from "./index.js";
dotenv.config();

// Python api url
const pyApi =
  process.env.NODE_ENV === "production"
    ? "https://webscraping-9qas.onrender.com/"
    : "http://127.0.0.1:4000/";

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

    // Make a request to the Flask API running on localhost:4000
    // Example usage

    axios
      .post(pyApi + "api", {
        data: extractedData, // Pass the extracted data to the Flask API
      })
      .then((response) => {
        // Access the response data directly
        console.log(response.data.param_from_nodejs.data);
        const test = response.data.param_from_nodejs.data;
        // Send the response after 'test' has been assigned
        console.log("test", test);
        res.json(test);
        return test;
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here
        res
          .status(500)
          .json({ error: "An error occurred while fetching the data." });
      });

    // res.json(extractedData);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the data." });
  }
});

export default router;

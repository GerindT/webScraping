import express from "express";
import axios from "axios";
import dotenv from "dotenv";

const router = express.Router();
import { runCrawler } from "./index.js";
import { runSearchCrawler } from "./crawling.js";
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
      .then(async (response) => {
        // Access the response data directly
        console.log(response.data.param_from_nodejs.data);
        const test = response.data.param_from_nodejs.data;
        // Send the response after 'test' has been assigned
        console.log("test", test);

        const searchTerm =
          test[0].descriptionFeatures[11].split(" ")[0] +
          " " +
          test[0].descriptionFeatures[11].split(" ")[1] +
          " " +
          test[0].descriptionFeatures.slice(0, 10).join(" ") +
          " " +
          test[0].price;

        console.log("searchTerm", searchTerm);
        let price = test[0].price;
        const priceWithoutDollarSign = price.replace(/\$/g, "");

        const relatedItems = await runSearchCrawler(
          searchTerm,
          priceWithoutDollarSign - 10,
          priceWithoutDollarSign + 10
        );

        test[0].relatedItems = relatedItems;

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
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the data." });
  }
});
//debuging endpoint
router.get("/api/crawl", async (req, res, next) => {
  try {
    const { searchTerm, price } = req.query; // Extract the searchTerm from the request body

    if (!searchTerm) {
      return res.status(400).json({ error: "Search terms are missing." });
    }

    const extractedData = await runSearchCrawler(
      searchTerm,
      price - 10,
      price + 10
    );

    res.json(extractedData);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the data." });
  }
});

export default router;

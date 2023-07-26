import express from 'express';
import pkg from 'body-parser';
const { json } = pkg;
import { Dataset } from 'crawlee';
import { runCrawler } from './index.js';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware to parse JSON data in the request body
app.use(json());
app.use(cors({
  origin: 'http://127.0.0.1:5173'
}));
// Serve the static files for the browser extension
// app.use('extension');

// Create an API endpoint to fetch the extracted data
app.get('/api/data', async (req, res) => {
  try {
    const urls = [ 
      // "https://www.amazon.com/2021-Apple-10-2-inch-iPad-Wi-Fi/dp/B09G9FPHY6/ref=lp_16225009011_1_2?sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D",
      "https://www.amazon.com/Womens-Kitten-Pointed-Elegant-Wedding/dp/B0B1ZTKV2C?ref_=Oct_DLandingS_D_86924c50_0&th=1",
      "https://www.amazon.com/Apple-Generation-Cancelling-Transparency-Personalized/dp/B0BDHWDR12/ref=lp_16225009011_1_1?sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D",
      "https://www.amazon.com/AmazonBasics-Performance-Alkaline-Batteries-Count/dp/B00LH3DMUO/ref=lp_16225009011_1_4?sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D",
     
    ];

    // Call the runCrawler function to get the extracted data
    const extractedData = await runCrawler(urls);

    res.json(extractedData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the data.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

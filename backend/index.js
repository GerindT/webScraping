import puppeteer from "puppeteer-extra"; // Change this line
import StealthPlugin from "puppeteer-extra-plugin-stealth"; // Add this line

import dotenv from "dotenv";
dotenv.config();

// Add these lines to use the stealth plugin
puppeteer.use(StealthPlugin());

function deriveReviewsURL(productURL) {
  // Extract the product ID from the URL
  const productIdMatch = productURL.match(
    /\/dp\/(\w+)|\/([A-Za-z0-9]{10})(?=\/|$)/
  );
  if (!productIdMatch || productIdMatch.length < 3) {
    console.error("Unable to extract product ID from the URL");
    return null;
  }

  const productId = productIdMatch[1] || productIdMatch[2];

  // Construct the reviews URL
  const reviewsURL = `https://www.amazon.com/product-reviews/${productId}/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews`;

  return reviewsURL;
}

async function scrapeProductDetails(url) {
  const data = { description: "" };

  let customArgs = ["--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"];

  const browser = await puppeteer.launch({
    headless: "New",
    args: process.env.NODE_ENV === "production" ? customArgs : [],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  const page = await browser.newPage();

  await page.goto(`${url}`, {
    waitUntil: "domcontentloaded",
  });

  // Scrape the price
  const price = await page.$eval("span.a-offscreen", (element) =>
    element.textContent.trim()
  );
  console.log(`Price: ${price}`);
  data["price"] = price;

  // Scrape the product title
  const productTitle = await page.$eval("span#productTitle", (element) =>
    element.textContent.trim()
  );
  console.log(`Product Title: ${productTitle}`);
  data["productTitle"] = productTitle;
  // Scrape the product details
  const productDetails = await page.$$eval(
    "div.product-facts-detail",
    (elements) =>
      elements.map((element) => {
        const key = element
          .querySelector(
            "div.a-fixed-left-grid-col.a-col-left span.a-color-base"
          )
          .textContent.trim();
        const value = element
          .querySelector(
            "div.a-fixed-left-grid-col.a-col-right span.a-color-base"
          )
          .textContent.trim();
        return { [key]: value };
      })
  );
  console.log(`Product Details: ${JSON.stringify(productDetails)}`);
  data["productDetails"] = productDetails;

  // Scrape the about item information
  const descriptionItem = await page.$$eval(
    "ul.a-unordered-list.a-vertical.a-spacing-small li span.a-list-item",
    (elements) => elements.map((item) => item.textContent.trim())
  );
  const descriptionItemText = descriptionItem.join(" ");
  console.log(`About Item: ${descriptionItemText}`);
  data["descriptionItem"] = descriptionItemText;

  // Scrape the product details
  const generalProductDetails = await page.$$eval(
    "table.a-normal.a-spacing-micro tr",
    (elements) =>
      elements.map((element) => {
        const key = element
          .querySelector("td.a-span3 span.a-size-base.a-text-bold")
          .textContent.trim();
        const value = element
          .querySelector("td.a-span9 span.a-size-base.po-break-word")
          .textContent.trim();
        return { [key]: value };
      })
  );
  console.log(`Product Details: ${JSON.stringify(generalProductDetails)}`);
  data["generalProductDetails"] = generalProductDetails;

  // Scrape the description
  const generalDescriptionItem = await page.$$eval(
    "ul.a-unordered-list.a-vertical.a-spacing-mini li.a-spacing-mini span.a-list-item",
    (elements) => elements.map((item) => item.textContent.trim())
  );
  const description = generalDescriptionItem.join(" ");
  data["generalDescriptionItem"] = description;

  return data;
}

async function scrapeReviewsByRating(url, filterRating) {
  let customArgs = ["--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"];

  const browser = await puppeteer.launch({
    headless: "New",
    args: process.env.NODE_ENV === "production" ? customArgs : [],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  const page = await browser.newPage();

  const reviewsUrl = deriveReviewsURL(url);
  await page.goto(`${reviewsUrl}&filterByStar=${filterRating}`, {
    waitUntil: "domcontentloaded",
  });
  let pageNum = 1;
  let flRating = filterRating;
  const data = {};

  while (true) {
    const reviews = await page.$$('div[data-hook="review"]');
    if (reviews.length === 0) break;

    for (const review of reviews) {
      const author = await review.$eval(".a-profile-name", (element) =>
        element.textContent.trim()
      );
      let reviewText = null;
      try {
        reviewText = await review.$eval(
          ".a-size-base.review-text.review-text-content > span",
          (element) => (element.textContent ? element.textContent.trim() : "")
        );
      } catch (error) {
        console.error("Error fetching review text:", error.message);
      }
      const rating = await review.$eval(".a-icon-alt", (element) =>
        element.textContent.trim()
      );
      let ratingDescription = null;
      try {
        ratingDescription = await review.$eval(
          ".a-size-base.a-color-base.review-title",
          (element) => {
            const spanElement = element.querySelectorAll("span");
            return spanElement && spanElement[2].textContent
              ? spanElement[2].textContent.trim()
              : "";
          }
        );
      } catch (error) {
        console.error("Error fetching rating description:", error.message);
      }
      const time = await review.$eval(
        'span[data-hook="review-date"]',
        (element) => element.textContent.trim()
      );

      console.log(`Author: ${author}`);
      console.log(`Review: ${reviewText}`);
      console.log(`Rating: ${rating}`);
      console.log(`Rating Description: ${ratingDescription}`);
      console.log(`Time: ${time}`);

      console.log("---");

      if (!data.hasOwnProperty(flRating)) {
        data[flRating] = []; // Initialize the array if it doesn't exist
      }

      data[flRating].push({
        author,
        rating,
        ratingDescription,
        reviewText,
        time,
        filterRating,
      });
    }

    const nextPageButton = await page.$("li.a-last a");
    if (!nextPageButton) break;

    pageNum++;
    console.log(`Scraping reviews from page ${pageNum}`);
    await nextPageButton.click();
    await page.waitForTimeout(2000);
  }

  await browser.close();
  return data;
}

export async function runCrawler(urls) {
  const dataset = [];
  const starRatings = [
    "five_star",
    "four_star",
    "three_star",
    "two_star",
    "one_star",
  ]; // Change this array based on your needs

  for (const [index, url] of urls.entries()) {
    console.log(`Scraping reviews for ${index}`);
    if (!dataset[index]) {
      dataset[index] = { url, totalreviews: [] };
    }
    const baseData = await scrapeProductDetails(urls);

    console.log(baseData);

    dataset[index] = { ...dataset[index], ...baseData };
    for (const rating of starRatings) {
      const reviewData = await scrapeReviewsByRating(url, rating);
      for (const review of reviewData[rating]) {
        const timeString = review.time;
        const dateRegex = /on (.*)/;
        const match = timeString.match(dateRegex);

        if (match) {
          const dateString = match[1];
          review.date = new Date(dateString);

          // Extract the year from the date
          const year = review.date.getFullYear();

          // Initialize the year object if it doesn't exist
          if (!dataset[index].reviewsByYear) {
            dataset[index].reviewsByYear = {};
          }

          if (!dataset[index].reviewsByYear[year]) {
            dataset[index].reviewsByYear[year] = {
              five_star: 0,
              four_star: 0,
              three_star: 0,
              two_star: 0,
              one_star: 0,
            };
          }

          // Increment the count for the rating
          dataset[index].reviewsByYear[year][rating]++;
        } else {
          review.date = null;
        }
      }
      dataset[index].totalreviews.push(...reviewData[rating]);

      if (!dataset[index].hasOwnProperty(rating)) {
        dataset[rating] = []; // Initialize the array if it doesn't exist
      }
      dataset[index][rating] = reviewData[rating];
    }
  }

  console.log(dataset);
  for (const data of dataset) {
    console.log(`Number of reviews for ${data.totalreviews.length}:`);
  }
  return dataset;
}

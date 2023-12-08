import { launch } from "puppeteer";

function deriveReviewsURL(productURL) {
  // Extract the product ID from the URL
  const productIdMatch = productURL.match(/\/dp\/(\w+)\//);
  if (!productIdMatch || productIdMatch.length < 2) {
    console.error("Unable to extract product ID from the URL");
    return null;
  }

  const productId = productIdMatch[1];

  // Construct the reviews URL
  const reviewsURL = `https://www.amazon.com/product-reviews/${productId}/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews`;

  return reviewsURL;
}

async function scrapeReviewsByRating(url, filterRating) {
  const browser = await launch({ headless: "New" });

  const page = await browser.newPage();

  await page.goto(`${url}&filterByStar=${filterRating}`, {
    waitUntil: "domcontentloaded",
  });

  const title = await page.$eval('div[data-hook="review"]', (element) =>
    element.textContent.trim()
  );
  console.log(`Reviews for ${filterRating} stars - ${title}`);

  let pageNum = 1;
  let flRating = filterRating;
  const data = { url, totalreviews: [] };

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
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.error("Error fetching review text:", error.message);
      }
      const rating = await review.$eval(".a-icon-alt", (element) =>
        element.textContent.trim()
      );
      const ratingDescription = await review.$eval(
        ".a-size-base.a-color-base.review-title",
        (element) => {
          const spanElement = element.querySelectorAll("span");
          return spanElement ? spanElement[2].textContent.trim() : "";
        }
      );
      const time = await review.$eval(
        'span[data-hook="review-date"]',
        (element) => element.textContent.trim()
      );
      let itemDetails = "";
      try {
        itemDetails = await review.$eval(
          'a[data-hook="format-strip"]',
          (element) => element.textContent.trim()
        );
      } catch (error) {
        console.error("Error fetching item details:", error.message);
      }

      console.log(`Author: ${author}`);
      console.log(`Review: ${reviewText}`);
      console.log(`Rating: ${rating}`);
      console.log(`Rating Description: ${ratingDescription}`);
      console.log(`Time: ${time}`);

      console.log("---");

      data.totalreviews.push({
        author,
        rating,
        ratingDescription,
        reviewText,
        time,
        filterRating,
      });

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

  for (const url of urls) {
    for (const rating of starRatings) {
      const data = await scrapeReviewsByRating(deriveReviewsURL(url), rating);
      for (const review of data.totalreviews) {
        const timeString = review.time;
        const dateRegex = /on (.*)/;
        const match = timeString.match(dateRegex);

        if (match) {
          const dateString = match[1];
          review.date = new Date(dateString);
        } else {
          review.date = null;
        }
      }
      dataset.push(data);
    }
  }

  console.log(dataset);
  for (const data of dataset) {
    console.log(
      `Number of reviews for ${data.url}: ${data.totalreviews.length}`
    );
  }
  return dataset;
}

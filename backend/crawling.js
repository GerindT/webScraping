import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";

dotenv.config();

puppeteer.use(StealthPlugin());

async function searchAmazon(keyword, minPrice, maxPrice) {
  const browser = await puppeteer.launch({
    headless: false,
    args: process.env.NODE_ENV === "production" ? customArgs : [],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();

  await page.goto("https://www.amazon.com/");

  // Type the search keyword
  await page.type("input#twotabsearchtextbox", keyword);

  // Navigate to Amazon

  await Promise.all([
    page.click('input.nav-input[type="submit"]'),
    page.waitForNavigation(), // Wait for navigation to complete
  ]);

  // Wait for the search results to load
  await page.waitForSelector(".s-result-list");

  const items = await page.$$(".s-result-item");

  let scrapedProducts = [];

  for (const item of items) {
    const priceElement = await item.$(".a-price span.a-offscreen");
    if (priceElement) {
      const priceString = await priceElement.evaluate(
        (node) => node.textContent
      );
      const price = parseFloat(priceString.replace(/[^0-9.]+/g, ""));
      if (price >= minPrice && price <= maxPrice) {
        const name = await item.$eval("h2 span", (node) =>
          node.textContent.trim()
        );
        const img = await item.$eval("img", (node) => node.src);
        let url = await item.$eval("h2 a", (node) => node.getAttribute("href"));
        url = `https://www.amazon.com${url}`;
        const ratingElement = await item.$("span.a-icon-alt");
        const rating = ratingElement
          ? await ratingElement.evaluate((node) => node.textContent.trim())
          : "No rating";
        scrapedProducts.push({ name, price, img, url, rating });
        if (scrapedProducts.length === 3) {
          break;
        }
      }
    }
  }

  await browser.close();
  return scrapedProducts;
}

export async function runSearchCrawler(searchTerm, minPrice, maxPrice) {
  const keyword = searchTerm;
  const products = await searchAmazon(keyword, minPrice, maxPrice);
  console.log("Scraped Products:", products);
  return products;
}

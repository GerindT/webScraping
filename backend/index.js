import { launch } from 'puppeteer';

async function scrapeReviews(url) {
  const browser = await launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const title = await page.$eval('div[data-hook="review"]', (element) => element.textContent.trim());
  console.log(title);

  async function loadAllReviews() {
    while (true) {
      const loadMoreButton = await page.$('a[data-hook="see-all-reviews-link-foot"]');
      if (loadMoreButton) {
        await loadMoreButton.click();
        await page.waitForTimeout(2000);
      } else {
        break;
      }
    }
  }

  await loadAllReviews();

  let pageNum = 1;
  const data = { url, reviews: [] };

  while (true) {
    // Get all individual review elements
    const reviews = await page.$$('div[data-hook="review"]');
    if (reviews.length === 0) break; // No more reviews, exit the loop

    for (const review of reviews) {
      const author = await review.$eval('.a-profile-name', (element) => element.textContent.trim());
      const reviewText = await review.$eval('.a-size-base.review-text.review-text-content > span', (element) => element.textContent.trim());
      const rating = await review.$eval('.a-icon-alt', (element) => element.textContent.trim());
      const ratingDescription = await review.$eval('.a-size-base.a-color-base.review-title', (element) => {
        const spanElement = element.querySelectorAll('span'); // Get the first span element inside the review parent element
        return spanElement ? spanElement[2].textContent.trim() : ''; // Return its text content if found, or an empty string if not found
      });
      const time = await review.$eval('span[data-hook="review-date"]', (element) => element.textContent.trim());
      let itemDetails = '';
      try {
        itemDetails = await review.$eval('a[data-hook="format-strip"]', (element) => element.textContent.trim());
      } catch (error) {
        console.error('Error fetching item details:', error.message);
      }


      console.log(`Author: ${author}`);
      console.log(`Review: ${reviewText}`);
      console.log(`Rating: ${rating}`);
      console.log(`Rating Description: ${ratingDescription}`);
      console.log(`Time: ${time}`);

      console.log('---');

      data.reviews.push({
        author,
        rating,
        ratingDescription,
        reviewText,
        time,
        itemDetails,
      });
    }

    // Check if there is a next page and navigate to it if available
    const nextPageButton = await page.$('li.a-last a');
    if (!nextPageButton) break; // No more pages to scrape, exit the loop

    pageNum++;
    console.log(`Scraping reviews from page ${pageNum}`);
    await nextPageButton.click();
    await page.waitForTimeout(2000);
  }
    // Navigate to the full FAQ section
    // const faqLink = await page.$('.askSeeAllQuestionsLink'); // Replace 'your-faq-link-selector' with the correct selector for the FAQ link
    // if (faqLink) {
    //   await faqLink.click();
    //   await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    // }
  
    // // Scrape the FAQ section
    // const questionsAnswers = await page.evaluate(() => {
    //   const faqData = [];
    //   const questionElements = document.querySelectorAll('.askTeaserQuestions > div > div > span');

    //   questionElements.forEach(questionElement => {
    //     const question = questionElement.textContent.trim();

    //     // Get the associated answer for each question (if available)
    //     const answerElement = questionElement.closest('.a-spacing-top-small')?.querySelector('.a-expander-content > span');
    //     const answer = answerElement ? answerElement.textContent.trim() : '';

    //     faqData.push({ question, answer });
    //   });

    //   return faqData;
    // });

    // console.log("faqdata",questionsAnswers)
  
    // data.faq = questionsAnswers; // Add the FAQ data to the 'data' object
  

  await browser.close();
  return data;
}

export async function runCrawler(urls) {
  const dataset = [];

  for (const url of urls) {
    const data = await scrapeReviews(url);
    for (const review of data.reviews) {
      const timeString = review.time; // Assuming the time is stored in the "time" property
      const dateRegex = /on (.*)/;  // Regular expression to match the first part of the time string (YYYY-MM-DD)
   
      const match = timeString.match(dateRegex);

      if (match) {
        const dateString = match[1];
        review.date = new Date(dateString);
      } else {
        review.date = null; // If the time string doesn't match the expected format, set the date to null
      }
   
    }
    dataset.push(data);
  }

  console.log(dataset);
  for (const data of dataset) {
    console.log(`Number of reviews for ${data.url}: ${data.reviews.length}`);
  }
  return dataset;
}

// runCrawler([
//   "https://www.amazon.com/Womens-Kitten-Pointed-Elegant-Wedding/dp/B0B1ZTKV2C?ref_=Oct_DLandingS_D_86924c50_0&th=1",
//   // Add more URLs here if needed
// ]);

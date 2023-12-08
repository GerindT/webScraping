import asyncio
from datetime import datetime
import re
from pyppeteer import launch


async def scrape_reviews(url):
    browser = await launch(headless=True)
    page = await browser.newPage()

    await page.goto(url, {"waitUntil": "domcontentloaded"})

    title = await page.evaluate(
        "() => document.querySelector('div[data-hook=\"review\"]').textContent.trim()"
    )
    print(title)

    async def load_all_reviews():
        while True:
            load_more_button = await page.querySelector(
                'a[data-hook="see-all-reviews-link-foot"]'
            )
            if load_more_button:
                await load_more_button.click()
                await asyncio.sleep(2)
            else:
                break

    await load_all_reviews()

    page_num = 1
    data = {"url": url, "reviews": []}

    while True:
        reviews = await page.querySelectorAll('div[data-hook="review"]')
        if not reviews:
            break

        for review in reviews:
            author = await review.querySelectorEval(
                ".a-profile-name", "(element) => element.textContent.trim()"
            )
            review_text = await review.querySelectorEval(
                ".a-size-base.review-text.review-text-content > span",
                "(element) => element.textContent.trim()",
            )
            rating = await review.querySelectorEval(
                ".a-icon-alt", "(element) => element.textContent.trim()"
            )
            rating_description = await review.querySelectorEval(
                ".a-size-base.a-color-base.review-title",
                "(element) => (element.querySelectorAll('span')[2] || {}).textContent.trim()",
            )
            time = await review.querySelectorEval(
                'span[data-hook="review-date"]',
                "(element) => element.textContent.trim()",
            )
            item_details = ""
            try:
                item_details = await review.querySelectorEval(
                    'a[data-hook="format-strip"]',
                    "(element) => element.textContent.trim()",
                )
            except Exception as error:
                print(f"Error fetching item details: {error}")

            print(f"Author: {author}")
            print(f"Review: {review_text}")
            print(f"Rating: {rating}")
            print(f"Rating Description: {rating_description}")
            print(f"Time: {time}")
            print("---")

            data["reviews"].append(
                {
                    "author": author,
                    "rating": rating,
                    "ratingDescription": rating_description,
                    "reviewText": review_text,
                    "time": time,
                    "itemDetails": item_details,
                }
            )

        next_page_button = await page.querySelector("li.a-last a")
        if not next_page_button:
            break

        page_num += 1
        print(f"Scraping reviews from page {page_num}")
        await next_page_button.click()
        await asyncio.sleep(2)

    await browser.close()
    return data


async def run_crawler(urls):
    dataset = []

    for url in urls:
        data = await scrape_reviews(url)
        for review in data["reviews"]:
            time_string = review["time"]
            date_regex = r"on (.*)"
            match = re.search(date_regex, time_string)

            if match:
                date_string = match.group(1)
                review["date"] = datetime.strptime(date_string, "%B %d, %Y")
            else:
                review["date"] = None

        dataset.append(data)

    print(dataset)
    for data in dataset:
        print(f'Number of reviews for {data["url"]}: {len(data["reviews"])}')
    return dataset


if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(
        run_crawler(
            [
                "https://www.amazon.com/Womens-Kitten-Pointed-Elegant-Wedding/dp/B0B1ZTKV2C?ref_=Oct_DLandingS_D_86924c50_0&th=1",
                # Add more URLs here if needed
            ]
        )
    )

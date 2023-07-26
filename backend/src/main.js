// main.js
import { CheerioCrawler, KeyValueStore, log } from 'crawlee';
import { router } from './routes.js';

// Grab our keyword from the input
// const { keyword = 'iphone' } = (await KeyValueStore.getInput()) ?? {};

const crawler = new CheerioCrawler({

    requestHandler: router,
});

// Add our initial requests
await crawler.addRequests([
    {
        // Turn the inputted keyword into a link we can make a request with
        url: `https://www.amazon.com/Womens-Kitten-Pointed-Elegant-Wedding/dp/B0B1ZTKV2C?ref_=Oct_DLandingS_D_86924c50_0&th=1`,
        label: 'START',
        userData: {
            keyword,
        },
    },
]);

log.info('Starting the crawl.');
await crawler.run();
log.info('Crawl finished.');
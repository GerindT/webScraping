// routes.js
import { createCheerioRouter, Dataset } from 'crawlee';
import { BASE_URL, labels } from './constants.js';

export const router = createCheerioRouter();


router.addHandler(labels.START, async ({ $, crawler, request }) => {
    const title = $('span[id="productTitle"]').text().trim();
    console.log(title);
    const price = $('span[class="a-profile-name"]').text().trim();
    console.log(price);
    const description = $('div[class="a-row a-spacing-small review-data"]').text().trim();
    console.log(description);
});

// router.addHandler(labels.START, async ({ $, crawler, request }) => {
//     const { keyword } = request.userData;

//     const products = $('div > div[data-asin]:not([data-asin=""])');

//     for (const product of products) {
//         const element = $(product);
//         const titleElement = $(element.find('.a-text-normal[href]'));

//         const url = `${BASE_URL}${titleElement.attr('href')}`;

//         await crawler.addRequests([
//             {
//                 url,
//                 label: labels.PRODUCT,
//                 userData: {
//                     data: {
//                         title: titleElement.first().text().trim(),
//                         asin: element.attr('data-asin'),
//                         itemUrl: url,
//                         keyword,
//                     },
//                 },
//             },
//         ]);
//     }
// });

// router.addHandler(labels.PRODUCT, async ({ $, crawler, request }) => {
//     const { data } = request.userData;

//     const element = $('div#productDescription');

//     await crawler.addRequests([
//         {
//             url: `${BASE_URL}/gp/aod/ajax/ref=auto_load_aod?asin=${data.asin}&pc=dp`,
//             label: labels.OFFERS,
//             userData: {
//                 data: {
//                     ...data,
//                     description: element.text().trim(),
//                 },
//             },
//         },
//     ]);
// });

// router.addHandler(labels.OFFERS, async ({ $, request }) => {
//     const { data } = request.userData;

//     for (const offer of $('#aod-offer')) {
//         const element = $(offer);

//         await Dataset.pushData({
//             ...data,
//             sellerName: element.find('div[id*="soldBy"] a[aria-label]').text().trim(),
//             offer: element.find('.a-price .a-offscreen').text().trim(),
//         });
//     }
// });
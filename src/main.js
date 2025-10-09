/**
 * This template is a production ready boilerplate for developing with `PlaywrightCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

// For more information, see https://docs.apify.com/sdk/js
import { Actor } from 'apify';
// For more information, see https://crawlee.dev
import { PlaywrightCrawler } from 'crawlee';

// this is ESM project, and as such, it requires you to specify extensions in your relative imports
// read more about this here: https://nodejs.org/docs/latest-v18.x/api/esm.html#mandatory-file-extensions
import { router } from './routes.js';

// Initialize the Apify SDK
await Actor.init();

const { query = 'monster hunter' } = (await Actor.getInput()) ?? {};

const startUrls = [`https://game8.co/search?cx=b7c4d19dfceb64d24&ie=UTF-8&query=${encodeURIComponent(query)}`];

const crawler = new PlaywrightCrawler({
    requestHandler: router,
    launchContext: {
        launchOptions: {
            args: [
                '--disable-gpu', // Mitigates the "crashing GPU process" issue in Docker containers
            ],
        },
    },
});

await crawler.run(startUrls);

// Exit successfully
await Actor.exit();
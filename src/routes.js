import { createPlaywrightRouter, Dataset } from 'crawlee';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ page, enqueueLinks, log }) => {
    log.info(`enqueueing new URLs from search page`);
    // Wait for the search results to load
    await page.waitForSelector('.gsc-results a.gs-title');

    await enqueueLinks({
        selector: '.gsc-results a.gs-title',
        label: 'detail',
    });
});

router.addHandler('detail', async ({ request, page, log }) => {
    const title = await page.title();
    log.info(`Scraping ${title}`, { url: request.loadedUrl });

    // Wait for the main content to load
    await page.waitForSelector('div.archive-style-wrapper');

    const content = await page.locator('div.archive-style-wrapper').textContent();

    await Dataset.pushData({
        url: request.loadedUrl,
        title,
        content,
    });
});
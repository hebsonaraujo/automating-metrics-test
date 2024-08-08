import { CONFIG_PAGE } from "./config/config.js";

export async function startPage(browser,url) {
    const page = await browser.newPage();
    console.log(`Browsing... ${url}`);
    await page.goto(url, {
        waitUntil: CONFIG_PAGE.waitUntil
    });
    return page;
}
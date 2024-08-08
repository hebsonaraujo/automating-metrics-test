import { startBrowser } from "./browser.js";
import { startPage } from "./page.js";

/**
 * 
 * @param {*} url 
 * @returns 
 */
export async function initPuppeteer(url) {
    //Start the browser and create a browser instance
    let browserInstance = await startBrowser();
    let pageInstance = await startPage(browserInstance,url);
    return [browserInstance, pageInstance]
}
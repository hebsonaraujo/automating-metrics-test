import puppeteer from "puppeteer";
import { CONFIG_BROWSER } from "./config/config.js";

export async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser...");
        browser = await puppeteer.launch({
            headless: CONFIG_BROWSER.headless,
            args: CONFIG_BROWSER.args
        });
    } catch (err) {
        console.error('An error has occured in Browser:', err);
    }
    return browser;
}
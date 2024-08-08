import { initPuppeteer } from "../puppeteer-services/index.js";

export async function scrapeComponent(componentFunction,URI) {
    const [browserInstance, page] = await initPuppeteer(URI);
    try {
      await componentFunction(page);
    } catch (error) {
      console.error('An error has occured on scrapeComp:', error);
    } finally {
      if (browserInstance) {
        await browserInstance.close();
      }
    }
}
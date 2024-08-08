import {
    PATH,
    TEMPLATE_PIANO_DATA,
    TEST_CONFIG,
    REPORTS_CONFIG,
    METRICS_DATA
} from "./data.js";
import {
    EVENTS,
    NAVIGATION,
    TIME,
    ACTIVATE_LOAD_IFRAME,
    ACTION_INSIDE_IFRAME
} from "../../puppeteer-events/events.js";

const { DEFAULT_TIME } = TEST_CONFIG;

async function iterateOverSelectors(page) {
    const {
        selectorsInsideIframe,
        iframeId,
        iframeWrapper,
        activatedBy: {
            mode,
            selectorToActivate
        }
    } = TEMPLATE_PIANO_DATA;
    for (let index = 0; index < selectorsInsideIframe.length; ++index) {
        let selector = selectorsInsideIframe[index];

        await ACTIVATE_LOAD_IFRAME[mode](page, DEFAULT_TIME, selectorToActivate, iframeWrapper);

        await EVENTS.screenShot(page, PATH, 'paywall');

        try {
            await ACTION_INSIDE_IFRAME[mode](page, iframeId, selector, DEFAULT_TIME);
            EVENTS.screenShot(page, PATH, `step-${index}`);
        } catch (error) {
            console.error('Ocorreu um erro ao interagir com o frame:', error);
            await TIME.waitTime(page, DEFAULT_TIME);
        }

        if (selector !== 'button.close') {
            await NAVIGATION.back(page);
        }
    }
}
export async function component(page) {
    console.log('Component loading...');
    EVENTS.console(page, PATH, REPORTS_CONFIG, METRICS_DATA.filterFields);
    await iterateOverSelectors(page);

    if (TEST_CONFIG.waitForNavigation) {
        await page.waitForNavigation();
    }
}
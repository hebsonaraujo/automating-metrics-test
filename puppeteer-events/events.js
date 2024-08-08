import fs from 'fs';

const log = (message, PATH, saveFileMethod = 'append', fileType) => {
    const logFile = `log.${fileType}`;
    if (saveFileMethod === 'append') {
        fs.appendFileSync(`${PATH}/logs/${logFile}`, fileType === 'json' ? JSON.stringify(message) : message + '\n');
    }
    if (saveFileMethod === 'override') {
        fs.writeFile(`${PATH}/logs/${logFile}`, JSON.stringify(message), function (err) {
            if (err) throw err;
        })
    }
};
const report = (PATH, metricsData,byConsole = false) => {
    const report = `
    <html>
      <head>
        <title>Relatório de Teste</title>
      </head>
      <body>
        <h1>Relatório de Teste</h1>
        <h2>Métricas</h2>
        <pre>${JSON.stringify(metricsData, null, 2)}</pre>
        <h2>Capturas de Tela</h2>
      </body>
    </html>
  `;
    if(byConsole) {
        console.log('--- Tests Reports ---');
        console.log('\nMétricas:');
        console.log(JSON.stringify(metricsData, null, 2));
    }

    fs.writeFileSync(`${PATH}/report/html/test-report.html`, report);

};
const metricsData = [];

function filterObject(obj, fields) {
    const filteredObj = {};
    for (const field of fields) {
        if (obj.hasOwnProperty(field)) {
            filteredObj[field] = obj[field];
        }
    }
    return filteredObj;
}
function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
}
function isObject(object) {
    return object != null && typeof object === 'object';
}
export const EVENTS = {
    interceptConsole: (page, textToMatch) => {
        return new Promise((resolve) => {
            page.on('console', (message) => {
                const text = message.text();
                if (text.includes(textToMatch)) {
                    const value = text.split(': ')[1];
                    resolve(value);
                }
            })
        });
    },
    console: (page, PATH, REPORTS_CONFIG, filterFields) => page.on('console',  message => {
        ['countEvent', 'countClick'].forEach(async (el) => {
            if (message.text().includes(el)) {
                const keyPuppeteer = message.args()[0];
                const valuePuppeteer = message.args()[1];
                const value =  await valuePuppeteer.jsonValue();
                const key =  await  keyPuppeteer.jsonValue();
                const result = filterObject(value, filterFields);
                if (metricsData.length === 0) {
                    metricsData.push(result);
                } else {
                    const arr = metricsData.find(el => deepEqual(el, result))
                    if (!arr) {
                        metricsData.push(result);
                    }
                }
                REPORTS_MODULE(REPORTS_CONFIG, PATH, key, value, metricsData);
            }
        })
    }),
    click: async (page, selector) => page.click(selector),
    screenShot: async (page, path, fileName) => await page.screenshot({
        path: `${path}/screenshot/${fileName}.png`
    }),
    savePdfFile: async (page, path, fileName, format) => await page.pdf({
        path: `${path}/report/pdf/${fileName}.pdf`,
        format: `${format}`
    }),
    waitMySelector: async (page, mySelector) => await page.waitForSelector(mySelector),
    type: async (page, mySelector, text, delay) => page.type(mySelector, text, {delay: delay})
}
export const IFRAME = {
    getMyIframe: async (page, iframeSelector) => {
        const frame = await page.waitForSelector(iframeSelector);
        return await frame.contentFrame();
    },
    click: async (page, iframeID, selector) => {
        const frame = await page.waitForSelector(iframeID);
        const iFrame = await frame.contentFrame();
        const elementInsideIframe = await iFrame.waitForSelector(selector);
        await elementInsideIframe.click();
    }
}
export const TIME = {
    waitTime: async (page, time) => await page.waitForTimeout(time)
}
export const NAVIGATION = {
    back: async (page) => {
        page.evaluate(() => {
            history.back()
        })
        await page.waitForNavigation({
            waitUntil: 'domcontentloaded'
        });
    }
}
export const ACTIVATE_LOAD_IFRAME = {
    click: async (page, DEFAULT_TIME, selectorToActivate, iframeWrapper) => {
        await TIME.waitTime(page, DEFAULT_TIME);
        await EVENTS.click(page, selectorToActivate);
        await page.waitForSelector(iframeWrapper);
    },
    waitModal: async (page, DEFAULT_TIME, selectorToActivate, iframeWrapper) => {
        await TIME.waitTime(page, DEFAULT_TIME);
        await page.waitForSelector(iframeWrapper);
    },
    bounce: async (page) => {},

}
export const ACTION_INSIDE_IFRAME = {
    click: async (page, iframeId, selector, DEFAULT_TIME) => {
        await IFRAME.click(page, iframeId, selector);
        await TIME.waitTime(page, DEFAULT_TIME);
    },
    waitModal: async (page, iframeId, selector, DEFAULT_TIME) => {
        await IFRAME.click(page, iframeId, selector);
        await TIME.waitTime(page, DEFAULT_TIME);
    },
    bounce: async (page) => {},
    iterateOverSelectors: async (page) => {},
}

const REPORTS_MODULE = (REPORTS_CONFIG, PATH, key, value, metricsData) => {
    if (REPORTS_CONFIG.viewByTerm) {
        console.info(key, value);
    }
    if (REPORTS_CONFIG.viewByLog) {
        log(JSON.stringify(key) + JSON.stringify(value), PATH, 'append', 'txt');
    }
    if (REPORTS_CONFIG.viewByJSON) {
        log(metricsData, PATH, 'override', 'json');
    }
    if (REPORTS_CONFIG.viewReport) {
        report(PATH, metricsData)
    }
    if(REPORTS_CONFIG.viewReportByTerm) {
        report(PATH, metricsData,true);
    }
};
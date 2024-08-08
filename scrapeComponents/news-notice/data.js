
export const URI = 'MY_URL';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const PATH = resolve(dirname(fileURLToPath(new URL(import.meta.url))));

/**
 * Config's data refers to a paywall to be tested
 * Activation type: click, modal,etc
 */
export const TEMPLATE_PIANO_DATA = {
    activatedBy: {
        mode: 'click',
        selectorToActivate: '.btn'
    },
    iframeId: 'iframe[id^="offer_"]',
    iframeWrapper: '.tp-iframe-wrapper.tp-active',
    selectorsInsideIframe: ['.assine-cinema_item__oTrkM.offer','.sign','.back','.closed']
}
/**
 * Configs to reports
 */
export const REPORTS_CONFIG = {
    viewByTerm: false,
    viewByLog: false,
    viewByJSON: true,
    viewPDF: false,
    viewReport: true,
    viewReportByTerm: true
};

/**
 * Configurações de teste, tempo padrão de espera entre ações e
 * aguardar após todas as ações serem realizadas.
 */
export const TEST_CONFIG = {
    waitForNavigation: true,
    DEFAULT_TIME: 2500,
}

export const METRICS_DATA = {
    filterFields: ['component','reference','pTemplate','action','paywallType'],
}


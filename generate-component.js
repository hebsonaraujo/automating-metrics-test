import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
/**
 * Criar um novo dir: node generate-component.js nome-do-componente
 * Ex: node generate-component.js myNewContextToTest
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentName = process.argv[2];

if (!componentName) {
  console.error('Por favor, forneça um nome para o componente.');
  process.exit(1);
}

const scrapeComponentsPath = path.join(__dirname, 'scrapeComponents');
const componentPath = path.join(scrapeComponentsPath, componentName);
const subdirectories = ['logs', 'report', 'screenshot', 'test'];

const indexSnippet = `
  import { scrapeComponent } from '../scrapeComponent.js';
  import { component } from './component.js';
  import { URI } from "./data.js";

  scrapeComponent(component, URI);
`;
const dataSnippet = `
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
`
const componentSnippet = `
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
        } catch (error) {
            await TIME.waitTime(page, DEFAULT_TIME);
        }

        if (selector !== 'button.close') {
            await NAVIGATION.back(page);
        }
    }
}

export async function component(page) {
    console.log('Componente carregado....');

    EVENTS.console(page, PATH, REPORTS_CONFIG, METRICS_DATA.filterFields);

    await iterateOverSelectors(page);

    if (TEST_CONFIG.waitForNavigation) {
        await page.waitForNavigation();
    }
}
`
const dataComponentSnippet = componentSnippet
  .replace(/\n\s+/g, '\n')
  .trim();
const cleanedCode = indexSnippet
    .replace(/\n\s+/g, '\n')
    .trim();
const dataCleanedCode = dataSnippet
    .replace(/\n\s+/g, '\n')
    .trim();
try {
  // Cria o diretório scrapeComponents se ainda não existir
  await fs.mkdir(scrapeComponentsPath, { recursive: true });
  // Cria o diretório principal do componente
  await fs.mkdir(componentPath);
  // Cria os subdiretórios
  await Promise.all(subdirectories.map((dir) => fs.mkdir(path.join(componentPath, dir))));
  // Cria os arquivos component.js, data.js e index.js
  await fs.writeFile(path.join(componentPath, 'component.js'), dataComponentSnippet);
  await fs.writeFile(path.join(componentPath, 'data.js'), dataCleanedCode);
  await fs.writeFile(path.join(componentPath, 'index.js'), cleanedCode);
  console.log(`O componente "${componentName}" foi criado com sucesso.`);
} catch (error) {
  console.error('Ocorreu um erro ao criar o componente:', error);
}

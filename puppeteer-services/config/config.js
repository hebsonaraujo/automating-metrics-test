export const CONFIG_BROWSER = {
    headless: false,
    args: [
        '--no-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
    ]
}
export const CONFIG_PAGE = {
    waitUntil: 'networkidle2',
    waitForNavigation: true
}

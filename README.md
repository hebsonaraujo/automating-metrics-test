# Using Puppeteer to Automate Metric Triggers

## Context:
- Use of paywalls in marketing campaigns and digital product sales.
- Constant changes in campaigns, requiring the development of paywalls for various contexts.
- Paywalls can have different layouts, appear in various contexts, and trigger specific metrics in each scenario.
- The need to track each user action: every action (click, impression, etc.) on the paywalls triggers a different metric.

## Problem:
- Each campaign context needs to be tested, including interactions on the paywalls, clicks, and impressions.
- Each new campaign must be thoroughly tested to ensure that metrics are correctly triggered.
- This task is extremely repetitive for developers who need to test if the rules were applied correctly, as well as for QAs who need to validate if everything is functioning as expected.

## Solution:
- Automate the process with [Puppeteer](https://pptr.dev/), which allows you to control the browser and simulate actions within it.
- Create a tool that abstracts the necessary Puppeteer resources, making it easier to trigger metrics step by step.
- The tool can be used by both QAs and developers without needing in-depth knowledge of Puppeteer.

## How It Works:
1. To create a new context, use the command `node generate-component.js MyNewContext` in the root directory. This script generates the initial structure of the context to be tested, creating a new directory inside the `scrapeComponents` folder. In this directory, you will find the files `component.js`, `data.js`, `index.js`, and the folders `logs`, `report`, `screenshot` (where trigger evidence and captured screens are stored), and `test` (where you can add assertions and compare the triggered metric with what should have been triggered — **TODO: this feature is still under development**).

2. **`data.js`:** Contains the URL of the context where the paywall occurs, the method of activation (whether it's via click or appears after a few seconds of page load), the triggers (CSS selectors) that need to be activated to check the metric, report configuration data (PDF, HTML, JSON), and the data for the metric that should be triggered.

3. **`component.js`:** Uses the tool's resources (navigation, events, etc.) and the URL and trigger data to iterate over them.

4. **`index.js`:** This is the starting point of the test. It uses the URL (defined in `data.js`) and follows the steps for actions on the URL as outlined in `component.js`.

5. For each context where a paywall occurs and needs to be tested, a directory is created with all the necessary information for its test: occurrence URL, triggers that activate the metric, and the step-by-step actions.

6. **Metric Capture:** Each metric triggered via click on the paywalls is logged in the browser console. Puppeteer is used to capture this information directly from the console, allowing you to monitor and validate if the correct metrics are being triggered.

7. Context/components directories should be located in `scrapeComponents`.

## Available Resources:
- Script to create the structure of a new context using the command `node generate-component.js MyNewContext` in the root directory.
- Capture metrics directly from the browser console, enabling precise validation of clicks and other interactions.
- Save the requested metrics in JSON, HTML, or PDF formats, or view them in the terminal.
- For each triggered action/trigger, screenshots are taken. (Since the actions are asynchronous, sometimes screenshots may be blank; in this case, you can refine the intervals between each action to ensure the captures are made correctly.)

## How to Use:
1. To create a new context, use the command `node generate-component.js MyNewContext` in the root directory.
2. Navigate to the `scrapeComponents` directory.
3. Run the command `node folder`, where `folder` is the directory corresponding to the component/paywall you intend to test the metrics for.

## Example of Use:
1. `cd scrapeComponents`
2. `node MyNewContextTest`

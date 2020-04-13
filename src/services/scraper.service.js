const logger = require("../services/log.service");

const { Capabilities, Builder, By, Key, until } = require("selenium-webdriver");

var chrome = require("selenium-webdriver/chrome");

const browser = "chrome";
const server = "http://selenium:4444/wd/hub";

const options = new chrome.Options();

options.addArguments("--headless");

const builder = new Builder()
  .forBrowser(browser)
  .usingServer(server)
  .withCapabilities(Capabilities.chrome())
  .setChromeOptions(options);

async function nav(url, fn) {
  try {
    const driver = await builder.build();

    try {
      await driver.get(url);
      await fn(driver);
    } finally {
      await driver.quit();
    }
  } catch (e) {
    logger.sendError(e);
  }
}

module.exports = {
  nav,
  By,
  Key,
  Until: until,
};

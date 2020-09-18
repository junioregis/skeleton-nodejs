const cron = require("../cron.service");
const selenium = require("../selenium.service");
const logger = require("../logger.service");

class GoogleScraper {
  constructor() {
    this.name = "scrap";
    this.cron = "* * * * *";
  }

  start() {
    const url = "https://www.google.com/ncr";
    const query = "Rick and Morty";

    cron.start(this.name, this.cron, () => {
      selenium.nav(url, async (driver) => {
        await driver
          .findElement(selenium.By.name("q"))
          .sendKeys(query, selenium.Key.RETURN);

        await driver.wait(selenium.Until.titleContains(query), 1000);

        const result = await driver.findElements(selenium.By.className("g"));

        const item = await result[0].findElement(selenium.By.tagName("h3"));

        const title = await item.getText();

        logger.i(`[scrap] ${title}`);
      });
    });
  }

  stop() {
    cron.stop(name);
  }
}

module.exports = new GoogleScraper();

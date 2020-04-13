const cron = require("../cron.service");
const scraper = require("../scraper.service");
const log = require("../log.service");

const name = "scrap";

function start() {
  const url = "https://www.google.com/ncr";
  const query = "Rick and Morty";

  cron.start(name, "* * * * *", () => {
    scraper.nav(url, async (driver) => {
      await driver
        .findElement(scraper.By.name("q"))
        .sendKeys(query, scraper.Key.RETURN);

      await driver.wait(scraper.Until.titleContains(query), 1000);

      const result = await driver.findElements(scraper.By.className("g"));

      const item = await result[0].findElement(scraper.By.tagName("h3"));

      const title = await item.getText();

      log.i(title);
    });
  });
}

function stop() {
  cron.stop(name);
}

module.exports = {
  start,
  stop,
};

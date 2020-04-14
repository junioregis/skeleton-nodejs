const Cron = require("node-cron");

const log = require("./log.service");

class CronService {
  constructor() {
    this.tasks = [];
  }

  start(name, cron, fn) {
    log.i(`[cron] creating task: "${name}" (${cron})`);

    const task = {
      name: name,
      cron: cron,
      instance: Cron.schedule(cron, fn),
    };

    this.tasks.push(task);
  }

  stop(name) {
    const task = tasks.find((item) => {
      return item.name === name;
    });

    if (typeof task !== "undefined") {
      task.instance.stop();
    }
  }
}

module.exports = new CronService();

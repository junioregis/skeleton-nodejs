const { IncomingWebhook } = require("@slack/webhook");

const config = require("../config");
const logger = require("../services/logger.service");

class SlackService {
  constructor() {
    this.webhook = new IncomingWebhook(config.slack.webHook);
  }

  buildInfo(message) {
    return {
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: `:robot_face: ${message}` },
        },
      ],
    };
  }

  buildError(message, error) {
    const body = {
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: `:bangbang: :robot_face: ${message}` },
        },
      ],
    };

    if (error !== undefined) {
      body.blocks.push({
        type: "section",
        text: { type: "mrkdwn", text: `\`\`\`${stacktrace}\`\`\`` },
      });
    }

    return body;
  }

  async send(body) {
    const response = await this.webhook.send(body);

    if (response.text !== "ok") {
      logger.e("[slack] error on send slack message", false);
    }
  }

  async i(message) {
    const body = this.buildInfo(message);

    try {
      await this.send(body);
    } catch (e) {
      logger.e(`[slack] ${e}`, false);
    }
  }

  async e(message) {
    const body = this.buildError(message);

    try {
      await this.send(body);
    } catch (e) {
      logger.e(`[slack] ${e}`, false);
    }
  }
}

module.exports = new SlackService();

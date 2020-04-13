const config = require("../config");
const log = require("../services/log.service");

const { IncomingWebhook } = require("@slack/webhook");

const webhook = new IncomingWebhook(config.slack.webHook);

function buildInfo(message) {
  return {
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: `:robot_face: ${message}` },
      },
    ],
  };
}

function buildError(message, error) {
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

async function send(body) {
  const response = await webhook.send(body);

  if (response.text !== "ok") {
    log.e("error on send slack message", false);
  }
}

exports.i = async (message) => {
  const body = buildInfo(message);

  try {
    await send(body);
  } catch (e) {
    log.e(e, false);
  }
};

exports.e = async (message) => {
  const body = buildError(message);

  try {
    await send(body);
  } catch (e) {
    log.e(e, false);
  }
};

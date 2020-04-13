#!/usr/bin/env node

const deployer = require("../deploy/deployer");
const logger = require("../deploy/logger");

const [, , ...args] = process.argv;

const stage = args[0];
const cmd = args[1];

logger.a(
  "\n██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗██████╗\n██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔══██╗\n██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  ██████╔╝\n██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══██╗\n██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║   ███████╗██║  ██║\n╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝\n"
);

logger.a(`STAGE: ${stage}\n`);

switch (cmd) {
  case "config":
    deployer.config(stage);
    break;
  case "deploy":
    deployer.deploy(stage);
    break;
  case "rollback":
    deployer.rollback(stage);
    break;
  default:
    logger.e(`invalid command: ${cmd}\n`);
}

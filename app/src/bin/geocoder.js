#!/usr/bin/env node

const Geocoder = require("./geocoder/geocoder");

const { logger } = require("./geocoder/util");

const [, , ...args] = process.argv;

const cmd = args[0];

logger.a(
  " ██████╗ ███████╗ ██████╗  ██████╗ ██████╗ ██████╗ ███████╗██████╗\n██╔════╝ ██╔════╝██╔═══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗\n██║  ███╗█████╗  ██║   ██║██║     ██║   ██║██║  ██║█████╗  ██████╔╝\n██║   ██║██╔══╝  ██║   ██║██║     ██║   ██║██║  ██║██╔══╝  ██╔══██╗\n╚██████╔╝███████╗╚██████╔╝╚██████╗╚██████╔╝██████╔╝███████╗██║  ██║\n ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝"
);

const geocoder = new Geocoder();

switch (cmd) {
  case "update":
    geocoder.update();
    break;
  default:
    logger.e(`invalid command: ${cmd}\n`);
}

"use strict";

const Helpers = use("Helpers");
const Env = use("Env");

module.exports = {
  default: "local",

  disks: {
    local: {
      root: Helpers.tmpPath(),
      driver: "local"
    }
  }
};

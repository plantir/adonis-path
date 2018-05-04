"use strict";
const Drive = use("Drive");
class LogController {
  async index({ response }) {
    let file = await Drive.get("adonis.log", "utf-8");
    let logs = file.match(/\{*.*\}/g);
    if (logs && logs.length) {
      logs = logs.map(log => {
        return JSON.parse(log);
      });
    }
    response.json(logs || []);
  }
}

module.exports = LogController;

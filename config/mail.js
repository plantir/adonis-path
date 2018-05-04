"use strict";
const Env = use("Env");

module.exports = {
  connection: "noReplay",

  orders: {
    driver: "smtp",
    service: "Zoho",
    host: "smtp.zoho.com",
    port: 465,
    secure: false,
    requireTLS: false,
    auth: {
      user: "orders@cashineh.com",
      pass: "orderhacashorderha15"
    }
  },

  noReply: {
    driver: "smtp",
    service: "Zoho",
    host: "smtp.zoho.com",
    port: 465,
    secure: false,
    requireTLS: false,
    auth: {
      user: "noreply@cashineh.com",
      pass: "Bedoonejavab9"
    }
  },

  support: {
    driver: "smtp",
    service: "Zoho",
    host: "smtp.zoho.com",
    port: 465,
    secure: false,
    requireTLS: false,
    auth: {
      user: "support@cashineh.com",
      pass: "Alekolangotisheh88"
    }
  }
};

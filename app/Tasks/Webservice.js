"use strict";

const Task = use("Task");
const Merchant = use("App/Models/Merchant");
const MerchantWebservice = use("MerchantWebservice");
const Env = use("Env");
class WebserviceShedule extends Task {
  static get schedule() {
    return Env.get("NODE_ENV") === "development"
      ? "*/4 54 15 * * 0"
      : "0 0 6 * * 4";
  }

  async handle() {
    let date = new Date();
    let merchants = await Merchant.query()
      .where("isDeleted", 0)
      .where("have_webservice", 1);

    merchants.forEach(merchant => {
      let service = new MerchantWebservice(merchant, date);
      service.call();
    });
  }
}

module.exports = WebserviceShedule;

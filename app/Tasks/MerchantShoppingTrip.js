"use strict";

const Task = use("Task");
const Merchant = use("App/Models/Merchant");
const Env = use("Env");
const Mail = use("Mail");
class MerchantShoppingTrip extends Task {
  static get schedule() {
    // return "0 0 0 0 0 0";
  }

  async handle() {
    let merchants = await Merchant.all();
    let day = new Date();
    let dd = day.getDate();
    let mm = day.getMonth() + 1;
    let yyyy = day.getFullYear();
    let date = yyyy + "-" + mm + "-" + dd;
    for (const merchant of merchants.rows) {
      if (merchant.is_static_commission || merchant.have_webservice) {
        continue;
      }
      let orders = await merchant
        .shopping_trips()
        .where("order_at", date)
        .fetch();
      if (!orders || orders.rows.length === 0) {
        continue;
      }
      const url =
        Env.get("NODE_ENV") == "development"
          ? "http://localhost:9000/#"
          : "https://cashineh.com";
      const mail_to =
        Env.get("NODE_ENV") == "development"
          ? "arminkheirkhahan@gmail.com"
          : merchant.email;
      await Mail.connection("orders").send(
        "emails.merchant_shopping_trip",
        { merchant: merchant, url: url, date: date },
        message => {
          message
            .to(mail_to)
            .from("orders@cashineh.com")
            .subject("لیست سفارشات ثبت شده از سمت کشینه");
        }
      );
      console.log("success");
    }
  }
}

module.exports = MerchantShoppingTrip;

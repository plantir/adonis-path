"use strict";

const Task = use("Task");
const pdf = use("html-pdf");
const View = use("View");
const Helpers = use("Helpers");
const Merchant = use("App/Models/Merchant");
const Order = use("App/Models/Order");
const Invoice = use("App/Models/Invoice");
const Env = use("Env");
const Drive = use("Drive");
const moment = use("moment-jalaali");
const Logger = use("Logger");
const Mail = use("Mail");

View.global("toCurrency", function(number, n, x, s, c) {
  n = n || 0;
  number = number || 0;
  number = number.toString();
  const re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\D" : "$") + ")";
  let formatted_number = number.replace(new RegExp(re, "g"), "$&" + (s || ","));
  return formatted_number;
});
View.global("persianDigit", function(number) {
  if (number || number === 0) {
    return number.toString().replace(/\d+/g, function(digit) {
      var enDigitArr = [],
        peDigitArr = [];
      for (var i = 0; i < digit.length; i++) {
        enDigitArr.push(digit.charCodeAt(i));
      }
      for (var j = 0; j < enDigitArr.length; j++) {
        peDigitArr.push(
          String.fromCharCode(
            enDigitArr[j] + (!!number && number === true ? 1584 : 1728)
          )
        );
      }
      return peDigitArr.join("");
    });
  } else {
    return number;
  }
});
View.global("persianDate", function(date, format) {
  if (date) {
    try {
      return moment(date).format(format || "jYYYY/jM/jD");
    } catch (error) {
      return date;
    }
  } else {
    return date;
  }
});

class Invoice_schdeule extends Task {
  static get schedule() {
    return Env.get("NODE_ENV") === "development"
      ? "*/4 17 16 * * 0"
      : "0 0 6 * * 4";
  }

  async handle() {
    let date_range = this._getLastWeek();
    let merchants = await Merchant.all();
    for (let merchant of merchants.rows) {
      let orders = await Order.query()
        .where("merchant_id", merchant.id)
        .where("is_compeleted", 1)
        .whereBetween("updated_at", date_range);
      if (!orders || orders.length === 0) {
        continue;
      }
      let total_amount = 0;
      let total_commission_amount = 0;
      for (let order of orders) {
        total_amount += order.total_amount;
        total_commission_amount += order.commission_amount || 0;
      }
      let invoice = await Invoice.query()
        .orderBy("id", "DESC")
        .first();
      let id = invoice ? invoice.id + 1 : 1;
      const payment_deadline = this._payment_deadline(merchant.payment_period);
      let html = View.render("invoice", {
        merchant: merchant,
        orders: orders,
        total_amount: total_amount,
        invoice_number: id,
        payment_deadline: payment_deadline,
        invoice_date: new Date(),
        total_commission_amount: total_commission_amount
      });
      const base = Env.get("APP_URL");
      const options = { format: "Letter", base: base };
      pdf.create(html, options).toStream(async (err, buffer) => {
        if (err) return console.log(err);
        await Drive.put(`invoices/invoice_${id}.pdf`, buffer);
        await Invoice.create({
          merchant_id: merchant.id,
          pdf_url: `${Env.get("APP_URL")}/admin/invoice/view/invoice_${id}.pdf`
        });
        if (!merchant.email) {
          Logger.transport("file").error(
            " این فروشگاه ایمیل ندارد %s",
            this.merchant.name
          );
        }
        const mail = Env.get("NODE_ENV") === "development" ? "arminkheirkhahan@gmail.com":merchant.mail
        await Mail.connection("orders").send("emails.invoice", merchant.toJSON(), message => {
          message
            .attach(Helpers.tmpPath(`invoices/invoice_${id}.pdf`), {
              filename: `invoice_${id}.pdf`
            })
            .to(mail)
            .from("orders@cashineh.com")
            .subject("فاکتور سفارشات کشینه");
        });
      });
    }
  }

  _getLastWeek() {
    const today = new Date();
    const yesterday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    );
    yesterday.setHours(23, 59, 59);
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    return [lastWeek, yesterday];
  }

  _payment_deadline(days) {
    const today = new Date();
    const payment_deadline = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + days
    );
    return payment_deadline;
  }
}

module.exports = Invoice_schdeule;

"use strict";

const Task = use("Task");
const Env = use("Env");
const Order = use("App/Models/Order");
class OrderReturnGuarantee extends Task {
  static get schedule() {
    return Env.get("NODE_ENV") === "development"
      ? "*/4 * * * * *"
      : "0 0 6 * * *";
  }

  async handle() {
    let orders = await Order.query()
      .where("expire_return_guarantee", 0)
      .fetch();
    for (let order of orders.rows) {
      let is_expire = this._checkDate(order.toJSON());
      if (is_expire) {
        order.expire_return_guarantee = true;
        await order.save();
      }
    }
  }

  _checkDate(order) {
    let crate_date = new Date(order.created_at).getTime();
    let expire_time = order.return_guarantee || 7 * 24 * 60 * 1000;
    let expire_date = crate_date + expire_time;
    let now = new Date().getTime();
    return expire_date < now;
  }
}

module.exports = OrderReturnGuarantee;

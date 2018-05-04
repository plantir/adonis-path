"use strict";

const Order = use("App/Models/Order");
const Resource = use("MyResource");
class OrderController extends Resource {
  constructor() {
    super();
    this.Model = Order;
    this.allowField = ["order_detail","cashback_amount","commission_amount","is_completed","order_id","order_status","total_amount"];
  }
  async show({ response, request, params: { id } }) {
    let item = await this.Model.find(id);
    await item.loadMany(["user", "merchant"]);
    response.status(200).send(item);
  }

}

module.exports = OrderController;

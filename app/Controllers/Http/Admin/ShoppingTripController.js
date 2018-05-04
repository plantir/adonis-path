"use strict";

const ShoppingTrip = use("App/Models/ShoppingTrip");
const Resource = use("MyResource");
class ShoppingTripController extends Resource {
  constructor() {
    super();
    this.Model = ShoppingTrip;
    this.allowField = [
      "total_amount",
      "shopping_status",
      "order_id",
      "cashback_status",
      "cashback_amount",
      "commission_status",
      "commission_amount"
    ];
  }
  async show({ response, request, params: { id } }) {
    let item = await this.Model.find(id);
    await item.loadMany(["user", "merchant"]);
    response.status(200).send(item);
  }
}

module.exports = ShoppingTripController;

"use strict";
const Order = use("App/Models/Order");
const Merchant = use("App/Models/Merchant");
const ShoppingTrip = use("App/Models/ShoppingTrip");
class OrderController {
  async save_order({ request, response }) {
    let { shopping_trip_id, url } = request.post();
    let data = request.only([
      "order_detail",
      "total_amount",
      "order_id",
      "order_date",
      "shopping_trip_id"
    ]);
    let merchant = await Merchant.query()
      .where("url", "like", `%${url}%`)
      .first();
    if (!merchant) {
      return response.status(500).send("merchant not found");
    }
    let shopping_trip = await ShoppingTrip.find(shopping_trip_id);
    if (!shopping_trip) {
      return response.status(500).send("shopping_trip not found");
    }
    if (shopping_trip.id !== 1 && shopping_trip.merchant_id !== merchant.id) {
      return response
        .status(500)
        .send("shopping_trip is not for this merchant");
    }
    shopping_trip.shopping_status = 1;
    await shopping_trip.save();
    data.user_id = shopping_trip.user_id;
    data.merchant_id = shopping_trip.merchant_id;
    data.order_detail = data.order_detail && JSON.stringify(data.order_detail);
    await new Order().customCreate(data);
    return "success";
  }
  async test() {
    await Order.create({
      user_id: 109,
      merchant_id: 35,
      shopping_trip_id: 1
    });
    return "success";
  }
}

module.exports = OrderController;

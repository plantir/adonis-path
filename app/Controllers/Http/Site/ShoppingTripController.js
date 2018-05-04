"use strict";
const Merchant = use("App/Models/Merchant");
const ShoppingTrip = use("App/Models/ShoppingTrip");
const Category = use("App/Models/Category");
const User = use("App/Models/User");
const Order = use("App/Models/Order");
const UserTransaction = use("App/Models/UserTransaction");
const MerchantTransaction = use("App/Models/MerchantTransaction");
class ShoppingTripController {
  async merchant_shopping_trips({ request, response }) {
    const { merchant_id, token, date } = request.get();
    let merchant = await Merchant.find(merchant_id);
    if (merchant.token !== token) {
      return response.status(401).send("permission denied");
    }
    let shopping_trips = await merchant
      .shopping_trips()
      .where("order_at", date)
      .fetch();

    return shopping_trips;
  }

  async save_merchant_shopping_trips({ request, response }) {
    const { merchant_id, token, items } = request.post();
    const merchant = await Merchant.find(merchant_id);
    if (merchant.token !== token) {
      return response.status(401).send("permission denied");
    }
    for (let item of items) {
      let shoppingTrip = await ShoppingTrip.find(item.id);
      if (!shoppingTrip) {
        continue;
      }
      shoppingTrip.cashback_amount = 0;
      shoppingTrip.commission_amount = 0;
      shoppingTrip.total_amount = 0;
      for (let order of item.order_detail) {
        let category = await merchant
          .merchant_category()
          .where("category_id", order.category)
          .first();
        shoppingTrip.total_amount += order.price * order.quantity;
        order.cashback = category.cashback;
        order.cashback_amount =
          order.price.toString().replace(/,/g, "") * order.cashback / 100;
        order.commission = category.commission;
        order.commission_amount =
          order.price.toString().replace(/,/g, "") * order.commission / 100;
        shoppingTrip.cashback_amount += order.cashback_amount;
        shoppingTrip.commission_amount += order.commission_amount;
      }
      shoppingTrip.order_detail = JSON.stringify(item.order_detail);
      await shoppingTrip.save();
      let userTransaction = await UserTransaction.query()
        .where("source_type", 3)
        .where("source_id", item.id)
        .first();
      if (!userTransaction) {
        await UserTransaction.create({
          user_id: shoppingTrip.user_id,
          source_id: shoppingTrip.id,
          source_type: 3,
          status: 0,
          title: `کش بک`,
          description: `بابت خرید از سایت ${merchant.name}`,
          value: shoppingTrip.cashback_amount,
          value_status: 1
        });
        let user = await User.find(shoppingTrip.user_id);
        user.mobile &&
          (await user.sendSMS("", user.mobile, {
            total_amount: shoppingTrip.total_amount,
            merchant_name: merchant.name,
            cashback_value: shoppingTrip.cashback_amount
          }));
      } else {
        userTransaction.value = shoppingTrip.cashback_amount;
        await userTransaction.save();
      }
      let merchantTransaction = await MerchantTransaction.query()
        .where("source_id", item.id)
        .first();
      if (!merchantTransaction) {
        await MerchantTransaction.create({
          merchant_id: shoppingTrip.merchant_id,
          source_id: shoppingTrip.id,
          status: 0,
          title: `کش بک`,
          description: `بابت خرید از سایت ${merchant.name}`,
          value: shoppingTrip.commission_amount,
          payment_status: 0
        });
      } else {
        merchantTransaction.value = shoppingTrip.commission_amount;
        await merchantTransaction.save();
      }
    }
    return true;
  }

  async save_shopping_trip({ request, response }) {
    let { shopping_trip_id, id } = request.post();
    let data = request.only([
      "order_detail",
      "total_amount",
      "order_id",
      "shopping_trip_id"
    ]);
    let merchant = await Merchant.findBy("utm_id", id);
    if (!merchant) {
      return response.status(500).send("merchant not found");
    }
    let shopping_trip = await ShoppingTrip.find(shopping_trip_id);
    if (!shopping_trip) {
      return response.status(500).send("shopping_trip not found");
    }
    if (shopping_trip.merchant_id !== merchant.id) {
      return response
        .status(500)
        .send("shopping_trip is not for this merchant");
    }
    shopping_trip.shopping_status = 1;
    await shopping_trip.save();

    data.order_detail = data.order_detail && JSON.stringify(data.order_detail);
    await new Order().customCreate(data);

    return "success";
  }
}

module.exports = ShoppingTripController;

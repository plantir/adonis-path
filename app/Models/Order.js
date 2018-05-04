"use strict";

const Model = use("MyModel");
const ShoppingTrip = use("App/Models/ShoppingTrip");
class Order extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeCreate", "OrderHook.beforeCreate");
    this.addHook("afterCreate", "OrderHook.afterCreate");
    this.addHook("beforeUpdate", "OrderHook.beforeUpdate");
    this.addHook("afterUpdate", "OrderHook.afterUpdate");
  }

  merchant() {
    return this.belongsTo("App/Models/Merchant");
  }

  ShoppingTrip() {
    return this.belongsTo("App/Models/ShoppingTrip");
  }
  user() {
    return this.belongsTo("App/Models/User");
  }

  static listOption(qs) {
    qs.withArray = ["user", "merchant"];
    return super.listOption(qs);
  }

  async customCreate(data) {
    let shopping_trip = await ShoppingTrip.find(data.shopping_trip_id);
    let merchant = await shopping_trip.merchant().fetch();
    let user = await shopping_trip.user().fetch();
    data.merchant_id = merchant.id;
    data.user_id = user.id;
    if (merchant.is_static_commission) {
      data.cashback_amount =
        data.total_amount * merchant.current_cashback_value / 100;
      data.commission_amount = data.total_amount * merchant.commission / 100;
      data.is_compeleted = 1;
    }
    let order = await Order.query()
      .where("shopping_trip_id", data.shopping_trip_id)
      .first();
    if (!order) {
      await Order.create(data);
    }
  }
}

module.exports = Order;

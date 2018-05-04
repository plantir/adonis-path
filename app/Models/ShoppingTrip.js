"use strict";

const Model = use("MyModel");

class ShoppingTrip extends Model {
  merchant() {
    return this.belongsTo("App/Models/Merchant");
  }

  user() {
    return this.belongsTo("App/Models/User");
  }

  static listOption(qs) {
    qs.withArray = ["user", "merchant"];
    return super.listOption(qs);
  }
}

module.exports = ShoppingTrip;

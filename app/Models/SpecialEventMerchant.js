"use strict";

const Model = use("MyModel");

class SpecialEventMerchant extends Model {
  merchants() {
    return this.belongsTo("App/Models/Merchant");
  }
}

module.exports = SpecialEventMerchant;

"use strict";

const Model = use("MyModel");

class MerchantCategory extends Model {
  category() {
    return this.belongsTo("App/Models/Category");
  }
  categories() {
    return this.belongsTo("App/Models/Category");
  }
  merchant() {
    return this.belongsTo("App/Models/Merchant");
  }
  merchants() {
    return this.belongsTo("App/Models/Merchant");
  }
}

module.exports = MerchantCategory;

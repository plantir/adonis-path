"use strict";

const Model = use("MyModel");

class MerchantTransaction extends Model {
  merchant() {
    return this.belongsTo("App/Models/Merchant");
  }
  static listOption(qs) {
    qs.withArray = ["merchant"];
    return super.listOption(qs);
  }
}

module.exports = MerchantTransaction;

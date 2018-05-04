"use strict";

const Model = use("MyModel");

class Invoice extends Model {
  static listOption(qs) {
    qs.withArray = ["merchant"];
    return super.listOption(qs);
  }
  merchant() {
    return this.belongsTo("App/Models/Merchant");
  }
}

module.exports = Invoice;

"use strict";

const Model = use("MyModel");

class Offer extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeCreate", async item => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      item.expiry_date = item.expiry_date || new Date(year + 10, month, day);
    });
  }
  merchant() {
    return this.belongsTo("App/Models/Merchant");
  }
  static listOption(qs) {
    qs.withArray = ["merchant"];
    return super.listOption(qs);
  }
}

module.exports = Offer;

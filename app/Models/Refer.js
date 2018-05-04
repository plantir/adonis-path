"use strict";

const Model = use("MyModel");

class Refer extends Model {
  refer_by() {
    return this.belongsTo("App/Models/User", "referred_by");
  }

  refer_to() {
    return this.belongsTo("App/Models/User", "referred_to");
  }
  static listOption(qs) {
    qs.withArray = ["refer_by", "refer_to"];
    return super.listOption(qs);
  }
}

module.exports = Refer;

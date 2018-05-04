"use strict";

const Model = use("MyModel");
const Database = use("Database");
class UserTransaction extends Model {
  static boot() {
    super.boot();
    this.addHook("afterCreate", "UserTransactionHook.afterCreate");
    this.addHook("afterUpdate", "UserTransactionHook.afterUpdate");
  }
  user() {
    return this.belongsTo("App/Models/User");
  }
  static listOption(qs) {
    qs.withArray = ["user"];
    return super.listOption(qs);
  }
}

module.exports = UserTransaction;

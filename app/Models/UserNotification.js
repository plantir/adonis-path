"use strict";

const Model = use("MyModel");

class UserNotification extends Model {
  // static boot() {
  //   super.boot();
  //   this.addHook("afterCreate", "UserNotification.afterCreate");
  // }
}

module.exports = UserNotification;

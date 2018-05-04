"use strict";

const Model = use("MyModel");

class SpecialEvent extends Model {
  special_event_merchant() {
    return this.hasMany("App/Models/SpecialEventMerchant");
  }
}

module.exports = SpecialEvent;

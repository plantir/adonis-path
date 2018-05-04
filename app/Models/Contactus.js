"use strict";

const Model = use("MyModel");

class Contactus extends Model {
  static get table() {
    return "contact_us";
  }
}

module.exports = Contactus;

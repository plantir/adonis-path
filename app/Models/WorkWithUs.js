"use strict";

const Model = use("MyModel");

class WorkWithUs extends Model {
  static get table() {
    return "work_with_us";
  }
}

module.exports = WorkWithUs;

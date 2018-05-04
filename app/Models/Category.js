"use strict";

const Model = use("MyModel");

class Category extends Model {
  parent_category() {
    return this.belongsTo("App/Models/Category", "parent_id");
  }
  merchant_category() {
    return this.hasMany("App/Models/MerchantCategory");
  }
  merchants() {
    return this.manyThrough("App/Models/MerchantCategory", "merchants");
  }
  static listOption(qs) {
    qs.withArray = ["parent_category"];
    return super.listOption(qs);
  }
}

module.exports = Category;

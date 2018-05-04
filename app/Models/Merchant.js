"use strict";

const Model = use("MyModel");

class Merchant extends Model {
  merchant_category() {
    return this.hasMany("App/Models/MerchantCategory");
  }
  categories() {
    return this.manyThrough("App/Models/MerchantCategory", "categories");
  }
  offers() {
    return this.hasMany("App/Models/Offer");
  }
  shopping_trips() {
    return this.hasMany("App/Models/ShoppingTrip");
  }
  special_event_merchant() {
    return this.hasMany("App/Models/SpecialEventMerchant");
  }
  favorite_merchants() {
    return this.hasMany("App/Models/FavoriteMerchant");
  }
}

module.exports = Merchant;

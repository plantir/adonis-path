"use strict";
const Offer = use("App/Models/Offer");
const Resource = use("MyResource");
class OfferController extends Resource {
  constructor() {
    super();
    this.Model = Offer;
    this.allowField = [
      "merchant_id",
      "title",
      "image",
      "description",
      "coupon_code",
      "cashback",
      "url",
      "sort_order",
      "expiry_date"
    ];
  }
  async show({ response, request, params: { id } }) {
    let item = await this.Model.find(id);
    await item.loadMany(["merchant"]);
    response.status(200).send(item);
  }
}

module.exports = OfferController;

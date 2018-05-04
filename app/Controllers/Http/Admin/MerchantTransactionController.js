"use strict";

const MerchantTransaction = use("App/Models/MerchantTransaction");
const Resource = use("MyResource");
class MerchantTransactionController extends Resource {
  constructor() {
    super();
    this.Model = MerchantTransaction;
    this.allowField = [
      "description",
      "status",
      "title",
      "merchant_id",
      "value",
      "payment_status"
    ];
  }
  async show({ response, request, params: { id } }) {
    let item = await this.Model.find(id);
    await item.loadMany(["merchant"]);
    response.status(200).send(item);
  }
}

module.exports = MerchantTransactionController;

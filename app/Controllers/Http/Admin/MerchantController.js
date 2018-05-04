"use strict";

const Merchant = use("App/Models/Merchant");
const Resource = use("MyResource");
class MerchantController extends Resource {
  constructor() {
    super();
    this.Model = Merchant;
    this.allowField = [
      "banner",
      "class",
      "commission",
      "current_cashback_hint",
      "current_cashback_value",
      "previous_cashback_hint",
      "previous_cashback_value",
      "description",
      "summary",
      "terms_and_conditions",
      "email",
      "phone",
      "address",
      "return_guarantee",
      "payment_period",
      "exceptions",
      "free_delivery",
      "secret_shopping",
      "sort_order",
      "have_webservice",
      "image",
      "is_static_commission",
      "logo",
      "name",
      "token",
      "url",
      "utm",
      "utm_id",
      "view_count",
      "webservice_address",
      "webservice_token"
    ];
  }

  async categories({ params: { id } }) {
    let merchant = await Merchant.find(id);
    let categories = await merchant.categories().fetch();
    return categories;
  }
}

module.exports = MerchantController;

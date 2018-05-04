"use strict";
const Merchant = use("App/Models/Merchant");
const WorkWithUs = use("App/Models/WorkWithUs");
class MerchantController {
  async index({ request, response }) {
    let { pageSize, grade } = request.get();
    let merchants = await Merchant.query()
      .where("isDeleted", 0)
      .where("grade", grade)
      .paginate(1, pageSize);
    return merchants;
  }

  async show({ params: { id }, response }) {
    let merchant = await Merchant.findOrFail(id);
    if (merchant.toJSON().isDeleted) {
      response.status(500).send("merchant is not active any more");
    }
    await merchant.load("offers");
    return merchant;
  }

  async search({ request, response }) {
    let { keyword } = request.get();
    let merchants = await Merchant.query()
      .where("isDeleted", 0)
      .where("name", "like", `%${keyword}%`);
    return merchants;
  }

  async categories({ request, response, params: { id } }) {
    let merchant = await Merchant.find(id);
    let categories = await merchant.categories().fetch();
    return categories;
  }

  async register_request({ response, request }) {
    let data = request.only([
      "address",
      "company",
      "email",
      "fieldOfActivity",
      "firstName",
      "howFindUs",
      "name",
      "site",
      "siteAge",
      "siteTechnology",
      "tel"
    ]);
    return await WorkWithUs.create(data);
  }
}

module.exports = MerchantController;

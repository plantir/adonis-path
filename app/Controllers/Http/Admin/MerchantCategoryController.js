"use strict";

const MerchantCategory = use("App/Models/MerchantCategory");
class MerchantCategoryController {
  constructor() {
    this.Model = MerchantCategory;
    this.allowField = ["cashback", "commission", "category_id", "merchant_id"];
  }
  async index({ response, request }) {
    const { id } = request.get();
    let data = await this.Model.query()
      .where("merchant_id", id)
      .with("category")
      .fetch();
    response.send(data);
  }
  async store({ response, request }) {
    let data = request.only(this.allowField);
    let item = await this.Model.create(data);
    response.status(201).send(item);
  }
  async show({ response, request, params: { id } }) {
    let item = await this.Model.find(id);
    response.status(200).send(item);
  }
  async update({ response, request, params: { id } }) {
    const data = request.only(["cashback", "commission"]);
    let item = await this.Model.find(id);
    item.merge(data);
    await item.save();
    response.status(200).send({
      msg: "update successfuly",
      target: item
    });
  }
  async destroy({ response, request, params: { id } }) {
    let item = await this.Model.find(id);
    await item.delete();
    response.send({
      msg: "success"
    });
  }
}

module.exports = MerchantCategoryController;

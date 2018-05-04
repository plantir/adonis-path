"use strict";

const SpecialEventMerchant = use("App/Models/SpecialEventMerchant");
const Resource = use("MyResource");
class SpecialEventMerchantController extends Resource {
  constructor() {
    super();
    this.Model = SpecialEventMerchant;
    this.allowField = ["special_event_id", "merchant_id"];
  }
  async index({ response, request }) {
    const { id } = request.get();
    let data = await this.Model.query()
      .where("special_event_id", id)
      .with("merchants",builder=>{
        builder.orderBy('id','desc')
      })
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

  async destroy({ response, request, params: { id } }) {
    let item = await this.Model.find(id);
    await item.delete();
    response.send({
      msg: "success"
    });
  }
}

module.exports = SpecialEventMerchantController;

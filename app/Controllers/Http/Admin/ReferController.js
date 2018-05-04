"use strict";

const Refer = use("App/Models/Refer");
const Resource = use("MyResource");
class ReferController extends Resource {
  constructor() {
    super();
    this.Model = Refer;
    this.allowField = [];
  }
  async show({ response, request, params: { id } }) {
    let item = await this.Model.find(id);
    await item.loadMany(["refer_by", "refer_to"]);
    response.status(200).send(item);
  }
}

module.exports = ReferController;

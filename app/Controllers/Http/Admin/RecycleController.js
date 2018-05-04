"use strict";
const Database = use("Database");
class RecycleController {
  async index({ request, response }) {
    let { id, model } = request.all();
    if (!model || !id) {
      throw new Error("id and model is required");
    }
    const Model = use(`App/Models/${model}`);
    let item = await Model.find(id);
    item.isDeleted = 0;
    await item.save();
    return true;
  }
  async list({ request, response, params: { model } }) {
    const Model = use(`App/Models/${model}`);
    let options = request.get();
    if (options.filters) {
      options.filters = JSON.parse(options.filters)
      options.filters.push("isDeleted:1");
    } else {
      options.filters = ["isDeleted:1"];
    }
    options.filters = JSON.stringify(options.filters);
    let items = await Model.listOption(options);
    return items;
  }
}

module.exports = RecycleController;

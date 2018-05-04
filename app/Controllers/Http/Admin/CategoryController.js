"use strict";

const Category = use("App/Models/Category");
const Resource = use("MyResource");
class CategoryController extends Resource {
  constructor() {
    super();
    this.Model = Category;
    this.allowField = ["name", "image", "parent_id", "sort_order"];
  }
  async show({ response, request, params: { id } }) {
    let item = await this.Model.find(id);
    await item.loadMany(["parent_category"]);
    response.status(200).send(item);
  }
}

module.exports = CategoryController;

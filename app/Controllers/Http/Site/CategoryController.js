"use strict";
const Category = use("App/Models/Category");
const Merchant = use("App/Models/Merchant");
const MerchantCategory = use("App/Models/MerchantCategory");
const _ = use("lodash");
class CategoryController {
  async tree({ response }) {
    let categories = await Category.query().where("isDeleted", "0");
    let result = [];
    let new_cat = _.groupBy(categories, "parent_id");
    for (let item of new_cat.null) {
      let copyOfItem = JSON.parse(JSON.stringify(item));
      copyOfItem.children = new_cat[copyOfItem.id];
      result.push(copyOfItem);
    }
    response.json(result);
  }
  async subCategories({ response, request }) {
    let { parent_id } = request.get();
    let categories = await Category.query()
      .where("isDeleted", 0)
      .where("parent_id", parent_id)
      .orderBy("sort_order", "ASC");
    response.json(categories);
  }

  async merchants({ response, request, params: { id } }) {
    const { sort } = request.get();
    let order_by = [];
    let category = await Category.find(id);
    let query = Merchant.query().where("isDeleted", 0);
    if (id !== "all") {
      query.whereHas("merchant_category", builder => {
        builder.where("category_id", id);
      });
    }
    switch (parseInt(sort)) {
      case 1:
        query.orderBy("current_cashback_value", "DESC");
        break;
      case 2:
        query.orderBy("created_at", "DESC");
        break;
      default:
        query.orderBy("current_cashback_value", "DESC");
        break;
    }
    let merchants = await query.fetch();
    response.send(merchants);
  }
}

module.exports = CategoryController;

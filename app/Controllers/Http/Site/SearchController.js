"use strict";
const Merchant = use("App/Models/Merchant");
const Category = use("App/Models/Category");
const _ = use("lodash");
class SearchController {
  async index({ response, request }) {
    let { keyword } = request.get();
    let result = {
      merchants: [],
      categories: []
    };
    let categories = await Category.query()
      .where("isDeleted", 0)
      .where("name", "like", `%${keyword}%`)
      .fetch();
    for (let cat of categories.rows) {
      let category_merchants = await cat
        .merchants()
        .where("merchants.isDeleted", 0)
        .fetch();
      cat = cat.toJSON();
      cat.breadcrumbs = [
        {
          id: cat.id,
          name: cat.name
        }
      ];
      let { category, merchants } = await this._getParent(
        cat,
        category_merchants.toJSON()
      );
      result.categories.push(category);
      result.merchants.push(...merchants);
    }

    let merchants = await Merchant.query()
      .where("isDeleted", 0)
      .where("name", "like", `%${keyword}%`);
    result.merchants.push(...merchants);
    result.merchants = _.uniqBy(result.merchants, "id");
    return result;
  }
  async _getParent(category, merchants) {
    if (!category.parent_id) {
      return { category, merchants };
    }

    let parent_category = await Category.find(category.parent_id);
    if (parent_category.isDeleted) {
      return { category, merchants };
    }
    let parent_category_merchants = await parent_category
      .merchants()
      .where("merchants.isDeleted", 0)
      .fetch();
    for (let merchant of parent_category_merchants.rows) {
      merchants.push(merchant.toJSON());
    }
    parent_category = parent_category.toJSON();
    parent_category.breadcrumbs = [
      { id: parent_category.id, name: parent_category.name },
      ...category.breadcrumbs
    ];
    parent_category.child = category;
    return Promise.resolve().then(() => {
      return this._getParent(parent_category, merchants);
    });
  }
}
module.exports = SearchController;

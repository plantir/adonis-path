"use strict";

/*
  filters=["isApprove:-1,"isDeleted:1:=","email:ar:like"]
  sort=-id
  page=1
  perPage=2
*/
const Model = use("Model");
class MyModel extends Model {

  static listOption(qs) {
    let { filters, page, perPage, sort, withArray } = qs;

    filters = (filters && JSON.parse(filters)) || [];
    if (!JSON.stringify(filters).includes("isDeleted")) {
      filters.push("isDeleted:0:=");
    }
    page = parseInt(page) || 1;
    perPage = parseInt(perPage) || 10;
    sort = sort && sort.split("-");
    let orderby_direction, orderby_field;
    if (sort && sort.length === 2) {
      orderby_direction = "DESC";
      orderby_field = sort[1];
    } else if (sort && sort.length === 1) {
      orderby_field = sort[0];
    } else {
      orderby_field = "updated_at";
      orderby_direction = "DESC";
    }

    let query = super.query();
    if (withArray && withArray.length) {
      withArray.forEach(name => {
        query = query.with(name);
      });
    }
    for (let filter of filters) {
      let [property, value, opt] = filter.split(":");
      if (opt === "like") value = `%${value}%`;
      if (property.includes(".")) {
        let [a, b] = property.split(".");
        if (withArray && withArray.indexOf(a) !== -1) {
          query = query.whereHas(a, builder => {
            builder.where(b, opt || "=", value);
          });
          continue;
        }
      }
      query = query.where(property, opt || "=", value);
    }
    query = query
      .orderBy(orderby_field, orderby_direction)
      .paginate(page, perPage);
    return query;
  }
}

module.exports = MyModel;

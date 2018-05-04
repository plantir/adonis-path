"use strict";

const UserTransaction = use("App/Models/UserTransaction");
const Resource = use("MyResource");
class UserTransactionController extends Resource {
  constructor() {
    super();
    this.Model = UserTransaction;
    this.allowField = [
      "description",
      "source_type",
      "status",
      "title",
      "user_id",
      "value",
      "value_status"
    ];
  }
  async show({ response, request, params: { id } }) {
    let item = await this.Model.find(id);
    await item.loadMany(["user"]);
    response.status(200).send(item);
  }
}

module.exports = UserTransactionController;

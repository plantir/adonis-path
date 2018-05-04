"use strict";
const AdminNotification = use("App/Models/AdminNotification");
const UserNotification = use("App/Models/UserNotification");
const User = use("App/Models/User");
const Resource = use("MyResource");
class NotificationController extends Resource {
  constructor() {
    super();
    this.Model = AdminNotification;
    this.allowField = [];
  }
  async seen({ response, params: { id } }) {
    let notify = await AdminNotification.find(id);
    notify.is_seen = 1;
    await notify.save();
    return "success";
  }

  async store({ response, request }) {
    let data = request.only(["message", "url"]);
    let users = await User.all();
    for (let user of users.rows) {
      await user.notifications().create(data);
    }
    return "success";
  }
}

module.exports = NotificationController;

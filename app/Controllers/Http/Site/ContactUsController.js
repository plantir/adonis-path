"use strict";
const Contactus = use("App/Models/Contactus");
class ContactUsController {
  async index({ request, response }) {
    let data = request.only(["phone", "email", "message", "name"]);
    let contact_us = await Contactus.create(data);
    return true;
  }
}

module.exports = ContactUsController;

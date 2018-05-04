"use strict";
const Contactus = use("App/Models/Contactus");
const Resource = use("MyResource");
class ContactusController extends Resource {
  constructor() {
    super();
    this.Model = Contactus;
    this.allowField = [];
  }
}

module.exports = ContactusController;

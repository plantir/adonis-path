"use strict";
const Newsletter = use("App/Models/Newsletter");
const Resource = use("MyResource");
class NewsletterController extends Resource {
  constructor() {
    super();
    this.Model = Newsletter;
    this.allowField = ["email", "isApprove", "isDeleted"];
  }
}
module.exports = NewsletterController;

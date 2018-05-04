"use strict";

const SpecialEvent = use("App/Models/SpecialEvent");
const Resource = use("MyResource");
class SpecialEventController extends Resource {
  constructor() {
    super();
    this.Model = SpecialEvent;
    this.allowField = ["title", "image", "sort_order", "isActive"];
  }
}

module.exports = SpecialEventController;

"use strict";
const WorkWithUs = use("App/Models/WorkWithUs");
const Resource = use("MyResource");
class WorkWithUsController extends Resource {
  constructor() {
    super();
    this.Model = WorkWithUs;
    this.allowField = [];
  }
}

module.exports = WorkWithUsController;

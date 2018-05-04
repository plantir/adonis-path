"use strict";
const Slideshow = use("App/Models/Slideshow");
const Resource = use("MyResource");
class SlideshowController extends Resource {
  constructor() {
    super();
    this.Model = Slideshow;
    this.allowField = ["title", "image", "sort", "url"];
  }
}

module.exports = SlideshowController;

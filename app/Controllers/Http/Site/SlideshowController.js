"use strict";
const Slideshow = use("App/Models/Slideshow");
class SlideshowController {
  async index({ response }) {
    return await Slideshow.query()
      .where("isDeleted", 0)
      .orderBy("sort", "ASC");
  }
}

module.exports = SlideshowController;

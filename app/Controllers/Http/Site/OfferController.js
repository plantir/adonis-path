"use strict";
const Offer = use("App/Models/Offer");
class OfferController {
  async topSeen({ request, response }) {
    let {limit} = request.get();
    let offers = await Offer.query()
      .where("isDeleted", 0)
      .orderBy("view_count", "desc")
      .limit(limit);
    return offers;
  }
}

module.exports = OfferController;

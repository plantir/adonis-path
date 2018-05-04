"use strict";
const SpecialEvent = use("App/Models/SpecialEvent");
const Merchant = use("App/Models/Merchant");
class SpecialEventController {
  async index({ response }) {
    let events = await SpecialEvent.query()
      .where("isActive", 1)
      // // .with("special_event_merchant.merchants")
      .orderBy("sort_order", "ASC");
    for (let event of events) {
      let merchants = await Merchant.query().whereHas(
        "special_event_merchant",
        builder => {
          builder.where("special_event_id", event.id);
        }
      );
      event.merchants = merchants;
    }
    response.json(events);
  }
}

module.exports = SpecialEventController;

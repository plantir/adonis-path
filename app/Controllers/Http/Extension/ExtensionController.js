"use strict";
const Merchant = use("App/Models/Merchant");
const User = use("App/Models/User");
class ExtensionController {
  async check_merchant({ request, response }) {
    const { domain } = request.post();
    if (!domain) {
      return response.status(500).json("domain is required");
    }
    let merchant = await Merchant.query()
      .where("url", "like", `%${domain}%`)
      .where("isDeleted", 0)
      .first();
    if (!merchant) {
      return { isValid: false };
    }
    await merchant.load("offers");
    merchant.isValid = true;
    return merchant;
  }
  async search_merchant({ request, response }) {
    const { keyword } = request.get();
    if (!keyword || keyword.length < 3) {
      return response
        .status(500)
        .json("keyword length must bigger than 2 charachter");
    }
    let merchants = await Merchant.query()
      .where("name", "like", `%${keyword}%`)
      .where("isDeleted", 0);
    return merchants;
  }
  async user_cashback_info({ request, response, auth }) {
    let { id } = auth.user.id;
    let user = await User.find(id);
    let total_cashback = await user.total_cashback();
    let pending_cashback = await user.pending_cashback();
    response.json({
      total_cashback: total_cashback,
      pending_cashback: pending_cashback
    });
  }
}

module.exports = ExtensionController;

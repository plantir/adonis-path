"use strict";
const User = use("App/Models/User");
class WalletController {
  async credit({ request, response, auth }) {
    let id = auth.user.id;
    let user = await User.find(id);
    if (!user) {
      return response.status(500).send("user not find");
    }
    let account_balance = await user.account_balance();
    let hasPurchase = await user.has_purchase();
    response.json({
      canCashout: hasPurchase && account_balance >= 30000 ? true : false,
      account_balance: account_balance
    });
  }
  async use_credit({ request, response, auth }) {
    const { value } = request.post();
    let id = auth.user.id;
    let user = await User.find(id);
    if (!user) {
      return response.status(500).send("user not find");
    }
    let account_balance = await user.account_balance();
    let hasPurchase = await user.has_purchase();
    if (!hasPurchase) {
      return response.status(500).send("your haven't any cashbak in cashineh");
    }
    if (account_balance < 30000) {
      return response.status(500).send("your cashback is under 30,000 Toman");
    }
    if (account_balance < value) {
      response.status(500);
      return `your credit is letter than your request your balance is ${account_balance} Toman`;
    }
    await user.use_credit(value);
    return "success";
  }
}

module.exports = WalletController;

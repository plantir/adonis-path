"use strict";
const User = use("App/Models/User");
const Merchant = use("App/Models/Merchant");
const FavoriteMerchant = use("App/Models/FavoriteMerchant");
const Offer = use("App/Models/Offer");
const UserTransaction = use("App/Models/UserTransaction");
const UserNotification = use("App/Models/UserNotification");
const TokenModel = use("App/Models/Token");
const ShoppingTrip = use("App/Models/ShoppingTrip");
const MerchantWebservice = use("MerchantWebservice");
const TokenGenerator = use("Token");
const Token = new TokenGenerator();
const Hash = use("Hash");

class UserController {
  async signup({ request, response, auth }) {
    const { email, password, mobile, refer_by, token, type } = request.post();
    if (type === "email") {
      return this._register_with_email(
        email,
        password,
        refer_by,
        response,
        auth
      );
    }
    if (type === "mobile") {
      return this._register_with_mobile(
        mobile,
        password,
        refer_by,
        response,
        auth
      );
    }
    if (type === "google") {
      return this._register_with_google(
        email,
        password,
        token,
        refer_by,
        response,
        auth
      );
    }
  }
  async login({ request, response, auth }) {
    const { email, password, mobile, type } = request.post();
    if (type === "email") {
      return this._login_with_email(email, password, response, auth);
    }
    if (type === "mobile") {
      return this._login_with_mobile(mobile, password, response, auth);
    }
  }
  async _login_with_email(email, password, response, auth) {
    let token = await auth.withRefreshToken().attempt(email, password);
    let user = await User.findBy({ email });
    return response.status(200).json({
      user: user,
      token: token,
      message: "Login successfull"
    });
  }

  async _login_with_mobile(mobile, password, response, auth) {
    let token = await await auth
      .authenticator("mobile")
      .withRefreshToken()
      .attempt(mobile, password);
    let user = await User.findBy({ mobile });
    return response.status(200).json({
      user: user,
      token: token,
      message: "Login successfull"
    });
  }

  async account_balance({ response, request, auth }) {
    let id = auth.user.id;
    let user = await User.find(id);
    let input = await user
      .transactions()
      .where("status", 1)
      .where("value_status", 1)
      .sum("value as value");
    let output = await user
      .transactions()
      .where("status", 1)
      .where("value_status", 0)
      .sum("value as value");
    let account_balance = input[0].value - output[0].value;

    response.status(200).json({
      account_balance: account_balance
    });
  }

  async cashback_info({ response, request, auth }) {
    let id = auth.user.id;
    if (!id) {
      response.status(500).json("id is required");
      return false;
    }
    let user = await User.find(id);
    if (!user) {
      response.status(500).json("user not found");
      return false;
    }
    let total_cashback = await user
      .transactions()
      .where("status", 1)
      .whereIn("source_type", [1, 2, 3])
      .sum("value as value");
    let pending_cashback = await user
      .transactions()
      .where("status", 0)
      .whereIn("source_type", [1, 2, 3])
      .sum("value as value");

    response.json({
      total_cashback: total_cashback[0].value || 0,
      pending_cashback: pending_cashback[0].value || 0
    });
  }

  async info({ response, auth }) {
    const id = auth.user.id;
    let user = await User.find(id);
    await user.loadMany({
      notifications: builder => {
        builder.where("is_seen", 0).orderBy("created_at", "desc");
      }
    });
    return user;
  }

  async edit({ response, auth, request }) {
    const data = request.only([
      "name",
      "family",
      "email",
      "national_code",
      "image",
      "mobile",
      "address",
      "birthDay",
      "bank_card_number",
      "account_number",
      "sms_enabled"
    ]);
    const id = auth.user.id;
    let user = await User.find(id);
    user.merge(data);
    await user.save();
    return user;
  }

  async favorite_merchants({ response, auth }) {
    const id = auth.user.id;
    let merchants = await Merchant.query()
      .whereHas("favorite_merchants", builder => {
        builder.where("user_id", id);
      })
      .fetch();
    return merchants;
  }

  async add_favorite_merchants({ response, auth, request }) {
    const id = auth.user.id;
    let { merchant_id } = request.post();
    let user = await User.find(id);
    user.favorite_merchants().create({ merchant_id });
    return true;
  }

  async remove_favorite_merchants({ response, auth, request }) {
    const id = auth.user.id;
    let { merchant_id } = request.get();
    let user = await User.find(id);
    let item = await user
      .favorite_merchants()
      .where({ merchant_id })
      .delete();
    return true;
  }

  async shopping_trips({ response, auth, request }) {
    const id = auth.user.id;
    let options = request.get();
    if (options.filters) {
      options.filters = JSON.parse(options.filters);
      options.filters.push(`user_id:${id}`);
    } else {
      options.filters = [`user_id:${id}`];
    }
    options.filters = JSON.stringify(options.filters);
    let data = await ShoppingTrip.listOption(options);
    return data;
  }

  async update_shopping_trip({ response, auth, request }) {
    const user_id = auth.user.id;
    let { id } = request.post();
    let shopping_trip = await ShoppingTrip.find(id);
    if (shopping_trip.user_id !== user_id) {
      response.status(403).send("you can't access other user shoppingTrips");
      return;
    }
    let merchant = await Merchant.find(shopping_trip.merchant_id);
    if (merchant.have_webservice) {
      let service = new MerchantWebservice();
      let result = await service.upadte_shopping_trip(
        shopping_trip.toJSON(),
        merchant.toJSON()
      );
      return result;
    }
    return shopping_trip;
  }

  async transactions({ response, request, auth }) {
    const id = auth.user.id;
    let options = request.get();
    if (options.filters) {
      options.filters = JSON.parse(options.filters);
      options.filters.push(`user_id:${id}`);
    } else {
      options.filters = [`user_id:${id}`];
    }
    options.filters = JSON.stringify(options.filters);
    let data = await UserTransaction.listOption(options);
    return data;
  }

  async notifications({ response, request, auth }) {
    const id = auth.user.id;
    let options = request.get();
    if (options.filters) {
      options.filters = JSON.parse(options.filters);
      options.filters.push(`user_id:${id}`);
    } else {
      options.filters = [`user_id:${id}`];
    }
    options.filters = JSON.stringify(options.filters);
    let data = await UserNotification.listOption(options);
    return data;
  }

  async see_notification({ response, auth, params: { id } }) {
    let user = await auth.getUser();
    let notify = await user
      .notifications()
      .where({ id })
      .first();
    notify.is_seen = 1;
    await notify.save();
    return "success";
  }

  async ballance({ response, request, auth }) {
    let id = auth.user.id;
    let user = await User.find(id);
    let input = await user
      .transactions()
      .where("status", 1)
      .where("value_status", 1)
      .sum("value as value");
    let output = await user
      .transactions()
      .where("status", 1)
      .where("value_status", 0)
      .sum("value as value");
    let account_balance = input[0].value - output[0].value;
    let hasPurchase = await user
      .transactions()
      .where("status", 1)
      .where("source_type", 3)
      .first();

    response.json({
      canCashout: hasPurchase && account_balance >= 30000 ? true : false,
      account_balance: account_balance
    });
  }

  async change_password({ response, request, auth }) {
    let id = auth.user.id;
    let { new_password, old_password } = request.post();
    let user = await User.find(id);
    const isSame = await Hash.verify(old_password, user.password);
    if (!isSame) {
      return false;
    }
    user.password = await Hash.make(new_password);
    await user.save();
    return true;
  }

  async recover_password({ response, request }) {
    let { type, email, mobile } = request.post();
    let user;
    if (type === "email") {
      user = await User.findBy({ email });
    } else if (type === "mobile") {
      user = await User.findBy({ mobile });
    }
    if (!user) {
      response.status(404);
      return "user not found۲";
    }
    if (type === "email") {
      let token = await Token.generate("string");
      await user
        .tokens()
        .where({ type: "recover_password" })
        .update({ is_revoked: 1 });
      await user.tokens().create({ token: token, type: "recover_password" });
      await user.send_recover_pass_email(token);
    } else if (type === "mobile") {
      let token = await Token.generate("digit");
      await user
        .tokens()
        .where({ type: "verify_mobile" })
        .update({ is_revoked: 1 });
      await user.tokens().create({ token: token, type: "verify_mobile" });
      user.sendSMS("sms.verify", mobile, { token: token });
    }
    return true;
  }

  async verify_mobile({ response, request }) {
    const { token, mobile } = request.post();
    const is_revoked = 0;
    const type = "verify_mobile";
    const user = await User.findBy({ mobile });
    const verify_token = await await TokenModel.query()
      .where({ is_revoked })
      .where({ type })
      .where({ token })
      .first();
    if (verify_token) {
      user.is_verified = 1;
      await user.save();
      verify_token.is_revoked = 1;
      await verify_token.save();
    }
    return verify_token ? true : false;
  }

  async verify_email({ response, request, auth }) {
    const { token } = request.post();
    const is_revoked = 0;
    const type = "verify_email";
    let verify_token = await TokenModel.query()
      .where({ is_revoked })
      .where({ type })
      .where({ token })
      .first();
    if (verify_token) {
      let user = await User.find(verify_token.user_id);
      user.is_verified = 1;
      await user.save();
      verify_token.is_revoked = 1;
      await verify_token.save();
      let token = await auth.withRefreshToken().generate(user);
      return { data: token };
    }
    return response.status(500).send("token not valid");
  }

  async reset_password({ response, request }) {
    const { token, email, mobile, password } = request.post();
    let type;
    let user;
    if (email) {
      user = await User.findBy({ email });
      type = "recover_password";
    } else if (mobile) {
      user = await User.findBy({ mobile });
      type = "verify_mobile";
    }
    const isExist = await user.verifyToken({ token: token, type: type });
    if (isExist) {
      user.password = await Hash.make(password);
      await user.save();
      return true;
    }
    response.status(500).send("your token is revoked");
  }

  async _register_with_email(email, password, refer_by, response, auth) {
    let existEmail = await User.findBy({ email });
    if (existEmail) {
      response.status(500);
      return { message: "email exist in cashineh", status: 103 };
    }
    let token = await Token.generate("string");
    let user = new User();
    user.email = email;
    user.refer_by = refer_by;
    user.password = password;
    user.register_source = "email";
    await user.save();
    await user.tokens().create({ token: token, type: "verify_email" });
    await user.send_signup_email(token);
    let auth_token = await auth.withRefreshToken().generate(user);
    await user.add_signup_transaction();
    refer_by && (await user.add_refer_transaction());
    response.status(201);
    return {
      status: 201,
      message: "user create successfully",
      token: auth_token
    };
  }

  async _register_with_google(
    email,
    password,
    token,
    refer_by,
    response,
    auth
  ) {
    let user = await User.findBy({ email });
    if (user && user.register_source === "google") {
      let verifyToken = await user.verifyToken({
        token: token,
        type: "google"
      });
      if (!verifyToken) {
        response.status(401);
        return "token is not valid";
      }
    }
    if (user && user.register_source === "email") {
      user.register_source = "google";
      user.is_verified = 1;
      await user.save();
      await user.tokens().create({ token: token, type: "google" });
    }
    if (!user) {
      user = new User();
      user.email = email;
      user.refer_by = refer_by;
      user.is_verified = 1;
      user.password = password;
      user.register_source = "google";
      await user.save();
      await user.tokens().create({ token: token, type: "google" });
      await user.add_signup_transaction();
      refer_by && (await user.add_refer_transaction());
    }

    let auth_token = await auth.withRefreshToken().generate(user);
    response.status(200);
    return {
      status: 200,
      message: "user create successfully",
      token: auth_token
    };
  }

  async _register_with_mobile(mobile, password, refer_by, response, auth) {
    let existMobile = await User.findBy({ mobile });
    if (existMobile) {
      response.status(500);
      return { message: "mobile number exist in cashineh", status: 103 };
    }
    let user = new User();
    user.password = password;
    user.mobile = mobile;
    user.refer_by = refer_by;
    user.register_source = "mobile";
    await user.save();
    let token = await Token.generate("digit");
    await user
      .tokens()
      .where({ type: "verify_mobile" })
      .update({ is_revoked: 1 });
    await user.tokens().create({ token: token, type: "verify_mobile" });
    user.sendSMS("sms.verify", mobile, { token: token });
    let auth_token = await auth.withRefreshToken().generate(user);
    await user.add_signup_transaction();
    refer_by && (await user.add_refer_transaction());
    response.status(201);
    return {
      status: 201,
      message: "user create successfully",
      token: auth_token
    };
  }

  async out_traffic({ response, request, auth }) {
    let { merchant_id, offer_id } = request.post();
    let id = auth.user.id;
    let user = await User.find(id);
    let shopping_trip = {
      merchant_id: merchant_id,
      offer_id: offer_id
    };
    if (offer_id) {
      let offer = await Offer.find(offer_id);
      offer.view_count++;
      await offer.save();
      shopping_trip.cashback = offer.cashback;
    }
    if (merchant_id) {
      let merchant = await Merchant.find(merchant_id);
      shopping_trip.cashback = merchant.current_cashback_value;
    }
    let result = await user.shoppingTrips().create(shopping_trip);
    return result;
  }

  async resend_email({ response, request, auth }) {
    let id = auth.user.id;
    let user = await User.find(id);
    await user
      .tokens()
      .where({ type: "verify_email" })
      .update({ is_revoked: 1 });
    let token = await Token.generate("string");
    await user.tokens().create({ token: token, type: "verify_email" });
    await user.send_signup_email(token);
    return true;
  }

  async resend_sms({ response, request, auth }) {
    let id = auth.user.id;
    let user = await User.find(id);
    await user
      .tokens()
      .where({ type: "verify_mobile" })
      .update({ is_revoked: 1 });
    let token = await Token.generate("digit");
    await user.tokens().create({ token: token, type: "verify_mobile" });
    await user.sendSMS("sms.verify", user.mobile, { token: token });
    return true;
  }
  async is_favorite({ response, request, auth }) {
    let { merchant_id } = request.get();
    let id = auth.user.id;
    let user = await User.find(id);
    let isExist = await user
      .favorite_merchants()
      .where({ merchant_id })
      .first();
    return isExist ? true : false;
  }
  async add_favorite({ response, request, auth }) {
    let { merchant_id } = request.post();
    let id = auth.user.id;
    let user = await User.find(id);
    let isExist = await user
      .favorite_merchants()
      .where({ merchant_id })
      .first();
    !isExist &&
      (await FavoriteMerchant.create({
        merchant_id: merchant_id,
        user_id: id
      }));
    return "success";
  }
  async remove_favorite({ response, request, auth }) {
    let { merchant_id } = request.get();
    let user_id = auth.user.id;
    let item = await FavoriteMerchant.query()
      .where({ merchant_id })
      .where({ user_id })
      .first();
    await item.delete();
    return "success";
  }
}

module.exports = UserController;

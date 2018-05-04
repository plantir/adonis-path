"use strict";

const Model = use("MyModel");
const SMS = use("SMS");
const Mail = use("Mail");
const Token = use("App/Models/Token");
const UserTransaction = use("App/Models/UserTransaction");
const Refer = use("App/Models/Refer");
const Env = use("Env");
class User extends Model {
  static get hidden() {
    return ["password", "token"];
  }
  static boot() {
    super.boot();
    this.addHook("beforeCreate", "User.hashPassword");
    this.addHook("beforeCreate", "User.setRole");
  }
  notifications() {
    return this.hasMany("App/Models/Notification");
  }
  tokens() {
    return this.hasMany("App/Models/Token");
  }
  transactions() {
    return this.hasMany("App/Models/UserTransaction");
  }
  notifications() {
    return this.hasMany("App/Models/UserNotification");
  }
  shoppingTrips() {
    return this.hasMany("App/Models/ShoppingTrip");
  }
  favorite_merchants() {
    return this.manyThrough("App/Models/FavoriteMerchant", "merchants");
  }
  async sendSMS(template, to, data) {
    // return SMS.send(template, data || this, to);
  }
  async has_purchase() {
    return UserTransaction.query()
      .where("user_id", this.id)
      .where("status", 1)
      .where("source_type", 3)
      .first();
  }
  async account_balance() {
    let input = await UserTransaction.query()
      .where("user_id", this.id)
      .where("status", 1)
      .where("value_status", 1)
      .sum("value as value");
    let output = await UserTransaction.query()
      .where("user_id", this.id)
      .where("status", 1)
      .where("value_status", 0)
      .sum("value as value");
    let account_balance = input[0].value - output[0].value;
    return account_balance || 0;
  }
  async use_credit(value) {
    let transactionObj = {
      user_id: this.id,
      source_id: null,
      source_type: 6,
      title: "استفاده از کیف پول",
      description: `بابت استفاده از کیف پول`,
      value: Math.abs(value),
      value_status: 0,
      status: 1
    };
    return UserTransaction.create(transactionObj);
  }
  async total_cashback() {
    let total_cashback = await UserTransaction.query()
      .where("user_id", this.id)
      .where("status", 1)
      .whereIn("source_type", [1, 2, 3])
      .sum("value as value");
    return total_cashback[0].value || 0;
  }
  async pending_cashback() {
    let pending_cashback = await UserTransaction.query()
      .where("user_id", this.id)
      .where("status", 0)
      .whereIn("source_type", [1, 2, 3])
      .sum("value as value");
    return pending_cashback[0].value || 0;
  }
  async send_recover_pass_email(token) {
    this.token = token;
    let url =
      Env.get("NODE_ENV") == "development"
        ? "http://localhost:9000/#"
        : "https://cashineh.com/#";
    await Mail.connection("support").send(
      "emails.forget-password",
      { user: this, url: url },
      message => {
        message
          .to(this.email)
          .from("support@cashineh.com")
          .subject("کشینه - بازیابی رمز عبور");
      }
    );
  }
  async send_signup_email(token) {
    this.token = token;
    let url =
      Env.get("NODE_ENV") == "development"
        ? "http://localhost:9000/#"
        : "https://cashineh.com/#";
    await Mail.connection("noReply").send(
      "emails.signup",
      { user: this, url: url },
      message => {
        message
          .to(this.email)
          .from("noreply@cashineh.com")
          .subject("کشینه - تایید حساب کاربری");
      }
    );
  }
  async add_signup_transaction() {
    let signup_transaction_amount = Env.get("signup_amount", 6000);
    let transaction = {
      source_type: 1, // 1=signup
      title: "حق عضویت",
      status: 1, //1=approve
      description: "بابت عضویت در سایت کشینه",
      value: signup_transaction_amount,
      value_status: 1 //1=input
    };
    return await this.transactions().create(transaction);
  }
  async add_refer_transaction() {
    let refer_transaction_amount = Env.get("refer_amount", 8000);
    let transaction = {
      source_type: 2, // 2=refer
      user_id: this.refer_by,
      source_id: this.id,
      title: "دعوت از دوست",
      status: 0, //1=approve
      description: "بابت دعوت از دوست",
      value: refer_transaction_amount,
      value_status: 1 //1=input
    };
    return await UserTransaction.create(transaction);
  }

  async verifyToken({ token, is_revoked, type }) {
    is_revoked = is_revoked || 0;

    let isExist = await this.tokens()
      .where({ token })
      .where({ is_revoked })
      .where({ type })
      .first();
    return isExist ? true : false;
  }
}

module.exports = User;

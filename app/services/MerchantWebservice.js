"use strict";
const request = require("request");
const ShoppingTrip = use("App/Models/ShoppingTrip");
const UserTransaction = use("App/Models/UserTransaction");
const MerchantTransaction = use("App/Models/MerchantTransaction");
const Order = use("App/Models/Order");
const Webservice = use("App/Models/Webservice");
const Logger = use("Logger");
const _ = use("lodash");
class MerchantWebservice {
  constructor(merchant, date, webserviceId) {
    this.merchant = merchant;
    this.date = this._calculateDate(date);
    this.webserviceId = webserviceId;
    this.webservice;
  }
  async call() {
    this.webservice = new Webservice();
    this.webservice.merchant_id = this.merchant.id;
    let questionMark = this.merchant.webservice_address.includes("?")
      ? "&"
      : "?";
    this.webservice.url =
      this.merchant.webservice_address +
      questionMark +
      "token=" +
      this.merchant.webservice_token +
      "&date=" +
      this.date;
    request(
      {
        method: "GET",
        uri: this.webservice.url,
        json: true
      },
      (error, response, data) => {
        this._requestCallback(error, response, data);
      }
    );
  }
  async recall() {
    return new Promise(async (resolve, reject) => {
      this.webservice = await Webservice.find(this.webserviceId);
      let questionMark = this.merchant.webservice_address.includes("?")
        ? "&"
        : "?";
      this.webservice.url =
        this.merchant.webservice_address +
        questionMark +
        "token=" +
        this.merchant.webservice_token +
        "&date=" +
        this.date;
      request(
        {
          method: "GET",
          uri: this.webservice.url,
          json: true
        },
        async (error, response, data) => {
          await this._requestCallback(error, response, data);
          resolve(this.webservice);
        }
      );
    });
  }
  async upadte_shopping_trip(shoppingTrip, merchant) {
    return new Promise((resolve, reject) => {
      this.merchant = merchant;
      let questionMark = this.merchant.webservice_address.includes("?")
        ? "&"
        : "?";
      let url =
        this.merchant.webservice_address +
        questionMark +
        "token=" +
        this.merchant.webservice_token;
      request(
        {
          method: "GET",
          uri: url,
          json: true
        },
        async (error, response, data) => {
          let order = _.find(data, o => {
            return o.shopping_trip_id == shoppingTrip.id;
          });
          if (!order) {
            resolve("shopping_trip not found in webservice");
            return;
          }
          // await this._addUserTransaction(order, shoppingTrip);
          // await this._addMerchantTransaction(order, shoppingTrip);
          await this._createOrder(order, shoppingTrip);
          await this._updateShoppingTrip(order, shoppingTrip);
          resolve("success");
        }
      );
    });
  }
  async _requestCallback(error, response, data) {
    this.webservice.response = JSON.stringify(data);
    this.webservice.status = (response && response.statusCode) || 500;
    if (error || response.statusCode !== 200) {
      this.webservice.save();
      return;
    }
    if (Object.prototype.toString.call(data) == "[object Array]") {
      for (let item of data) {
        try {
          let shoppingTrip = await this._getShoppingTrip(item);
          // await this._addUserTransaction(item, shoppingTrip);
          // await this._addMerchantTransaction(item, shoppingTrip);
          await this._createOrder(item, shoppingTrip);
          await this._updateShoppingTrip(item, shoppingTrip);
        } catch (error) {
          Logger.transport("file").error(
            error + " => request is %s",
            this.webservice.url
          );
          continue;
        }
      }
    }
    return this.webservice.save();
  }

  async user_cashback_value(order, merchant) {
    let cashback_amount = 0;
    return new Promise(async (resolve, reject) => {
      if (merchant.is_static_commission) {
        cashback_amount =
          order.total_amount * merchant.current_cashback_value / 100;
      } else {
        let holeSiteCashback = await Offer.find({
          where: {
            type: 0,
            merchant_id: merchant.id
          }
        });
        if (!order.order_detail) {
          reject({
            error: "no order_detail in webservice"
          });
          return;
        }
        for (let item of order.order_detail) {
          let offer = await Offer.find({
            where: {
              target_id: item.category_id,
              merchant_id: merchant.id
            }
          });
          if (offer) {
            cashback_amount += item.total_price * offer.cashback / 100;
          } else if (holeSiteCashback) {
            cashback_amount +=
              item.total_price * holeSiteCashback.cashback / 100;
          }
        }
      }
      resolve(cashback_amount);
    });
  }

  async merchant_cashback_value(order, merchant) {
    let cashback_amount = 0;
    return new Promise(async (resolve, reject) => {
      if (merchant.is_static_commission) {
        cashback_amount = order.total_amount * merchant.commission / 100;
      } else {
        let holeSiteCashback = await Offer.find({
          where: {
            type: 0,
            merchant_id: merchant.id
          }
        });
        if (!order.order_detail) {
          reject({
            error: "no order_detail in webservice"
          });
          return;
        }
        for (let item of order.order_detail) {
          let offer = await Offer.find({
            where: {
              target_id: item.category_id,
              merchant_id: merchant.id
            }
          });
          if (offer) {
            cashback_amount += item.total_price * offer.commission / 100;
          } else if (holeSiteCashback) {
            cashback_amount +=
              item.total_price * holeSiteCashback.commission / 100;
          }
        }
      }
      resolve(cashback_amount);
    });
  }

  async _addUserTransaction(item, shoppingTrip) {
    let user_transaction = await UserTransaction.findBy(
      "source_id",
      shoppingTrip.id
    );
    if (!user_transaction) {
      user_transaction = new UserTransaction();
    }
    user_transaction = {
      user_id: shoppingTrip.user_id,
      source_id: shoppingTrip.id,
      source_type: 3,
      status: item.status,
      title: `کش بک`,
      description: `بابت خرید از سایت ${this.merchant.name}`,
      value: await user_cashback_value(item, this.merchant),
      value_status: 1
    };
    await user_transaction.save();
  }

  async _addMerchantTransaction(item, shoppingTrip) {
    let merchant_transaction = await MerchantTransaction.findBy(
      "source_id",
      shoppingTrip.id
    );
    if (!merchant_transaction) {
      merchant_transaction = new MerchantTransaction();
    }
    merchant_transaction = {
      merchant_id: shoppingTrip.merchant_id,
      source_id: shoppingTrip.id,
      // source_type: 3,
      status: 0, // در حال بررسی
      title: `کش بک`,
      description: `بابت خرید کاربر`,
      value: await merchant_cashback_value(item, this.merchant),
      payment_status: 0
    };
    await merchant_transaction.save();
  }

  async _createOrder(item, shoppingTrip) {
    let order = await Order.findBy("shopping_trip_id", shoppingTrip.id);
    if (order) {
      return;
    }
    let order_data = {
      user_id: item.user_id,
      merchant_id: item.merchant_id,
      shopping_trip_id: shoppingTrip.id,
      order_status: 0,
      order_id: item.order_id,
      total_amount: item.total_amount,
      cashback: item.cashback,
      cashback_amount: item.cashback_amount,
      commission: item.commission,
      commission_amount: item.commission_amount,
      return_guarantee: item.return_guarantee,
      order_detail: item.order_detail
    };
    await Order.create(order_data);
  }

  async _getShoppingTrip(item) {
    return new Promise(async (resolve, reject) => {
      if (!item.shopping_trip_id) {
        reject("item.shopping trip is null");
        return;
      }
      let shoppingTrip = await ShoppingTrip.find(item.shopping_trip_id);
      if (!shoppingTrip) {
        reject("shoppingTrip not found");
        return;
      }
      resolve(shoppingTrip);
    });
  }

  async _updateShoppingTrip(item, shoppingTrip) {
    shoppingTrip.cashback_amount = await user_cashback_value(item, merchant);
    shoppingTrip.shopping_status = 1;
    await shoppingTrip.save();
    return shoppingTrip;
  }

  _calculateDate(date) {
    let day = new Date(new Date().setDate(new Date(date).getDate() - 1));
    let dd = day.getDate();
    let mm = day.getMonth() + 1;
    let yyyy = day.getFullYear();
    mm = mm < 10 ? "0" + mm : mm;
    dd = dd < 10 ? "0" + dd : dd;
    return yyyy + "-" + mm + "-" + dd;
  }
}

module.exports = MerchantWebservice;

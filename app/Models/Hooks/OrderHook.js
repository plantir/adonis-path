"use strict";
const Env = use("Env");
const User = use("App/Models/User");
const Merchant = use("App/Models/Merchant");
const UserTransaction = use("App/Models/UserTransaction");
const MerchantTransaction = use("App/Models/MerchantTransaction");
const AdminNotification = use("App/Models/AdminNotification");
const OrderHook = (exports = module.exports = {});

OrderHook.beforeCreate = async modelInstance => {
  let merchant = await Merchant.find(modelInstance.merchant_id);
  modelInstance.return_guarantee = merchant.return_guarantee;
  return modelInstance;
};
OrderHook.afterCreate = async modelInstance => {
  add_user_transaction(modelInstance);
  add_merchant_transaction(modelInstance);
  let url = Env.get("NODE_ENV") === "development" ? "/#/" : "/";
  await AdminNotification.create({
    message: "یک سفارش جدید ثبت شد",
    url: `${url}orders/${modelInstance.id}`
  });
};

OrderHook.beforeUpdate = async modelInstance => {
  let merchant = await Merchant.find(modelInstance.merchant_id);
  if (!modelInstance.order_detail) {
    return;
  }
  for (let item of modelInstance.order_detail) {
    if (!item.category) {
      continue;
    }
    let category = await merchant
      .merchant_category()
      .where("category_id", item.category)
      .first();

    item.cashback = category.cashback;
    item.commission = category.commission;

    item.cashback_amount =
      item.price.toString().replace(/,/g, "") * item.cashback / 100;
    item.commission_amount =
      item.price.toString().replace(/,/g, "") * item.commission / 100;
    modelInstance.cashback_amount += item.cashback_amount;
    modelInstance.commission_amount += item.commission_amount;
  }
  modelInstance.order_detail = JSON.stringify(modelInstance.order_detail);
};

OrderHook.afterUpdate = async modelInstance => {
  if (modelInstance.is_completed) {
    add_user_transaction(modelInstance);
    add_merchant_transaction(modelInstance);
  }
  if (modelInstance.order_status == 1 && modelInstance.expire_return_guarantee) {
    approve_user_transaction(modelInstance);
  }
};

async function approve_user_transaction(modelInstance) {
  let merchant = await Merchant.find(modelInstance.merchant_id);
  let userTransaction = await UserTransaction.query()
    .where("source_type", 3)
    .where("source_id", modelInstance.shopping_trip_id)
    .first();
  userTransaction.status = 1;
  await userTransaction.save();
}

async function add_user_transaction(modelInstance) {
  let merchant = await Merchant.find(modelInstance.merchant_id);
  let userTransaction = await UserTransaction.query()
    .where("source_type", 3)
    .where("source_id", modelInstance.shopping_trip_id)
    .first();
  if (!userTransaction) {
    await UserTransaction.create({
      user_id: modelInstance.user_id,
      source_id: modelInstance.shopping_trip_id,
      source_type: 3,
      status: 0,
      title: `کش بک`,
      description: `بابت خرید از سایت ${merchant.name}`,
      value: modelInstance.cashback_amount,
      value_status: 1
    });
  } else {
    userTransaction.value = modelInstance.cashback_amount;
    await userTransaction.save();
  }
}

async function add_merchant_transaction(modelInstance) {
  let merchantTransaction = await MerchantTransaction.query()
    .where("source_id", modelInstance.shopping_trip_id)
    .first();
  if (!merchantTransaction) {
    await MerchantTransaction.create({
      merchant_id: modelInstance.merchant_id,
      source_id: modelInstance.shopping_trip_id,
      status: 0,
      title: `کش بک`,
      description: `بابت خرید کاربر`,
      value: modelInstance.commission_amount,
      payment_status: 0
    });
  } else {
    merchantTransaction.value = modelInstance.commission_amount;
    await merchantTransaction.save();
  }
}

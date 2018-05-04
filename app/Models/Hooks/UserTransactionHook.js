const Env = use("Env");
const UserTransactionHook = (module.exports = {});
UserTransactionHook.afterCreate = async modelInstance => {
  let user = await modelInstance.user().fetch();
  let url = Env.get("NODE_ENV") === "development" ? "/#/" : "/";
  let notify = {
    message: "یک تراکنش جدید ثبت شد",
    url: `${url}my-cashineh/transactions`
  };
  await user.notifications().create(notify);
  if (user.mobile && user.sms_enabled) {
    await user.sendSMS("sms.transaction_create", user.mobile, {
      type: modelInstance.title
    });
  }
};
UserTransactionHook.afterUpdate = async modelInstance => {
  let user = await modelInstance.user().fetch();
  let url = Env.get("NODE_ENV") === "development" ? "/#/" : "/";
  let notify = {
    message: "وضعیت تراکنش شما تغییر کرد",
    url: `${url}my-cashineh/transactions`
  };
  await user.notifications().create(notify);
  if (user.mobile && user.sms_enabled) {
    await user.sendSMS("sms.transaction_change", user.mobile, {
      type: modelInstance.title
    });
  }
};

const UserNotification = (module.exports = {});

UserNotification.afterCreate = async modelInstance => {
  // let user = await modelInstance.user().fetch();
  // if (user.moblie && user.sms_enabled) {
  //   await user.sendSMS("sms.transcation", user.mobile, {
  //     type: modelInstance.title
  //   });
  // }
};

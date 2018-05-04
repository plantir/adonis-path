"use strict";

const User = use("App/Models/User");
const Resource = use("MyResource");
const Mail = use("Mail");
const SMS = use("SMS");
const Helpers = use("Helpers");
class UserController extends Resource {
  constructor() {
    super();
    this.Model = User;
    this.allowField = [
      "email",
      "username",
      "national_code",
      "password",
      "phone",
      "mobile",
      "state",
      "city",
      "address",
      "bank_card_name",
      "bank_card_number",
      "account_name",
      "account_number",
      "account_balance",
      "status",
      "is_verified"
    ];
  }

  async login({ request, auth, response }) {
    const { mobile, email, password } = request.all();
    let token;
    if (email) {
      token = await auth.withRefreshToken().attempt(email, password);
      let user = await User.findBy({ email });
      if (user.role_id != 2) {
        return response
          .status(403)
          .send([{ field: "role", message: "permision denied" }]);
      }
    } else if (mobile) {
      token = await auth
        .authenticator("mobile")
        .withRefreshToken()
        .attempt(mobile, password);
      let user = await User.findBy({ mobile });
      if (user.role_id != 2) {
        return response.status(403).send("permission denied");
      }
    }
    if (auth.user) {
      console.log(auth.user);
    }
    return response
      .status(200)
      .json({ data: token, message: "Login successfull", status: true });
  }

  async test({ response }) {
    // await SMS.send("welcome", "09356659943");
    await SMS.send("sms.welcome", { name: "آرمین" }, "09356659943");
    response.send("successs");
  }
  async test2({ request, auth, response }) {
    const user = await User.find(1);
    await Mail.connection("support").send(
      "emails.referal",
      { user: user.toJSON(), name: "آرمین", link: "test" },
      message => {
        message
          .to(user.email)
          .embed(Helpers.publicPath("img/referal1_email.jpg"), "referal1")
          .embed(Helpers.publicPath("img/referal2_email.jpg"), "referal2")
          .from("support@cashineh.com")
          .subject("join cashineh now...");
      }
    );
    response.send("success");
  }
}

module.exports = UserController;

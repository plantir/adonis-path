"use strict";
const User = use("App/Models/User");
class Role {
  async handle({ request, auth, response }, next, roles) {
    // call next to advance the request
    let users = await User.query()
      .where({
        "users.id": auth.user.id
      })
      .leftJoin("roles", "users.role_id", "roles.id")
      .fetch();
    let user = users.rows[0];
    // let user_role = await user.load("role");
    let hasRole = roles.indexOf(user.role);
    if (!user || hasRole === -1) {
      response.status(403).send("permision denid");
      return;
    }
    await next();
  }
}

module.exports = Role;

"use strict";

const Hash = use("Hash");
const Role = use("App/Models/Role");

const UserHook = (module.exports = {});

/**
 * Hash using password as a hook.
 *
 * @method
 *
 * @param  {Object} userInstance
 *
 * @return {void}
 */
UserHook.hashPassword = async userInstance => {
  if (userInstance.password) {
    userInstance.password = await Hash.make(userInstance.password);
  }
};
UserHook.setRole = async userInstance => {
  if (!userInstance.role_id) {
    let role = await Role.findBy("role", "user");
    userInstance.role_id = role.id;
  }
};

"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class HandleErrorException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle(error, { response, session }) {
    console.log(error);
    return super.handle(...arguments)
  }
}

module.exports = HandleErrorException;

"use strict";
class Token {
  generate(type) {
    if (type === "digit") {
      return this._generate_digit();
    } else if (type === "string") {
      return this._generate_string();
    }
  }

  _generate_digit() {
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  }
  _generate_string(length) {
    length = length || 20;
    let token = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      token += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return token;
  }
}

module.exports = Token;

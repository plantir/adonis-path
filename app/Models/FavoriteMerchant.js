'use strict'

const Model = use('Model')

class FavoriteMerchant extends Model {
  merchants() {
    return this.belongsTo("App/Models/Merchant");
  }
}

module.exports = FavoriteMerchant

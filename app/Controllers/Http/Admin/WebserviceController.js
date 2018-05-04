"use strict";

const Webservice = use("App/Models/Webservice");
const Resource = use("MyResource");
const MerchantWebservice = use("MerchantWebservice");
class WebserviceController extends Resource {
  constructor() {
    super();
    this.Model = Webservice;
    this.allowField = [];
  }
  async refresh({ params: { id }, response }) {
    let webservice = await Webservice.find(id);
    let merchant = await webservice.merchant().fetch();
    let service = new MerchantWebservice(
      merchant.toJSON(),
      webservice.created_at,
      webservice.id
    );
    let result = await service.recall();
    response.send(result);
  }
}

module.exports = WebserviceController;

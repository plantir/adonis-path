"use strict";
const Helpers = use("Helpers");
const Invoice = use("App/Models/Invoice");
const Resource = use("MyResource");
class InvoiceController extends Resource {
  async view({ request, params, response }) {
    const { token } = request.get();

    response.download(Helpers.tmpPath(`invoices/${params.fileId}`));
  }
  constructor() {
    super();
    this.Model = Invoice;
    this.allowField = [];
  }
}

module.exports = InvoiceController;

const Route = use("Route");
Route.group(() => {
  Route.post("login", "UserController.login");
  Route.get("googleLogin", "UserController.googleLogin");
  Route.get("test", "UserController.test");
  Route.get("invoice/view/:fileId", "InvoiceController.view");
})
  .namespace("Admin")
  .prefix("admin");

Route.group(() => {
  Route.resource("newsletters", "NewsletterController");
  Route.resource("slideshows", "SlideshowController");
  Route.resource("workwithus", "WorkWithUsController");
  Route.resource("contactus", "ContactusController");
  Route.resource("merchants", "MerchantController");
  Route.resource("users", "UserController");
  Route.resource("offers", "OfferController");
  Route.resource("shoppingTrips", "ShoppingTripController");
  Route.resource("categories", "CategoryController");
  Route.resource("refers", "ReferController");
  Route.resource("userTransactions", "UserTransactionController");
  Route.resource("merchantTransactions", "MerchantTransactionController");
  Route.resource("merchantCategories", "MerchantCategoryController");
  Route.resource("specialEvents", "SpecialEventController");
  Route.resource("specialEventMerchants", "SpecialEventMerchantController");
  Route.resource("orders", "OrderController");
  Route.resource("invoice", "InvoiceController");
  Route.resource("webservices", "WebserviceController");
  Route.resource("notifications", "NotificationController");
  Route.get("merchants/:id/categories", "MerchantController.categories");
  Route.get("logs", "LogController.index");
  Route.post("recycle", "RecycleController.index");
  Route.get("recycle/:model", "RecycleController.list");
  Route.post("webservices/:id/refresh", "WebserviceController.refresh");
  Route.post("notifications/:id/seen", "NotificationController.seen");
})
  .namespace("Admin")
  .prefix("admin")
  .middleware(["auth", "role:admin,superUser"]);

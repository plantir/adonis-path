const Route = use("Route");
Route.group(() => {
  Route.get("/category/tree", "CategoryController.tree");
  Route.get("/category/subCategories", "CategoryController.subCategories");
  Route.get("/category/:id/merchants", "CategoryController.merchants");

  Route.get("/search", "SearchController.index");

  Route.post(
    "/merchant/register_request",
    "MerchantController.register_request"
  );
  Route.get("/merchant/:id", "MerchantController.show");
  Route.get("/merchant/:id/categories", "MerchantController.categories");
  Route.get("/merchant", "MerchantController.index");

  Route.get(
    "/shopping_trip/merchant_shopping_trips",
    "ShoppingTripController.merchant_shopping_trips"
  );
  Route.post(
    "/shopping_trip/save_merchant_shopping_trips",
    "ShoppingTripController.save_merchant_shopping_trips"
  );
  Route.post(
    "/shopping_trip/save_shopping_trip",
    "ShoppingTripController.save_shopping_trip"
  );

  Route.post("/contact_us", "ContactUsController.index");

  Route.get("/specialEvents", "SpecialEventController.index");

  Route.get("/slideshows", "SlideshowController.index");

  Route.get("/offer/topSeen", "OfferController.topSeen");

  Route.post("/saveOrderInfo", "OrderController.save_order");
}).namespace("Site");

// route for user
Route.group(() => {
  Route.post("/signup", "UserController.signup");
  Route.post("/login", "UserController.login");
  Route.post("/recover_password", "UserController.recover_password");
  Route.post("/verify_mobile", "UserController.verify_mobile");
  Route.post("/verify_email", "UserController.verify_email");
  Route.post("/reset_password", "UserController.reset_password");
})
  .namespace("Site")
  .prefix("user");

Route.group(() => {
  Route.get("/cashback_info", "UserController.cashback_info");
  Route.get("/account_balance", "UserController.account_balance");
  Route.get("/info", "UserController.info");
  Route.put("/info", "UserController.edit");
  Route.get("/favorite_merchants", "UserController.favorite_merchants");
  Route.post("/favorite_merchants", "UserController.add_favorite_merchants");
  Route.delete(
    "/favorite_merchants",
    "UserController.remove_favorite_merchants"
  );
  Route.get("/shopping_trips", "UserController.shopping_trips");
  Route.post("/update_shopping_trip", "UserController.update_shopping_trip");
  Route.get("/transactions", "UserController.transactions");
  Route.get("/notifications", "UserController.notifications");
  Route.post("/notifications/:id/seen", "UserController.see_notification");
  Route.get("/ballance", "UserController.ballance");
  Route.post("/change_password", "UserController.change_password");
  Route.post("/out_traffic", "UserController.out_traffic");
  Route.get("/resend_email", "UserController.resend_email");
  Route.get("/resend_sms", "UserController.resend_sms");
  Route.get("/is_favorite", "UserController.is_favorite");
  Route.post("/add_favorite", "UserController.add_favorite");
  Route.delete("/remove_favorite", "UserController.remove_favorite");
})
  .middleware(["auth"])
  .prefix("user")
  .namespace("Site");

const Route = use("Route");
Route.group(() => {
  Route.get("/searchMerchant", "ExtensionController.search_merchant");
  Route.get(
    "/userCashbackInfo",
    "ExtensionController.user_cashback_info"
  ).middleware(["auth"]);
  Route.post("/checkMerchant", "ExtensionController.check_merchant");
})
  .prefix("Extension")
  .namespace("Extension");

const Route = use("Route");
Route.group(() => {
  Route.get("/credit", "WalletController.credit");
  Route.post("/use_credit", "WalletController.use_credit");
})
  .middleware(["auth"])
  .prefix("wallet")
  .namespace("Wallet");

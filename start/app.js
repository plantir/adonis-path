"use strict";
const path = require("path");

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  "@adonisjs/framework/providers/AppProvider",
  "@adonisjs/auth/providers/AuthProvider",
  "@adonisjs/bodyparser/providers/BodyParserProvider",
  "@adonisjs/cors/providers/CorsProvider",
  "@adonisjs/lucid/providers/LucidProvider",
  "@adonisjs/framework/providers/ViewProvider",
  "@adonisjs/drive/providers/DriveProvider",
  "@adonisjs/mail/providers/MailProvider",
  "adonis-scheduler/providers/SchedulerProvider",
  path.join(__dirname, "..", "providers", "sms/provider/SMSProvider")
];

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
  "@adonisjs/lucid/providers/MigrationsProvider",
  "adonis-scheduler/providers/CommandsProvider"
];

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
// const aliases = {
//   MyModel: "App/helper/MyModel",
//   MyResource: "App/helper/MyResource",
//   MerchantWebservice: "App/services/MerchantWebservice",
//   Token: "App/services/Token",
//   Scheduler: "Adonis/Addons/Scheduler"
// };
const aliases = {
  MyModel: path.resolve(__dirname, "../app", "Helper", "MyModel"),
  MyResource: path.resolve(__dirname, "../app", "Helper", "MyResource"),
  MerchantWebservice: "App/services/MerchantWebservice",
  Token: "App/services/Token",
  Scheduler: "Adonis/Addons/Scheduler"
};

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [];

module.exports = {
  providers,
  aceProviders,
  aliases,
  commands
};

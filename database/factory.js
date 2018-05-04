"use strict";

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/
// http://chancejs.com
const Factory = use("Factory");

Factory.blueprint("App/Models/User", (faker, i, data) => {
  return {
    username: faker.username(),
    email: faker.email(),
    role_id: faker.pickone(data.roles),
    mobile: faker.phone(),
    status: faker.bool(),
    is_verified: faker.bool()
  };
});

Factory.blueprint("App/Models/Merchant", faker => {
  return {
    name: faker.username(),
    email: faker.email(),
    class: faker.integer({ min: 1, max: 3 }),
    url: faker.url(),
    commission: faker.integer({ min: 1, max: 20 })
  };
});

Factory.blueprint("App/Models/Category", (faker, i, data) => {
  return {
    name: faker.string(),
    parent_id: data.id
  };
});

Factory.blueprint("App/Models/Refer", (faker, i, data) => {
  return {
    referred_by: faker.pickone(data.users),
    referred_to: faker.pickone(data.users),
    referred_by_amount: 6000,
    referred_to_amount: 8000,
    referred_by_status: faker.bool(),
    referred_to_status: faker.bool()
  };
});

Factory.blueprint("App/Models/UserTransaction", (faker, i, data) => {
  return {
    user_id: faker.pickone(data.users),
    source_type: faker.integer({ min: 1, max: 6 }),
    status: faker.bool(),
    title: `عنوان تستی ${faker.integer({ min: 1, max: 10 })}`,
    description: `توضیحات تستی ${faker.integer({ min: 1, max: 10 })}`,
    value: faker.integer({ min: 0, max: 50000 }),
    value_status: faker.bool()
  };
});

Factory.blueprint("App/Models/MerchantTransaction", (faker, i, data) => {
  return {
    merchant_id: faker.integer({ min: 1, max: 50 }),
    status: faker.bool(),
    title: `عنوان تستی ${faker.integer({ min: 1, max: 10 })}`,
    description: `توضیحات تستی ${faker.integer({ min: 1, max: 10 })}`,
    value: faker.integer({ min: 0, max: 50000 }),
    payment_status: faker.bool()
  };
});

Factory.blueprint("App/Models/Offer", (faker, i, data) => {
  return {
    merchant_id: faker.integer({ min: 1, max: 50 }),
    title: `عنوان تستی ${faker.integer({ min: 1, max: 10 })}`,
    description: `توضیحات تستی ${faker.integer({ min: 1, max: 10 })}`,
    image: faker.avatar(),
    cashback: faker.integer({ min: 1, max: 20 }),
    url: faker.url()
  };
});

Factory.blueprint("App/Models/Newsletter", (faker, i, data) => {
  return {
    email: faker.email(),
    isApprove: faker.bool()
  };
});

Factory.blueprint("App/Models/Slideshow", (faker, i, data) => {
  return {
    title: `عنوان تستی ${faker.integer({ min: 1, max: 10 })}`,
    image: faker.avatar(),
    url: faker.url(),
    sort: faker.integer({ min: 1, max: 99 })
  };
});

Factory.blueprint("App/Models/WorkWithUs", (faker, i, data) => {
  return {
    firstName: faker.name(),
    email: faker.email(),
    name: faker.name(),
    company: faker.company(),
    site: faker.url(),
    tel: faker.phone(),
    siteTechnology: faker.pickone(["php", "asp", "nodejs"]),
    siteAge: faker.integer({ min: 1, max: 99 }),
    address: faker.address(),
    howFindUs: faker.integer({ min: 1, max: 3 }),
    fieldOfActivity: faker.integer({ min: 1, max: 10 })
  };
});

Factory.blueprint("App/Models/Contactus", (faker, i, data) => {
  return {
    name: faker.name(),
    email: faker.email(),
    message: faker.paragraph(),
    phone: faker.phone()
  };
});

Factory.blueprint("App/Models/ShoppingTrip", (faker, i, data) => {
  return {
    user_id: faker.pickone(data.users),
    merchant_id: faker.pickone(data.merchants),
    cashback: faker.integer({ min: 1, max: 10 }),
    commission: faker.integer({ min: 1, max: 20 }),
    total_amount: faker.integer({ min: 1, max: 50 }),
    cashback_amount: faker.integer({ min: 1000, max: 50000 }),
    commission_amount: faker.integer({ min: 1000, max: 50000 }),
    order_id: faker.integer(),
    shopping_status: faker.bool(),
    cashback_status: faker.bool(),
    order_at: new Date()
  };
});
Factory.blueprint("App/Models/MerchantCategory", (faker, i, data) => {
  return {
    category_id: faker.integer({ min: 1, max: 30 }),
    merchant_id: async () => {
      return (await Factory.model("App/Models/Merchant").create()).id;
    },
    cashback: faker.integer({ min: 1, max: 10 }),
    commission: faker.integer({ min: 1, max: 20 })
  };
});
Factory.blueprint("App/Models/SpecialEvent", (faker, i, data) => {
  return {
    title: `عنوان تستی ${faker.integer({ min: 1, max: 10 })}`,
    image: faker.avatar(),
    sort_order: faker.integer({ min: 1, max: 99 }),
    isActive: faker.bool(),
    isDeleted: faker.bool()
  };
});
Factory.blueprint("App/Models/SpecialEventMerchant", (faker, i, data) => {
  return {
    special_event_id: async () => {
      return (await Factory.model("App/Models/SpecialEvent").create()).id;
    },
    merchant_id: async () => {
      return (await Factory.model("App/Models/Merchant").create()).id;
    },
    isDeleted: 0
  };
});

Factory.blueprint("App/Models/Order", (faker, i, data) => {
  return {
    user_id: faker.pickone(data.users),
    merchant_id: faker.pickone(data.merchants),
    shopping_trip_id: faker.pickone(data.shoppingTrips),
    order_id: faker.string(),
    order_status: faker.integer({ min: 0, max: 2 }),
    total_amount: faker.integer({ min: 10000, max: 250000 }),
    return_guarantee: faker.integer({ min: 0, max: 10 }),
    order_detail: `[{"Id":"20612","price":"20000","total_price":"20000","quantity":1,"cashback":"6","cashback_amount":1200,"shopping_trip_id":"400","name":null,"image":"http://www.shadyab.com/assests/images/upload/","category_id":"10","shop_name":"رستوران بام قلهک دره"}]`,
    isDeleted: 0
  };
});
Factory.blueprint("App/Models/Webservice", (faker, i, data) => {
  return {
    merchant_id: async () => {
      return (await Factory.model("App/Models/Merchant").create()).id;
    },
    status: faker.pickone([200, 404, 500]),
    url:
      "http://89.165.1.86:7011/eshop/tms/3party/cashineh/sale?token=QWN0aW9uIFByb2Nlc3NlZC40aW9uIFByb2N&date=2018-02-24",
    response: `[
        {
          "shopping_trip_id": 974,
          "updated_on": "2018/02/24",
          "total_amount": 5964,
          "cashback": "3",
          "cashback_amount": 178.92,
          "order_id": 3636,
          "status": 2,
          "returnـguarantee": 0,
          "order_detail": [
            {
              "id": 2688,
              "name": "دستمال توالت معطر تنو روياي شيرين بنفش رنگ سه لايه 4 رول",
              "category_id": 95,
              "image_URL": "",
              "quantity": 1,
              "price": 5964,
              "cashback": 3,
              "cashback_amount": 178.92,
              "total_price": 5964
            }
          ]
        }
      ]`,
    isDeleted: 0
  };
});
Factory.blueprint("App/Models/UserNotification", (faker, i, data) => {
  return {
    user_id: 109,
    message: faker.sentence({ words: 5 }),
    is_seen: faker.bool({ likelihood: 30 })
  };
});

Factory.blueprint("App/Models/AdminNotification", (faker, i, data) => {
  return {
    message: faker.sentence({ words: 5 }),
    is_seen: faker.bool({ likelihood: 30 })
  };
});

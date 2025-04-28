import * as Hapi from "@hapi/hapi";

import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";

import { userProductDisplayController } from "./controller";

export class userProductDisplayRoutesNew implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new userProductDisplayController();
      server.route([
        {
          method: "GET",
          path: "/api/v1/userProduct/FoodList",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.FoodList,
            description: "Get Food List To display to the user",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userProduct/foodInfo",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.foodInfo,
            description: "View Detail about the food",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userProduct/orderFood",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.orderFood,
            description: "Order The Food Item",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userProduct/paymentGateway",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.paymentGateway,
            description: "Order The Food Item",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}

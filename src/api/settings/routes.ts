import * as Hapi from "@hapi/hapi";

import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";

import { SettingsController } from "./controller";

export class SettingsRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new SettingsController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/addFoodCategory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.AddCategoriesCont,
            description: "Store Sub",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingsRoutes/getFoodCategory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.GetCategoriesCont,
            description: "Store Sub",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingsRoutes/addSubFoodCategory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.AddSubCategoriesCont,
            description: "Store Sub",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingsRoutes/getSubFoodCategory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.GetSubCategoriesCont,
            description: "Store Sub",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}

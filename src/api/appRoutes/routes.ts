import * as Hapi from "@hapi/hapi";

import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";

import { AppRoutesController } from "./controller";

export class AppRoutesNew implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new AppRoutesController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/appRoutes/orderList",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listOrderDetails,
            description: "Add New Food Category",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}

import * as Hapi from "@hapi/hapi";

import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";

import { ProductComboController } from "./controller";

export class productComboRoutesNew implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProductComboController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/productCombo/addCategory",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addCategory,
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

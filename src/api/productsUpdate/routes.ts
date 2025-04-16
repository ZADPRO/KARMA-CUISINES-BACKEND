import * as Hapi from "@hapi/hapi";

import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";

import { ProductController } from "./controller";

export class productRoutesNew implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ProductController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/productRoutes/AddNewProducts",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.ProductAddController,
            description: "Store Products",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}

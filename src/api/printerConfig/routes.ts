import * as Hapi from "@hapi/hapi";

import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";

import { PrinterController } from "./controller";

export class PrinterRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new PrinterController();
      server.route([
        {
          method: "GET",
          path: "/api/v1/printer/getRestro",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.viewRestroAssign,
            description: "get restro",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}

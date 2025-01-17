import * as Hapi from "@hapi/hapi";
// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import { adminController } from "./controller";
import IRoute from "../../helper/routes";

export class adminRouters implements IRoute {
    public async register(server: any): Promise<any> {
      return new Promise((resolve) => {
        const controller = new adminController();
        server.route([
          {
            method: "POST",
            path: "/api/v1/admin/login",
            config: {
              handler: controller.adminlogin,
              description: "login Checking Validation",
              // tags: ["api", "users"],
              auth: false,
            },
          },
          
        ]);
  
        // Logger.info("API created successfully");
        resolve(true);
      });
    }
  }
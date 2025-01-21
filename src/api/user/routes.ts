import * as Hapi from "@hapi/hapi";


// import { Logger } from "winston" ;
import { decodeToken, validateToken } from "../../helper/token";
import { UserController } from "./controller";
import IRoute from "../../helper/routes";

export class UserRouters implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new UserController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/users/Signup",
          config: {
            handler: controller.userSignUp,
            description: "Signup Checking Validation",
            tags: ["api", "users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/users/forgotPassword",
          config: {
            handler: controller.forgotPassword,
            description: "forgotPassword",
            tags: ["api", "users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/users/sendOtp",
          config: {
            handler: controller.sendOtp,
            description: "forgotPassword",
            tags: ["api", "users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/users/addProduct",
          config: {
            handler: controller.addProduct,
            description: "forgotPassword",
            tags: ["api", "users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/users/orderplacement",
          config: {
            handler: controller.orderplacement,
            description: "User order placement",
            tags: ["api", "users"],
            auth: false,
          },
        },
      ]);

      // Logger.info("API created successfully");
      resolve(true);
    });
  }
}
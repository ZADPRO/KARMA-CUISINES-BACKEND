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
        {
          method: "GET",
          path: "/api/v1/productCombo/getCategory",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getCategory,
            description: "get Food Category",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/productCombo/updateCategory",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateCategory,
            description: "Updates Food Category",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/productCombo/deleteCategory",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteCategory,
            description: "Delete Food Category",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/productCombo/searchFood",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.searchFood,
            description: "Search Food Item",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/productCombo/addFood",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addFood,
            description: "Add new Food Items",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/productCombo/deleteFood",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteFood,
            description: "Deletes Food Item",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/productCombo/UpdateFood",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.UpdateFood,
            description: "Update Food Item",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/productCombo/CreateCombo",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.CreateCombo,
            description: "Create New Combo",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/productCombo/FoodImg",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.FoodImg,
            description: "Store The Food Img",
            tags: ["api", "Users"],
            auth: false,
            payload: {
              maxBytes: 10485760,
              output: "stream",
              parse: true,
              multipart: true,
            },
          },
        },
        {
          method: "GET",
          path: "/api/v1/productCombo/foodList",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.foodList,
            description: "Get the Food List",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}

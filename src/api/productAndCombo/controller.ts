import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { ProductsComboResolver } from "./resolver";

export class ProductComboController {
  public resolver: any;
  constructor() {
    this.resolver = new ProductsComboResolver();
  }

  public addCategory = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Add New Food Category");
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.addCategoryV1(request.payload, decodedToken);

      if (entity.success) {
        logger.info("Add New Food Category");
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding New Food Category", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };
  public getCategory = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Add New Food Category");
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.getCategoryV1(request.payload, decodedToken);

      if (entity.success) {
        logger.info("Add New Food Category");
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding New Food Category", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

}

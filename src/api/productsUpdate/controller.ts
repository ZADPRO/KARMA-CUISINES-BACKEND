import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token";
import { ProductsResolver } from "./resolver";

export class ProductController {
  public resolver: any;
  constructor() {
    this.resolver = new ProductsResolver();
  }

  public ProductAddController = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Product Add Controller --- Added");
    try {
      const decodedToken = { id: request.plugins.token.id };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.ProductAddV1(request.payload, decodedToken);

      if (entity.success) {
        logger.info("Entity success added - add products");
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding Product - Try module", error);
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

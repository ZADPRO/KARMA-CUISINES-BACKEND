import * as Hapi from "@hapi/hapi";

import logger from "../../helper/logger";

import { AppRoutesResolver } from "./resolver";

export class AppRoutesController {
  public resolver: any;
  constructor() {
    this.resolver = new AppRoutesResolver();
  }

  public listOrderDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.listOrderDetails(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error(`GET URL REQ => ${request.url.href}`, error);
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

import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { userProductDisplayResolver } from "./resolver";

export class userProductDisplayController {
  public resolver: any;
  constructor() {
    this.resolver = new userProductDisplayResolver();
  }

  public FoodList = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.FoodListV1(request.payload, decodedToken);

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
  public foodInfo = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.foodInfoV1(request.payload, decodedToken);

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
  public orderFood = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.orderFoodV1(request.payload, decodedToken);

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

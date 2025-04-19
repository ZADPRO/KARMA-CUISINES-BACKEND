import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token";
import { SettingsResolver } from "./resolver";

export class SettingsController {
  public resolver: any;
  constructor() {
    this.resolver = new SettingsResolver();
  }

  public AddCategoriesCont = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Sub category controller entered --- Added");
    try {
      const decodedToken = { id: request.plugins.token.id };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.AddFoodCategoryV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        logger.info("Entity success added - add categories");
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding sub product - Try module", error);
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

  public GetCategoriesCont = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Sub category controller entered --- Added");
    try {
      const decodedToken = { id: request.plugins.token.id };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.GetFoodCategoryV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        logger.info("Entity success added - add categories");
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding sub product - Try module", error);
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

  public AddSubCategoriesCont = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Sub category controller entered --- Added");
    try {
      const decodedToken = { id: request.plugins.token.id };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.AddFoodSubCategoryV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        logger.info("Entity success added - add categories");
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding sub product - Try module", error);
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

  public GetSubCategoriesCont = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Sub category controller entered --- Added");
    try {
      const decodedToken = { id: request.plugins.token.id };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.GetFoodSubCategoryV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        logger.info("Entity success added - add categories");
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Adding sub product - Try module", error);
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

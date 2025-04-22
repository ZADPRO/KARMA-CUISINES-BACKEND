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
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.addCategoryV1(request.payload, decodedToken);

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
  public getCategory = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.getCategoryV1(request.payload, decodedToken);

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
  public updateCategory = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.updateCategoryV1(
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
  public deleteCategory = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.deleteCategoryV1(
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
  public searchFood = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.searchFoodV1(request.payload, decodedToken);

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
  public addFood = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.addFoodV1(request.payload, decodedToken);

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
  public deleteFood = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.deleteFoodV1(request.payload, decodedToken);

      if (entity.success) {
        logger.info("Add New Food Category");
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
  public UpdateFood = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.UpdateFoodV1(request.payload, decodedToken);

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
  public CreateCombo = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.CreateComboV1(request.payload, decodedToken);

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
  public FoodImg = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.FoodImgV1(request.payload, decodedToken);

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
  public foodList = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.resolver.foodListV1(request.payload, decodedToken);

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

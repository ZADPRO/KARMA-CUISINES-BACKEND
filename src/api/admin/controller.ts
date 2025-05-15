import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token";

import { adminResolver } from "./resolver";

export class adminController {
  public resolver: any;

  constructor() {
    this.resolver = new adminResolver();
  }

  public adminlogin = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router ------------");
    try {
      let entity;

      entity = await this.resolver.adminloginV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in Admin:", error);
      return response
        .response({
          success: false,
          message: "An unknown error occurred",
        })
        .code(500);
    }
  };

  public uploadVendorV1 = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router ------------");
    try {
      let entity;

      entity = await this.resolver.uploadVendorV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in Admin:", error);
      return response
        .response({
          success: false,
          message: "An unknown error occurred",
        })
        .code(500);
    }
  };

  public getAllVendorDetails = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router ------------");
    try {
      let entity;

      entity = await this.resolver.getAllVendorDetails(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in Admin:", error);
      return response
        .response({
          success: false,
          message: "An unknown error occurred",
        })
        .code(500);
    }
  };
}

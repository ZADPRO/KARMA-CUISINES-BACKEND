import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token"

import { UserResolver } from "./resolver";

export class UserController {
  public resolver: any;

  constructor() {
    this.resolver = new UserResolver();
  }

  public userSignUp = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router ------------");
    try {
      let entity;
      entity = await this.resolver.userSignUpV1(request.payload);
      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in userSignUp:", error);
      return response
        .response({
          success: false,
          message: "An unknown error occurred in controller",
        })
        .code(500);
    }
  }

  public forgotPassword = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router ------------");
    try {
      let entity;
      entity = await this.resolver.forgotPasswordV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in userSignUp:", error);
      return response
        .response({
          success: false,
          message: "An unknown error occurred",
        })
        .code(500);
    }
  }

  public sendOtp = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router ------------");
    try {
      let entity;
      entity = await this.resolver.sendOtpV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in userSignUp:", error);
      return response
        .response({
          success: false,
          message: "An unknown error occurred",
        })
        .code(500);
    }
  }
  public orderplacement = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken ={
      id:request.plugins.token.id
    }
    // logger.info("Router ------------");
    try {
      
      console.log('decodedToken', decodedToken)
      let entity;
      entity = await this.resolver.orderplacementV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed
    } catch (error) {
      logger.error("Error in userSignUp:", error);
      return response
        .response({
          success: false,
          message: "An unknown error occurred",
        })
        .code(500);
    }
  }
  public vieworderplacement = async (
      request: any,
      response: Hapi.ResponseToolkit
    ): Promise<any> => {
      const decodedToken ={
        id:request.plugins.token.id
      }
      console.log('decodedToken', decodedToken)
      // logger.info("Router-----store Address");
      try {
        let entity;
        entity = await this.resolver.vieworderplacementV1(request.payload,decodedToken);
  
        if (entity.success) {
          return response.response(entity).code(201); // Created
        }
        return response.response(entity).code(200); // Bad Request if failed
  
      } catch (error) {
        logger.error("Error in getting order", error);
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
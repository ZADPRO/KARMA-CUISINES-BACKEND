import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token"
import { VendorResolver } from "./resolver";

export class VendorProfile {
  public resolver: any;

  constructor() {
    this.resolver = new VendorResolver();
  }

  public Vendorprofile = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----store Address");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }
      console.log('decodedToken', decodedToken)
      
    //   const decodedToken ={
    //   id:1
    // }
      let entity;

      entity = await this.resolver.VendorProfileV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in vendor profile", error);
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
  public VendorprofilePageData = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken ={
      id:request.plugins.token.id
    }
    logger.info("Router-----store Address");
    try {
      
      let entity;
      entity = await this.resolver.VendorprofilePageDataV1(request.payload, decodedToken);
      console.log('entity', entity)

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in vendor profile", error);
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
  public UpdateBasicDetail = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----store Address");
    try {
      const decodedToken ={
        id:request.plugins.token.id
      }      
      let entity;

      entity = await this.resolver.UpdateBasicDetailV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in vendor profile", error);
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
  
  public VendorBankDetails = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken ={
      id:request.plugins.token.id
    }
    // const decodedToken ={
    //   id:65
    // }
    console.log('decodedToken line--------------- 115 \n\n', decodedToken)
    try {
      let entity;
      entity = await this.resolver.VendorBankDetailsV1(request.payload,decodedToken);
      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in store vendor social links:", error);
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
  public RestaurentDocUplaod = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----store Address");
    const decodedToken ={
      id:request.plugins.token.id
    }
    try {
      let entity;
      entity = await this.resolver.RestaurentDocUplaodV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in store vendor social links:", error);
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
  public RestaurentDocUpdate = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken ={
      id:request.plugins.token.id
    }
    logger.info("Router-----store Vendor Documents");

    try {
      let entity;
      entity = await this.resolver.RestaurentDocUpdateV1(request.payload,decodedToken);
      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in store vendor social links:", error);
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
  public deleteRestaurentDoc = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken ={
      id:request.plugins.token.id
    }
    logger.info("Router-----store Address");
    try {

      let entity;
      entity = await this.resolver.deleteRestaurentDocV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in store vendor social links:", error);
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
  public LogoUpload = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken ={
      id:request.plugins.token.id
    }
    logger.info("Router-----store Address");
    try {
      let entity;
      entity = await this.resolver.LogoUploadV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in store vendor social links:", error);
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
  public LogoUpdate = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken ={
      id:request.plugins.token.id
    }
    logger.info("Router-----store Vendor Documents");

    try {
      let entity;
      entity = await this.resolver.LogoUpdateV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in store vendor social links:", error);
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
  public deleteLogo = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken ={
      id:request.plugins.token.id
    }
    console.log('decodedToken', decodedToken)
    logger.info("Router-----store Address");
    try {
      let entity;
      entity = await this.resolver.deleteLogoV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in store vendor social links:", error);
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
  public addProduct = async (
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
      entity = await this.resolver.addProductV1(request.payload,decodedToken);

      if (entity.success) {
        return response.response(entity).code(201); // Created
      }
      return response.response(entity).code(200); // Bad Request if failed

    } catch (error) {
      logger.error("Error in adding products", error);
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
  public VendorAuditList = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    const decodedToken ={
      id:request.plugins.token.id
    }
    console.log('decodedToken', decodedToken)

    try {
      logger.info(`GET URL REQ => ${request.url.href}`);
      const domainCode = request.headers.domain_code || "";
      const entity = await this.resolver.VendorAuditListV1(
        request.payload,
        decodedToken
      );

      if (entity.success) {
        return response.response(entity).code(200);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error("Error in Sending Data:", error);
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

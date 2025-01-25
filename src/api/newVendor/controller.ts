import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../../helper/logger";

import { decodeToken } from "../../helper/token"
import { NewVendorResolver } from "./resolver";

export class NewVendor {
  public resolver: any;

  constructor() {
    this.resolver = new NewVendorResolver();
  }

  public addNewVendor = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router-----Add New Vendor");
    try {
      // const decodedToken ={
      //   id:request.plugins.token.id
      // }
      const decodedToken ={
        id:2
      }
      console.log('decodedToken', decodedToken)
      let entity;

      entity = await this.resolver.addNewVendorV1(request.payload,decodedToken);

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

}

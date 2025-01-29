import * as Hapi from "@hapi/hapi";


// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import { VendorProfile } from "./controller";
import IRoute from "../../helper/routes";


export class vendorRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new VendorProfile();
      server.route([
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/BasicDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.Vendorprofile,
            description: "Store BasicDetails",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/BasicDetailPageData",
          config: {
            pre: [{ method: validateToken, assign: "token" }], // Use the validateToken function here
            handler: controller.VendorprofilePageData,
            description: "Passing the Vendorprofile Data to the Vendorprofile Page",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/UpdateBasicDetail",
          config: {
            pre: [{ method: validateToken, assign: "token" }], // Use the validateToken function here
            handler: controller.UpdateBasicDetail,
            description: "Passing the Vendorprofile Data to the Vendorprofile Page",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/BankDetails",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.VendorBankDetails,
            description: "Store VendorBankDetails",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/RestaurentDocUplaod",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.RestaurentDocUplaod,
            description: "Upload Restaurent Documents",
            tags: ["api", "Users"],
            auth: false,
            payload: {
              maxBytes: 10485760,
              output: "stream",
              parse: true,
              multipart: true,
            },

          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/RestaurentDocUpdate",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.RestaurentDocUpdate,
            description: "Store Restaurent Documents",
            auth: false,
          },
        },
        {
          method: "DELETE",
          path: "/api/v1/vendorRoutes/deleteRestaurentDoc",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteRestaurentDoc,
            description: "Delete Restaurent Documents",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/LogoUpload",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.LogoUpload,
            description: "Upload Logo Image",
            tags: ["api", "Users"],
            auth: false,
            payload: {
              maxBytes: 10485760,
              output: "stream",
              parse: true,
              multipart: true,
            },

          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/LogoUpdate",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.LogoUpdate,
            description: "Store Logo image",
            auth: false,
          },
        },
        {
          method: "DELETE",
          path: "/api/v1/vendorRoutes/deleteLogo",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteLogo,
            description: "Delete Logo Image",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/addProduct",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addProduct,
            description: "adding products",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/vendorRoutes/ViewaddedProduct",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.ViewaddedProduct,
            description: "adding products",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/offersApplied",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.offersApplied,
            description: "adding products",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/vendorRoutes/getOffers",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getOffers,
            description: "adding products",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/vendorRoutes/getDocuments",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getDocuments,
            description: "getting documents",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/addDocuments",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addDocuments,
            description: "add documents",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/UpdateDocuments",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.UpdateDocuments,
            description: "update documents",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/visibility",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.visibility,
            description: "visibility",
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/vendorRoutes/getPayement",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getPayement,
            description: "getting documents",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/addPayment",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addPayment,
            description: "add Payment",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/UpdatePayment",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.UpdatePayment,
            description: "update payment",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/paymentVisibility",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.paymentVisibility,
            description: "visibility",
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/VendorAuditList",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.VendorAuditList,
            description: "sending Vendor Details to Vendor Audit page ",
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
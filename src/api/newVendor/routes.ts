import { decodeToken, validateToken } from "../../helper/token";
import { NewVendor } from "./controller";
import IRoute from "../../helper/routes";

export class NewVendorRoute implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new NewVendor();
      server.route([
        {
          method: "POST",
          path: "/api/v1/vendor/addNew",
          config: {
            //   pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addNewVendor,
            description: "Add New Vendor Details",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}

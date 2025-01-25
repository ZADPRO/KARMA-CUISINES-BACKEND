import * as Hapi from "@hapi/hapi";

import { UserRouters } from "./api/user/routes";
import { vendorRoutes } from "./api/vendor/routes";
import { adminRouters } from "./api/admin/routes";
import { NewVendorRoute } from "./api/newVendor/routes";



export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new UserRouters().register(server);
    await new vendorRoutes().register(server);
    await new adminRouters().register(server);
    await new NewVendorRoute().register(server);

  }
}

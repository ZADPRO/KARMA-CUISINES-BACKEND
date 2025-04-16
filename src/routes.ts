import * as Hapi from "@hapi/hapi";

import { UserRouters } from "./api/user/routes";
import { vendorRoutes } from "./api/vendor/routes";
import { adminRouters } from "./api/admin/routes";
import { NewVendorRoute } from "./api/newVendor/routes";
import { productRoutesNew } from "./api/productsUpdate/routes";
import { SettingsRoutes } from "./api/settings/routes";

export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new UserRouters().register(server);
    await new vendorRoutes().register(server);
    await new adminRouters().register(server);
    await new NewVendorRoute().register(server);
    await new productRoutesNew().register(server);
    await new SettingsRoutes().register(server);
  }
}

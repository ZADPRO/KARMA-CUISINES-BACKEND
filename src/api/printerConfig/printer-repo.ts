import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { listVendorDetails } from "./query";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { CurrentTime } from "../../helper/common";

export class PrinterRepository {
  public async viewRestroAssign(user_data: any, tokendata?: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const listVendorForPrinter = await executeQuery(listVendorDetails); // ✅ Await here
      console.log("listVendorForPrinter", listVendorForPrinter);
      return encrypt(
        {
          success: true,
          message: "Display Vendor Successfully",
          data: listVendorForPrinter,
        },
        true
      );
    } catch (error) {
      console.error("Error during vendor insertion:", error);
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        true
      );
    }
  }
}

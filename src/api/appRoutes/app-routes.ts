import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import { formatDate } from "../../helper/common";
import * as fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";

import { CurrentTime } from "../../helper/common";
import { viewOrdersQuery } from "./query";

export class AppRoutesRepository {
  public async listOrderDetails(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const OrderList = await executeQuery(viewOrdersQuery, [
        user_data.storeId,
      ]);
      console.log("OrderList", OrderList);
      return encrypt(
        {
          success: true,
          message: "New Food Category Is Added Successfully",
          OrderList: OrderList,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 26", error);
      return encrypt(
        {
          success: false,
          message: "Error in Creating New Category",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
}

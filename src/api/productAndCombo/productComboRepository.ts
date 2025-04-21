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
import { getCategory, newCategory } from "./query";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";

import { CurrentTime } from "../../helper/common";

export class ProductsComboRepository {
  public async addCategoryV1(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const params = [user_data.categoryName, tokendata.id, CurrentTime()];
      await executeQuery(newCategory, params);
      return encrypt(
        {
          success: true,
          message: "New Food Category Is Added Successfully",
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 26", error);
      return encrypt({
        success: false,
        message: "Error in Creating New Category",
      });
    } finally {
    }
  }
  public async getCategoryV1(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const Category = await executeQuery(getCategory, []);
      return encrypt(
        {
          success: true,
          message: "Category List Passed SUccessfully",
          data: Category,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt({
        success: false,
        message: "Error in passing the Category List",
      });
    } finally {
    }
  }
}

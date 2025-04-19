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
import {
  listAllProducts,
  listAllSubProducts,
  settingsCategoryAdded,
  settingsSubCategoryAdded,
} from "./query";

export class SettingsPageRepo {
  public async AddSubFoodCategory(
    user_data: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    try {
      const { category } = user_data;
      console.log("category_name", tokendata);

      if (!category) {
        return encrypt(
          {
            success: false,
            message: "Sub category name is required",
          },
          true
        );
      }

      const values = [category, CurrentTime(), tokendata?.id || "anonymous"];

      const result = await executeQuery(settingsCategoryAdded, values);
      console.log("result of categories added - >", result);

      return encrypt(
        {
          success: true,
          message: "Sub category added successfully",
        },
        true
      );
    } catch (error) {
      console.error("Error during adding the sub category data:", error);
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async GetFoodCategory(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    try {
      const result = await client.query(listAllProducts);

      return encrypt(
        {
          success: true,
          message: "Fetched categories successfully",
          data: result.rows,
        },
        true
      );
    } catch (error) {
      console.error("Error during fetching the category data:", error);
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async AddSubProductFoodCategory(
    user_data: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    try {
      const { subCategory } = user_data;

      if (!subCategory) {
        return encrypt(
          {
            success: false,
            message: "Sub category name is required",
          },
          true
        );
      }

      const values = [subCategory, CurrentTime(), tokendata?.id || "anonymous"];

      const result = await executeQuery(settingsSubCategoryAdded, values);
      console.log("Sub category added - >", result);

      return encrypt(
        {
          success: true,
          message: "Sub category added successfully",
        },
        true
      );
    } catch (error) {
      console.error("Error during adding sub category:", error);
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async GetSubFoodCategory(
    user_data: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    try {
      const result = await client.query(listAllSubProducts);

      return encrypt(
        {
          success: true,
          message: "Fetched sub categories successfully",
          data: result.rows,
        },
        true
      );
    } catch (error) {
      console.error("Error during fetching sub category data:", error);
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        true
      );
    } finally {
      client.release();
    }
  }
}

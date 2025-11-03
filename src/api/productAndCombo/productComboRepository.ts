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
  addFood,
  comboDelete,
  ComboList,
  createCombo,
  deleteCategory,
  deleteFood,
  fetchOrderlist,
  FoodList,
  getCategory,
  getOrderData,
  menuIdCheck,
  newCategory,
  searchFood,
  updateCategory,
  updateFood,
} from "./query";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";

import { CurrentTime } from "../../helper/common";

export class ProductsComboRepository {
  public async addCategoryV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const params = [user_data.categoryName, tokendata.id, CurrentTime()];
      await executeQuery(newCategory, params);
      return encrypt(
        {
          success: true,
          message: "New Food Category Is Added Successfully",
          token: tokens,
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
  public async getCategoryV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const Category = await executeQuery(getCategory, []);
      return encrypt(
        {
          success: true,
          message: "Category List Passed SUccessfully",
          data: Category,
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error in passing the Category List",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async updateCategoryV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const params = [
        user_data.categoryId,
        user_data.categoryName,
        CurrentTime(),
        tokendata.id,
      ];
      await executeQuery(updateCategory, params);
      return encrypt(
        {
          success: true,
          message: "Category is Updated Successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error in updating The Category",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async deleteCategoryV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const params = [user_data.categoryId, CurrentTime(), tokendata.id];
      await executeQuery(deleteCategory, params);
      return encrypt(
        {
          success: true,
          message: "Category is Deleted Successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error in Deleting the Category",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async searchFoodV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      console.log(" -> Line Number ----------------------------------- 147");
      console.log("user_data", user_data);
      const params = [user_data.searchKey];
      const FoodItem = await executeQuery(searchFood, params);
      return encrypt(
        {
          success: true,
          message: "Category is Updated Successfully",
          token: tokens,
          data: FoodItem,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error in updating The Category",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async addFoodV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const params = [
        user_data.foodName,
        user_data.foodDescription,
        user_data.foodImgPath,
        user_data.foodPrice,
        user_data.foodQuantity,
        user_data.foodCategory,
        user_data.foodAddOns,
        CurrentTime(),
        tokendata.id,
        user_data.menuId,
        user_data.restroId,
      ];
      console.log("params line ----- 186", params);
      await executeQuery(addFood, params);
      return encrypt(
        {
          success: true,
          message: "New Food Added Successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error In Adding New Food",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async deleteFoodV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const params = [user_data.foodId];
      console.log("params line ----- 222", params);
      const Result = await executeQuery(deleteFood, params);
      console.log("Result", Result);

      return encrypt(
        {
          success: true,
          status: Result[0].status,
          message: Result[0].message,
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error In Deleting The Food Item",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async deleteComboV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const params = [user_data.comboId];
      await executeQuery(comboDelete, params);

      return encrypt(
        {
          success: true,
          message: "Combo Deleted Successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error In Deleting The Food Item",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async UpdateFoodV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const params = [
        user_data.foodName,
        user_data.foodDescription,
        user_data.foodImgPath,
        user_data.foodPrice,
        user_data.foodQuantity,
        user_data.foodCategory,
        user_data.foodAddOns,
        CurrentTime(),
        tokendata.id,
        user_data.menuId,
        user_data.foodId,
      ];
      await executeQuery(updateFood, params);

      return encrypt(
        {
          success: true,
          message: "Food Item Updated Successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error In Updating the Food Item",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async FoodImgV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      console.log("userData line ----- 282", userData);
      console.log("userData", userData.foodImg);
      const files = userData.foodImg;
      let filePaths: { files: string[] } = { files: [] };
      let storedFiles: any[] = [];

      console.log("files.length line ------ 326", files.length);

      const pdfPath = await storeFile(files, 5);
      filePaths.files.push(pdfPath);

      const pdfBuffer = await viewFile(pdfPath);
      const pdfBase64 = pdfBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(pdfPath),
        content: pdfBase64,
        contentType: "image/jpeg",
      });

      return encrypt(
        {
          success: true,
          message: "Food Image Stored Successfully",
          token: tokens,
          filePaths: filePaths,
          files: storedFiles,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error In Storing the Food Image",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async CreateComboV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const params = [
        user_data.menuId,
        user_data.comboName,
        user_data.comboImg,
        user_data.fixedFood,
        user_data.fixedQuantity,
        user_data.mainDish,
        user_data.mainDishLimit,
        user_data.sideDish,
        user_data.sideDishLimit,
        user_data.comboPrice,
        CurrentTime(),
        tokendata.id,
        user_data.comboDescription,
        user_data.refRestroId,
      ];
      await executeQuery(createCombo, params);

      return encrypt(
        {
          success: true,
          message: "Food Item Updated Successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error In Updating the Food Item",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async foodListV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      let FoodItem = await executeQuery(FoodList, []);
      let comboList = await executeQuery(ComboList, []);

      // --- Handle Food Items ---
      FoodItem = await Promise.all(
        FoodItem.map(async (data) => {
          if (data.refFoodImage) {
            try {
              const fileBuffer = await viewFile(data.refFoodImage);
              const fileBase64 = fileBuffer.toString("base64");
              const profileFile = {
                filename: path.basename(data.refFoodImage),
                content: fileBase64,
                contentType: "image/jpeg",
              };
              return { ...data, profileFile };
            } catch (err) {
              console.warn(
                `⚠️ Food image not found for ${data.refFoodImage}: setting '-'`
              );
              return { ...data, profileFile: "-" };
            }
          }
          return { ...data, profileFile: "-" };
        })
      );

      // --- Handle Combo List ---
      comboList = await Promise.all(
        comboList.map(async (data) => {
          if (data.refComboImg) {
            try {
              const fileBuffer = await viewFile(data.refComboImg);
              const fileBase64 = fileBuffer.toString("base64");
              const profileFile = {
                filename: path.basename(data.refComboImg),
                content: fileBase64,
                contentType: "image/jpeg",
              };
              return { ...data, profileFile };
            } catch (err) {
              console.warn(
                `⚠️ Combo image not found for ${data.refComboImg}: setting '-'`
              );
              return { ...data, profileFile: "-" };
            }
          }
          return { ...data, profileFile: "-" };
        })
      );

      return encrypt(
        {
          success: true,
          message: "Over View of Menu",
          token: tokens,
          FoodItem,
          comboList,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error In Getting Overview Menu",
          token: tokens,
        },
        true
      );
    }
  }

  public async checkMenuIdV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const menuIdCheckResult = await executeQuery(menuIdCheck, [
        user_data.menuID,
      ]);

      return encrypt(
        {
          success: true,
          menuID: menuIdCheckResult[0].case,
          message: "Menu Id Validation is Completed",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error In Validating the Menu Id",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async orderListV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const OrderList = await executeQuery(fetchOrderlist, []);
      console.log("OrderList", OrderList);

      return encrypt(
        {
          success: true,
          message: "Order List Passed Successfully",
          token: tokens,
          data: OrderList,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error In Passing Order List",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
  public async viewOrderDataV1(user_data: any, tokendata: any): Promise<any> {
    console.log("user_data", user_data);
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      const OrderData = await executeQuery(getOrderData, [user_data.orderId]);
      console.log("OrderData", OrderData);

      return encrypt(
        {
          success: true,
          message: "A Order Food Data is Passed Successfully",
          token: tokens,
          data: OrderData,
        },
        false
      );
    } catch (error) {
      console.log("error in line --------- 59", error);
      return encrypt(
        {
          success: false,
          message: "Error In getting the Ordered Food Data",
          token: tokens,
        },
        true
      );
    } finally {
    }
  }
}

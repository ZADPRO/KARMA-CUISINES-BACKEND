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
type FoodItem = {
  refFoodId: number;
  refFoodName: string;
  refDescription: string;
  refFoodImage: string;
  refPrice: string;
  refQuantity: string;
  refCategoryId: number;
  refFoodCategoryName: string;
  refMenuId: number;
  profileFile: any;
};

type GroupedFoodItems = {
  refCategoryId: number;
  refFoodCategoryName: string;
  items: FoodItem[];
};
import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";

import { CurrentTime } from "../../helper/common";
import {
  comboFoodList,
  comboList,
  FoodItemList,
  getOrderCount,
  listFood,
  orderUserDetails,
  storeFoodOrder,
  storeSubFoodOrder,
} from "./query";
import Payrexx from "../../helper/Payrexx";
import { sendEmail } from "../../helper/mail";
import { sendOrderConfirmationTemplate } from "../../helper/mailcontent";

export class userProductDisplayRepository {
  public async FoodListV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      let foodItem = await executeQuery(listFood, []);
      let comboItem = await executeQuery(comboList, []);

      foodItem = await Promise.all(
        foodItem.map(async (data) => {
          if (data.refFoodImage !== null) {
            const fileBuffer = await viewFile(data.refFoodImage);
            const fileBase64 = fileBuffer.toString("base64");
            const profileFile = {
              filename: path.basename(data.refFoodImage),
              // content: fileBase64,
              // contentType: "image/jpeg",
            };
            return { ...data, profileFile };
          }
          return data;
        })
      );

      comboItem = await Promise.all(
        comboItem.map(async (data) => {
          if (data.refComboImg !== null) {
            const fileBuffer = await viewFile(data.refComboImg);
            const fileBase64 = fileBuffer.toString("base64");
            const profileFile = {
              filename: path.basename(data.refComboImg),
              // content: fileBase64,
              // contentType: "image/jpeg",
            };
            return { ...data, profileFile };
          }
          return data;
        })
      );

      const groupedMap = new Map<number, GroupedFoodItems>();
      for (const item of foodItem) {
        const existingGroup = groupedMap.get(item.refCategoryId);
        if (existingGroup) {
          existingGroup.items.push(item);
        } else {
          groupedMap.set(item.refCategoryId, {
            refCategoryId: item.refCategoryId,
            refFoodCategoryName: item.refFoodCategoryName,
            items: [item],
          });
        }
      }

      const groupedFoodItems = Array.from(groupedMap.values());

      if (comboItem.length > 0) {
        groupedFoodItems.splice(2, 0, {
          refCategoryId: 0,
          refFoodCategoryName: "Combo",
          items: comboItem,
        });
      }

      return encrypt(
        {
          success: true,
          message: "Food Item passed Successfully",
          token: tokens,
          foodItem: groupedFoodItems,
        },
        true
      );
    } catch (error) {
      console.log("error in line --------- 26", error);
      return encrypt(
        {
          success: false,
          message: "Error in Listing the Food Items",
          token: tokens,
        },
        true
      );
    }
  }
  public async foodInfoV1(user_data: any, tokendata: any): Promise<any> {
    console.log("user_data line ----- 123", user_data);
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const params = [user_data.foodId];
      let foodInfo: any[] = [];

      if (user_data.foodCategory !== 0) {
        foodInfo = await executeQuery(FoodItemList, params);

        foodInfo = await Promise.all(
          foodInfo.map(async (data) => {
            if (data.refFoodImage !== null) {
              const fileBuffer = await viewFile(data.refFoodImage);
              const fileBase64 = fileBuffer.toString("base64");
              const profileFile = {
                filename: path.basename(data.refFoodImage),
                // content: fileBase64,
                // contentType: "image/jpeg",
              };
              data.profileFile = profileFile;
            }

            // Process add-on food images if they exist
            if (Array.isArray(data.refAddOns) && data.refAddOns.length > 0) {
              data.refAddOns = await Promise.all(
                data.refAddOns.map(async (food: any) => {
                  if (food.refFoodImage !== null) {
                    const fileBuffer = await viewFile(food.refFoodImage);
                    const fileBase64 = fileBuffer.toString("base64");
                    const profileFile = {
                      filename: path.basename(food.refFoodImage),
                      // content: fileBase64,
                      // contentType: "image/jpeg",
                    };
                    return { ...food, profileFile };
                  }
                  return food;
                })
              );
            }

            return data;
          })
        );
      } else {
        foodInfo = await executeQuery(comboFoodList, params);
        foodInfo = await Promise.all(
          foodInfo.map(async (data) => {
            if (data.refComboImg !== null) {
              const fileBuffer = await viewFile(data.refComboImg);
              const fileBase64 = fileBuffer.toString("base64");
              const profileFile = {
                filename: path.basename(data.refComboImg),
                // content: fileBase64,
                // contentType: "image/jpeg",
              };
              data.profileFile = profileFile;
            }

            // Process add-on food images if they exist
            if (
              Array.isArray(data.refFixedProduct) &&
              data.refFixedProduct.length > 0
            ) {
              data.refFixedProduct = await Promise.all(
                data.refFixedProduct.map(async (food: any) => {
                  if (food.refFoodImage !== null) {
                    const fileBuffer = await viewFile(food.refFoodImage);
                    const fileBase64 = fileBuffer.toString("base64");
                    const profileFile = {
                      filename: path.basename(food.refFoodImage),
                      // content: fileBase64,
                      // contentType: "image/jpeg",
                    };
                    return { ...food, profileFile };
                  }
                  return food;
                })
              );
            }

            if (
              Array.isArray(data.refMainProduct) &&
              data.refMainProduct.length > 0
            ) {
              data.refMainProduct = await Promise.all(
                data.refMainProduct.map(async (food: any) => {
                  if (food.refFoodImage !== null) {
                    const fileBuffer = await viewFile(food.refFoodImage);
                    const fileBase64 = fileBuffer.toString("base64");
                    const profileFile = {
                      filename: path.basename(food.refFoodImage),
                      // content: fileBase64,
                      // contentType: "image/jpeg",
                    };
                    return { ...food, profileFile };
                  }
                  return food;
                })
              );
            }

            if (
              Array.isArray(data.refSideDish) &&
              data.refSideDish.length > 0
            ) {
              data.refSideDish = await Promise.all(
                data.refSideDish.map(async (food: any) => {
                  if (food.refFoodImage !== null) {
                    const fileBuffer = await viewFile(food.refFoodImage);
                    const fileBase64 = fileBuffer.toString("base64");
                    const profileFile = {
                      filename: path.basename(food.refFoodImage),
                      // content: fileBase64,
                      // contentType: "image/jpeg",
                    };
                    return { ...food, profileFile };
                  }
                  return food;
                })
              );
            }

            return data;
          })
        );
      }

      return encrypt(
        {
          success: true,
          message: "Food Item passed Successfully",
          token: tokens,
          food: foodInfo,
        },
        true
      );
    } catch (error) {
      console.log("error in foodInfoV1 ---------", error);
      return encrypt(
        {
          success: false,
          message: "Error in Listing the Food Items",
          token: tokens,
        },
        true
      );
    }
  }
  public async orderFoodV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    console.log("user_data line ------ 288", user_data);
    try {
      await client.query("BEGIN");

      const userParams = [
        user_data.payload.userFName,
        user_data.payload.userLName,
        user_data.payload.userMobile,
        user_data.payload.userEmail,
        user_data.payload.userStreet,
        user_data.payload.userPostalCode,
        user_data.payload.userZone,
        user_data.payload.userCountry,
        CurrentTime(),
        "User",
      ];
      console.log("userParams line ---- 303", userParams);
      const userResult: any = await client.query(orderUserDetails, userParams);
      const orderCount = await executeQuery(getOrderCount, []);
      console.log("orderCount", orderCount);
      const baseOrderId = 10001;
      const orderCountValue = orderCount?.[0]?.orderCount || 0;
      const OrderId = `KC${baseOrderId + orderCountValue}`;
      console.log("OrderId line ---- 307", OrderId);

      user_data.payload.order.map(async (data: any, index: number) => {
        if (!data.ifCambo) {
          console.log(
            " -> Line Number ----------------------------------- 311"
          );
          const foodItemParams = [
            OrderId,
            user_data.payload.storeId,
            userResult.rows[0].refUserId,
            data.FoodId,
            data.FoodName,
            data.foodCategory,
            data.foodPrice,
            data.foodQuantity,
            data.ifCambo,
            user_data.payload.transactionId,
            user_data.payload.paymentType,
            user_data.payload.totalAmtPaid,
            CurrentTime(),
            "user",
          ];
          console.log("foodItemParams line ------ 330 \n", foodItemParams);
          await client.query(storeFoodOrder, foodItemParams);
        } else {
          console.log(
            " -> Line Number ----------------------------------- 332"
          );
          const foodParams = [
            OrderId,
            user_data.payload.storeId,
            userResult.rows[0].refUserId,
            data.FoodId,
            data.FoodName,
            data.foodCategory,
            data.foodPrice,
            data.foodQuantity,
            data.ifCambo,
            user_data.payload.transactionId,
            user_data.payload.paymentType,
            user_data.payload.totalAmtPaid,
            CurrentTime(),
            "user",
          ];
          console.log("foodItemParams line ----- 352 \n", foodParams);
          const orderResult: any = await client.query(
            storeFoodOrder,
            foodParams
          );
          data.subProduct.map(async (subData: any, Intex: number) => {
            console.log("subData line ------ 362", subData);
            const subOrderParams = [
              orderResult.rows[0].refOrderId,
              subData.FoodName,
              subData.FoodId,
              subData.foodQuantity,
              subData.foodType,
              CurrentTime(),
              "User",
            ];
            console.log("subOrderParams line ----- 364 \n", subOrderParams);
            await client.query(storeSubFoodOrder, subOrderParams);
          });
        }
      });
      await client.query("COMMIT");

      const mail = async () => {
        const mailOptions = {
          to: user_data.payload.userEmail,
          subject: "You Accont has be Created Successfully In our Platform",
          html: sendOrderConfirmationTemplate(user_data.payload),
        };
        try {
          await sendEmail(mailOptions);
          console.log("mailOptions", mailOptions);
        } catch (error) {
          console.error("Failed to send email:", error);
        }
      };
      mail().catch(console.error);

      return encrypt(
        {
          success: true,
          message: "Order Placed Successfully",
          token: tokens,
          orderId: OrderId,
        },
        true
      );
    } catch (error) {
      console.log("error in foodInfoV1 ---------", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "Error in Placing The Order",
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async paymentGateway(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    const payrexx = new Payrexx(
      "karmacuisines",
      "p9d4TdHGnkujeNx2T90jaygculBt9Q"
    );

    try {
      // Send payment request to Payrexx
      const result = await payrexx.post("Gateway", {
        amount: user_data.amount * 100,
        currency: "CHF",
        vatRate: 7.7,
        purpose: "Test Payment",
        psp: [44, 36],
        successRedirectUrl:
          "https://karmacuisine.ch/orders?status=success&message=Payment+Successful",
        failedRedirectUrl: "https:/karmacuisine.ch/orders?status=failure",
        fields: {
          email: { value: user_data.email },
          forename: { value: user_data.firstName },
          surname: { value: user_data.lastName },
        },
      });

      console.log("Payrexx API Response:", result);

      if (result && result.status && result.data) {
        return encrypt(
          {
            success: true,
            message: "Employee Payed List passed successfully",
            token: tokens,
            data: result.data,
          },
          true
        );
      } else {
        throw new Error("Payrexx response does not contain expected data");
      }
    } catch (error) {
      console.error("Error in Payrexx API call:", error);

      return encrypt(
        {
          success: false,
          message: "Failed to create payment link",
          error: error || "Unknown error",
          token: tokens,
        },
        true
      );
    }
  }
}

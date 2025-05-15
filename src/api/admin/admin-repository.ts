import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { selectUserByLogin, updateHistoryQuery } from "./query";
import { CurrentTime } from "../../helper/common";

export class adminRepository {
  public async adminloginV1(user_data: any, domain_code?: any): Promise<any> {
    try {
      const params = [user_data.login];
      const users = await executeQuery(selectUserByLogin, params);

      if (users.length > 0) {
        const user = users[0];

        const dataUser = process.env;
        console.log(process.env);

        // Verify the password
        const validPassword = await bcrypt.compare(
          user_data.password,
          user.refCustHashedPassword
        );
        if (validPassword) {
          const history = [2, user.refUserId, "Login", CurrentTime(), "Admin"];
          const updateHistory = await executeQuery(updateHistoryQuery, history);

          if (updateHistory) {
            const tokenData = { id: user.refUserId };

            return encrypt(
              {
                success: true,
                dataUser: dataUser,
                userDetails: users,
                message: "Login successful",
                token: generateTokenWithExpire(tokenData, true),
              },
              true
            );
          }
        }
      }

      // Return error if user not found or invalid password
      return encrypt(
        {
          success: false,
          message: "Invalid login credentials",
        },
        true
      );
    } catch (error) {
      console.error("Error during login:", error);
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        true
      );
    }
  }

  public async uploadVendorV1(user_data: any, domain_code?: any): Promise<any> {
    console.log("user_data", user_data);
    try {
      const {
        restroName,
        vendorId,
        contactName,
        designation,
        email,
        mobile,
        street,
        floor,
        zone,
        code,
        land,
        vatNumber,
        commercialExtract,
        alcoholLicense,
        bankName,
        accountNumber,
        bankCode,
      } = user_data;

      const query = `
      INSERT INTO public."vendorDetails"
      (
        "restroName", "vendorId", "personName", designation, email, mobile,
        "streetNo", floor, zone, code, land, vat, cre, alcohol,
        "bankName", iban, "bankCode"
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17
      )
      RETURNING id
    `;

      const values = [
        restroName,
        vendorId,
        contactName,
        designation,
        email,
        mobile,
        street,
        floor,
        zone,
        code,
        land,
        vatNumber,
        commercialExtract,
        alcoholLicense,
        bankName,
        accountNumber,
        bankCode,
      ];

      const result = await executeQuery(query, values);
      console.log("result", result);

      return encrypt(
        {
          success: true,
          message: "Insert vendor successfully",
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

  public async getAllVendorDetails(
    user_data: any,
    domain_code?: any
  ): Promise<any> {
    console.log("user_data", user_data);
    try {
      const query = `
      SELECT * FROM public."vendorDetails";
    `;

      const result = await executeQuery(query);
      console.log("result", result);

      return encrypt(
        {
          success: true,
          message: "Selected vendor successfully",
          result: result,
        },
        true
      );
    } catch (error) {
      console.error("Error during vendor fetching:", error);
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

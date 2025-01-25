import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import { formatDate } from "../../helper/common";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";

import {
  getVendorCountQuery,
  insertVendorBasicDetails,
  insertCommunicationQuery,
  insertUserAddressQuery,
  insertVendorData,
  insertRestroDays,
  insertVendorSocialLinksQuery,
  insertRestroDocs,
  insertVendorBankDetailsQuery,
  updateHistoryQuery,
} from "./query";
import { CurrentTime } from "../../helper/common";

export class NewVendorRepository {
  public async addNewVendorV1(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const VendorCountResult = await executeQuery(getVendorCountQuery);
      const VendorCount = parseInt(VendorCountResult[0].count, 10); // Extract and convert count to a number
      const newVendorId = `VD${(VendorCount + 1).toString().padStart(3, "0")}`;
      await client.query("BEGIN");

      const basicDetails = user_data.BasicInfo;

      // Users Table Params
      const usersParams = [
        basicDetails.Users.refPerFName,
        basicDetails.Users.refPerLName,
        newVendorId,
        basicDetails.Users.refRollId,
      ];
      const userData: any = await client.query(
        insertVendorBasicDetails,
        usersParams
      );
      const userId = userData.rows[0].refUserId;

      // Vendor Communication Details
      const userCommunication = [
        userId,
        basicDetails.Communtication.refPerMob,
        basicDetails.Communtication.refPerEmail,
      ];
      await client.query(insertCommunicationQuery, userCommunication);

      // Vendor Address
      const userAddress = [
        userId,
        basicDetails.Address.refStreet,
        basicDetails.Address.refCity,
        basicDetails.Address.refPosCode,
        basicDetails.Address.refZone,
        basicDetails.Address.refCountry,
      ];
      await client.query(insertUserAddressQuery, userAddress);

      // Vendor Table Data

      const vendorParams = [
        userId,
        basicDetails.Vendor.refRestroName,
        basicDetails.Vendor.refPerDesig,
        basicDetails.ProfileImgPath,
      ];

      const vendorResult: any = await client.query(
        insertVendorData,
        vendorParams
      );
      // Restorent Working Details
      const jsonInput = JSON.stringify(basicDetails.RestroWork);
      await client.query(insertRestroDays, [jsonInput, userId]);

      const socialLinkParams = [
        userId,
        basicDetails.SocialLink.refWebsiteLink,
        basicDetails.SocialLink.refFaceBookLink,
        basicDetails.SocialLink.refInstragramLink,
        basicDetails.SocialLink.refTwitterLink,
      ];

      await client.query(insertVendorSocialLinksQuery, socialLinkParams);

      // Restorent Documents Updtae

      const jsonDoc = JSON.stringify(user_data.RestroDetails);
      await client.query(insertRestroDocs, [jsonDoc, userId]);

      // Bank Details Upload
      const vendorBankDetailsParams = [
        userId,
        user_data.FinancialInfo.refBankName,
        user_data.FinancialInfo.refAccNo,
        user_data.FinancialInfo.refIBANCode,
        user_data.FinancialInfo.refPayType,
        user_data.FinancialInfo.refMonTransDetail,
      ];
      await client.query(insertVendorBankDetailsQuery, vendorBankDetailsParams);

      const txnHistoryParams = [
        18, // TransTypeID
        userId, // refUserId
        "New Vendor Added", // transData
        CurrentTime(), // TransTime
        "Admin", // UpdatedBy
      ];

      await client.query(updateHistoryQuery, txnHistoryParams);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message:
            "Vendor and user data with social links inserted successfully",
          token: tokens,
        },
        false
      );
    } catch (error) {
      console.log("error", error);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "Data insertion failed",
          token: tokens,
        },
        false
      );
    } finally {
      client.release();
    }
  }
}

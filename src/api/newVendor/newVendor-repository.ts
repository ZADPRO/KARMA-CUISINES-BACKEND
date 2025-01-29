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
  insertVendorBasicDetails, insertCommunicationQuery, insertUserAddressQuery, insertVendorData, insertRestroDays, insertVendorSocialLinksQuery, insertRestroDocs, insertVendorBankDetailsQuery,
  updateHistoryQuery,
  fetchProfileData, fetchRestroCertificates
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
  public async viewProfileV1(userData: any, tokendata: any): Promise<any> {
      const token = { id: tokendata.id }
      const tokens = generateTokenWithExpire(token, true)
  
      try {  
        const refUserId = userData.userData.refUserId;
      
        if (!refUserId) {
          console.log('refUserId', refUserId)
          throw new Error("Invalid refUserId. Cannot be null or undefined.");
        }
  
        console.log('Parsed refUserId:', refUserId);
  
        const params = [refUserId];
        console.log('params', params)
        const BasicInfo = await executeQuery(fetchProfileData, params);
        console.log('profileResult', BasicInfo)
  
        if (BasicInfo.length === 0) {
          throw new Error("No profile data found for the given refUserId.");
        }
  
        const profileData = {
          users: {
          fname: BasicInfo[0].refUserFName,
          lname: BasicInfo[0].refUserLName,
          refRoleId: BasicInfo[0].refRoleId,
          },
          Communtication:{
          phone: BasicInfo[0].refMobileNo,
          email: BasicInfo[0].refEmail,
          },
          address: {
            street: BasicInfo[0].refStreet,
            city: BasicInfo[0].refCity,
            postalCode: BasicInfo[0].refPostalCode,
            zone: BasicInfo[0].refZone,
            country: BasicInfo[0].refCountry,
          },
          RestroWork:{
          refDayId:BasicInfo[0].refDayId,
          StartTime:BasicInfo[0].refStartTime,
          EndTime:BasicInfo[0].refEndTime,
          },
          Vendor:{
          vendorName: BasicInfo[0].refVendorName,
          vendorDesignation: BasicInfo[0].refVendorDesignation,
          },
          socialLinks: {
            websiteUrl: BasicInfo[0].websiteUrl,
            facebookUrl: BasicInfo[0].facebookUrl,
            instagramUrl: BasicInfo[0].instagramUrl,
            twitterUrl: BasicInfo[0].twitterUrl,
          },
          ProfileImgPath:{
          logo: BasicInfo[0].refVendorLogo,
          },
          RestroDetails: {
          documents: BasicInfo.map(doc => ({
            restroDocId: doc.restroDocId,
            refDocPath: doc.refDocPath,
          }))},
          bankDetails: {
            bankName: BasicInfo[0].refBankName,
            accountNumber: BasicInfo[0].refAccountNumber,
            ibanCode: BasicInfo[0].refIbanCode,
            paymentId: BasicInfo[0].paymentId,
            moneyTransferDetails: BasicInfo[0].refMoneyTransferDetails,
          },
        };
        
        const Result = await executeQuery(fetchRestroCertificates, []);
        console.log('Result', Result)
        const restroDetails = Result.map((row: any) => ({
          CertificateType: row.refCertificateType,
        }));
  
        const registerData = {
          ProfileData: profileData,
          restroDetails, // Use the mapped `restroDetails` here
        };
  
        console.log('Constructed registerData:', registerData);
  
        return encrypt({
          success: true,
          message: "Vendor Profile Page Data retrieved successfully",
          token: tokens,
          data: registerData,
        }, false);
      } catch (error) {
        const errorMessage = (error as Error).message; // Cast `error` to `Error` type
        console.error('Error in VendorprofilePageData:', errorMessage);
        return encrypt({
          success: false,
          message: `Error in Vendor Profile Page Data retrieval: ${errorMessage}`,
          token: tokens
        }, false);
      }
  }
  public async updateProfileV1(userData: any, tokendata: any): Promise<any> {
      const client: PoolClient = await getClient();
      const refUserId = userData.userData.refUserId;
      const token = { id: tokendata.id }
      console.log('token', token)
      const tokens = generateTokenWithExpire(token, true)
      console.log('tokens', tokens)
      try {
        await client.query("BEGIN");
  
        const updateSections = userData.userData.user_data;
  
        for (const section in updateSections) {
  
          if (updateSections.hasOwnProperty(section)) {
            let tableName: string;
            let updatedData: any = {};
            let oldData: any = {};
  
            switch (section) {
              case "user":
                console.log('user',)
                tableName = "users";
                for (const key in updateSections.user) {
                  updatedData[key] = updateSections.user[key].newData;
                  oldData[key] = updateSections.user[key].oldData;
                }
                break;
                case "communication":
                  console.log('communication',)
                  tableName = "refCommunication";
                  for (const key in updateSections.communication) {
                    updatedData[key] = updateSections.communication[key].newData;
                    oldData[key] = updateSections.communication[key].oldData;
                  }
                  break;
              case "address":
                  console.log('address',)
                  tableName = "refUserAddress";
                  for (const key in updateSections.socialLinks) {
                    updatedData[key] = updateSections.socialLinks[key].newData;
                    oldData[key] = updateSections.socialLinks[key].oldData;
                  }
                  break;
              case "RestroWorkDay":
                  console.log('RestroWorkDay',)
                  tableName = "refVandorRestroWorkDay";
                  for (const key in updateSections.socialLinks) {
                    updatedData[key] = updateSections.socialLinks[key].newData;
                    oldData[key] = updateSections.socialLinks[key].oldData;
                  }
                  break;
                  case "vendorTable":
                    console.log('vendorTable',)
                    tableName = "vendorTable";
                    for (const key in updateSections.socialLinks) {
                      updatedData[key] = updateSections.socialLinks[key].newData;
                      oldData[key] = updateSections.socialLinks[key].oldData;
                    }
                    break;

              case "socialLinks":
                console.log('socialLinks',)
                tableName = "vendorSocialLinks";
                for (const key in updateSections.socialLinks) {
                  updatedData[key] = updateSections.socialLinks[key].newData;
                  oldData[key] = updateSections.socialLinks[key].oldData;
                }
                break;
                case "RestaurentDocuments":
                console.log('RestaurentDocuments',)
                tableName = "refRestaurentDocuments";
                for (const key in updateSections.socialLinks) {
                  updatedData[key] = updateSections.socialLinks[key].newData;
                  oldData[key] = updateSections.socialLinks[key].oldData;
                }
                break;
                case "socialLinks":
                console.log('socialLinks',)
                tableName = "vendorBankDetails";
                for (const key in updateSections.socialLinks) {
                  updatedData[key] = updateSections.socialLinks[key].newData;
                  oldData[key] = updateSections.socialLinks[key].oldData;
                }
                break;
              default:
                continue;
            }
  
            const identifier = { column: "refUserId", value: refUserId };
            console.log('identifier', identifier);
  
            const { updateQuery, values } = buildUpdateQuery(
              tableName,
              updatedData,
              identifier
            );
            console.log('updateQuery', updateQuery)
            console.log('values', values)
  
            const userResult = await client.query(updateQuery, values);
            console.log('userResult', userResult);
            if (!userResult.rowCount) {
              throw new Error("Failed to update the profile data.");
            }
  
          }
        }
  
        // Insert transaction history
        const txnHistoryParams = [
          10, // TransTypeID
          userData.userData.refUserId, // refUserId
          "Vendor details Updated", // transData
          CurrentTime(),  // TransTime
          "Vendor" // UpdatedBy
        ];
        console.log('Inserting transaction history with params:', txnHistoryParams);
        const txnResult = await client.query(updateHistoryQuery, txnHistoryParams);
        console.log('Transaction History Insert Result:', txnResult);
  
        if (!txnResult.rowCount) {
          throw new Error("Insert transaction history query failed");
        }
  
        await client.query("COMMIT");
        return encrypt({
          success: true,
          message: "Profile data updated successfully",
          token: tokens,
        }, true);
      } catch (error) {
        await client.query("ROLLBACK");
  
        let errorMessage = "Error in updating the profile data";
        if (error instanceof Error) {
          errorMessage = `Error in updating the profile data: ${error.message}`;
        }
  
        return encrypt({
          success: false,
          message: errorMessage,
          token: tokens,
        }, true);
      } finally {
        client.release();
      }
  }
}
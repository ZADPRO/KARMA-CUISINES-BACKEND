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
  insertVendorQuery,
  insertUserQuery,
  insertCommunicationQuery,
  insertUserAddressQuery,
  insertVendorSocialLinksQuery,
  RestroDetailsQuery,
  updateHistoryQuery,
  getPaymentTypeNameQuery,
  insertVendorBankDetailsQuery,
  getVendorCount,
  RestaurentDocStoreQuery,
  getDocumentQuery,
  deleteDocumentQuery,
  ImageStoreQuery,
  fetchProfileData,
  fetchRestroCertificates,
  getUpDateList,
  deleteImageQuery
} from './query';
import { CurrentTime } from "../../helper/common";


export class VendorRepository {

  public async VendorProfileV1(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    console.log('token', token);
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      await client.query("BEGIN");
      const ui = user_data.user_data;

      // Vendor count and generation of new vendor ID
      const VendorCountResult = await executeQuery(getVendorCountQuery);
      console.log('VendorCountResult', VendorCountResult);
      const VendorCount = parseInt(VendorCountResult[0].count, 10); // Extract and convert count to a number
      const newVendorId = `VD${(VendorCount + 1).toString().padStart(3, '0')}`;
      console.log('Generated VendorId:', newVendorId);

      // Insert User
      const userParams = [
        ui.user_data.user.refUserFname,
        ui.user_data.user.refUserLname,
        newVendorId,
        ui.user_data.user.refRoleId
      ];
      const userResult = await executeQuery(insertUserQuery, userParams);
      console.log('userResult', userResult);

      if (!userResult || userResult.length === 0) {
        throw new Error('Failed to insert user');
      }
      const userId = userResult[0].refUserId;
      console.log('userId:', userId);

      // Insert Communication
      const communicationParams = [
        userId,
        ui.user_data.communication.refMobileno,
        ui.user_data.communication.refEmail
      ];
      const communicationResult = await executeQuery(insertCommunicationQuery, communicationParams);
      console.log('communicationResult', communicationResult);

      // Insert User Address
      const userAddressParams = [
        userId,
        ui.user_data.address.refStreet,
        ui.user_data.address.refCity,
        ui.user_data.address.refPostalCode,
        ui.user_data.address.refZone,
        ui.user_data.address.refCountry
      ];
      const userAddressResult = await executeQuery(insertUserAddressQuery, userAddressParams);
      console.log('userAddressResult', userAddressResult);

      // Insert Vendor
      const vendorParams = [
        userId,
        ui.user_data.vendorName,
        ui.user_data.vendordesgination
      ];
      const vendorResult = await executeQuery(insertVendorQuery, vendorParams);
      console.log('vendorResult', vendorResult);

      if (!vendorResult || vendorResult.length === 0) {
        throw new Error('Failed to insert vendor');
      }
      const vendorId = vendorResult[0].refVendorId;

      // Insert Social Links
      const socialLinksParams = [
        userId,
        ui.user_data.socialLinks.websiteUrl, // Check if socialLinks exist before using
        ui.user_data.socialLinks.facebookUrl,
        ui.user_data.socialLinks.instagramUrl,
        ui.user_data.socialLinks.twitterUrl
      ];

      // Ensure socialLinks exist and are passed correctly
      let socialLinksResult;
      if (ui.user_data.socialLinks) {
        socialLinksResult = await executeQuery(insertVendorSocialLinksQuery, socialLinksParams);
        console.log('socialLinksResult', socialLinksResult);
      } else {
        console.warn('No social links provided, skipping insertion.');
      }

      // Insert History
      const txnHistoryParams = [
        5, // TransTypeID
        userId, // refUserId
        "vendor profile entry", // transData
        CurrentTime(),  // TransTime
        "Admin" // UpdatedBy
      ];
      await executeQuery(updateHistoryQuery, txnHistoryParams);

      // Get Restaurant Details
      const restroDetails = await executeQuery(RestroDetailsQuery);

      // Check if all queries were successful
      if (VendorCountResult && userResult && communicationResult && userAddressResult && vendorResult && socialLinksResult && restroDetails) {
        console.log('Transaction successful. Committing.');
        await client.query("COMMIT");
      } else {
        console.log('Transaction failed. Rolling back.');
        await client.query("ROLLBACK");
      }

      // Return success response
      return encrypt({
        success: true,
        message: 'Vendor and user data with social links inserted successfully',
        token: tokens,
        refUserCustId: newVendorId, // Return the generated vendorId as refUserCustId
        restroDetails: restroDetails,
        userId: userId
      }, false);

    } catch (error) {
      // Ensure rollback on error
      await client.query("ROLLBACK");
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred';
      }

      console.error('Error during data insertion:', error);
      return encrypt({
        success: false,
        message: 'Data insertion failed',
        error: errorMessage,
        token: tokens
      }, false);
    } finally {
      client.release();
    }
  }

  public async VendorprofilePageDataV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)

    try {
      console.log('Received userData', userData);

      const refUserId = userData.userData.refUserId;
      console.log('refUserId', refUserId)
      if (!refUserId) {
        console.log('refUserId', refUserId)
        throw new Error("Invalid refUserId. Cannot be null or undefined.");
      }

      console.log('Parsed refUserId:', refUserId);

      const params = [refUserId];
      console.log('params', params)
      const profileResult = await executeQuery(fetchProfileData, params);
      console.log('profileResult', profileResult)

      if (profileResult.length === 0) {
        throw new Error("No profile data found for the given refUserId.");
      }

      const profileData = {
        vendorName: profileResult[0].vendorName,
        vendordesgination: profileResult[0].vendordesgination,
        fname: profileResult[0].refUserFname,
        lname: profileResult[0].refUserLname,
        refRoleId: 3,
        email: profileResult[0].refEmail,
        phone: profileResult[0].refMobileno,
        address: profileResult[0].refAddress,
        socialLinks: {
          websiteUrl: profileResult[0].websiteUrl,
          facebookUrl: profileResult[0].facebookUrl,
          instagramUrl: profileResult[0].instagramUrl,
          twitterUrl: profileResult[0].twitterUrl
        }
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
      console.error('Error in VendorprofilePageDataV1:', errorMessage);
      return encrypt({
        success: false,
        message: `Error in Vendor Profile Page Data retrieval: ${errorMessage}`,
        token: tokens
      }, false);
    }
  }

  public async UpdateBasicDetailV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const refUserId = userData.userData.refUserId;
    console.log("line ------------------------------ 228 \n\n", userData.userData.refUserId)
    const token = { id: tokendata.id }
    console.log('token', token)
    const tokens = generateTokenWithExpire(token, true)
    console.log('tokens', tokens)
    try {
      await client.query("BEGIN");

      const updateSections = userData.userData.user_data;
      console.log('updateSections line -----  237', updateSections)

      for (const section in updateSections) {

        console.log('line ------- 241',)
        if (updateSections.hasOwnProperty(section)) {

          console.log(' line --------- 244',)
          let tableName: string;
          let updatedData: any = {};
          let oldData: any = {};

          console.log('section line ------ 249', section)
          switch (section) {
            case "refVendorName":
              console.log('vendorName',)
              tableName = "vendorTable";
              console.log('tableName', tableName);
              updatedData = { [section]: updateSections[section].newData };
              oldData = { [section]: updateSections[section].oldData };
              break;

            case "refVendorDesignation":
              console.log('vendordesgination',)
              tableName = "VendorTable";
              updatedData = { [section]: updateSections[section].newData };
              oldData = { [section]: updateSections[section].oldData };
              break;

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

            case "socialLinks":
              console.log('socialLinks',)
              tableName = "vendorSocialLinks";
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

          const changes = getChanges(updatedData, oldData);
          // for (const key in changes) {
          //   if (changes.hasOwnProperty(key)) {
          //     const tempChange = {
          //       data: changes[key],
          //     };

          //     const parasHistory = [
          //       transTypeId,
          //       tempChange,
          //       refUserId,
          //       CurrentTime(),
          //     ];
          //     const historyResult = await client.query(
          //       updateHistoryQuery,
          //       parasHistory
          //     );
          //     if (!historyResult.rowCount) {
          //       throw new Error("Failed to update the history.");
          //     }
          //   }
          // }
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
      }, false);
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
      }, false);
    } finally {
      client.release();
    }
  }

  public async VendorBankDetailsV1(
    bankDetails: { bankName: string, accountNumber: string, ibanCode: string, paymentId: number, userId: string, moneyTransferDetails: string }, tokendata: any
  ): Promise<any> {
    const { bankName, accountNumber, ibanCode, paymentId, userId, moneyTransferDetails } = bankDetails;
    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)

    try {
      console.log('Fetching payment type name for paymentId:', paymentId);
      const paymentTypeResult = await executeQuery(getPaymentTypeNameQuery, [paymentId]);
      console.log('Payment Type Result:', paymentTypeResult);

      if (!paymentTypeResult || paymentTypeResult.length === 0) {
        throw new Error('Invalid payment ID or payment type query failed');
      }
      const paymentTypeName = paymentTypeResult[0].paymentTypeName;
      console.log('Payment Type Name:', paymentTypeName);

      const vendorBankDetailsParams = [
        bankName,
        accountNumber,
        ibanCode,
        paymentId,
        userId,
        moneyTransferDetails
      ];
      console.log('Inserting vendor bank details with params:', vendorBankDetailsParams);

      const result = await executeQuery(insertVendorBankDetailsQuery, vendorBankDetailsParams);
      console.log('Insert Result:', result);

      if (!result || result.length === 0) {
        throw new Error('Insert vendor bank details query failed');
      }

      // Insert transaction history
      const txnHistoryParams = [
        4, // TransTypeID
        userId, // refUserId
        "Bank details Updated", // transData
        CurrentTime(),  // TransTime
        "vendor" // UpdatedBy
      ];

      await executeQuery(updateHistoryQuery, txnHistoryParams);

      // return { vendorBankDetailsId: result[0].vendorBankDetailsId };

      return encrypt({
        success: true,
        message: "bank details added successfully",
        token: tokens,
        vendorBankDetailsId: result[0].vendorBankDetailsId
      }, false
      );

    } catch (error) {
      console.error('Error occurred:', error);
      return encrypt({
        success: false,
        message: "error in adding the Bank details",
        token: tokens,
      }, false
      );
    }
  }

  public async RestaurentDocUplaodV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)
    try {
      const pdfs = userData.PDF;

      // Ensure that 5 PDFs are provided
      if (!pdfs || pdfs.length !== 5) {
        throw new Error('Please provide exactly 5 PDFs.');
      }

      let filePaths: { pdfs: string[] } = { pdfs: [] };
      let storedFiles: any[] = [];

      // Store PDFs
      for (let i = 0; i < pdfs.length; i++) {
        console.log(`Storing PDF ${i + 1}...`);
        const pdfPath = await storeFile(pdfs[i], 4); // Type 4 for PDFs
        console.log('pdfPath line -------------------------------- 466', pdfPath)
        filePaths.pdfs.push(pdfPath);

        // Read the PDF file buffer and convert it to Base64
        const pdfBuffer = await viewFile(pdfPath);
        const pdfBase64 = pdfBuffer.toString("base64");

        storedFiles.push({
          filename: path.basename(pdfPath),
          content: pdfBase64,
          contentType: 'application/pdf',
        });
      }

      // Return success response with file paths and stored files
      return encrypt(
        {
          success: true,
          message: "PDFs Stored Successfully",
          token: tokens,
          filePaths: filePaths,
          files: storedFiles,

        },
        true
      );
    } catch (error) {
      console.error('Error occurred:', error);
      return encrypt(
        {
          success: false,
          message: "Error In Storing the PDFs",
          token: tokens
        },
        true
      );
    }
  }

  public async RestaurentDocUpdateV1(userData: any, tokendata: any): Promise<any> {

    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)
    try {
      const {
        VATcertificate,
        CommercialRegisterExtract,
        AlcoholLicense,
        FoodSafetyHygieneCertificate,
        LiabilityInsurance,
        refUserId // Add refUserId to userData
        //documentId
      } = userData;

      // Ensure documentId is provided
      // if (!documentId) {
      //   return encrypt(
      //     {
      //       success: false,
      //       message: "documentId is required to update the record",
      //     },
      //     false
      //   );
      // }

      // Fetch the latest refUserCustId
      // const refUserCustIdResult = await executeQuery(`
      //   SELECT COUNT(*) AS count
      //   FROM public."VendorBankDetails";
      // `);
      // const refUserCustId = `VD${(parseInt(refUserCustIdResult[0].count, 10) + 1).toString().padStart(3, '0')}`;


      const result = await executeQuery(RestaurentDocStoreQuery, [

        VATcertificate,
        CommercialRegisterExtract,
        AlcoholLicense,
        FoodSafetyHygieneCertificate,
        LiabilityInsurance,
        //crefUserCustId
        //documentId
      ]);
      const updatedRow = result[0]; // Access the first element of the result array
      const TransTypeID = 6;
      const transData = "Restaurent Documents Updated";
      const TransTime = CurrentTime(); // Current time in ISO format
      const updatedBy = "Vendor";
      const transactionValues = [TransTypeID, refUserId, transData, TransTime, updatedBy];

      await executeQuery(updateHistoryQuery, transactionValues);

      return encrypt(
        {
          success: true,
          message: "Restaurent Documents Store Successfully",
          token: tokens,
          data: updatedRow,
        },
        false
      );
    } catch (error) {
      console.error('Error updating data:', (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Updating the Documents: ${(error as Error).message}`,
          token: tokens
        },
        false
      );
    }
  }

  public async deleteRestaurentDocV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)
    try {
      let filePath: string | any;

      if (userData.documentId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getDocumentQuery, [userData.documentId]);
        if (imageRecord.length === 0) {
          return encrypt(
            {
              success: false,
              message: "Image record not found",
            },
            true
          );
        }
        filePath = imageRecord[0].refImagePath;

        // Delete the image record from the database
        await executeQuery(deleteDocumentQuery, [userData.documentId]);
      } else {
        filePath = userData.filePath;
      }

      if (filePath) {
        // Delete the file from local storage
        await deleteFile(filePath);
      }
      const TransTypeID = 7;
      const transData = "Restaurent Documents Deleted";
      const TransTime = CurrentTime(); // Current time in ISO format
      const updatedBy = "Vendor";
      const transactionValues = [TransTypeID, userData.refUserId, transData, TransTime, updatedBy];

      await executeQuery(updateHistoryQuery, transactionValues);

      return encrypt(
        {
          success: true,
          message: "Restaurent Documents Deleted Successfully",
          token: tokens
        },
        true
      );
    } catch (error) {
      console.error('Error in deleting file:', (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Deleting the Restaurent Documents: ${(error as Error).message}`,
          token: tokens
        },
        true
      );
    }
  }

  public async LogoUploadV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)
    try {
      // Extract the image from userData
      const image = userData.Image;

      // Ensure that only one image is provided
      if (!image) {
        throw new Error('Please provide an image.');
      }

      let filePath: string = '';
      let storedFiles: any[] = [];

      // Store the image
      console.log('Storing image...');
      filePath = await storeFile(image, 3);

      // Read the file buffer and convert it to Base64
      const imageBuffer = await viewFile(filePath);
      const imageBase64 = imageBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(filePath),
        content: imageBase64,
        contentType: 'image/jpeg',  // Assuming the image is in JPEG format
      });

      // Return success response
      return encrypt(
        {
          success: true,
          message: "Image Stored Successfully",
          token: tokens,
          filePath: filePath,
          files: storedFiles,
        },
        true
      );
    } catch (error) {
      console.error('Error occurred:', error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the Image",
          token: tokens,
        },
        true
      );
    }
  }

  public async LogoUpdateV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)
    try {
      const {
        logoImage,
        refUserId // Add refUserId to userData
      } = userData;

      const result = await executeQuery(ImageStoreQuery, [
        logoImage
      ]);

      const updatedRow = result[0]; // Access the first element of the result array
      const TransTypeID = 8;
      const transData = "Restaurant Logo Updated";
      const TransTime = CurrentTime(); // Current time in ISO format
      const updatedBy = "Vendor";
      const transactionValues = [TransTypeID, refUserId, transData, TransTime, updatedBy];

      await executeQuery(updateHistoryQuery, transactionValues);

      return encrypt(
        {
          success: true,
          message: "Restaurant Logo Stored Successfully",
          token: tokens,
          data: updatedRow,
        },
        true
      );
    } catch (error) {
      console.error('Error updating data:', (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Updating the Logo: ${(error as Error).message}`,
          token: tokens
        },
        true
      );
    }
  }

  public async deleteLogoV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)
    try {
      let filePath: string | any;

      if (userData.documentId) {

        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getDocumentQuery, [userData.documentId]);
        if (imageRecord.length === 0) {
          return encrypt(
            {
              success: false,
              message: "Image record not found",
              token: tokens
            },
            false
          );
        }
        filePath = imageRecord[0].refImagePath;

        // Delete the image record from the database
        await executeQuery(deleteImageQuery, [userData.documentId]);
      } else {

        console.log('userData.filePath line --------------- 762 \n', userData.filePath)
        filePath = userData.filePath;
        console.log('filePath line ------------------------ 763', filePath)
      }

      if (filePath) {
        console.log('filePath line ------------------- 767', filePath)
        // Delete the file from local storage
        await deleteFile(filePath);
      }
      console.log('Attempting to delete file at:', filePath);

      const TransTypeID = 9;
      const transData = "Restaurent Documents Deleted";
      const TransTime = CurrentTime(); // Current time in ISO format
      const updatedBy = "Admin";
      const transactionValues = [TransTypeID, userData.refUserId, transData, TransTime, updatedBy];

      await executeQuery(updateHistoryQuery, transactionValues);

      return encrypt(
        {
          success: true,
          message: "Restaurent Documents Deleted Successfully",
          token: tokens
        },
        true
      );
    } catch (error) {
      console.error('Error in deleting file:', (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Deleting the Restaurent Documents: ${(error as Error).message}`,
          token: tokens
        },
        true
      );
    }
  }

  public async VendorAuditListV1(userData: { refUserId: string }, tokendata: any): Promise<any> {

    const token = { id: tokendata.id }
    console.log('token', token)
    const tokens = generateTokenWithExpire(token, true)
    console.log('tokens', tokens)
    try {
      const { refUserId } = userData;

      const getList = await executeQuery(getUpDateList, [refUserId]);
      for (let i = 0; i < getList.length; i++) {
        getList[i].refDate = formatDate(getList[i].refDate);
      }

      return encrypt(
        {
          success: true,
          message: "Audit list Data is sent successfully",
          data: getList,
          token: tokens
        },
        true
      );
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return encrypt(
        {
          success: false,
          message: "Error in Update Audit list Data sending",
          error: errorMessage,  // Updated to handle unknown type
          token: tokens
        },
        true
      );
    }
  }
}












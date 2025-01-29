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
  getVendorCountQuery, insertVendorQuery, insertUserQuery, insertCommunicationQuery, insertUserAddressQuery,
  insertVendorSocialLinksQuery,
  RestroDetailsQuery,
  updateHistoryQuery,
  getPaymentTypeNameQuery,
  insertVendorBankDetailsQuery,
  getVendorCount,
  RestaurentDocStoreQuery,  deleteDocumentQuery,
  ImageStoreQuery, deleteImageQuery,
  fetchProfileData, fetchRestroCertificates,
  getUpDateList,
  insertproductQuery,
  insertOfferQuery,
  getDocumentQuery, insertDocumentQuery,
  updateRestroQuery,
  updatevisibilityQuery,
  RestroOffersQuery, reArrangeQuery,RestroproductsQuery,
  paymentDetailsQuery,insertPaymentQuery,updatePaymentQuery, updatePayementVisibilityQuery
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
      const communicationResult = await client.query(insertCommunicationQuery, communicationParams);
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
      const userAddressResult = await client.query(insertUserAddressQuery, userAddressParams);
      console.log('userAddressResult', userAddressResult);

      // Insert Vendor
      const vendorParams = [
        userId,
        ui.user_data.vendorName,
        ui.user_data.vendordesgination
      ];
      const vendorResult = await client.query(insertVendorQuery, vendorParams);
      console.log('vendorResult', vendorResult);

      // if (!vendorResult || vendorResult.length === 0) {
      //   throw new Error('Failed to insert vendor');
      // }
      // const vendorId = vendorResult[0].refVendorId;

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
        socialLinksResult = await client.query(insertVendorSocialLinksQuery, socialLinksParams);
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
      await client.query(updateHistoryQuery, txnHistoryParams);

      // Get Restaurant Details
      const restroDetails = await client.query(RestroDetailsQuery);

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
      }, true);

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
      }, true);
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
      }, true);
    } catch (error) {
      const errorMessage = (error as Error).message; // Cast `error` to `Error` type
      console.error('Error in VendorprofilePageDataV1:', errorMessage);
      return encrypt({
        success: false,
        message: `Error in Vendor Profile Page Data retrieval: ${errorMessage}`,
        token: tokens
      }, true);
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
  public async VendorBankDetailsV1(
    bankDetails: { bankName: string, accountNumber: string, ibanCode: string, paymentId: number, userId: string, moneyTransferDetails: string }, tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const { bankName, accountNumber, ibanCode, paymentId, userId, moneyTransferDetails } = bankDetails;
    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)

    try {
      await client.query("BEGIN");
      console.log('Fetching payment type name for paymentId:', paymentId);
      const paymentTypeResult = await executeQuery(getPaymentTypeNameQuery, [paymentId]);
      console.log('Payment Type Result:', paymentTypeResult);

      // if (!paymentTypeResult || paymentTypeResult.length === 0) {
      //   throw new Error('Invalid payment ID or payment type query failed');
      // }
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

      const result = await client.query(insertVendorBankDetailsQuery, vendorBankDetailsParams);
      console.log('Insert Result:', result);

      // if (!result || result.length === 0) {
      //   throw new Error('Insert vendor bank details query failed');
      // }

      // Insert transaction history
      const txnHistoryParams = [
        4, // TransTypeID
        userId, // refUserId
        "Bank details Updated", // transData
        CurrentTime(),  // TransTime
        "vendor" // UpdatedBy
      ];

      await client.query(updateHistoryQuery, txnHistoryParams);
      await client.query("COMMIT");
      // return { vendorBankDetailsId: result[0].vendorBankDetailsId };

      return encrypt({
        success: true,
        message: "bank details added successfully",
        token: tokens,
        // vendorBankDetailsId: result[0].vendorBankDetailsId
      }, true
      );

    } catch (error) {
      await client.query("ROLLBACK");
      console.error('Error occurred:', error);
      return encrypt({
        success: false,
        message: "error in adding the Bank details",
        token: tokens,
      }, true
      );
    } finally {
      client.release();
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
    const client: PoolClient = await getClient();

    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)
    try {
      await client.query('BEGIN');

      const {
        VATcertificate,
        CommercialRegisterExtract,
        AlcoholLicense,
        FoodSafetyHygieneCertificate,
        LiabilityInsurance,
        refUserId // Add refUserId to userData
        //documentId
      } = userData;


      const result = await client.query(RestaurentDocStoreQuery, [
        VATcertificate,
        CommercialRegisterExtract,
        AlcoholLicense,
        FoodSafetyHygieneCertificate,
        LiabilityInsurance,
        //crefUserCustId
        //documentId
      ]);
      const updatedRow = result; // Access the first element of the result array
      const TransTypeID = 6;
      const transData = "Restaurent Documents Updated";
      const TransTime = CurrentTime(); // Current time in ISO format
      const updatedBy = "Vendor";
      const transactionValues = [TransTypeID, refUserId, transData, TransTime, updatedBy];

      await client.query(updateHistoryQuery, transactionValues);
      await client.query('COMMIT'); // Commit the transaction
      return encrypt(
        {
          success: true,
          message: "Restaurent Documents Store Successfully",
          token: tokens,
          data: updatedRow,
        },
        true
      );
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback the transaction in case of any error
      console.error('Error updating data:', (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Updating the Documents: ${(error as Error).message}`,
          token: tokens
        },
        true
      );
    } finally {
      client.release(); // Release the client back to the pool
    }

  }
  public async deleteRestaurentDocV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
  
    try {
      if (!userData.documentId && !userData.filePath) {
        return encrypt(
          {
            success: false,
            message: "No documentId or filePath provided in the payload",
          },
          true
        );
      }
      let filePath: string | null = null;
      await client.query("BEGIN");
      if (userData.documentId) {
        // Fetch document record from the database
        const documentRecord = await client.query(getDocumentQuery, [userData.documentId]);
        if (!documentRecord.rows || documentRecord.rows.length === 0) {
          await client.query("ROLLBACK");
          return encrypt(
            {
              success: false,
              message: "Document record not found",
            },
            true
          );
        }
  
        // Extract file path if available
        filePath = documentRecord.rows[0]?.logoImage || null;
  
        // Clear document fields in the database
        await client.query(deleteDocumentQuery, [userData.documentId]);
      } else if (userData.filePath) {
        // Case for filePath provided
        filePath = userData.filePath;
      }
  
      // Delete file from the file system if a path exists
      if (filePath) {
        await deleteFile(filePath);
      }
  
      await client.query("COMMIT");
      return encrypt(
        {
          success: true,
          message: "Document or file deleted successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.error("Error in deleting document or file:", (error as Error).message);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: `Error in deleting document or file: ${(error as Error).message}`,
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
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
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id }
    const tokens = generateTokenWithExpire(token, true)
    try {
      await client.query("BEGIN");
      const {
        logoImage,
        documentId,
      } = userData;
      const result = await executeQuery(ImageStoreQuery, [logoImage, documentId]);
      const updatedRow = result[0]; // Access the first element of the result array
      const TransTypeID = 8;
      const transData = "Restaurant Logo Updated";
      const TransTime = CurrentTime(); // Current time in ISO format
      const updatedBy = "Vendor";
      const transactionValues = [TransTypeID, tokendata.id, transData, TransTime, updatedBy];

      await executeQuery(updateHistoryQuery, transactionValues);
      await client.query("COMMIT");
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
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: `Error In Updating the Logo: ${(error as Error).message}`,
          token: tokens
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteLogoV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      if (!userData.documentId && !userData.filePath) {
        return encrypt(
          {
            success: false,
            message: "No documentId or filePath provided in the payload",
          },
          true
        );
      }
      let filePath: string | null = null;
      await client.query("BEGIN");
      if (userData.documentId) {
        // Fetch document record from the database
        const documentRecord = await client.query(getDocumentQuery, [userData.documentId]);
        if (!documentRecord.rows || documentRecord.rows.length === 0) {
          await client.query("ROLLBACK");
          return encrypt(
            {
              success: false,
              message: "Document record not found",
            },
            true
          );
        }
        // Extract file path if available
        filePath = documentRecord.rows[0]?.logoImage || null;
        // Clear document fields in the database
        await client.query(deleteImageQuery, [userData.documentId]);
      } else if (userData.filePath) {
        // Case for filePath provided
        filePath = userData.filePath;
      }
      // Delete file from the file system if a path exists
      if (filePath) {
        await deleteFile(filePath);
      }
      const TransTypeID = 9;
      const transData = "Restaurent Documents Deleted";
      const TransTime = CurrentTime(); // Current time in ISO format
      const updatedBy = "Admin";
      const transactionValues = [TransTypeID, tokendata.id, transData, TransTime, updatedBy];

      await executeQuery(updateHistoryQuery, transactionValues);
      await client.query("COMMIT");
      return encrypt(
        {
          success: true,
          message: "Document or file deleted successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.error("Error in deleting document or file:", (error as Error).message);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: `Error in deleting document or file: ${(error as Error).message}`,
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async addProductV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    console.log('token', token);
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      await client.query('BEGIN');

      const {
        refVendorId,  // Extract refVendorId from userData
        productName,
        productPrice,
        category,
        description,
        rating,
        offerAppliedStatus,
        offer,
        range,
      } = userData;

      // Apply logic based on offerAppliedStatus
      const finalOffer = offerAppliedStatus ? offer : '-';

      // 1. Get the current number of products for this refVendorId (not max refArrange)
      const currentProductCountResult = await client.query(reArrangeQuery, [refVendorId] );

      let newRefArrange = 1;  // Default to 1 if no products exist for this vendor.
      if (currentProductCountResult.rows.length > 0) {
        newRefArrange = currentProductCountResult.rows.length + 1;  // Increment product count to get next refArrange
      }

      // 2. Prepare the insert parameters including the calculated refArrange
      const params = [
        refVendorId,
        productName,
        productPrice,
        category,
        description,
        rating,
        offerAppliedStatus,
        finalOffer, // Use the computed offer value
        range,
        newRefArrange,  // Insert the updated refArrange value
      ];
      console.log('Insert Product Params:', params);

      const userResult = await client.query(insertproductQuery, params);
      const newUser = userResult.rows[0];
      console.log('newUser', newUser);

      if (newUser) {
        const history = [
          17,  // Transaction Type ID for adding product
          token.id,  // Use refUserId from userData
          "Rearrange products",
          CurrentTime(),
          'vendor',
        ];

        console.log('history', history);
        const updateHistory = await client.query(updateHistoryQuery, history);

        if (updateHistory.rowCount === 0) {
          await client.query('ROLLBACK');  // Rollback if history update fails
          return encrypt(
            {
              success: false,
              message: 'Failed to update history',
              token: tokens,
            },
            false
          );
        }

        await client.query('COMMIT');  // Commit the transaction
        return encrypt(
          {
            success: true,
            message: 'Product added successfully',
            token: tokens,
          },
          true
        );
      } else {
        await client.query('ROLLBACK');  // Rollback if any insert fails
        return encrypt(
          {
            success: false,
            message: 'Product insertion failed',
            token: tokens,
          },
          false
        );
      }
    } catch (error: unknown) {
      await client.query('ROLLBACK');  // Rollback the transaction in case of any error
      console.error('Error during product addition:', error);

      if (error instanceof Error) {
        return encrypt(
          {
            success: false,
            message: 'An unexpected error occurred during product addition',
            error: error.message,
          },
          true
        );
      } else {
        return encrypt(
          {
            success: false,
            message: 'An unknown error occurred during product addition',
            token: tokens,
            error: String(error),
          },
          false
        );
      }
    } finally {
      client.release();  // Release the client back to the pool
    }
  }
  public async ViewaddedProductV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    console.log('token', token);

    // Generate token with expiration
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      // Get Restaurant/Document Details
      const Restroproducts = await executeQuery(RestroproductsQuery);
      console.log('Restroproducts', Restroproducts);

      // Return success response
      return encrypt(
        {
          success: true,
          message: 'return products successfully',
          token: tokens,
          Restroproducts: Restroproducts,
        },
        true
      );
    } catch (error) {
      // Error handling
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error during data retrieval:', error);

      // Return error response
      return encrypt(
        {
          success: false,
          message: 'Data retrieval failed',
          error: errorMessage,
          token: tokens,
        },
        true
      );
    }
  }
  public async offersAppliedV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    console.log('token', token);
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      // Start the transaction
      await client.query("BEGIN");

      // Extract user data from the input
      const {
        refOfferName,
        refOfferDescription,
        refOfferMinValue,
        refOfferType,
        refStartDate,
        refEndDate,
        refCoupon
      } = userData;

      // Prepare parameters for the offer insertion
      const offerParams = [
        refOfferName,
        refOfferDescription,
        refOfferMinValue,
        refOfferType,
        refStartDate,
        refEndDate,
        refCoupon
      ];
      console.log('Insert Offer Params:', offerParams);

      // Execute the query to insert the offer into the database
      const offerResult = await client.query(insertOfferQuery, offerParams);
      console.log('Offer Insert Result:', offerResult);

      // Check if the offer insertion was successful
      if (offerResult.rowCount === 0) {
        throw new Error('Failed to insert the offer');
      }

      const newOffer = offerResult.rows[0];
      console.log('New Offer:', newOffer);

      // Prepare transaction history parameters
      const txnHistoryParams = [
        19, // Transaction Type ID (assuming this corresponds to a predefined action like "Offer Created")
        tokendata.id, // refUserId from token data
        "Offer added to the system", // Description of the action
        CurrentTime(), // Transaction timestamp
        "vendor" // Role of the user who performed the action
      ];
      console.log('Transaction History Params:', txnHistoryParams);

      // Insert transaction history record
      const txnHistoryResult = await client.query(updateHistoryQuery, txnHistoryParams);

      if (txnHistoryResult.rowCount === 0) {
        throw new Error('Failed to insert transaction history');
      }

      // Commit the transaction if everything was successful
      await client.query("COMMIT");
      console.log('Transaction successful. Offer and history inserted.');

      // Return success response
      return encrypt({
        success: true,
        message: 'Offer applied and transaction history recorded successfully',
        token: tokens,
      }, true);

    } catch (error: unknown) {
      // Ensure rollback if an error occurs
      await client.query("ROLLBACK");
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Error during offer application:', error);
      return encrypt({
        success: false,
        message: 'Offer application failed',
        error: errorMessage,
        token: tokens
      }, true);

    } finally {
      // Release the client back to the pool
      client.release();
    }
  }
  public async getOffersV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    console.log('token', token);

    // Generate token with expiration
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      // Get Restaurant/Document Details
      const restroOffers = await executeQuery(RestroOffersQuery);
      console.log('restrooffers', restroOffers);

      // Return success response
      return encrypt(
        {
          success: true,
          message: 'return offers successfully',
          token: tokens,
          restroOffers: restroOffers,
        },
        true
      );
    } catch (error) {
      // Error handling
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error during data retrieval:', error);

      // Return error response
      return encrypt(
        {
          success: false,
          message: 'Data retrieval failed',
          error: errorMessage,
          token: tokens,
        },
        true
      );
    }
  }
  public async getDocumentsV1(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient(); // Get database client
    const token = { id: tokendata.id }; // Extract token ID
    console.log('token', token);

    // Generate token with expiration
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      // Get Restaurant/Document Details
      const restroDetails = await executeQuery(RestroDetailsQuery);
      console.log('restroDetails', restroDetails);

      // Return success response
      return encrypt(
        {
          success: true,
          message: 'return restaurent docs successfully',
          token: tokens,
          restroDetails: restroDetails,
        },
        true
      );
    } catch (error) {
      // Error handling
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error during data retrieval:', error);

      // Return error response
      return encrypt(
        {
          success: false,
          message: 'Data retrieval failed',
          error: errorMessage,
          token: tokens,
        },
        true
      );
    }
  }
  public async addDocumentsV1(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient(); // Get database client
    const token = { id: tokendata.id }; // Extract token ID
    console.log('token', token);

    // Generate token with expiration
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      // Extract the document name from user_data
      const { restroDocs } = user_data;

      // Validate the input
      if (!restroDocs || typeof restroDocs !== "string") {
        return encrypt(
          {
            success: false,
            message: "'restroDocs' must be a non-empty string.",
            token: tokens,
          },
          false
        );
      }
      // Insert document into the database with conflict handling
      const result = await executeQuery(insertDocumentQuery, [restroDocs]);
      // const insertedData = result.rows[0];

      const txnHistoryParams = [
        14, // TransTypeID
        tokendata.id, // refUserId
        "add Documents", // transData
        CurrentTime(),  // TransTime
        "vendor" // UpdatedBy
      ];
      const txnHistoryResult = await client.query(updateHistoryQuery, txnHistoryParams);

      // Return success response
      return encrypt(
        {
          success: true,
          message: 'Restaurant document inserted or updated successfully.',
          token: tokens,
          //data: insertedData, // Return the inserted document data
        },
        true
      );
    } catch (error) {
      // Error handling
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error during document insertion:', error);

      // Return error response
      return encrypt(
        {
          success: false,
          message: 'Document insertion failed',
          error: errorMessage,
          token: tokens,
        },
        true
      );
    }
  }
  public async UpdateDocumentsV1(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient(); // Get database client
    const token = { id: tokendata.id }; // Extract token ID
    console.log('token', token);

    // Generate token with expiration
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      // Get Restaurant/Document Details
      const {
        refCertificateType,
        restroDocTypeId
      } = user_data;

      // Prepare parameters for the offer insertion
      const documentParams = [
        refCertificateType,
        restroDocTypeId
      ];

      const restroDetails = await executeQuery(updateRestroQuery, documentParams);
      const txnHistoryParams = [
        15, // TransTypeID
        tokendata.id, // refUserId
        "edit Documents", // transData
        CurrentTime(),  // TransTime
        "vendor" // UpdatedBy
      ];
      const txnHistoryResult = await client.query(updateHistoryQuery, txnHistoryParams);

      // Return success response
      return encrypt(
        {
          success: true,
          message: 'update restaurent docs successfully',
          token: tokens,
          restroDetails: restroDetails,
        },
        true
      );
    } catch (error) {
      // Error handling
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error during data retrieval:', error);

      // Return error response
      return encrypt(
        {
          success: false,
          message: 'Data retrieval failed',
          error: errorMessage,
          token: tokens,
        },
        true
      );
    }
  }
  public async visibilityV1(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient(); // Get database client
    const token = { id: tokendata.id }; // Extract token ID
    console.log('token', token);

    // Generate token with expiration
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      await client.query("BEGIN");

      // Get Restaurant/Document Details
      const {
        visibility,
        restroDocTypeId
      } = user_data;

      // Prepare parameters for the offer insertion
      const documentParams = [
        visibility,
        restroDocTypeId
      ];

      const restroDetails = await client.query(updatevisibilityQuery, documentParams);
      const txnHistoryParams = [
        16, // TransTypeID
        tokendata.id, // refUserId
        "add visibility", // transData
        CurrentTime(),  // TransTime
        "vendor" // UpdatedBy
      ];
      const txnHistoryResult = await client.query(updateHistoryQuery, txnHistoryParams);

      // Return success response
      await client.query("COMMIT");

      return encrypt(
        {
          
          success: true,
          message: 'update restaurent docs successfully',
          token: tokens,
          restroDetails: restroDetails,
        },
        true
      );
    } catch (error) {
      await client.query("ROLLBACK");

      // Error handling
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error during data retrieval:', error);
      await client.query("ROLLBACK");

      // Return error response
      return encrypt(
        {
          success: false,
          message: 'Data retrieval failed',
          error: errorMessage,
          token: tokens,
        },
        true
      );
    }finally {
      client.release();
    }

  }
  public async getPayementV1(user_data: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id }; // Extract token ID
    console.log('token', token);

    // Generate token with expiration
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      // Get Restaurant/Document Details
      const restroDetails = await executeQuery(paymentDetailsQuery);
      console.log('restroDetails', restroDetails);

      // Return success response
      return encrypt(
        {
          success: true,
          message: 'return restaurent docs successfully',
          token: tokens,
          restroDetails: restroDetails,
        },
        true
      );
    } catch (error) {
      // Error handling
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error during data retrieval:', error);

      // Return error response
      return encrypt(
        {
          success: false,
          message: 'Data retrieval failed',
          error: errorMessage,
          token: tokens,
        },
        true
      );
    }
  }
  public async addPaymentV1(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient(); // Get database client
    const token = { id: tokendata.id }; // Extract token ID

    // Generate token with expiration
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the document name from user_data
      const { paymentType } = user_data;

      // Validate the input
      if (!paymentType || typeof paymentType !== "string") {
        return encrypt(
          {
            success: false,
            message: "'restroDocs' must be a non-empty string.",
            token: tokens,
          },
          false
        );
      }
      // Insert document into the database with conflict handling
      const result = await executeQuery(insertPaymentQuery, [paymentType]);
      // const insertedData = result.rows[0];

      const txnHistoryParams = [
        4, // TransTypeID
        tokendata.id, // refUserId
        "add Documents", // transData
        CurrentTime(),  // TransTime
        "vendor" // UpdatedBy
      ];
      const txnHistoryResult = await client.query(updateHistoryQuery, txnHistoryParams);

      // Return success response
      return encrypt(
        {
          success: true,
          message: 'Restaurant document inserted or updated successfully.',
          token: tokens,
          //data: insertedData, // Return the inserted document data
        },
        true
      );
    } catch (error) {
      // Error handling
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error during document insertion:', error);

      // Return error response
      return encrypt(
        {
          success: false,
          message: 'Document insertion failed',
          error: errorMessage,
          token: tokens,
        },
        true
      );
    }
  }
  public async UpdatePaymentV1(userData: any, tokenData: any): Promise<any> {
    const client: PoolClient = await getClient(); // Get database client
    const token = { id: tokenData.id }; // Extract token ID
    console.log('token', token);
  
    // Generate token with expiration
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);
  
    try {
      await client.query("BEGIN");
  
      // Destructure payment data from userData
      const { paymentTypeName, paymentId } = userData;
  
      // Validate input fields
      // if (!paymentTypeName || !paymentId) {
      //   throw new Error("Both paymentTypeName and paymentId are required.");
      // }
  
      // Prepare parameters for the payment update query
      const documentParams = [paymentTypeName, paymentId];
  
      // Update payment information in the database
      const paymentDetails = await client.query(updatePaymentQuery, documentParams);
  
      // Prepare transaction history details
      const txnHistoryParams = [
        19, // TransTypeID
        tokenData.id, // refUserId
        "edit payment", // transData
        CurrentTime(), // TransTime
        "vendor" // UpdatedBy
      ];
  
      // Insert transaction history
      const txnHistoryResult = await client.query(updateHistoryQuery, txnHistoryParams);
  
      // Commit the transaction
      await client.query("COMMIT");
  
      // Return success response
      return encrypt(
        {
          success: true,
          message: "Payment updated successfully",
          token: tokens,
          paymentDetails: paymentDetails,
        },
        false
      );
  
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query("ROLLBACK");
  
      // Error handling
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error during payment update:", error);
  
      // Return error response
      return encrypt(
        {
          success: false,
          message: "Payment update failed",
          error: errorMessage,
          token: tokens,
        },
        false
      );
    } finally {
      client.release();
    }
  }
  public async paymentVisibilityV1(user_data: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient(); 
    const token = { id: tokendata.id }; 
    console.log('token', token);
      
    const tokens = generateTokenWithExpire(token, true);
    console.log('tokens', tokens);

    try {
      await client.query("BEGIN");

      const {
        visibility,
        paymentId
      } = user_data;
      console.log('user_data', user_data)

      const paymentParams = [
        visibility,
        paymentId
      ];

      const paymentDetails = await client.query(updatePayementVisibilityQuery, paymentParams);
      console.log('paymentDetails', paymentDetails)
      const txnHistoryParams = [
        5, // TransTypeID
        tokendata.id, // refUserId
        "add payment visibility", // transData
        CurrentTime(),  // TransTime
        "vendor" // UpdatedBy
      ];
      const txnHistoryResult = await client.query(updateHistoryQuery, txnHistoryParams);
      await client.query("COMMIT");

      // Return success response
      return encrypt(
        {
          success: true,
          message: 'update restaurent docs successfully',
          token: tokens,
          paymentType : paymentDetails,
        },
        true
      );
    } catch (error) {
      // Error handling
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error during data retrieval:', error);
      await client.query("ROLLBACK");
      // Return error response
      return encrypt(
        {
          success: false,
          message: 'Data retrieval failed',
          error: errorMessage,
          token: tokens,
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
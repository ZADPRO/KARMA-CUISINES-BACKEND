import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";
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
  fetchRestroCertificates
} from './query';
import { CurrentTime } from "../../helper/common";


export class VendorRepository {

  public async VendorProfileV1(user_data: any, socialLinks: any): Promise<any> {
    try {

      const ui = user_data.user_data;
      const VendorCountResult = await executeQuery(getVendorCountQuery);
      console.log('VendorCountResult', VendorCountResult);

      const VendorCount = parseInt(VendorCountResult[0].count, 10); // Extract and convert count to a number
      const newVendorId = `VD${(VendorCount + 1).toString().padStart(3, '0')}`;
      console.log('Generated VendorId:', newVendorId);

      const vendorParams = [newVendorId, ui.vendorName, ui.vendordesgination];
      const vendorResult = await executeQuery(insertVendorQuery, vendorParams);
      console.log('vendorResult', vendorResult);

      if (!vendorResult || vendorResult.length === 0) {
        throw new Error('Failed to insert vendor');
      }
      const vendorId = vendorResult[0].refvendorId;

      console.log("Userdata", ui.user);

      const userParams = [ui.user.refUserFname, ui.user.refUserLname, newVendorId, ui.user.refRoleId];
      console.log('userParams', userParams);

      const userResult = await executeQuery(insertUserQuery, userParams);
      console.log('userResult', userResult);

      if (!userResult || userResult.length === 0) {
        throw new Error('Failed to insert user');
      }
      const userId = userResult[0].refUserId;

      const communicationParams = [userId, ui.communication.refMobileno, ui.communication.refEmail];
      const communicationResult = await executeQuery(insertCommunicationQuery, communicationParams);
      console.log('communicationResult', communicationResult);

      const userAddressParams = [ui.address.refAddress, newVendorId];
      const userAddressResult = await executeQuery(insertUserAddressQuery, userAddressParams);
      console.log('userAddressResult', userAddressResult);

      const socialLinksParams = [
        newVendorId,
        ui.socialLinks.websiteUrl,
        ui.socialLinks.facebookUrl,
        ui.socialLinks.instagramUrl,
        ui.socialLinks.twitterUrl
      ];
      const socialLinksResult = await executeQuery(insertVendorSocialLinksQuery, socialLinksParams);
      console.log('socialLinksResult', socialLinksResult);

      const txnHistoryParams = [
        22, // TransTypeID
        userId, // refUserId
        "vendor profile entry", // transData
        new Date(), // TransTime
        "vendor" // UpdatedBy
      ];
      await executeQuery(updateHistoryQuery, txnHistoryParams);

      const restroDetails = await executeQuery(RestroDetailsQuery)

      // const restroDetails = await 
      // Return the Success Response with VendorId (refUserCustId) and UserId
      return {
        success: true,
        message: 'Vendor and user data with social links inserted successfully',
        refUserCustId: newVendorId, // Return the generated vendorId as refUserCustId
        restroDetails: restroDetails,
        userId: userId
      };

    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred';
      }

      console.error('Error during data insertion:', error);
      return {
        success: false,
        message: 'Data insertion failed',
        error: errorMessage
      };
    }
  }

  public async VendorprofilePageDataV1(userData: any): Promise<any> {
    try {
      console.log('Received userData:', userData);

      const refUserCustId = userData.refUserCustId;

      if (!refUserCustId) {
        throw new Error("Invalid refUserCustId. Cannot be null or undefined.");
      }

      console.log('Parsed refUserCustId:', refUserCustId);

      const params = [refUserCustId];
      console.log('params', params)
      const profileResult = await executeQuery(fetchProfileData, params);
      console.log('profileResult', profileResult)

      if (profileResult.length === 0) {
        throw new Error("No profile data found for the given refUserCustId.");
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
          wbsiteUrl: profileResult[0].wbsiteUrl,
          facebookUrl: profileResult[0].facebookUrl,
          instagramUrl: profileResult[0].instagramUrl,
          twitterUrl: profileResult[0].twitterUrl
        }
      };


      const Result = await executeQuery(fetchRestroCertificates, []);
      const restroDetails = Result.map((row: any) => ({
        CertificateType: row.CertificateType,
      }));

      const registerData = {
        ProfileData: profileData,
        restroDetails, // Use the mapped `restroDetails` here
      };

      console.log('Constructed registerData:', registerData);

      return {
        success: true,
        message: "Vendor Profile Page Data retrieved successfully",
        data: registerData,
      };
    } catch (error) {
      const errorMessage = (error as Error).message; // Cast `error` to `Error` type
      console.error('Error in VendorprofilePageDataV1:', errorMessage);
      return {
        success: false,
        message: `Error in Vendor Profile Page Data retrieval: ${errorMessage}`,
      };
    }
  }

  // public async UpdateBasicDetailV1(userData: any): Promise<any> {
  //   const client: PoolClient = await getClient();
  //   const refUserId = userData.refUserId;

  //   try {
  //       await client.query("BEGIN");

  //       const updateSections = userData.user_data;
  //       const transTypeId = 26;  // Set overall transTypeId to 26

  //       for (const section in updateSections) {
  //           if (updateSections.hasOwnProperty(section)) {
  //               let tableName: string;
  //               let updatedData: any = {};
  //               let oldData: any = {};
  //               let identifierColumn: string = "refvendorId";

  //               switch (section) {
  //                   case "vendorName":
  //                     tableName = "VendorTable"
  //                     const data={[section] :userData.user_data.vendorName.newData}
  //                     // updatedData = { [section]: updateSections[section].newData };

  //                     updatedData =  data;

  //                     console.log('vendorName', )

  //                     break;
  //                   case "vendordesgination":
  //                     console.log('vendordesgination', )
  //                       tableName = "VendorTable";
  //                       updatedData = { [section]: updateSections[section].newData };
  //                       oldData = { [section]: updateSections[section].oldData };
  //                       break;

  //                   case "user":
  //                     console.log('user', )
  //                       tableName = "Users";
  //                       for (const key in updateSections.user) {
  //                           updatedData[key] = updateSections.user[key].newData;
  //                           oldData[key] = updateSections.user[key].oldData;
  //                       }
  //                       break;

  //                   case "communication":
  //                     console.log('communication', )
  //                       tableName = "refCommunication";
  //                       for (const key in updateSections.communication) {
  //                           updatedData[key] = updateSections.communication[key].newData;
  //                           oldData[key] = updateSections.communication[key].oldData;
  //                       }
  //                       break;

  //                   case "address":
  //                     console.log('address', )
  //                       tableName = "refUserAddress";
  //                       updatedData["refAddress"] = updateSections.address.refAddress.newData;
  //                       oldData["refAddress"] = updateSections.address.refAddress.oldData;
  //                       break;

  //                   case "socialLinks":
  //                     console.log('socialLinks', )
  //                       tableName = "VendorSocialLinks";
  //                       for (const key in updateSections.socialLinks) {
  //                           updatedData[key] = updateSections.socialLinks[key].newData;
  //                           oldData[key] = updateSections.socialLinks[key].oldData;
  //                       }
  //                       break;

  //                   default:
  //                       continue;
  //               }

  //               const identifier = { column: identifierColumn, value: refUserId };
  //               console.log('identifier', identifier)

  //               const { updateQuery, values } = buildUpdateQuery(
  //                 tableName,
  //                 updatedData,
  //                 identifier
  //               );
  //               console.log('updateQuery', updateQuery)
  //               console.log('values', values)

  //               const userResult = await client.query(updateQuery, values);
  //               console.log('userResult line --------------------- 280', userResult)
  //               if (!userResult.rowCount) {
  //                   throw new Error("Failed to update the profile data.");
  //               }

  //               const changes = getChanges(updatedData, oldData);
  //               // for (const key in changes) {
  //               //     if (changes.hasOwnProperty(key)) {
  //               //         const tempChange = {
  //               //             data: changes[key],
  //               //         };

  //               //         const parasHistory = [
  //               //             transTypeId,
  //               //             tempChange,
  //               //             refUserId,
  //               //             CurrentTime(),
  //               //         ];
  //               //         const historyResult = await client.query(
  //               //             updateHistoryQuery,
  //               //             parasHistory
  //               //         );
  //               //         if (!historyResult.rowCount) {
  //               //             throw new Error("Failed to update the history.");
  //               //         }
  //               //     }
  //               // }
  //           }
  //       }

  //       await client.query("COMMIT");
  //       return {
  //           success: true,
  //           message: "Profile data updated successfully",
  //       };
  //   } catch (error) {
  //       await client.query("ROLLBACK");

  //       let errorMessage = "Error in updating the profile data";
  //       if (error instanceof Error) {
  //           errorMessage = `Error in updating the profile data: ${error.message}`;
  //       }

  //       return {
  //           success: false,
  //           message: errorMessage,
  //       };
  //   } finally {
  //       client.release();
  //   }
  // }

  public async UpdateBasicDetailV1(userData: any): Promise<any> {
    const client: PoolClient = await getClient();
    const refUserId = userData.refUserId;

    try {
      await client.query("BEGIN");

      const updateSections = userData.user_data;
      const transTypeId = 26;  // Set overall transTypeId to 26

      for (const section in updateSections) {
        if (updateSections.hasOwnProperty(section)) {
          let tableName: string;
          let updatedData: any = {};
          let oldData: any = {};
          let identifierColumn: string;
          
          switch (section) {
            case "vendorName":
              tableName = "VendorTable";
              console.log('tableName', tableName)
              updatedData = { [section]: updateSections[section].newData };
              oldData = { [section]: updateSections[section].oldData };
              identifierColumn = "refvendorId";
              break;

            case "vendordesgination":
              tableName = "VendorTable";
              updatedData = { [section]: updateSections[section].newData };
              oldData = { [section]: updateSections[section].oldData };
              identifierColumn = "refVendorId";
              break;

            case "user":
              tableName = "Users";
              for (const key in updateSections.user) {
                updatedData[key] = updateSections.user[key].newData;
                oldData[key] = updateSections.user[key].oldData;
              }
              identifierColumn = "refUserId";
              break;

            case "communication":
              tableName = "refCommunication";
              for (const key in updateSections.communication) {
                updatedData[key] = updateSections.communication[key].newData;
                oldData[key] = updateSections.communication[key].oldData;
              }
              identifierColumn = "refComId";
              break;

            case "address":
              tableName = "refUserAddress";
              updatedData["refAddress"] = updateSections.address.refAddress.newData;
              oldData["refAddress"] = updateSections.address.refAddress.oldData;
              identifierColumn = "AddressID";
              break;

            case "socialLinks":
              tableName = "VendorSocialLinks";
              for (const key in updateSections.socialLinks) {
                updatedData[key] = updateSections.socialLinks[key].newData;
                oldData[key] = updateSections.socialLinks[key].oldData;
              }
              identifierColumn = "VendorLinks";
              break;

            default:
              continue;
          }

          const identifier = { column: identifierColumn, value: refUserId };
          console.log('identifier', identifier)

          const { updateQuery, values } = buildUpdateQuery(
            tableName,
            updatedData,
            identifier
          );
          console.log('updateQuery', updateQuery)
          console.log('values', values)

          const userResult = await client.query(updateQuery, values);
          console.log('userResult', userResult)
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

      await client.query("COMMIT");
      return {
        success: true,
        message: "Profile data updated successfully",
      };
    } catch (error) {
      await client.query("ROLLBACK");

      let errorMessage = "Error in updating the profile data";
      if (error instanceof Error) {
        errorMessage = `Error in updating the profile data: ${error.message}`;
      }

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      client.release();
    }
  }


  public async VendorBankDetailsV1(
    bankDetails: { bankName: string, accountNumber: string, ibanCode: string, paymentId: number, moneyTransferDetails: string }
  ): Promise<any> {
    const { bankName, accountNumber, ibanCode, paymentId, moneyTransferDetails } = bankDetails;

    console.log('Received Bank Details:', { bankName, accountNumber, ibanCode, paymentId, moneyTransferDetails });

    try {
      console.log('Fetching payment type name for paymentId:', paymentId);
      const paymentTypeResult = await executeQuery(getPaymentTypeNameQuery, [paymentId]);
      console.log('Payment Type Result:', paymentTypeResult);

      if (!paymentTypeResult || paymentTypeResult.length === 0) {
        throw new Error('Invalid payment ID or payment type query failed');
      }
      const paymentTypeName = paymentTypeResult[0].paymentTypeName;
      console.log('Payment Type Name:', paymentTypeName);

      console.log('Fetching vendor count for generating refUserCustId');
      const vendorCountResult = await executeQuery(getVendorCount);
      console.log('Vendor Count Result:', vendorCountResult);

      if (!vendorCountResult || vendorCountResult.length === 0) {
        throw new Error('Failed to fetch vendor count');
      }
      const vendorCount = parseInt(vendorCountResult[0].count, 10);
      console.log('Vendor Count:', vendorCount);

      const refUserCustId = `VD${(vendorCount + 1).toString().padStart(3, '0')}`;
      console.log('Generated refUserCustId:', refUserCustId);

      const vendorBankDetailsParams = [bankName, accountNumber, ibanCode, paymentId, refUserCustId, moneyTransferDetails];
      console.log('Inserting vendor bank details with params:', vendorBankDetailsParams);

      const result = await executeQuery(insertVendorBankDetailsQuery, vendorBankDetailsParams);
      console.log('Insert Result:', result);

      if (!result || result.length === 0) {
        throw new Error('Insert vendor bank details query failed');
      }

      return { vendorBankDetailsId: result[0].vendorBankDetailsId };
    } catch (error) {
      console.error('Error occurred:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to insert vendor bank details: ${error.message}`);
      } else {
        throw new Error('Failed to insert vendor bank details due to an unknown error');
      }
    }
  }

  public async RestaurentDocUplaodV1(userData: any): Promise<any> {
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
          filePaths: filePaths,
          files: storedFiles,
        },
        false
      );
    } catch (error) {
      console.error('Error occurred:', error);
      return encrypt(
        {
          success: false,
          message: "Error In Storing the PDFs",
        },
        false
      );
    }
  }

  public async RestaurentDocUpdateV1(userData: any): Promise<any> {

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
      const TransTypeID = 21;
      const transData = "Restaurent Documents Updated";
      const TransTime = new Date().toISOString(); // Current time in ISO format
      const updatedBy = "Vendor";
      const transactionValues = [TransTypeID, refUserId, transData, TransTime, updatedBy];

      await executeQuery(updateHistoryQuery, transactionValues);

      return encrypt(
        {
          success: true,
          message: "Restaurent Documents Store Successfully",
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
        },
        false
      );
    }
  }

  public async deleteRestaurentDocV1(userData: any): Promise<any> {
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
      const TransTypeID = 23;
      const transData = "Restaurent Documents Deleted";
      const TransTime = new Date().toISOString(); // Current time in ISO format
      const updatedBy = "Vendor";
      const transactionValues = [TransTypeID, userData.refUserId, transData, TransTime, updatedBy];

      await executeQuery(updateHistoryQuery, transactionValues);

      return encrypt(
        {
          success: true,
          message: "Restaurent Documents Deleted Successfully",
        },
        false
      );
    } catch (error) {
      console.error('Error in deleting file:', (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Deleting the Restaurent Documents: ${(error as Error).message}`,
        },
        false
      );
    }
  }

  public async LogoUploadV1(userData: any): Promise<any> {
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
          filePath: filePath,
          files: storedFiles,
        },
        false
      );
    } catch (error) {
      console.error('Error occurred:', error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the Image",
        },
        false
      );
    }
  }

  public async LogoUpdateV1(userData: any): Promise<any> {

    try {
      const {
        logoImage,
        refUserId // Add refUserId to userData
      } = userData;

      const result = await executeQuery(ImageStoreQuery, [
        logoImage
      ]);

      const updatedRow = result[0]; // Access the first element of the result array
      const TransTypeID = 24;
      const transData = "Restaurant Logo Updated";
      const TransTime = new Date().toISOString(); // Current time in ISO format
      const updatedBy = "Vendor";
      const transactionValues = [TransTypeID, refUserId, transData, TransTime, updatedBy];

      await executeQuery(updateHistoryQuery, transactionValues);

      return encrypt(
        {
          success: true,
          message: "Restaurant Logo Stored Successfully",
          data: updatedRow,
        },
        false
      );
    } catch (error) {
      console.error('Error updating data:', (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Updating the Logo: ${(error as Error).message}`,
        },
        false
      );
    }
  }

  public async deleteLogoV1(userData: any): Promise<any> {
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

      const TransTypeID = 25;
      const transData = "Restaurent Documents Deleted";
      const TransTime = new Date().toISOString(); // Current time in ISO format
      const updatedBy = "Vendor";
      const transactionValues = [TransTypeID, userData.refUserId, transData, TransTime, updatedBy];

      await executeQuery(updateHistoryQuery, transactionValues);

      return encrypt(
        {
          success: true,
          message: "Restaurent Documents Deleted Successfully",
        },
        false
      );
    } catch (error) {
      console.error('Error in deleting file:', (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Deleting the Restaurent Documents: ${(error as Error).message}`,
        },
        false
      );
    }
  }
}












import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";
import { encrypt } from "../../helper/encrypt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../helper/mail";
import { sendOtpTemplate } from "../../helper/mailcontent";
import { generateTokenOtp, decodeTokenOtp } from "../../helper/token";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import {
  checkQuery, getCustomerCount, insertUserQuery, insertUserDomainQuery, insertUserCommunicationQuery,
  updateHistoryQuery,
  userQuery, SetOtptime, SetOtp, mobileNumbersQuery,
  insertOrderMasterQuery, insertUserContactQuery, insertProductContentQuery, insertorderContentQuery, insertUserAddressQuery
} from "./query";
import { CurrentTime, formatDate } from "../../helper/common";

export class UserRepository {

  public async userSignUpV1(userData: any, token_data?: any): Promise<any> {
    const client: PoolClient = await getClient();
    try {
      await client.query('BEGIN');

      const hashedPassword = await bcrypt.hash(userData.temp_password, 10);

      const check = [userData.temp_username];
      console.log(check);

      const userCheck = await client.query(checkQuery, check);
      console.log('userCheck', userCheck);

      const userFind = userCheck.rows[0];
      console.log('userFind', userFind);

      if (userFind) {
        await client.query('ROLLBACK');
        return encrypt(
          {
            message: "Already exists",
            success: true,
          },
          false
        );
      }

      const userCountResult = await client.query(getCustomerCount);
      console.log('userCountResult', userCountResult);

      const userCount = parseInt(userCountResult.rows[0].count, 10);
      console.log('userCount', userCount);

      const newCustomerId = `KC${(userCount + 1).toString().padStart(3, '0')}`;
      let userType = 1;
      console.log('newCustomerId', newCustomerId);

      const params = [
        userData.temp_fname, // refStFName
        userData.temp_lname, // refStLName
        newCustomerId,
        userType,
      ];
      console.log(params);

      const userResult = await client.query(insertUserQuery, params);
      const newUser = userResult.rows[0];
      console.log('newUser', newUser);

      const domainParams = [
        newUser.refUserId, // refUserId from users table
        newUser.refUserCustId, // refCustId from users table
        userData.temp_username, // refcust Username
        userData.temp_password, // refCustPassword
        hashedPassword, // refCustHashedPassword
        userData.temp_phone,
        userData.temp_email,
      ];
      console.log(domainParams);
      const domainResult = await client.query(insertUserDomainQuery, domainParams);
      const communicationParams = [
        newUser.refUserId, // refUserId from users table
        userData.temp_phone,
        userData.temp_email,
      ];
      console.log(communicationParams);

      const communicationResult = await client.query(insertUserCommunicationQuery, communicationParams);

      console.log('line --------- 96');
      if (
        userResult.rows.length > 0 &&
        domainResult.rows.length > 0 &&
        communicationResult.rows.length > 0
      ) {
        const history = [
          1,
          newUser.refUserId,
          "User SignUp",
          CurrentTime(),
          "user"
        ];

        console.log('history', history);
        const updateHistory = await client.query(updateHistoryQuery, history);

        if (updateHistory.rows.length > 0) {
          const tokenData = {
            id: newUser.refUserId, // refUserId from users table
            email: userData.temp_su_email,
            custId: newUser.refSCustId,
            status: newUser.refSUserStatus,
          };

          await client.query('COMMIT');  // Commit the transaction
          return encrypt(
            {
              success: true,
              message: "User signup successful",
              user: newUser,
              token: generateTokenWithExpire(tokenData, true),
            },
            false
          );
        } else {
          await client.query('ROLLBACK');  // Rollback if history update fails
          return encrypt(
            {
              success: false,
              message: "Failed to update history",
            },
            false
          );
        }
      } else {
        await client.query('ROLLBACK');  // Rollback if any insert fails
        return encrypt(
          {
            success: false,
            message: "Signup failed",
          },
          false
        );
      }
    } catch (error: unknown) {
      await client.query('ROLLBACK');  // Rollback the transaction in case of any error
      console.error('Error during user signup:', error);

      if (error instanceof Error) {
        return encrypt(
          {
            success: false,
            message: "An unexpected error occurred during signup",
            error: error.message,
          },
          false
        );
      } else {
        return encrypt(
          {
            success: false,
            message: "An unknown error occurred during signup",
            error: String(error),
          },
          false
        );
      }
    } finally {
      client.release();  // Release the client back to the pool
    }
  }
  // public async forgotPasswordV1(userData: any): Promise<any> {
  //   console.log('userData', userData)
  //   const client: PoolClient = await getClient();

  //   try {
  //     await client.query('BEGIN');

  //     const { refUserId, emailId } = userData;
  //     console.log('refUserId', refUserId)

  //     // Validate email ID or refUserId
  //     if (!emailId || !refUserId) {
  //       return encrypt(
  //         {
  //           success: false,
  //           message: "Email ID or User ID is missing",
  //         },
  //         false
  //       );
  //     }

  //     // Fetch all mobile numbers associated with the user
  //     const mobileNumbers = await executeQuery(mobileNumbersQuery, [emailId]);
  //     console.log('mobileNumbers', mobileNumbers)

  //     if (!mobileNumbers.length) {
  //       return encrypt(
  //         {
  //           success: false,
  //           message: "No mobile numbers found for the user",
  //         },
  //         true
  //       );
  //     }

  //     // Generate a numeric OTP
  //     const generateNumericOtp = (length = 6): string =>
  //       Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

  //     const otp = generateNumericOtp();
  //     console.log("Generated OTP:", otp);

  //     // Prepare email content
  //     const mailOptions = {
  //       to: emailId,
  //       subject: "Forgot Password OTP",
  //       html: sendOtpTemplate("Dear", otp),
  //     };

  //     // Attempt to send OTP email
  //     try {
  //       await sendEmail(mailOptions);
  //     } catch (error) {
  //       console.error("Failed to send OTP email:", error);
  //       return encrypt(
  //         {
  //           success: false,
  //           message: "Failed to send OTP email",
  //         },
  //         false
  //       );
  //     }

  //     // Create a token for OTP (if needed)
  //     const tokenOtp = generateTokenOtp({ otp }, true);

  //     // Store OTP in the database
      // const otpParams = [refUserId, tokenOtp, CurrentTime()];
      // const otpResult = await client.query(SetOtp, otpParams);

      // const otpTimeParams = [
      //   tokenOtp, CurrentTime(), formatDate
      // ];
      // const otpTimeResult = await client.query(SetOtptime, otpTimeParams);

      // // Update transaction history
      // const txnHistoryParams = [
      //   3, // TransTypeID
      //   refUserId, // refUserId
      //   "Forgot Password OTP Generated", // Transaction description
      //   CurrentTime(), // Transaction time
      //   "System", // Updated by
      // ];
      // await executeQuery(updateHistoryQuery, txnHistoryParams);

  //     // Return success response with mobile numbers
  //     await client.query('COMMIT');  // Commit the transaction

  //     return encrypt(
  //       {
  //         success: true,
  //         validation: true,
  //         message: "OTP sent successfully",
  //         mobileNumbers: mobileNumbers.map((row: any) => row.refCustMobileNum1), // Include mobile numbers in the response
  //         emailId
  //       },
  //       false
  //     );
  //   } catch (error) {
  //     await client.query('ROLLBACK');  // Rollback if history update fails

  //     console.error("Error in forgot password process:", error);
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "Internal server error",
  //       },
  //       false
  //     );
  //   } finally {
  //     client.release();  // Release the client back to the pool
  //   }
  // }
  public async forgotPasswordV1(userData: any): Promise<any> {
    console.log("Input Payload:", userData);
    const client: PoolClient = await getClient();
  
    try {
      const { refUserId, emailId } = userData;
  
      // Validate input
      if (!emailId || !refUserId) {
        return encrypt(
          {
            success: false,
            message: "Email ID or User ID is missing",
          },
          false
        );
      }
  
      console.log("Validating User ID and Email ID:", { refUserId, emailId });
  
      // Begin database transaction
      await client.query("BEGIN");
  
      // Fetch all mobile numbers associated with the user
  
      const mobileNumbersResult = await executeQuery(mobileNumbersQuery, [
    
        emailId,
      ]);
  
      console.log("Mobile Numbers Result:", mobileNumbersResult);
  
      // Check if any mobile numbers were found
      if (!mobileNumbersResult.length) {
        return encrypt(
          {
            success: false,
            message: "No mobile numbers found for the user",
          },
          false
        );
      }
  
      // Map mobile numbers from the result
      const mobileNumbers = mobileNumbersResult.map(
        (row: any) => row.refCustMobileNum1
      );
  
      console.log("Mapped Mobile Numbers:", mobileNumbers);
  
      // Commit transaction
      await client.query("COMMIT");
  
      // Return the mobile numbers and email ID in the response
      return encrypt(
        {
          success: true,
          message: "Contact information retrieved successfully",
          emailId,
          mobileNumbers,
        },
        false
      );
    } catch (error) {
      console.error("Error retrieving user contact info:", error);
  
      // Rollback transaction in case of failure
      await client.query("ROLLBACK");
  
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        false
      );
    } finally {
      client.release(); // Release the client back to the pool
    }
  }

  public async sendOtpV1(userData: any): Promise<any> {
    console.log("Input Payload:", userData);
    const client: PoolClient = await getClient();
  
    try {
      const { mobileNumber, emailId } = userData;
  
      // Validate input
      if (!mobileNumber || !emailId) {
        return encrypt(
          {
            success: false,
            message: "Mobile number or email ID is missing",
          },
          false
        );
      }
  
      console.log("Validating Mobile Number and Email ID:", { mobileNumber, emailId });
  
      // Begin database transaction
      await client.query("BEGIN");
  
      // Fetch user record with the specific mobile number and email ID

  
      const userResult = await executeQuery(userQuery, [mobileNumber, emailId]);
  
      console.log("User Query Result:", userResult);
  
      if (!userResult.length) {
        return encrypt(
          {
            success: false,
            message: "No matching user found for the given mobile number and email ID",
          },
          false
        );
      }
  
      const { refUserId } = userResult[0];
      console.log("refUserId:", refUserId);
  
      // Generate a numeric OTP
      const generateNumericOtp = (length = 6): string =>
        Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
  
      const otp = generateNumericOtp();
      console.log("Generated OTP:", otp);
  
      // Prepare email content
      const mailOptions = {
        to: emailId,
        subject: "Forgot Password OTP",
        html: sendOtpTemplate("Dear User", otp),
      };
  
      // Attempt to send OTP email
      try {
        await sendEmail(mailOptions);
      } catch (error) {
        console.error("Failed to send OTP email:", error);
        return encrypt(
          {
            success: false,
            message: "Failed to send OTP email",
          },
          false
        );
      }
  
      // Create a token for OTP
      const tokenOtp = generateTokenOtp({ otp }, true);
  
      // Store OTP in the database
      const otpParams = [refUserId, tokenOtp, CurrentTime()];
      const otpResult = await client.query(SetOtp, otpParams);
  
      const otpTimeParams = [tokenOtp, CurrentTime(), formatDate(30)]; // Adds 30 seconds
      const otpTimeResult = await client.query(SetOtptime, otpTimeParams);
  
      // Update transaction history
      const txnHistoryParams = [
        3, // TransTypeID
        refUserId, // refUserId
        "Forgot Password OTP Generated", // Transaction description
        CurrentTime(), // Transaction time
        "System", // Updated by
      ];
      await executeQuery(updateHistoryQuery, txnHistoryParams);
  
      // Commit transaction
      await client.query("COMMIT");
  
      // Return success response
      return encrypt(
        {
          success: true,
          validation: true,
          message: "OTP sent successfully",
          mobileNumber,
          emailId,
        },
        false
      );
    } catch (error) {
      console.error("Error in forgot password process:", error);
  
      // Rollback transaction in case of failure
      await client.query("ROLLBACK");
  
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        false
      );
    } finally {
      client.release(); // Release the client back to the pool
    }
  }
  
  public async addProductV1(userData: any): Promise<any> {

  }
  
  public async orderplacementV1(orderData: any): Promise<any> {
    const client: PoolClient = await getClient(); // Assuming getClient() is a function to get DB client
    const tokens = generateTokenWithExpire({ id: orderData.userId }, true); // Mock token generation
    console.log('Generated Token:', tokens);

    try {
      await client.query("BEGIN");

      const { foodContents, totalAmount, userAddress, contactNumber, modeOfPayment } = orderData;

      // Insert Order Master
      const orderMasterParams = [

        // orderData.userId, // refUserId
        totalAmount.totalPrice, // refPrice
        totalAmount.taxApplied, // taxAppliedId
        totalAmount.offerAmount, // refOfferId
        totalAmount.grandTotalBill, // totalBill
        modeOfPayment.paymentMethod, // paymentMethodId
        modeOfPayment.paymentStatus, // refStatus
        modeOfPayment.paymentMode, // paymentMode
      ];
      const orderMasterResult = await client.query(insertOrderMasterQuery, orderMasterParams);
      console.log('Order Master Result:', orderMasterResult);

      // Insert User Contact
      const contactParams = [
        contactNumber.mobile, // refMobileNo
        parseInt(orderData.userId),
      ];
      console.log('contactParams', contactParams)
      const contactResult = await client.query(insertUserContactQuery, contactParams);
      console.log('contactResult', contactResult)

      // Insert Food Contents
      for (const key in foodContents) {
        const food = foodContents[key];
        const productTable = [
          food.foodName, // productName
          food.individualPrice, // productPrice
        ];

        const orderTable = [
          food.productId, // productId
          food.foodQuantity, // productQuantity
          food.overallPrice, // totalPrice
        ];

        const foodContentResult = await client.query(insertProductContentQuery, productTable);
        const foodOrderResult = await client.query(insertorderContentQuery, orderTable);

        // const foodContentResult = await executeQuery(insertFoodContentQuery, foodContentParams);
        // console.log(`Inserted Food Content for productId ${food.productId}:`, foodContentResult);

        // Insert User Address
        const userAddressParams = [
          // orderData.userId, // refUserId
          userAddress.addressMode, // addressMode
          userAddress.addressStreet, // refStreet
          userAddress.addressCity, // refCity
          userAddress.addressPostalCode, // refPostalCode
          userAddress.addressZone, // refZone
          userAddress.addressCountry, // refCountry
        ];
        const userAddressResult = await client.query(insertUserAddressQuery, userAddressParams);
        console.log('User Address Result:', userAddressResult);

        // Insert Transaction History
        const txnHistoryParams = [
          11, // TransTypeID
          parseInt(orderData.userId), // refOrderId
          "Food order processed", // transData
          CurrentTime(), // TransTime
          "System", // UpdatedBy
        ];
        await client.query(updateHistoryQuery, txnHistoryParams);


        // Commit the transaction
        console.log('Transaction successful. Committing.');
        await client.query("COMMIT");

        // Return success response
        return encrypt({
          success: true,
          message: 'Order processed successfully',
          token: tokens,
          orderId: parseInt(orderData.userId),
        }, true);
      }
    } catch (error) {
      // Rollback the transaction in case of error
      console.error('Error during order processing:', error);
      await client.query("ROLLBACK");
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return encrypt({
        success: false,
        message: 'Order processing failed',
        error: errorMessage,
        token: tokens,
      }, true);
    } finally {
      await client.query("COMMIT");
      client.release();
    }
  }

}


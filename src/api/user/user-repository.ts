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
  checkQuery,
  getCustomerCount,
  insertUserQuery,
  insertUserDomainQuery,
  insertUserCommunicationQuery,
  updateHistoryQuery,
  ValidateEmailUserName, validateResendMail, SetOtp,
  insertOrderMasterQuery, insertUserContactQuery, insertProductContentQuery, insertorderContentQuery, insertUserAddressQuery
} from "./query";
import { CurrentTime } from "../../helper/common";

export class UserRepository {
  public async userSignUpV1(userData: any, token_data?: any): Promise<any> {

    console.log('token_data', token_data)
    console.log('userData', userData)

    const hashedPassword = await bcrypt.hash(userData.temp_password, 10);

    const check = [userData.temp_username];
    console.log(check);
    // const userCheck = await executeQuery(checkQuery, [userData.temp_username]);
    const userCheck = await executeQuery(checkQuery, check)
    console.log('userCheck', userCheck);
    const userFind = userCheck[0];
    console.log('userFind', userFind);

    if (userFind) {

      return encrypt(
        {
          message: "Already exit",
          success: true,
        },
        false
      );
    } else {
      // Generate newCustomerId in the format KC001, KC002, etc.
      const userCountResult = await executeQuery(getCustomerCount);
      console.log('userCountResult', userCountResult);
      const userCount = parseInt(userCountResult[0].count, 10); // Extract and convert count to a number
      console.log('userCount', userCount);

      let newCustomerId;
      if (userCount >= 0) {
        newCustomerId = `KC${(userCount + 1).toString().padStart(3, '0')}`; // Generate the ID in the format KCxxx
      }
      let userType = 1;
      console.log('newCustomerId', newCustomerId);

      const params = [
        userData.temp_fname, // refStFName
        userData.temp_lname, // refStLName
        newCustomerId,
        (userType = 1),
        // userData.temp_email
      ];
      console.log(params);

      const userResult = await executeQuery(insertUserQuery, params);
      const newUser = userResult[0];
      console.log('newUser', newUser)

      const domainParams = [
        newUser.refUserId, // refUserId from users table
        newUser.refUserCustId, // refCustId from users table
        userData.temp_username, // refcust Username
        userData.temp_password, // refCustPassword
        hashedPassword, // refCustHashedPassword
        userData.temp_phone,
        userData.temp_email
      ];

      console.log(domainParams);

      const domainResult = await executeQuery(insertUserDomainQuery, domainParams);

      const communicationParams = [
        newUser.refUserId, // refUserId from users table
        userData.temp_phone,
        userData.temp_email,
      ];

      console.log(communicationParams);

      const communicationResult = await executeQuery(insertUserCommunicationQuery, communicationParams);

      console.log(' line --------- 96',)
      if (
        userResult.length > 0 &&
        domainResult.length > 0 &&
        communicationResult.length > 0
      ) {
        const history = [
          1,
          CurrentTime(),
          newUser.refUserId,
          "User SignUp",
        ];

        console.log('history', history)
        const updateHistory = await executeQuery(updateHistoryQuery, history);

        console.log('line ----- 113',)
        if (updateHistory && updateHistory.length > 0) {
          const tokenData = {
            id: newUser.refUserId, // refUserId from users table
            email: userData.temp_su_email,
            custId: newUser.refSCustId,
            status: newUser.refSUserStatus,
          };
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
          return encrypt(
            {
              success: false,
              message: "Failed to update history",
            },
            false
          );
        }
      } else {
        return encrypt(
          {
            success: false,
            message: "Signup failed",
          },
          false
        );
      }
    }
  }

  public async verifyUserNameEmailV1(userData: any): Promise<any> {
    try {
      const { refUserId } = userData;

      let ValidationTextResult = userData.emailId;
      // if (userData.validateText) {
      //   ValidationTextResult = await executeQuery(ValidateEmailUserName, [
      //     userData.validateText,
      //   ]);
      // } else if (userData.id) {
      //   ValidationTextResult = await executeQuery(validateResendMail, [
      //     userData.id,
      //   ]);
      // }

      let result;
      console.log('ValidationTextResult', ValidationTextResult)
      if (ValidationTextResult.length > 0) {
        function generateNumericOtp(length = 6) {
          let otp = "";
          for (let i = 0; i < length; i++) {
            otp += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
          }
          return otp;
        }

        const OTP = { otp: generateNumericOtp() };
        console.log('OTP', OTP)

        const main = async () => {
          const mailOptions = {
            to: ValidationTextResult,
            subject: "Password Request OTP",
            html: sendOtpTemplate(
              "Testing " +
              " " +
              "User",
              OTP.otp
            ),
          };

          try {
            await sendEmail(mailOptions);
          } catch (error) {
            console.error("Failed to send email:", error);

            const results = {
              success: false,
              message: "error in sending the resetpassword request",
            };
            return encrypt(results, true);
          }
        };

        await main();
        const tokenOtp = generateTokenOtp(OTP, true);

        const params = [
          //ValidationTextResult[0].refUserId,
          refUserId,
          tokenOtp,
          CurrentTime(),
        ];

        result = await executeQuery(SetOtp, params);

        const txnHistoryParams = [
          3, // TransTypeID (integer)
          refUserId, // refUserId (integer)
          "OTP Updated", // transData (ensure this matches the column type)
          CurrentTime(), // TransTime (ensure this matches the column type, likely TIMESTAMP)
          "User", // UpdatedBy (ensure this matches the column type)
        ];

        await executeQuery(updateHistoryQuery, txnHistoryParams);

      } else {
        const results = {
          success: true,
          validation: false,
          message: "MailId or Username Does not Match",
        };
        return encrypt(results, true);
      }
      const results = {
        success: true,
        validation: true,
        message: "Otp Mail Send Successfully",
        id: result[0].otpId,
      };
      return encrypt(results, true);
    } catch (error) {
      console.log("error", error);
      const results = {
        success: false,
        message: "error in sending the resetpassword request",
      };
      return encrypt(results, true);
    }
  }

  public async orderplacementV1(orderData: any): Promise<any> {
    const client: PoolClient = await getClient(); // Assuming getClient() is a function to get DB client
    // const tokens = generateTokenWithExpire({ id: orderData.userId }, true); // Mock token generation
    // console.log('Generated Token:', tokens);

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
          //token: tokens,
          orderId: parseInt(orderData.userId),
        }, false);
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
        // token: tokens,
      }, false);
    } finally {
      await client.query("COMMIT");
      client.release();
    }
  }

}


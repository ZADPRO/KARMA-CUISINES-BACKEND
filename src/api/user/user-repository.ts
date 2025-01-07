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
import {
  checkQuery,
  getCustomerCount,
  insertUserQuery,
  insertUserDomainQuery,
  insertUserCommunicationQuery,
  updateHistoryQuery
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

      console.log(' line --------- 96', )
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

        console.log('line ----- 113', )
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


}


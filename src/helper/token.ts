import jwt, { JwtPayload } from "jsonwebtoken";

import dotenv from "dotenv";

import { request } from "http";
import { ResponseToolkit } from "@hapi/hapi";
import { encrypt } from "./encrypt";

dotenv.config();

if (!process.env.ACCESS_TOKEN) {
  throw new Error("ACCESS_TOKEN not found in .env file");
}

const TOKEN_EXPIRATION = "20m";

// WITH TOKEN EXPIRATION
function generateTokenWithExpire(
  tokenData: object,
  action: boolean
): string | object {
  if (action) {
    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN as string, {
      expiresIn: TOKEN_EXPIRATION,
    });
    return token;
  } else {
    return tokenData;
  }
}

// WITHOUT TOKEN EXPIRATION
function generateTokenWithoutExpire(
  tokenData: object,
  action: boolean
): string | object {
  if (action) {
    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN as string, {});
    return token;
  } else {
    return tokenData;
  }
}

// DECODE TOKEN

function decodeToken(token: string): JwtPayload | { error: string } {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string);
    if (typeof decoded === "string") {
      return {
        error: "Invalid token format",
      };
    }
    return decoded;
  } catch (error) {
    return {
      error: "Invalid or expired token",
    };
  }
}

// VALIDATE TOKEN
function validateToken(request: any, h: ResponseToolkit) {
  const authHeader = request.headers.authorization;
  console.log("AUTH HEADER", authHeader);

  if (!authHeader) {
    return h.response({ error: "Token missing" }).code(401).takeover();
  }

  const token = authHeader.split(" ")[1];
  console.log("Token", token);
  const decodedToken = decodeToken(token);
  console.log("decodedToken", decodedToken);

  if ("error" in decodeToken) {
    return h
      .response(
        encrypt(
          {
            token: false,
            message: decodedToken.error,
          },
          true
        )
      )
      .code(200)
      .takeover();
  }

  request.plugins.token = decodedToken;
  console.log("request.plugins.token", request.plugins.token);

  return h.continue;
}

export {
  decodeToken,
  generateTokenWithExpire,
  validateToken,
  generateTokenWithoutExpire,
};

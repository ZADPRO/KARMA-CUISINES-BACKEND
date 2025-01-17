export const checkQuery = `SELECT * FROM public."refUsersDomain" WHERE "refUserName"=$1 LIMIT 10;`

export const getCustomerCount = `SELECT COUNT(*) FROM public."users" u WHERE u."refUserCustId" LIKE 'KC%'`;
   
export const insertUserQuery = `
  INSERT INTO public."users" (
    "refUserFName", "refUserLName",
   "refUserCustId","refRoleId"
  ) VALUES ($1, $2, $3, $4) 
  RETURNING "refRoleId", "refUserCustId","refUserId";
`

export const insertUserDomainQuery = `
  INSERT INTO public."refUsersDomain" (
    "refUserId", "refCustId","refUserName", "refCustPassword", 
    "refCustHashedPassword","refCustMobileNum1", "refUserEmail"
  ) VALUES ($1, $2,$3, $4, $5, $6, $7)
  RETURNING *;`

export const insertUserCommunicationQuery = `
  INSERT INTO public."refCommunication" (
    "refUserId", "refMobileNo", "refEmail"
  ) VALUES ($1, $2, $3)
  RETURNING *;`

export const updateHistoryQuery = `
  INSERT INTO public."refTransactionHistory" (
    "transTypeId", "refUserId", "transData","transTime", "updatedBy"
  ) VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;


export const ValidateEmailUserName = `SELECT
  ud."refUserId",
  u."refUserFName",
  u."refUserLName",
  uc."refEmail"
FROM
  public."refUsersDomain" ud
  INNER JOIN public."refCommunication" uc
    ON ud."refUserId" = uc."refUserId"
  INNER JOIN public."users" u
    ON ud."refUserId" = u."refUserId"
WHERE
  (
    ud."refUserName" = $1
    OR ud."refUserEmail" = $1
  );
`;

export const validateResendMail = `SELECT
  rf."refUserId",
  u."refUserFName",
  u."refUserLName",
  uc."refEmail"
FROM
  public."refOTPGen" rf
  INNER JOIN public."refCommunication" uc ON rf."refUserId" = uc."refUserId"
  INNER JOIN public."users" u ON rf."refUserId" = u."refUserId"
WHERE rf."otpId" = $1;`;

export const SetOtp = `INSERT INTO
  public."refOTPGen"  ("refUserId", "otp", "createdAt")
values
  ($1, $2, $3) RETURNING *;`;

  export const insertOrderMasterQuery = `INSERT INTO
  public."orderTransactionTable" ("refPrice", "taxAppliedId", "refOfferId", "totalBill", "paymentMethodId", "refStatus", "paymentId")
values
  ($1, $2, $3, $4, $5, $6, $7) 
  RETURNING *;
`;

  export const insertUserContactQuery = `INSERT INTO "public"."refCommunication" ("refMobileNo", "refUserId") values ($1, $2)`;

  export const insertProductContentQuery = `INSERT INTO "public"."refProductTable" ("productName", "productPrice" ) values ($1, $2)
`;
  export const insertorderContentQuery = `INSERT INTO "public"."refOrderTable" ("productId", "quantity", "totalPrice") values ($1, $2, $3)`;

  export const insertUserAddressQuery = `INSERT INTO public."refUserAddress" ("addressMode", "refStreet", "refCity", "refPostalCode", "refZone","refCountry")
  VALUES ($1, $2, $3, $4 , $5, $6)
  RETURNING "addressID";`;


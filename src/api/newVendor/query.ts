export const getVendorCountQuery = `
  SELECT COUNT(*) as count FROM public."vendorTable";
`;

export const insertVendorBasicDetails = `INSERT INTO
  public.users (
    "refUserFName",
    "refUserLName",
    "refUserCustId",
    "refRoleId"
  )
values
  ($1, $2, $3, $4)
   RETURNING *;`;

export const insertCommunicationQuery = `
 INSERT INTO public."refCommunication" ("refUserId", "refMobileNo", "refEmail")
  VALUES ($1, $2, $3)
  RETURNING "refCommId";
`;

export const insertUserAddressQuery = `
  INSERT INTO public."refUserAddress" ("refUserId", "refStreet", "refCity", "refPostalCode", "refZone","refCountry")
  VALUES ($1, $2, $3, $4 , $5, $6)
  RETURNING "addressID";
`;

export const insertVendorData = `INSERT INTO
  public."vendorTable"(
    "refUserId",
    "refVendorName",
    "refVendorDesignation",
    "refVendorLogo"
  )
VALUES
  ($1, $2, $3, $4)
RETURNING
  *;`;

export const insertRestroDays = `WITH json_data AS (
  SELECT
    $1::jsonb AS data,
    $2::INT AS refUserId
),
parsed_data AS (
  SELECT
    jd.refUserId,
    (elem->>'refDayId')::INT AS refDayId,
    elem->>'refStartTime' AS refStartTime,
    elem->>'refEndTime' AS refEndTime
  FROM
    json_data jd,
    jsonb_array_elements(jd.data) AS elem
)
INSERT INTO public."refVandorRestroWorkDay"(
  "refUserId",
  "refDayId",
  "refStartTime",
  "refEndTime"
)
SELECT
  refUserId,
  refDayId,
  refStartTime,
  refEndTime
FROM
  parsed_data;`;

export const insertVendorSocialLinksQuery = `
 INSERT INTO public."vendorSocialLinks" ("refUserId", "websiteUrl", "facebookUrl", "instagramUrl", "twitterUrl")
  VALUES ($1, $2, $3, $4, $5)
  RETURNING "vendorLinkId";
`;

export const insertRestroDocs = `WITH json_data AS (
  SELECT
    $1::jsonb AS data,
    $2::INT AS refUserId
),
parsed_data AS (
  SELECT
    jd.refUserId,
    (elem->>'refRestroDocId')::INT AS refRestroDocId,
    elem->>'refRestroDocPath' AS refRestroDocPath
  FROM
    json_data jd,
    jsonb_array_elements(jd.data) AS elem
)
INSERT INTO public."refRestaurentDocuments"(
  "refUserId",
  "restroDocId",
  "refDocPath"
)
SELECT
  refUserId,
  refRestroDocId,
  refRestroDocPath
FROM
  parsed_data;
`;

export const insertVendorBankDetailsQuery = `
  INSERT INTO public."vendorBankDetails" ("refUserId","refBankName","refAccountNumber", "refIbanCode", "paymentId","refMoneyTransferDetails")
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
`;

export const updateHistoryQuery = `
 INSERT INTO public."refTransactionHistory" ("transTypeId", "refUserId", "transData", "transTime", "updatedBy")
  VALUES ($1, $2, $3, $4, $5)
  ;`;

export const fetchProfileData = `SELECT
    u."refUserFName", u."refUserLName", u."refRoleId", 
    rc."refMobileNo", rc."refEmail",
    rua."refStreet", rua."refCity", rua."refPostalCode", rua."refZone", rua."refCountry",
    vwd."refDayId", vwd."refStartTime", vwd."refEndTime",
    vt."refVendorName", vt."refVendorDesignation",
    vsl."websiteUrl", vsl."facebookUrl", vsl."instagramUrl", vsl."twitterUrl",
    vt."refVendorLogo",
    rrd."restroDocId", rrd."refDocPath",
    rbd."refBankName", rbd."refAccountNumber", rbd."refIbanCode", rbd."paymentId", rbd."refMoneyTransferDetails"
    
FROM 
    public.users u
LEFT JOIN 
    public."refCommunication" rc ON u."refUserId" = (rc."refUserId")
LEFT JOIN 
    public."refUserAddress" rua ON rua."refUserId" = (u."refUserId")
LEFT JOIN 
    public."refVandorRestroWorkDay" vwd ON u."refUserId" = vwd."refUserId"
LEFT JOIN 
    public."vendorTable" vt ON u."refUserId" = vt."refUserId"
LEFT JOIN 
    public."vendorSocialLinks" vsl ON u."refUserId" = vsl."refUserId"
LEFT JOIN 
    public."refRestaurentDocuments" rrd ON u."refUserId" = rrd."refUserId"
LEFT JOIN
    public."vendorBankDetails" rbd ON u."refUserId" = rbd."refUserId"
WHERE 
    vt."refUserId" = $1;`;

  export const fetchRestroCertificates =`SELECT "refCertificateType" FROM public."restroDocs";`; 
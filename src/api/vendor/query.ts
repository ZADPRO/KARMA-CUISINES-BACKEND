
export const getVendorCountQuery = `
  SELECT COUNT(*) as count FROM public."vendorTable";
`;

export const insertVendorQuery = `
  INSERT INTO public."vendorTable" ("refUserId", "refVendorName", "refVendorDesignation")
  VALUES ($1, $2, $3)
  RETURNING "refVendorId";
`;

export const insertUserQuery = `
  INSERT INTO public."users" ("refUserFName", "refUserLName", "refUserCustId", "refRoleId")
  VALUES ($1, $2, $3, $4)
  RETURNING "refUserId";
`;

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

export const insertVendorSocialLinksQuery = `
 INSERT INTO public."vendorSocialLinks" ("refUserId", "websiteUrl", "facebookUrl", "instagramUrl", "twitterUrl")
  VALUES ($1, $2, $3, $4, $5)
  RETURNING "vendorLinkId";
`;
export const RestroDetailsQuery = `select * from public."restroDocs" rd;`;

export const updateHistoryQuery = `
 INSERT INTO public."refTransactionHistory" ("transTypeId", "refUserId", "transData", "transTime", "updatedBy")
  VALUES ($1, $2, $3, $4, $5)
  ;`;

export const insertVendorBankDetailsQuery = `
  INSERT INTO public."vendorBankDetails" ("refBankName","refAccountNumber", "refIbanCode", "paymentId", "refUserId","refMoneyTransferDetails")
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
`;

export const getPaymentTypeNameQuery = `
  SELECT "paymentTypeName" FROM public."paymentType"
  WHERE "paymentId" = $1;
`;

export const getVendorCount = `
SELECT COUNT(*) AS count FROM public."vendorBankDetails";`;

export const RestaurentDocStoreQuery = `
INSERT INTO public."refRestaurentDocuments" 
("VATcertificate", "CommercialRegisterExtract", "AlcoholLicense", "FoodSafetyHygieneCertificate", "LiabilityInsurance")
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
`;

export const getDocumentQuery = `
   SELECT "VATcertificate", "CommercialRegisterExtract", "AlcoholLicense", "FoodSafetyHygieneCertificate", "LiabilityInsurance", "logoImage"
    FROM Public."refRestaurentDocuments" 
    WHERE "documentId" = $1;
`;

export const deleteDocumentQuery = `
   UPDATE public."refRestaurentDocuments" 
SET "VATcertificate" = '', "CommercialRegisterExtract" = '', "AlcoholLicense" = '', "FoodSafetyHygieneCertificate" = '', "LiabilityInsurance" = ''
WHERE "documentId" = $1 
RETURNING *;`;

export const ImageStoreQuery = `
 UPDATE public."refRestaurentDocuments" SET "logoImage" = $1 WHERE "documentId" = $2
RETURNING *;`;

export const deleteImageQuery = `
  UPDATE public."refRestaurentDocuments" SET "logoImage" =''
WHERE
  "documentId" = $1
`;

export const fetchProfileData = `SELECT
    vt."refVendorName", vt."refVendorDesignation", 
    u."refUserFName", u."refUserCustId", u."refUserLName", u."refRoleId", 
    rc."refMobileNo", rc."refEmail", 
    rua."refStreet", rua."refCity", rua."refPostalCode", rua."refZone", rua."refCountry",
    vsl."websiteUrl", vsl."facebookUrl", vsl."instagramUrl", vsl."twitterUrl"
FROM 
    public."vendorTable" vt
LEFT JOIN 
    public."users" u ON vt."refUserId" = (u."refUserId")
LEFT JOIN 
    public."refCommunication" rc ON rc."refUserId" = (u."refUserId")
LEFT JOIN 
    public."refUserAddress" rua ON rua."refUserId" = (u."refUserId")
LEFT JOIN 
    public."vendorSocialLinks" vsl ON vsl."refUserId" = (u."refUserId")
WHERE 
    vt."refUserId" = $1;`;

export const fetchRestroCertificates = `SELECT "refCertificateType" FROM public."restroDocs";`;

export const getUpDateList = `SELECT 
    "transTypeId", "refUserId", "transData", "transTime", "updatedBy"
FROM 
    "public"."refTransactionHistory" as th
WHERE 
    "refUserId" = $1
ORDER BY 
    "transTime" DESC;
`;

export const insertproductQuery = `INSERT INTO public."refProductTable" ( "refVendorId", "productName", "productPrice", "category", "description", "ratings", "offerApplied", "offer", "range", "refArrange")
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *;`;

export const insertOfferQuery = `INSERT INTO public."offersTable" (
  "refOfferName", "refOfferDescription", "refOfferMinValue", "refOfferTypeId", "refStartDate", "refEndDate", "refCoupon") VALUES ($1, $2, $3, $4, $5, $6, $7);`;

export const RestroOffersQuery = `select * from public."offersTable" ot;`;

export const insertDocumentQuery = `INSERT INTO public."restroDocs" ("refCertificateType", "visibility") VALUES ($1, true) RETURNING *;`;     

export const updateRestroQuery = `UPDATE public."restroDocs" SET "refCertificateType" = $1, "visibility" = true WHERE "restroDocTypeId" = $2 RETURNING *;`;         

export const updatevisibilityQuery = `UPDATE public."restroDocs"
SET "visibility" = $1
WHERE "restroDocTypeId" = $2
RETURNING *;`;

export const reArrangeQuery = `SELECT * FROM
  public."refProductTable" rpt
WHERE
  rpt."refVendorId" = $1`;

export const RestroproductsQuery = `SELECT * FROM public."refProductTable" rpt
ORDER BY rpt."refArrange";`;

export const paymentDetailsQuery = `SELECT * from public."paymentType" pt;`;

export const updatePayementVisibilityQuery = `UPDATE public."paymentType" SET "visibility" = $1 WHERE "paymentId" = $2
RETURNING *;`;

export const insertPaymentQuery = `INSERT INTO public."paymentType" ("paymentTypeName", "visibility") VALUES ($1, true) RETURNING *;`;

export const updatePaymentQuery = `UPDATE public."paymentType" SET "paymentTypeName" = $1, "visibility" = true WHERE "paymentId" = $2 RETURNING *;`;
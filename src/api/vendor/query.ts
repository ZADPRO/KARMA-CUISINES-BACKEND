
export const getVendorCountQuery = `
  SELECT COUNT(*) as count FROM public."VendorTable";
`;

export const insertVendorQuery = `
  INSERT INTO public."VendorTable" ("refUserCustId", "vendorName", "vendordesgination")
  VALUES ($1, $2, $3)
  RETURNING "refvendorId";
`;

export const insertUserQuery = `
  INSERT INTO public."Users" ("refUserFname", "refUserLname", "refUserCustId", "refRoleId")
  VALUES ($1, $2, $3, $4)
  RETURNING "refUserId";
`;

export const insertCommunicationQuery = `
  INSERT INTO public."refCommunication" ("refUserId", "refMobileno", "refEmail")
  VALUES ($1, $2, $3)
  RETURNING "refComId";
`;

export const insertUserAddressQuery = `
  INSERT INTO public."refUserAddress" ("refAddress", "refUserCustId")
  VALUES ($1,  $2)
  RETURNING "AddressID";
`;

export const insertVendorSocialLinksQuery = `
  INSERT INTO public."VendorSocialLinks" ("refvendorId", "wbsiteUrl", "facebookUrl", "instagramUrl", "twitterUrl")
  VALUES ($1, $2, $3, $4, $5)
  RETURNING "VendorLinks";
`;
export const RestroDetailsQuery = `select rd."CertificateType" from public."restroDocs" rd;`;

export const updateHistoryQuery = `
  INSERT INTO public."txnHistory" ("TransTypeID", "refUserId", "transData", "TransTime", "updatedBy")
  VALUES ($1, $2, $3, $4, $5)
  ;
`;

export const insertVendorBankDetailsQuery = `
  INSERT INTO public."RestaurentDoc" ("refUserCustId", "VATcertificate", "CommercialRegisterExtract", "AlcoholLicense", "FoodSafetyHygieneCertificate", "LiabilityInsurance", "logoImage")
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`;

export const getPaymentTypeNameQuery = `
  SELECT "paymentTypeName" FROM public."PaymentType"
  WHERE "paymentId" = $1;
`;

export const getVendorCount = `
  SELECT COUNT(*) AS count FROM public."VendorBankDetails";
`;

export const RestaurentDocStoreQuery = `
    INSERT INTO public."RestaurentDoc" ("VATcertificate", "CommercialRegisterExtract", "AlcoholLicense", "FoodSafetyHygieneCertificate", "LiabilityInsurance")
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

export const getDocumentQuery = `
    SELECT "VATcertificate", "CommercialRegisterExtract", "AlcoholLicense", "FoodSafetyHygieneCertificate", "LiabilityInsurance", "logoImage"
    FROM Public."RestaurentDoc" 
    WHERE "documentId" = $1;
`;

export const deleteDocumentQuery = `
   UPDATE
  public."RestaurentDoc"
SET
  "VATcertificate" = $1, 
  "CommercialRegisterExtract" =$2, 
  "AlcoholLicense"=$3, 
  "FoodSafetyHygieneCertificate"=$4,
  "LiabilityInsurance"=$5
WHERE
  "documentId" = $6
  RETURNING *;
`;

export const ImageStoreQuery = `
    INSERT INTO public."RestaurentDoc" ("logoImage")
  VALUES ($1)
  RETURNING *;
`;

export const deleteImageQuery = `
  UPDATE public."RestaurentDoc" SET "logoImage" = $1
WHERE
  "documentId" = $2
`;

export const fetchProfileData = `SELECT
    vt."vendorName", 
    vt."vendordesgination", 
    u."refUserFname", 
    u."refUserCustId",
    u."refUserLname", 
    u."refRoleId", 
    rc."refMobileno", 
    rc."refEmail", 
    rua."refAddress", 
    vsl."wbsiteUrl",
    vsl."facebookUrl", 
    vsl."instagramUrl", 
    vsl."twitterUrl"
FROM 
    public."VendorTable" vt
LEFT JOIN 
    public."Users" u ON vt."refUserCustId" = u."refUserCustId"
LEFT JOIN 
    public."refCommunication" rc ON rc."refUserId" = CAST(u."refUserId" AS TEXT)
LEFT JOIN 
    public."refUserAddress" rua ON rua."refUserCustId" = u."refUserCustId"
LEFT JOIN 
    public."VendorSocialLinks" vsl ON vsl."refvendorId" = u."refUserCustId"
WHERE 
    vt."refUserCustId" = $1;`;

export const fetchRestroCertificates = `SELECT "CertificateType" FROM "restroDocs";`;

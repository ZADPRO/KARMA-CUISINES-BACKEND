export const viewOrdersQuery = `
SELECT DISTINCT ON (ol."refUserId")
  uol."refUserFName",
  uol."refUserLName",
  uol."refUserMobile",
  uol."refCreateAt",
  uol."refUserPostCode",
  uol."refUserZone",
  ol."refStoreId",
  ol."refCustOrId",
  ol."refFoodAmtPaid",
  ol."refPaymentType"
FROM public."refUserOrderList" uol
LEFT JOIN public."refOrderList" ol ON CAST(ol."refUserId" AS INTEGER) = uol."refUserId"
WHERE ol."refStoreId" = $1
ORDER BY ol."refUserId", uol."refCreateAt" DESC;
`;

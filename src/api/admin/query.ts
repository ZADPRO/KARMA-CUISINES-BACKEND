export const selectUserByLogin =
`SELECT u."refUserId", u."refUserFName", u."refUserLName", ud."refCustHashedPassword"
FROM public."users" u
JOIN public."refUsersDomain" ud ON u."refUserId" = ud."refUserId"
WHERE ud."refUserName" = $1
   OR ud."refUserEmail" = $1
   OR ud."refCustMobileNum1" = $1;`;

  export const updateHistoryQuery = `
 INSERT INTO public."refTransactionHistory" (
    "transTypeId", "refUserId", "transData","transTime","updatedBy"
  ) VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

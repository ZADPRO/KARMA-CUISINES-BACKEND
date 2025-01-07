export const selectUserByLogin =
`SELECT u."refUserId", u."refUserFname", u."refUserLname", ud."refCustHashedPassword"
FROM public."Users" u
JOIN public."refUsersDomain" ud ON u."refUserId" = CAST(ud."refUserId" AS INTEGER)
WHERE ud."refUserName" = $1
   OR ud."refEmail" = $1
   OR ud."refCustMobileNum" = $1;`;


  export const updateHistoryQuery = `
  INSERT INTO public."txnHistory" (
    "TransTypeID", "refUserId", "transData","TransTime","updatedBy"
  ) VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;


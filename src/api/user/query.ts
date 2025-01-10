export const checkQuery = `SELECT * FROM public."refUsersDomain" WHERE "refUserName"=$1 LIMIT 10;`

export const getCustomerCount = `SELECT COUNT(*) FROM public."Users" u WHERE u."refUserCustId" LIKE 'KC%'`;

export const insertUserQuery = `
  INSERT INTO public."Users" (
    "refUserFname", "refUserLname",
   "refUserCustId","refRoleId"
  ) VALUES ($1, $2, $3, $4) 
  RETURNING "refRoleId", "refUserCustId","refUserId";
`

export const insertUserDomainQuery = `
  INSERT INTO public."refUsersDomain" (
    "refUserId", "refCustId","refUserName", "refCustPassword", 
    "refCustHashedPassword","refCustMobileNum", "refEmail"
  ) VALUES ($1, $2,$3, $4, $5,$6,$7)
  RETURNING *;`

export const insertUserCommunicationQuery = `
  INSERT INTO public."refCommunication" (
    "refUserId", "refMobileno", "refEmail"
  ) VALUES ($1, $2, $3)
  RETURNING *;`

export const updateHistoryQuery = `
  INSERT INTO public."txnHistory" (
    "TransTypeID", "TransTime", "refUserId","transData"
  ) VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

// export const selectUserData = `
//   SELECT
//     u."refRoleId",
//     u."refUserFname",
//     u."refUserLname",
//     ud."refUserName",
//     INITCAP(rt."refRoleName") AS refRoleName
//   FROM
//     public."Users" u
//   JOIN
//     public."refUsersDomain" ud
//     ON u."refUserId" = ud."refUserId"
//   JOIN
//     public."refRoleType" rt
//     ON u."refRoleId" = rt."refRoleId"
//   WHERE
//     u."refUserId" = $1;
// `;

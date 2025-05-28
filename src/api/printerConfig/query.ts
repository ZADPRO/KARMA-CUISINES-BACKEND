export const listVendorDetails = `
    select * from public."vendorDetails" vd
    where vd."isDelete" is not true;
`;

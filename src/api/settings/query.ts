export const settingsCategoryAdded = `INSERT INTO public."productCategories"
("categoryName", "createdAt", "createdBy")
VALUES ($1, $2, $3)
RETURNING *;
`;

export const listAllProducts = `
SELECT * FROM public."productCategories" WHERE "deletedAt" IS NULL;
`;

export const settingsSubCategoryAdded = `
INSERT INTO public."subProductsCategory"
("categoryName", "createdAt", "createdBy")
VALUES ($1, $2, $3)
RETURNING *;
`;

export const listAllSubProducts = `
SELECT * FROM public."subProductsCategory"
WHERE "deletedAt" IS NULL;
`;

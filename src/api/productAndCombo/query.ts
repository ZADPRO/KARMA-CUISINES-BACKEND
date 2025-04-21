export const newCategory = `insert into
  "public"."refFoodCategory" (
    "refFoodCategoryName",
    "refCreateBy",
    "refCreateAt"
  )
values
  ($1,$2,$3);`;

export const getCategory = `SELECT
  "refFoodCategoryId","refFoodCategoryName"
FROM
  public."refFoodCategory"`;

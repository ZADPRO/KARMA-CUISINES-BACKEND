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
  public."refFoodCategory"
  WHERE "refIfDelete" IS NOT true
  ORDER BY "refFoodCategoryId"`;

export const updateCategory = `UPDATE
  public."refFoodCategory"
SET
  (
    "refFoodCategoryName",
    "refUpdateAt",
    "refUpdateBy"
  ) = ($2, $3, $4)
WHERE
  "refFoodCategoryId" = $1`;

export const deleteCategory = `UPDATE
  public."refFoodCategory"
SET
  "refIfDelete" = true,
  "refUpdateAt" = $2,
  "refUpdateBy" = $3
WHERE
  "refFoodCategoryId" = $1`;

export const searchFood = `SELECT
  fi."refFoodId",
  fi."refFoodName",
  fi."refPrice",
  fc."refFoodCategoryName"
FROM
  public."refFoodItem" fi
  LEFT JOIN public."refFoodCategory" fc ON CAST(fc."refFoodCategoryId" AS INTEGER) = fi."refCategoryId"::INTEGER
WHERE
  LOWER(
    CONCAT(
      fi."refFoodName",
      fi."refPrice",
      fc."refFoodCategoryName",
      fi."refMenuId"
    )
  ) LIKE '%' || LOWER($1) || '%' AND fi."refIfDelete" IS NOT true`;

export const addFood = `INSERT INTO public."refFoodItem" (
    "refFoodName",
    "refDescription",
    "refFoodImage",
    "refPrice",
    "refQuantity",
    "refCategoryId",
    "refAddOns",
    "refCreateAt",
    "refCreateBy",
    "refMenuId"
  ) 
  VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7::INTEGER[],
    $8,
    $9,$10
  )
  `;

export const deleteFood = `WITH "CountValue" AS (
  SELECT
    COUNT(*) AS count
  FROM public."refFoodCombo" fc
  WHERE (
    $1 = ANY (
      string_to_array(
        regexp_replace(fc."refFixedFood", '[{}]', '', 'g'),
        ','
      )::INTEGER[]
    )
    OR $1 = ANY (
      string_to_array(
        regexp_replace(fc."refMainDish", '[{}]', '', 'g'),
        ','
      )::INTEGER[]
    )
    OR $1 = ANY (
      string_to_array(
        regexp_replace(fc."refSideDish", '[{}]', '', 'g'),
        ','
      )::INTEGER[]
    )
  ) AND fc."refIfDelete" IS NOT TRUE
),
"UpdateResult" AS (
  UPDATE public."refFoodItem"
  SET "refIfDelete" = CASE
    WHEN "refIfDelete" IS NULL THEN true
    WHEN "refIfDelete" = false THEN true
    WHEN "refIfDelete" = true THEN false
  END
  WHERE "refFoodId" = $1 AND (
    SELECT count FROM "CountValue"
  ) = 0
  RETURNING 'Food Item Deleted Successfully' AS "message" , true AS "status"
  
)
SELECT * FROM "UpdateResult"
UNION ALL
SELECT 'The Food Item Is Already In Use. Remove from combos first.' AS "message" , false AS "status"
WHERE NOT EXISTS (SELECT 1 FROM "UpdateResult");`;

export const updateFood = `UPDATE public."refFoodItem"
SET
  "refFoodName" = $1,
  "refDescription" = $2,
  "refFoodImage" = $3,
  "refPrice" = $4,
  "refQuantity" = $5,
  "refCategoryId" = $6,
  "refAddOns" = $7::INTEGER[],
  "refUpdateAt" = $8,
  "refUpdateBy" = $9,
  "refMenuId" = $10
WHERE
  "refFoodId" = $11;`;

export const createCombo = `INSERT INTO
  public."refFoodCombo" (
    "refMenuId",
    "refComboName",
    "refComboImg",
    "refFixedFood",
    "refFixedQuantity",
    "refMainDish",
    "refMainDishLimit",
    "refSideDish",
    "refSideDishLimit",
    "refComboPrice",
    "refCreateAt",
    "refCreateBy"
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4::INTEGER[],
    $5::INTEGER[],
    $6::INTEGER[],
    $7,
    $8::INTEGER[],
    $9,
    $10,$11,$12
  )`;

export const FoodItemList = `SELECT
  f."refFoodId",
  f."refFoodName",
  f."refDescription",
  f."refFoodImage",
  f."refPrice",
  f."refQuantity",
  f."refMenuId",
  fc."refFoodCategoryName",
  (
    SELECT
      json_agg(
        json_build_object(
          'refFoodId', f1."refFoodId",
          'refMenuId', f1."refMenuId",
          'refFoodName', f1."refFoodName",
          'refDescription', f1."refDescription",
          'refFoodImage', f1."refFoodImage",
          'refPrice', f1."refPrice",
          'refQuantity', f1."refQuantity",
          'refFoodCategoryName', fc1."refFoodCategoryName"
        )
      )
    FROM
      public."refFoodItem" f1
    WHERE
      CAST(f1."refFoodId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(f."refAddOns", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
  ) AS "refAddOns"
FROM
  public."refFoodItem" f
  LEFT JOIN public."refFoodCategory" fc ON CAST(fc."refFoodCategoryId" AS INTEGER) = f."refCategoryId"::INTEGER
  LEFT JOIN public."refFoodItem" f1 ON CAST(f1."refFoodId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(f."refAddOns", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
  LEFT JOIN public."refFoodCategory" fc1 ON CAST (f1."refCategoryId" AS INTEGER) = fc1."refFoodCategoryId"
WHERE
  f."refIfDelete" IS NOT TRUE
ORDER BY
  f."refFoodId"`;

export const FoodList = `SELECT
  fi."refFoodId",
  fi."refFoodName",
  fi."refDescription",
  fi."refFoodImage",
  fi."refPrice",
  fi."refQuantity",
  fc."refFoodCategoryName",
  fi."refMenuId"
FROM
  public."refFoodItem" fi
  LEFT JOIN public."refFoodCategory" fc ON CAST(fc."refFoodCategoryId" AS INTEGER) = fi."refCategoryId"::INTEGER
WHERE
  fi."refIfDelete" IS NOT TRUE`;

export const ComboList = `SELECT * FROM public."refFoodCombo"
  WHERE "refIfDelete" IS NOT TRUE`;

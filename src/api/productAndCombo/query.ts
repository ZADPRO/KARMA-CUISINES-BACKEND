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
    "refMenuId",
    "restroId"
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
    $9,$10,
    $11
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

export const comboDelete = `UPDATE public."refFoodCombo"
SET "refIfDelete" = CASE
  WHEN "refIfDelete" IS NULL THEN true
  WHEN "refIfDelete" = false THEN true
  WHEN "refIfDelete" = true THEN false
END
WHERE "refComboId" = $1`;

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
    "refCreateBy",
    "refComboDescription",
    "restroId"
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
    $10,$11,$12,$13,$14
  )`;

export const FoodList = `SELECT
  fi."refFoodId",
  fi."refFoodName",
  fi."refDescription",
  fi."refFoodImage",
  fi."refPrice",
  fi."refQuantity",
  fc."refFoodCategoryName",
  fi."refMenuId",
  fi."restroId",
  vd."restroName"
FROM
  public."refFoodItem" fi
  LEFT JOIN public."refFoodCategory" fc ON CAST(fc."refFoodCategoryId" AS INTEGER) = fi."refCategoryId"::INTEGER
  INNER JOIN public."vendorDetails" vd ON vd.id = fi."restroId"
WHERE
  fi."refIfDelete" IS NOT TRUE`;

export const ComboList = `SELECT
  *
FROM
  public."refFoodCombo" rfc
 	INNER JOIN public."vendorDetails" vd ON vd.id = rfc."restroId"
WHERE
  "refIfDelete" IS NOT TRUE`;

export const menuIdCheck = `SELECT
  CASE
    WHEN (
      SELECT
        COUNT(*)
      FROM
        public."refFoodItem" fi
      WHERE
        fi."refMenuId" = $1 AND fi."refIfDelete" IS NOT true
    ) + (
      SELECT
        COUNT(*)
      FROM
        public."refFoodCombo" fc
      WHERE
        fc."refMenuId" = $1 AND fc."refIfDelete" IS NOT true
    ) > 0 THEN false
    ELSE true
  END `;

export const fetchOrderlist = `
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
ORDER BY ol."refUserId", uol."refCreateAt" DESC;
`;

export const getOrderData = `SELECT
  uol.*,
  json_agg(
    json_build_object(
      'refPaymentType',
      ol."refPaymentType",
      'refFoodName',
      ol."refFoodName",
      'refFoodCategory',
      ol."refFoodCategory",
      'refFoodPrice',
      ol."refFoodPrice",
      'refFoodQuantity',
      ol."refFoodQuantity",
      'refComments',
      ol."refComments",
      'refIfCombo',
      ol."refIfCombo",
      'subProduct',
      CASE
        WHEN ol."refIfCombo" = true THEN (
          SELECT
            json_agg(
              json_build_object(
                'refFoodName',
                sol."refFoodName",
                'refFoodQuantity',
                sol."refFoodQuantity",
                'refFoodType',
                sol."refFoodType"
              )
            )
          FROM
            public."refSubOrderList" sol
          WHERE
            sol."refOrderId" = ol."refOrderId"
        )
        ELSE NULL
      END
    )
  ) AS "order",
  SUM(ol."refFoodPrice"::NUMERIC) AS "TotalOrderPrice"
FROM
  public."refOrderList" ol
  LEFT JOIN public."refUserOrderList" uol ON CAST(uol."refUserId" AS INTEGER) = ol."refUserId"::INTEGER
WHERE
  ol."refCustOrId" = $1
GROUP BY
  uol."refUserId";`;

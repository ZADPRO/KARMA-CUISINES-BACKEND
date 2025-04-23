export const listFood = `SELECT
  fi."refFoodId",
  fi."refFoodName",
  fi."refDescription",
  fi."refFoodImage",
  fi."refPrice",
  fi."refQuantity",
  fi."refCategoryId",
  fc."refFoodCategoryName",
  fi."refMenuId",
  fc."refFoodCategoryName"
FROM
  public."refFoodItem" fi
  LEFT JOIN public."refFoodCategory" fc ON CAST(fc."refFoodCategoryId" AS INTEGER) = fi."refCategoryId"::INTEGER
WHERE
  fi."refIfDelete" IS NOT true
ORDER BY
  fi."refCategoryId"`;

export const comboList = `SELECT
  fc."refComboId",
  fc."refMenuId",
  fc."refComboName",
  fc."refComboImg",
  fc."refComboPrice",
  fc."refComboDescription"
FROM
  public."refFoodCombo" fc
WHERE
  fc."refIfDelete" IS NOT true`;

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
  f."refFoodId" = $1
GROUP BY
f."refFoodId",fc."refFoodCategoryName",fc1."refFoodCategoryName"
ORDER BY
  f."refFoodId"`;

export const comboFoodList = `SELECT
  rc."refComboId",
  rc."refMenuId",
  rc."refComboName",
  rc."refComboImg",
  rc."refComboPrice",
  rc."refComboDescription",
  rc."refFixedQuantity",
  rc."refMainDishLimit",
  rc."refSideDishLimit",
  (
    SELECT
      json_agg(
        json_build_object(
          'refFoodId',
          f1."refFoodId",
          'refMenuId',
          f1."refMenuId",
          'refFoodName',
          f1."refFoodName",
          'refDescription',
          f1."refDescription",
          'refFoodImage',
          f1."refFoodImage",
          'refPrice',
          f1."refPrice",
          'refQuantity',
          f1."refQuantity"
        )
      )
    FROM
      public."refFoodItem" f1
    WHERE
      CAST(f1."refFoodId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rc."refFixedFood", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
  ) AS "refFixedProduct",
  (
    SELECT
      json_agg(
        json_build_object(
          'refFoodId',
          f1."refFoodId",
          'refMenuId',
          f1."refMenuId",
          'refFoodName',
          f1."refFoodName",
          'refDescription',
          f1."refDescription",
          'refFoodImage',
          f1."refFoodImage",
          'refPrice',
          f1."refPrice",
          'refQuantity',
          f1."refQuantity"
        )
      )
    FROM
      public."refFoodItem" f1
    WHERE
      CAST(f1."refFoodId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rc."refMainDish", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
  ) AS "refMainProduct",
  (
    SELECT
      json_agg(
        json_build_object(
          'refFoodId',
          f1."refFoodId",
          'refMenuId',
          f1."refMenuId",
          'refFoodName',
          f1."refFoodName",
          'refDescription',
          f1."refDescription",
          'refFoodImage',
          f1."refFoodImage",
          'refPrice',
          f1."refPrice",
          'refQuantity',
          f1."refQuantity"
        )
      )
    FROM
      public."refFoodItem" f1
    WHERE
      CAST(f1."refFoodId" AS INTEGER) = ANY (
        string_to_array(
          regexp_replace(rc."refSideDish", '[{}]', '', 'g'),
          ','
        )::INTEGER[]
      )
  ) AS "refSideDish"
FROM
  public."refFoodCombo" rc
  LEFT JOIN public."refFoodItem" fi ON CAST(fi."refFoodId" AS INTEGER) = ANY (
    string_to_array(
      regexp_replace(rc."refFixedFood", '[{}]', '', 'g'),
      ','
    )::INTEGER[]
  )
WHERE
  rc."refComboId" = $1
GROUP BY
  rc."refComboId"`;

export const orderUserDetails = `INSERT INTO
  public."refUserOrderList" (
    "refUserFName",
    "refUserLName",
    "refUserMobile",
    "refUserEmail",
    "refUserStreet",
    "refUserPostCode",
    "refUserZone",
    "refUserCountry",
    "refCreateAt",
    "refCreateBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING
  *;`;

export const getOrderCount = `SELECT COUNT(*) AS "orderCount"  FROM public."refUserOrderList"`;

export const storeFoodOrder = `INSERT INTO
  public."refOrderList" (
    "refCustOrId",
    "refStoreId",
    "refUserId",
    "refFoodId",
    "refFoodName",
    "refFoodCategory",
    "refFoodPrice",
    "refFoodQuantity",
    "refIfCombo",
    "refTransactionId",
    "refPaymentType",
    "refFoodAmtPaid",
    "refCreateAt",
    "refCreateBy"
  )
values
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14
  )
RETURNING
  *;`;

export const storeSubFoodOrder = `INSERT INTO
  public."refSubOrderList" (
    "refOrderId",
    "refFoodName",
    "refFoodId",
    "refFoodQuantity",
    "refFoodType",
    "refCreateAt",
    "refCreateBy"
  )
values
  ($1, $2, $3, $4, $5, $6, $7)`;

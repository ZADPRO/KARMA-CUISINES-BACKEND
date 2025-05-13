export function sendOtpTemplate(clientName: string, otp: string) {
  const mail = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; }
          .container { max-width: 600px; background-color:rgba(254, 208, 165, 0.86); padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          .header { background-color:rgb(250, 126, 2); padding: 15px; text-align: center; border-radius: 8px 8px 0 0; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 20px; }
          .content p { font-size: 16px; line-height: 1.6; }
          .otp-box { font-size: 24px; font-weight: bold; text-align: center; padding: 10px; margin: 20px 0; background-color: #bbdefb; border: 1px dashed #42a5f5; border-radius: 8px; }
          .footer { text-align: center; padding: 10px; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Karma Cuisine</h1>
          </div>
          <div class="content">
            <p>${clientName},</p>
            <p>We have received a request to reset your password. Please use the following OTP to complete the process:</p>
            <div class="otp-box">${otp}</div>
            <p>Note: This OTP is valid for only **30 secs**. Please ensure to use it promptly.</p>
            <p>If you did not initiate this request, please contact us immediately.</p>
            <p>Best regards,<br>Director, Karma Cuisine</p>
          </div>
          <div class="footer">&copy; 2024 Karma Cuisine. All rights reserved.</div>
        </div>
      </body>
      </html>`;
  return mail;
}

export function sendOrderConfirmationTemplate(payload: any) {
  const {
    userFName,
    userLName,
    userMobile,
    userEmail,
    userStreet,
    userPostalCode,
    userZone,
    userCountry,
    storeId,
    transactionId,
    itemComment,
    floor,
    guestMobile,
    guestName,
    paymentType,
    totalAmtPaid,
    order,
  } = payload;

  const fullName = `${userFName} ${userLName}`;
  const address = `${userStreet}${
    floor ? `, ${floor}` : ""
  }, ${userPostalCode} ${userZone}, ${userCountry}`;

  const orderItems = order
    .map((item: any) => {
      if (item.ifCambo) {
        const subItems = item.subProduct
          .map(
            (sub: any) => `
        <li><strong>${sub.foodType}</strong>: ${sub.FoodName} x ${sub.foodQuantity}</li>
      `
          )
          .join("");
        return `
        <tr>
          <td><strong>${item.FoodName}</strong><br><ul>${subItems}</ul></td>
          <td>${item.foodCategory}</td>
          <td>CHF ${item.foodPrice}</td>
            <td>${item.comment ? `${item.comment}` : "-"}</td>
        </tr>
      `;
      } else {
        return `
          <tr>
            <td>${item.FoodName}</td>
            <td>${item.foodCategory}</td>
            <td>CHF ${item.foodPrice}</td>
            <td>${item.comment ? `${item.comment}` : "-"}</td>
          </tr>
        `;
      }
    })
    .join("");

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Order Confirmation - Karma Cuisine</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
      .container { max-width: 700px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .header { background-color: #fa7e02; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; color: white; }
      .header h2 { margin: 0; }
      .section { padding: 20px; }
      .section h3 { margin-top: 0; color: #fa7e02; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      table, th, td { border: 1px solid #ddd; }
      th, td { padding: 10px; text-align: left; }
      .footer { text-align: center; padding: 10px; font-size: 14px; color: #777; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Thank you for your order, ${fullName}!</h2>
        <p>Order Confirmation from Karma Cuisine</p>
      </div>

      <div class="section">
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Mobile:</strong> +${userMobile}</p>
        <p><strong>Address:</strong> ${address}</p>
      </div>

      <div class="section">
        <h3>Order Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            ${orderItems}
          </tbody>
        </table>
        <p style="margin-top: 15px;">
          <strong>${
            paymentType === "offline" ? "Amount to Pay" : "Total Paid"
          }:</strong> CHF ${totalAmtPaid}
        </p>        
        <p style="margin-top: 15px;"><strong>Additional Notes:</strong> ${itemComment}</p>
        <p><strong>Payment Type:</strong> ${paymentType}</p>

        ${guestName ? `<p><strong>Guest Name:</strong> ${guestName}</p>` : ""}
        ${
          guestMobile
            ? `<p><strong>Guest Mobile:</strong> ${guestMobile}</p>`
            : ""
        }

        <p><strong>Store ID:</strong> KC-00${storeId}</p>
        <p><strong>Store Name:</strong> Kings Kurry </p>
      </div>

      <div class="footer">
        &copy; 2025 Karma Cuisine. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
}

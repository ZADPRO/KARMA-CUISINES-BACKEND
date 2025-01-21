// export function sendOtpTemplate(clientName: string, otp: string) {
//   const mail = `<!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>OTP Verification</title>
//         <style>
//           body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; }
//           .container { max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
//           .header { background-color: #ff7043; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; color: #ffffff; }
//           .header h1 { margin: 0; font-size: 24px; }
//           .content { padding: 20px; }
//           .content p { font-size: 16px; line-height: 1.6; }
//           .otp-box { font-size: 24px; font-weight: bold; text-align: center; padding: 10px; margin: 20px 0; background-color: #ffe0b2; border: 1px dashed #ff7043; border-radius: 8px; }
//           .footer { text-align: center; padding: 10px; font-size: 14px; color: #666; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Ublis Yogo</h1>
//           </div>
//           <div class="content">
//             <p>Dear ${clientName},</p>
//             <p>We have received a request to verify your identity. Please use the following OTP to complete the process:</p>
//             <div class="otp-box">${otp}</div>
//             <p>Note: This OTP is valid for only **1 minute**. Please ensure to use it promptly.</p>
//             <p>If you did not initiate this request, please contact us immediately.</p>
//             <p>Best regards,<br>Director, Ublis Yogo</p>
//           </div>
//           <div class="footer">&copy; 2024 Ublis Yogo. All rights reserved.</div>
//         </div>
//       </body>
//       </html>`;
//   return mail;
// }

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

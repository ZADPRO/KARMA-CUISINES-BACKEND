import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILID,
    pass: process.env.PASSWORD,
  },
});

/**
 * Sends an email using Nodemailer.
 * @param {MailOptions} mailOptions - Options for the email.
 */
export const sendEmail = async (
  mailOptions: MailOptions,
  retries = 3,
  delayMs = 2000
): Promise<void> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await transporter.sendMail({
        from: process.env.EMAILID,
        ...mailOptions,
      });
      console.log(`Email sent successfully on attempt ${attempt}`);
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt === retries) {
        console.error("All retry attempts failed. Email was not sent.");
        throw error; // Let caller know it ultimately failed
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

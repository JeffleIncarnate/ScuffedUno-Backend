import nodemailer from "nodemailer";

/**
 * This is a function to send an email with nodemailer
 * @param recipient Recipient email
 * @param subject Subect of email
 * @param html Html in email
 * @param text Test in email
 * @returns Promise<boolean>
 */
async function sendEmail(
   recipient: string,
   subject: string,
   html: string | null = null,
   text: string | null = null,
): Promise<boolean> {
   const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASSWORD,
      },
   });

   try {
      await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to: recipient,
         subject: subject,
         text: text ?? "",
         html: html ?? "",
      });

      return true;
   } catch (err) {
      throw new Error("Common nodemailer L");
   }
}

export { sendEmail };

import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Send a password reset email to the recipient from the sender, 
 * incorporating the passed in content. 
 */
export default async function sendResetEmail(
  sender: string, recipient: string, content: string) {
  
  let responseInfo = await transporter.sendMail({
    from: sender, 
    to: recipient, 
    subject: "SillyPoint Password Reset", 
    text: `Password Reset: ${content}`, 
    html: `<h1>Password Reset: ${content}</h1>`, 
  });
  return responseInfo;
}
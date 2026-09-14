import { Resend } from "resend";
import { AppError } from "./appError";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const data = await resend.emails.send({
      from: "LMS Support <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error("Email send error detail:", error);
    throw new AppError("Failed to send email. Please try again later.", 500);
  }
};

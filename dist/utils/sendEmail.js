"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const resend_1 = require("resend");
const appError_1 = require("./appError");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendEmail = async ({ to, subject, html }) => {
    try {
        const data = await resend.emails.send({
            from: "LMS Support <onboarding@resend.dev>",
            to: [to],
            subject,
            html,
        });
        return data;
    }
    catch (error) {
        console.error("Email send error detail:", error);
        throw new appError_1.AppError("Failed to send email. Please try again later.", 500);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map